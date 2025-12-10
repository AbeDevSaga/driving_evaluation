"use client";

import { Header } from "@/components/layout/header";
import TableComponentExample from "@/features/template/usage/TableComponent.Example";

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        {/* Table Example */}
        <TableComponentExample />
      </main>
    </>
  );
}
