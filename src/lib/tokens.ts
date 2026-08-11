import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

function getSecretKey() {
  if (!env.SIGNED_LINK_SECRET) {
    throw new Error("SIGNED_LINK_SECRET is not configured");
  }
  return new TextEncoder().encode(env.SIGNED_LINK_SECRET);
}

export interface SignedLinkPayload {
  jti: string;
  contactId: string;
  kind: "continuation" | "reentry";
}

export async function signLinkToken(
  payload: SignedLinkPayload,
  expiresInSeconds: number,
): Promise<string> {
  return new SignJWT({ contactId: payload.contactId, kind: payload.kind })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(payload.jti)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(getSecretKey());
}

export async function verifyLinkToken(token: string): Promise<SignedLinkPayload> {
  const { payload } = await jwtVerify(token, getSecretKey());
  return {
    jti: payload.jti as string,
    contactId: payload.contactId as string,
    kind: payload.kind as "continuation" | "reentry",
  };
}
