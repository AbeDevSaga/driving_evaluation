"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { DataTable } from "@/components/common/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the Evaluation type
type Evaluation = {
  id: string;
  studentName: string;
  instructorName: string;
  date: string;
  vehicleType: string;
  score: number;
  status: "passed" | "failed" | "pending";
};

// Mock data for evaluations
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
  {
    id: "EVL006",
    studentName: "Amanda Wilson",
    instructorName: "Lisa Anderson",
    date: "2024-12-05",
    vehicleType: "Sedan",
    score: 67,
    status: "passed",
  },
  {
    id: "EVL007",
    studentName: "Christopher Lee",
    instructorName: "Michael Johnson",
    date: "2024-12-05",
    vehicleType: "SUV",
    score: 45,
    status: "failed",
  },
  {
    id: "EVL008",
    studentName: "Jessica Garcia",
    instructorName: "David Brown",
    date: "2024-12-04",
    vehicleType: "Sedan",
    score: 88,
    status: "passed",
  },
];

// Define columns for the table
const columns: ColumnDef<Evaluation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "studentName",
    header: "Student",
  },
  {
    accessorKey: "instructorName",
    header: "Instructor",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle",
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("score") as number;
      const status = row.original.status;
      if (status === "pending") return <span className="text-muted-foreground">-</span>;
      return <span className={score >= 70 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{score}%</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "passed"
              ? "default"
              : status === "failed"
              ? "destructive"
              : "secondary"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DashboardPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handlePagination = (index: number, size: number) => {
    setPageIndex(index);
    setPageSize(size);
  };

  // Calculate stats from mock data
  const totalEvaluations = mockEvaluations.length;
  const passedCount = mockEvaluations.filter((e) => e.status === "passed").length;
  const pendingCount = mockEvaluations.filter((e) => e.status === "pending").length;
  const passRate = totalEvaluations > 0 
    ? Math.round((passedCount / (totalEvaluations - pendingCount)) * 100) 
    : 0;

  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Evaluations
            </h3>
            <p className="text-2xl font-bold">{totalEvaluations}</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Passed
            </h3>
            <p className="text-2xl font-bold text-green-600">{passedCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Pending Reviews
            </h3>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </h3>
            <p className="text-2xl font-bold">{passRate}%</p>
          </div>
        </div>

        {/* Recent Evaluations Table */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Evaluations</h2>
          <DataTable
            columns={columns}
            data={mockEvaluations}
            totalPageCount={Math.ceil(mockEvaluations.length / pageSize)}
            handlePagination={handlePagination}
            tablePageSize={pageSize}
            currentIndex={pageIndex}
          />
        </div>
      </main>
    </>
  );
}
