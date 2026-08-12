# Release Notes

## Status: Not yet launched — pre-launch audit pass (Step 13, code/doc-level only)

This document tracks release readiness for The Confident Learning Co. hybrid platform. It is updated as part of Step 13 (Final QA, Production Launch, and Client Handover). As of this pass, **production launch has not occurred** — see "Known limitations / launch blockers" below.

## What's built

See `confident-learning-hybrid-build-playbook/PROJECT_STATUS.md` for the full step-by-step status table and `confident-learning-hybrid-build-playbook/templates/ScopeTraceabilityMatrix.md` for a requirement-to-evidence mapping. In summary: public website (7 pages), 8 launch articles with SEO/legal pages, ScoreApp reflection quiz, Kit nurture sequences, Circle paywalled community, Stripe Guide purchase + membership/re-entry flows, 30-day lifecycle webhooks, forms with rate-limiting/honeypot, and observability (health check, structured logging, consent-gated analytics) are all implemented and covered by automated tests.

## Known limitations (as of this pass)

- **Step 12 (Responsive/Motion Polish) is blocked**: real client photography, video, and logo assets have not been supplied. The client has explicitly chosen to wait for real assets rather than doing a partial polish pass now. The site currently runs on labeled placeholders for these.
- **Client sign-off / approvals (Step 13.1) not yet obtained**: this pass covers only the automated/code/doc-level Step 13 deliverables, not client design/content/legal/integration/payment approval.
- **Controlled production launch (Step 13.3) has not occurred**: no feature flags have been enabled in production, no production transaction has been run.
- **Final Guide PDF not yet supplied by client**: the fulfilment email link for the Parent Guide purchase remains a placeholder until the client provides the actual file/delivery link.
- **Legal review pending**: the 4 legal pages (Privacy, Terms, Cookies, Refund Policy) are drafted to match this build's actual data flows but are explicitly marked "pending legal review" on every page and must not go live without sign-off from a qualified legal adviser.
- **Newsletter consent checkbox copy is draft**: pending client approval, same convention as the legal pages.
- **Resend not yet configured**: `RESEND_API_KEY` is unset, so the Reset-enquiry admin notification email safely no-ops (logs only, does not send). Form submissions are still stored regardless.
- **Microsoft Clarity not yet configured**: `NEXT_PUBLIC_CLARITY_PROJECT_ID` is unset, so Clarity tracking stays inactive even when a visitor consents to analytics. Client has indicated this ID is coming.
- **`ADMIN_ALERT_EMAIL` not yet set**: client has the real address and was told to add it directly.
- **Kit double opt-in setting unverified**: whether Kit's double opt-in confirmation email is blocking full nurture-sequence delivery has not been checked this pass.
- **Vercel Hobby plan cron limits**: the integration-job processor cron (`/api/cron/process-integration-jobs`) is scheduled once/day under the current Hobby plan. This means a real purchaser could wait up to 24 hours for their Kit tags/Circle access to be granted. Upgrading to Vercel Pro (cron as often as every 5–15 min) is recommended before real-money launch.
- **Day 29 reminder remains disabled**: per DEC-004, this is required but the client has not yet supplied final copy; left undone intentionally, matching Step 9's own instruction.
- **Circle real-payload webhook fix**: confirmed correct against a live Circle test send, but per PROJECT_STATUS.md Step 7 row, verify this fix is committed/deployed to the live Vercel deployment before relying on it in production (the currently-live deployment may still run older logic — reconfirm before cutover).

## Launch blockers (must clear before Step 13.1–13.3 can proceed)

1. Real photography/video/logo assets (Step 12).
2. Client sign-off/approvals on design, content, legal, integration, payment/access (Step 13.1).
3. Final Guide PDF from client.
4. Legal review sign-off on the 4 legal pages.
5. Kit domain/double opt-in confirmation.

## Automated check results (this pass)

- `npm run typecheck` — pass
- `npm run lint` — pass
- `npm run build` — pass
- `npm test` — see `PROJECT_STATUS.md` Step 13 section for result

No application source code was modified during this audit pass.
