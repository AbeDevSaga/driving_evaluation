import { baseApi } from "../baseApi";
import { Batch, CreateBatchPayload, UpdateBatchPayload } from "../types/batch";

export const batchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL BATCHES
     * --------------------------- */
    getBatches: builder.query<Batch[], void>({
      query: () => ({ url: "/batches" }),
      transformResponse: (response: any): Batch[] => response.data ?? [],
      providesTags: ["Batch"],
    }),

    /** ---------------------------
     * GET BATCH BY ID
     * --------------------------- */
    getBatchById: builder.query<Batch, string>({
      query: (batch_id) => `/batches/${batch_id}`,
      transformResponse: (response: any): Batch => response.data,
      providesTags: (_r, _e, batch_id) => [{ type: "Batch", id: batch_id }],
    }),

    /** ---------------------------
     * GET BATCHES BY CATEGORY
     * --------------------------- */
    getBatchesByCategory: builder.query<Batch[], string>({
      query: (vehicle_category_id) =>
        `/batches/category/${vehicle_category_id}`,
      transformResponse: (response: any): Batch[] => response.data ?? [],
      providesTags: (_r, _e, vehicle_category_id) => [
        { type: "Batch", id: vehicle_category_id },
      ],
    }),

    /** ---------------------------
     * CREATE BATCH
     * --------------------------- */
    createBatch: builder.mutation<Batch, CreateBatchPayload>({
      query: (body) => ({
        url: "/batches",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): Batch => response.data,
      invalidatesTags: ["Batch"],
    }),

    /** ---------------------------
     * UPDATE BATCH
     * --------------------------- */
    updateBatch: builder.mutation<
      Batch,
      { batch_id: string; data: UpdateBatchPayload }
    >({
      query: ({ batch_id, data }) => ({
        url: `/batches/${batch_id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): Batch => response.data,
      invalidatesTags: (_r, _e, { batch_id }) => [
        { type: "Batch", id: batch_id },
        "Batch",
      ],
    }),

    /** ---------------------------
     * DELETE BATCH
     * --------------------------- */
    deleteBatch: builder.mutation<{ message: string }, string>({
      query: (batch_id) => ({
        url: `/batches/${batch_id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["Batch"],
    }),
  }),
});

export const {
  useGetBatchesQuery,
  useGetBatchByIdQuery,
  useGetBatchesByCategoryQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
} = batchApi;
