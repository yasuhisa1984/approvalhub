import { useState, useEffect } from 'react'
import { UserPlus, Calendar, Trash2, Plus, AlertCircle, Check, Loader } from 'lucide-react'
import { delegationApi, userApi } from '../lib/api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Delegation {
  id: number
  delegateId: number
  delegateName: string
  delegateEmail: string
  startDate: string
  endDate: string
  reason: string
  isActive: boolean
}

export default function DelegationSettings() {
  const [delegations, setDelegations] = useState<Delegation[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [delegationsResponse, usersResponse] = await Promise.all([
          delegationApi.getDelegations(),
          userApi.getUsers(),
        ])

        setDelegations(delegationsResponse || [])
        setUsers(usersResponse || [])
      } catch (err) {
        console.error('Failed to fetch delegations:', err)
        setError('代理承認設定の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('この代理承認設定を削除してもよろしいですか？')) {
      return
    }

    try {
      await delegationApi.deleteDelegation(id)
      setDelegations(delegations.filter((d) => d.id !== id))
    } catch (err) {
      console.error('Failed to delete delegation:', err)
      alert('代理承認設定の削除に失敗しました')
    }
  }

  const handleAddDelegation = async (delegation: Omit<Delegation, 'id' | 'isActive'>) => {
    try {
      const newDelegation = await delegationApi.createDelegation({
        delegate_user_id: delegation.delegateId,
        start_date: delegation.startDate,
        end_date: delegation.endDate,
        reason: delegation.reason,
      })
      setDelegations([...delegations, newDelegation])
      setShowAddModal(false)
    } catch (err) {
      console.error('Failed to create delegation:', err)
      alert('代理承認設定の作成に失敗しました')
    }
  }

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

  if (showAddModal) {
    return <AddDelegationModal users={users} onClose={() => setShowAddModal(false)} onAdd={handleAddDelegation} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">代理承認設定</h2>
          <p className="text-sm text-gray-600 mt-1">
            不在時に承認権限を他のユーザーに委任できます
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          代理承認を追加
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              代理承認について
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 設定期間中、指定したユーザーがあなたの代わりに承認を実行できます</li>
              <li>• 承認履歴には「〇〇（代理: △△）」として記録されます</li>
              <li>• 複数の代理承認設定を登録できます（期間が重複しないよう注意）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delegations List */}
      <div className="space-y-4">
        {delegations.map((delegation) => (
          <div
            key={delegation.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <UserPlus className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {delegation.delegateName}
                    </h3>
                    {delegation.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3 mr-1" />
                        有効
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        無効
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{delegation.delegateEmail}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {delegation.startDate} 〜 {delegation.endDate}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-gray-100 rounded text-gray-700">
                      {delegation.reason}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(delegation.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            </div>

            {delegation.isActive && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  現在、<strong>{delegation.delegateName}</strong>さんがあなたの代わりに承認を実行できます
                </p>
              </div>
            )}
          </div>
        ))}

        {delegations.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 mb-4">代理承認設定がありません</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              最初の代理承認を追加
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface AddDelegationModalProps {
  users: User[]
  onClose: () => void
  onAdd: (delegation: Omit<Delegation, 'id' | 'isActive'>) => void
}

function AddDelegationModal({ users, onClose, onAdd }: AddDelegationModalProps) {
  const [delegateId, setDelegateId] = useState<number>(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!delegateId || !startDate || !endDate || !reason.trim()) {
      alert('すべての項目を入力してください')
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('終了日は開始日以降の日付を設定してください')
      return
    }

    const selectedUser = users.find((u) => u.id === delegateId)
    if (!selectedUser) return

    onAdd({
      delegateId,
      delegateName: selectedUser.name,
      delegateEmail: selectedUser.email,
      startDate,
      endDate,
      reason: reason.trim(),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">代理承認を追加</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
        >
          戻る
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delegate User */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">代理承認者</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ユーザー選択 <span className="text-red-500">*</span>
            </label>
            <select
              value={delegateId}
              onChange={(e) => setDelegateId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value={0}>選択してください</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              このユーザーがあなたの代わりに承認を実行できます
            </p>
          </div>
        </div>

        {/* Period */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">有効期間</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            この期間中、代理承認者が承認を実行できます
          </p>
        </div>

        {/* Reason */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">理由</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              代理承認の理由 <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
              required
            >
              <option value="">選択してください</option>
              <option value="出張のため">出張のため</option>
              <option value="休暇のため">休暇のため</option>
              <option value="病気療養のため">病気療養のため</option>
              <option value="研修参加のため">研修参加のため</option>
              <option value="その他">その他</option>
            </select>
            <p className="text-xs text-gray-500">
              承認履歴に記録されます
            </p>
          </div>
        </div>

        {/* Preview */}
        {delegateId > 0 && startDate && endDate && reason && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">設定内容プレビュー</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <strong>{users.find((u) => u.id === delegateId)?.name}</strong>さんが、
                <strong>{startDate}</strong> 〜 <strong>{endDate}</strong> の期間中、
                あなたの代わりに承認を実行できます。
              </p>
              <p className="text-gray-600">理由: {reason}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            追加
          </button>
        </div>
      </form>
    </div>
  )
}
