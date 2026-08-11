import { http, HttpResponse } from "msw";

/**
 * Sanitized fake Circle Admin API v2 responses for contract-testing
 * src/integrations/circle/client.ts. No real Circle data or credentials.
 */
export const CIRCLE_TEST_BASE_URL = "https://circle.test/api/admin/v2";

export const circleHandlers = [
  http.get(`${CIRCLE_TEST_BASE_URL}/community_members`, ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (email === "known@example.invalid") {
      return HttpResponse.json({
        community_members: [{ id: 7, email: "known@example.invalid" }],
      });
    }
    return HttpResponse.json({ community_members: [] });
  }),

  http.post(`${CIRCLE_TEST_BASE_URL}/community_members`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    return HttpResponse.json({ id: 99, email: body.email }, { status: 201 });
  }),

  http.post(`${CIRCLE_TEST_BASE_URL}/community_members/:memberId/space_groups/:spaceGroupId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${CIRCLE_TEST_BASE_URL}/community_members/:memberId/space_groups/:spaceGroupId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${CIRCLE_TEST_BASE_URL}/community_members/:memberId/space_groups/:spaceGroupId`, ({ params }) => {
    if (params.memberId === "7") {
      return HttpResponse.json({ has_access: true }, { status: 200 });
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.get(`${CIRCLE_TEST_BASE_URL}/space_groups/:spaceGroupId/members`, () => {
    return HttpResponse.json({
      community_members: [
        { id: 7, email: "known@example.invalid" },
        { id: 8, email: "unexpected@example.invalid" },
      ],
    });
  }),
];
