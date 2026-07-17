import { API } from "./index";
import type { expenseType } from "../../types/expenseTypes";

class expenseApi {
    async create(data: expenseType) {
       return API.post("/expense/",data);
    }

    async getAll() {
        return API.get("/expense/");
    }

    async getSingle(id: string) {
        return API.get(`/expense/${id}`);
    }

    async update(data: expenseType, id: string) {
        return API.patch(`/expense/${id}`,data);
    }

    async  delete(id: string ) {
        return API.delete(`/expense/${id}`);
    } 
}

export default new expenseApi();