import RoleList from "@/features/template/component/roleList/roleList";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

function Roles() {
  return (
    <Suspense fallback={null}>
      <RoleList />
    </Suspense>
  );
}

export default Roles;
