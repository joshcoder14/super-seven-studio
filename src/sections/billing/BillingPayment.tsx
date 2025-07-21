'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { BillingDetailsComponent, AssessmentSection } from '@/components/BillingDetails';
import { HeadingComponent } from '@/components/Heading';
import { BillingPaymentContainer, BillingDetails, TransactionWrapper } from './styles';
import { Billing, BillingDetailsProps } from '@/types/billing';
import { PaymentCardComponent } from '@/components/paymentCard';
import { TransactionTable } from '@/components/TransactionTable';
import { fetchBillingDetails } from '@/lib/api/fetchBilling';
import { useAuth } from '@/context/AuthContext';
import { useLoading } from '@/context/LoadingContext';

export default function BillingPayment({ billingId }: BillingDetailsProps): React.JSX.Element {
    const { showLoader, hideLoader } = useLoading();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [billing, setBilling] = useState<Billing | null>(null);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const isClient = user?.user_role === 'Client';
    const isPartial = billing?.status.toLowerCase() === 'partial';
    
    const loadBillingDetails = useCallback(async () => {
        try {
            showLoader();
            const data = await fetchBillingDetails(billingId);
            setBilling(data);
            setError('');
        } catch (err) {
            setError('Failed to load billing details');
            console.error(err);
        } finally {
            setIsInitialLoad(false);
            hideLoader();
        }
    }, [billingId, showLoader, hideLoader]);

    useEffect(() => {
        // Simulate initial load (you can remove this if you want immediate API call)
        const timer = setTimeout(() => {
            loadBillingDetails();
        }, 300);

        return () => clearTimeout(timer);
    }, [loadBillingDetails]);
    
    if (isInitialLoad) {
        return (
            <BillingPaymentContainer>
                <HeadingComponent />
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                </Box>
            </BillingPaymentContainer>
        );
    }
    
    if (error) {
        return (
            <BillingPaymentContainer>
                <HeadingComponent />
                <Box sx={{ p: 2 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </BillingPaymentContainer>
        );
    }
    
    if (!billing) {
        return (
            <BillingPaymentContainer>
                <HeadingComponent />
                <Typography sx={{ p: 2 }}>Billing not found</Typography>
            </BillingPaymentContainer>
        );
    }
    
    return (
        <BillingPaymentContainer>
            <HeadingComponent />
            <BillingDetails>
                <BillingDetailsComponent billing={billing} />
                {!isClient ? (
                    <PaymentCardComponent 
                        billing={billing} 
                        billingId={billingId} 
                        onPaymentSuccess={loadBillingDetails} 
                    />
                ): null}
                {isClient ? (
                    <AssessmentSection billing={billing} isPartial={isPartial} />
                ) : null}
            </BillingDetails>
            <TransactionWrapper>
                <TransactionTable transactions={billing?.transactions} />
            </TransactionWrapper>
        </BillingPaymentContainer>
    );
}