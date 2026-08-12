import "server-only";
import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify, errors as joseErrors } from "jose";
import { env } from "@/lib/env";

export type SignedLinkKind = "continuation" | "reentry";

const DEFAULT_EXPIRY_SECONDS = 60 * 60 * 24 * 14; // 14 days

function getSecretKey(): Uint8Array {
  if (!env.SIGNED_LINK_SECRET) {
    throw new Error("SIGNED_LINK_SECRET is not configured; cannot sign or verify links.");
  }
  return new TextEncoder().encode(env.SIGNED_LINK_SECRET);
}

export interface CreatedSignedLink {
  token: string;
  jti: string;
  expiresAt: Date;
}

/**
 * Signs a short-lived, single-purpose, single-use JWT for the
 * continuation/re-entry email links (Step 10). The token itself only
 * proves identity + intent — it is never trusted alone for entitlement;
 * every verification also re-checks the real Guide-ownership record and
 * claims the jti exactly once via signedLinkUses' unique index.
 */
export async function createSignedLink(
  contactId: string,
  kind: SignedLinkKind,
  expiresInSeconds = DEFAULT_EXPIRY_SECONDS,
): Promise<CreatedSignedLink> {
  const jti = randomUUID();
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);

  const token = await new SignJWT({ contactId, kind })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSecretKey());

  return { token, jti, expiresAt };
}

export interface VerifiedSignedLink {
  contactId: string;
  kind: SignedLinkKind;
  jti: string;
  expiresAt: Date;
}

export class SignedLinkError extends Error {
  constructor(
    message: string,
    public readonly code: "expired" | "invalid" | "wrong_purpose",
  ) {
    super(message);
    this.name = "SignedLinkError";
  }
}

/**
 * Verifies signature + expiry + purpose. Does NOT check single-use or
 * Guide ownership — callers must do that via consumeSignedLink, which
 * wraps this and does both against the database.
 */
export async function verifySignedLinkToken(
  token: string,
  expectedKind: SignedLinkKind,
): Promise<VerifiedSignedLink> {
  let payload;
  try {
    const result = await jwtVerify(token, getSecretKey());
    payload = result.payload;
  } catch (error) {
    if (error instanceof joseErrors.JWTExpired) {
      throw new SignedLinkError("This link has expired.", "expired");
    }
    throw new SignedLinkError("This link is invalid.", "invalid");
  }

  if (
    typeof payload.contactId !== "string" ||
    typeof payload.jti !== "string" ||
    typeof payload.exp !== "number" ||
    (payload.kind !== "continuation" && payload.kind !== "reentry")
  ) {
    throw new SignedLinkError("This link is invalid.", "invalid");
  }

  if (payload.kind !== expectedKind) {
    throw new SignedLinkError(`This link is for "${payload.kind}", not "${expectedKind}".`, "wrong_purpose");
  }

  return {
    contactId: payload.contactId,
    kind: payload.kind,
    jti: payload.jti,
    expiresAt: new Date(payload.exp * 1000),
  };
}
