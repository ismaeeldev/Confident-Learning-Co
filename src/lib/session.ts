import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

/**
 * Member session cookie (Phase 3 of the V2 build guide). Deliberately
 * separate from src/lib/signedLinks.ts: a signed link is a short-lived,
 * single-use proof of intent used once to establish who someone is; a
 * session is the longer-lived "this browser has proven it controls
 * contactId X" state that follows, stored as a signed (not encrypted —
 * it holds no secret, only a contact id) JWT in an HttpOnly cookie.
 *
 * The JWT sign/verify logic is kept separate from the cookie read/write
 * calls (same split as signedLinks.ts's pure functions vs. its callers'
 * cookie/redirect handling) specifically so it's testable without a real
 * Next.js request context — next/headers' cookies() throws outside one,
 * and this project has no existing mock for it.
 */
const SESSION_COOKIE_NAME = "cl_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days — "sensible session length" per Annexe B

function getSessionSecretKey(): Uint8Array {
  if (!env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not configured; cannot create or verify sessions.");
  }
  return new TextEncoder().encode(env.SESSION_SECRET);
}

/** Pure: signs a session JWT for the given contact. No cookie access, safe to unit test. */
export async function signSessionToken(contactId: string): Promise<string> {
  return new SignJWT({ contactId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS)
    .sign(getSessionSecretKey());
}

/** Pure: verifies a session JWT and returns the contact id, or null if missing/expired/invalid. Never throws. No cookie access, safe to unit test. */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecretKey());
    if (typeof payload.contactId !== "string") return null;
    return payload.contactId;
  } catch {
    return null;
  }
}

/** Signs a session JWT and sets it as an HttpOnly, Secure, SameSite=Lax cookie. */
export async function createSession(contactId: string): Promise<void> {
  const token = await signSessionToken(contactId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.APP_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/** Reads and verifies the session cookie for the current request. Returns null for every failure mode — callers treat them all as simply "not signed in". */
export async function getSessionContactId(): Promise<string | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

/** Ends the session — clears the cookie so the same browser tab immediately loses members-only access. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
