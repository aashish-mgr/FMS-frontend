import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import type { loginData } from "../api/authApi";
import { useLoginMutation,useLogoutMutation } from "../api/authApi";
import type { AuthUser } from "../api/authApi";

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
    setRole: (state, action: PayloadAction<string | undefined>) => {
      if (state.user) {
        state.user.roles = action.payload;
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
         const [login] = useLoginMutation();
         const res = await login(userData);
        console.log(res);
        if(res.error){
          alert("Login Failed.")
         
        }
        else {
           dispatch(setAuthCredentials(res.data?.user));
          // dispatch(setRole(res.data?.user?.userRole?.roles?.roleName))
          dispatch(setAccessToken(res.data?.accessToken));
          dispatch(setIsAuthenticated(true));
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
          const [logoutUser] = useLogoutMutation();
        const res =await logoutUser();
        if(res.error){
           alert("logout failed");
           
          
        }
        else {
           dispatch(setAuthCredentials(null));
           dispatch(setAccessToken(null));
           dispatch(setIsAuthenticated(false));
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