import React from 'react';
import { use } from 'react';
import { WorkloadDetailsComponent } from '@/sections/workload/WorkloadDetails';

export default function Workload({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <WorkloadDetailsComponent workloadId={id} />;
}