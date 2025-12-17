"use client";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import DetailCard from "@/components/common/cards/DetailCard";
import { useGetExamByIdQuery } from "@/redux/api/examApi";

function ExamDetailPage() {
  const { exam_id } = useParams() as { exam_id: string };
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetExamByIdQuery(exam_id);

  if (isLoading) return <Loading01 />;
  if (isError || !data) return <div>Failed to load vehicle category</div>;

  const detailItem: DetailCardItem = {
    title: data.name,
    subtitle: data.description,
    icon: FileText,
    date: new Date(data.created_at),
    active: data.is_active,
  };

  return (
    <div className="flex flex-col space-y-4">
      <DetailCard item={detailItem} />
    </div>
  );
}

export default ExamDetailPage;
