import { baseApi } from "../baseApi";
import {
  ExaminerAssignment,
  CreateExaminerAssignmentPayload,
  UpdateExaminerAssignmentPayload,
} from "../types/examinerAssignment";

export const examinerAssignmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL ASSIGNMENTS
     * --------------------------- */
    getAssignments: builder.query<ExaminerAssignment[], void>({
      query: () => ({ url: "/examiner-assignments" }),
      transformResponse: (response: any): ExaminerAssignment[] =>
        response.data ?? [],
      providesTags: ["ExaminerAssignment"],
    }),

    /** ---------------------------
     * GET ASSIGNMENT BY ID
     * --------------------------- */
    getAssignmentById: builder.query<ExaminerAssignment, string>({
      query: (id) => `/examiner-assignments/${id}`,
      transformResponse: (response: any): ExaminerAssignment => response.data,
      providesTags: (_r, _e, id) => [{ type: "ExaminerAssignment", id }],
    }),

    /** ---------------------------
     * CREATE ASSIGNMENT
     * --------------------------- */
    createAssignment: builder.mutation<
      ExaminerAssignment,
      CreateExaminerAssignmentPayload
    >({
      query: (body) => ({
        url: "/examiner-assignments",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): ExaminerAssignment => response.data,
      invalidatesTags: ["ExaminerAssignment"],
    }),

    /** ---------------------------
     * UPDATE ASSIGNMENT
     * --------------------------- */
    updateAssignment: builder.mutation<
      ExaminerAssignment,
      { id: string; data: UpdateExaminerAssignmentPayload }
    >({
      query: ({ id, data }) => ({
        url: `/examiner-assignments/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): ExaminerAssignment => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ExaminerAssignment", id },
        "ExaminerAssignment",
      ],
    }),

    /** ---------------------------
     * DELETE ASSIGNMENT
     * --------------------------- */
    deleteAssignment: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/examiner-assignments/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["ExaminerAssignment"],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = examinerAssignmentApi;
