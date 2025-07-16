'use client'

import { CircularProgress } from '@mui/material'
import { PreloadWrapper } from './styles'
import { useLoading } from '@/context/LoadingContext'
import { useEffect, useState } from 'react'

export default function Preloader() {
  const { isLoading } = useLoading()
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isLoading) {
      setShowLoader(true)

      timeoutId = setTimeout(() => {
        setShowLoader(false)
      }, 5000)
    } else {
      setShowLoader(false)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [isLoading])

  if (!showLoader) return null

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