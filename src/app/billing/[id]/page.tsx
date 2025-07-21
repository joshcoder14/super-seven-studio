import { use } from 'react';
import BillingPayment from '@/sections/billing/BillingPayment';
import { Box } from '@mui/material';
import { NavBar } from '@/components/SideBar';
import { TopBar } from '@/components/topbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Billing Payment | Super Seven Studio",
    description: "Super Seven Studio",
};

export default function BillingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <NavBar />
            <Box sx={{ flexDirection: 'column', flex: 1 }}>
                <TopBar />
            
                <BillingPayment billingId={id} />
            </Box>
        </Box>
    );
}