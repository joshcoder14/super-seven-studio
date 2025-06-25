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
  Paper, 
  Typography
} from '@mui/material';


export default function BillingTable() {

    return (
        <TableContainer
            component={Paper}
            style={{
            borderRadius: '14px',
            border: '0.3px solid #D5D5D5',
            boxShadow: 'none',
            marginTop: '30px',
            }}
            className='account-table'
        >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell align="left"><b>ID</b></TableCell>
                <TableCell align="left"><b>EVENT NAME</b></TableCell>
                <TableCell align="left"><b>CLIENT</b></TableCell>
                <TableCell align="left"><b>PACKAGE</b></TableCell>
                <TableCell align="left"><b>ADD-ON</b></TableCell>
                <TableCell align="left"><b>BALANCE</b></TableCell>
                <TableCell align="left"><b>STATUS</b></TableCell>
                <TableCell align="left"><b>ACTION</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell align='left'>1006</TableCell>
                    <TableCell align='left'>Daniel's 8th Birthday</TableCell>
                    <TableCell align="left">Smile Services</TableCell>
                    <TableCell align="left">Package A</TableCell>
                    <TableCell align='left'>None</TableCell>
                    <TableCell align='left'>P5,000.00</TableCell>
                    <TableCell align="left" className='unpaid'>
                        <Typography component="span">
                            Unpaid
                        </Typography>
                    </TableCell>
                    <TableCell align="left" sx={{ display: 'flex', gap: '10px' }}>
                        <IconButton sx={{ paddingLeft: '5px' }}>
                            <img src={editIcon} className="edit-icon" alt="edit icon" />
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell align='left'>1006</TableCell>
                    <TableCell align='left'>Daniel’s 8th Birthday</TableCell>
                    <TableCell align="left">Smile Services</TableCell>
                    <TableCell align="left">Package A</TableCell>
                    <TableCell align='left'>None</TableCell>
                    <TableCell align='left'>P5,000.00</TableCell>
                    <TableCell align="left" className='unpaid'>
                        <Typography component="span">
                            Unpaid
                        </Typography>
                    </TableCell>
                    <TableCell align="left" sx={{ display: 'flex', gap: '10px' }}>
                        <IconButton sx={{ paddingLeft: '5px' }}>
                            <img src={editIcon} className="edit-icon" alt="edit icon" />
                        </IconButton>
                    </TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </TableContainer>
    )
}