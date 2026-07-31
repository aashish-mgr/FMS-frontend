import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type {
  IncomeExpenseReportParams,
  ReportType,
  format,
} from "../../types/reportTypes";
import {
  extractFilenameFromDisposition,
  triggerBrowserDownload,
} from "../../lib/downloadFile";

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getIncomeReport: builder.query<any, IncomeExpenseReportParams>({
      query: (params) => ({
        url: "/report/income",
        method: "GET",
        params: { params },
      }),
    }),
    getExpenseReport: builder.query<any, IncomeExpenseReportParams>({
      query: (params) => ({
        url: "/report/expense",
        method: "GET",
        params: { params },
      }),
    }),
    getProfitLossReport: builder.query<any, IncomeExpenseReportParams>({
      query: (params) => ({
        url: "/report/profit-loss",
        method: "GET",
        params: { params },
      }),
    }),
    downloadReport: builder.mutation<
      { filename: string },
      {
        reportType: ReportType;
        format: format;
        params?: IncomeExpenseReportParams;
      }
    >({
      query: ({ reportType, format, params }) => ({
        url: `/report/${reportType}`,
        params: { ...params, format },
        // Tells axiosBaseQuery to fetch binary data instead of parsing JSON,
        // and to hand back the raw axios response (data + headers) rather
        // than unwrapping a { success, data } envelope that doesn't exist here.
        responseType: "blob",
      }),
      // `response` here is the raw AxiosResponse<Blob> returned by
      // axiosBaseQuery for blob requests — this is where the actual
      // browser-download side effect happens.
      transformResponse: (response: any, _meta, arg) => {
        const { reportType, format } = arg;
        const blob: Blob = response.data;
        const filename = extractFilenameFromDisposition(
          response.headers?.["content-disposition"] ?? null,
          `${reportType}-report.${format === "excel" ? "xlsx" : format}`
        );
        triggerBrowserDownload(blob, filename);
        return { filename };
      },
    }),
  }),
});

export const {
  useGetExpenseReportQuery,
  useGetIncomeReportQuery,
  useGetProfitLossReportQuery,
  useDownloadReportMutation
} = reportApi;
