import { useState, useEffect, ReactNode } from 'react'
import { CheckCircle2, Lock } from 'lucide-react'

interface BasicAuthProps {
  children: ReactNode
}

export default function BasicAuth({ children }: BasicAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 認証が有効かチェック
  const isAuthEnabled = import.meta.env.VITE_BASIC_AUTH_ENABLED === 'true'
  const validPassword = import.meta.env.VITE_BASIC_AUTH_PASSWORD || ''

  useEffect(() => {
    // 認証が無効な場合はスキップ
    if (!isAuthEnabled) {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

    // セッションストレージから認証状態をチェック
    const authToken = sessionStorage.getItem('basic_auth_token')
    if (authToken === validPassword) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [isAuthEnabled, validPassword])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === validPassword) {
      sessionStorage.setItem('basic_auth_token', password)
      setIsAuthenticated(true)
    } else {
      setError('パスワードが正しくありません')
      setPassword('')
    }
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 認証済み、または認証が無効な場合
  if (isAuthenticated) {
    return <>{children}</>
  }

  // 認証画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-12 h-12 text-primary-600" />
              <h1 className="text-3xl font-bold text-gray-900">ApprovalHub</h1>
            </div>
            <p className="text-gray-600">開発中のため、アクセスには認証が必要です</p>
          </div>

          {/* 認証フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="パスワードを入力してください"
                autoFocus
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              認証
            </button>
          </form>

          {/* フッター */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              このアプリケーションは現在開発中です
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
