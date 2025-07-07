'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { WorkloadContainer, WorkloadWrapper, FilterArea } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { FilterBy } from '@/components/Filter';
import { SearchBox } from '@/components/Search';
import { WorkLoadTable } from './WorkloadTable';
import EditModal from './Modal';
import { workloadFilterOptions } from '@/utils/filterOptions';
import { useRouter, useSearchParams } from 'next/navigation';
import { paths } from '@/paths';
import { fetchWorkloads, fetchEmployeeWorkloads } from '@/lib/api/fetchWorkloads';
import { MappedWorkloadItem } from '@/types/workload';
import { useAuth } from '@/context/AuthContext';

export function WorkloadComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [filterValue, setFilterValue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [workloadData, setWorkloadData] = useState<MappedWorkloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MappedWorkloadItem | null>(null);

  const fetchData = useCallback(async () => {
    if (authLoading) {
      console.log('Auth still loading, skipping fetch');
      return;
    }

    setLoading(true);
    try {
      let data: MappedWorkloadItem[] = [];

      const isEmployee = user?.user_role === 'Editor' || user?.user_role === 'Photographer';
      
      if (isEmployee) {
        data = await fetchEmployeeWorkloads(debouncedSearchTerm, filterValue, router);
      } else {
        data = await fetchWorkloads(debouncedSearchTerm, filterValue, router);
      }
      setWorkloadData(data);
    } catch (error) {
      console.error('Data fetching error:', error);
      setWorkloadData([]);
    } finally {
      setLoading(false);
    }
  }, [filterValue, debouncedSearchTerm, router, user]);

  useEffect(() => {
    if (!authLoading) { // Only fetch when auth is done loading
      fetchData();
    }
  }, [fetchData, authLoading]);

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
    fetchData();
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