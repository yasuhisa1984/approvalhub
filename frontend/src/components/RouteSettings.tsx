import { useState } from 'react'
import { Plus, ArrowLeft, Trash2, GripVertical, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

interface User {
  id: number
  name: string
  role: string
}

interface RouteStep {
  id: string
  stepOrder: number
  approverId: number
  approverName: string
}

interface ApprovalRoute {
  id: number
  name: string
  description: string
  steps: RouteStep[]
  isActive: boolean
}

// モックユーザー
const mockUsers: User[] = [
  { id: 1, name: 'やっくん隊長', role: 'admin' },
  { id: 2, name: '田中部長', role: 'manager' },
  { id: 3, name: '佐藤一般', role: 'member' },
  { id: 4, name: '鈴木エンジニア', role: 'member' },
  { id: 5, name: '山田人事', role: 'member' },
]

// モック承認ルート
const mockRoutes: ApprovalRoute[] = [
  {
    id: 1,
    name: '契約書承認フロー',
    description: '新規取引先との契約書用 (2段階承認)',
    isActive: true,
    steps: [
      { id: '1-1', stepOrder: 1, approverId: 2, approverName: '田中部長' },
      { id: '1-2', stepOrder: 2, approverId: 1, approverName: 'やっくん隊長' },
    ],
  },
  {
    id: 2,
    name: '経費申請フロー',
    description: '10万円以上の経費申請用 (3段階承認)',
    isActive: true,
    steps: [
      { id: '2-1', stepOrder: 1, approverId: 2, approverName: '田中部長' },
      { id: '2-2', stepOrder: 2, approverId: 1, approverName: 'やっくん隊長' },
      { id: '2-3', stepOrder: 3, approverId: 1, approverName: 'やっくん隊長' },
    ],
  },
]

export default function RouteSettings() {
  const [routes, setRoutes] = useState<ApprovalRoute[]>(mockRoutes)
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">承認ルート設定</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            承認フローを作成・管理します
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">新規ルート作成</span>
          <span className="sm:hidden">新規作成</span>
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <RouteCreateForm
          onClose={() => setIsCreating(false)}
          onSave={(route) => {
            setRoutes([...routes, route])
            setIsCreating(false)
          }}
        />
      )}

      {/* Routes List */}
      <div className="space-y-4">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  )
}

interface RouteCreateFormProps {
  onClose: () => void
  onSave: (route: ApprovalRoute) => void
}

function RouteCreateForm({ onClose, onSave }: RouteCreateFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<RouteStep[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const addStep = (userId: number) => {
    const user = mockUsers.find((u) => u.id === userId)
    if (!user) return

    const newStep: RouteStep = {
      id: `new-${Date.now()}`,
      stepOrder: steps.length + 1,
      approverId: user.id,
      approverName: user.name,
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (stepId: string) => {
    const newSteps = steps
      .filter((s) => s.id !== stepId)
      .map((s, index) => ({ ...s, stepOrder: index + 1 }))
    setSteps(newSteps)
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const index = steps.findIndex((s) => s.id === stepId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === steps.length - 1)
    ) {
      return
    }

    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[index],
    ]

    setSteps(newSteps.map((s, i) => ({ ...s, stepOrder: i + 1 })))
  }

  const handleSave = () => {
    const newRoute: ApprovalRoute = {
      id: Date.now(),
      name,
      description,
      steps,
      isActive: true,
    }

    setShowSuccess(true)
    setTimeout(() => {
      onSave(newRoute)
    }, 1000)
  }

  const isValid = name.trim() && description.trim() && steps.length > 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <Save className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          <p className="text-xs sm:text-sm font-medium text-green-800">
            承認ルートを作成しました！
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">新規承認ルート</h3>
        <button
          onClick={onClose}
          className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
        >
          キャンセル
        </button>
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
          ルート名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 契約書承認フロー"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
          説明 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="このルートの用途を説明してください"
          rows={2}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Steps */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
          承認フロー <span className="text-red-500">*</span>
        </label>

        {/* Step List */}
        <div className="space-y-2 mb-3 sm:mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex flex-col gap-0.5 sm:gap-1">
                <button
                  onClick={() => moveStep(step.id, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <GripVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => moveStep(step.id, 'down')}
                  disabled={index === steps.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <GripVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs sm:text-sm">
                {step.stepOrder}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {step.approverName}
                </p>
                <p className="text-xs text-gray-500">
                  {step.stepOrder}段階目
                </p>
              </div>

              <button
                onClick={() => removeStep(step.id)}
                className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}

          {steps.length === 0 && (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm">
              承認者を追加してください
            </div>
          )}
        </div>

        {/* Add User Dropdown */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            承認者を追加
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addStep(parseInt(e.target.value))
                e.target.value = ''
              }
            }}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">承認者を選択...</option>
            {mockUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview */}
      {steps.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 sm:p-4">
          <h4 className="text-xs sm:text-sm font-semibold text-primary-900 mb-2 sm:mb-3">
            📋 承認フロープレビュー
          </h4>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto -mx-1 px-1">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
                <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-white border border-primary-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                  {step.approverName}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-4 sm:w-8 h-0.5 bg-primary-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
        <button
          onClick={onClose}
          className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg font-semibold text-sm sm:text-base text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-white ${
            isValid
              ? 'bg-primary-600 hover:bg-primary-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          保存
        </button>
      </div>
    </div>
  )
}

interface RouteCardProps {
  route: ApprovalRoute
}

function RouteCard({ route }: RouteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{route.name}</h3>
            <div className="flex items-center gap-2">
              {route.isActive ? (
                <span className="px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                  有効
                </span>
              ) : (
                <span className="px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                  無効
                </span>
              )}
              <span className="px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {route.steps.length}段階
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">{route.description}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium self-start sm:self-auto"
        >
          {isExpanded ? '閉じる' : '詳細'}
        </button>
      </div>

      {/* Flow Preview */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {route.steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg whitespace-nowrap">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                {step.stepOrder}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {step.approverName}
              </span>
            </div>
            {index < route.steps.length - 1 && (
              <div className="w-4 sm:w-6 h-0.5 bg-gray-300 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-2 sm:space-y-3">
          {route.steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs sm:text-sm">
                {step.stepOrder}
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900">
                  {step.approverName}
                </p>
                <p className="text-xs text-gray-500">
                  {step.stepOrder}段階目の承認者
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
