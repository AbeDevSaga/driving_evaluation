"use client";
import ExamineeEvaluation from "@/features/basedata/component/ExamineeEvaluation";
import ExaminerEvaluation from "@/features/basedata/component/ExaminerEvaluation";
import { ActionButton } from "@/types/tableLayout";
import { Users } from "lucide-react";
import { useState } from "react";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';


function UsersList() {
    const [activeTab, setActiveTab] = useState<"schedule" | "exam">(
        "schedule"
    );
    const sideActions: ActionButton[] = [
        {
            label: "Schedules",
            icon: <Users className="h-4 w-4" />,
            variant: activeTab === "schedule" ? "default" : "outline",
            size: "default",
            onClick: () => setActiveTab("schedule"),
        },
        {
            label: "Exams",
            icon: <Users className="h-4 w-4" />,
            variant: activeTab === "exam" ? "default" : "outline",
            size: "default",
            onClick: () => setActiveTab("exam"),
        },
    ];
    return (
        <>
            {/* Pass sideActions to your layout/header if needed */}
            {activeTab === "schedule" && (
                <Suspense fallback={null}>
                    <ExamineeEvaluation sideActions={sideActions} />
                </Suspense>
            )}
            {activeTab === "exam" && (
                <Suspense fallback={null}>
                    <ExaminerEvaluation sideActions={sideActions} />
                </Suspense>
            )}
        </>
    );
}

export default UsersList;
