'use client';

import React from 'react';
import { WorkloadContainer, WorkloadWrapper } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { WorkLoadViewTable } from './WorkloadViewTable';
import { 
    Details 
} from './styles';
import { Box, Typography } from '@mui/material';
import { icons } from '@/icons';
import Image from 'next/image';
import Link from 'next/link';

export function WorkloadDetailsComponent(): React.JSX.Element {
    const status = 'scheduled';
    return (
        <WorkloadContainer sx={{ paddingBottom: '30px' }}>
            <HeadingComponent /> 
            <WorkloadWrapper>
                <Details className="view-details">
                    <Box className="event-head">
                        <Box className="event-icon"/>
                        <Box className="event-name">
                            <h2 className="title">Charlie Birthday</h2>
                            <Typography component="span" className="event-date">Monday, December 29</Typography>
                        </Box>
                    </Box>
                    <Box className="event-info">
                        <Box className="left-info">
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.eventProfile} alt="profile icon" />
                                <Typography component="span">Smile Services</Typography>
                            </Box>
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.packageIcon} alt="package icon" />
                                <Typography component="span">Package B</Typography>
                            </Box>
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.clockIcon} alt="clock icon" />
                                <Typography component="span">7:00AM - 7:00PM</Typography>
                            </Box>
                            <Box className="client-info">
                                <Image width={25} height={25} src={icons.locationIcon} alt="location icon" />
                                <Typography component="span">Henan Resort, Panglao</Typography>
                            </Box>
                        </Box>
                        <Box className="right-info">
                            <Box className="client-info">
                                <Box>Release Date:</Box>
                                <Typography 
                                    component="span"
                                    className='release-date'
                                >
                                    February 1, 2025
                                </Typography>
                            </Box>
                            <Box className="client-info">
                                <Box>Status:</Box>
                                <Typography
                                    className={`status ${status}`}
                                    component="span"
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Typography>
                            </Box>
                            <Box className="client-info" sx={{ display: 'flex', flexDirection: 'column !important', alignContent: 'flex-start' }}>
                                <Box>Link Attached:</Box>
                                <Link href="#">https://drive.google.com/drive/u/1/folders/1ZjgOidfgdfgrgt56</Link>
                            </Box>
                        </Box>
                    </Box>
                </Details>

                <WorkLoadViewTable />
            </WorkloadWrapper>
        </WorkloadContainer>
    );
}