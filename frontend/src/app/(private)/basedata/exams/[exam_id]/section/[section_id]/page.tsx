"use client";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { FileText } from "lucide-react";
import { useParams } from "next/navigation";
import DetailCard from "@/components/common/cards/DetailCard";
import { useGetExamSectionByIdQuery } from "@/redux/api/examSectionApi";
import ExamExaminerTable from "@/features/user-management/component/ExamExaminerTable";

function ExamSectionDetailPage() {
  const { section_id, exam_id } = useParams() as {
    section_id: string;
    exam_id: string;
  };
  const { data, isLoading, isError, refetch } =
    useGetExamSectionByIdQuery(section_id);
  const structure_node_id = data?.exam?.structureNode?.structure_node_id;

  if (isLoading) return <Loading01 />;
  if (isError || !data) return <div>Failed to load vehicle category</div>;

  const detailItem: DetailCardItem = {
    title: "Exam Section",
    subtitle: data.name,
    icon: FileText,
    date: new Date(data.created_at),
    active: data.is_active,
  };

  return (
    <div className="flex flex-col space-y-4">
      <DetailCard item={detailItem} />
      <ExamExaminerTable exam_id={exam_id} section_id={section_id} structure_node_id={structure_node_id} />
    </div>
  );
}

export default ExamSectionDetailPage;
