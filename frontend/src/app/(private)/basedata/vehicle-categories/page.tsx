import VehicleCategoryTable from "@/features/basedata/component/VehicleCategoryTable";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

function vehicleCategoriesPage() {
  return (
    <Suspense fallback={null}>
      <VehicleCategoryTable />
    </Suspense>
  );
}

export default vehicleCategoriesPage;
