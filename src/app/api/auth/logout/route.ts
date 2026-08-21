import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
import { env } from "@/lib/env";
import { PUBLIC_ROUTES } from "@/config/canon";

/** Ends the current session (Phase 3). POST-only — a logout must never happen from a GET link/prefetch. */
export async function POST() {
  await destroySession();
  return NextResponse.redirect(`${env.NEXT_PUBLIC_SITE_URL}${PUBLIC_ROUTES.home}`, { status: 303 });
}
