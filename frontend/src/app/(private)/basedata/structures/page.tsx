import StructuresTable from "@/features/basedata/component/StructuresTable";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

const page = () => {
  return (
    <Suspense fallback={null}>
      <StructuresTable />
    </Suspense>
  );
};

export default page;
