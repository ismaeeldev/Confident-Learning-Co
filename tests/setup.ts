import { existsSync } from "node:fs";
import path from "node:path";
import { afterAll, afterEach, beforeAll } from "vitest";
import "@testing-library/jest-dom/vitest";
import { mswServer } from "./mocks/server";

const envLocalPath = path.resolve(__dirname, "../.env.local");
if (existsSync(envLocalPath)) {
  process.loadEnvFile(envLocalPath);
}

process.env.SIGNED_LINK_SECRET ??= "test-signed-link-secret";
process.env.CIRCLE_INSIDE_LOOP_SPACE_GROUP_ID ??= "test-space-group-id";
process.env.CRON_SECRET ??= "test-cron-secret";

// "bypass" (not "error"): the integration test suite intentionally hits a
// real Neon dev database over HTTP, which MSW would otherwise also try to
// intercept globally. Kit contract tests still get real interception
// because they target the fixed KIT_TEST_BASE_URL handlers explicitly.
beforeAll(() => mswServer.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

