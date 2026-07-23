// import { API } from "./index";
// import type { noteTypes } from "../../types/notesTypes";

// class notesApi {
//     async create(data: noteTypes) {
//         return await API.post("/notes/",data);
//     }

//      async update(data: noteTypes, id: string) {
//         return await API.patch(`/notes/${id}`,data);
//     }

//      async getAll() {
//         return await API.get("/notes/");
//     }

//     async getSingle(id: string) {
//         return await API.get(`/notes/${id}`);
//     }

//     async delete(id: string)  {
//          return await API.delete(`/notes/${id}`);
//     }
// }

// export default new notesApi();

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";
import type { Note,ListNoteParams,ListNoteResponse,CreateNoteInput } from "../../types/notesTypes";


export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Note"],
  endpoints: (builder) => ({
    getAll: builder.query<ListNoteResponse, ListNoteParams | void>({
      query: (params) => ({ url: "/notes/", method: "GET", params: params ?? {} }),
      providesTags: ["Note"],
    }),
    createNote: builder.mutation<Note, CreateNoteInput>({
      query: (body) => ({ url: "/notes/", method: "POST", data: body }),
      invalidatesTags: ["Note"],
    }),
    togglePin: builder.mutation<Note, { id: string; isPinned: boolean }>({
      query: ({ id, isPinned }) => ({ url: `/notes/${id}/pin`, method: "PATCH", data: { isPinned } }),
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({ url: `/notes/${id}`, method: "DELETE" }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useGetAllQuery,
  useCreateNoteMutation,
  useTogglePinMutation,
  useDeleteNoteMutation,
} = noteApi;