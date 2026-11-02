import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type {
  AcceptInvitationInput,
  AcceptInvitationResponse,
  CreateInvitationInput,
  InvitationDetails,
  UpdateWorkspaceInput,
  WorkspaceInvitation,
  WorkspaceMember,
  WorkspaceSummary,
} from "../../types/workspaceTypes";

export const workspaceApi = createApi({
  reducerPath: "workspaceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Workspace", "Members", "Invitations"],
  endpoints: (builder) => ({
    getWorkspace: builder.query<WorkspaceSummary, void>({
      query: () => ({
        url: "/workspace",
        method: "GET",
      }),
      providesTags: ["Workspace"],
    }),

    updateWorkspace: builder.mutation<WorkspaceSummary, UpdateWorkspaceInput>({
      query: (body) => ({
        url: "/workspace",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["Workspace"],
    }),

    getMembers: builder.query<WorkspaceMember[], void>({
      query: () => ({
        url: "/workspace/members",
        method: "GET",
      }),
      providesTags: ["Members"],
    }),

    getAssignableRoles: builder.query<string[], void>({
      query: () => ({
        url: "/workspace/roles",
        method: "GET",
      }),
    }),

    updateMemberRole: builder.mutation<
      WorkspaceMember,
      { userId: string; roleName: string }
    >({
      query: ({ userId, roleName }) => ({
        url: `/workspace/members/${userId}`,
        method: "PATCH",
        data: { roleName },
      }),
      invalidatesTags: ["Members"],
    }),

    removeMember: builder.mutation<{ id: string }, string>({
      query: (userId) => ({
        url: `/workspace/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Members"],
    }),

    getInvitations: builder.query<WorkspaceInvitation[], void>({
      query: () => ({
        url: "/workspace/invitations",
        method: "GET",
      }),
      providesTags: ["Invitations"],
    }),

    createInvitation: builder.mutation<
      WorkspaceInvitation & { token: string },
      CreateInvitationInput
    >({
      query: (body) => ({
        url: "/workspace/invitations",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Invitations"],
    }),

    revokeInvitation: builder.mutation<WorkspaceInvitation, string>({
      query: (invitationId) => ({
        url: `/workspace/invitations/${invitationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invitations"],
    }),

    getInvitationByToken: builder.query<InvitationDetails, string>({
      query: (token) => ({
        url: `/auth/invitations/${encodeURIComponent(token)}`,
        method: "GET",
      }),
    }),

    acceptInvitation: builder.mutation<
      AcceptInvitationResponse,
      AcceptInvitationInput
    >({
      query: (body) => ({
        url: "/auth/accept-invitation",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useGetWorkspaceQuery,
  useUpdateWorkspaceMutation,
  useGetMembersQuery,
  useGetAssignableRolesQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useGetInvitationsQuery,
  useCreateInvitationMutation,
  useRevokeInvitationMutation,
  useGetInvitationByTokenQuery,
  useAcceptInvitationMutation,
} = workspaceApi;
