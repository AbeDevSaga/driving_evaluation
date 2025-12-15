import { baseApi } from "../baseApi";
import {
  ExamSchedule,
  CreateExamSchedulePayload,
  UpdateExamSchedulePayload,
} from "../types/examSchedule";

export const examScheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL SCHEDULES
     * --------------------------- */
    getExamSchedules: builder.query<ExamSchedule[], void>({
      query: () => ({ url: "/exam-schedules" }),
      transformResponse: (response: any): ExamSchedule[] => response.data ?? [],
      providesTags: ["ExamSchedule"],
    }),

    /** ---------------------------
     * GET SCHEDULE BY ID
     * --------------------------- */
    getExamScheduleById: builder.query<ExamSchedule, string>({
      query: (id) => `/exam-schedules/${id}`,
      transformResponse: (response: any): ExamSchedule => response.data,
      providesTags: (_r, _e, id) => [{ type: "ExamSchedule", id }],
    }),

    /** ---------------------------
     * GET SCHEDULES BY EXAM
     * --------------------------- */
    getSchedulesByExam: builder.query<ExamSchedule[], string>({
      query: (exam_id) => `/exam-schedules/exam/${exam_id}`,
      transformResponse: (response: any): ExamSchedule[] => response.data ?? [],
      providesTags: (_r, _e, exam_id) => [
        { type: "ExamSchedule", id: exam_id },
      ],
    }),

    /** ---------------------------
     * CREATE SCHEDULE
     * --------------------------- */
    createExamSchedule: builder.mutation<
      ExamSchedule,
      CreateExamSchedulePayload
    >({
      query: (body) => ({
        url: "/exam-schedules",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): ExamSchedule => response.data,
      invalidatesTags: ["ExamSchedule"],
    }),

    /** ---------------------------
     * UPDATE SCHEDULE
     * --------------------------- */
    updateExamSchedule: builder.mutation<
      ExamSchedule,
      { id: string; data: UpdateExamSchedulePayload }
    >({
      query: ({ id, data }) => ({
        url: `/exam-schedules/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): ExamSchedule => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ExamSchedule", id },
        "ExamSchedule",
      ],
    }),

    /** ---------------------------
     * DELETE SCHEDULE
     * --------------------------- */
    deleteExamSchedule: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/exam-schedules/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["ExamSchedule"],
    }),
  }),
});

export const {
  useGetExamSchedulesQuery,
  useGetExamScheduleByIdQuery,
  useGetSchedulesByExamQuery,
  useCreateExamScheduleMutation,
  useUpdateExamScheduleMutation,
  useDeleteExamScheduleMutation,
} = examScheduleApi;
