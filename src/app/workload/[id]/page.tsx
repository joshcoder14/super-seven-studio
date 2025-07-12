import React from 'react';
import { use } from 'react';
import { WorkloadDetailsComponent } from '@/sections/workload/WorkloadDetails';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function Workload({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <WorkloadDetailsComponent workloadId={id} />
            </Box>
        </Box>
    );
}