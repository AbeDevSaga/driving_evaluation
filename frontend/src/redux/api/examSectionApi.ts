// api/examSectionApi.ts
import { baseApi } from "../baseApi";
import {
  ExamSection,
  CreateExamSectionPayload,
  UpdateExamSectionPayload,
} from "../types/examSection";

export const examSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL SECTIONS
     * --------------------------- */
    getExamSections: builder.query<ExamSection[], void>({
      query: () => ({ url: "/exam-sections" }),
      transformResponse: (response: any): ExamSection[] => response.data ?? [],
      providesTags: ["ExamSection"],
    }),

    /** ---------------------------
     * GET SECTION BY ID
     * --------------------------- */
    getExamSectionById: builder.query<ExamSection, string>({
      query: (id) => `/exam-sections/${id}`,
      transformResponse: (response: any): ExamSection => response.data,
      providesTags: (_r, _e, id) => [{ type: "ExamSection", id }],
    }),

    /** ---------------------------
     * GET SECTIONS BY EXAM
     * --------------------------- */
    getSectionsByExam: builder.query<ExamSection[], string>({
      query: (exam_id) => `/exam-sections/exam/${exam_id}`,
      transformResponse: (response: any): ExamSection[] => response.data ?? [],
      providesTags: (_r, _e, exam_id) => [{ type: "ExamSection", id: exam_id }],
    }),

    /** ---------------------------
     * CREATE SECTION
     * --------------------------- */
    createExamSection: builder.mutation<ExamSection, CreateExamSectionPayload>({
      query: (body) => ({
        url: "/exam-sections",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): ExamSection => response.data,
      invalidatesTags: ["ExamSection"],
    }),

    /** ---------------------------
     * UPDATE SECTION
     * --------------------------- */
    updateExamSection: builder.mutation<
      ExamSection,
      { id: string; data: UpdateExamSectionPayload }
    >({
      query: ({ id, data }) => ({
        url: `/exam-sections/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): ExamSection => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ExamSection", id },
        "ExamSection",
      ],
    }),

    /** ---------------------------
     * DELETE SECTION
     * --------------------------- */
    deleteExamSection: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/exam-sections/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["ExamSection"],
    }),
  }),
});

export const {
  useGetExamSectionsQuery,
  useGetExamSectionByIdQuery,
  useGetSectionsByExamQuery,
  useCreateExamSectionMutation,
  useUpdateExamSectionMutation,
  useDeleteExamSectionMutation,
} = examSectionApi;
