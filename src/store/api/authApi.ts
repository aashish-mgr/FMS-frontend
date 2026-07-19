import { API} from "./index";

export interface loginData {
    userEmail: string,
    userPassword: string
}

class authApi {
    async login(data: loginData) {
      return await API.post("/auth/login",data);
    }

    async logout() {
        return await API.post("/auth/logout");
    }

    async refresh() {
        return await API.post("/auth/refresh")
    }
}

export default new authApi();

