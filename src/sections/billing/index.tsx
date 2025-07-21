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
import { useRouter } from 'next/navigation';
import { CustomTablePagination } from '@/components/TablePagination';
import { useLoading } from '@/context/LoadingContext';

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

type YearPair = {
  start: number;
  end: number;
};

export default function BillingComponent() {
    const router = useRouter();
    const { showLoader, hideLoader } = useLoading();
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
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [cache, setCache] = useState<Record<string, { data: Billing[], total: number }>>({});

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

    const handleYearChange = (event: SelectChangeEvent<string>) => {
        const [start, end] = event.target.value.split('-').map(Number);
        setSelectedYearPair({ start, end });
        setPage(0);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const loadBillingData = useCallback(async () => {
        const cacheKey = `${selectedYearPair.start}-${selectedYearPair.end}-${page}-${rowsPerPage}`;
        
        // Return cached data if available (except for initial load)
        if (cache[cacheKey] && !isInitialLoad) {
            setBillingData(cache[cacheKey].data);
            setTotalCount(cache[cacheKey].total);
            return;
        }

        try {
            // Show full loader only for initial load or filter changes
            if (isInitialLoad || page === 0) {
                showLoader();
            } else {
                setIsTableLoading(true);
            }
            
            const response = await fetchBillings({
                start_year: selectedYearPair.start,
                end_year: selectedYearPair.end,
                page: page + 1,
                perPage: rowsPerPage
            });
            
            setBillingData(response.data);
            setTotalCount(response.total);
            setError(null);
            
            // Update cache
            setCache(prev => ({
                ...prev,
                [cacheKey]: {
                    data: response.data,
                    total: response.total
                }
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch billing data');
        } finally {
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
            setIsTableLoading(false);
            hideLoader();
        }
    }, [selectedYearPair, page, rowsPerPage, isInitialLoad, cache, showLoader, hideLoader]);

    // Debounced API call effect
    useEffect(() => {
        const timer = setTimeout(() => {
            loadBillingData();
        }, 300);

        return () => clearTimeout(timer);
    }, [loadBillingData]);

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

    useEffect(() => {
        setFilteredData(filterData());
    }, [billingData, searchTerm, filterData]);

    const handleViewBilling = (billingId: string) => {
        router.push(`/billing/${billingId}`);
    };

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
            <HeadingComponent />
        
            <YearSelector>
                <FormControl size="small">
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
                </FormControl>

                <SearchBox 
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    placeholder="Search billings..."
                />
            </YearSelector>
        
            {error && (
                <Box sx={{ p: 2 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}
            
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