import React from 'react';
import { AdminHome } from '@/sections/adminHome';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function Home() {

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <NavBar />
      <Box sx={{ flexDirection: 'column', flex: 1 }}>
        <TopBar />
        <AdminHome />
      </Box>
    </Box>
  );
}