

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";


 export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getIncomeCategory: builder.mutation({
       query: () => ({
          url: "/category/income"
       })
    }),
    getExpenseCategory: builder.mutation({
      query: () => ({
         url: "/category/expense"
      })
    })
  })
})


export const {useGetIncomeCategoryMutation, useGetExpenseCategoryMutation} = categoryApi