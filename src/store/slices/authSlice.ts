import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { API } from "../api";

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

interface LoginData {
   userEmail: string;
   userPassword: string
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
    setAuthCredentials: (state, action: PayloadAction<{ user: AuthUser }>) => {
      state.user = action.payload?.user;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
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

export const loginUser = (userData: LoginData) => {
  return async function loginUserThunk(dispatch: any) {
      try {
        const res = await API.post("/auth/login",userData);
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

export const { setAuthCredentials, setAccessToken, clearAuth ,setIsAuthenticated} = authSlice.actions;
export default authSlice.reducer;