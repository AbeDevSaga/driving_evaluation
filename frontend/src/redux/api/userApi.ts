import { baseApi } from "@/redux/baseApi";
import type { User, UserListParams } from "@/types/userType";

export const userApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["User"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      // Query endpoint (GET) - Get list of users
      getUsersList: builder.query<User[], UserListParams | void>({
        query: (params) => ({
          url: `/user/users`,
          method: "GET" as const,
          // params: params, // Uncomment when you have query params
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "User" as const, id })),
                { type: "User", id: "LIST" },
              ]
            : [{ type: "User", id: "LIST" }],
      }),

      // Query endpoint (GET) - Get single user by ID
      getUserById: builder.query<User, string>({
        query: (id) => ({
          url: `/user/users/${id}`,
          method: "GET" as const,
        }),
        providesTags: (result, error, id) => [{ type: "User", id }],
      }),

      // Mutation endpoint (POST) - Create new user
      createUser: builder.mutation<User, Partial<User>>({
        query: (user) => ({
          url: "/user/users",
          method: "POST" as const,
          body: user,
        }),
        invalidatesTags: [{ type: "User", id: "LIST" }],
      }),

      // Mutation endpoint (PUT) - Update user
      updateUser: builder.mutation<
        User,
        { id: string; updates: Partial<User> }
      >({
        query: ({ id, updates }) => ({
          url: `/user/users/${id}`,
          method: "PUT" as const,
          body: updates,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "User", id },
          { type: "User", id: "LIST" },
        ],
      }),

      // Mutation endpoint (DELETE) - Delete user
      deleteUser: builder.mutation<void, string>({
        query: (id) => ({
          url: `/user/users/${id}`,
          method: "DELETE" as const,
        }),
        invalidatesTags: (result, error, id) => [
          { type: "User", id },
          { type: "User", id: "LIST" },
        ],
      }),
    }),
  });

// Export hooks
export const {
  useGetUsersListQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;