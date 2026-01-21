import PermissionList from "@/features/template/component/permissionList/permissionList";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';

function Permissions() {
  return (
    <Suspense fallback={null}>
      <PermissionList />
    </Suspense>
  );
}

export default Permissions;
