'use client';

import { RegisterAccount } from '@/sections/accounts/AddAccount';
import { useRouter } from 'next/navigation';
import { fetchClientById } from '@/lib/api/fetchAccount';
import { useEffect, useState, use } from 'react';
import { User } from '@/types/user';
import { Box, CircularProgress } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';
import { useLoading } from '@/context/LoadingContext';

export default function UpdateCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { showLoader, hideLoader } = useLoading();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [account, setAccount] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { id } = use(params);

  useEffect(() => { 
    const loadAccount = async () => {
      showLoader();
      try {
        const data = await fetchClientById(id);
        setAccount(data);
      } catch (err) {
        console.error('Error loading account:', err); // Debugging line
        setError('Failed to load employee data');
      } finally {
        setIsInitialLoad(false);
        hideLoader();
      }
    };

    // Simulate initial load (you can remove this if you want immediate API call)
    const timer = setTimeout(() => {
      loadAccount();
    }, 300);

    return () => clearTimeout(timer);
  }, [id, showLoader, hideLoader]);

  if (isInitialLoad) {
    return (
      <Box sx={{ display: 'flex', width: '100%' }}>
        <NavBar />
        <Box sx={{ 
          flexDirection: 'column', 
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <NavBar />
      <Box sx={{ flexDirection: 'column', flex: 1 }}>
        <TopBar />
        
        <RegisterAccount 
          account={account}
          isEditMode={true}
          onBackClick={() => router.push('/accounts')}
          onSuccess={() => router.push('/accounts')}
        />
      </Box>
    </Box>
  );
}