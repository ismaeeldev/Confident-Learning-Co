import { http, HttpResponse } from "msw";

/**
 * Sanitized fake Kit v4 API responses for contract-testing
 * src/integrations/kit/client.ts. No real Kit data or credentials.
 */
export const KIT_TEST_BASE_URL = "https://kit.test/v4";

export const kitHandlers = [
  http.post(`${KIT_TEST_BASE_URL}/subscribers`, async ({ request }) => {
    const body = (await request.json()) as { email_address: string };
    return HttpResponse.json(
      { subscriber: { id: 42, email_address: body.email_address } },
      { status: 200 },
    );
  }),

  http.post(`${KIT_TEST_BASE_URL}/tags/:tagId/subscribers`, () => {
    return HttpResponse.json({ subscriber: { id: 42 } }, { status: 200 });
  }),

  http.delete(`${KIT_TEST_BASE_URL}/subscribers/:subscriberId/tags/:tagId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
