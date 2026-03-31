// services/baseApi.ts
import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
  } from "@reduxjs/toolkit/query";
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
  
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  });
  
  export const baseQueryWithErrorMessage: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
  
    if (result.error) {
      const data = result.error.data as
        | { message?: string; error?: { message?: string; fields?: Record<string, string> } }
        | undefined;
      const nested = data?.error;
      let message =
        (typeof nested?.message === "string" ? nested.message : undefined) ??
        (typeof data?.message === "string" ? data.message : undefined) ??
        "API Error";
      if (nested?.fields && Object.keys(nested.fields).length > 0) {
        const detail = Object.entries(nested.fields)
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ");
        message = `${message} ${detail}`;
      }

      return {
        error: {
          ...result.error,
          message:
            typeof message === "string" ? message : JSON.stringify(message),
        },
      };
    }
  
    return result;
  };