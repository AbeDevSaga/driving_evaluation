"use client";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { FileText, List, Calendar } from "lucide-react";
import { useParams } from "next/navigation";
import DetailCard from "@/components/common/cards/DetailCard";
import { useGetExamByIdQuery } from "@/redux/api/examApi";
import ExamSectionTable from "@/features/basedata/component/ExamSectionTable";
import ExamScheduleTable from "@/features/basedata/component/ExamScheduleTable";
import { useState } from "react";
import { ActionButton } from "@/types/tableLayout";
import { useGetExamineeExamByIdQuery } from "@/redux/api/examineeExamApi";

function ExamineeEvaluationPage() {
    const { evaluation_id } = useParams() as { evaluation_id: string };
    const [activeTab, setActiveTab] = useState<"section" | "schedule">("section");

    const { data, isLoading, isError } = useGetExamineeExamByIdQuery(evaluation_id);

    if (isLoading) return <Loading01 />;
    if (isError || !data) return <div>Failed to load exam</div>;

    const detailItem = {
        title: data.exam.name,
        subtitle: data.schedule.location || "",
        icon: FileText,
        date: new Date(data.schedule.exam_date),
        time: new Date(data.schedule.exam_date),
        active: data.schedule.is_active,
    };

    const sideActions: ActionButton[] = [
        {
            label: "Exam Sections",
            icon: <List className="h-4 w-4" />,
            variant: activeTab === "section" ? "default" : "outline",
            size: "default",
            onClick: () => setActiveTab("section"),
        },
        {
            label: "Exam Schedules",
            icon: <Calendar className="h-4 w-4" />,
            variant: activeTab === "schedule" ? "default" : "outline",
            size: "default",
            onClick: () => setActiveTab("schedule"),
        },
    ];

    return (
        <div className="flex flex-col space-y-4">
            <DetailCard item={detailItem} />

            {/* {activeTab === "section" && (
        <ExamSectionTable exam_id={exam_id} sideActions={sideActions} />
      )}

      {activeTab === "schedule" && (
        <ExamScheduleTable exam_id={exam_id} sideActions={sideActions} />
      )} */}
        </div>
    );
}

export default ExamineeEvaluationPage;
