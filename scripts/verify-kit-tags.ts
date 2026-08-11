/**
 * Manual verification report for Step 6 (Kit): confirms every launch-critical
 * tag has a Kit tag ID configured, and reports which are still missing so
 * they can't silently no-op in production.
 *
 * Usage: npm run verify:kit-tags
 */
import { verifyKitTagMapping } from "@/config/kitTagIds";
import { env } from "@/lib/env";

function main() {
  const report = verifyKitTagMapping();

  console.log("Kit tag ID mapping report");
  console.log("==========================");
  console.log(`KIT_SYNC_ENABLED: ${env.KIT_SYNC_ENABLED}`);
  console.log(`KIT_API_BASE_URL: ${env.KIT_API_BASE_URL ?? "(default: https://api.kit.com/v4)"}`);
  console.log(`KIT_API_SECRET set: ${env.KIT_API_SECRET ? "yes" : "no"}`);
  console.log("");
  console.log(`Configured tags (${report.configured.length}):`);
  for (const tag of report.configured) console.log(`  ✓ ${tag}`);
  console.log("");

  if (report.missing.length > 0) {
    console.log(`Missing tags (${report.missing.length}):`);
    for (const tag of report.missing) console.log(`  ✗ ${tag} — set the matching KIT_TAG_*_ID env var`);
    console.log("");
    console.log(
      "Result: FAIL — do not enable KIT_SYNC_ENABLED in production until every tag above is mapped.",
    );
    process.exitCode = 1;
    return;
  }

  if (env.KIT_SYNC_ENABLED && !env.KIT_API_SECRET) {
    console.log("Result: FAIL — KIT_SYNC_ENABLED is true but KIT_API_SECRET is not set.");
    process.exitCode = 1;
    return;
  }

  console.log("Result: PASS — every launch-critical tag has a configured Kit tag ID.");
}

main();
