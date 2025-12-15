import { baseApi } from "../baseApi";
import {
  ExamineeExam,
  CreateExamineeExamPayload,
  UpdateExamineeExamPayload,
} from "../types/examineeExam";

export const examineeExamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL EXAMS
     * --------------------------- */
    getExamineeExams: builder.query<ExamineeExam[], void>({
      query: () => ({ url: "/examinee-exams" }),
      transformResponse: (response: any): ExamineeExam[] => response.data ?? [],
      providesTags: ["ExamineeExam"],
    }),

    /** ---------------------------
     * GET EXAM BY ID
     * --------------------------- */
    getExamineeExamById: builder.query<ExamineeExam, string>({
      query: (id) => `/examinee-exams/${id}`,
      transformResponse: (response: any): ExamineeExam => response.data,
      providesTags: (_r, _e, id) => [{ type: "ExamineeExam", id }],
    }),

    /** ---------------------------
     * GET EXAMINEES BY SCHEDULE
     * --------------------------- */
    getExamineesBySchedule: builder.query<ExamineeExam[], string>({
      query: (scheduleId) => `/examinee-exams/schedule/${scheduleId}`,
      transformResponse: (response: any): ExamineeExam[] => response.data ?? [],
      providesTags: (_r, _e, scheduleId) => [
        { type: "ExamineeExam", id: scheduleId },
      ],
    }),

    /** ---------------------------
     * CREATE EXAM
     * --------------------------- */
    createExamineeExam: builder.mutation<
      ExamineeExam,
      CreateExamineeExamPayload
    >({
      query: (body) => ({
        url: "/examinee-exams",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): ExamineeExam => response.data,
      invalidatesTags: ["ExamineeExam"],
    }),

    /** ---------------------------
     * UPDATE EXAM
     * --------------------------- */
    updateExamineeExam: builder.mutation<
      ExamineeExam,
      { id: string; data: UpdateExamineeExamPayload }
    >({
      query: ({ id, data }) => ({
        url: `/examinee-exams/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): ExamineeExam => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ExamineeExam", id },
        "ExamineeExam",
      ],
    }),

    /** ---------------------------
     * DELETE EXAM
     * --------------------------- */
    deleteExamineeExam: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/examinee-exams/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["ExamineeExam"],
    }),
  }),
});

export const {
  useGetExamineeExamsQuery,
  useGetExamineeExamByIdQuery,
  useCreateExamineeExamMutation,
  useUpdateExamineeExamMutation,
  useDeleteExamineeExamMutation,
} = examineeExamApi;
