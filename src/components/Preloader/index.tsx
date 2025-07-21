'use client'

import { CircularProgress } from '@mui/material'
import { PreloadWrapper } from './styles'
import { useLoading } from '@/context/LoadingContext'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default function Preloader() {
  const { isLoading } = useLoading()

  useEffect(() => {
    if (isLoading) {
      Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })
    } else {
      Swal.close()
    }
  }, [isLoading])

  return null
}