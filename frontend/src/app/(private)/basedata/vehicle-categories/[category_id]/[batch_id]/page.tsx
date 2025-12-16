"use client";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { FileText, Hash, Calendar, Car } from "lucide-react";
import { useParams } from "next/navigation";
import DetailCard from "@/components/common/cards/DetailCard";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";

function BatchDetail() {
  const { batch_id } = useParams() as { batch_id: string };
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetBatchByIdQuery(batch_id);

  if (isLoading) return <Loading01 />;
  if (isError || !data) return <div>Failed to load batches</div>;

  const detailItem: DetailCardItem = {
    title: "Batches",
    subtitle: data.name,
    icon: Calendar,
    date: new Date(data.created_at),
    active: data.is_active,
  };

  return <DetailCard item={detailItem} />;
}

export default BatchDetail;
