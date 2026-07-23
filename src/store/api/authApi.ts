

export interface loginData {
    userEmail: string,
    userPassword: string
}





import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";

export interface AuthUser {
  id: string;
  userName: string;
  userEmail: string;
  roles?: string;
}


interface LoginResponse {
  accessToken: string;
  user: AuthUser;
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
        refresh: builder.mutation({
            query: () => ({
                url: "/auth/refresh",
                method: "POST"
            })
        })

    })
}) 


export const {useLoginMutation, useLogoutMutation, useRefreshMutation}= authApi;


