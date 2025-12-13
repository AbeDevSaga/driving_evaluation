import { baseApi } from "../baseApi";
import {
  CreateStructureNodePayload,
  StructureNode,
  ToggleStructureNodeStatusPayload,
  UpdateStructureNodePayload,
} from "../types/structureNode";

export const structureNodeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /** ---------------------------
     * GET ALL STRUCTURE NODES
     * --------------------------- */
    getStructureNodes: builder.query<
      StructureNode[],
      { is_active?: boolean; search?: string } | void
    >({
      query: (params) =>
        params
          ? { url: "/structure-nodes", params }
          : { url: "/structure-nodes" },
      transformResponse: (response: any): StructureNode[] =>
        response.data ?? [],
      providesTags: ["StructureNode"],
    }),

    /** ---------------------------
     * GET STRUCTURE NODE BY ID
     * --------------------------- */
    getStructureNodeById: builder.query<StructureNode, string>({
      query: (id) => `/structure-nodes/${id}`,
      transformResponse: (response: any): StructureNode => response.data,
      providesTags: (_r, _e, id) => [{ type: "StructureNode", id }],
    }),

    /** ---------------------------
     * CREATE STRUCTURE NODE
     * --------------------------- */
    createStructureNode: builder.mutation<
      StructureNode,
      CreateStructureNodePayload
    >({
      query: (body) => ({
        url: "/structure-nodes",
        method: "POST",
        body,
      }),
      transformResponse: (response: any): StructureNode => response.data,
      invalidatesTags: ["StructureNode"],
    }),

    /** ---------------------------
     * UPDATE STRUCTURE NODE
     * --------------------------- */
    updateStructureNode: builder.mutation<
      StructureNode,
      { id: string; data: UpdateStructureNodePayload }
    >({
      query: ({ id, data }) => ({
        url: `/structure-nodes/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any): StructureNode => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StructureNode", id },
        "StructureNode",
      ],
    }),

    /** ---------------------------
     * DELETE STRUCTURE NODE (SOFT DELETE)
     * --------------------------- */
    deleteStructureNode: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/structure-nodes/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => response,
      invalidatesTags: ["StructureNode"],
    }),

    /** ---------------------------
     * TOGGLE STRUCTURE NODE ACTIVE STATUS
     * --------------------------- */
    toggleStructureNodeStatus: builder.mutation<
      StructureNode,
      { id: string; data: ToggleStructureNodeStatusPayload }
    >({
      query: ({ id, data }) => ({
        url: `/structure-nodes/${id}/toggle-status`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any): StructureNode => response.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "StructureNode", id },
        "StructureNode",
      ],
    }),
  }),
});

export const {
  useGetStructureNodesQuery,
  useGetStructureNodeByIdQuery,
  useCreateStructureNodeMutation,
  useUpdateStructureNodeMutation,
  useDeleteStructureNodeMutation,
  useToggleStructureNodeStatusMutation,
} = structureNodeApi;
