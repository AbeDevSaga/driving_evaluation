"use client";
import StudentsTable from "@/features/user-management/component/StudentsTable";
import { Suspense } from 'react'

export const dynamic = 'force-dynamic';


function StudentsList() {

    return (
        <>

            <Suspense fallback={null}>
                <StudentsTable />
            </Suspense>
        </>
    );
}

export default StudentsList;
