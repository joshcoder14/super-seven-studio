'use client';

import React, { useEffect, useState } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { BoxWrapper, Heading, YearDropdown, PackageBar, SelectBox, DropdownList, DropdownMonth, YearBox, HeadingWrapper } from './styles';
import { Box, FormControl, MenuItem, Select, styled, Typography, SelectChangeEvent, Button } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { icons } from '@/icons';
import { ReportsTable } from './ReportTable';
import Image from 'next/image';
import { ReportData } from '@/types/reports';
import { fetchReports, fetchBookingData, fetchPackageData, fetchPDFReport } from '@/lib/api/fetchReport';
import { CustomTablePagination } from '@/components/TablePagination';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
    const currentDate = new Date();
    const currentYearValue = currentDate.getFullYear();
    const currentMonthName = monthLabels[currentDate.getMonth()];
    
    const [open, setOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentYear, setCurrentYear] = useState(currentYearValue);
    const [year, setYear] = useState(currentYearValue);
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthName);
    const [reportData, setReportData] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [bookingData, setBookingData] = useState<Record<string, number>>({});
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [packageData, setPackageData] = useState<{package_name: string; count: number}[]>([]);
    const [packageLoading, setPackageLoading] = useState(false);
    const [packageError, setPackageError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const [selectedYearPair, setSelectedYearPair] = useState<YearPair>({
        start: new Date().getFullYear(),
        end: new Date().getFullYear() + 1
    });

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

    const fetchReportData = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchReports({
                start_year: selectedYearPair.start,
                end_year: selectedYearPair.end,
                page: page + 1,
                perPage: rowsPerPage
            });
            setReportData(result.data);
            setTotalCount(result.meta.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
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
            // You might want to show an error toast/notification here
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        const loadBookingData = async () => {
            try {
                setBookingLoading(true);
                setBookingError(null);
                const data = await fetchBookingData(year);
                setBookingData(data);
            } catch (err) {
                setBookingError(err instanceof Error ? err.message : 'Failed to load booking data');
            } finally {
                setBookingLoading(false);
            }
        };

        loadBookingData();
    }, [year]);

    useEffect(() => {
        const loadPackageData = async () => {
            try {
                setPackageLoading(true);
                setPackageError(null);
                const monthNumber = selectedMonth ? monthLabels.indexOf(selectedMonth) + 1 : undefined;
                const data = await fetchPackageData(currentYear, monthNumber);
                setPackageData(data);
            } catch (err) {
                setPackageError(err instanceof Error ? err.message : 'Failed to load package data');
            } finally {
                setPackageLoading(false);
            }
        };

        loadPackageData();
    }, [currentYear, selectedMonth]);

    useEffect(() => {
        fetchReportData();
    }, [selectedYearPair, page, rowsPerPage]);

    const handlePageChange = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const handleYearChange = (event: SelectChangeEvent<string>) => {
        const [start, end] = event.target.value.split('-').map(Number);
        setSelectedYearPair({ start, end });
    };

    const handleChange = (event: SelectChangeEvent<number>) => {
        setYear(event.target.value as number);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleMonthSelect = (month: string) => {
        setSelectedMonth(month);
        setIsDropdownOpen(false);
    };

    const handleYearDecrease = () => {
        setCurrentYear(prevYear => prevYear - 1);
    };

    const handleYearIncrease = () => {
        setCurrentYear(prevYear => prevYear + 1);
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        family: "'Nunito Sans', sans-serif",
                        size: 12,
                        weight: 600
                    }
                }
            },
            title: {
                display: true,
                text: 'Bookings Over Time',
                font: {
                    family: "'Nunito Sans', sans-serif",
                    size: 16,
                    weight: 600
                }
            },
            tooltip: {
                bodyFont: {
                    family: "'Nunito Sans', sans-serif"
                },
                titleFont: {
                    family: "'Nunito Sans', sans-serif"
                }
            }
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            y: {
                min: 0,
                max: Math.max(...Object.values(bookingData), 10) + 5,
                ticks: {
                    stepSize: 5,
                    color: '#000',
                    padding: 40,
                    font: {
                        family: "'Nunito Sans', sans-serif",
                        size: 14
                    }
                },
                grid: {
                    display: true,
                    drawBorder: true
                },
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#000',
                    padding: 20,
                    font: {
                        family: "'Nunito Sans', sans-serif",
                        size: 14
                    }
                }
            }
        }
    };

    const lineData = {
        labels: monthLabels,
        datasets: [
            {
                label: 'Bookings',
                data: monthLabels.map(month => bookingData[month] || 0),
                borderColor: '#2BB673',
                backgroundColor: '#2BB673',
                tension: 0,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#2BB673',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowBlur: 8,
                shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
        ],
    };

    const yearSelect = [
        {
            id: 1,
            value: 2024,
            label: '2024'
        },
        {
            id: 2,
            value: 2025,
            label: '2025'
        },
        {
            id: 3,
            value: 2026,
            label: '2026'
        },
        {
            id: 4,
            value: 2027,
            label: '2027'
        },
        {
            id: 5,
            value: 2028,
            label: '2028'
        },
        {
            id: 6,
            value: 2029,
            label: '2029'
        },
        {
            id: 7,
            value: 2030,
            label: '2030'
        },
        {
            id: 8,
            value: 2031,
            label: '2031'
        },
        {
            id: 9,
            value: 2032,
            label: '2032'
        },
        {
            id: 10,
            value: 2033,
            label: '2033'
        }
    ]

    const barOptions = {
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
    };

    const barData = {
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
    };

    return (
        <HomeContainer>
            <HeadingWrapper>
                <Typography component="h2" className='title'>Reports</Typography>
                <Button onClick={handleDownloadPDF} disabled={isDownloading}>
                    {isDownloading ? 'Generating PDF...' : 'Download as PDF'}
                </Button>
            </HeadingWrapper>
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
                    {bookingLoading ? (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading booking data...</Box>
                    ) : bookingError ? (
                        <Typography color="error">Error loading booking data: {bookingError}</Typography>
                    ) : (
                        <Line 
                            height={100}
                            options={lineOptions} 
                            data={lineData}
                        />
                    )}
                </Box>
            </BoxWrapper>
            
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
                    {packageLoading ? (
                        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            Loading package data...
                        </Box>
                    ) : packageError ? (
                        <Typography color="error">Error loading package data: {packageError}</Typography>
                    ) : packageData.length > 0 ? (
                        <Bar 
                            height={100}
                            options={barOptions} 
                            data={barData}
                        />
                    ) : packageData.length < 0 ? (
                        <Typography>No package data available</Typography>
                    ) : null}
                </PackageBar>
            </BoxWrapper>

            <BoxWrapper sx={{ padding: '0px' }}>
                <Box
                    sx={{
                        padding: '30px 30px 0px 30px',
                    }}
                >
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

                <ReportsTable data={reportData} loading={loading} error={error} />

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