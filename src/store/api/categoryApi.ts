

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type { Category } from "../../types/categoryTypes";


 export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getIncomeCategory: builder.query<Category[],void>({
       query: () => ({
          url: "/category/income"
       })
    }),
    getExpenseCategory: builder.query<Category[],void>({
      query: () => ({
         url: "/category/expense"
      })
    })
  })
})


export const {useGetExpenseCategoryQuery, useGetIncomeCategoryQuery} = categoryApi