import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical, Save, GitBranch, Loader } from 'lucide-react'
import { approvalApi, userApi } from '../lib/api'

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
  isParallelGroup?: boolean // 並列承認グループ
  parallelRequirement?: 'all' | 'any' // all: 全員承認必須, any: 誰か一人承認でOK
}

interface RouteCondition {
  type: 'amount' | 'department' | 'requestType'
  operator: 'greater' | 'less' | 'equal' | 'greaterOrEqual' | 'lessOrEqual'
  value: string | number
}

interface ApprovalRoute {
  id: number
  name: string
  description: string
  steps: RouteStep[]
  isActive: boolean
  condition?: RouteCondition
}

export default function RouteSettings() {
  const [routes, setRoutes] = useState<ApprovalRoute[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 承認ルート一覧とユーザー一覧を並行取得
        const [routesResponse, usersResponse] = await Promise.all([
          approvalApi.getApprovalRoutes(),
          userApi.getUsers(),
        ])

        // APIレスポンスをマッピング
        const mappedRoutes: ApprovalRoute[] = (routesResponse || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          isActive: item.is_active ?? true,
          steps: (item.steps || []).map((step: any, index: number) => ({
            id: `${item.id}-${index}`,
            stepOrder: step.step_order,
            approverId: step.approver_id,
            approverName: step.approver_name || 'Unknown',
            isParallelGroup: step.is_parallel_group || false,
            parallelRequirement: step.parallel_requirement || undefined,
          })),
        }))

        setRoutes(mappedRoutes)
        setUsers(usersResponse || [])
      } catch (err) {
        console.error('Failed to fetch routes and users:', err)
        setError('承認ルートの取得に失敗しました')
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
          users={users}
          onClose={() => setIsCreating(false)}
          onSave={async (routeData) => {
            try {
              // 実APIを呼び出して承認ルートを作成
              await approvalApi.createRoute(routeData)

              // データを再取得
              const routesResponse = await approvalApi.getApprovalRoutes()
              const mappedRoutes: ApprovalRoute[] = (routesResponse || []).map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description || '',
                isActive: item.is_active ?? true,
                steps: (item.steps || []).map((step: any, index: number) => ({
                  id: `${item.id}-${index}`,
                  stepOrder: step.step_order,
                  approverId: step.approver_id,
                  approverName: step.approver_name || 'Unknown',
                  isParallelGroup: step.is_parallel_group || false,
                  parallelRequirement: step.parallel_requirement || undefined,
                })),
              }))
              setRoutes(mappedRoutes)
              setIsCreating(false)
            } catch (err) {
              console.error('Failed to create route:', err)
              alert('承認ルートの作成に失敗しました')
            }
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
  users: User[]
  onClose: () => void
  onSave: (routeData: any) => Promise<void>
}

function RouteCreateForm({ users, onClose, onSave }: RouteCreateFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<RouteStep[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasCondition, setHasCondition] = useState(false)
  const [conditionType, setConditionType] = useState<'amount' | 'department' | 'requestType'>('amount')
  const [conditionOperator, setConditionOperator] = useState<'greater' | 'less' | 'equal' | 'greaterOrEqual' | 'lessOrEqual'>('greaterOrEqual')
  const [conditionValue, setConditionValue] = useState<string>('')

  const addStep = (userId: number) => {
    const user = users.find((u) => u.id === userId)
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

  const handleSave = async () => {
    // バックエンドAPIが期待する形式にデータを変換
    const routeData = {
      name,
      description,
      is_active: true,
      steps: steps.map((step) => ({
        step_order: step.stepOrder,
        approver_id: step.approverId,
        is_required: true,
        is_parallel_group: step.isParallelGroup || false,
        parallel_requirement: step.parallelRequirement || null,
      })),
    }

    setShowSuccess(true)
    setTimeout(async () => {
      await onSave(routeData)
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

      {/* Conditional Routing */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <GitBranch className="w-5 h-5 text-blue-600" />
          <h4 className="text-sm font-semibold text-gray-900">条件分岐設定</h4>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="hasCondition"
            checked={hasCondition}
            onChange={(e) => setHasCondition(e.target.checked)}
            className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500 rounded"
          />
          <label htmlFor="hasCondition" className="text-sm text-gray-700">
            条件に応じて自動的にこのルートを適用する
          </label>
        </div>

        {hasCondition && (
          <div className="space-y-3 pl-6 border-l-2 border-blue-300">
            {/* Condition Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                条件タイプ
              </label>
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="amount">金額</option>
                <option value="department">部署</option>
                <option value="requestType">申請タイプ</option>
              </select>
            </div>

            {/* Operator */}
            {conditionType === 'amount' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  条件
                </label>
                <select
                  value={conditionOperator}
                  onChange={(e) => setConditionOperator(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="greaterOrEqual">以上</option>
                  <option value="greater">より大きい</option>
                  <option value="lessOrEqual">以下</option>
                  <option value="less">より小さい</option>
                  <option value="equal">等しい</option>
                </select>
              </div>
            )}

            {/* Value */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                {conditionType === 'amount' ? '金額' : conditionType === 'department' ? '部署名' : '申請タイプ'}
              </label>
              {conditionType === 'amount' ? (
                <div className="relative">
                  <input
                    type="number"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    placeholder="例: 100000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">円</span>
                </div>
              ) : conditionType === 'department' ? (
                <select
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">部署を選択...</option>
                  <option value="営業部">営業部</option>
                  <option value="開発部">開発部</option>
                  <option value="総務部">総務部</option>
                  <option value="人事部">人事部</option>
                  <option value="財務部">財務部</option>
                </select>
              ) : (
                <select
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">タイプを選択...</option>
                  <option value="経費申請">経費申請</option>
                  <option value="契約書">契約書</option>
                  <option value="休暇申請">休暇申請</option>
                  <option value="備品購入">備品購入</option>
                </select>
              )}
            </div>

            {/* Condition Preview */}
            {conditionValue && (
              <div className="bg-white border border-blue-300 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-600 mb-1">適用条件:</p>
                <p className="text-sm font-semibold text-blue-900">
                  {conditionType === 'amount' && (
                    <>
                      金額が{' '}
                      {conditionOperator === 'greaterOrEqual' && '以上'}
                      {conditionOperator === 'greater' && 'より大きい'}
                      {conditionOperator === 'lessOrEqual' && '以下'}
                      {conditionOperator === 'less' && 'より小さい'}
                      {conditionOperator === 'equal' && 'と等しい'}
                      {' '}{parseFloat(conditionValue).toLocaleString()}円
                    </>
                  )}
                  {conditionType === 'department' && (
                    <>部署が「{conditionValue}」</>
                  )}
                  {conditionType === 'requestType' && (
                    <>申請タイプが「{conditionValue}」</>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
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
            {users.map((user) => (
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

  const getConditionText = (condition: RouteCondition) => {
    if (condition.type === 'amount') {
      const operatorText = {
        greaterOrEqual: '以上',
        greater: 'より大きい',
        lessOrEqual: '以下',
        less: 'より小さい',
        equal: 'と等しい',
      }[condition.operator]
      return `金額 ${operatorText} ${(condition.value as number).toLocaleString()}円`
    } else if (condition.type === 'department') {
      return `部署: ${condition.value}`
    } else if (condition.type === 'requestType') {
      return `申請タイプ: ${condition.value}`
    }
    return ''
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">{route.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
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
              {route.condition && (
                <span className="px-2 py-0.5 sm:py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded flex items-center gap-1">
                  <GitBranch className="w-3 h-3" />
                  条件分岐
                </span>
              )}
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">{route.description}</p>
          {route.condition && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs">
              <GitBranch className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-medium text-purple-900">
                {getConditionText(route.condition)}
              </span>
            </div>
          )}
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
        {(() => {
          // 並列承認グループごとにグループ化
          const groupedSteps: { stepOrder: number; steps: RouteStep[] }[] = []
          route.steps.forEach((step) => {
            let group = groupedSteps.find((g) => g.stepOrder === step.stepOrder)
            if (!group) {
              group = { stepOrder: step.stepOrder, steps: [] }
              groupedSteps.push(group)
            }
            group.steps.push(step)
          })
          groupedSteps.sort((a, b) => a.stepOrder - b.stepOrder)

          return groupedSteps.map((group, groupIndex) => (
            <div key={group.stepOrder} className="flex items-center gap-1.5 sm:gap-2">
              {group.steps.length > 1 && group.steps[0].isParallelGroup ? (
                // 並列承認グループ
                <div className="flex flex-col gap-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 border-2 border-blue-300 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                      {group.stepOrder}
                    </div>
                    <span className="text-xs font-semibold text-blue-700">
                      {group.steps[0].parallelRequirement === 'all' ? '全員承認' : '誰か一人'}
                    </span>
                  </div>
                  {group.steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-1">
                      <span className="text-blue-600 text-xs">||</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {step.approverName}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                // 通常の順次承認
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg whitespace-nowrap">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                    {group.stepOrder}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    {group.steps[0].approverName}
                  </span>
                </div>
              )}
              {groupIndex < groupedSteps.length - 1 && (
                <div className="w-4 sm:w-6 h-0.5 bg-gray-300 flex-shrink-0" />
              )}
            </div>
          ))
        })()}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-2 sm:space-y-3">
          {(() => {
            // 並列承認グループごとにグループ化
            const groupedSteps: { stepOrder: number; steps: RouteStep[] }[] = []
            route.steps.forEach((step) => {
              let group = groupedSteps.find((g) => g.stepOrder === step.stepOrder)
              if (!group) {
                group = { stepOrder: step.stepOrder, steps: [] }
                groupedSteps.push(group)
              }
              group.steps.push(step)
            })
            groupedSteps.sort((a, b) => a.stepOrder - b.stepOrder)

            return groupedSteps.map((group) => (
              <div key={group.stepOrder}>
                {group.steps.length > 1 && group.steps[0].isParallelGroup ? (
                  // 並列承認グループ
                  <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs sm:text-sm">
                        {group.stepOrder}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900">
                          並列承認（{group.steps[0].parallelRequirement === 'all' ? '全員承認必須' : '誰か一人承認でOK'}）
                        </p>
                        <p className="text-xs text-blue-700">
                          {group.stepOrder}段階目 - {group.steps.length}名の承認者
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 pl-4 border-l-2 border-blue-300">
                      {group.steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-2">
                          <span className="text-blue-600 font-bold">||</span>
                          <span className="text-sm font-medium text-gray-900">
                            {step.approverName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // 通常の順次承認
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold text-xs sm:text-sm">
                      {group.stepOrder}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {group.steps[0].approverName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {group.stepOrder}段階目の承認者
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          })()}
        </div>
      )}
    </div>
  )
}
