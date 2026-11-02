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
import type { Note,ListNoteParams,CreateNoteInput, UpdateNoteInput } from "../../types/notesTypes";


export const noteApi = createApi({
  reducerPath: "noteApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Note"],
  endpoints: (builder) => ({
    getAll: builder.query<Note[], ListNoteParams | void>({
      query: (params) => ({ url: "/note/", method: "GET", params: params ?? {} }),
      providesTags: ["Note"],
    }),
    createNote: builder.mutation<Note, CreateNoteInput>({
      query: (body) => ({ url: "/note/", method: "POST", data: body }),
      invalidatesTags: ["Note"],
    }),
    updateNote: builder.mutation<Note,{body: UpdateNoteInput,id: string}> ({
       query: ({ body, id }) => ({
        url: `/note/${id}`,
        method: "PATCH",
        data: body,
       }),
       invalidatesTags: ["Note"]
    }),
    togglePin: builder.mutation<Note, { id: string; isPinned: boolean }>({
      query: ({ id, isPinned }) => ({ url: `/note/${id}/pin`, method: "PATCH", data: { isPinned } }),
      invalidatesTags: ["Note"],
    }),
     toggleArchive: builder.mutation<Note, { id: string ,isArchived: boolean }>({
      query: ({ id, isArchived }) => ({ url: `/note/${id}/archive`, method: "PATCH", data: {isArchived} }),
      invalidatesTags: ["Note"],
    }),
    deleteNote: builder.mutation<void, string>({
      query: (id) => ({ url: `/note/${id}`, method: "DELETE" }),
      invalidatesTags: ["Note"],
    }),
  }),
});

export const {
  useGetAllQuery,
  useCreateNoteMutation,
  useTogglePinMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  useToggleArchiveMutation
} = noteApi;