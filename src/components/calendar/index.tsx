'use client';

import React from 'react';
import { CalendarWrapper } from '@/sections/booking/styles';

// Calendar imports
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

// Optional: Import dayjs plugins if needed (like localization)
// import 'dayjs/locale/en'; // Example for English locale

export default function CalendarComponent() {
    return (
         <CalendarWrapper 
            sx={{ 
                width: '100%', 
                height: '320px', 
                borderBottom: '1px solid #E0E0E0',

                '& .MuiDateCalendar-root': {
                height: '300px'
                }
            }}
            >
            <LocalizationProvider 
                dateAdapter={AdapterDayjs}
            >
                <DateCalendar 
                sx={{
                    width: '100%',
                    maxWidth: '400px',
                    '& .MuiPickersCalendarHeader-root': {
                        paddingLeft: '0px',
                        paddingRight: '0px',
                        paddingBottom: '20px',
                        marginTop: '20px',
                        borderBottom: '1px solid #E0E0E0'
                    },
                    '& .MuiPickersArrowSwitcher-root': {
                        marginRight: '-7px',

                        // hover
                        '&:hover': {
                            'button': {
                                backgroundColor: 'transparent'
                            }
                        }
                    },
                    '& .MuiDayCalendar-header span': {
                        fontFamily: 'Nunito Sans',
                        fontSize: '10px',
                        fontWeight: '700'
                    },
                    '& .MuiPickersCalendarHeader-label': {
                        fontFamily: 'Nunito Sans',
                        fontWeight: 'bold'
                    },
                    '& .MuiPickersDay-root': {
                        fontFamily: 'Nunito Sans',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#A6A6A6',
                    },
                    '& .Mui-selected': {
                        borderColor: '#AAAAAA !important',
                        borderRadius: '8px',
                        backgroundColor: '#AAAAAA !important',
                        color: 'white !important',
                    },
                    // Hover effect
                    '& .MuiPickersDay-dayWithMargin:hover': {
                        borderColor: '#AAAAAA !important',
                        borderRadius: '8px',
                        backgroundColor: '#AAAAAA',
                        color: 'white !important',
                    },
                    // Today's date style
                    '& .MuiPickersDay-today': {
                        borderColor: '#AAAAAA !important',
                        borderRadius: '8px',
                    },
                }}
                />
            </LocalizationProvider>
        </CalendarWrapper>
    );
}