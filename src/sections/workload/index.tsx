'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useLoading } from '@/context/LoadingContext';

export function WorkloadComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoading();
  const { user, loading: authLoading, isLoggingOut } = useAuth();
  
  // State management
  const [filterValue, setFilterValue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [workloadData, setWorkloadData] = useState<MappedWorkloadItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MappedWorkloadItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1); // API uses 1-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Loading states
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, { 
    data: MappedWorkloadItem[]; 
    total: number;
    lastPage: number;
  }>>({});

  const fetchData = useCallback(async () => {
    if (authLoading || !user) return;

    const cacheKey = `${user.user_role}-${filterValue}-${debouncedSearchTerm}-${page}-${rowsPerPage}`;
    
    // Return cached data if available (except for initial load)
    if (cache[cacheKey] && !isInitialLoad) {
      setWorkloadData(cache[cacheKey].data);
      setTotalCount(cache[cacheKey].total);
      setLastPage(cache[cacheKey].lastPage);
      return;
    }

    try {
      // Show full loader only for initial load or filter changes
      if (isInitialLoad || page === 1) {
        showLoader();
      } else {
        setIsTableLoading(true);
      }

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
      setError(null);

      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: {
          data: response.data,
          total: response.total,
          lastPage: response.lastPage
        }
      }));

      if (page > response.lastPage) {
        setPage(1);
      }

    } catch (error) {
      console.error('Data fetching error:', error);
      setError('Failed to fetch workload data');
      setWorkloadData([]);
      setTotalCount(0);
    } finally {
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      setIsTableLoading(false);
      hideLoader();
    }
  }, [
    filterValue,
    debouncedSearchTerm,
    page,
    rowsPerPage,
    router,
    user,
    authLoading,
    isLoggingOut,
    isInitialLoad,
    cache,
    showLoader,
    hideLoader
  ]);

  // Debounced API call effect
  useEffect(() => {
    if (!authLoading) { // Only fetch when auth is done loading
      const timer = setTimeout(() => {
        fetchData();
      }, 300);

      return () => clearTimeout(timer);
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

  const handleFilterChange = useCallback((value: string) => {
    if (!workloadFilterOptions.some(opt => opt.value === value)) return;
    
    setFilterValue(value);
    setPage(1);
    
    const params = new URLSearchParams();
    params.set('filter', value);
    router.push(`${paths.workload}?${params.toString()}`, { scroll: false });
  }, [router]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handlePageChange = useCallback((
    event: React.MouseEvent<HTMLButtonElement> | null, 
    newPage: number
  ) => {
    // Convert to 1-based index for API
    setPage(newPage + 1);
  }, []);

  const handleRowsPerPageChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);  // Reset to first page
  }, []);

  const openModal = useCallback((eventData: MappedWorkloadItem) => {
    setSelectedEvent(eventData);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleUpdateSuccess = useCallback(() => {
    // Invalidate cache and refetch
    setCache({});
    fetchData();
  }, [fetchData]);

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

        {error && (
          <div style={{ padding: '16px' }}>
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <WorkLoadTable 
          data={workloadData} 
          loading={isTableLoading}
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