'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { paths } from '@/paths'
import { User, AuthResponse } from '@/types/user'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (response: AuthResponse) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const userData = localStorage.getItem('user')

        if (accessToken && userData) {
          setIsAuthenticated(true)
          setUser(JSON.parse(userData))
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
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('user', JSON.stringify(response.data))
    setIsAuthenticated(true)
    setUser(response.data)
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
      updateUser,
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