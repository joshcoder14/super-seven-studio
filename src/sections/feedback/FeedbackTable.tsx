'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Skeleton
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { 
  MappedFeedbackItem
} from '@/types/feedback';

type FeedBackTableProps = {
  data: MappedFeedbackItem[];
  loading: boolean;
  onViewClick: (feedbackData: MappedFeedbackItem) => void
};

export function FeedBackTable({ data, loading, onViewClick }: FeedBackTableProps) {

  const tableHeader = [
    'Event Name',
    'Client',
    'Booking Date',
    'Status',
    'Action'
  ];

  return (
    <TableContainer
      component={Paper}
      style={{
        borderRadius: '14px',
        border: '0.3px solid #D5D5D5',
        boxShadow: 'none',
        marginTop: '30px'
      }}
      className='account-table'
    >
      <Table sx={{ minWidth: 650 }} aria-label="feedback table">
        <TableHead>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableCell key={index} align="left"><b>{header}</b></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell sx={{ display: 'flex', gap: '8px' }}>
                  <Skeleton sx={{ borderRadius: '8px' }} variant="circular" width={30} height={30} />
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography>No feedbacks found</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.event_name}</TableCell>
                <TableCell align="left">{row.customer_name}</TableCell>
                <TableCell align="left">{row.booking_date}</TableCell>
                <TableCell align="left" className={row.feedback_status.toLowerCase()}>
                  <Typography component="span">{row.feedback_status}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Button 
                    onClick={() => onViewClick(row)}
                    sx={{ 
                      textTransform: 'capitalize',
                      padding: '6px 16px',
                      backgroundColor: '#FAFBFD',
                      border: '0.6px solid #D5D5D5',
                      borderRadius: '8px',
                      fontFamily: 'Nunito Sans',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#202224',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#D5D5D5',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px'
                      }
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}