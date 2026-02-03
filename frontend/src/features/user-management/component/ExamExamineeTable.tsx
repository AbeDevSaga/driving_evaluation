"use client";

import { useState } from "react";
import { DataTable } from "@/features/template/component/tableList/DataTable";
import { TableLayout } from "@/features/template/component/tableList/TableLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Plus, Eye, Edit, Trash, Users } from "lucide-react";

import type { FilterField, ActionButton } from "@/types/tableLayout";
import {
  useExportUsersMutation,
} from "@/redux/api/userApi";
import { CreateUserModal } from "@/components/common/modal/CreateUserModal";
import { ExamineeExam } from "@/redux/types/examineeExam";
import { formatExamDateTime } from "@/utils/examScheduleConverter";
import { useGetExamineeExamsQuery } from "@/redux/api/examineeExamApi";
import { User } from "@/redux/types/user";
import { CreateExamExamineeModal } from "@/components/common/modal/CreateExamExamineeModal";


const columns: ColumnDef<ExamineeExam>[] = [
  {
    accessorKey: "examinee.full_name",
    header: "Full Name",
    cell: ({ row }) => {
      const examinee = row.original.examinee;
      return (
        <span className="font-medium text-blue-600">
          {examinee?.full_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "examinee.email",
    header: "Email",
    cell: ({ row }) => {
      const examinee = row.original.examinee;
      return <div>{examinee?.email || "—"}</div>;
    },
  },
  {
    id: "exam_id",
    header: "Exam",
    cell: ({ row }) => {
      const exam = row.original.exam;
      return (
        <span className="text-sm font-medium">{exam?.name || "—"}</span>
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
      return (
        <span className="text-sm font-medium">{schedule?.location || "—"}</span>
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

export interface ExamExamineeTableProps {
  exam_id: string;
  schedule_id: string;
  sideActions?: ActionButton[];
}
// structure_node_id
export default function ExamExamineeTable({
  exam_id,
  schedule_id,
  sideActions,
}: ExamExamineeTableProps) {

  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetExamineeExamsQuery(
    { schedule_id },
    { skip: !schedule_id }
  );

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
      label: "Assign Examinee",
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
      <CreateExamExamineeModal
        exam_id={exam_id}
        exam_schedule_id={schedule_id}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
