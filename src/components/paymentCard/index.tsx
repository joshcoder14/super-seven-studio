'use client';

import React, { useState } from 'react';
import { PaymentCardContainer, PaymentCard, PaymentMethod } from './styles';
import Image from 'next/image';
import { FormHeading } from '../Heading/FormHeading';
import { Box, Button, CircularProgress, TextField, Typography, Alert } from '@mui/material';
import { icons } from '@/icons';
import { Billing } from '@/types/billing';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import {paths} from '@/paths';
import { addPayment } from '@/lib/api/fetchBilling';

export function PaymentCardComponent({ 
  billing, 
  billingId,
  onPaymentSuccess 
}: { 
  billing: Billing | null; 
  billingId: string; 
  onPaymentSuccess: () => void;
}) {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash Payment');

    // Calculate balance as number
    const balance = billing ? Number(billing.balance) : 0;

    const togglePaymentMethod = () => {
        setIsPaymentMethodOpen(!isPaymentMethodOpen);
    };

    const handlePaymentSelect = (method: string) => {
        setSelectedPaymentMethod(method);
        setIsPaymentMethodOpen(false);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/,/g, '');
        const formattedValue = Number(value).toLocaleString();
        setAmount(formattedValue);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanAmount = amount.replace(/,/g, '');
        const amountNum = parseFloat(cleanAmount);
        
        if (!billing) {
            setError('Billing details not loaded');
            return;
        }
        
        if (isNaN(amountNum)) {
            setError('Please enter a valid amount');
            return;
        }
        
        if (amountNum > balance) {
            setError('Amount cannot exceed balance');
            return;
        }

        // Show SweetAlert confirmation
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'This process cannot be undone. Check the details properly.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2BB673',
            cancelButtonColor: '#AAAAAA',
            confirmButtonText: 'Yes, proceed',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            scrollbarPadding: false
        });

        // If user cancels, don't proceed
        if (!confirmation.isConfirmed) {
            return;
        }

        setIsSubmitting(true);
        
        try {
            await addPayment(
                billingId,
                amount.replace(/,/g, ''),
                selectedPaymentMethod === 'Cash Payment' ? '0' : '1',
                remarks
            );

            // Show success message
            await Swal.fire({
                title: 'Payment Successful!',
                text: 'The payment has been processed successfully',
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });

            router.push(paths.billing);

            // Refresh billing data
            onPaymentSuccess();
            setAmount('');
            setRemarks('');
            setError('');
        } catch (err: any) {
            // Show error message
            await Swal.fire({
                title: 'Payment Failed',
                text: err.message || 'An error occurred while processing your payment',
                icon: 'error',
                confirmButtonColor: '#3085d6',
            });
            setError(err.message || 'Payment failed');
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <PaymentCardContainer>
      <PaymentCard>
        <FormHeading title="Payment :" />

        {/* Fixed: Added onSubmit handler */}
        <form onSubmit={handleSubmit}>
            <Box className="row">
                {/* Amount Paid Field */}
                <Box className="form-group" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <label htmlFor='' className="form-label">Amount Paid</label>
                    <TextField
                        name="amount_paid"
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        size="small"
                        fullWidth
                    />
                </Box>

                <PaymentMethod>
                    <Box className="label">Payment Method</Box>
                    <Box 
                        className="payment-to" 
                        onClick={togglePaymentMethod}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Typography component="span">
                            {selectedPaymentMethod}
                        </Typography>
                        <Image
                            width={12}
                            height={7}
                            src={icons.angleDown}
                            alt="angle down"
                            className={isPaymentMethodOpen ? 'rotated' : ''}
                        />
                </Box>
                
                    {isPaymentMethodOpen && (
                        <Box className="dropdown-list">
                        <Box
                            className="row payment-option"
                            onClick={() => handlePaymentSelect('Cash Payment')}
                        >
                            <Typography component="span">Cash Payment</Typography>
                        </Box>
                        <Box
                            className="row payment-option"
                            onClick={() => handlePaymentSelect('Online Payment')}
                        >
                            <Typography component="span">Online Payment</Typography>
                        </Box>
                        </Box>
                    )}
                </PaymentMethod>

                {/* Remarks Field */}
                <Box className="form-group" sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <label htmlFor='' className="form-label">Remarks</label>
                    <TextField
                        name="remarks"
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        size="small"
                        fullWidth
                    />
                </Box>
            </Box>
          
            {/* Added error display */}
            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {error}
                </Alert>
            )}

            {/* Action Buttons */}
            <Box className="action-btn">
                <Button 
                    className='btn cancel' 
                    variant="outlined"
                    onClick={() => router.push('/billing')}
                    >
                    Cancel
                </Button>
                <Button 
                    className={`btn pay ${isSubmitting || balance === 0 ? 'disabled' : ''}`}
                    variant="contained" 
                    type="submit"
                    // Fixed: Compare numbers properly
                    disabled={isSubmitting || balance === 0}
                >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Pay'}
                </Button>
            </Box>
        </form>
      </PaymentCard>
    </PaymentCardContainer>
  );
}