import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { env } from "@/lib/env";

type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Correlation ID context — lets every logger.* call within a request
 * automatically carry the same requestId without threading it through
 * every function signature by hand. Wrap a route handler body in
 * withRequestId() once; explicit `fields.requestId` on any individual
 * call still takes precedence if a caller needs to override it.
 */
const requestContext = new AsyncLocalStorage<{ requestId: string }>();

export function withRequestId<T>(requestId: string, fn: () => T): T {
  return requestContext.run({ requestId }, fn);
}

export function getCurrentRequestId(): string | undefined {
  return requestContext.getStore()?.requestId;
}

const REDACTED = "[redacted]";

/** Keys that must never appear in logs in plain text. */
const SENSITIVE_KEYS = new Set([
  "apiKey",
  "api_key",
  "secret",
  "webhookSecret",
  "webhook_secret",
  "password",
  "token",
  "authorization",
  "cardNumber",
  "card_number",
  "childName",
  "child_name",
  "childFirstName",
  "child_first_name",
]);

export interface LogFields {
  requestId?: string;
  eventId?: string;
  provider?: string;
  action?: string;
  contactId?: string;
  purchaseId?: string;
  accessGrantId?: string;
  subscriptionId?: string;
  attempt?: number;
  status?: string;
  errorCode?: string;
  safeErrorMessage?: string;
  durationMs?: number;
  [key: string]: unknown;
}

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        SENSITIVE_KEYS.has(key) ? REDACTED : redact(val),
      ]),
    );
  }
  return value;
}

const levelRank: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function log(level: LogLevel, message: string, fields: LogFields = {}) {
  if (levelRank[level] < levelRank[env.LOG_LEVEL]) return;
  const contextRequestId = requestContext.getStore()?.requestId;
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(contextRequestId ? { requestId: contextRequestId } : {}),
    ...(redact(fields) as LogFields),
  };
  const serialized = JSON.stringify(entry);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.log(serialized);
}

export const logger = {
  debug: (message: string, fields?: LogFields) => log("debug", message, fields),
  info: (message: string, fields?: LogFields) => log("info", message, fields),
  warn: (message: string, fields?: LogFields) => log("warn", message, fields),
  error: (message: string, fields?: LogFields) => log("error", message, fields),
};
