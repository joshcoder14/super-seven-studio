// components/TransactionTable.tsx
'use client';

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper
} from '@mui/material';
import { TransactionProps } from '@/types/billing';
import { formatAmount } from '@/utils/billing';

interface TransactionTableProps {
  transactions?: TransactionProps[]; // Make prop optional
}

export function TransactionTable({ transactions = [] }: TransactionTableProps) {
  const tableHeader = [
    'TRANSACTION DATE',
    'AMOUNT PAID',
    'BALANCE',
    'PAYMENT METHOD',
    'REMARKS',
  ];

  return (
    <TableContainer
      component={Paper}
      style={{
        borderRadius: '14px',
        border: '0.3px solid #D5D5D5',
        boxShadow: 'none',
        marginTop: '30px',
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="transactions table">
        <TableHead>
          <TableRow>
            {tableHeader.map((header, index) => (
              <TableCell key={index} align="center"><b>{header}</b></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell align="center">{transaction.transaction_date}</TableCell>
                <TableCell align="center">{formatAmount(transaction.amount_paid)}</TableCell>
                <TableCell align="center">{formatAmount(transaction.balance)}</TableCell>
                <TableCell align="center">{transaction.payment_method}</TableCell>
                <TableCell align="center">{transaction.remarks}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}