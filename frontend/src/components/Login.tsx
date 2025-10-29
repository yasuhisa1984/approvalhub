import { useState } from 'react'
import { CheckCircle2, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('ログインに失敗しました。メールアドレスとパスワードを確認してください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle2 className="w-12 h-12 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">ApprovalHub</h1>
          </div>
          <p className="text-gray-600">10秒で完結する承認システム</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ログイン</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600">ログイン状態を保持</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                パスワードを忘れた
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  ログイン中...
                </>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 space-y-3">
            <p className="text-xs font-semibold text-gray-900 mb-2">🚀 デモアカウント</p>

            <button
              onClick={() => handleDemoLogin('superadmin@approvalhub.com')}
              className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 text-left transition-colors"
              disabled={isLoading}
            >
              <p className="text-xs font-semibold text-purple-900">スーパー管理者</p>
              <p className="text-xs text-purple-700">superadmin@approvalhub.com</p>
            </button>

            <button
              onClick={() => handleDemoLogin('admin@sample.co.jp')}
              className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-left transition-colors"
              disabled={isLoading}
            >
              <p className="text-xs font-semibold text-blue-900">テナント管理者</p>
              <p className="text-xs text-blue-700">admin@sample.co.jp</p>
            </button>

            <button
              onClick={() => handleDemoLogin('suzuki@example.com')}
              className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 text-left transition-colors"
              disabled={isLoading}
            >
              <p className="text-xs font-semibold text-green-900">一般ユーザー</p>
              <p className="text-xs text-green-700">suzuki@example.com</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          アカウントをお持ちでない方は{' '}
          <a
            href="/signup"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = '/signup'
            }}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            無料で始める
          </a>
        </p>
      </div>
    </div>
  )
}
