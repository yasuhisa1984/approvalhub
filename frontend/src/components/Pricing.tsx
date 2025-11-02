import { Link } from 'react-router-dom'

export default function Pricing() {
  const plans = [
    {
      name: 'スターター',
      price: '無料',
      period: '',
      description: '小規模チームやトライアルに最適',
      features: [
        'ユーザー数: 5名まで',
        '月間承認件数: 50件まで',
        '承認ルート: 3段階まで',
        '基本的な通知機能',
        'メールサポート',
        'データ保持: 3ヶ月'
      ],
      highlight: false,
      cta: 'スタートアップを始める',
      ctaLink: '/signup'
    },
    {
      name: 'ビジネス',
      price: '¥9,800',
      period: '/月',
      description: '成長中の企業に最適',
      features: [
        'ユーザー数: 50名まで',
        '月間承認件数: 無制限',
        '承認ルート: 無制限',
        '高度な通知・リマインダー',
        'Slack/Teams連携',
        '優先メールサポート',
        'データ保持: 無制限',
        'カスタムフォームテンプレート',
        '監査ログ・レポート機能'
      ],
      highlight: true,
      cta: '14日間無料トライアル',
      ctaLink: '/signup?plan=business'
    },
    {
      name: 'エンタープライズ',
      price: 'お問い合わせ',
      period: '',
      description: '大企業・高度なセキュリティが必要な組織向け',
      features: [
        'ユーザー数: 無制限',
        '月間承認件数: 無制限',
        '複数テナント管理',
        'SSO/SAML認証',
        'IP制限・高度なセキュリティ',
        'カスタムAPI連携',
        '専任サポート担当',
        'SLA保証 (99.9%)',
        'オンプレミス対応可',
        '導入支援・トレーニング'
      ],
      highlight: false,
      cta: 'お問い合わせ',
      ctaLink: '/contact'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">✅</span>
            <h1 className="text-2xl font-bold text-primary-600">ApprovalHub</h1>
          </Link>
          <nav className="flex gap-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition">ホーム</Link>
            <Link to="/pricing" className="text-gray-900 font-semibold">料金</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">ログイン</Link>
            <Link to="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
              無料で始める
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          シンプルで透明性の高い料金プラン
        </h2>
        <p className="text-xl text-gray-600 mb-4">
          チームの規模に合わせて最適なプランを選択できます
        </p>
        <p className="text-lg text-gray-500">
          全てのプランで<strong className="text-primary-600">初期費用0円</strong>・<strong className="text-primary-600">契約期間縛りなし</strong>
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.highlight ? 'ring-4 ring-primary-500 relative' : ''
              }`}
            >
              {plan.highlight && (
                <div className="bg-primary-500 text-white text-center py-2 font-semibold text-sm">
                  おすすめ 🌟
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6 min-h-[3rem]">{plan.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 ml-1">{plan.period}</span>}
                  </div>
                  {plan.name === 'ビジネス' && (
                    <p className="text-sm text-gray-500 mt-1">1ユーザーあたり ¥196</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1 flex-shrink-0">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                    plan.highlight
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">よくある質問</h2>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">❓ 無料プランでも機能制限はありますか？</h3>
            <p className="text-gray-700">
              ユーザー数5名、月間承認件数50件までの制限がありますが、基本的な承認フロー機能は全て利用できます。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">❓ プランのアップグレード/ダウングレードはできますか？</h3>
            <p className="text-gray-700">
              いつでも可能です。月の途中でアップグレードした場合は日割り計算で請求されます。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">❓ 支払い方法は何がありますか？</h3>
            <p className="text-gray-700">
              クレジットカード（Visa、MasterCard、JCB、American Express）、銀行振込（エンタープライズプランのみ）に対応しています。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">❓ 導入までにどのくらい時間がかかりますか？</h3>
            <p className="text-gray-700">
              スターター・ビジネスプランは<strong>即日利用開始</strong>可能です。エンタープライズプランはお客様の要件に応じて1週間〜1ヶ月程度のカスタマイズ期間をいただく場合があります。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">❓ データの移行サポートはありますか？</h3>
            <p className="text-gray-700">
              はい。Excel・Googleスプレッドシートからの<strong>CSV一括インポート機能</strong>を提供しています。エンタープライズプランでは専任サポートによる移行支援も可能です。
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-2">❓ セキュリティ対策はどうなっていますか？</h3>
            <p className="text-gray-700">
              全通信のSSL/TLS暗号化、データベースの暗号化保存、定期的なセキュリティ監査を実施しています。エンタープライズプランではIP制限・SSO認証にも対応しています。
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            まずは無料で試してみませんか？
          </h2>
          <p className="text-xl text-white/90 mb-8">
            クレジットカード登録不要で今すぐ始められます
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
            >
              無料で始める
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition"
            >
              デモアカウントで試す
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">✅</span>
                <span className="text-xl font-bold text-white">ApprovalHub</span>
              </div>
              <p className="text-sm">
                承認業務を効率化するクラウドサービス
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">製品</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/pricing" className="hover:text-white transition">料金プラン</Link></li>
                <li><Link to="/" className="hover:text-white transition">機能</Link></li>
                <li><Link to="/api-docs" className="hover:text-white transition">API仕様</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white transition">お問い合わせ</Link></li>
                <li><a href="#" className="hover:text-white transition">ヘルプセンター</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">法務</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition">プライバシーポリシー</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">利用規約</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 ApprovalHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
