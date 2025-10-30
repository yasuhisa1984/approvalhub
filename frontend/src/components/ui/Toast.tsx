/**
 * Toast通知コンポーネント
 * 成功/エラー/警告/情報メッセージを表示
 */

import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
    },
  }

  const { icon, bgColor, borderColor, textColor, iconColor } = config[type]

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[300px] max-w-md animate-slideIn`}
    >
      <div className={iconColor}>{icon}</div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${textColor}`}>{title}</p>
        {message && <p className={`text-sm ${textColor} mt-1`}>{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`${textColor} hover:opacity-70 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
