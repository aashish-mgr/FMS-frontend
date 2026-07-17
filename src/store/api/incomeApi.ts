import { API } from "./index";
import type { incomeType } from "../../types/incomeTypes";

class incomeApi {
    async create(data: incomeType) {
       return API.post("/income/",data);
    }

    async getAll() {
        return API.get("/income/");
    }

    async getSingle(id: string) {
        return API.get(`/income/${id}`);
    }

    async update(data: incomeType, id: string) {
        return API.patch(`/income/${id}`,data);
    }

    async  delete(id: string ) {
        return API.delete(`/income/${id}`);
    } 
}

export default new incomeApi();