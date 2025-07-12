import React from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import EditBookingComponent from '@/sections/booking/EditBooking';
import { paths } from '@/paths';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <NavBar />
      <Box sx={{ flexDirection: 'column', flex: 1 }}>
        <TopBar />
        
        <EditBookingComponent
          bookingId={id}
          onCancel={() => router.push(paths.booking)}
        />
      </Box>
    </Box>
  );
}