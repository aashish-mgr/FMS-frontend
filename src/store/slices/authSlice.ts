import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import type { loginData } from "../api/authApi";

interface AuthUser {
  id: string;
  userName: string;
  userEmail: string;
  role?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}


const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthCredentials: (state, action: PayloadAction<AuthUser | null >) => {
      state.user = action.payload;
    },
    setRole: (state, action: PayloadAction<string | null>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    setIsAuthenticated: (state,action: PayloadAction<boolean>)  => {
      state.isAuthenticated = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const loginUser = (userData: loginData) => {
  return async function loginUserThunk(dispatch: Dispatch) {
      try {
        const authApi = (await import("../api/authApi")).default;
        const res = await authApi.login(userData)
        console.log(res);
        if(res.status === 200){
          dispatch(setAuthCredentials(res.data.data?.user));
          dispatch(setRole(res.data.data?.user?.userRole?.roles?.roleName))
          dispatch(setAccessToken(res.data.data?.accessToken));
          dispatch(setIsAuthenticated(true));
        }
        else {
          alert("Login Failed.")
        }
      }
      catch(err) {
        alert("login failed");
        console.error(err);
      }
  }
}


export const logout = ()=> {
  return async function logoutThunk(dispatch:Dispatch) {
      try {
        const authApi = (await import("../api/authApi")).default;
        const res = await authApi.logout();
        if(res.status === 200){
           dispatch(setAuthCredentials(null));
           dispatch(setAccessToken(null));
           dispatch(setIsAuthenticated(false));
           return res;
        }
        else {
            alert("logout failed");
            return res;
        }
      }
      catch(err) {
        alert("logout failed");
        console.error(err);
        return false;
      }
  }
}

export const { setAuthCredentials, setAccessToken, clearAuth ,setIsAuthenticated, setRole} = authSlice.actions;
export default authSlice.reducer;