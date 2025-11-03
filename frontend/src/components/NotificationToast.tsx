import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'
import { notificationTypeIcons } from '../data/notificationData'
import { useNavigate } from 'react-router-dom'

export default function NotificationToast() {
  const { notifications } = useNotifications()
  const [visibleToasts, setVisibleToasts] = useState<number[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    // 最新の通知を検出
    const latestNotification = notifications[0]
    if (latestNotification && !latestNotification.read && !visibleToasts.includes(latestNotification.id)) {
      setVisibleToasts((prev) => [...prev, latestNotification.id])

      // 5秒後に自動的に非表示
      setTimeout(() => {
        setVisibleToasts((prev) => prev.filter((id) => id !== latestNotification.id))
      }, 5000)
    }
  }, [notifications])

  const handleClose = (id: number) => {
    setVisibleToasts((prev) => prev.filter((toastId) => toastId !== id))
  }

  const handleClick = (id: number, actionUrl?: string) => {
    handleClose(id)
    if (actionUrl) {
      navigate(actionUrl)
    }
  }

  const visibleNotifications = notifications.filter((n) => visibleToasts.includes(n.id))

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 animate-slide-in-right cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => handleClick(notification.id, notification.actionUrl)}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">
              {notificationTypeIcons[notification.type]}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{notification.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClose(notification.id)
              }}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
