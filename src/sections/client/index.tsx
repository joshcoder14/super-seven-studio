'use client'
import React from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { HomeContent } from '@/components/home';
import { HeadingComponent } from '@/components/Heading';

export function ClientHome(): React.JSX.Element {
    return (
        <HomeContainer>
            <HeadingComponent/>
            <HomeContent/>
        </HomeContainer>
    )
}