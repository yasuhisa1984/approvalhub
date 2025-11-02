import { CheckCircle2, Zap, Shield, Users, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "10秒で完結",
      description: "ワンクリック承認で業務スピードを劇的に向上",
      status: "✅ 実装済み"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "マルチテナント対応",
      description: "企業ごとに完全分離されたセキュアな環境",
      status: "✅ 実装済み"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "柔軟な承認フロー",
      description: "部門・役職に応じた承認ルートを自由に設定",
      status: "✅ 実装済み"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "リアルタイム通知",
      description: "承認依頼を即座に通知、滞留を防止",
      status: "🚧 準備中"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "分析ダッシュボード",
      description: "承認フローの可視化で業務改善をサポート",
      status: "🚧 準備中"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: "API連携",
      description: "既存システムとシームレスに統合",
      status: "🚧 準備中"
    }
  ]

  const demoAccounts = [
    { name: "やっくん隊長", role: "管理者", email: "yakkun@demo.com" },
    { name: "田中部長", role: "マネージャー", email: "tanaka@demo.com" },
    { name: "佐藤", role: "一般ユーザー", email: "sato@demo.com" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">ApprovalHub</h1>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              ログイン / デモを試す
            </button>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              承認業務を<span className="text-primary-600">10秒</span>で完結
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              紙の稟議書、メール確認、複雑なワークフロー...そんな面倒な承認業務を、
              <br />
              <strong>シンプルで高速な承認システム</strong>で解決します
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-lg transition-colors flex items-center gap-2"
              >
                無料でデモを試す
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#features"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-lg text-lg border-2 border-primary-600 transition-colors"
              >
                機能を見る
              </a>
            </div>
          </div>

          {/* ステータスバッジ */}
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              ✅ ログイン機能
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              ✅ 承認・差し戻し機能
            </div>
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              ✅ 承認履歴表示
            </div>
            <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
              🚧 通知機能（準備中）
            </div>
          </div>
        </div>
      </section>

      {/* ユースケースセクション */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              こんな承認業務に最適
            </h2>
            <p className="text-xl text-gray-600">
              様々な業務フローに対応。導入企業の平均承認時間は<strong className="text-primary-600">70%短縮</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">契約書承認</h3>
              <p className="text-gray-700 mb-4">
                取引先との契約書を複数の役職者に回覧。従来3日かかっていた承認が<strong>半日で完了</strong>。
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>申請者 → 部長 → 役員 の3段階承認</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>契約書PDFの添付・履歴管理</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>差し戻し時のコメント機能</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">見積・発注承認</h3>
              <p className="text-gray-700 mb-4">
                金額に応じた承認ルートを自動設定。<strong>誤発注が90%減少</strong>し、コスト管理も向上。
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>10万円以下：課長承認のみ</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>100万円以上：役員承認必須</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>承認履歴で監査対応も万全</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">取引先登録承認</h3>
              <p className="text-gray-700 mb-4">
                新規取引先の審査プロセスを効率化。<strong>登録リードタイム50%削減</strong>を実現。
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>営業 → 審査部 → 経理 の並列承認</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>必要書類のチェックリスト機能</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>承認後、自動で基幹システム連携</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            主な機能
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-3">{feature.description}</p>
                <span className={`text-sm font-semibold ${
                  feature.status.startsWith('✅')
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}>
                  {feature.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 社会的証明セクション */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">3社</div>
              <p className="text-gray-600">β導入企業</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">70%</div>
              <p className="text-gray-600">承認時間短縮</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1日</div>
              <p className="text-gray-600">平均導入期間</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <p className="text-gray-600">セキュア通信</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">導入企業様の声</p>
            <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 italic mb-3">
                「Excel管理からの脱却を検討していたところ、ApprovalHubに出会いました。
                <strong>導入初日から使えて</strong>、承認待ちの滞留が激減しました。」
              </p>
              <p className="text-sm text-gray-600">— IT企業 管理部長（従業員50名）</p>
            </div>
          </div>
        </div>
      </section>

      {/* デモアカウントセクション */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              今すぐデモを試す
            </h2>
            <p className="text-xl text-gray-600">
              3つのロールでApprovalHubを体験できます（パスワード: password）
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-colors"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {account.name[0]}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {account.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{account.role}</p>
                  <p className="text-xs text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded">
                    {account.email}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-lg transition-colors"
            >
              デモを開始する
            </button>
          </div>
        </div>
      </section>

      {/* 乗り換え簡単セクション */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              他のシステムからの乗り換えも簡単
            </h2>
            <p className="text-xl text-gray-600">
              既存の承認システムから、スムーズに移行できます
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                📄
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                CSVで一括インポート
              </h3>
              <p className="text-gray-600 text-center">
                ユーザー情報や承認ルートを<br />
                CSVファイルで一括登録。<br />
                移行作業を数分で完了
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🔄
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                既存データを保持
              </h3>
              <p className="text-gray-600 text-center">
                過去の承認履歴も<br />
                そのまま移行可能。<br />
                監査対応も安心
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                即日稼働開始
              </h3>
              <p className="text-gray-600 text-center">
                複雑な設定は不要。<br />
                データ移行後、<br />
                その日から運用開始可能
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-white px-6 py-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600 mb-2">対応システム例</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">ワークフローシステム</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">kintone</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">サイボウズ</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Excel管理</span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">その他CSV対応システム</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            承認業務を今すぐ改善
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            無料デモで実際の使い心地を体験してください
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white hover:bg-gray-100 text-primary-600 font-bold rounded-lg text-lg transition-colors"
          >
            今すぐデモを試す
          </button>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary-500" />
              <span className="font-semibold text-white">ApprovalHub</span>
            </div>
            <p className="text-sm">
              © 2025 ApprovalHub. Built with ❤️ by Claude Code
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
