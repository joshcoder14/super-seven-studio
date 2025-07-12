import React from 'react';
import { WorkloadComponent } from '@/sections/workload';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function Workload() {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <WorkloadComponent />
            </Box>
        </Box>
    )
}