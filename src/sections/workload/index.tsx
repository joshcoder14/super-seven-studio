'use client';

import React, { useState, useEffect } from 'react';
import { WorkloadContainer, WorkloadWrapper, FilterArea } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { FilterBy } from '@/components/Filter';
import { SearchBox } from '@/components/Search';
import { WorkLoadTable } from './WorkloadTable';
import EditModal from './Modal';
import { workloadFilterOptions } from '@/utils/filterOptions';
import { useRouter, useSearchParams } from 'next/navigation';
import { paths } from '@/paths';

export function WorkloadComponent(): React.JSX.Element {
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
        if (urlFilter && workloadFilterOptions.some(opt => opt.value === urlFilter)) {
            setFilterValue(urlFilter);
        }
    }, [searchParams]);

    const handleFilterChange = (value: string) => {
        if (!workloadFilterOptions.some(opt => opt.value === value)) return;
        
        setFilterValue(value);
        setPage(0);
        
        // Update URL with the new filter parameter
        const params = new URLSearchParams(searchParams.toString());
        params.set('filter', value);
        router.push(`${paths.workload}?${params.toString()}`, { scroll: false });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const openModal = (eventData: any) => {
        setSelectedEvent(eventData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };
  
    return (
        <WorkloadContainer>
            <HeadingComponent /> 
            <WorkloadWrapper>
                <FilterArea>
                    <FilterBy
                        options={workloadFilterOptions} // Using workload-specific options
                        selectedValue={filterValue}
                        onFilterChange={handleFilterChange}
                        label="Filter By:"
                    />
                    <SearchBox 
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                    />
                </FilterArea>

                {/* Workload Table Cells */}
                <WorkLoadTable onEditClick={openModal}/>

                {/* Workload Modal */}
                <EditModal open={isModalOpen} onClose={closeModal} eventData={selectedEvent} />
            </WorkloadWrapper>
        </WorkloadContainer>
    );
}