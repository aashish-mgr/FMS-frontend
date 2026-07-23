
import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type { expenseType } from "../../types/expenseTypes";


export const expenseApi = createApi({
    reducerPath: "expenseApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Expense"],
    endpoints: (builder) => ({
        create: builder.mutation<expenseType,expenseType>({
            query: (body) =>  ({
                url: "/expense/",
                data: body,
                method: "POST"
            }),
            invalidatesTags: ["Expense"]
        }),   
        getAll: builder.query<expenseType[],void>({
            query: () => ({
                 url: "/expense/",
                 method: "GET",

            }),
            providesTags: ["Expense"]
        }),

        getSingle: builder.query<expenseType,string> ({
            query: (id) => ({
                url: `/expense/${id}`,
                method: "GET"
            }),
            providesTags: ["Expense"]
        }),

        update: builder.mutation<expenseType, {body: expenseType, id: string}> ({
            query: ({body, id}) => ({
                url: `/expense/update/${id}`,
                data: body,
                method: "PATCH"
            }),
            invalidatesTags: ["Expense"]
        }),
        delete: builder.mutation<expenseType, string> ({
              query: (id) => ({
                url: `/expense/${id}`,
                method: "DELETE"
              }),
              invalidatesTags: ["Expense"]
        })
    
    })
})

export const {useCreateMutation,useGetAllQuery,useGetSingleQuery,useUpdateMutation,useDeleteMutation}= expenseApi;