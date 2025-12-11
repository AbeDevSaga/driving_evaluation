// src/redux/apis/authApi.ts
import { baseApi } from "../baseApi";
import { AuthResponse, LoginCredentials } from "../types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => {
        const user = response?.data?.user ?? null;
        const roles = response?.data?.roles ?? [];

        // Store token and user immediately
        if (response.token) {
          localStorage.setItem("authToken", response.token);
        }
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }

        return {
          token: response.token,
          user,
          roles,
          message: response.message,
        };
      },
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear token and user on logout
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
