import React from 'react'; 
import AuthComponent  from '@/components/auth';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function Accounts() {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <AuthComponent variant="login" />
            </Box>
        </Box>
    )
}