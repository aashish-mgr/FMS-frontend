import { API } from "./index";

class dashboardApi {
    async getKpis() {
        return API.get("/dashboard/kpis");
    }

    async getIncomeExpenseChart () {
        return API.get("/dashboard/income-expense-chart")
    }

     async getIncomeByCategory () {
        return API.get("/dashboard/income-by-category");
    }

    async getExpenseByCategory () {
        return API.get("/dashboard/expense-by-category");
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