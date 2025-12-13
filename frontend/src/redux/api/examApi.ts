import { baseApi } from "../baseApi";
import {
  CreateExamPayload,
  Exam,
  ToggleExamStatusPayload,
  UpdateExamPayload,
} from "../types/exam";

export const examApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL EXAMS
     * --------------------------- */
    getExams: builder.query<
      Exam[],
      { is_active?: boolean; search?: string } | void
    >({
      query: (params) =>
        params ? { url: "/exams", params } : { url: "/exams" },
      transformResponse: (response: any): Exam[] => response.data ?? [],
      providesTags: ["Exam"],
    }),

    /** ---------------------------
     * GET EXAM BY ID
     * --------------------------- */
    getExamById: builder.query<Exam, string>({
      query: (id) => `/exams/${id}`,
      transformResponse: (response: any): Exam => response.data,
      providesTags: (_r, _e, id) => [{ type: "Exam", id }],
    }),

    /** ---------------------------
     * CREATE EXAM
     * --------------------------- */
    createExam: builder.mutation<Exam, CreateExamPayload>({
      query: (body) => ({
        url: "/exams",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): Exam => response.data,
      invalidatesTags: ["Exam"],
    }),

    /** ---------------------------
     * UPDATE EXAM
     * --------------------------- */
    updateExam: builder.mutation<Exam, { id: string; data: UpdateExamPayload }>(
      {
        query: ({ id, data }) => ({
          url: `/exams/${id}`,
          method: "PUT",
          body: data,
        }),
        transformResponse: (response: any): Exam => response.data,
        invalidatesTags: (_r, _e, { id }) => [{ type: "Exam", id }, "Exam"],
      }
    ),

    /** ---------------------------
     * DELETE EXAM (SOFT DELETE)
     * --------------------------- */
    deleteExam: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/exams/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["Exam"],
    }),

    /** ---------------------------
     * TOGGLE EXAM ACTIVE STATUS
     * --------------------------- */
    toggleExamStatus: builder.mutation<
      Exam,
      { id: string; data: ToggleExamStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `/exams/${id}/toggle-status`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any): Exam => response.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Exam", id }, "Exam"],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useToggleExamStatusMutation,
} = examApi;
