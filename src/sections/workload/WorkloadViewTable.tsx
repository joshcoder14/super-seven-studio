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
  Typography
} from '@mui/material';

export function WorkLoadViewTable() {

  const tableHeader = [
    'Employee Name',
    'Date Assigned',
    'Status',
    'Date Submitted'
  ];

  const rowData = [
    {
      employeeName: "Mark Parañas",
      dateAssigned: "November 10, 2024",
      status: "Pending",
      dateSubmitted: "N/A",
    },
    {
      employeeName: "Sheena Daogdog",
      dateAssigned: "November 10, 2024",
      status: "Editing",
      dateSubmitted: "N/A",
    },
    {
      employeeName: "Jackie Borja",
      dateAssigned: "November 10, 2024",
      status: "Completed",
      dateSubmitted: "December 7, 2024",
    },
    {
      employeeName: "Jerrik Estardo",
      dateAssigned: "November 10, 2024",
      status: "Completed",
      dateSubmitted: "December 3, 2024",
    },
    {
      employeeName: "Sheena Daogdog",
      dateAssigned: "November 10, 2024",
      status: "Editing",
      dateSubmitted: "N/A",
    },
    {
      employeeName: "Jackie Borja",
      dateAssigned: "November 10, 2024",
      status: "Completed",
      dateSubmitted: "December 7, 2024",
    },
    {
      employeeName: "Jerrik Estardo",
      dateAssigned: "November 10, 2024",
      status: "Completed",
      dateSubmitted: "December 3, 2024",
    }
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
          {rowData.map((row, index) => (
            <TableRow key={index}>
                <TableCell align="center">{row.employeeName}</TableCell>
                <TableCell align="center">{row.dateAssigned}</TableCell>
                <TableCell 
                    align="center"
                    className={
                        row.status.toLowerCase()
                    }
                >
                    <Typography component="span">{row.status}</Typography>
                </TableCell>
                <TableCell align="center">{row.dateSubmitted}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
