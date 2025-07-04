'use client';

import React from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { HeadingComponent } from '@/components/Heading';
import BillingTable from './BillingTable';
import { Box } from '@mui/material';

export default function BillingComponent() {
    return (
        <HomeContainer>
            <HeadingComponent />
            <Box sx={{ padding: '0 30px' }}>
                <BillingTable />
            </Box>
        </HomeContainer>
    );
}