'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    CloseWrapper, 
    Details
} from '@/sections/workload/styles';
import { FeedbackField } from './styles';
import { Box, Typography, CircularProgress, TextField, Button, keyframes, styled } from '@mui/material';
import { icons } from '@/icons';
import Image from 'next/image';
import { FeedbackApiItem, FeedbackDetailResponse } from '@/types/feedback';
import { markAsPosted, markAsUnposted, viewFeedback } from '@/lib/api/fetchFeedback';
import { getAddonNames } from '@/utils/billing';
import Swal from 'sweetalert2';
import { fadeInRight, fadeOutRight } from '@/utils/animate';

export interface ViewModalProps {
    open: boolean;
    onClose: () => void;
    feedbackId: string | null;
    onFeedbackUpdated?: () => void;
}

// Define ModalContainer with transient prop $closing
const StyledModalContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$closing',
})<{ $closing?: boolean }>(({ theme, $closing }) => ({
  animation: `${$closing ? fadeOutRight : fadeInRight} 0.3s forwards`,
  position: 'absolute',
  top: '0px',
  right: 0,
  maxWidth: '560px',
  width: '100%',
  height: 'auto',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  paddingBottom: '30px',
  zIndex: 1,
  border: '0.3px solid #E0E0E0',
  borderRadius: '4px',
}));

export default function FeedbackViewModal({ 
    open, 
    onClose, 
    feedbackId,
    onFeedbackUpdated  
}: ViewModalProps) {
    const [details, setDetails] = useState<FeedbackApiItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [shouldRender, setShouldRender] = useState(false);
    const [closing, setClosing] = useState(false);

    // Handle open/close transitions
    
    useEffect(() => {
        if (open) {
            // Open modal: show and animate in
            setShouldRender(true);
            setClosing(false);
        } else if (shouldRender) {
            // Start closing animation
            setClosing(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleClose = useCallback(() => {
        // Start closing animation
        setClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    useEffect(() => {

        // Handle Escape key press
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [open, handleClose]);

    useEffect(() => {
        if (open && feedbackId) {
            fetchFeedbackDetails();
        } else {
            // Reset state when closing modal
            setDetails(null);
            setError(null);
        }
    }, [open, feedbackId]);

    const fetchFeedbackDetails = async () => {
        if (!feedbackId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const bookingId = parseInt(feedbackId);
            const response: FeedbackDetailResponse = await viewFeedback(bookingId);
            setDetails(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch feedback details');
        } finally {
            setLoading(false);
        }
    };

    const handlePostToggle = async () => {
        if (!feedbackId || !details) return;
        
        const feedbackStatus = details.feedback_status === 'Posted';
        const actionType = feedbackStatus ? 'unpost' : 'post';
        const actionText = feedbackStatus ? 'unpost this feedback' : 'post this feedback';

        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `You are about to ${actionText}. This action will be visible to clients.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${actionType} it!`,
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;
        
        setIsProcessing(true);
        try {
            if (feedbackStatus) {
                // Unpost the feedback
                await markAsUnposted(parseInt(feedbackId));
                await Swal.fire({
                    title: 'Unposted!',
                    text: 'Feedback has been unposted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
            } else {
                // Post the feedback
                await markAsPosted(parseInt(feedbackId));
                await Swal.fire({
                    title: 'Posted!',
                    text: 'Feedback has been posted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
            }
            
            // Refetch details to update status
            await fetchFeedbackDetails();
            
            // Notify parent component to refresh list
            if (onFeedbackUpdated) onFeedbackUpdated();
            
            handleClose();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setError(errorMessage);
            await Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#d33',
            });
            
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {loading ? (
                <Box display="none" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : details ? (
                <StyledModalContainer 
                    ref={modalRef}
                    $closing={closing}
                >
                    <CloseWrapper onClick={handleClose}>
                        <Image width={18} height={18} src={icons.closeIcon} alt="close icon" />
                    </CloseWrapper>
                    <Details>
                        <Box className="event-head">
                            <Box className="event-icon"/>
                            <Box className="event-name">
                                <h2 className="title">{details.event_name}</h2>
                                <Typography component="span" className="event-date">
                                    {details.booking_date_detail}
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.eventProfile} alt="profile icon" />
                            <Typography component="span">{details.customer_name || 'N/A'}</Typography>
                        </Box>
                        
                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.packageIcon} alt="profile icon" />
                            <Typography component="span">{details.package_name}</Typography>
                        </Box>
                        
                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.packageIcon} alt="profile icon" />
                            <Typography component="span">{getAddonNames(details.add_ons) || 'None'}</Typography>
                        </Box>
                        
                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.clockIcon} alt="profile icon" />
                            <Typography component="span">{details.ceremony_time}</Typography>
                        </Box>

                        <Box className="client-info">
                            <Image width={25} height={25} src={icons.locationIcon} alt="location icon" />
                            <Typography component="span">{details.booking_address || 'No address provided'}</Typography>
                        </Box>   
                    </Details>
                    <FeedbackField>
                        <form action="">
                            <Box className="row">
                                <Typography component="p">Feedback</Typography>
                                <TextField
                                    id="outlined-textarea"
                                    multiline
                                    rows={5}
                                    variant="outlined"
                                    fullWidth
                                    value={details.feedback_detail || 'No feedback provided'}
                                    sx={{ backgroundColor: '#F7FAF5', fontFamily: 'Nunito Sans', fontSize: '14px' }}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>
                            <Box className="post-btn">
                                <Button 
                                    variant="contained"
                                    className={`${details.feedback_status === 'Posted' ? 'posted' : 'unposted'}`}
                                    color={details.feedback_status === 'Posted' ? 'error' : 'primary'}
                                    onClick={handlePostToggle}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : details.feedback_status === 'Posted' ? (
                                        'Unpost'
                                    ) : (
                                        'Post'
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </FeedbackField>
                </StyledModalContainer>
            ) : error ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <Typography color="error">{error}</Typography>
                </Box>
            ) : null}
        </>
    );
}