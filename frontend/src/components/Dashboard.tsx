import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, TrendingUp, Loader } from 'lucide-react'
import { approvalApi } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import ApprovalCard from './ApprovalCard'

interface Approval {
  id: number
  title: string
  description: string
  status: string
  current_step: number
  total_steps?: number
  route_name?: string
  applicant: { id: number; name: string }
  current_approver?: { id: number; name: string }
  created_at: string
  updated_at?: string
}

interface Stats {
  pending: number
  approved_today: number
  rejected_today: number
  total_this_month: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [stats, setStats] = useState<Stats>({
    pending: 0,
    approved_today: 0,
    rejected_today: 0,
    total_this_month: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 承認一覧を取得
        const response = await approvalApi.getApprovals({ status: 'pending' })

        // レスポンスの形式に応じて処理
        const approvalsData = response.data || response || []
        setApprovals(Array.isArray(approvalsData) ? approvalsData : [])

        // 統計情報を計算 (TODO: バックエンドからの統計APIを実装予定)
        const pendingCount = approvalsData.filter((a: Approval) => a.status === 'pending').length
        setStats({
          pending: pendingCount,
          approved_today: 0, // TODO: API実装後に更新
          rejected_today: 0, // TODO: API実装後に更新
          total_this_month: approvalsData.length,
        })
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 自分が承認者の申請のみをフィルタリング
  const myApprovals = approvals.filter(
    (approval) => approval.current_approver?.id === user?.id
  )

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    )
  }

  // エラー時
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
        >
          再読み込み
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="承認待ち"
            value={stats.pending}
            color="yellow"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="今日の承認"
            value={stats.approved_today}
            color="green"
          />
          <StatCard
            icon={<XCircle className="w-6 h-6" />}
            label="今日の差し戻し"
            value={stats.rejected_today}
            color="red"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="今月の合計"
            value={stats.total_this_month}
            color="blue"
          />
        </div>
      </div>

      {/* Pending Approvals */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            あなたの承認待ち ({myApprovals.length}件)
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            すべて見る →
          </button>
        </div>

        {myApprovals.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">承認待ちの申請はありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myApprovals.map((approval) => (
              <ApprovalCard key={approval.id} approval={approval} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">最近の活動</h3>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="divide-y divide-gray-200">
            {approvals.slice(0, 5).map((approval) => (
              <div key={approval.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {approval.applicant.name}が申請を作成
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{approval.title}</p>
                  </div>
                  <span className="text-xs text-gray-500 sm:ml-4 sm:whitespace-nowrap">
                    {formatDate(approval.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  color: 'yellow' | 'green' | 'red' | 'blue'
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  return date.toLocaleDateString('ja-JP')
}
