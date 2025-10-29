import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PaymentSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          決済が完了しました！
        </h1>

        <p className="text-gray-600 mb-6">
          ApprovalHubへようこそ。
          <br />
          14日間の無料トライアルが開始されました。
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>トライアル期間中はいつでもキャンセル可能です</strong>
            <br />
            期間終了後に自動的に課金が開始されます。
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            ダッシュボードへ
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="/settings/billing"
            className="block w-full text-center text-sm text-gray-600 hover:text-gray-800"
          >
            請求情報を確認
          </a>
        </div>
      </div>
    </div>
  )
}
