'use client';

import { RegisterAccount } from '@/sections/accounts/AddAccount';
import { useRouter } from 'next/navigation';
import { fetchClientById } from '@/lib/api/fetchAccount';
import { useEffect, useState, use } from 'react';
import { User } from '@/types/user';

export default function UpdateCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [account, setAccount] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = use(params);

  useEffect(() => { 
    const loadAccount = async () => {
      try {
        const data = await fetchClientById(id);
        setAccount(data);
      } catch (err) {
        console.error('Error loading account:', err); // Debugging line
        setError('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <RegisterAccount 
      account={account}
      isEditMode={true}
      onBackClick={() => router.push('/accounts')}
      onSuccess={() => router.push('/accounts')}
    />
  );
}