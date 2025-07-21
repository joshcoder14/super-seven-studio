'use client';

import React, { useState, useEffect } from 'react';
import { SettingsContainer, ActionButton, LeftButton, RightButton } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { EditProfile } from './editProfile';
import { ChangePasswordComponent } from './changePassword';
import { useLoading } from '@/context/LoadingContext';
import { Box, CircularProgress } from '@mui/material';

export function Settings(): React.JSX.Element {
    const { showLoader, hideLoader } = useLoading();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [activeTab, setActiveTab] = useState<'edit' | 'password'>('edit');
    
    useEffect(() => {
        // Simulate loading (replace with actual data fetching if needed)
        const timer = setTimeout(() => {
            setIsInitialLoad(false);
            hideLoader();
        }, 300);

        return () => clearTimeout(timer);
    }, [hideLoader]);

    const handleTabChange = (tab: 'edit' | 'password') => {
        showLoader();
        setTimeout(() => {
            setActiveTab(tab);
            hideLoader();
        }, 200);
    };

    if (isInitialLoad) {
        return (
            <SettingsContainer>
                <HeadingComponent />
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                </Box>
            </SettingsContainer>
        );
    }

    return (
        <SettingsContainer>
            <HeadingComponent />

            <ActionButton>
                <LeftButton 
                    className={`btn ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={() => handleTabChange('edit')}
                    disabled={activeTab === 'edit'}
                >
                    Edit Profile
                </LeftButton>

                <RightButton 
                    className={`btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => handleTabChange('password')}
                    disabled={activeTab === 'password'}
                >
                    Change Password
                </RightButton>
            </ActionButton>

            {activeTab === 'edit' ? <EditProfile /> : <ChangePasswordComponent />}
        </SettingsContainer>
    );
}