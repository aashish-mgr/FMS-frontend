
export interface loginData {
    userEmail: string,
    userPassword: string
}

export interface RegisterData {
  workspaceName: string;
  userName: string;
  userEmail: string;
  userPassword: string;
}

export interface ForgotPasswordData {
  userEmail: string;
}

export interface ResetPasswordData {
  token: string;
  userPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface VerifyEmailResponse {
  userId: string;
  emailVerifiedAt: string;
}

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";

export interface AuthTenant {
  id: string;
  name: string;
  slug: string;
  status: "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED";
  plan: string;
}

export interface AuthUser {
  id: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  emailVerifiedAt?: string | null;
  role?: string | null;
  roles?: string[];
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
  tenant: AuthTenant;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse,loginData> ({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                data: body
            }) 
        }),
        register: builder.mutation<LoginResponse, RegisterData>({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                data: body
            })
        }),
        logout: builder.mutation<{message: string},void> ({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        }),
        logoutAll: builder.mutation<{message: string},void> ({
            query: () => ({
                url: "/auth/logout-all",
                method: "POST"
            })
        }),
        forgotPassword: builder.mutation<void, ForgotPasswordData>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                data: body
            })
        }),
        resetPassword: builder.mutation<void, ResetPasswordData>({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                data: body
            })
        }),
        changePassword: builder.mutation<void, ChangePasswordData>({
            query: (body) => ({
                url: "/auth/change-password",
                method: "POST",
                data: body
            })
        }),
        verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailData>({
            query: (body) => ({
                url: "/auth/verify-email",
                method: "POST",
                data: body
            })
        }),
        resendVerification: builder.mutation<{ emailSent: boolean }, void>({
            query: () => ({
                url: "/auth/resend-verification",
                method: "POST"
            })
        }),

    })
}) 


export const {
    useLoginMutation,
    useLogoutMutation,
    useLogoutAllMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useVerifyEmailMutation,
    useResendVerificationMutation,
}= authApi;
