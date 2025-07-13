'use client'

import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';

import { PreloadWrapper } from './styles';

export default function Preloader() {

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.preloader')?.remove()
    }, 5000);

    return () => clearTimeout(timer);
  }, [])

  return (
    <PreloadWrapper className="preloader">
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: '#00B69B',
          animationDuration: '800ms',
        }} 
      />
    </PreloadWrapper>
  )
}

