'use client';

import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
import { Box, Typography } from '@mui/material';

interface TimePickerProps {
  value: Dayjs | null;
  onChange: (time: Dayjs | null) => void;
  label: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function CustomTimePicker({
  value,
  onChange,
  label,
  required = false,
  error,
  disabled = false
}: TimePickerProps) {
  return (
    <Box className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker 
          className='time-picker'
          value={value}
          onChange={onChange}
          disabled={disabled}
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
            }
          }}
        />
      </LocalizationProvider>
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}