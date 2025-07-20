import React from 'react'; 
import AuthComponent  from '@/components/auth';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Register | Super Seven Studio",
    description: "Super Seven Studio",
};

export default function Accounts() {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <AuthComponent variant="signup" />
            </Box>
        </Box>
    )
}