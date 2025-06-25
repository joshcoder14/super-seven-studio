'use client';

import React from 'react';
import { IconButton } from '@/sections/accounts/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';


export default function PackageTable() {

    return (
        <TableContainer
            component={Paper}
            style={{
            borderRadius: '14px',
            border: '0.3px solid #D5D5D5',
            boxShadow: 'none',
            }}
            className='account-table'
        >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell align="left"><b>Package Name</b></TableCell>
                <TableCell align="left"><b>Price</b></TableCell>
                <TableCell align="left"><b>Details</b></TableCell>
                <TableCell align="left"><b>ACTION</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell align='left'>Package A</TableCell>
                    <TableCell align="left">P5,000.00</TableCell>
                    <TableCell align="left">Package A's Details</TableCell>
                    <TableCell align="left" sx={{ display: 'flex', gap: '10px' }}>
                    <IconButton>
                        <img src={removeIcon} className="remove-icon" alt="remove icon" />
                    </IconButton>
                    <IconButton>
                        <img src={editIcon} className="edit-icon" alt="edit icon" />
                    </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align='left'>Package B</TableCell>
                    <TableCell align="left">P15,000.00</TableCell>
                    <TableCell align="left">Package B's Details</TableCell>
                    <TableCell align="left" sx={{ display: 'flex', gap: '10px' }}>
                    <IconButton>
                        <img src={removeIcon} className="remove-icon" alt="remove icon" />
                    </IconButton>
                    <IconButton>
                        <img src={editIcon} className="edit-icon" alt="edit icon" />
                    </IconButton>
                    </TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </TableContainer>
    )
}