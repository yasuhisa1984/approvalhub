import { useState } from 'react'
import { CheckCircle2, AlertCircle, Loader, Building2, Mail, User, Lock, Globe } from 'lucide-react'

type SignupStep = 'info' | 'plan' | 'payment' | 'complete'
type Plan = 'free' | 'pro' | 'enterprise'

interface PlanInfo {
  name: string
  price: number
  features: string[]
  maxUsers: number
  maxStorage: number
  recommended?: boolean
}

const plans: Record<Plan, PlanInfo> = {
  free: {
    name: 'フリー',
    price: 0,
    maxUsers: 5,
    maxStorage: 10,
    features: [
      '最大5ユーザー',
      '10GBストレージ',
      '基本的な承認フロー',
      'メール通知',
    ],
  },
  pro: {
    name: 'プロ',
    price: 19800,
    maxUsers: 50,
    maxStorage: 100,
    recommended: true,
    features: [
      '最大50ユーザー',
      '100GBストレージ',
      '高度な承認ルート',
      'カスタムフォーム',
      'API アクセス',
      '優先サポート',
    ],
  },
  enterprise: {
    name: 'エンタープライズ',
    price: 98000,
    maxUsers: 99999,
    maxStorage: 1000,
    features: [
      '無制限ユーザー',
      '1TBストレージ',
      'カスタムブランディング',
      'SSO (シングルサインオン)',
      '専任サポート',
      'SLA保証',
      'オンプレミス対応可',
    ],
  },
}

export default function Signup() {
  const [step, setStep] = useState<SignupStep>('info')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // フォームデータ
  const [companyName, setCompanyName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [adminName, setAdminName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<Plan>('pro')

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // バリデーション
    if (!companyName || !subdomain || !adminName || !email || !password || !passwordConfirm) {
      setError('すべての項目を入力してください')
      return
    }

    if (password !== passwordConfirm) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    // サブドメインバリデーション
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      setError('サブドメインは英小文字、数字、ハイフンのみ使用できます')
      return
    }

    setStep('plan')
  }

  const handlePlanSubmit = () => {
    if (selectedPlan === 'free') {
      // フリープランは即座に登録完了
      handleSignup()
    } else {
      // 有料プランは決済画面へ
      setStep('payment')
    }
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSignup()
  }

  const handleSignup = async () => {
    setIsLoading(true)
    setError('')

    try {
      // 本番環境ではAPIリクエスト
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setStep('complete')
    } catch (err) {
      setError('登録に失敗しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle2 className="w-12 h-12 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">ApprovalHub</h1>
          </div>
          <p className="text-gray-600">10秒で完結する承認システム</p>
        </div>

        {/* Progress Steps */}
        {step !== 'complete' && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'info' ? 'text-primary-600' : step === 'plan' || step === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'info' ? 'bg-primary-600 text-white' : step === 'plan' || step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  1
                </div>
                <span className="text-sm font-medium">基本情報</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step === 'plan' ? 'text-primary-600' : step === 'payment' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'plan' ? 'bg-primary-600 text-white' : step === 'payment' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className="text-sm font-medium">プラン選択</span>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  3
                </div>
                <span className="text-sm font-medium">決済情報</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: 基本情報 */}
        {step === 'info' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">基本情報の入力</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleInfoSubmit} className="space-y-4">
              {/* 会社名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  会社名・組織名
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="株式会社サンプル"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* サブドメイン */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  サブドメイン
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                    placeholder="your-company"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    pattern="[a-z0-9-]+"
                    required
                  />
                  <span className="text-gray-600">.approvalhub.com</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  英小文字、数字、ハイフンのみ使用できます
                </p>
              </div>

              {/* 管理者名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  管理者名
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="山田太郎"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* パスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  パスワード
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8文字以上"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  minLength={8}
                  required
                />
              </div>

              {/* パスワード確認 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  パスワード（確認）
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="もう一度入力"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  minLength={8}
                  required
                />
              </div>

              {/* 利用規約 */}
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1 w-4 h-4 text-primary-600 rounded" required />
                <p className="text-sm text-gray-600">
                  <a href="#" className="text-primary-600 hover:underline">利用規約</a>
                  と
                  <a href="#" className="text-primary-600 hover:underline">プライバシーポリシー</a>
                  に同意します
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                次へ進む
              </button>
            </form>
          </div>
        )}

        {/* Step 2: プラン選択 */}
        {step === 'plan' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">プランを選択</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {(Object.keys(plans) as Plan[]).map((planKey) => {
                const plan = plans[planKey]
                return (
                  <div
                    key={planKey}
                    onClick={() => setSelectedPlan(planKey)}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      selectedPlan === planKey
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                        おすすめ
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ¥{plan.price.toLocaleString()}
                      </span>
                      <span className="text-gray-600">/月</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('info')}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                戻る
              </button>
              <button
                onClick={handlePlanSubmit}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {selectedPlan === 'free' ? '登録を完了' : '決済情報の入力へ'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 決済情報 */}
        {step === 'payment' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">決済情報の入力</h2>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                選択プラン: <strong>{plans[selectedPlan].name}</strong> - ¥
                {plans[selectedPlan].price.toLocaleString()}/月
              </p>
              <p className="text-xs text-blue-600 mt-1">
                最初の14日間は無料トライアルです。期間中はいつでもキャンセルできます。
              </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* カード番号 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カード番号
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 有効期限 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    有効期限
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* カード名義 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  カード名義人
                </label>
                <input
                  type="text"
                  placeholder="TARO YAMADA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <p className="text-xs text-gray-500">
                🔒 決済情報は暗号化されて安全に送信されます
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('plan')}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  戻る
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    '登録を完了'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: 完了 */}
        {step === 'complete' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">登録が完了しました！</h2>
            <p className="text-gray-600 mb-6">
              {email} に確認メールを送信しました。
              <br />
              メール内のリンクをクリックして、アカウントを有効化してください。
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>アクセスURL:</strong>
                <br />
                <a
                  href={`https://${subdomain}.approvalhub.com`}
                  className="text-primary-600 hover:underline"
                >
                  https://{subdomain}.approvalhub.com
                </a>
              </p>
            </div>

            <button
              onClick={() => (window.location.href = '/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              ログインページへ
            </button>
          </div>
        )}

        {/* Footer */}
        {step !== 'complete' && (
          <p className="text-center text-sm text-gray-600 mt-6">
            すでにアカウントをお持ちの方は{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              ログイン
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
