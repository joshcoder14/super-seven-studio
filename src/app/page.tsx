import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserHome from '@/components/UserHome';

export default function Home() {
  return (
    <ProtectedRoute>
      <UserHome />
    </ProtectedRoute>
  );
}