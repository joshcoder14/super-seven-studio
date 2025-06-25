// app/components/Preloader.tsx
'use client'

import { useState, useEffect } from 'react'

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
      <div className="preloader">
        <p>Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}
