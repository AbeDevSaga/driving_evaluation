import { baseApi } from "../baseApi";
import {
  SectionResult,
  CreateSectionResultPayload,
  UpdateSectionResultPayload,
} from "../types/sectionResult";

export const sectionResultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL SECTION RESULTS
     * --------------------------- */
    getSectionResults: builder.query<SectionResult[], void>({
      query: () => ({ url: "/section-results" }),
      transformResponse: (response: any): SectionResult[] =>
        response.data ?? [],
      providesTags: ["SectionResult"],
    }),

    /** ---------------------------
     * GET SECTION RESULT BY ID
     * --------------------------- */
    getSectionResultById: builder.query<SectionResult, string>({
      query: (id) => `/section-results/${id}`,
      transformResponse: (response: any): SectionResult => response.data,
      providesTags: (_r, _e, id) => [{ type: "SectionResult", id }],
    }),

    /** ---------------------------
     * CREATE SECTION RESULT
     * --------------------------- */
    createSectionResult: builder.mutation<
      SectionResult,
      CreateSectionResultPayload
    >({
      query: (body) => ({
        url: "/section-results",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): SectionResult => response.data,
      invalidatesTags: ["SectionResult"],
    }),

    /** ---------------------------
     * UPDATE SECTION RESULT
     * --------------------------- */
    updateSectionResult: builder.mutation<
      SectionResult,
      { id: string; data: UpdateSectionResultPayload }
    >({
      query: ({ id, data }) => ({
        url: `/section-results/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): SectionResult => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "SectionResult", id },
        "SectionResult",
      ],
    }),

    /** ---------------------------
     * DELETE SECTION RESULT
     * --------------------------- */
    deleteSectionResult: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/section-results/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["SectionResult"],
    }),
  }),
});

export const {
  useGetSectionResultsQuery,
  useGetSectionResultByIdQuery,
  useCreateSectionResultMutation,
  useUpdateSectionResultMutation,
  useDeleteSectionResultMutation,
} = sectionResultApi;
