'use client';
import { IconButton } from './styles';
import { User } from '@/types/user'
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
  Skeleton
} from '@mui/material';

interface AccountTableProps {
  rows: User[];
  editIcon: string;
  hasSearchTerm: boolean;
  onEditClick: (account: User) => void;
  loading: boolean;
}

export function AccountTable({ rows, editIcon, hasSearchTerm, onEditClick, loading }: AccountTableProps) {

  const tableHeader = [
    'ID',
    'NAME',
    'EMAIL ADDRESS',
    'CONTACT NUMBER',
    'ADDRESS',
    'STATUS',
    'ACTION'
  ];

  // Function to handle null/undefined fields
  const getDisplayValue = (value: string | null | undefined, fallback = '-') => {
    return value || fallback;
  };

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
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell sx={{ display: 'flex', gap: '8px' }}>
                  <Skeleton sx={{ borderRadius: '8px' }} variant="circular" width={30} height={30} />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" style={{ height: '60px' }}>
                <Typography variant="body1" color="textSecondary">
                  {hasSearchTerm ? 'No matching records found' : 'No data available'}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">{getDisplayValue(row.full_name)}</TableCell>
                <TableCell align="left">{getDisplayValue(row.email)}</TableCell>
                <TableCell align="left">{getDisplayValue(row.contact_no)}</TableCell>
                <TableCell align="left">{getDisplayValue(row.address)}</TableCell>
                <TableCell align="left" className={row.status === '1' ? 'active' : 'inactive'}>
                  <Typography 
                    component="span"
                  >
                    {row.status === '1' ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <IconButton onClick={() => onEditClick(row)}>
                    <img src={editIcon} className="edit-icon" alt="edit" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}