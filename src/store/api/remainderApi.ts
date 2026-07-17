import { API } from "./index";
import type { remainderType } from "../../types/remainderTypes";

class remainderApi {
    async create(data: remainderType) {
        return await API.post("/reminder/",data);
    }

     async update(data: remainderType, id: string) {
        return await API.patch(`/reminder/${id}`,data);
    }

     async getAll() {
        return await API.get("/reminder/");
    }

    async getSingle(id: string) {
        return await API.get(`/reminder/${id}`);
    }

    async delete(id: string)  {
         return await API.delete(`/reminder/${id}`);
    }
}

export default new remainderApi();