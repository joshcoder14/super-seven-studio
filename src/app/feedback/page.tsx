import React, { Suspense } from 'react';
import { FeedbackComponent } from '@/sections/feedback';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';
import Preloader from '@/components/Preloader';

export default function Feedback() {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <Suspense fallback={<Preloader />}>
                    <FeedbackComponent/>
                </Suspense>
            </Box>
        </Box>
    )
}