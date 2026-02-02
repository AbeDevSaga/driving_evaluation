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

export const columns: ColumnDef<Exam>[] = [
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-muted-foreground">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    id: "structureNode",
    header: "Structure Node",
    cell: ({ row }) => {
      const structureNode = row.original.structureNode?.name;
      return (
        <span className="text-sm text-muted-foreground">{structureNode ?? "—"}</span>
      );
    },
  },
  {
    accessorKey: "pass_percentage",
    header: "Pass Percentage",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-muted-foreground">
        {row.getValue("pass_percentage")}
      </div>
    ),
  },
  {
    id: "vehicleCategory",
    header: "Vehicle Category",
    cell: ({ row }) => {
      const Category = row.original.vehicleCategory?.name;
      return (
        <span className="text-sm text-muted-foreground">{Category ?? "—"}</span>
      );
    },
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
      const id = row.original.exam_id;
      return (
        <div className="flex items-center gap-1">
          <Link href={`exams/${id}`}>
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

export default function ExamTable() {
  const { data = [], isLoading, isError, refetch } = useGetExamsQuery();
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
        title="Exams"
        description="Manage your exams"
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
