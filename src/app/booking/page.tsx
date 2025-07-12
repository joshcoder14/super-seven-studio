import React from 'react'; 
import { BookingComponent } from '@/sections/booking';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function Booking() {
    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
                <BookingComponent/>
            </Box>
        </Box>
    )
}