import "server-only";
import { randomUUID } from "node:crypto";
import type {
  CommunityProvider,
  CircleMember,
  InviteMemberInput,
  GrantAccessInput,
  RevokeAccessInput,
  InspectAccessInput,
} from "./types";

export function createMockCommunityProvider(): CommunityProvider {
  const membersByEmail = new Map<string, CircleMember>();
  const accessByMember = new Set<string>();

  return {
    async findMemberByEmail(email) {
      return membersByEmail.get(email) ?? null;
    },
    async inviteMember(input: InviteMemberInput) {
      const existing = membersByEmail.get(input.email);
      if (existing) {
        accessByMember.add(`${existing.id}:${input.spaceGroupId}`);
        return existing;
      }
      // randomUUID rather than a counter — same reasoning as the Kit mock.
      const member: CircleMember = { id: `mock-member-${randomUUID()}`, email: input.email };
      membersByEmail.set(input.email, member);
      // Matches the real client: inviting a member passes space_group_ids
      // in the same call, so the invite itself grants access.
      accessByMember.add(`${member.id}:${input.spaceGroupId}`);
      return member;
    },
    async grantAccess(input: GrantAccessInput) {
      accessByMember.add(`${input.memberId}:${input.spaceGroupId}`);
    },
    async revokeAccess(input: RevokeAccessInput) {
      accessByMember.delete(`${input.memberId}:${input.spaceGroupId}`);
    },
    async inspectAccess(input: InspectAccessInput) {
      return { hasAccess: accessByMember.has(`${input.memberId}:${input.spaceGroupId}`) };
    },
    async listSpaceGroupMembers(spaceGroupId: string) {
      const membersById = new Map(
        Array.from(membersByEmail.values()).map((member) => [member.id, member]),
      );
      const members: CircleMember[] = [];
      for (const key of accessByMember) {
        const [memberId, groupId] = key.split(":");
        if (groupId !== spaceGroupId) continue;
        const member = membersById.get(memberId);
        if (member) members.push(member);
      }
      return members;
    },
  };
}
