'use client'
import React from 'react';
import { HomeContainer } from './styles';
import HomeContent from '@/components/home';
import { HeadingComponent } from '@/components/Heading';

export function AdminHome(): React.JSX.Element {
    return (
        <HomeContainer>
            <HeadingComponent/>
            <HomeContent/>
        </HomeContainer>
    )
}