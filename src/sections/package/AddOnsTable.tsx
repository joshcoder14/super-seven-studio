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
    Skeleton
} from '@mui/material';
import { icons } from '@/icons';

export default function AddOnsTable({ data, loading }: { data: any[]; loading: boolean }) {
    const tableHeader = [
        'Add-on Name',
        'Price',
        'Details',
        'Action'
    ];

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
                                <TableCell sx={{ display: 'flex', gap: '8px' }}>
                                    <Skeleton sx={{ borderRadius: '8px' }} variant="circular" width={30} height={30} />
                                    <Skeleton sx={{ borderRadius: '8px' }} variant="circular" width={30} height={30} />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : data.length > 0 ? (
                        data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align='left'>{row.add_on_name}</TableCell>
                                <TableCell align="left">P{row.add_on_price}</TableCell>
                                <TableCell align="left">{row.add_on_details}</TableCell>
                                <TableCell align="left" sx={{ display: 'flex', gap: '10px' }}>
                                    <IconButton>
                                        <img src={icons.removeIcon} className="remove-icon" alt="remove icon" />
                                    </IconButton>
                                    <IconButton>
                                        <img src={icons.editIcon} className="edit-icon" alt="edit icon" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                No add-ons found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}