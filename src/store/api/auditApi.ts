import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type { AuditResponse } from "../../types/auditTypes";


export const auditApi = createApi({
    reducerPath: "auditApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getAll: builder.query<AuditResponse,void>({
            query: () => ({
                url: "/audit-logs",
                method: "GET"
            })
        })
    })
})

export const {useGetAllQuery} = auditApi;