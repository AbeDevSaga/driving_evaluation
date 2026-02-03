"use client";

import { useState } from "react";
import { DataTable } from "@/features/template/component/tableList/DataTable";
import { TableLayout } from "@/features/template/component/tableList/TableLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash } from "lucide-react";
import Link from "next/link";
import type { FilterField, ActionButton } from "@/types/tableLayout";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { CreateVehicleCategoryModal } from "@/components/common/modal/CreateVehicleCategoryModal";
import { Exam } from "@/redux/types/exam";
import { useGetExamsQuery } from "@/redux/api/examApi";
import { CreateExamModal } from "@/components/common/modal/CreateExamModal";
import { formatStatus } from "@/utils/statusFormatter";
import { useGetExamineeExamsQuery } from "@/redux/api/examineeExamApi";
import { useSession } from "next-auth/react";
import { ExamineeExam } from "@/redux/types/examineeExam";
import { formatExamDateTime } from "@/utils/examScheduleConverter";

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
    cell: ({ row }) => {
      const id = row.original.examinee_exam_id;
      return (
        <div className="flex items-center gap-1">
          <Link href={`/evaluations/examinee/${id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>

          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export interface ExamineeEvaluationProps {
  sideActions?: ActionButton[];
}

export default function ExamineeEvaluation({ sideActions }: ExamineeEvaluationProps) {
  const { data: sessionData } = useSession();
  const examinee_id = sessionData?.user?.id;
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetExamineeExamsQuery(
      // { examinee_id },
      // { skip: !examinee_id }
    );
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
      label: "New Exam",
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

  if (isLoading) {
    return <Loading01 />;
  }
  if (isError) {
    return <div>Error loading Exams</div>;
  }

  // Pagination slice
  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );
  return (
    <>
      <TableLayout
        sideActions={sideActions}
        actions={actions} filters={filters} filterColumnsPerRow={1}>
        <DataTable
          columns={columns}
          data={paginatedData}
          totalPageCount={Math.ceil(filteredData.length / pageSize)}
          handlePagination={handlePagination}
          tablePageSize={pageSize}
          currentIndex={pageIndex}
        />
      </TableLayout>
      <CreateExamModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
