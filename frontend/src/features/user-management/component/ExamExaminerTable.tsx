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
import { formatExamDateTime } from "@/utils/examScheduleConverter";
import { formatStatus } from "@/utils/statusFormatter";

const columns: ColumnDef<ExaminerAssignment>[] = [
  {
    accessorKey: "examiner.full_name",
    header: "Full Name",
    cell: ({ row }) => {
      const examiner = row.original.examiner;
      return (
        <span className="font-medium text-blue-600">
          {examiner?.full_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "examiner.email",
    header: "Email",
    cell: ({ row }) => {
      const examiner = row.original.examiner;
      return <div>{examiner?.email || "—"}</div>;
    },
  },
  {
    id: "section",
    header: "Section",
    cell: ({ row }) => {
      const section = row.original.section;
      return (
        <span className="text-sm font-medium">{section?.name || "—"}</span>
      );
    },
  },
  {
    id: "exam_date",
    header: "Exam Date",
    cell: ({ row }) => {
      const schedule = row.original.schedule;
      if (!schedule?.exam_date) return <span>—</span>;
      return (
        <span className="text-sm font-medium">
          {formatExamDateTime(schedule.exam_date)}
        </span>
      );
    },
  },
  {
    id: "location",
    header: "Location",
    cell: ({ row }) => {
      const schedule = row.original.schedule;
      return <span className="text-sm font-medium">{schedule?.location}</span>;
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
    section_id: section_id,
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
        section_id={section_id}
        user_type="examiner"
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
