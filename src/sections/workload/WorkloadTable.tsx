'use client';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@/sections/accounts/styles';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
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
import { icons } from '@/icons';
import { MappedWorkloadItem } from '@/types/workload';

interface WorkLoadTableProps {
  data: MappedWorkloadItem[];
  loading: boolean;
  onEditClick: (eventData: MappedWorkloadItem) => void;
}

export function WorkLoadTable({ data, loading, onEditClick }: WorkLoadTableProps) {
  const router = useRouter();

  const tableHeader = [
    'Event Name',
    'Client',
    'Booking Date',
    'Assigned',
    'Release Date',
    'Status',
    'Action'
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
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell><Skeleton variant="text" /></TableCell>
                <TableCell sx={{ display: 'flex', gap: '8px' }}>
                  <Skeleton sx={{ borderRadius: '8px' }} variant="circular" width={30} height={30} />
                  <Skeleton sx={{ borderRadius: '8px' }} variant="circular" width={30} height={30} />
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" style={{ height: '60px' }}>
                <Typography 
                  variant="body1"
                  sx={{
                    padding: '30px',
                    background: '#FFFFFF',
                  }}
                >
                  No workloads found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">{row.eventName}</TableCell>
                <TableCell align="left">{row.client}</TableCell>
                <TableCell align="left">{row.bookingDate}</TableCell>
                <TableCell align="left">
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {row.assigned.map((person, index) => (
                      <Tooltip key={`${row.id}-avatar-${index}`} title={person.name} arrow>
                        <img
                          src={person.avatar}
                          alt={person.name}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            cursor: person.id ? 'pointer' : 'default'
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </TableCell>
                <TableCell align="left">{row.releaseDate || 'None'}</TableCell>
                <TableCell align="left" className={`${row.booking_workload_status.toLowerCase()}`}> 
                  <Typography component="span">{row.booking_workload_status}</Typography>
                </TableCell>
                <TableCell align="left" style={{ display: 'flex', gap: '10px' }}>
                  <IconButton onClick={() => onEditClick(row)}>
                    <img src={icons.editIcon} className="edit-icon" alt="edit icon" />
                  </IconButton>
                  <IconButton 
                    sx={{ paddingLeft: '5px' }}
                    onClick={() => router.push(`${paths.workloadView}/${row.id}`)}
                  >
                    <img src={icons.displayIcon} className="view-icon" alt="view icon" />
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