'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { HeadingComponent } from '@/components/Heading';
import { Box, Button, Typography } from '@mui/material';

export default function ReportsHome(): React.JSX.Element {
    return (
        <HomeContainer>
            <HeadingComponent />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: '300px',
                    backgroundColor: '#FFFFFF',
                    border: '0.3px solid #E0E0E0',
                    borderRadius: '6px',
                }}
            >
                <Typography>Number of Bookings</Typography>
                {/* Add line graph here */}
            </Box>
            
            {/* Availed Packages */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: '300px',
                    backgroundColor: '#FFFFFF',
                    border: '0.3px solid #E0E0E0',
                    borderRadius: '6px',
                }}
            >
                <Typography>Availed Packages</Typography>
            </Box>


        </HomeContainer>
    );
}