import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";

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
};

export const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    { status?: number; data: unknown }
  > =>
  async (args, api) => {
    const state = api.getState() as RootState;

    const token = state.auth.accessToken;
   
    try {
      const result = await axiosInstance({
        url: args.url,
        method: args.method ?? "GET",
        data: args.data,
        params: args.params,
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
        data: result.data?.data,
      };
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.status === 401) {
        try {
          const refreshResponse = await axios.post(
            "http://localhost:3000/api/auth/refresh",
            {},
            {
              withCredentials: true,
            }
          );

          const newAccessToken =
            (refreshResponse.data as any).accessToken;

          api.dispatch(setAccessToken(newAccessToken));

          const retryResult = await axiosInstance({
            url: args.url,
            method: args.method ?? "GET",
            data: args.data,
            params: args.params,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return {
            data: retryResult.data?.data,
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