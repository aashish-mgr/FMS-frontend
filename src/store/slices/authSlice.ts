import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { API } from "../api";
import authApi from "../api/authApi";
import type{ loginData } from "../api/authApi";

interface AuthUser {
  id: string;
  userName: string;
  userEmail: string;
  roles: string[] | null;
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
    setAuthCredentials: (state, action: PayloadAction<{ user: AuthUser | null} >) => {
      state.user = action.payload?.user;
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
        const res = await authApi.login(userData)
        if(res.status === 200){
          dispatch(setAuthCredentials(res.data?.user));
          dispatch(setAccessToken(res.data?.accessToken));
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
        const res = await authApi.logout();
        if(res.status === 200){
           dispatch(setAuthCredentials({user: null}));
           dispatch(setAccessToken(null));
           dispatch(setIsAuthenticated(false));
           return 1;
        }
        else {
            alert("logout failed");
            return 0;
        }
      }
      catch(err) {
        alert("logout failed");
        console.error(err);
        return false;
      }
  }
}

export const { setAuthCredentials, setAccessToken, clearAuth ,setIsAuthenticated} = authSlice.actions;
export default authSlice.reducer;