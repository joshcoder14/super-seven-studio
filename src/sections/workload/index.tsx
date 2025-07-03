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
import { fetchWorkloads } from '@/lib/api/fetchWorkloads';
import { MappedWorkloadItem } from '@/types/workload';

export function WorkloadComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filterValue, setFilterValue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [workloadData, setWorkloadData] = useState<MappedWorkloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MappedWorkloadItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkloads(debouncedSearchTerm, filterValue, router);
        setWorkloadData(data);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filterValue, debouncedSearchTerm, router]);

  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    if (urlFilter && workloadFilterOptions.some(opt => opt.value === urlFilter)) {
      setFilterValue(urlFilter);
    } else {
      setFilterValue('all');
    }
  }, [searchParams]);

  const handleFilterChange = (value: string) => {
    if (!workloadFilterOptions.some(opt => opt.value === value)) return;
    
    setFilterValue(value);
    
    const params = new URLSearchParams();
    params.set('filter', value);
    router.push(`${paths.workload}?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openModal = (eventData: MappedWorkloadItem) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleUpdateSuccess = () => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchWorkloads(debouncedSearchTerm, filterValue, router);
        setWorkloadData(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };
  
  return (
    <WorkloadContainer>
      <HeadingComponent /> 
      <WorkloadWrapper>
        <FilterArea>
          <FilterBy
            options={workloadFilterOptions}
            selectedValue={filterValue}
            onFilterChange={handleFilterChange}
            label="Filter By:"
          />
          <SearchBox 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onDebouncedChange={setDebouncedSearchTerm}
            placeholder="Search events..."
            debounceTime={600}
          />
        </FilterArea>

        <WorkLoadTable 
          data={workloadData} 
          loading={loading}
          onEditClick={openModal}
        />

        <EditModal 
          open={isModalOpen} 
          onClose={closeModal} 
          eventData={selectedEvent}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </WorkloadWrapper>
    </WorkloadContainer>
  );
}