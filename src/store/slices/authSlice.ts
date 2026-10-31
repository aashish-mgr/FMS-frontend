import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../api/authApi";
import axios from "axios";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}


const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true
};

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(
       "http://localhost:3000/api/auth/refresh",
        {},
        { withCredentials: true }
      );
      const accessToken = response.data?.data?.accessToken;
      if (!accessToken) throw new Error("No token in refresh response");
      return accessToken;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthCredentials: (state, action: PayloadAction<AuthUser | null >) => {
      state.user = action.payload;
    },
    setRole: (state, action: PayloadAction<string | undefined>) => {
      if (state.user) {
        state.user.role = action.payload ?? null;
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
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.isAuthenticated = true;
        state.isInitializing = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
      });
  },
});



export const { setAuthCredentials, setAccessToken, clearAuth ,setIsAuthenticated, setRole} = authSlice.actions;
export default authSlice.reducer;