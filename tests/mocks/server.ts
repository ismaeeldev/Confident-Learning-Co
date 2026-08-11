import { setupServer } from "msw/node";
import { kitHandlers } from "./kit-handlers";
import { circleHandlers } from "./circle-handlers";

export const mswServer = setupServer(...kitHandlers, ...circleHandlers);
