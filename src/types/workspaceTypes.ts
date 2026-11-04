import type { AuthTenant, AuthUser } from "../store/api/authApi";

export type AssignableRole = "admin" | "accountant";

export type WorkspaceInvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REVOKED"
  | "EXPIRED";

export interface WorkspaceSettings {
  currency?: string;
  timezone?: string;
  [key: string]: unknown;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  status: AuthTenant["status"];
  plan: string;
  trialEndsAt: string | null;
  settings: WorkspaceSettings | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface WorkspaceMember {
  id: string;
  userName: string;
  userEmail: string;
  roles: string[];
  createdAt: string;
}

export interface WorkspaceInvitation {
  id: string;
  email: string;
  role: AssignableRole | string;
  status: WorkspaceInvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  invitedBy: { id: string; userName: string } | null;
  token?: string;
  acceptUrl?: string;
  emailSent?: boolean;
}

export interface CreatedInvitation extends WorkspaceInvitation {
  token: string;
  acceptUrl: string;
  emailSent: boolean;
}

export interface InvitationDetails {
  email: string;
  workspace: { id: string; name: string };
  role: string;
  expiresAt: string;
}

export interface CreateInvitationInput {
  userEmail: string;
  roleName: AssignableRole;
}

export interface UpdateWorkspaceInput {
  name?: string;
  settings?: {
    currency?: string;
    timezone?: string;
  };
}

export interface AcceptInvitationInput {
  token: string;
  userName: string;
  userPassword: string;
}

export interface AcceptInvitationResponse {
  accessToken: string;
  user: AuthUser;
  tenant: AuthTenant;
}
