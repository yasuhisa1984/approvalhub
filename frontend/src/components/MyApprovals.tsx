import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockApprovals } from '../data/mockData'
import ApprovalCard from './ApprovalCard'

export default function MyApprovals() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  // 自分が申請したものをフィルタ（申請者ID=3の佐藤一般の視点）
  const myApprovals = mockApprovals.filter((approval) => approval.applicant.id === 3)

  const filteredApprovals = myApprovals.filter((approval) => {
    if (filter === 'all') return true
    return approval.status === filter
  })

  const counts = {
    all: myApprovals.length,
    pending: myApprovals.filter((a) => a.status === 'pending').length,
    approved: myApprovals.filter((a) => a.status === 'approved').length,
    rejected: myApprovals.filter((a) => a.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">自分の申請</h2>
          <p className="text-sm text-gray-600 mt-1">
            あなたが作成した申請の一覧です
          </p>
        </div>
        <Link
          to="/approvals/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規申請
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-2 flex gap-2">
        <FilterTab
          label="すべて"
          count={counts.all}
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        <FilterTab
          label="承認待ち"
          count={counts.pending}
          active={filter === 'pending'}
          onClick={() => setFilter('pending')}
          color="yellow"
        />
        <FilterTab
          label="承認済み"
          count={counts.approved}
          active={filter === 'approved'}
          onClick={() => setFilter('approved')}
          color="green"
        />
        <FilterTab
          label="差し戻し"
          count={counts.rejected}
          active={filter === 'rejected'}
          onClick={() => setFilter('rejected')}
          color="red"
        />
      </div>

      {/* Approvals List */}
      {filteredApprovals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">申請がありません</p>
          <Link
            to="/approvals/create"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            最初の申請を作成
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      )}
    </div>
  )
}

interface FilterTabProps {
  label: string
  count: number
  active: boolean
  onClick: () => void
  color?: 'yellow' | 'green' | 'red'
}

function FilterTab({ label, count, active, onClick, color }: FilterTabProps) {
  const colorClasses = {
    yellow: 'text-yellow-700 bg-yellow-50',
    green: 'text-green-700 bg-green-50',
    red: 'text-red-700 bg-red-50',
  }

  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
      <span
        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
          active
            ? 'bg-white/20 text-white'
            : color
            ? colorClasses[color]
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {count}
      </span>
    </button>
  )
}
