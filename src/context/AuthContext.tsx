'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { paths } from '@/paths'
import { User, AuthResponse, UserRole } from '@/types/user'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (response: AuthResponse) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  updateUser: (userData: User) => void
  canAccess: (path: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Set role cookie helper
  const setRoleCookie = (role: UserRole) => {
    document.cookie = `user_role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
  }

  // Clear role cookie helper
  const clearRoleCookie = () => {
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setRoleCookie(userData.user_role as UserRole)
  }

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    return null
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token') || getCookie('authToken')
        const userData = localStorage.getItem('user')
        const roleCookie = getCookie('user_role') as UserRole

        if (accessToken && userData) {
          const parsedUser: User = JSON.parse(userData)
          setIsAuthenticated(true)
          setUser(parsedUser)
          
          // Restore role cookie if missing
          if (!roleCookie) {
            setRoleCookie(parsedUser.user_role as UserRole)
          }
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

  const login = async (response: AuthResponse) => {
    // Add role validation
    if (!response.data.user_role) {
      throw new Error('User role is missing in auth response')
    }

    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.data))
    setIsAuthenticated(true)
    setUser(response.data)
    setRoleCookie(response.data.user_role as UserRole)
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
      clearRoleCookie()

      // Clear auth cookies
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
      document.cookie = 'XSRF-TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'

      setIsAuthenticated(false)
      setUser(null)
      window.location.href = paths.login
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Client-side access check
  const canAccess = (path: string): boolean => {
    if (!user) return false
    
    switch (user.user_role) {
      case 'Owner':
        return true
      case 'Secretary':
        return !path.startsWith('/billing')
      case 'Editor':
      case 'Photographer':
        return ['/', '/workload', '/settings'].some(
          allowed => path === allowed || path.startsWith(`${allowed}/`)
        )
      case 'Client':
        return ['/', '/booking', '/package', '/billing', '/settings'].some(
          allowed => path === allowed || path.startsWith(`${allowed}/`)
        )
      default:
        return false
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      updateUser,
      loading,
      canAccess
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