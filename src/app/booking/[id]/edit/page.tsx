'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import EditBookingComponent from '@/sections/booking/EditBooking';
import { paths } from '@/paths';

export default function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <EditBookingComponent
      bookingId={id}
      onCancel={() => router.push(paths.booking)}
    />
  );
}