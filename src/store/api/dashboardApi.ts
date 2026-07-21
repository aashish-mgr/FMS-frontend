import { API } from "./index";
import type { BarRange } from "../../types/dashboardTypes";

class dashboardApi {
    async getKpis() {
        return API.get("/dashboard/kpis");
    }

    async getIncomeExpenseChart (period: BarRange ) {
        return API.get(`/dashboard/income-expense-chart?period=${period}`)
    }

     async getIncomeByCategory (start: string, end: string) {
        return API.get(`/dashboard/income-by-category/${start}/${end}`);
    }

        async getExpenseByCategory (start: string, end: string) {
        return API.get(`/dashboard/expense-by-category/${start}/${end}`);
    }
   
    async  getCashFlow (year: number) {
        return API.get(`/dashboard/cash-flow/${year}`);
    }

    async getRecentTransactions () {
        return API.get("/dashboard/recent-transactions");
    }

    async getUpcomingReminders () {
        return API.get("/dashboard/upcoming-reminders");
    }
}

export default new dashboardApi();