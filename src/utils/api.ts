// services/api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorMessage } from "./baseApi";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorMessage,
  tagTypes: ["User", "Task"],
  endpoints: () => ({}),
});