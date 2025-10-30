import { useState } from 'react'
import {
  FileText,
  Download,
  Filter,
  Calendar,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react'
import {
  mockAuditLogs,
  mockAuditSummary,
  auditActionLabels,
  auditActionColors,
} from '../data/auditData'
import { AuditAction } from '../types/audit'

export default function AuditLogs() {
  const [logs] = useState(mockAuditLogs)
  const [filterAction, setFilterAction] = useState<AuditAction | 'all'>('all')
  const [filterUser, setFilterUser] = useState<string>('all')
  const [filterSuccess, setFilterSuccess] = useState<'all' | 'success' | 'failed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week')

  const uniqueUsers = Array.from(new Set(logs.map((log) => log.userName))).sort()

  const filteredLogs = logs.filter((log) => {
    const matchesAction = filterAction === 'all' || log.action === filterAction
    const matchesUser = filterUser === 'all' || log.userName === filterUser
    const matchesSuccess =
      filterSuccess === 'all' ||
      (filterSuccess === 'success' && log.success) ||
      (filterSuccess === 'failed' && !log.success)
    const matchesSearch =
      searchQuery === '' ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())

    // Date range filter
    const logDate = new Date(log.timestamp)
    const now = new Date()
    let matchesDate = true

    if (dateRange === 'today') {
      matchesDate = logDate.toDateString() === now.toDateString()
    } else if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = logDate >= weekAgo
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesDate = logDate >= monthAgo
    }

    return matchesAction && matchesUser && matchesSuccess && matchesSearch && matchesDate
  })

  const handleExport = () => {
    const csv = [
      ['ID', 'アクション', 'ユーザー', 'メール', 'タイムスタンプ', 'IPアドレス', '詳細', '成功'],
      ...filteredLogs.map((log) => [
        log.id,
        auditActionLabels[log.action] || log.action,
        log.userName,
        log.userEmail,
        log.timestamp,
        log.ipAddress,
        log.details,
        log.success ? '成功' : '失敗',
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">監査ログ</h2>
          <p className="text-sm text-gray-600 mt-1">すべてのシステム操作履歴を記録しています</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          <Download className="w-4 h-4" />
          CSVエクスポート
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm">総ログ数</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockAuditSummary.totalLogs}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">本日のログ</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{mockAuditSummary.todayLogs}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">失敗した操作</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{mockAuditSummary.failedActions}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <User className="w-4 h-4" />
            <span className="text-sm">アクティブユーザー</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockAuditSummary.uniqueUsers}</p>
        </div>
      </div>

      {/* Top Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最も多い操作</h3>
        <div className="space-y-3">
          {mockAuditSummary.topActions.map((item, index) => (
            <div key={item.action} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {auditActionLabels[item.action] || item.action}
                  </span>
                  <span className="text-sm text-gray-600">{item.count}回</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{
                      width: `${(item.count / mockAuditSummary.topActions[0].count) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="検索..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Action Filter */}
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value as AuditAction | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべての操作</option>
            {Object.entries(auditActionLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          {/* User Filter */}
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべてのユーザー</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          {/* Success Filter */}
          <select
            value={filterSuccess}
            onChange={(e) => setFilterSuccess(e.target.value as 'all' | 'success' | 'failed')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべて</option>
            <option value="success">成功のみ</option>
            <option value="failed">失敗のみ</option>
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'today' | 'week' | 'month' | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="today">今日</option>
            <option value="week">過去7日間</option>
            <option value="month">過去30日間</option>
            <option value="all">すべて</option>
          </select>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          <span>{filteredLogs.length}件の結果</span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  時刻
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  操作
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  ユーザー
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  詳細
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  IPアドレス
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  結果
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
                        auditActionColors[log.action]
                      }`}
                    >
                      {auditActionLabels[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{log.userName}</p>
                      <p className="text-xs text-gray-500">{log.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 max-w-md">
                    <div className="truncate" title={log.details}>
                      {log.details}
                    </div>
                    {(log.oldValue || log.newValue) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {log.oldValue && <span className="line-through">{log.oldValue}</span>}
                        {log.oldValue && log.newValue && ' → '}
                        {log.newValue && <span className="font-medium">{log.newValue}</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3">
                    {log.success ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        成功
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-red-700">
                        <XCircle className="w-4 h-4" />
                        失敗
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>該当するログが見つかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  )
}
