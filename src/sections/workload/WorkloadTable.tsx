'use client';

import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@/sections/accounts/styles';
import { useRouter } from 'next/navigation';
import {paths} from '@/paths';
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
import {icons} from '@/icons'

type WorkLoadTableProps = {
  onEditClick: (eventData: any) => void;
};

export function WorkLoadTable({ onEditClick }: WorkLoadTableProps) {
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

  const rowData = [
    {
      eventName: "Daniel's 8th Birthday",
      client: "Smile Services",
      bookingDate: "January 15, 2025",
      assigned: [],
      releaseDate: "None",
      status: "Unassigned"
    },
    {
      eventName: "Jane & John's Wedding",
      client: "Tylex Events",
      bookingDate: "January 6, 2025",
      assigned: [
        { name: "Mark Parañas", avatar: icons.profileIcon },
        { name: "Anna Cruz", avatar: icons.profileIcon },
      ],
      releaseDate: "February 1, 2025",
      status: "Scheduled"
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
              <TableCell key={index} align="left"><b>{header}</b></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="left">{row.eventName}</TableCell>
              <TableCell align="left">{row.client}</TableCell>
              <TableCell align="left">{row.bookingDate}</TableCell>
              <TableCell align="left">
                {row.assigned.length === 0 ? (
                  <Typography component="span">None</Typography>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {row.assigned.map((person, idx) => (
                      <Tooltip key={idx} title={person.name} arrow>
                        <img
                          src={person.avatar}
                          alt={person.name}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell align="left">{row.releaseDate}</TableCell>
              <TableCell align="left" className={row.status.toLowerCase()}>
                <Typography component="span">{row.status}</Typography>
              </TableCell>
              <TableCell align="left" style={{ display: 'flex', gap: '10px' }}>
                <IconButton onClick={() => onEditClick(row)}>
                  <img src={icons.editIcon} className="edit-icon" alt="edit icon" />
                </IconButton>
                <IconButton 
                  sx={{ paddingLeft: '5px' }}
                  onClick={() => router.push(paths.workloadView)}
                >
                  <img src={icons.displayIcon} className="view-icon" alt="view icon" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
