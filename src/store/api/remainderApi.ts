// import { API } from "./index";
// import type { remainderType } from "../../types/remainderTypes";

// class remainderApi {
//     async create(data: remainderType) {
//         return await API.post("/reminder/",data);
//     }

//      async update(data: remainderType, id: string) {
//         return await API.patch(`/reminder/${id}`,data);
//     }

//      async getAll() {
//         return await API.get("/reminder/");
//     }

//     async getSingle(id: string) {
//         return await API.get(`/reminder/${id}`);
//     }

//     async delete(id: string)  {
//          return await API.delete(`/reminder/${id}`);
//     }
// }

// export default new remainderApi();

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type { ListReminderParams,ListReminderResponse,CreateReminderInput,remainderType } from "../../types/remainderTypes";

export const reminderApi = createApi({
  reducerPath: "reminderApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Reminder"],
  endpoints: (builder) => ({
    getReminders: builder.query<ListReminderResponse, ListReminderParams | void>({
      query: (params) => ({ url: "/reminder/", method: "GET", params: params ?? {} }),
      providesTags: ["Reminder"],
    }),
    createReminder: builder.mutation<remainderType, CreateReminderInput>({
      query: (body) => ({ url: "/reminder/", method: "POST", data: body }),
      invalidatesTags: ["Reminder"],
    }),
    markComplete: builder.mutation<remainderType, string>({
      query: (id) => ({ url: `/reminder/${id}/complete`, method: "PATCH" }),
      invalidatesTags: ["Reminder"],
    }),
    deleteReminder: builder.mutation<void, string>({
      query: (id) => ({ url: `/reminder/${id}`, method: "DELETE" }),
      invalidatesTags: ["Reminder"],
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useCreateReminderMutation,
  useMarkCompleteMutation,
  useDeleteReminderMutation,
} = reminderApi;