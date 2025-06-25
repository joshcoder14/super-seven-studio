'use client';

import React from 'react';
import { Search } from './styles';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function SearchBox({ 
  searchTerm, 
  onSearchChange ,
  placeholder = 'Search'
}: SearchBoxProps) {
  return (
    <Search>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={onSearchChange}
      />

      <SearchIcon />
    </Search>
  );
}