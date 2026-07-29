import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type {format} from "../../types/reportTypes";

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getIncomeReport: builder.query<undefined,string>({
            query: (format: format) => ( {
                url: "/report/income",
                method: "GET",
                params: {format}
            })
        }),
        getExpenseReport: builder.query<undefined,string>({
            query: (format: format) => ({
                url:"/report/expense",
                method: "GET",
                params: {format}
            })
        }),
        getProfitLossReport: builder.query<undefined,string>({
            query: (format: format) => ({
                url: "/report/profit-loss",
                method: "GET",
                params: {format}
            })
        })
    })
})


export const {useGetExpenseReportQuery,useGetIncomeReportQuery,useGetProfitLossReportQuery} = reportApi;