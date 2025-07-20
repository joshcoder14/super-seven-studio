'use client';
import { useAuth } from '@/context/AuthContext';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Preloader from './Preloader';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <Preloader />
    );
  }

  return isAuthenticated ? children : null;
}