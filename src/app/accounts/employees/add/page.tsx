'use client';

import { useEffect, useState } from 'react';
import { RegisterAccount } from '@/sections/accounts/AddAccount';
import { useRouter } from 'next/navigation';
import Preloader from '@/components/Preloader';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';

export default function AddEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Preloader />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <NavBar />
      <Box sx={{ flexDirection: 'column', flex: 1 }}>
        <TopBar />
        <RegisterAccount 
          onBackClick={() => router.push('/accounts')}
          onSuccess={() => router.push('/accounts')}
        />
      </Box>
    </Box>
  );
}
