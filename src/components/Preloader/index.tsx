'use client'

import { useState, useEffect } from 'react'
import { Box, CircularProgress } from '@mui/material';

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500) // Adjust duration as needed
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Box 
        className="preloader"
        sx={{
          position: 'fixed',
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

  return <>{children}</>
}
