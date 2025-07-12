'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
    const [selectedYearPair, setSelectedYearPair] = useState<YearPair>({
        start: new Date().getFullYear(),
        end: new Date().getFullYear() + 1
    });
    const [billingData, setBillingData] = useState<Billing[]>([]);
    const [filteredData, setFilteredData] = useState<Billing[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const generateYearPairs = (): YearPair[] => {
        const currentYear = new Date().getFullYear();
        const pairs: YearPair[] = [];
        const startYear = currentYear - 2;
        
        for (let i = 0; i < 10; i++) {
            const start = startYear + (i * 2);
            pairs.push({ start, end: start + 1 });
        }
        
        return pairs;
    };

    const yearPairs = generateYearPairs();

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
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetchBillings({
                start_year: selectedYearPair.start,
                end_year: selectedYearPair.end,
                page: page + 1,  // API uses 1-based indexing
                perPage: rowsPerPage
            });
            
            setBillingData(response.data);
            setTotalCount(response.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch billing data');
        } finally {
            setLoading(false);
        }
    }, [selectedYearPair, page, rowsPerPage]);

   useEffect(() => {
        loadBillingData();
    }, [loadBillingData]);

    const handleViewBilling = (billingId: string) => {
        router.push(`/billing/${billingId}`);
    };

    // Handle pagination changes
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
        setPage(0); // Reset to first page when rows per page changes
    };

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
            
            <Box sx={{ marginBottom: '150px' }}>
                <BillingTable 
                    billingData={filteredData} 
                    loading={loading}
                    onView={handleViewBilling}
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