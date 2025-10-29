import { XCircle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PaymentCancelled() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-gray-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">決済がキャンセルされました</h1>

        <p className="text-gray-600 mb-6">
          決済処理を中断しました。
          <br />
          ご不明な点がございましたら、サポートまでお問い合わせください。
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            登録画面に戻る
          </button>

          <a
            href="mailto:support@approvalhub.com"
            className="block w-full text-center text-sm text-gray-600 hover:text-gray-800"
          >
            サポートに問い合わせ
          </a>
        </div>
      </div>
    </div>
  )
}
