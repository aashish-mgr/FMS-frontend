import { API } from "./index";


class categoryApi {
   async getIncomeCategory() {
     return API.get("/category/income")
   }

    async getExpenseCategory() {
     return API.get("/category/expense")
   }
}

export default new categoryApi();