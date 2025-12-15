import { baseApi } from "../baseApi";
import {
  CreateVehicleCategoryPayload,
  VehicleCategory,
  ToggleVehicleCategoryStatusPayload,
  UpdateVehicleCategoryPayload,
} from "../types/vehicleCategory";

export const vehicleCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL VEHICLE CATEGORIES
     * --------------------------- */
    getVehicleCategories: builder.query<
      VehicleCategory[],
      { is_active?: boolean; search?: string } | void
    >({
      query: (params) =>
        params
          ? { url: "/vehicle-categories", params }
          : { url: "/vehicle-categories" },
      transformResponse: (response: any): VehicleCategory[] =>
        response.data ?? [],
      providesTags: ["VehicleCategory"],
    }),

    /** ---------------------------
     * GET VEHICLE CATEGORY BY ID
     * --------------------------- */
    getVehicleCategoryById: builder.query<VehicleCategory, string>({
      query: (id) => `/vehicle-categories/${id}`,
      transformResponse: (response: any): VehicleCategory => response.data,
      providesTags: (_r, _e, id) => [{ type: "VehicleCategory", id }],
    }),

    /** ---------------------------
     * CREATE VEHICLE CATEGORY
     * --------------------------- */
    createVehicleCategory: builder.mutation<
      VehicleCategory,
      CreateVehicleCategoryPayload
    >({
      query: (body) => ({
        url: "/vehicle-categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): VehicleCategory => response.data,
      invalidatesTags: ["VehicleCategory"],
    }),

    /** ---------------------------
     * UPDATE VEHICLE CATEGORY
     * --------------------------- */
    updateVehicleCategory: builder.mutation<
      VehicleCategory,
      { id: string; data: UpdateVehicleCategoryPayload }
    >({
      query: ({ id, data }) => ({
        url: `/vehicle-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): VehicleCategory => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "VehicleCategory", id },
        "VehicleCategory",
      ],
    }),

    /** ---------------------------
     * DELETE VEHICLE CATEGORY (SOFT)
     * --------------------------- */
    deleteVehicleCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/vehicle-categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["VehicleCategory"],
    }),

    /** ---------------------------
     * TOGGLE VEHICLE CATEGORY STATUS
     * --------------------------- */
    toggleVehicleCategoryStatus: builder.mutation<
      VehicleCategory,
      { id: string; data: ToggleVehicleCategoryStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `/vehicle-categories/${id}/toggle-status`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any): VehicleCategory => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "VehicleCategory", id },
        "VehicleCategory",
      ],
    }),
  }),
});

export const {
  useGetVehicleCategoriesQuery,
  useGetVehicleCategoryByIdQuery,
  useCreateVehicleCategoryMutation,
  useUpdateVehicleCategoryMutation,
  useDeleteVehicleCategoryMutation,
  useToggleVehicleCategoryStatusMutation,
} = vehicleCategoryApi;
