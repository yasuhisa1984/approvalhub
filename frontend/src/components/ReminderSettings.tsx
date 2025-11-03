import { useState } from 'react'
import { Bell, Clock, Save, AlertCircle } from 'lucide-react'

interface ReminderConfig {
  enabled: boolean
  deadlineDays: number // デフォルト承認期限（日数）
  firstReminderHours: number // 最初のリマインダー（期限の何時間前）
  reminderInterval: number // リマインダー送信間隔（時間）
  escalationEnabled: boolean // エスカレーション有効
  escalationHours: number // エスカレーション（期限の何時間後）
}

export default function ReminderSettings() {
  const [config, setConfig] = useState<ReminderConfig>({
    enabled: true,
    deadlineDays: 3,
    firstReminderHours: 24,
    reminderInterval: 12,
    escalationEnabled: true,
    escalationHours: 24,
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    // 設定を保存（実際はAPI呼び出し）
    console.log('Reminder config saved:', config)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">リマインダー設定</h2>
          <p className="text-sm text-gray-600 mt-1">
            承認期限とリマインダーの自動送信を設定します
          </p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">保存しました</span>
          </div>
        )}
      </div>

      {/* Enable/Disable */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                リマインダー機能
              </h3>
              <p className="text-sm text-gray-600">
                承認期限とリマインダー通知を有効にする
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      {config.enabled && (
        <>
          {/* Deadline Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">承認期限設定</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  デフォルト承認期限
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={config.deadlineDays}
                    onChange={(e) =>
                      setConfig({ ...config, deadlineDays: Number(e.target.value) })
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="w-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-center">
                    <span className="text-lg font-bold text-primary-600">
                      {config.deadlineDays}
                    </span>
                    <span className="text-sm text-gray-600 ml-1">日</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  承認依頼作成時のデフォルト期限（個別設定も可能）
                </p>
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">リマインダー設定</h3>
            </div>

            <div className="space-y-6">
              {/* First Reminder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最初のリマインダー送信タイミング
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={config.firstReminderHours}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        firstReminderHours: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={6}>期限の6時間前</option>
                    <option value={12}>期限の12時間前</option>
                    <option value={24}>期限の24時間前（1日前）</option>
                    <option value={48}>期限の48時間前（2日前）</option>
                    <option value={72}>期限の72時間前（3日前）</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  承認期限までにリマインダー通知を送信
                </p>
              </div>

              {/* Reminder Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  リマインダー送信間隔
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={config.reminderInterval}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        reminderInterval: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={6}>6時間ごと</option>
                    <option value={12}>12時間ごと</option>
                    <option value={24}>24時間ごと（1日ごと）</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  未承認の場合、この間隔でリマインダーを繰り返し送信
                </p>
              </div>
            </div>
          </div>

          {/* Escalation Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  エスカレーション設定
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.escalationEnabled}
                  onChange={(e) =>
                    setConfig({ ...config, escalationEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {config.escalationEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  エスカレーションタイミング
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={config.escalationHours}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        escalationHours: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value={12}>期限超過後12時間</option>
                    <option value={24}>期限超過後24時間（1日）</option>
                    <option value={48}>期限超過後48時間（2日）</option>
                    <option value={72}>期限超過後72時間（3日）</option>
                  </select>
                </div>
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>エスカレーション時の動作：</strong>
                  </p>
                  <ul className="text-sm text-orange-700 mt-2 space-y-1">
                    <li>• 承認者の上長に通知</li>
                    <li>• 管理者に通知</li>
                    <li>• 承認依頼が「期限超過」としてマーク</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Example Timeline */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📅 リマインダータイムライン例
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Day 0: 承認依頼作成</p>
                  <p className="text-xs text-gray-600">
                    期限: {config.deadlineDays}日後
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Day {config.deadlineDays - config.firstReminderHours / 24}: 最初のリマインダー
                  </p>
                  <p className="text-xs text-gray-600">
                    期限の{config.firstReminderHours}時間前
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    その後: {config.reminderInterval}時間ごとにリマインダー
                  </p>
                  <p className="text-xs text-gray-600">承認されるまで繰り返し</p>
                </div>
              </div>
              {config.escalationEnabled && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Day {config.deadlineDays + config.escalationHours / 24}: エスカレーション
                    </p>
                    <p className="text-xs text-gray-600">
                      期限超過後{config.escalationHours}時間
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              設定を保存
            </button>
          </div>
        </>
      )}
    </div>
  )
}
