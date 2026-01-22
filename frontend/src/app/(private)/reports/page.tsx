import ReportTable from '@/features/reports/components/ReportTable'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

const Page = () => {
  return (
    <Suspense fallback={null}>
      <ReportTable />
    </Suspense>
  )
}

export default Page