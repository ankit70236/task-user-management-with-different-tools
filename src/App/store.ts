import { configureStore } from "@reduxjs/toolkit";
import { api } from "../utils/api";
import "../features/auth/authApi";
import "../features/user/userApi";
import "../features/task/taskApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});