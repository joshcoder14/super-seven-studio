'use client';

import { RegisterAccount } from '@/sections/accounts/AddAccount';
import { useRouter } from 'next/navigation';

export default function AddEmployeePage() {
  const router = useRouter();

  return (
    <RegisterAccount 
      onBackClick={() => router.push('/accounts')}
      onSuccess={() => router.push('/accounts')}
    />
  );
}