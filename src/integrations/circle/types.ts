export interface CircleMember {
  id: string;
  email: string;
}

export interface InviteMemberInput {
  email: string;
  firstName?: string;
  spaceGroupId: string;
}

export interface GrantAccessInput {
  memberId: string;
  spaceGroupId: string;
}

export interface RevokeAccessInput {
  memberId: string;
  spaceGroupId: string;
}

export interface InspectAccessInput {
  memberId: string;
  spaceGroupId: string;
}

export interface AccessInspection {
  hasAccess: boolean;
}

export interface CommunityProvider {
  findMemberByEmail(email: string): Promise<CircleMember | null>;
  inviteMember(input: InviteMemberInput): Promise<CircleMember>;
  grantAccess(input: GrantAccessInput): Promise<void>;
  revokeAccess(input: RevokeAccessInput): Promise<void>;
  /** Checks whether a member currently has access to a specific space group — used by reconciliation. */
  inspectAccess(input: InspectAccessInput): Promise<AccessInspection>;
  /** Lists every member currently holding access to a space group — used by reconciliation to find "extra" access we no longer expect. */
  listSpaceGroupMembers(spaceGroupId: string): Promise<CircleMember[]>;
}
