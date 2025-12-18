"use client";

import { useState } from "react";
import { DataTable } from "@/features/template/component/tableList/DataTable";
import { TableLayout } from "@/features/template/component/tableList/TableLayout";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Download, Eye, Edit, Trash } from "lucide-react";
import type { FilterField, ActionButton } from "@/types/tableLayout";
import { formatStatus } from "@/utils/statusFormatter";

type Evaluation = {
  id: string;
  studentName: string;
  instructorName: string;
  date: string;
  vehicleType: string;
  score: number;
  status: "passed" | "failed" | "pending";
};

const mockEvaluations: Evaluation[] = [
  {
    id: "EVL001",
    studentName: "John Smith",
    instructorName: "Michael Johnson",
    date: "2024-12-08",
    vehicleType: "Sedan",
    score: 85,
    status: "passed",
  },
  {
    id: "EVL002",
    studentName: "Sarah Williams",
    instructorName: "David Brown",
    date: "2024-12-07",
    vehicleType: "SUV",
    score: 72,
    status: "passed",
  },
  {
    id: "EVL003",
    studentName: "James Davis",
    instructorName: "Michael Johnson",
    date: "2024-12-07",
    vehicleType: "Truck",
    score: 58,
    status: "failed",
  },
  {
    id: "EVL004",
    studentName: "Emily Taylor",
    instructorName: "Lisa Anderson",
    date: "2024-12-06",
    vehicleType: "Sedan",
    score: 0,
    status: "pending",
  },
  {
    id: "EVL005",
    studentName: "Robert Martinez",
    instructorName: "David Brown",
    date: "2024-12-06",
    vehicleType: "Motorcycle",
    score: 91,
    status: "passed",
  },
];

const columns: ColumnDef<Evaluation>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "studentName", header: "Student" },
  { accessorKey: "instructorName", header: "Instructor" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "vehicleType", header: "Vehicle" },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("score") as number;
      const status = row.original.status;
      if (status === "pending")
        return <span className="text-muted-foreground">-</span>;
      return (
        <span
          className={
            score >= 70
              ? "text-green-600 font-medium"
              : "text-red-600 font-medium"
          }
        >
          {score}%
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          status={
            status === "passed"
              ? "active"
              : status === "failed"
              ? "rejected"
              : "pending"
          }
        >
          {formatStatus(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
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
      );
    },
  },
];

const ReportTable = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [vehicleFilter, setVehicleFilter] = useState("");

  const handlePagination = (index: number, size: number) => {
    setPageIndex(index);
    setPageSize(size);
  };

  // Filters
  const filters: FilterField[] = [
    {
      key: "vehicle",
      label: "Vehicle Type",
      type: "multiselect",
      placeholder: "Select vehicle",
      value: vehicleFilter,
      onChange: setVehicleFilter,
      options: [
        { label: "Sedan", value: "Sedan" },
        { label: "SUV", value: "SUV" },
        { label: "Truck", value: "Truck" },
        { label: "Motorcycle", value: "Motorcycle" },
      ],
    },
  ];

  // Actions
  const actions: ActionButton[] = [
    {
      label: "Export",
      icon: <Download className="h-4 w-4" />,
      variant: "outline",
      onClick: () => console.log("Export clicked"),
    },
    {
      label: "New Evaluation",
      icon: <Plus className="h-4 w-4" />,
      variant: "default",
      onClick: () => console.log("New evaluation clicked"),
    },
  ];

  return (
    <TableLayout
      title="Reports"
      description="View and manage all reports"
      actions={actions}
      filters={filters}
      filterColumnsPerRow={1}
    >
      <DataTable
        columns={columns}
        data={mockEvaluations}
        totalPageCount={Math.ceil(mockEvaluations.length / pageSize)}
        handlePagination={handlePagination}
        tablePageSize={pageSize}
        currentIndex={pageIndex}
      />
    </TableLayout>
  );
};

export default ReportTable;
