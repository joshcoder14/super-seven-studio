import React from 'react';
import { PackageHome } from "@/sections/package";
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function Package() {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <PackageHome />
            </Box>
        </Box>
    )
}