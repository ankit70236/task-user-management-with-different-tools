
import { api } from "../../utils/api";

/** Single user row (matches API `data` object). */
export type User = {
  id: string;
  name?: string;
  email?: string;
};

type ApiSuccess<T> = { message?: string; data?: T };

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (response: ApiSuccess<User[]>) => {
        const d = response?.data;
        return Array.isArray(d) ? d : [];
      },
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiSuccess<User>) => {
        const u = response?.data;
        if (!u || typeof u !== "object" || !("id" in u) || !u.id) {
          throw new Error("Invalid user payload from server");
        }
        return u as User;
      },
    }),

    updateUser: builder.mutation({
      query: ({ id, name, email }: { id: string; name?: string; email?: string }) => {
        // Backend uses *string + validate:"omitempty,email". Empty strings decode as
        // non-nil pointers, so "" still runs the email rule and returns 400. Omit empty fields.
        const body: { name?: string; email?: string } = {};
        if (typeof name === "string" && name.trim() !== "") body.name = name.trim();
        if (typeof email === "string" && email.trim() !== "") body.email = email.trim();
        return {
          url: `/users/${id}`,
          method: "PUT",
          body,
        };
      },
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
