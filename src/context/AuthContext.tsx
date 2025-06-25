'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { paths } from '@/paths'
import { User, AuthResponse } from '@/types/user'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (response: AuthResponse) => Promise<void>
  logout: () => Promise<void>
  // verifySession: () => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const userData = localStorage.getItem('user')

        if (accessToken && userData) {
          setIsAuthenticated(true)
          setUser(JSON.parse(userData))
          // await verifySession() // Verify token is still valid
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        await logout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // const verifySession = async () => {
  //   try {
  //     const accessToken = localStorage.getItem('access_token')
  //     if (!accessToken) return false

  //     // Get CSRF cookie first if using Sanctum
  //     await fetch('/api/sanctum/csrf-cookie', { credentials: 'include' })

  //     const response = await fetch('/api/users/current', {
  //       credentials: 'include',
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`,
  //         'Accept': 'application/json'
  //       }
  //     })

  //     if (response.ok) {
  //       const { data: user } = await response.json() as { data: User }
  //       setUser(user)
  //       localStorage.setItem('user', JSON.stringify(user))
  //       return true
  //     }

  //     throw new Error('Session verification failed')
  //   } catch (error) {
  //     console.error('Session error:', error)
  //     await logout()
  //     return false
  //   }
  // }

  const login = async (response: AuthResponse) => {
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.data))
    setIsAuthenticated(true)
    setUser(response.data)
    // await verifySession()
  }

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      
      if (accessToken) {
        await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        })
      }

      // Clear all auth data
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      document.cookie.split(';').forEach(c => {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'
      })

      setIsAuthenticated(false)
      setUser(null)
      window.location.href = paths.login
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      // verifySession,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}