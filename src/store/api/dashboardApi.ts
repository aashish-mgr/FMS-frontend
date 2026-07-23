// import { API } from "./index";

// class dashboardApi {
//     async getKpis() {
//         return API.get("/dashboard/kpis");
//     }

//     async getIncomeExpenseChart (period: BarRange ) {
//         return API.get(`/dashboard/income-expense-chart?period=${period}`)
//     }

//      async getIncomeByCategory (start: string, end: string) {
//         return API.get(`/dashboard/income-by-category/${start}/${end}`);
//     }

//         async getExpenseByCategory (start: string, end: string) {
//         return API.get(`/dashboard/expense-by-category/${start}/${end}`);
//     }

//     async  getCashFlow (year: number) {
//         return API.get(`/dashboard/cash-flow/${year}`);
//     }

//     async getRecentTransactions () {
//         return API.get("/dashboard/recent-transactions");
//     }

//     async getUpcomingReminders () {
//         return API.get("/dashboard/upcoming-reminders");
//     }
// }

// export default new dashboardApi();

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type {
  Kpis,
  BarDatum,
  CategorySlice,
  CashFlowDatum,
  Transaction,
  Reminder,
  BarRange,
} from "../../types/dashboardTypes";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getKpis: builder.query<Kpis, void>({
      query: () => ({ url: "/dashboard/kpis", method: "GET" }),
    }),
    getIncomeExpenseChart: builder.query<BarDatum[], BarRange>({
      query: (period) => ({
        url: "/dashboard/income-expense-chart",
        method: "GET",
        params: { period },
      }),
    }),
    getIncomeByCategory: builder.query<
      CategorySlice[],
      { start: string; end: string }
    >({
      query: ({ start, end }) => ({
        url: `/dashboard/income-by-category/${start}/${end}`,
        method: "GET",
      }),
    }),
    getExpenseByCategory: builder.query<CategorySlice[], { start: string; end: string }>({
      query: ({start,end}) => ({ url: `/dashboard/expense-by-category/${start}/${end}`, method: "GET" }),
    }),
    getMonthlyCashFlow: builder.query<CashFlowDatum[], number>({
      query: (year) => ({
        url: `/dashboard/monthly-cash-flow/${year}`,
        method: "GET",
      }),
    }),
    getRecentTransactions: builder.query<Transaction[], void>({
      query: () => ({ url: "/dashboard/recent-transactions", method: "GET" }),
    }),
    getUpcomingReminders: builder.query<Reminder[], void>({
      query: () => ({ url: "/dashboard/upcoming-reminders", method: "GET" }),
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetIncomeExpenseChartQuery,
  useGetIncomeByCategoryQuery,
  useGetExpenseByCategoryQuery,
  useGetMonthlyCashFlowQuery,
  useGetRecentTransactionsQuery,
  useGetUpcomingRemindersQuery,
} = dashboardApi;
