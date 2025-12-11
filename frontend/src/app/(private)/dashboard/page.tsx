"use client";

import AreaChart01 from "@/features/template/component/ReCharts/AreaCharts/AreaChart01";
import TableComponentExample from "@/features/template/usage/TableComponent.Example";

export default function DashboardPage() {
  return (
    <main className="flex-1 p-6 space-y-6">
      {/* Table Example */}
      <TableComponentExample />
      {/* Interactive Charts */}
      <AreaChart01 />
    </main>
  );
}
