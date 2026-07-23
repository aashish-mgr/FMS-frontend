
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type { incomeType } from "../../types/incomeTypes";


export const incomeApi = createApi({
    reducerPath: "incomeApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Income"],
    endpoints: (builder) => ({
        create: builder.mutation<incomeType,incomeType>({
            query: (body) =>  ({
                url: "/income/",
                data: body,
                method: "POST"
            }),
            invalidatesTags: ["Income"]
        }),   
        getAll: builder.query<incomeType[],void>({
            query: () => ({
                 url: "/income/",
                 method: "GET",

            }),
            providesTags: ["Income"]
        }),

        getSingle: builder.query<incomeType,string> ({
            query: (id) => ({
                url: `/income/${id}`,
                method: "GET"
            }),
            providesTags: ["Income"]
        }),

        update: builder.mutation<incomeType, {body: incomeType, id: string}> ({
            query: ({body, id}) => ({
                url: `/income/update/${id}`,
                data: body,
                method: "PATCH"
            }),
            invalidatesTags: ["Income"]
        }),
        delete: builder.mutation<incomeType, string> ({
              query: (id) => ({
                url: `/income/${id}`,
                method: "DELETE"
              }),
              invalidatesTags: ["Income"]
        })
    
    })
})

export const {useCreateMutation,useGetAllQuery,useGetSingleQuery,useUpdateMutation,useDeleteMutation}= incomeApi;