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
  Skeleton
} from '@mui/material';

export function ReportsTable() {

  const tableHeader = [
    'Booking Date',
    'Event Name',
    'Client Name'
  ];

  return (
    <TableContainer
      component={Paper}
      style={{
        border: '0.3px solid #D5D5D5',
        boxShadow: 'none',
        marginTop: '30px',
        borderLeft: 'none',
        borderRight: 'none'
      }}
      className="account-table"
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
            <TableRow>
                <TableCell align="left">December 29, 2024</TableCell>
                <TableCell align="left">Christmas Party</TableCell>
                <TableCell align="left">Carlos Yu</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}