import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type {IncomeExpenseReportParams} from "../../types/reportTypes";

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getIncomeReport: builder.query<any,IncomeExpenseReportParams>({
            query: (params) => ( {
                url: "/report/income",
                method: "GET",
                params: {params}
            })
        }),
        getExpenseReport: builder.query<any,IncomeExpenseReportParams>({
            query: (params) => ({
                url:"/report/expense",
                method: "GET",
                params: {params}
            })
        }),
        getProfitLossReport: builder.query<any,IncomeExpenseReportParams>({
            query: (params) => ({
                url: "/report/profit-loss",
                method: "GET",
                params: {params}
            })
        })
    })
})


export const {useGetExpenseReportQuery,useGetIncomeReportQuery,useGetProfitLossReportQuery} = reportApi;