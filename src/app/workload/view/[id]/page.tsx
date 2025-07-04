import React from 'react';
import { WorkloadDetailsComponent } from '@/sections/workload/WorkloadDetails';

export default function Workload({ params }: { params: { id: string } }) {
    return <WorkloadDetailsComponent workloadId={params.id} />;
}