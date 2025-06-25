'use client';

import React, { useState } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { HeadingComponent } from '@/components/Heading';
import { SearchBox } from '@/components/Search';
import { ActionButton, ButtonEdit, ButtonChangePassword } from '@/sections/settings/styles';
import { AddAccount } from '@/sections/accounts/styles';
import { PackageContent } from './styles';
import PackageTable from './PackageTable';
import AddOns from './AddOnsTable';
import { Box } from '@mui/material';

export function PackageHome(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<'package' | 'add-ons'>('package');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    return (
        <HomeContainer>
            <HeadingComponent />
            <PackageContent>
                <ActionButton>
                
                    <ButtonEdit 
                        className={`btn ${activeTab === 'package' ? 'active' : ''}`}
                        onClick={() => setActiveTab('package')}
                    >
                        Package
                    </ButtonEdit>

                    <ButtonChangePassword 
                        className={`btn ${activeTab === 'add-ons' ? 'active' : ''}`}
                        onClick={() => setActiveTab('add-ons')}
                    >
                        Add-ons
                    </ButtonChangePassword>

                    <AddAccount
                        sx={{ marginLeft: '25px' }}
                    >
                        {activeTab === 'package' ? 'Add Package' : 'Add Add-on'}
                    </AddAccount>

                </ActionButton>
                <SearchBox 
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
            </PackageContent>
            
            <Box sx={{ padding: '0 30px' }}>
                {/* <PackageTable/> */}
                {activeTab === 'package' ? <PackageTable/> : <AddOns/>}
            </Box>

        </HomeContainer>
    );
}