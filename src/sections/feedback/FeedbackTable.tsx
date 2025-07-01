'use client';

import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@/sections/accounts/styles';
import { useRouter } from 'next/navigation';
import {paths} from '@/paths';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button
} from '@mui/material';

// type WorkLoadTableProps = {
// //   onEditClick: (eventData: any) => void;
// };

export function FeedBackTable() {
//   const router = useRouter();

  const tableHeader = [
    'Event Name',
    'Client',
    'Booking Date',
    'Status',
    'Action'
  ];

  const rowData = [
    {
      eventName: "Jane & John's Wedding",
      client: "Tylex Events",
      bookingDate: "January 6, 2025",
      status: "Posted"
    },
    {
      eventName: "Christmas Party",
      client: "Carlo Yu",
      bookingDate: "December 25, 2024",
      status: "Unposted"
    },
    {
      eventName: "Charlie's Birthday ",
      client: "Smile Services",
      bookingDate: "December 29, 2024",
      status: "Pending"
    },
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
      <Table sx={{ minWidth: 650 }} aria-label="workload table">
        <TableHead>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableCell key={index} align="left"><b>{header}</b></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="left">{row.eventName}</TableCell>
              <TableCell align="left">{row.client}</TableCell>
              <TableCell align="left">{row.bookingDate}</TableCell>
              <TableCell align="left" className={row.status.toLowerCase()}>
                <Typography component="span">{row.status}</Typography>
              </TableCell>
              <TableCell align="left" style={{ display: 'flex', gap: '10px' }}>
                <Button 
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
                            // under text
                            textDecoration: 'underline',
                            textUnderlineOffset: '3px'
                        }
                    }}
                >
                    View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
