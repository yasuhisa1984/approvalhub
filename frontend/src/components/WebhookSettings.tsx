import { useState, useEffect } from 'react'
import {
  Webhook as WebhookIcon,
  Plus,
  Settings,
  Trash2,
  Power,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  Loader,
} from 'lucide-react'
import { Webhook, WebhookLog, WebhookEventType, webhookEventLabels } from '../types/webhook'
import { webhookApi } from '../lib/api'

export default function WebhookSettings() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showLogsModal, setShowLogsModal] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null)
  const [selectedWebhookLogs, setSelectedWebhookLogs] = useState<WebhookLog[]>([])
  const [testingWebhookId, setTestingWebhookId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWebhooks = async () => {
      try {
        setIsLoading(true)
        const response = await webhookApi.getWebhooks()
        setWebhooks(response || [])
      } catch (err) {
        console.error('Failed to fetch webhooks:', err)
        setError('Webhookの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchWebhooks()
  }, [])

  const handleAddWebhook = async (webhook: Omit<Webhook, 'id' | 'createdAt'>) => {
    try {
      const created = await webhookApi.createWebhook({
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        is_active: webhook.isActive,
        secret: webhook.secret,
      })
      setWebhooks([...webhooks, created])
      setShowAddModal(false)
    } catch (err) {
      console.error('Failed to create webhook:', err)
      alert('Webhookの作成に失敗しました')
    }
  }

  const handleEditWebhook = async (updatedWebhook: Webhook) => {
    try {
      const updated = await webhookApi.updateWebhook(updatedWebhook.id, {
        name: updatedWebhook.name,
        url: updatedWebhook.url,
        events: updatedWebhook.events,
        is_active: updatedWebhook.isActive,
        secret: updatedWebhook.secret,
      })
      setWebhooks(webhooks.map((w) => (w.id === updatedWebhook.id ? updated : w)))
      setShowEditModal(false)
      setSelectedWebhook(null)
    } catch (err) {
      console.error('Failed to update webhook:', err)
      alert('Webhookの更新に失敗しました')
    }
  }

  const handleDeleteWebhook = async (id: number) => {
    if (!confirm('このWebhookを削除してもよろしいですか？')) return
    try {
      await webhookApi.deleteWebhook(id)
      setWebhooks(webhooks.filter((w) => w.id !== id))
    } catch (err) {
      console.error('Failed to delete webhook:', err)
      alert('Webhookの削除に失敗しました')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    )
  }

  const handleToggleWebhook = (id: number) => {
    setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w)))
  }

  const handleTestWebhook = async (id: number) => {
    setTestingWebhookId(id)

    // シミュレート: 1秒後にテスト結果を表示
    setTimeout(() => {
      const webhook = webhooks.find((w) => w.id === id)
      if (!webhook) return

      const testLog: WebhookLog = {
        id: Math.max(...logs.map((l) => l.id)) + 1,
        webhookId: id,
        webhookName: webhook.name,
        event: 'approval_request_created',
        status: Math.random() > 0.2 ? 'success' : 'failure',
        statusCode: Math.random() > 0.2 ? 200 : 500,
        requestBody: {
          event: 'approval_request_created',
          data: { id: 999, title: 'テスト送信', test: true },
        },
        responseBody: Math.random() > 0.2 ? { ok: true } : undefined,
        error: Math.random() > 0.2 ? undefined : 'Connection timeout',
        triggeredAt: new Date().toISOString().replace('T', ' ').split('.')[0],
        duration: Math.floor(Math.random() * 1000) + 100,
      }

      setLogs([testLog, ...logs])
      setWebhooks(
        webhooks.map((w) =>
          w.id === id
            ? {
                ...w,
                lastTriggeredAt: testLog.triggeredAt,
              }
            : w
        )
      )
      setTestingWebhookId(null)

      if (testLog.status === 'success') {
        alert('✅ テスト送信に成功しました')
      } else {
        alert('❌ テスト送信に失敗しました: ' + testLog.error)
      }
    }, 1000)
  }

  const handleViewLogs = (webhook: Webhook) => {
    setSelectedWebhook(webhook)
    setSelectedWebhookLogs(logs.filter((log) => log.webhookId === webhook.id))
    setShowLogsModal(true)
  }

  const handleEdit = (webhook: Webhook) => {
    setSelectedWebhook(webhook)
    setShowEditModal(true)
  }

  const getSuccessRate = (webhookId: number): string => {
    const webhookLogs = logs.filter((log) => log.webhookId === webhookId)
    if (webhookLogs.length === 0) return 'N/A'
    const successCount = webhookLogs.filter((log) => log.status === 'success').length
    return `${Math.round((successCount / webhookLogs.length) * 100)}%`
  }

  if (showAddModal) {
    return (
      <WebhookFormModal
        onClose={() => setShowAddModal(false)}
        onSave={handleAddWebhook}
        title="Webhook追加"
      />
    )
  }

  if (showEditModal && selectedWebhook) {
    return (
      <WebhookFormModal
        onClose={() => {
          setShowEditModal(false)
          setSelectedWebhook(null)
        }}
        onSave={handleEditWebhook}
        title="Webhook編集"
        initialData={selectedWebhook}
      />
    )
  }

  if (showLogsModal && selectedWebhook) {
    return (
      <WebhookLogsModal
        webhook={selectedWebhook}
        logs={selectedWebhookLogs}
        onClose={() => {
          setShowLogsModal(false)
          setSelectedWebhook(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Webhook設定</h2>
          <p className="text-sm text-gray-600 mt-1">
            承認イベントを外部サービスに通知できます
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          Webhook追加
        </button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <div
            key={webhook.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <WebhookIcon className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {webhook.name}
                    </h3>
                    {webhook.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        有効
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        無効
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 font-mono break-all">
                    {webhook.url}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {webhookEventLabels[event]}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>作成: {webhook.createdAt}</span>
                    {webhook.lastTriggeredAt && (
                      <span>最終実行: {webhook.lastTriggeredAt}</span>
                    )}
                    <span>成功率: {getSuccessRate(webhook.id)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleTestWebhook(webhook.id)}
                disabled={testingWebhookId === webhook.id}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {testingWebhookId === webhook.id ? '送信中...' : 'テスト送信'}
              </button>
              <button
                onClick={() => handleViewLogs(webhook)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Clock className="w-4 h-4" />
                実行履歴
              </button>
              <button
                onClick={() => handleToggleWebhook(webhook.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Power className="w-4 h-4" />
                {webhook.isActive ? '無効化' : '有効化'}
              </button>
              <button
                onClick={() => handleEdit(webhook)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-4 h-4" />
                編集
              </button>
              <button
                onClick={() => handleDeleteWebhook(webhook.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            </div>
          </div>
        ))}

        {webhooks.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <WebhookIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 mb-4">Webhookが設定されていません</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              最初のWebhookを追加
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface WebhookFormModalProps {
  onClose: () => void
  onSave: (webhook: any) => void
  title: string
  initialData?: Webhook
}

function WebhookFormModal({ onClose, onSave, title, initialData }: WebhookFormModalProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [url, setUrl] = useState(initialData?.url || '')
  const [secret, setSecret] = useState(initialData?.secret || '')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [selectedEvents, setSelectedEvents] = useState<WebhookEventType[]>(
    initialData?.events || []
  )

  const allEvents: WebhookEventType[] = [
    'approval_request_created',
    'approval_request_approved',
    'approval_request_rejected',
    'approval_request_commented',
    'approval_request_completed',
    'approval_request_cancelled',
  ]

  const handleToggleEvent = (event: WebhookEventType) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event))
    } else {
      setSelectedEvents([...selectedEvents, event])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !url.trim() || selectedEvents.length === 0) {
      alert('名前、URL、イベントは必須です')
      return
    }

    if (initialData) {
      onSave({
        ...initialData,
        name: name.trim(),
        url: url.trim(),
        secret: secret.trim() || undefined,
        isActive,
        events: selectedEvents,
      })
    } else {
      onSave({
        name: name.trim(),
        url: url.trim(),
        secret: secret.trim() || undefined,
        isActive,
        events: selectedEvents,
      })
    }
  }

  const slackTemplateUrl = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX'
  const teamsTemplateUrl = 'https://outlook.office.com/webhook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
        >
          戻る
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: Slack - 営業部チャンネル"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                required
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setUrl(slackTemplateUrl)}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Slackテンプレート
                </button>
                <button
                  type="button"
                  onClick={() => setUrl(teamsTemplateUrl)}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Teamsテンプレート
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                シークレット（オプション）
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="署名検証用のシークレットキー"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                リクエストの署名検証に使用されます
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500 rounded"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Webhookを有効にする
              </label>
            </div>
          </div>
        </div>

        {/* Events */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            イベント選択 <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            通知を受け取りたいイベントを選択してください
          </p>
          <div className="space-y-2">
            {allEvents.map((event) => (
              <label
                key={event}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event)}
                  onChange={() => handleToggleEvent(event)}
                  className="w-4 h-4 text-primary-600 focus:ring-2 focus:ring-primary-500 rounded"
                />
                <span className="text-sm font-medium text-gray-900">
                  {webhookEventLabels[event]}
                </span>
              </label>
            ))}
          </div>
        </div>

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
            保存
          </button>
        </div>
      </form>
    </div>
  )
}

interface WebhookLogsModalProps {
  webhook: Webhook
  logs: WebhookLog[]
  onClose: () => void
}

function WebhookLogsModal({ webhook, logs, onClose }: WebhookLogsModalProps) {
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null)

  if (selectedLog) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">ログ詳細</h2>
          <button
            onClick={() => setSelectedLog(null)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            戻る
          </button>
        </div>

        {/* Log Detail */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3">
            {selectedLog.status === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <XCircle className="w-6 h-6 text-red-600" />
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                {webhookEventLabels[selectedLog.event]}
              </h3>
              <p className="text-sm text-gray-500">{selectedLog.triggeredAt}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-700">ステータス</p>
              <p className="text-sm text-gray-900">
                {selectedLog.status === 'success' ? '成功' : '失敗'}{' '}
                {selectedLog.statusCode && `(${selectedLog.statusCode})`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">実行時間</p>
              <p className="text-sm text-gray-900">{selectedLog.duration}ms</p>
            </div>
          </div>

          {selectedLog.error && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">エラー</p>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-mono">
                {selectedLog.error}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">リクエストボディ</p>
            <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-64 font-mono">
              {JSON.stringify(selectedLog.requestBody, null, 2)}
            </pre>
          </div>

          {selectedLog.responseBody && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">レスポンスボディ</p>
              <pre className="text-xs bg-gray-50 p-4 rounded overflow-auto max-h-64 font-mono">
                {JSON.stringify(selectedLog.responseBody, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">実行履歴</h2>
          <p className="text-sm text-gray-600 mt-1">{webhook.name}</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
        >
          戻る
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">総実行回数</p>
          <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">成功</p>
          <p className="text-2xl font-bold text-green-600">
            {logs.filter((log) => log.status === 'success').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">失敗</p>
          <p className="text-2xl font-bold text-red-600">
            {logs.filter((log) => log.status === 'failure').length}
          </p>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ステータス
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  イベント
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  実行時刻
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  実行時間
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        成功
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" />
                        失敗
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {webhookEventLabels[log.event]}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {log.triggeredAt}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.duration}ms</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">実行履歴がありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
