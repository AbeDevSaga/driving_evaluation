import ExamTable from "@/features/basedata/component/ExamTable";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

function ExamPage() {
  return (
    <Suspense fallback={null}>
      <ExamTable />
    </Suspense>
  );
}

export default ExamPage;
