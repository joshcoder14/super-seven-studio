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
  Skeleton
} from '@mui/material';
import { WorkloadEmployee } from '@/types/workload';

interface WorkLoadViewTableProps {
  assignedEmployees: WorkloadEmployee[];
}

export function WorkLoadViewTable({ assignedEmployees }: WorkLoadViewTableProps) {
  const tableHeader = [
    'Employee Name',
    'Date Assigned',
    'Status',
    'Date Submitted'
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
          {assignedEmployees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No employees assigned
              </TableCell>
            </TableRow>
          ) : (
            assignedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell align="center">{employee.full_name}</TableCell>
                <TableCell align="center">{employee.date_assigned}</TableCell>
                <TableCell 
                  align="center"
                  className={employee.workload_status.toLowerCase()}
                >
                  <Typography component="span">{employee.workload_status}</Typography>
                </TableCell>
                <TableCell align="center">
                  {employee.date_uploaded || 'N/A'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
