'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { YearSelector } from './styles';
import { HeadingComponent } from '@/components/Heading';
import BillingTable from './BillingTable';
import { SearchBox } from '@/components/Search';
import { 
  Box, 
  FormControl, 
  MenuItem, 
  Select, 
  SelectChangeEvent, 
  Alert
} from '@mui/material';
import { Billing } from '@/types/billing';
import { icons } from '@/icons';
import Image from 'next/image';
import { fetchBillings } from '@/lib/api/fetchBilling';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomTablePagination } from '@/components/TablePagination';
import { useLoading } from '@/context/LoadingContext';
import { categoryFilterOptions } from '@/utils/filterOptions';
import { FilterBy } from '@/components/Filter';

// Calendar icon for year selector
const CalendarIcon = (props: any) => (
  <Image
    width={20}
    height={20} 
    src={icons.caledarIcon} 
    alt="calendar" 
    {...props}
    style={{ 
      width: 20, 
      height: 20, 
      marginRight: 8,
      pointerEvents: 'none'
    }} 
  />
);

// Type for year ranges
type YearPair = {
  start: number;
  end: number;
};

// Map filter values to actual category names
const categoryMap: Record<string, string> = {
  '0': 'Others',
  '1': 'Birthday',
  '2': 'Prenup',
  '3': 'Debut',
  '4': 'Wedding'
};

export default function BillingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showLoader, hideLoader } = useLoading();

  // State
  const [selectedYearPair, setSelectedYearPair] = useState<YearPair>({
      start: new Date().getFullYear(),
      end: new Date().getFullYear() + 1
  });
  const [billingData, setBillingData] = useState<Billing[]>([]);
  const [filteredData, setFilteredData] = useState<Billing[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [filterValue, setFilterValue] = useState('');  
  const [cache, setCache] = useState<Record<string, { data: Billing[], total: number }>>({});
  
    const [totalBilling, setTotalBilling] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(0);

  // Prepare year range options
  const yearPairs = useMemo(() => {
      const currentYear = new Date().getFullYear();
      const pairs: YearPair[] = [];
      const startYear = currentYear - 2;

      for (let i = 0; i < 10; i++) {
          const start = startYear + (i * 2);
          pairs.push({ start, end: start + 1 });
      }

      return pairs;
  }, []);

  // Initialize filter and page from URL query
  useEffect(() => {
      const urlFilter = searchParams.get('filter');
      const urlPage = searchParams.get('page');

      if (urlFilter && categoryFilterOptions.some(opt => opt.value === urlFilter)) {
          setFilterValue(urlFilter);
      }

      if (urlPage) {
          setPage(parseInt(urlPage, 10));
      }
  }, [searchParams]);

  // Handle year change
  const handleYearChange = (event: SelectChangeEvent<string>) => {
      const [start, end] = event.target.value.split('-').map(Number);
      setSelectedYearPair({ start, end });
      setPage(0);
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setPage(0);
  };

  // Handle filter change
  const handleFilterChange = (value: string) => {
      setFilterValue(value);
      setPage(0);
      setCache({}); // clear cache for new filter
  };    

  // Load billing data from API
    const loadBillingData = useCallback(async () => {
      const cacheKey = `${selectedYearPair.start}-${selectedYearPair.end}-${filterValue}-${page}-${rowsPerPage}`;

      // Serve cached data if available
      if (cache[cacheKey]) {
          setBillingData(cache[cacheKey].data);
          setTotalCount(cache[cacheKey].total);
          return;
      }

      try {
          setIsTableLoading(true);
          showLoader();

          // Map numeric filter to actual category name for API
          const apiCategory = filterValue && filterValue !== '' ? categoryMap[filterValue] : '';

          const response = await fetchBillings({
              start_year: selectedYearPair.start,
              end_year: selectedYearPair.end,
              category: apiCategory,
              page: page + 1, // API is 1-based
              perPage: rowsPerPage
          });

            // totals from API
            if (response.extra) {
                setTotalBilling(Number(response.extra.total_bill));
                setTotalBalance(Number(response.extra.total_balance));
            }

          // Local fallback: in case API ignores category, filter manually
          const finalData = apiCategory
              ? response.data.filter(item => item.category === apiCategory)
              : response.data;

          setBillingData(finalData);
          setTotalCount(finalData.length);
          setError(null);

          // Update cache
          setCache(prev => ({
              ...prev,
              [cacheKey]: {
                  data: finalData,
                  total: finalData.length
              }
          }));

          // Sync URL query
          const params = new URLSearchParams();
          params.set('filter', filterValue);
          params.set('page', page.toString());
          router.replace(`/billing?${params.toString()}`, { scroll: false });

      } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch billing data');
      } finally {
          setIsTableLoading(false);
          hideLoader();
      }
  }, [selectedYearPair, filterValue, page, rowsPerPage, cache, showLoader, hideLoader, router]);

  // Debounced fetch
  useEffect(() => {
      const timer = setTimeout(() => {
          loadBillingData();
      }, 300);

      return () => clearTimeout(timer);
  }, [loadBillingData]);

  // Local search filter
  const filterData = useCallback(() => {
      if (!searchTerm.trim()) return billingData;

      const term = searchTerm.toLowerCase();
      return billingData.filter(item => 
          (item.event_name?.toLowerCase().includes(term)) ||
          (item.customer_name?.toLowerCase().includes(term)) ||
          (item.status?.toLowerCase().includes(term)) ||
          (item.package?.toLowerCase().includes(term))
      );
  }, [billingData, searchTerm]);

  // Update filteredData whenever billingData or searchTerm changes
  useEffect(() => {
      setFilteredData(filterData());
  }, [billingData, searchTerm, filterData]);

  // Navigate to billing details
  const handleViewBilling = (billingId: string) => {
      router.push(`/billing/${billingId}`);
  };

  // Pagination handlers
  const handlePageChange = (
      event: React.MouseEvent<HTMLButtonElement> | null, 
      newPage: number
  ) => {
      setPage(newPage);
  };

  const handleRowsPerPageChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
      const newRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
  };

  return (
      <HomeContainer>
          <HeadingComponent
                totalBilling={totalBilling}
                totalBalance={totalBalance}
          />

          {/* Year & Category Filter */}
          <YearSelector>
              <FormControl 
                  size="small"
                  sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}
              >
                  <Select
                      value={`${selectedYearPair.start}-${selectedYearPair.end}`}
                      onChange={handleYearChange}
                      IconComponent={CalendarIcon}
                      inputProps={{ 'aria-label': 'Select billing year range' }}
                      sx={{ 
                          width: "100%", 
                          minWidth: "300px", 
                          height: "50px", 
                          borderRadius: "4px", 
                          backgroundColor: "#FFFFFF",
                          '.MuiSelect-select': { 
                              paddingRight: '40px !important',
                              display: 'flex',
                              alignItems: 'center'
                          }
                      }}
                  >
                      {yearPairs.map((pair, index) => (
                          <MenuItem key={index} value={`${pair.start}-${pair.end}`}>
                              {`${pair.start} - ${pair.end}`}
                          </MenuItem>
                      ))}
                  </Select>

                  {/* Category Filter */}
                  <FilterBy
                      options={categoryFilterOptions}
                      selectedValue={filterValue}
                      onFilterChange={handleFilterChange}
                      label="Filter By:"
                  />
              </FormControl>

              {/* Search box */}
              <SearchBox 
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  placeholder="Search billings..."
              />
          </YearSelector>

          {/* Error message */}
          {error && (
              <Box sx={{ p: 2 }}>
                  <Alert severity="error">{error}</Alert>
              </Box>
          )}

          {/* Billing table */}
          <Box sx={{ marginBottom: '150px', maxWidth: '1640px' }}>
              <BillingTable 
                  billingData={filteredData}
                  onView={handleViewBilling}
                  isLoading={isTableLoading}
              />

              <CustomTablePagination
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
              />
          </Box>
      </HomeContainer>
  );
}
