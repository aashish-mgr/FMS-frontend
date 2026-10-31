

export interface loginData {
    userEmail: string,
    userPassword: string
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
  role?: string | null;
  roles?: string[];
}


interface LoginResponse {
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
        logout: builder.mutation<{message: string},void> ({
            query: () => ({
                url: "/auth/logout",
                method: "POST"
            })
        }),

    })
}) 


export const {useLoginMutation, useLogoutMutation}= authApi;


