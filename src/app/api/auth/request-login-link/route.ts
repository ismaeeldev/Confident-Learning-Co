import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { loginRequestSchema } from "@/domain/auth/schemas";
import { requestLoginLink } from "@/domain/auth/requestLoginLink";

/**
 * Requests a magic sign-in link (Phase 3). Enumeration-safe by design: this
 * always returns the same 200 response whether or not the email is
 * registered, and takes the same rough amount of time either way (the DB
 * lookup runs regardless — only the email send is skipped when there's no
 * matching contact) so a timing side-channel doesn't leak the answer.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = loginRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await requestLoginLink(db, parsed.data.email, parsed.data.next);

  return NextResponse.json({ success: true }, { status: 200 });
}
