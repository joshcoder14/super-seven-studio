'use client';

import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Box } from '@mui/material';

interface DatePickerProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  label: string;
  required?: boolean;
  error?: string;
  minDate?: Dayjs;
  shouldDisableDate?: (date: Dayjs) => boolean;
  disabled?: boolean;
  onMonthChange?: (date: Dayjs) => void;
  timezone?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  label,
  required = false,
  error,
  minDate = dayjs().add(30, 'day'),
  shouldDisableDate,
  onMonthChange,
  disabled = false,
  timezone
}: DatePickerProps) {
  return (
    <Box 
      className="form-group"
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {!label ? null : (
        <Box className="form-label">
          {label}
        </Box>
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          className='date-picker'
          value={value}
          onChange={onChange}
          format="MMMM D, YYYY (dddd)"
          minDate={minDate}
          shouldDisableDate={shouldDisableDate}
          onMonthChange={onMonthChange}
          disabled={disabled}
          timezone={timezone}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
              error: !!error,
              helperText: error,
              required,
              sx: {
                '& .MuiInputBase-input': {
                  padding: '8.5px 14px'
                }
              }
            },
            day: {
              sx: {
                '&.Mui-disabled': {
                  color: 'text.disabled',
                  backgroundColor: '#f5f5f5',
                },
              },
            }
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}