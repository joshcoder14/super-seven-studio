import React, { Suspense } from 'react';
import ReportsHome from '@/sections/reports';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';
import Preloader from '@/components/Preloader';

export default function Reports() {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <Suspense fallback={<Preloader />}>
                    <ReportsHome/>
                </Suspense>
            </Box>
        </Box>
    )
}