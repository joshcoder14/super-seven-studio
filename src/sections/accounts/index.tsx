'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AccountContainer, AccountWrapper, TopArea, AddAccount } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { FilterBy } from '@/components/Filter';
import { SearchBox } from '@/components/Search';
import { AccountTable } from './AccountTable';
import { RegisterAccount } from './AddAccount';
import { CustomTablePagination } from '@/components/TablePagination';
import { User } from '@/types/user';
import { accountFilterOptions } from '@/utils/filterOptions';
import { icons } from '@/icons';

export function AccountComponent(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('3'); // Default to 'Owner'
  const [showRegisterAccount, setShowRegisterAccount] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize filterValue from URL parameter if it exists
  useEffect(() => {
    const urlFilter = searchParams.get('filter');
    
    // If there's no filter in URL, set the default one
    if (!urlFilter) {
      const params = new URLSearchParams();
      params.set('filter', '3');
      router.replace(`/accounts?${params.toString()}`, { scroll: false });
    } 
    // If there is a filter in URL, use it (if valid)
    else if (accountFilterOptions.some(opt => opt.value === urlFilter)) {
      setFilterValue(urlFilter);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        };

        // For Clients (filterValue === '1')
        if (filterValue === '1') {
          const queryString = `search[value]=${searchTerm || ''}&filters[user_type]=1`;
          const response = await fetch(`/api/customers?${queryString}`, {
            credentials: 'include',
            headers
          });

          if (!response.ok) throw new Error('Failed to fetch client data');

          const responseData = await response.json();
          const users = responseData.data?.data || [];

          setAllUsers(users.map((user: any) => ({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            contact_no: user.contact_no,
            address: user.address,
            user_role: 'Client',
            status: user.status === 'active' ? '1' : '0',
            source: 'client'
          })));
        } else {
          const queryString = `search[value]=${searchTerm || ''}&filters[user_type]=${filterValue}`;
          
          const response = await fetch(`/api/employees?${queryString}`, {
            credentials: 'include',
            headers
          });

          if (!response.ok) throw new Error('Failed to fetch employee data');

          const responseData = await response.json();
          const users = responseData.data?.data || [];

          setAllUsers(users.map((user: any) => ({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            contact_no: user.contact_no,
            address: user.address,
            user_role: accountFilterOptions.find(opt => opt.value === filterValue)?.label || '',
            status: user.status === 'active' ? '1' : '0',
            source: 'employee',
            first_name: user.first_name,
            last_name: user.last_name,
            mid_name: user.mid_name
          })));
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filterValue, searchTerm]);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setPage(0);
    
    // Update URL with the new filter parameter
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
    setCurrentAccount(account);
    setShowRegisterAccount(true);
    console.log("account", account);
  };

  const handleBackFromForm = () => {
    setShowRegisterAccount(false);
    setCurrentAccount(null);
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

      {!showRegisterAccount ? (
        <AccountWrapper>
          <TopArea>
            <FilterBy
              options={accountFilterOptions}
              selectedValue={filterValue}
              onFilterChange={handleFilterChange}
              label="Filter By:"
            />

            <AddAccount
              onClick={() => {
                setCurrentAccount(null);
                setShowRegisterAccount(true);
              }}
            >
              Add Account
            </AddAccount>
            
            <SearchBox 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </TopArea>

          <AccountTable 
            rows={visibleRows}
            emptyRows={emptyRows}
            editIcon={icons.editIcon}
            hasSearchTerm={searchTerm.length >= 2}
            onEditClick={handleEditClick}
          />
          
          <CustomTablePagination
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </AccountWrapper>
      ) : (
        <RegisterAccount
          account={currentAccount}
          onBackClick={handleBackFromForm}
          isEditMode={!!currentAccount}
          onSuccess={() => {
            const fetchData = async () => {
              try {
                setLoading(true);
                // Your existing fetch logic for employees here
              } catch (error) {
                console.error('Failed to fetch employees', error);
                setError('Failed to load employee data. Please try again later.');
              } finally {
                setLoading(false);
              }
            };
            fetchData();
          }}
        />
      )}
    </AccountContainer>
  );
}