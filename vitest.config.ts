import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server-only": path.resolve(__dirname, "./tests/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/integration/**/*.test.{ts,tsx}",
      "tests/contract/**/*.test.{ts,tsx}",
    ],
    css: false,
    testTimeout: 15000,
    // The integration/contract suites hit a real Neon dev database. Running
    // test files in parallel (Vitest's default) can exceed the database's
    // concurrent-connection limit and fail tests with a connection-permit
    // error that has nothing to do with the code under test — sequential
    // file execution trades some wall-clock time for reliability here.
    fileParallelism: false,
  },
});
