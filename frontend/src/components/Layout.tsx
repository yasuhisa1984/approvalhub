import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle2, Home, Settings, Users, LogOut, Bell, Plus, FileText, Layout as LayoutIcon, Shield, Building2, ArrowLeft, Code } from 'lucide-react'
import { useImpersonation } from '../contexts/ImpersonationContext'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { impersonatedTenant, exitImpersonation, isImpersonating } = useImpersonation()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Impersonation Banner */}
      {isImpersonating && impersonatedTenant && (
        <div className="bg-purple-600 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5" />
              <span className="font-medium">
                現在、{impersonatedTenant.name} ({impersonatedTenant.subdomain}) として表示中
              </span>
            </div>
            <button
              onClick={exitImpersonation}
              className="flex items-center gap-2 px-4 py-1.5 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              元のアカウントに戻る
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">ApprovalHub</h1>
              {isImpersonating && impersonatedTenant && (
                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                  {impersonatedTenant.subdomain}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-6">
              {/* New Approval Button with Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  新規申請
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link
                    to="/approvals/create-template"
                    className="block px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-900 border-b border-gray-200"
                  >
                    📝 テンプレートから作成
                  </Link>
                  <Link
                    to="/approvals/create"
                    className="block px-4 py-3 hover:bg-gray-50 text-sm font-medium text-gray-600"
                  >
                    カスタムフォーム
                  </Link>
                </div>
              </div>

              {/* Notification Bell */}
              <Link to="/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive('/')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5" />
              ダッシュボード
            </Link>
            <Link
              to="/my-approvals"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive('/my-approvals')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              自分の申請
            </Link>
            <Link
              to="/approvals/create"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive('/approvals/create')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-5 h-5" />
              新規申請
            </Link>
            <Link
              to="/team"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive('/team')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              チーム管理
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isActive('/admin')
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-5 h-5" />
              管理者
            </Link>
            {!isImpersonating && (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase mt-2">スーパー管理者</p>
                <Link
                  to="/superadmin/tenants"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive('/superadmin/tenants')
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  テナント管理
                </Link>
              </div>
            )}
            <div className="pt-2 mt-2">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">設定</p>
              <Link
                to="/settings/routes"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive('/settings/routes')
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                承認ルート
              </Link>
              <Link
                to="/settings/forms"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive('/settings/forms')
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LayoutIcon className="w-5 h-5" />
                フォームテンプレート
              </Link>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">開発者</p>
              <Link
                to="/api-docs"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive('/api-docs')
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Code className="w-5 h-5" />
                API ドキュメント
              </Link>
            </div>
            <div className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5" />
                ログアウト
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
