import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Notification } from '../types/notification'
import { mockNotifications } from '../data/notificationData'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id'>) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteNotification: (id: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [nextId, setNextId] = useState(1000)

  // シミュレーション: 30秒ごとに新しい通知を生成（開発用）
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          type: 'approval_request' as const,
          title: '新しい承認依頼',
          message: '田中太郎さんから「出張申請」の承認依頼が届きました',
          actionUrl: '/approvals/123',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          type: 'approval_comment' as const,
          title: '新しいコメント',
          message: '山田花子さんがあなたの申請にコメントしました',
          actionUrl: '/approvals/456',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          type: 'reminder' as const,
          title: '承認待ちのリマインダー',
          message: '「契約書承認」が3日間承認待ちです',
          actionUrl: '/approvals/789',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ]

      // ランダムに通知を選択
      const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]

      // 10%の確率で新しい通知を追加
      if (Math.random() < 0.1) {
        setNotifications((prev) => [
          {
            id: nextId,
            ...randomNotification,
          },
          ...prev,
        ])
        setNextId((prev) => prev + 1)

        // ブラウザ通知（許可されている場合）
        if (Notification.permission === 'granted') {
          new Notification(randomNotification.title, {
            body: randomNotification.message,
            icon: '/logo.png',
          })
        }
      }
    }, 30000) // 30秒ごと

    return () => clearInterval(interval)
  }, [nextId])

  // ブラウザ通知の許可をリクエスト
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    setNotifications((prev) => [
      {
        id: nextId,
        ...notification,
      },
      ...prev,
    ])
    setNextId((prev) => prev + 1)

    // ブラウザ通知
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
      })
    }
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
