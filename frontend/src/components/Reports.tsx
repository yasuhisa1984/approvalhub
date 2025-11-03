import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  Download,
  Loader,
} from 'lucide-react'
import { reportsApi } from '../lib/api'

export default function Reports() {
  const [dateRange, setDateRange] = useState('6months')
  const [stats, setStats] = useState<any>(null)
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [departmentData, setDepartmentData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [statsResponse, monthlyResponse, departmentResponse] = await Promise.all([
          reportsApi.getStats(),
          reportsApi.getMonthlyData(),
          reportsApi.getDepartmentData(),
        ])

        setStats(statsResponse)
        setMonthlyData(monthlyResponse || [])
        setDepartmentData(departmentResponse || [])
      } catch (err) {
        console.error('Failed to fetch reports data:', err)
        setError('レポートデータの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // エラー表示
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          再読み込み
        </button>
      </div>
    )
  }

  if (!stats) return null

  const maxMonthlyValue = Math.max(
    ...monthlyData.map((d) => d.approved + d.pending + d.rejected),
    1
  )

  const handleExportPDF = () => {
    alert('PDF出力機能は開発中です')
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['月', '承認済み', '承認待ち', '却下'],
      ...monthlyData.map((d) => [d.month, d.approved, d.pending, d.rejected]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `approval_report_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">レポート</h2>
          <p className="text-sm text-gray-600 mt-1">承認状況の分析とインサイト</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            CSV出力
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <Download className="w-4 h-4" />
            PDF出力
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">期間</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange('1month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange === '1month'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1ヶ月
          </button>
          <button
            onClick={() => setDateRange('3months')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange === '3months'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            3ヶ月
          </button>
          <button
            onClick={() => setDateRange('6months')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange === '6months'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            6ヶ月
          </button>
          <button
            onClick={() => setDateRange('1year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              dateRange === '1year'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            1年
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-blue-700 mb-1">総申請数</p>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>

        {/* Approved */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-700 mb-1">承認済み</p>
          <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
          <p className="text-xs text-green-600 mt-1">
            {stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-yellow-700 mb-1">承認待ち</p>
          <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
          <p className="text-xs text-yellow-600 mt-1">
            {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </div>

        {/* Rejected */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-red-700 mb-1">却下</p>
          <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
          <p className="text-xs text-red-600 mt-1">
            {stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">平均承認時間</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgProcessTime}日</p>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-700">
              前月比: <strong>-35%</strong> （改善）
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">処理速度改善率</p>
              <p className="text-2xl font-bold text-gray-900">{stats.improvement}%</p>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-700">導入前と比較して大幅に改善</p>
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">月別承認件数推移</h3>
        <div className="space-y-4">
          {monthlyData.map((data, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                <div className="flex-1 ml-4">
                  <div className="flex h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${(data.approved / maxMonthlyValue) * 100}%`,
                      }}
                    >
                      {data.approved > 20 && data.approved}
                    </div>
                    <div
                      className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${(data.pending / maxMonthlyValue) * 100}%`,
                      }}
                    >
                      {data.pending > 15 && data.pending}
                    </div>
                    <div
                      className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${(data.rejected / maxMonthlyValue) * 100}%`,
                      }}
                    >
                      {data.rejected > 10 && data.rejected}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 ml-4 w-12 text-right">
                  {data.approved + data.pending + data.rejected}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">承認済み</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">承認待ち</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">却下</span>
          </div>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">部署別申請数</h3>
        </div>
        <div className="space-y-4">
          {departmentData.map((dept, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                <span className="text-sm text-gray-600">
                  {dept.count}件 ({dept.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${dept.percentage * 4}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Breakdown - Pie Chart Alternative */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">ステータス別内訳</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visual Representation */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Approved - Green */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${stats.total > 0 ? (stats.approved / stats.total) * 251.2 : 0} 251.2`}
                  strokeDashoffset="0"
                />
                {/* Pending - Yellow */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#eab308"
                  strokeWidth="20"
                  strokeDasharray={`${stats.total > 0 ? (stats.pending / stats.total) * 251.2 : 0} 251.2`}
                  strokeDashoffset={`-${stats.total > 0 ? (stats.approved / stats.total) * 251.2 : 0}`}
                />
                {/* Rejected - Red */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#ef4444"
                  strokeWidth="20"
                  strokeDasharray={`${stats.total > 0 ? (stats.rejected / stats.total) * 251.2 : 0} 251.2`}
                  strokeDashoffset={`-${
                    stats.total > 0 ? ((stats.approved + stats.pending) / stats.total) * 251.2 : 0
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-600">総申請数</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend and Stats */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium text-gray-900">承認済み</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{stats.approved}</p>
                <p className="text-xs text-gray-600">
                  {stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="font-medium text-gray-900">承認待ち</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-600">
                  {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="font-medium text-gray-900">却下</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-xs text-gray-600">
                  {stats.total > 0 ? ((stats.rejected / stats.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
