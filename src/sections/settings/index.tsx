'use client';

import React, { useState } from 'react';
import { SettingsContainer, ActionButton, LeftButton, RightButton } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { EditProfile } from './editProfile';
import { ChangePasswordComponent } from './changePassword';

export function Settings(): React.JSX.Element {

    const [activeTab, setActiveTab] = useState<'edit' | 'password'>('edit');

    return (
        <SettingsContainer>
            <HeadingComponent/>

            <ActionButton>

                <LeftButton 
                    className={`btn ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('edit')}
                >
                    Edit Profile
                </LeftButton>

                <RightButton 
                    className={`btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    Change Password
                </RightButton>

            </ActionButton>

            {activeTab === 'edit' ? <EditProfile/> : <ChangePasswordComponent/>}

        </SettingsContainer>
    );
}