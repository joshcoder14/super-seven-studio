'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountContainer, AccountWrapper, TopArea, AddAccount } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { FilterBy } from '@/components/Filter';
import { SearchBox } from '@/components/Search';
import { AccountTable } from './AccountTable';
import { CustomTablePagination } from '@/components/TablePagination';
import { User } from '@/types/user';
import { icons } from '@/icons';
import { fetchAllUsers } from '@/lib/api/fetchAccount';
import { accountFilterOptions } from '@/utils/filterOptions';

export function AccountComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('3'); // Default to 'Owner'
  const [error, setError] = useState<string | null>(null);

  // Initialize filter from URL parameter
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    const params = new URLSearchParams(searchParams.toString());
    
    if (urlFilter && accountFilterOptions.some(opt => opt.value === urlFilter)) {
      setFilterValue(urlFilter);
    } else {
      // Set default filter if not present or invalid
      params.set('filter', '3');
      router.replace(`/accounts?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const users = await fetchAllUsers(searchTerm, filterValue);
        setAllUsers(users);
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
  }, [filterValue, searchTerm]);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setPage(0);
    
    // Update URL with filter parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', value);
    router.push(`/accounts?${params.toString()}`, { scroll: false });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const filteredRows = useMemo(() => allUsers, [allUsers]);

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filteredRows.length);

  const visibleRows = useMemo(
    () => filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, filteredRows]
  );

  return (
    <AccountContainer className="account-container">
      <HeadingComponent/>
      
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
          >
            Add Account
          </AddAccount>
          
          <SearchBox 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </TopArea>

        {error && <div className="error-message">{error}</div>}

        <AccountTable 
          rows={visibleRows}
          emptyRows={emptyRows}
          editIcon={icons.editIcon}
          hasSearchTerm={searchTerm.length >= 2}
          onEditClick={handleEditClick}
          loading={loading}
        />
        
        <CustomTablePagination
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </AccountWrapper>
    </AccountContainer>
  );
}