import { Link } from 'react-router-dom'
import { Clock, User, ArrowRight } from 'lucide-react'
import { Approval } from '../types'

interface ApprovalCardProps {
  approval: Approval
}

export default function ApprovalCard({ approval }: ApprovalCardProps) {
  return (
    <Link
      to={`/approvals/${approval.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 pr-2">
            {approval.title}
          </h3>
          <StatusBadge status={approval.status} />
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {approval.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{approval.applicant.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{formatDate(approval.created_at)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">承認ルート:</span>
          <span className="font-medium text-gray-900">{approval.route_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold text-primary-600">
              {approval.current_step}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-600">{approval.total_steps}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-primary-600" />
        </div>
      </div>

      {approval.current_approver && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">現在の承認者</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
              {approval.current_approver.name.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-900">
              {approval.current_approver.name}
            </span>
          </div>
        </div>
      )}
    </Link>
  )
}

function StatusBadge({ status }: { status: Approval['status'] }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    withdrawn: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  const labels = {
    pending: '承認待ち',
    approved: '承認済み',
    rejected: '差し戻し',
    withdrawn: '取り下げ',
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
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
