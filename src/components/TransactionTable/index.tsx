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
  Skeleton,
  Button
} from '@mui/material';

export function TransactionTable() {
    const tableHeader = [
        'TRANSACTION DATE',
        'AMOUNT PAID',
        'BALANCE',
        'PAYMENT METHOD',
        'REMARKS',
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
                      <TableCell key={index} align="center"><b>{header}</b></TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="center">December 29, 2024</TableCell>
                        <TableCell align="center">P5,000.00</TableCell>
                        <TableCell align="center">P10,000.00</TableCell>
                        <TableCell align="center">Cash Payment</TableCell>
                        <TableCell align="center">Down Payment</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
        </TableContainer>
    );
}