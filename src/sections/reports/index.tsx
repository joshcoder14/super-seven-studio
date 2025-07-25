'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { BoxWrapper, Heading, YearDropdown, PackageBar, SelectBox, DropdownList, DropdownMonth, YearBox, HeadingWrapper } from './styles';
import { Box, FormControl, MenuItem, Select, styled, Typography, SelectChangeEvent, Button } from '@mui/material';
import { icons } from '@/icons';
import { ReportsTable } from './ReportTable';
import Image from 'next/image';
import { ReportData } from '@/types/reports';
import { fetchReports, fetchBookingReport, fetchPackageReport, fetchPDFReport } from '@/lib/api/fetchReport';
import { CustomTablePagination } from '@/components/TablePagination';
import { useLoading } from '@/context/LoadingContext';
import DynamicApexChart from '@/components/chart/DynamicApexChart';
import { ApexOptions } from 'apexcharts';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RotatingIcon = styled('img')<{ open: boolean }>(({ open }) => ({
  transition: 'transform 0.2s ease-in-out',
  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
}));

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

const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ReportsHome(): React.JSX.Element {
    const { showLoader, hideLoader } = useLoading();
    const currentDate = new Date();
    const currentYearValue = currentDate.getFullYear();
    const currentMonthName = monthLabels[currentDate.getMonth()];
    
    // State management
    const [open, setOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentYear, setCurrentYear] = useState(currentYearValue);
    const [year, setYear] = useState(currentYearValue);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthName);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [bookingData, setBookingData] = useState<Record<string, number>>({});
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [packageData, setPackageData] = useState<{package_name: string; count: number}[]>([]);
    const [packageError, setPackageError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Loading states
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isBookingLoading, setIsBookingLoading] = useState(false);
    const [isPackageLoading, setIsPackageLoading] = useState(false);

    // Cache states
    const [reportCache, setReportCache] = useState<Record<string, { data: ReportData[], total: number }>>({});
    const [bookingCache, setBookingCache] = useState<Record<string, Record<string, number>>>({});
    const [packageCache, setPackageCache] = useState<Record<string, {package_name: string; count: number}[]>>({});

    const [selectedYearPair, setSelectedYearPair] = useState<YearPair>({
        start: new Date().getFullYear(),
        end: new Date().getFullYear() + 1
    });

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

    const fetchReportData = useCallback(async () => {
        const cacheKey = `${selectedYearPair.start}-${selectedYearPair.end}-${page}-${rowsPerPage}`;
        
        if (reportCache[cacheKey] && !isInitialLoad) {
            setReportData(reportCache[cacheKey].data);
            setTotalCount(reportCache[cacheKey].total);
            return;
        }

        try {
            if (isInitialLoad || page === 0) {
                showLoader();
            } else {
                setIsTableLoading(true);
            }

            const result = await fetchReports({
                start_year: selectedYearPair.start,
                end_year: selectedYearPair.end,
                page: page + 1,
                perPage: rowsPerPage
            });

            setReportData(result.data);
            setTotalCount(result.meta.total);
            setError(null);

            setReportCache(prev => ({
                ...prev,
                [cacheKey]: {
                    data: result.data,
                    total: result.meta.total
                }
            }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
            setIsTableLoading(false);
            hideLoader();
        }
    }, [selectedYearPair, page, rowsPerPage, isInitialLoad, reportCache, showLoader, hideLoader]);

    const fetchBookingData = useCallback(async () => {
        const cacheKey = `${year}`;
        
        if (bookingCache[cacheKey]) {
            setBookingData(bookingCache[cacheKey]);
            return;
        }

        try {
            setIsBookingLoading(true);
            setBookingError(null);
            const data = await fetchBookingReport(year);
            setBookingData(data);
            
            setBookingCache(prev => ({
                ...prev,
                [cacheKey]: data
            }));
        } catch (err) {
            setBookingError(err instanceof Error ? err.message : 'Failed to load booking data');
        } finally {
            setIsBookingLoading(false);
        }
    }, [year, bookingCache]);

    const fetchPackageData = useCallback(async () => {
        const monthNumber = selectedMonth ? monthLabels.indexOf(selectedMonth) + 1 : undefined;
        const cacheKey = `${currentYear}-${monthNumber}`;
        
        if (packageCache[cacheKey]) {
            setPackageData(packageCache[cacheKey]);
            return;
        }

        try {
            setIsPackageLoading(true);
            setPackageError(null);
            const data = await fetchPackageReport(currentYear, monthNumber);
            setPackageData(data);
            
            setPackageCache(prev => ({
                ...prev,
                [cacheKey]: data
            }));
        } catch (err) {
            setPackageError(err instanceof Error ? err.message : 'Failed to load package data');
        } finally {
            setIsPackageLoading(false);
        }
    }, [currentYear, selectedMonth, packageCache]);

    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            showLoader();
            const monthNumber = selectedMonth ? monthLabels.indexOf(selectedMonth) + 1 : undefined;
            
            await fetchPDFReport({
                booking_year: year,
                package_year: currentYear,
                package_month: monthNumber,
                transaction_start: selectedYearPair.start,
                transaction_end: selectedYearPair.end
            });
            
        } catch (error) {
            console.error('Failed to download PDF:', error);
        } finally {
            setIsDownloading(false);
            hideLoader();
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReportData();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchReportData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBookingData();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchBookingData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPackageData();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchPackageData]);

    const handlePageChange = useCallback((
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    }, []);

    const handleRowsPerPageChange = useCallback((
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);
    
    const handleYearChange = useCallback((event: SelectChangeEvent<string>) => {
        const [start, end] = event.target.value.split('-').map(Number);
        setSelectedYearPair({ start, end });
    }, []);

    const handleChange = useCallback((event: SelectChangeEvent<number>) => {
        setYear(event.target.value as number);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(!isDropdownOpen);
    }, [isDropdownOpen]);

    const handleMonthSelect = useCallback((month: string) => {
        setSelectedMonth(month);
        setIsDropdownOpen(false);
    }, []);

    const handleYearDecrease = useCallback(() => {
        setCurrentYear(prevYear => prevYear - 1);
    }, []);

    const handleYearIncrease = useCallback(() => {
        setCurrentYear(prevYear => prevYear + 1);
    }, []);

    const lineOptions: ApexOptions = useMemo(() => ({
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'left',
        },
        colors: ['#2BB673'],
        chart: {
            fontFamily: "Nunito Sans, sans-serif",
            height: 310,
            type: "line", // Set the chart type to 'line'
            toolbar: {
                show: false, // Hide chart toolbar
            },
        },
        stroke: {
            curve: "straight", // Define the line style (straight, smooth, or step)
            width: [2, 2], // Line width for each dataset
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 2, // Size of the marker points
            strokeColors: "#2BB673", // Marker border color
            strokeWidth: 2,
            hover: {
                size: 6, // Marker size on hover
            },
        },
        grid: {
            xaxis: {
                lines: {
                show: false, // Hide grid lines on x-axis
                },
            },
            yaxis: {
                padding: 100,
                lines: {
                    show: true, // Show grid lines on y-axis
                },
            },
        },
        dataLabels: {
            enabled: false, // Disable data labels
        },
        tooltip: {
            enabled: true, // Enable tooltip
            x: {
                format: "dd MMM yyyy", // Format for x-axis tooltip
            },
        },
        xaxis: {
            categories: monthLabels,
            labels: {
                style: {
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: '14px',
                    colors: '#333'
                }
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            min: 0,
            max: Math.max(...Object.values(bookingData), 10) + 5,
            labels: {
                style: {
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: '14px',
                    colors: '#333'
                }
            },
            title: {
                text: "", // Remove y-axis title
                style: {
                    fontSize: "0px",
                },
            },
        },

    }), [bookingData]);

    const lineSeries = useMemo(() => [
        {
            name: 'Bookings',
            data: monthLabels.map(month => bookingData[month] || 0)
        }
    ], [bookingData]);

    const yearSelect = useMemo(() => [
        { id: 1, value: 2024, label: '2024' },
        { id: 2, value: 2025, label: '2025' },
        { id: 3, value: 2026, label: '2026' },
        { id: 4, value: 2027, label: '2027' },
        { id: 5, value: 2028, label: '2028' },
        { id: 6, value: 2029, label: '2029' },
        { id: 7, value: 2030, label: '2030' },
        { id: 8, value: 2031, label: '2031' },
        { id: 9, value: 2032, label: '2032' },
        { id: 10, value: 2033, label: '2033' }
    ], []);

    const barOptions = useMemo(() => ({
        indexAxis: 'y' as const,
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false }
        },
        scales: {
            x: { 
                min: 0,
                max: Math.max(...packageData.map(item => item.count), 10) + 5,
                ticks: { display: false },
                grid: { display: false, drawBorder: false }
            },
            y: {
                grid: { display: false, drawBorder: false },
                ticks: {
                    color: '#000',
                    font: { family: "'Nunito Sans', sans-serif", size: 18, weight: 600 },
                    padding: 4,
                    crossAlign: 'far' as const
                }
            }
        },
        categoryPercentage: 0.9,
        barPercentage: 0.8
    }), [packageData]);

    const barData = useMemo(() => ({
        labels: packageData.map(item => item.package_name),
        datasets: [
            {
                data: packageData.map(item => item.count),
                backgroundColor: '#2BB673',
                borderColor: '#2BB673',
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 10,
                padding: 10,
                display: 'flex' as const
            }
        ]
    }), [packageData]);

    return (
        <HomeContainer>
            <HeadingWrapper>
                <Typography component="h2" className='title'>Reports</Typography>
                <Button onClick={handleDownloadPDF} disabled={isDownloading}>
                    {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
                </Button>
            </HeadingWrapper>
            
            {/* Bookings Chart */}
            <BoxWrapper>
                <Heading>
                    <Typography component="p">Number of Bookings</Typography>
                    <YearDropdown sx={{ minWidth: 120 }}>
                        <FormControl className='form' fullWidth>
                            <Select
                                labelId="year-select-label"
                                className='select'
                                id="year-select"
                                value={year}
                                onChange={handleChange}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                IconComponent={() => (
                                    <RotatingIcon 
                                        src={icons.angleDown} 
                                        alt="dropdown" 
                                        open={open}
                                        sx={{ mr: 1 }}
                                    />
                                )}
                                sx={{
                                    marginLeft: 'auto',
                                    '& .MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                }}
                            >
                                {yearSelect.map((option) => (
                                    <MenuItem key={option.id} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </YearDropdown>
                </Heading>
                <Box sx={{ width: '100%', height: 'auto' }}>
                    {isBookingLoading ? (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading booking data...</Box>
                    ) : bookingError ? (
                        <Typography color="error">Error loading booking data: {bookingError}</Typography>
                    ) : (
                        <DynamicApexChart 
                            options={lineOptions}
                            series={lineSeries}
                            type="area"
                            height={350}
                        />
                    )}
                </Box>
            </BoxWrapper>
            
            {/* Packages Chart */}
            <BoxWrapper>
                <Heading>
                    <Typography component="p">Availed Packages</Typography>
                    <YearDropdown sx={{ minWidth: 120 }}>
                        <FormControl className='form' fullWidth>
                            <SelectBox onClick={toggleDropdown}>
                                {selectedMonth ? `${currentYear} - ${selectedMonth}` : 'Yearly'}
                                <Image 
                                    width={20} 
                                    height={20} 
                                    src={icons.angleDown} 
                                    alt='angle down' 
                                    style={{
                                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease-in-out'
                                    }}
                                />
                            </SelectBox>
                            {isDropdownOpen && (
                                <DropdownList className="dropdown">
                                    <YearBox>
                                        <Typography component="p">{currentYear}</Typography>
                                        <Box>
                                            <Image 
                                                width={20} 
                                                height={20} 
                                                src={icons.angleLeft} 
                                                alt='angle left' 
                                                onClick={handleYearDecrease}
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <Image 
                                                width={20} 
                                                height={20} 
                                                src={icons.angleRight} 
                                                alt='angle right' 
                                                onClick={handleYearIncrease}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </Box>
                                    </YearBox>
                                    <DropdownMonth>
                                        {monthLabels.map((month, index) => (
                                            <Typography 
                                                key={index} 
                                                component="p"
                                                onClick={() => handleMonthSelect(month)}
                                            >
                                                {month}
                                            </Typography>
                                        ))}
                                    </DropdownMonth>
                                </DropdownList>
                            )}
                        </FormControl>
                    </YearDropdown>
                </Heading>
                <PackageBar sx={{ width: '100%', height: '300px' }}>
                    {isPackageLoading ? (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            Loading package data...
                        </Box>
                    ) : packageError ? (
                        <Typography color="error">Error loading package data: {packageError}</Typography>
                    ) : packageData.length > 0 ? (
                        <Bar 
                            options={barOptions} 
                            data={barData}
                        />
                    ) : (
                        <Typography>No package data available</Typography>
                    )}
                </PackageBar>
            </BoxWrapper>

            {/* Reports Table */}
            <BoxWrapper sx={{ padding: '0px' }}>
                <Box sx={{ padding: '30px 30px 0px 30px' }}>
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
                                backgroundColor: "#F7FAF5",
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
                </Box>

                <ReportsTable 
                    data={reportData} 
                    loading={isTableLoading} 
                    error={error} 
                />
            </BoxWrapper>

            <Box sx={{ marginBottom: '150px', marginTop: '-40px', padding: '0px', maxWidth: '1640px' }}>
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