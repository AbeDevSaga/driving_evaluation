"use client";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import DetailCard from "@/components/common/cards/DetailCard";
import { useGetAssignmentByIdQuery } from "@/redux/api/examinerAssignmentApi";
import ExamineeSectionTable from "@/features/user-management/component/ExamineeSectionTable";

function ExaminerEvaluationPage() {
    const { evaluation_id } = useParams() as { evaluation_id: string };

    const { data, isLoading, isError } = useGetAssignmentByIdQuery(evaluation_id);
    const exam_id = data?.section?.exam_id || "";
    const schedule_id = data?.schedule?.schedule_id || "";


    if (isLoading) return <Loading01 />;
    if (isError || !data) return <div>Failed to load exam</div>;

    const detailItem = {
        title: data.section?.name || "",
        subtitle: data.section?.exam?.name || "",
        icon: FileText,
        date: new Date(data.schedule?.exam_date || ""),
        time: new Date(data.schedule?.exam_date || ""),
        active: data.schedule?.is_active || false,
    };

    return (
        <div className="flex flex-col space-y-4">
            <DetailCard item={detailItem} />
            <ExamineeSectionTable exam_id={exam_id} schedule_id={schedule_id} />
        </div>
    );
}

export default ExaminerEvaluationPage;
