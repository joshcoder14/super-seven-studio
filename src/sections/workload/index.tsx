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
import { CustomTablePagination } from '@/components/TablePagination';

export function WorkloadComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, isLoggingOut } = useAuth();
  const [filterValue, setFilterValue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [workloadData, setWorkloadData] = useState<MappedWorkloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MappedWorkloadItem | null>(null);

  // Pagination state
  const [page, setPage] = useState(1); // API uses 1-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = useCallback(async () => {
    if (authLoading || !user) return;

    setLoading(true);
    try {
      let response: { 
        data: MappedWorkloadItem[]; 
        total: number;
        lastPage: number;
      };

      const isEmployee = user.user_role === 'Editor' || user.user_role === 'Photographer';

      if (isEmployee) {
        response = await fetchEmployeeWorkloads(
          debouncedSearchTerm, 
          filterValue, 
          router,
          page,
          rowsPerPage,
          isLoggingOut
        );
      } else {
        response = await fetchWorkloads(
          debouncedSearchTerm, 
          filterValue, 
          router,
          page,
          rowsPerPage,
          isLoggingOut
        );
      }

      setWorkloadData(response.data);
      setTotalCount(response.total);
      setLastPage(response.lastPage);

      if (page > response.lastPage) {
        setPage(1);
      }

    } catch (error) {
      console.error('Data fetching error:', error);
      setWorkloadData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    filterValue,
    debouncedSearchTerm,
    page,
    rowsPerPage,
    router,
    user,
    authLoading,
    isLoggingOut
  ]);

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

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null, 
    newPage: number
  ) => {
    // Convert to 1-based index for API
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);  // Reset to first page
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

        <CustomTablePagination
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page - 1}  // Convert to 0-based for MUI component
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        {isModalOpen && (
          <EditModal 
            open={isModalOpen} 
            onClose={closeModal} 
            eventData={selectedEvent}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </WorkloadWrapper>
    </WorkloadContainer>
  );
}