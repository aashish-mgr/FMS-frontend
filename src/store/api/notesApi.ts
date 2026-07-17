import { API } from "./index";
import type { noteTypes } from "../../types/notesTypes";

class notesApi {
    async create(data: noteTypes) {
        return await API.post("/notes/",data);
    }

     async update(data: noteTypes, id: string) {
        return await API.patch(`/notes/${id}`,data);
    }

     async getAll() {
        return await API.get("/notes/");
    }

    async getSingle(id: string) {
        return await API.get(`/notes/${id}`);
    }

    async delete(id: string)  {
         return await API.delete(`/notes/${id}`);
    }
}

export default new notesApi();