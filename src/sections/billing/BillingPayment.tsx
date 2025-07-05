'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { BillingDetailsComponent } from '@/components/BillingDetails';
import { HeadingComponent } from '@/components/Heading';
import { BillingPaymentContainer, BillingDetails, TransactionWrapper } from './styles';
import { Billing, BillingDetailsProps } from '@/types/billing';
import { PaymentCardComponent } from '@/components/paymentCard';
import { TransactionTable } from '@/components/TransactionTable';
import { fetchBillingDetails } from '@/lib/api/fetchBilling';

export default function BillingPayment({ billingId }: BillingDetailsProps): React.JSX.Element {
    const [billing, setBilling] = useState<Billing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const loadBillingDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchBillingDetails(billingId);
            setBilling(data);
        } catch (err) {
            setError('Failed to load billing details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [billingId]);
    
    useEffect(() => {
        loadBillingDetails();
    }, [loadBillingDetails]);
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }
    
    if (!billing) {
        return <Typography sx={{ p: 2 }}>Billing not found</Typography>;
    }
    
    return (
        <BillingPaymentContainer>
            <HeadingComponent />
            <BillingDetails>
                <BillingDetailsComponent billing={billing} />
                <PaymentCardComponent 
                    billing={billing} 
                    billingId={billingId} 
                    onPaymentSuccess={loadBillingDetails} 
                />
            </BillingDetails>
            <TransactionWrapper>
                <TransactionTable transactions={billing?.transactions} />
            </TransactionWrapper>
        </BillingPaymentContainer>
    )
}