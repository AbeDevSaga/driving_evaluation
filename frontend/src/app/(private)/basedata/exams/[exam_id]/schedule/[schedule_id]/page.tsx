"use client";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import DetailCard from "@/components/common/cards/DetailCard";
import { useGetExamScheduleByIdQuery } from "@/redux/api/examScheduleApi";
import ExamExamineeTable from "@/features/user-management/component/ExamExamineeTable";
import { formatExamDateTime } from "@/utils/examScheduleConverter";

function ExamScheduleDetailPage() {
  const { schedule_id, exam_id } = useParams() as {
    schedule_id: string;
    exam_id: string;
  };
  const { data, isLoading, isError, refetch } =
    useGetExamScheduleByIdQuery(schedule_id);

  if (isLoading) return <Loading01 />;
  if (isError || !data) return <div>Failed to load Exam Schedule</div>;
  const date = formatExamDateTime(data.exam_date);

  const detailItem: DetailCardItem = {
    title: date,
    subtitle: data.location || "",
    icon: FileText,
    date: data.created_at ? new Date(data.created_at) : new Date(),
    active: data.is_active,
  };

  return (
    <div className="flex flex-col space-y-4">
      <DetailCard item={detailItem} />
      <ExamExamineeTable exam_id={exam_id} schedule_id={schedule_id} />
    </div>
  );
}

export default ExamScheduleDetailPage;
