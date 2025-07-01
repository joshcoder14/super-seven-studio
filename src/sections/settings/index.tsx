'use client';

import React, { useState } from 'react';
import { SettingsContainer, ActionButton, ButtonEdit, ButtonChangePassword } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { EditProfile } from './editProfile';
import { ChangePasswordComponent } from './changePassword';

export function Settings(): React.JSX.Element {

    const [activeTab, setActiveTab] = useState<'edit' | 'password'>('edit');

    return (
        <SettingsContainer>
            <HeadingComponent/>

            <ActionButton>

                <ButtonEdit 
                    className={`btn ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('edit')}
                >
                    Edit Profile
                </ButtonEdit>

                <ButtonChangePassword 
                    className={`btn ${activeTab === 'password' ? 'active' : ''}`}
                    onClick={() => setActiveTab('password')}
                >
                    Change Password
                </ButtonChangePassword>

            </ActionButton>

            {activeTab === 'edit' ? <EditProfile/> : <ChangePasswordComponent/>}

        </SettingsContainer>
    );
}