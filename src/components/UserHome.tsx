'use client';

import React from 'react';
import { AdminHome } from '@/sections/adminHome';
import { SecretaryHome } from '@/sections/secretary';
import { PhotographerHome } from '@/sections/photographer';
import { EditorHome } from '@/sections/editor';
import { ClientHome } from '@/sections/client';
import { useAuth } from '@/context/AuthContext';

export default function UserHome() {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    if (user.user_role === 'Owner') {
        return <AdminHome />;
    } else if (user.user_role === 'Secretary') {
        return <SecretaryHome />;
    } else if (user.user_role === 'Photographer') {
        return <PhotographerHome />;
    } else if (user.user_role === 'Editor') {
        return <EditorHome />;
    } else if (user.user_role === 'Client') {
        return <ClientHome />;
    } else {
        return <div style={{ color: 'red', paddingTop: '100px' }}>Unauthorized access</div>;
    }
}