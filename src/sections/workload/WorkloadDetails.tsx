'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { WorkloadContainer, WorkloadWrapper } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { WorkLoadViewTable } from './WorkloadViewTable';
import { Details } from './styles';
import { Box, Typography, Alert } from '@mui/material';
import { icons } from '@/icons';
import Image from 'next/image';
import Link from 'next/link';
import { fetchWorkloadDetailsById } from '@/lib/api/fetchWorkloads';
import { WorkloadApiItem } from '@/types/workload';
import dayjs from 'dayjs';
import { useLoading } from '@/context/LoadingContext';

interface WorkloadDetailsComponentProps {
    workloadId: string;
}

interface DetailItem {
    icon: string;
    alt: string;
    label: string;
    value: React.ReactNode;
}

const DATE_FORMATS = {
    booking: 'dddd, MMMM D',
    release: 'MMMM D, YYYY'
};

export function WorkloadDetailsComponent({ workloadId }: WorkloadDetailsComponentProps): React.JSX.Element {
    const { showLoader, hideLoader } = useLoading();
    const [workloadDetails, setWorkloadDetails] = useState<WorkloadApiItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const fetchWorkloadData = useCallback(async () => {
        try {
            if (isInitialLoad) {
                showLoader();
            }
            setError(null);
            const details = await fetchWorkloadDetailsById(workloadId);
            setWorkloadDetails(details);
        } catch (err) {
            console.error('Failed to fetch workload details:', err);
            setError(err instanceof Error ? err.message : 'Failed to load workload details');
        } finally {
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
            hideLoader();
        }
    }, [workloadId, isInitialLoad, showLoader, hideLoader]);

    useEffect(() => {
        fetchWorkloadData();
    }, [fetchWorkloadData]);

    // Memoized formatted dates
    const { bookingDate, releaseDate } = useMemo(() => {
        if (!workloadDetails) return { bookingDate: '', releaseDate: 'Not set' };
        
        return {
            bookingDate: dayjs(workloadDetails.booking_date).format(DATE_FORMATS.booking),
            releaseDate: workloadDetails.expected_completion_date 
                ? dayjs(workloadDetails.expected_completion_date).format(DATE_FORMATS.release)
                : 'Not set'
        };
    }, [workloadDetails]);

    // Memoized info items
    const leftInfoItems = useMemo<DetailItem[]>(() => {
        if (!workloadDetails) return [];
        
        return [
            {
                icon: icons.eventProfile,
                alt: 'profile icon',
                label: '',
                value: workloadDetails.customer_name
            },
            {
                icon: icons.packageIcon,
                alt: 'package icon',
                label: '',
                value: workloadDetails.package_name
            },
            {
                icon: icons.clockIcon,
                alt: 'clock icon',
                label: '',
                value: workloadDetails.ceremony_time
            },
            {
                icon: icons.locationIcon,
                alt: 'location icon',
                label: '',
                value: workloadDetails.booking_address
            }
        ];
    }, [workloadDetails]);

    const rightInfoItems = useMemo<DetailItem[]>(() => {
        if (!workloadDetails) return [];
        
        return [
            {
                icon: '',
                alt: '',
                label: 'Release Date',
                value: (
                    <Typography component="span" className='release-date'>
                        {releaseDate}
                    </Typography>
                )
            },
            {
                icon: '',
                alt: '',
                label: 'Status',
                value: (
                    <Typography
                        className={`status ${workloadDetails.booking_workload_status.toLowerCase()}`}
                        component="span"
                    >
                        {workloadDetails.booking_workload_status}
                    </Typography>
                )
            },
            {
                icon: '',
                alt: '',
                label: 'Link Attached',
                value: workloadDetails.link ? (
                    <Link href={workloadDetails.link} target="_blank" rel="noopener noreferrer">
                        {workloadDetails.link}
                    </Link>
                ) : (
                    <Typography component="span" sx={{ fontStyle: 'italic' }}>
                        No link attached
                    </Typography>
                )
            }
        ];
    }, [workloadDetails, releaseDate]);

    const renderDetailItem = useCallback((item: DetailItem, index: number) => (
        <Box key={`${item.label}-${index}`} className="client-info">
            {item.icon && (
                <Image 
                    width={25} 
                    height={25} 
                    src={item.icon} 
                    alt={item.alt} 
                    priority={index < 2} // Prioritize loading first couple icons
                />
            )}
            {item.label && <Box component="span">{item.label}:</Box>}
            <Typography component="span">{item.value}</Typography>
        </Box>
    ), []);

    if (isInitialLoad) {
        return <></>; // The global loader will handle this
    }

    if (error) {
        return (
            <WorkloadContainer sx={{ paddingBottom: '30px' }}>
                <HeadingComponent />
                <Alert severity="error" sx={{ my: 3 }}>
                    {error}
                </Alert>
            </WorkloadContainer>
        );
    }

    if (!workloadDetails) {
        return (
            <WorkloadContainer sx={{ paddingBottom: '30px' }}>
                <HeadingComponent />
                <Alert severity="warning" sx={{ my: 3 }}>
                    Workload details not found
                </Alert>
            </WorkloadContainer>
        );
    }

    return (
        <WorkloadContainer sx={{ paddingBottom: '30px' }}>
            <HeadingComponent /> 
            <WorkloadWrapper>
                <Details className="view-details">
                    <Box className="event-head">
                        <Box className="event-icon"/>
                        <Box className="event-name">
                            <Typography variant="h2" className="title">
                                {workloadDetails.event_name}
                            </Typography>
                            <Typography component="span" className="event-date">
                                {bookingDate}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="event-info">
                        <Box className="left-info">
                            {leftInfoItems.map(renderDetailItem)}
                        </Box>
                        <Box className="right-info">
                            {rightInfoItems.map(renderDetailItem)}
                        </Box>
                    </Box>
                </Details>

                <WorkLoadViewTable 
                    assignedEmployees={workloadDetails.assigned_employees || []} 
                />
            </WorkloadWrapper>
        </WorkloadContainer>
    );
}