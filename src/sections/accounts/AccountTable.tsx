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
  Tab
} from '@mui/material';

interface AccountTableProps {
  rows: User[];
  emptyRows: number;
  editIcon: string;
  hasSearchTerm: boolean;
  onEditClick: (account: User) => void;
}

export function AccountTable({ rows, emptyRows, editIcon, hasSearchTerm, onEditClick  }: AccountTableProps) {
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
            <TableCell align="left"><b>ID</b></TableCell>
            <TableCell align="left"><b>NAME</b></TableCell>
            <TableCell align="left"><b>EMAIL ADDRESS</b></TableCell>
            <TableCell align="left"><b>CONTACT NUMBER</b></TableCell>
            <TableCell align="left"><b>ADDRESS</b></TableCell>
            <TableCell align="left"><b>STATUS</b></TableCell>
            <TableCell align="left"><b>ACTION</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && hasSearchTerm ? (
            <TableRow>
              <TableCell colSpan={7} align="center" style={{ height: '60px' }}>
                <Typography variant="body1" color="textSecondary">
                  No data found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align='left'>{row.id}</TableCell>
                  <TableCell align="left">{row.full_name}</TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.contact_no}</TableCell>
                  <TableCell align="left">{row.address}</TableCell>
                  <TableCell align="left" className={row.status === '1' ? 'active' : 'inactive'}>
                    <Typography component="span">
                      {row.status === '1' ? 'Active' : 'Inactive'}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    {/* <img src={editIcon} className="edit-icon" alt="edit icon" /> */}
                    <IconButton onClick={() => onEditClick(row)}>
                      <img src={editIcon} className="edit-icon" alt="edit icon" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}