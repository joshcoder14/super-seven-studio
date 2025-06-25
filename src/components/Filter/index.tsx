'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Filter } from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterByProps {
  options: readonly FilterOption[];
  selectedValue: string;
  onFilterChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function FilterBy({ 
  options, 
  selectedValue, 
  onFilterChange, 
  label = 'Filter By:',
  disabled = false 
}: FilterByProps) {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (onFilterChange) {
        onFilterChange(value);
      }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsSelectOpen(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Filter className="filter">
            <label htmlFor="filter" onClick={(e) => e.preventDefault()}>
              {label}
            </label>
            <Box className="select-list" style={{ position: 'relative', width: 'auto' }} ref={selectRef}>
                <select
                  id="filter"
                  name="filter"
                  value={selectedValue}
                  onChange={handleChange}
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  disabled={disabled}
                >
                  {options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: isSelectOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%) rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    pointerEvents: 'none',
                    color: '#202224'
                  }}
                />
            </Box>
        </Filter>
    );
}