import { useState } from 'react'
import {
  Building2,
  Search,
  Plus,
  Users,
  HardDrive,
  DollarSign,
  Calendar,
  Edit,
  Trash2,
  Play,
  Pause,
  ExternalLink,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import {
  mockTenants,
  mockTenantStats,
  tenantStatusLabels,
  tenantStatusColors,
  planLabels,
  planColors,
  planPricing,
} from '../../data/tenantData'
import { Tenant, TenantStatus, SubscriptionPlan, TenantCreate } from '../../types/tenant'
import { useImpersonation } from '../../contexts/ImpersonationContext'

export default function TenantManagement() {
  const { impersonate } = useImpersonation()
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<TenantStatus | 'all'>('all')
  const [filterPlan, setFilterPlan] = useState<SubscriptionPlan | 'all'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || tenant.status === filterStatus
    const matchesPlan = filterPlan === 'all' || tenant.plan === filterPlan

    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleImpersonate = (tenant: Tenant) => {
    // テナントの画面に入る（インパーソネーション）
    impersonate(tenant)
  }

  const handleSuspend = (id: number) => {
    if (window.confirm('このテナントを停止しますか？')) {
      setTenants(tenants.map((t) => (t.id === id ? { ...t, status: 'suspended' as TenantStatus } : t)))
    }
  }

  const handleActivate = (id: number) => {
    setTenants(tenants.map((t) => (t.id === id ? { ...t, status: 'active' as TenantStatus } : t)))
  }

  const handleDelete = (id: number) => {
    if (window.confirm('このテナントを削除しますか？この操作は取り消せません。')) {
      setTenants(tenants.filter((t) => t.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">テナント管理</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">SaaS全体のテナント（契約者）を管理します</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">新規テナント作成</span>
          <span className="sm:hidden">新規作成</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">総テナント数</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{mockTenantStats.totalTenants}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">アクティブ</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{mockTenantStats.activeTenants}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">トライアル</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{mockTenantStats.trialTenants}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">MRR</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ¥{mockTenantStats.mrr.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="テナント名、サブドメイン、メールで検索"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TenantStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべてのステータス</option>
            <option value="active">アクティブ</option>
            <option value="trial">トライアル</option>
            <option value="suspended">停止中</option>
            <option value="cancelled">キャンセル済み</option>
          </select>

          {/* Plan Filter */}
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value as SubscriptionPlan | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべてのプラン</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Tenants Table - Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  テナント
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  プラン
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  ユーザー数
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  ストレージ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  月額料金
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-500">{tenant.subdomain}.approvalhub.com</p>
                      <p className="text-xs text-gray-500 mt-1">{tenant.contactEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        tenantStatusColors[tenant.status]
                      }`}
                    >
                      {tenantStatusLabels[tenant.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        planColors[tenant.plan]
                      }`}
                    >
                      {planLabels[tenant.plan]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {tenant.currentUsers} / {tenant.maxUsers}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {tenant.usedStorage.toFixed(1)} / {tenant.maxStorage}GB
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        ¥{tenant.billing.monthlyFee.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{tenant.createdAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleImpersonate(tenant)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                        title="このテナントの画面に入る"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedTenant(tenant)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                        title="編集"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {tenant.status === 'active' ? (
                        <button
                          onClick={() => handleSuspend(tenant.id)}
                          className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded"
                          title="停止"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(tenant.id)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="有効化"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(tenant.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>テナントが見つかりませんでした</p>
          </div>
        )}
      </div>

      {/* Tenants Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredTenants.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 text-center py-12 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>テナントが見つかりませんでした</p>
          </div>
        ) : (
          filteredTenants.map((tenant) => (
            <div key={tenant.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{tenant.name}</p>
                  <p className="text-sm text-gray-500 truncate">{tenant.subdomain}.approvalhub.com</p>
                  <p className="text-xs text-gray-500 mt-1">{tenant.contactEmail}</p>
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      tenantStatusColors[tenant.status]
                    }`}
                  >
                    {tenantStatusLabels[tenant.status]}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      planColors[tenant.plan]
                    }`}
                  >
                    {planLabels[tenant.plan]}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    ユーザー数
                  </p>
                  <p className="font-medium text-gray-900">
                    {tenant.currentUsers} / {tenant.maxUsers}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    ストレージ
                  </p>
                  <p className="font-medium text-gray-900">
                    {tenant.usedStorage.toFixed(1)} / {tenant.maxStorage}GB
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    月額料金
                  </p>
                  <p className="font-semibold text-gray-900">
                    ¥{tenant.billing.monthlyFee.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    作成日
                  </p>
                  <p className="font-medium text-gray-900">{tenant.createdAt}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleImpersonate(tenant)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  入る
                </button>
                <button
                  onClick={() => setSelectedTenant(tenant)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  編集
                </button>
                {tenant.status === 'active' ? (
                  <button
                    onClick={() => handleSuspend(tenant.id)}
                    className="px-3 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(tenant.id)}
                    className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(tenant.id)}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateTenantModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(tenant) => {
            const newTenant: Tenant = {
              id: tenants.length + 1,
              ...tenant,
              status: 'trial',
              currentUsers: 1,
              usedStorage: 0,
              ...planPricing[tenant.plan],
              createdAt: new Date().toISOString().split('T')[0],
              trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
              features: {
                customBranding: tenant.plan !== 'free',
                apiAccess: tenant.plan !== 'free',
                sso: tenant.plan === 'enterprise',
                auditLogs: tenant.plan !== 'free',
                advancedReporting: tenant.plan === 'enterprise',
              },
              billing: {
                monthlyFee: planPricing[tenant.plan].monthlyFee,
                currency: 'JPY',
              },
            }
            setTenants([...tenants, newTenant])
            setShowCreateModal(false)
          }}
        />
      )}

      {/* Edit Modal */}
      {selectedTenant && (
        <EditTenantModal
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
          onSave={(updated) => {
            setTenants(tenants.map((t) => (t.id === updated.id ? updated : t)))
            setSelectedTenant(null)
          }}
        />
      )}
    </div>
  )
}

interface CreateTenantModalProps {
  onClose: () => void
  onCreate: (tenant: TenantCreate) => void
}

function CreateTenantModal({ onClose, onCreate }: CreateTenantModalProps) {
  const [formData, setFormData] = useState<TenantCreate>({
    name: '',
    subdomain: '',
    contactEmail: '',
    contactName: '',
    plan: 'pro',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">新規テナント作成</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テナント名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="株式会社サンプル"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サブドメイン <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  placeholder="sample-corp"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">.approvalhub.com</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                担当者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                placeholder="山田太郎"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                担当者メール <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="admin@sample.co.jp"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">プラン</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['free', 'pro', 'enterprise'] as SubscriptionPlan[]).map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setFormData({ ...formData, plan })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.plan === plan
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-900 mb-1">{planLabels[plan]}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    ¥{planPricing[plan].monthlyFee.toLocaleString()}
                    <span className="text-sm text-gray-500">/月</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    最大{planPricing[plan].maxUsers}ユーザー
                  </p>
                  <p className="text-xs text-gray-600">
                    {planPricing[plan].maxStorage}GBストレージ
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EditTenantModalProps {
  tenant: Tenant
  onClose: () => void
  onSave: (tenant: Tenant) => void
}

function EditTenantModal({ tenant, onClose, onSave }: EditTenantModalProps) {
  const [formData, setFormData] = useState(tenant)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">テナント編集</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">テナント名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">サブドメイン</label>
              <input
                type="text"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as TenantStatus })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="active">アクティブ</option>
                <option value="trial">トライアル</option>
                <option value="suspended">停止中</option>
                <option value="cancelled">キャンセル済み</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">プラン</label>
              <select
                value={formData.plan}
                onChange={(e) =>
                  setFormData({ ...formData, plan: e.target.value as SubscriptionPlan })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大ユーザー数
              </label>
              <input
                type="number"
                value={formData.maxUsers}
                onChange={(e) =>
                  setFormData({ ...formData, maxUsers: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最大ストレージ(GB)
              </label>
              <input
                type="number"
                value={formData.maxStorage}
                onChange={(e) =>
                  setFormData({ ...formData, maxStorage: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">月額料金(円)</label>
              <input
                type="number"
                value={formData.billing.monthlyFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billing: { ...formData.billing, monthlyFee: Number(e.target.value) },
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
