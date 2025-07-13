'use client';

import React, { useState, useEffect } from 'react';
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
import { Box } from '@mui/material';
import CheckboxComponent from '@/components/checkbox';

export function AccountComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('3');
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(true);
  
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

  // Fetch data when params change
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchAllUsers(
          searchTerm, 
          filterValue, 
          page, 
          rowsPerPage,
          showInactive
        );
        setApiResponse(response);
        
        // Update URL to reflect current state
        const params = new URLSearchParams();
        params.set('filter', filterValue);
        params.set('page', page.toString());
        if (searchTerm) params.set('search', searchTerm);
        params.set('inactive', showInactive.toString());
        router.replace(`/accounts?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error('Failed to fetch users', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filterValue, searchTerm, page, rowsPerPage, router, showInactive]);

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

          <AddAccount onClick={handleAddAccountClick}>
            Add Account
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
          // emptyRows={0}
          editIcon={icons.editIcon}
          hasSearchTerm={searchTerm.length >= 2}
          onEditClick={handleEditClick}
          loading={loading}
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