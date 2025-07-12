'use client';

import React, { useState, useEffect } from 'react';
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
import Preloader from '@/components/Preloader';

interface WorkloadDetailsComponentProps {
    workloadId: string;
}

export function WorkloadDetailsComponent({ workloadId }: WorkloadDetailsComponentProps): React.JSX.Element {
    const [workloadDetails, setWorkloadDetails] = useState<WorkloadApiItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(false);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const details = await fetchWorkloadDetailsById(workloadId);
                setWorkloadDetails(details);
            } catch (err) {
                console.error('Failed to fetch workload details:', err);
                setError(err instanceof Error ? err.message : 'Failed to load workload details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [workloadId]);

    if (loading) return <Preloader />;

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

    // Format dates
    const bookingDate = dayjs(workloadDetails.booking_date).format('dddd, MMMM D');
    const releaseDate = workloadDetails.expected_completion_date 
        ? dayjs(workloadDetails.expected_completion_date).format('MMMM D, YYYY')
        : 'Not set';

    return (
        <WorkloadContainer sx={{ paddingBottom: '30px' }}>
            <HeadingComponent /> 
            <WorkloadWrapper>
                <Details className="view-details">
                    <Box className="event-head">
                        <Box className="event-icon"/>
                        <Box className="event-name">
                            <h2 className="title">{workloadDetails.event_name}</h2>
                            <Typography component="span" className="event-date">
                                {bookingDate}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="event-info">
                        <Box className="left-info">
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.eventProfile} alt="profile icon" />
                                <Typography component="span">{workloadDetails.customer_name}</Typography>
                            </Box>
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.packageIcon} alt="package icon" />
                                <Typography component="span">{workloadDetails.package_name}</Typography>
                            </Box>
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.clockIcon} alt="clock icon" />
                                <Typography component="span">{workloadDetails.ceremony_time}</Typography>
                            </Box>
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.locationIcon} alt="location icon" />
                                <Typography component="span">{workloadDetails.booking_address}</Typography>
                            </Box>
                        </Box>
                        <Box className="right-info">
                            <Box className="client-info">
                                <Box>Release Date:</Box>
                                <Typography 
                                    component="span"
                                    className='release-date'
                                >
                                    {releaseDate}
                                </Typography>
                            </Box>
                            <Box className="client-info">
                                <Box>Status:</Box>
                                <Typography
                                    className={`status ${workloadDetails.booking_workload_status.toLowerCase()}`}
                                    component="span"
                                >
                                    {workloadDetails.booking_workload_status}
                                </Typography>
                            </Box>
                            <Box className="client-info" sx={{ display: 'flex', flexDirection: 'column !important', alignContent: 'flex-start' }}>
                                <Box>Link Attached:</Box>
                                {workloadDetails.link ? (
                                    <Link href={workloadDetails.link} target="_blank">
                                        {workloadDetails.link}
                                    </Link>
                                ) : (
                                    <Typography component="span" sx={{ fontStyle: 'italic' }}>No link attached</Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Details>

                {/* Pass assigned employees to the table */}
                <WorkLoadViewTable 
                    assignedEmployees={workloadDetails.assigned_employees || []} 
                />
            </WorkloadWrapper>
        </WorkloadContainer>
    );
}