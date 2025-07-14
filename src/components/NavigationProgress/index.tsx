'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLoading } from '@/context/LoadingContext'

export default function NavigationProgress() {
  const { hideLoader } = useLoading()
  const pathname = usePathname()

  useEffect(() => {
    hideLoader()
  }, [pathname, hideLoader])

  return null
}