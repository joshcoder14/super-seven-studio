import React from 'react';
import { use } from 'react';
import BillingPayment from '@/sections/billing/BillingPayment';

export default function BillingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return (
        <BillingPayment billingId={id} />
    );
}