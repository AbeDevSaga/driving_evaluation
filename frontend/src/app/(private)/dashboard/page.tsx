"use client";

import DashboardLayout from "@/features/template/component/dashboardLayout/DashboardLayout";
import ChartRadialText01 from "@/features/template/component/reCharts/RadialCharts/ChartRadialText01";
import DashboardStatsCards from "@/features/template/component/dashboardCards/DashboardStatsCards";

export default function DashboardPage() {
  return (
    <main className="flex-1 space-y-6">
      <DashboardStatsCards />
      <DashboardLayout />
      <ChartRadialText01 />
    </main>
  );
}
