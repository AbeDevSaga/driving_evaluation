"use client";

import { useState } from "react";
import { DataTable } from "@/features/template/component/tableList/DataTable";
import { TableLayout } from "@/features/template/component/tableList/TableLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Plus, Eye, Edit, Trash, Users } from "lucide-react";

import type { FilterField, ActionButton } from "@/types/tableLayout";
import { useExportUsersMutation } from "@/redux/api/userApi";
import { CreateUserModal } from "@/components/common/modal/CreateUserModal";
import { ExaminerAssignment } from "@/redux/types/examinerAssignment";
import { useGetAssignmentsQuery } from "@/redux/api/examinerAssignmentApi";
import { CreateExamExaminerModal } from "@/components/common/modal/CreateExamExaminerModal";

const columns: ColumnDef<ExaminerAssignment>[] = [
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => (
      <span className="font-medium text-blue-600">
        {row.getValue("full_name")}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: any) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
    cell: ({ row }: any) => <div>{row.getValue("phone_number")}</div>,
  },
  {
    id: "externalUserType",
    header: "User Type",
    cell: ({ row }) => {
      const type = row.original.examiner;
      return <span className="text-sm font-medium">{type?.name ?? "—"}</span>;
    },
  },
  {
    id: "structure",
    header: "Structure",
    cell: ({ row }) => {
      const structure = row.original.examiner;
      return (
        <span className="text-sm font-medium">{structure?.name ?? "—"}</span>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
export interface ExamExaminerTableProps {
  exam_id: string;
  section_id: string;
  sideActions?: ActionButton[];
}
// structure_node_id
export default function ExamExaminerTable({
  exam_id,
  section_id,
  sideActions,
}: ExamExaminerTableProps) {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetAssignmentsQuery({
    section_id,
  });
  const [exportUsers, { isLoading: exportLoading }] = useExportUsersMutation();

  // Pagination states
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setModalOpen] = useState(false);
  const handlePagination = (index: number, size: number) => {
    setPageIndex(index);
    setPageSize(size);
  };

  // Filters
  const [statusFilter, setStatusFilter] = useState("");

  const filters: FilterField[] = [
    {
      key: "status",
      label: "Status",
      type: "multiselect",
      placeholder: "Select status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  // Actions
  const actions: ActionButton[] = [
    {
      label: "Export",
      icon: <Download className="h-4 w-4" />,
      variant: "outline",
      loading: exportLoading,
      onClick: async () => {
        try {
          const blob = await exportUsers().unwrap();
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "users.csv";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Export failed", err);
        }
      },
    },

    {
      label: "Assign Examiner",
      icon: <Plus className="h-4 w-4" />,
      variant: "default",
      onClick: () => setModalOpen(true),
    },
  ];

  // Apply filters locally (client-side)
  const filteredData = data.filter((role) => {
    if (statusFilter === "active") return role.is_active === true;
    if (statusFilter === "inactive") return role.is_active === false;
    return true;
  });

  // Pagination slice
  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );
  return (
    <>
      <TableLayout
        actions={actions}
        sideActions={sideActions}
        filters={filters}
        filterColumnsPerRow={1}
      >
        <DataTable
          columns={columns}
          data={paginatedData}
          totalPageCount={Math.ceil(filteredData.length / pageSize)}
          handlePagination={handlePagination}
          tablePageSize={pageSize}
          currentIndex={pageIndex}
        />
      </TableLayout>
      <CreateExamExaminerModal
        exam_id={exam_id}
        user_type="examiner"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
