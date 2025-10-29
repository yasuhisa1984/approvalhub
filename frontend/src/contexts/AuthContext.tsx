import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface User {
  id: number
  name: string
  email: string
  role: 'superadmin' | 'admin' | 'manager' | 'member'
  tenantId?: number
  tenantName?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isSuperAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ページロード時にlocalStorageから復元
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('auth_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // TODO: 実際のAPI呼び出しに置き換える
    // const response = await fetch('/api/auth/login', { ... })

    // モック実装
    await new Promise(resolve => setTimeout(resolve, 500))

    let mockUser: User

    // スーパー管理者
    if (email === 'superadmin@approvalhub.com') {
      mockUser = {
        id: 999,
        name: 'スーパー管理者',
        email: 'superadmin@approvalhub.com',
        role: 'superadmin',
      }
    }
    // テナント管理者
    else if (email === 'admin@sample.co.jp') {
      mockUser = {
        id: 1,
        name: '山田太郎',
        email: 'admin@sample.co.jp',
        role: 'admin',
        tenantId: 1,
        tenantName: '株式会社サンプル',
      }
    }
    // 一般ユーザー
    else {
      mockUser = {
        id: 3,
        name: '鈴木一郎',
        email: 'suzuki@example.com',
        role: 'member',
        tenantId: 1,
        tenantName: '株式会社サンプル',
      }
    }

    setUser(mockUser)
    localStorage.setItem('auth_user', JSON.stringify(mockUser))
    localStorage.setItem('auth_token', 'mock_jwt_token_' + Date.now())
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('impersonated_tenant')
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        isSuperAdmin: user?.role === 'superadmin',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
