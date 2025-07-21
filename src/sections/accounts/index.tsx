'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountContainer, AccountWrapper, TopArea, AddAccount } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { FilterBy } from '@/components/Filter';
import { SearchBox } from '@/components/Search';
import { AccountTable } from './AccountTable';
import { CustomTablePagination } from '@/components/TablePagination';
import { User, ApiResponse } from '@/types/user';
import { icons } from '@/icons';
import { fetchAllUsers } from '@/lib/api/fetchAccount';
import { accountFilterOptions } from '@/utils/filterOptions';
import { Box, CircularProgress } from '@mui/material';
import CheckboxComponent from '@/components/checkbox';
import { useLoading } from '@/context/LoadingContext';
import Swal from 'sweetalert2';

export function AccountComponent(): React.JSX.Element {
  const { showLoader, hideLoader } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('3');
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [cache, setCache] = useState<Record<string, ApiResponse>>({});
  
  // Initialize from URL parameters
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    const urlPage = searchParams.get('page');
    const urlSearch = searchParams.get('search');
    const urlInactive = searchParams.get('inactive');

    if (urlFilter && accountFilterOptions.some(opt => opt.value === urlFilter)) {
      setFilterValue(urlFilter);
    }

    if (urlPage) {
      setPage(parseInt(urlPage, 10));
    }

    if (urlSearch) {
      setSearchTerm(urlSearch);
    }

    if (urlInactive) {
      setShowInactive(urlInactive === 'true');
    }
  }, [searchParams]);

  // Memoized cache key
  const getCacheKey = useCallback(() => {
    return `${filterValue}-${searchTerm}-${page}-${rowsPerPage}-${showInactive}`;
  }, [filterValue, searchTerm, page, rowsPerPage, showInactive]);

  // Fetch data when params change
  const loadUsers = useCallback(async () => {
    const cacheKey = getCacheKey();
    
    // Return cached data if available (except for initial load)
    if (cache[cacheKey] && !isInitialLoad) {
      setApiResponse(cache[cacheKey]);
      return;
    }

    try {
      // Show full loader only for initial load or filter changes
      if (isInitialLoad || page === 1) {
        showLoader();
      } else {
        setIsTableLoading(true);
      }

      const response = await fetchAllUsers(
        searchTerm, 
        filterValue, 
        page, 
        rowsPerPage,
        showInactive
      );
      
      setApiResponse(response);
      setError(null);

      // Update cache
      setCache(prev => ({
        ...prev,
        [cacheKey]: response
      }));

      // Update URL to reflect current state
      const params = new URLSearchParams();
      params.set('filter', filterValue);
      params.set('page', page.toString());
      if (searchTerm) params.set('search', searchTerm);
      params.set('inactive', showInactive.toString());
      router.replace(`/accounts?${params.toString()}`, { scroll: false });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to load user data',
        text: 'Please try again later.',
      });
    } finally {
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      setIsTableLoading(false);
      hideLoader();
    }
  }, [filterValue, searchTerm, page, rowsPerPage, showInactive, isInitialLoad, cache, getCacheKey, router, showLoader, hideLoader]);

  // Debounced API call effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [loadUsers]);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage + 1); // Convert to 1-based index
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleEditClick = (account: User) => {
    if (account.user_type === '1') {
      router.push(`/accounts/customers/${account.id}/update`);
    } else {
      router.push(`/accounts/employees/${account.id}/update`);
    }
  };

  const handleAddAccountClick = () => {
    router.push('/accounts/employees/add');
  };

  const handleInactiveChange = (checked: boolean) => {
    setShowInactive(checked);
    setPage(1);
  };

  // Extract data from API response
  const visibleRows = apiResponse?.data.data || [];
  const totalRows = apiResponse?.data.meta.total || 0;
  const currentPage = apiResponse?.data.meta.current_page || 1;
  const rowsPerPageFromApi = apiResponse?.data.meta.per_page || rowsPerPage;

  if (isInitialLoad) {
    return (
      <AccountContainer>
        <HeadingComponent />
      </AccountContainer>
    );
  }

  return (
    <AccountContainer className="account-container">
      <HeadingComponent />
      
      <AccountWrapper>
        <TopArea>
          <FilterBy
            options={accountFilterOptions}
            selectedValue={filterValue}
            onFilterChange={handleFilterChange}
            label="Filter By:"
          />

          <AddAccount 
            onClick={handleAddAccountClick}
            disabled={isTableLoading}
            sx={{
              position: 'relative',
              '&:disabled': {
                opacity: 0.7,
                cursor: 'not-allowed'
              }
            }}
          >
            {isTableLoading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Adding...
              </>
            ) : (
              'Add Account'
            )}
          </AddAccount>

          <Box className="form-group inactive-user">
            <CheckboxComponent
              checked={showInactive}
              id='inactive-user'
              name='inactive-user'
              label='Inactive Users'
              onChange={handleInactiveChange}
            />
          </Box>
          
          <SearchBox 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </TopArea>

        {error && <div className="error-message">{error}</div>}

        <AccountTable 
          rows={visibleRows}
          editIcon={icons.editIcon}
          hasSearchTerm={searchTerm.length >= 2}
          onEditClick={handleEditClick}
          loading={isTableLoading}
        />
        
        <CustomTablePagination
          count={totalRows}
          rowsPerPage={rowsPerPageFromApi}
          page={currentPage - 1} // Convert to 0-based for MUI
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </AccountWrapper>
    </AccountContainer>
  );
}