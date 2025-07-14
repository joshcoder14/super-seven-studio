'use client'

import { CircularProgress } from '@mui/material'
import { PreloadWrapper } from './styles'
import { useLoading } from '@/context/LoadingContext'

export default function Preloader() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <PreloadWrapper>
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