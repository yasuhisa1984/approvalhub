import { useState } from 'react'
import {
  Activity,
  Database,
  Server,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react'
import {
  mockSystemHealth,
  mockErrorLogs,
  mockSystemStats,
  mockUserActivities,
  mockStuckApprovals,
} from '../data/adminData'
import { ErrorLog } from '../types/admin'

export default function AdminDashboard() {
  const [errorLogs, setErrorLogs] = useState(mockErrorLogs)
  const [filterLevel, setFilterLevel] = useState<'all' | 'error' | 'warning' | 'info'>('all')
  const [filterResolved, setFilterResolved] = useState<'all' | 'resolved' | 'unresolved'>('all')

  const filteredLogs = errorLogs.filter((log) => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesResolved =
      filterResolved === 'all' ||
      (filterResolved === 'resolved' && log.resolved) ||
      (filterResolved === 'unresolved' && !log.resolved)
    return matchesLevel && matchesResolved
  })

  const handleResolveLog = (id: number) => {
    setErrorLogs(errorLogs.map((log) => (log.id === id ? { ...log, resolved: true } : log)))
  }

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h2>
          <p className="text-sm text-gray-600 mt-1">システムの健全性と運用状況を監視します</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
          <RefreshCw className="w-4 h-4" />
          更新
        </button>
      </div>

      {/* System Health */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">システムヘルス</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Database */}
          <div className={`border-2 rounded-lg p-4 ${getStatusColor(mockSystemHealth.database.status)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-900">データベース</span>
              </div>
              {getStatusIcon(mockSystemHealth.database.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">応答時間</span>
                <span className="font-medium text-gray-900">{mockSystemHealth.database.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">接続数</span>
                <span className="font-medium text-gray-900">
                  {mockSystemHealth.database.connections}/{mockSystemHealth.database.maxConnections}
                </span>
              </div>
            </div>
          </div>

          {/* API */}
          <div className={`border-2 rounded-lg p-4 ${getStatusColor(mockSystemHealth.api.status)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-900">API</span>
              </div>
              {getStatusIcon(mockSystemHealth.api.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">応答時間</span>
                <span className="font-medium text-gray-900">{mockSystemHealth.api.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">稼働率</span>
                <span className="font-medium text-gray-900">{mockSystemHealth.api.uptime}%</span>
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className={`border-2 rounded-lg p-4 ${getStatusColor(mockSystemHealth.storage.status)}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-900">ストレージ</span>
              </div>
              {getStatusIcon(mockSystemHealth.storage.status)}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">使用量</span>
                <span className="font-medium text-gray-900">
                  {mockSystemHealth.storage.used}GB / {mockSystemHealth.storage.total}GB
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${mockSystemHealth.storage.usagePercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">システム統計</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">総申請数</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockSystemStats.totalApprovals}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">承認待ち</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{mockSystemStats.pendingApprovals}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">本日承認</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{mockSystemStats.approvedToday}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">本日却下</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{mockSystemStats.rejectedToday}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">平均処理時間</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{mockSystemStats.avgApprovalTime}h</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">アクティブユーザー</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {mockSystemStats.activeUsers}/{mockSystemStats.totalUsers}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">滞留案件</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{mockSystemStats.stuckApprovals}</p>
          </div>
        </div>
      </div>

      {/* Stuck Approvals Alert */}
      {mockStuckApprovals.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-2">承認が滞留している案件があります</h4>
              <div className="space-y-2">
                {mockStuckApprovals.slice(0, 3).map((approval) => (
                  <div key={approval.id} className="text-sm text-orange-800">
                    <span className="font-medium">{approval.title}</span>
                    <span className="text-orange-600 ml-2">
                      ({approval.currentApprover}さんが{approval.daysPending}日間保留中)
                    </span>
                  </div>
                ))}
              </div>
              {mockStuckApprovals.length > 3 && (
                <button className="text-sm text-orange-700 font-medium mt-2 hover:text-orange-800">
                  さらに{mockStuckApprovals.length - 3}件を表示 →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Logs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">エラーログ</h3>
          <div className="flex gap-2">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">すべてのレベル</option>
              <option value="error">エラー</option>
              <option value="warning">警告</option>
              <option value="info">情報</option>
            </select>
            <select
              value={filterResolved}
              onChange={(e) => setFilterResolved(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">すべて</option>
              <option value="unresolved">未解決</option>
              <option value="resolved">解決済み</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              エクスポート
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    時刻
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    レベル
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    メッセージ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    ユーザー
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    ステータス
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          log.level === 'error'
                            ? 'bg-red-100 text-red-800'
                            : log.level === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                      <div className="truncate">{log.message}</div>
                      {log.endpoint && (
                        <div className="text-xs text-gray-500 mt-1">{log.endpoint}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.userName || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {log.resolved ? (
                        <span className="inline-flex items-center gap-1 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          解決済み
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-sm text-red-700">
                          <AlertCircle className="w-4 h-4" />
                          未解決
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {!log.resolved && (
                        <button
                          onClick={() => handleResolveLog(log.id)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          解決済みにする
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Activities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">ユーザー別承認統計</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    ユーザー
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    承認件数
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    平均応答時間
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    最終アクティブ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockUserActivities.map((activity) => (
                  <tr key={activity.userId} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{activity.userName}</p>
                        <p className="text-sm text-gray-500">{activity.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {activity.approvalCount}件
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {activity.avgResponseTime}時間
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{activity.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
