import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthTenant, AuthUser } from "../api/authApi";
import axios from "axios";
import { API_BASE_URL } from "../../lib/apiConfig";

interface AuthState {
  user: AuthUser | null;
  tenant: AuthTenant | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
}

interface RefreshResponse {
  accessToken: string;
  user: AuthUser;
  tenant: AuthTenant;
}


const initialState: AuthState = {
  user: null,
  tenant: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true
};

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ data: RefreshResponse }>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const payload = response.data?.data;
      if (!payload?.accessToken || !payload.user || !payload.tenant) {
        throw new Error("No session in refresh response");
      }
      return payload;
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
    setWorkspace: (state, action: PayloadAction<AuthTenant | null>) => {
      state.tenant = action.payload;
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
      state.tenant = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.tenant = action.payload.tenant;
        state.isAuthenticated = true;
        state.isInitializing = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.tenant = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.isInitializing = false;
      });
  },
});



export const { setAuthCredentials, setAccessToken, clearAuth ,setIsAuthenticated, setRole, setWorkspace} = authSlice.actions;
export default authSlice.reducer;
