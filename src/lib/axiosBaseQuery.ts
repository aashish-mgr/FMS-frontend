import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig ,AxiosResponse} from "axios";

import axios from "axios";
import axiosInstance from "./axios";

import type { RootState } from "../store";
import { setAccessToken, clearAuth } from "../store/slices/authSlice";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
  responseType?: AxiosRequestConfig["responseType"];
};

function unwrapResult(result: AxiosResponse, args: AxiosBaseQueryArgs) {
  if (args.responseType === "blob" || args.responseType === "arraybuffer") {
    return result;
  }
  return result.data?.data;

}

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post("http://localhost:3000/api/auth/refresh", {}, { withCredentials: true })
      .then((res) => {
        const token = res.data?.data?.accessToken;
        if (!token) throw new Error("No access token in refresh response");
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    { status?: number; data: unknown }
  > =>
  async (args, api) => {
    const state = api.getState() as RootState;

    const token = (state.auth as { accessToken?: string })?.accessToken;
    try {
      const result = await axiosInstance({
        url: args.url,
        method: args.method ?? "GET",
        data: args.data,
        params: args.params,
        responseType: args.responseType,
        headers: {
          ...args.headers,
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      return {
        data:  unwrapResult(result, args),
      };
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 401) {
        try {
           const newAccessToken = await refreshAccessToken();
    api.dispatch(setAccessToken(newAccessToken));


          const retryResult = await axiosInstance({
            url: args.url,
            method: args.method ?? "GET",
            data: args.data,
            params: args.params,
            responseType: args.responseType,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return {
            data:unwrapResult(retryResult, args),
          };
        } catch {
          api.dispatch(clearAuth());

          return {
            error: {
              status: 401,
              data: "Session expired",
            },
          };
        }
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };