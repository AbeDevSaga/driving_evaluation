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
import { ExamSchedule } from "@/redux/types/examSchedule";
import { useGetSchedulesByExamQuery } from "@/redux/api/examScheduleApi";
import { CreateExamScheduleModal } from "@/components/common/modal/CreateExamScheduleModal";
import { formatDate, formatTime } from "../utils/dateFormatter";

interface ExamSectionTableProps {
  exam_id: string;
  sideActions?: ActionButton[];
}

export default function ExamScheduleTable({
  exam_id,
  sideActions,
}: ExamSectionTableProps) {
  const columns: ColumnDef<ExamSchedule>[] = [
    {
      accessorKey: "exam_date",
      header: "Date",
      cell: ({ row }) => (
        <span className="font-medium text-blue-600">
          {formatDate(row.original.exam_date)}
        </span>
      ),
    },
    {
      accessorKey: "exam_date",
      header: "Time",
      cell: ({ row }) => (
        <span className="font-medium text-blue-600">
          {formatTime(row.original.exam_date)}
        </span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.getValue("location")}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge status={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.schedule_id;
        return (
          <div className="flex items-center gap-1">
            <Link href={`${exam_id}/schedule/${id}`}>
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
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetSchedulesByExamQuery(exam_id);
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
      label: "New Exam Schedule",
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
    return <div>Error loading Exam Schedule</div>;
  }

  // Pagination slice
  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );
  return (
    <>
      <TableLayout
        actions={actions}
        filters={filters}
        filterColumnsPerRow={1}
        sideActions={sideActions}
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
      <CreateExamScheduleModal
        exam_id={exam_id}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
