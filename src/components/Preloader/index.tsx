'use client'

import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';

export default function Preloader() {

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.preloader')?.remove()
    }, 5000);

    return () => clearTimeout(timer);
  }, [])

  return (
    <Box 
      className="preloader"
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        // backdropFilter: 'blur(2px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: '#00B69B',
          animationDuration: '800ms',
        }} 
      />
    </Box>
  )
}

