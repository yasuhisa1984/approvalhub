import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { mockApprovals, mockStats } from '../data/mockData'
import ApprovalCard from './ApprovalCard'

export default function Dashboard() {
  const myApprovals = mockApprovals.filter(
    (approval) => approval.current_approver?.id === 2
  )

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="承認待ち"
            value={mockStats.pending}
            color="yellow"
          />
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            label="今日の承認"
            value={mockStats.approved_today}
            color="green"
          />
          <StatCard
            icon={<XCircle className="w-6 h-6" />}
            label="今日の差し戻し"
            value={mockStats.rejected_today}
            color="red"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="今月の合計"
            value={mockStats.total_this_month}
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
        <h3 className="text-xl font-bold text-gray-900 mb-6">最近の活動</h3>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="divide-y divide-gray-200">
            {mockApprovals.slice(0, 5).map((approval) => (
              <div key={approval.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {approval.applicant.name}が申請を作成
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{approval.title}</p>
                  </div>
                  <span className="text-xs text-gray-500">
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
