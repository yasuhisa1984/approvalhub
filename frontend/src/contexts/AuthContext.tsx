import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { authApi } from '../lib/api'
import * as authLib from '../lib/auth'

export interface User {
  id: number
  name: string
  email: string
  role: 'superadmin' | 'admin' | 'manager' | 'member'
  tenantId?: number
  tenant_id?: number
  tenantName?: string
  avatar?: string
  avatar_url?: string
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

  // ページロード時に認証状態をチェック
  useEffect(() => {
    const checkAuth = async () => {
      if (authLib.isAuthenticated()) {
        const storedUser = authLib.getUser()
        if (storedUser) {
          setUser(storedUser as User)
          console.log('✅ Authenticated user:', storedUser.name)
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // 実APIを呼び出し
      const response = await authApi.login(email, password)

      // レスポンス確認
      if (!response.token || !response.user) {
        throw new Error('Invalid response from server')
      }

      // LocalStorageに保存 (新しいauth.tsライブラリを使用)
      authLib.login(response.token, response.user)

      // User型に変換してStateに保存
      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        tenantId: response.user.tenant_id,
        tenant_id: response.user.tenant_id,
        avatar: response.user.avatar_url,
        avatar_url: response.user.avatar_url,
      }

      setUser(user)
      console.log('✅ Login successful:', user.name)
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)

      // API呼び出し (ベストエフォート)
      try {
        await authApi.logout()
      } catch (error) {
        console.warn('Logout API failed (continuing anyway):', error)
      }

      // LocalStorageクリア
      authLib.logout()

      // State更新
      setUser(null)

      console.log('✅ Logout successful')

      // ログイン画面へリダイレクト
      window.location.href = '/login'
    } catch (error) {
      console.error('❌ Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
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
