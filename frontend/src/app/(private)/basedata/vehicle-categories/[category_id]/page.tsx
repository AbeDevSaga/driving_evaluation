"use client";
import Loading01 from "@/features/template/component/Loading/Loading01";
import { FileText, Hash, Calendar, Car } from "lucide-react";
import { useGetVehicleCategoryByIdQuery } from "@/redux/api/vehicleCategoryApi";
import { useParams } from "next/navigation";
import DetailCard from "@/components/common/cards/DetailCard";
import BatchTable from "@/features/basedata/component/BatchTable";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

function VehicleCategoryDetail() {
  const { category_id } = useParams() as { category_id: string };
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useGetVehicleCategoryByIdQuery(category_id);

  if (isLoading) return <Loading01 />;
  if (isError || !data) return <div>Failed to load vehicle category</div>;

  const detailItem: DetailCardItem = {
    title: "Vehicle Category",
    subtitle: data.name,
    icon: Car,
    date: new Date(data.created_at),
    active: data.is_active,
  };

  return (
    <div className="flex flex-col gap-4">
      <DetailCard item={detailItem} />
      <Suspense fallback={null}>
        <BatchTable vehicle_category_id={category_id} />
      </Suspense>
    </div>
  );
}

export default VehicleCategoryDetail;
