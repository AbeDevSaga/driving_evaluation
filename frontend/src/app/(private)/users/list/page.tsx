"use client";
import ExternalUserTable from "@/features/user-management/component/ExternalUserTable";
import InternalUserTable from "@/features/user-management/component/InternalUserTable";
import { ActionButton } from "@/types/tableLayout";
import { Users } from "lucide-react";
import { useState } from "react";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';


function UsersList() {
  const [activeTab, setActiveTab] = useState<"internal" | "external">(
    "internal"
  );
  const sideActions: ActionButton[] = [
    {
      label: "Internal Users",
      icon: <Users className="h-4 w-4" />,
      variant: activeTab === "internal" ? "default" : "outline",
      size: "default",
      onClick: () => setActiveTab("internal"),
    },
    {
      label: "Examiners",
      icon: <Users className="h-4 w-4" />,
      variant: activeTab === "external" ? "default" : "outline",
      size: "default",
      onClick: () => setActiveTab("external"),
    },
  ];
  return (
    <>
      {/* Pass sideActions to your layout/header if needed */}
      {activeTab === "internal" && (
        <Suspense fallback={null}>
          <InternalUserTable sideActions={sideActions} />
        </Suspense>
      )}
      {activeTab === "external" && (
        <Suspense fallback={null}>
          <ExternalUserTable sideActions={sideActions} />
        </Suspense>
      )}
    </>
  );
}

export default UsersList;
