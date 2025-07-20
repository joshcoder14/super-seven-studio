'use client';
import React from 'react';
import { paths } from '@/paths';
import { Box, Link, Typography } from '@mui/material';
import { NotFoundContainer, BoxWrapper } from './styles';

export function NotFound() {
    return (
        <NotFoundContainer className="page-404">
            <BoxWrapper className="page-404-container">
                <Typography component="h1" className="error-code">404</Typography>
                <Typography component="p" className="error-message">Oops! Page not found.</Typography>
                <Typography component="p" className="help-text">Sorry, but the page that you requested doesn't exist.</Typography>
                <Box className="page-404-btn">
                    <Link className="primary-btn" href={paths.home}>Back to homepage</Link>
                </Box>
            </BoxWrapper>
        </NotFoundContainer>
    );
}