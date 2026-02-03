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
import { ExamSection } from "@/redux/types/examSection";
import { useGetSectionsByExamQuery } from "@/redux/api/examSectionApi";
import { CreateExamSectionModal } from "@/components/common/modal/CreateExamSectionModal";
import { formatStatus } from "@/utils/statusFormatter";

interface ExamSectionTableProps {
  exam_id: string;
  sideActions?: ActionButton[];
}

export default function ExamSectionTable({ exam_id, sideActions }: ExamSectionTableProps) {
  const columns: ColumnDef<ExamSection>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        console.log(row.original.name, "row.original.name"),
        (
          <span className="font-medium text-blue-600">
            {row.getValue("name")}
          </span>
        )
      ),
    },
    {
      accessorKey: "weight_percentage",
      header: "Weight Percentage",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.getValue("weight_percentage")}
        </div>
      ),
    },
    {
      accessorKey: "max_score",
      header: "Max Score",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.getValue("max_score")}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        return (
          <Badge status={isActive ? "active" : "inactive"}>
            {formatStatus(isActive ? "Active" : "Inactive")}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.section_id;
        return (
          <div className="flex items-center gap-1">
            <Link href={`${exam_id}/section/${id}`}>
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
  } = useGetSectionsByExamQuery(exam_id);
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
      label: "New Exam Section",
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
      <TableLayout actions={actions} filters={filters}
        sideActions={sideActions}
        filterColumnsPerRow={1}>
        <DataTable
          columns={columns}
          data={paginatedData}
          totalPageCount={Math.ceil(filteredData.length / pageSize)}
          handlePagination={handlePagination}
          tablePageSize={pageSize}
          currentIndex={pageIndex}
        />
      </TableLayout>
      <CreateExamSectionModal
        exam_id={exam_id}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
