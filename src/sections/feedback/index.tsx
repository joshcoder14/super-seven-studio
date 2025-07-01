'use client';

import React, { useState, useEffect } from 'react';
import { FeedbackContainer, FeedbackWrapper, FilterArea } from './styles';
import { HeadingComponent } from '@/components/Heading';

import { useRouter, useSearchParams } from 'next/navigation';
import { feedBackFilterOptions } from '@/utils/filterOptions';
import { FilterBy } from '@/components/Filter';
import { SearchBox } from '@/components/Search';
import { paths } from '@/paths';
import { FeedBackTable } from './FeedbackTable';
import { Box } from '@mui/material';

export function FeedbackComponent(): React.JSX.Element {
    
         const router = useRouter();
        const searchParams = useSearchParams();
        const [filterValue, setFilterValue] = useState('all');
        const [searchTerm, setSearchTerm] = useState('');
        const [page, setPage] = useState(0);
    
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [selectedEvent, setSelectedEvent] = useState<any>(null);

        // Initialize filter from URL
        useEffect(() => {
            const urlFilter = searchParams.get('filter');
            if (urlFilter && feedBackFilterOptions.some(opt => opt.value === urlFilter)) {
                setFilterValue(urlFilter);
            }
        }, [searchParams]);
    
        const handleFilterChange = (value: string) => {
            if (!feedBackFilterOptions.some(opt => opt.value === value)) return;
            
            setFilterValue(value);
            setPage(0);
            
            // Update URL with the new filter parameter
            const params = new URLSearchParams(searchParams.toString());
            params.set('filter', value);
            router.push(`${paths.feedback}?${params.toString()}`, { scroll: false });
        };
    
        const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
            setPage(0);
        };

    return (
        <FeedbackContainer>
            <HeadingComponent/>
                
            <FeedbackWrapper>
                <FilterArea>
                    <FilterBy
                        options={feedBackFilterOptions}
                        selectedValue={filterValue}
                        onFilterChange={handleFilterChange}
                        label="Filter By:"
                    />
                    <SearchBox 
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                    />
                </FilterArea>
                
                <FeedBackTable />
            </FeedbackWrapper>
        </FeedbackContainer>
    );
}