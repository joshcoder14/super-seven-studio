'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Box } from '@mui/material';

interface CheckboxComponentProps {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}

export default function CheckboxComponent({
  id,
  name,
  label,
  checked = true,
  onChange,
}: CheckboxComponentProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newChecked = e.target.checked;
        if (onChange) {
            onChange(newChecked);
        }
    };

    return (
        <Box className="checkbox-container" sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input 
                type="checkbox" 
                name={name} 
                id={id}
                checked={checked}
                onChange={handleChange}
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    border: '0.6px solid #A3A3A3',
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    borderColor: '#A3A3A3',
                }}
            />
            {checked && (
                <FontAwesomeIcon 
                    icon={faCheck} 
                    style={{
                        position: 'absolute',
                        left: '6px',
                        color: 'white',
                        fontSize: 14,
                        pointerEvents: 'none',
                    }}
                />
            )}
            <label htmlFor={id} style={{ marginLeft: '12px' }}>
                {label}
            </label>
        </Box>
    );
}