'use client';

import React from 'react';
import { TablePagination } from '@mui/material';

interface CustomTablePaginationProps {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export function CustomTablePagination({
  count,
  rowsPerPage,
  page,
  onPageChange,
  onRowsPerPageChange
}: CustomTablePaginationProps) {
  return (
    <TablePagination
      className='table-pagination'
      rowsPerPageOptions={[10]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage="Showing:"
      slotProps={{
        actions: {
          previousButton: {
            id: 'pagination-prev-button'
          },
          nextButton: {
            id: 'pagination-next-button'
          }
        }
      }}
    />
  );
}