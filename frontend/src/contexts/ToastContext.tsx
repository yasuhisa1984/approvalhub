/**
 * Toast通知管理Context
 * アプリ全体で使えるToast通知システム
 */

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import Toast, { ToastType } from '../components/ui/Toast'

interface ToastMessage {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string, duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random()}`
      const newToast: ToastMessage = {
        id,
        type,
        title,
        message,
        duration,
      }

      setToasts((prev) => [...prev, newToast])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title: string, message?: string, duration = 5000) => {
      addToast('success', title, message, duration)
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, message?: string, duration = 7000) => {
      addToast('error', title, message, duration)
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, message?: string, duration = 6000) => {
      addToast('warning', title, message, duration)
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, message?: string, duration = 5000) => {
      addToast('info', title, message, duration)
    },
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/**
 * useToast フック
 */
export function useToast(): ToastContextType {
  const context = useContext(ToastContext)

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}
