import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle,
  Filter,
  Settings,
  Trash2,
  Mail,
  Smartphone,
  Clock,
} from 'lucide-react'
import {
  mockNotifications,
  mockNotificationSettings,
  notificationTypeLabels,
  notificationTypeIcons,
  notificationTypeColors,
} from '../data/notificationData'
import { Notification, NotificationType, NotificationSettings } from '../types/notification'

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all')
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all')
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>(mockNotificationSettings)

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesRead =
      filterRead === 'all' ||
      (filterRead === 'unread' && !notification.read) ||
      (filterRead === 'read' && notification.read)
    return matchesType && matchesRead
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const handleSettingsUpdate = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    setShowSettings(false)
  }

  const getRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'たった今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffHours < 24) return `${diffHours}時間前`
    if (diffDays < 7) return `${diffDays}日前`
    return timestamp.split(' ')[0]
  }

  if (showSettings) {
    return <NotificationSettingsView settings={settings} onSave={handleSettingsUpdate} onClose={() => setShowSettings(false)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">通知センター</h2>
          <p className="text-sm text-gray-600 mt-1">
            未読 {unreadCount}件 / 全{notifications.length}件
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            <CheckCircle className="w-4 h-4" />
            すべて既読
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            <Settings className="w-4 h-4" />
            設定
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as NotificationType | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべての種類</option>
            <option value="approval_request">承認依頼</option>
            <option value="approval_approved">承認完了</option>
            <option value="approval_rejected">承認却下</option>
            <option value="approval_comment">コメント</option>
            <option value="mention">メンション</option>
            <option value="reminder">リマインダー</option>
            <option value="system">システム</option>
          </select>

          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as 'all' | 'unread' | 'read')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべて</option>
            <option value="unread">未読のみ</option>
            <option value="read">既読のみ</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg border p-4 transition-all ${
              notification.read
                ? 'border-gray-200'
                : 'border-primary-300 bg-primary-50/30 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="text-3xl flex-shrink-0">
                {notificationTypeIcons[notification.type]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        notificationTypeColors[notification.type]
                      }`}
                    >
                      {notificationTypeLabels[notification.type]}
                    </span>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        未読
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {getRelativeTime(notification.createdAt)}
                  </span>
                </div>

                <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                <p className="text-sm text-gray-700 mb-3">{notification.message}</p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {notification.actionUrl && (
                    <Link
                      to={notification.actionUrl}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      詳細を見る →
                    </Link>
                  )}
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      既読にする
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500">通知はありません</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface NotificationSettingsViewProps {
  settings: NotificationSettings
  onSave: (settings: NotificationSettings) => void
  onClose: () => void
}

function NotificationSettingsView({ settings, onSave, onClose }: NotificationSettingsViewProps) {
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    onSave(localSettings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">通知設定</h2>
          <p className="text-sm text-gray-600 mt-1">通知の受信方法をカスタマイズできます</p>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
        >
          戻る
        </button>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">メール通知</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(localSettings.emailNotifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between py-2">
              <span className="text-gray-700">{getSettingLabel(key)}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    emailNotifications: {
                      ...localSettings.emailNotifications,
                      [key]: e.target.checked,
                    },
                  })
                }
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* App Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">アプリ内通知</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(localSettings.appNotifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between py-2">
              <span className="text-gray-700">{getSettingLabel(key)}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    appNotifications: {
                      ...localSettings.appNotifications,
                      [key]: e.target.checked,
                    },
                  })
                }
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">リマインダー設定</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">リマインダーを有効にする</span>
            <input
              type="checkbox"
              checked={localSettings.reminderSettings.enabled}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  reminderSettings: {
                    ...localSettings.reminderSettings,
                    enabled: e.target.checked,
                  },
                })
              }
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
          </label>

          {localSettings.reminderSettings.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  何日前にリマインド
                </label>
                <select
                  value={localSettings.reminderSettings.daysBefore}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      reminderSettings: {
                        ...localSettings.reminderSettings,
                        daysBefore: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={1}>1日前</option>
                  <option value={2}>2日前</option>
                  <option value={3}>3日前</option>
                  <option value={7}>7日前</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  リマインド頻度
                </label>
                <select
                  value={localSettings.reminderSettings.frequency}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      reminderSettings: {
                        ...localSettings.reminderSettings,
                        frequency: e.target.value as 'once' | 'daily' | 'hourly',
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="once">1回のみ</option>
                  <option value="daily">毎日</option>
                  <option value="hourly">毎時</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
        >
          保存
        </button>
      </div>
    </div>
  )
}

function getSettingLabel(key: string): string {
  const labels: Record<string, string> = {
    approvalRequest: '承認依頼',
    approvalDecision: '承認結果',
    comments: 'コメント',
    mentions: 'メンション',
    reminders: 'リマインダー',
    systemAlerts: 'システム通知',
  }
  return labels[key] || key
}
