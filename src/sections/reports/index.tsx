'use client';

import React, { useState } from 'react';
import { HomeContainer } from '@/sections/adminHome/styles';
import { BoxWrapper, Heading, YearDropdown, PackageBar, SelectBox, DropdownList, DropdownMonth, YearBox } from './styles';
import { HeadingComponent } from '@/components/Heading';
import { Box, FormControl, MenuItem, Select, styled, Typography, SelectChangeEvent } from '@mui/material';
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

// Register ChartJS components
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

export default function ReportsHome(): React.JSX.Element {
    const [open, setOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentYear, setCurrentYear] = useState(2024);
    const [year, setYear] = useState(2025);
    const [selectedMonth, setSelectedMonth] = useState<string>('');
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
    
    const handleYearChange = (event: SelectChangeEvent<string>) => {
        const [start, end] = event.target.value.split('-').map(Number);
        setSelectedYearPair({ start, end });
        // setPage(0);
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

    // Line chart options and data
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
                max: 30,
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

    // Sample data for line chart
    const lineLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const lineData = {
        labels: lineLabels,
        datasets: [
            {
                label: 'Bookings',
                data: [10, 20, 15, 5, 9, 16, 12],
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

    // Horizontal bar chart options and data
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
                max: 60,
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
    const barLabels = ['Package A', 'Package B', 'Package C'];
    const barData = {
        labels: barLabels,
        datasets: [
            {
                data: [59, 28, 45],
                backgroundColor: [
                    '#2BB673',
                ],
                borderColor: [
                    '#2BB673',
                ],
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 10,
                padding: 10,
                display: 'flex' as const
            }
        ]
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <HomeContainer>
            <HeadingComponent />
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
                                <MenuItem className='menu-item' value={2024}>2024</MenuItem>
                                <MenuItem className='menu-item' value={2025}>2025</MenuItem>
                                <MenuItem className='menu-item' value={2026}>2026</MenuItem>
                            </Select>
                        </FormControl>
                    </YearDropdown>
                </Heading>
                <Box sx={{ width: '100%', height: 'auto' }}>
                    <Line 
                        height={100}
                        options={lineOptions} 
                        data={lineData}
                    />
                </Box>
            </BoxWrapper>
            
            {/* Availed Packages */}
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
                                        {months.map((month, index) => (
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
                    <Bar 
                        height={100}
                        options={barOptions} 
                        data={barData}
                    />
                </PackageBar>
            </BoxWrapper>

            <BoxWrapper sx={{ marginBottom: '150px', padding: '0px' }}>
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
                <ReportsTable />
            </BoxWrapper>
        </HomeContainer>
    );
}