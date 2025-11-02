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
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">ApprovalHub</h1>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                料金
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                ログイン / デモを試す
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* ターゲット明示バッジ */}
            <div className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-full mb-6 text-sm font-semibold">
              <Users className="w-4 h-4" />
              従業員30〜200名の企業様向け
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              承認業務を<span className="text-primary-600">10秒</span>で完結
            </h2>

            {/* サブヘッドライン強化 */}
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
              <strong>製造業・IT・商社</strong>で導入実績多数
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              紙の稟議書、メール確認、複雑なワークフロー...そんな面倒な承認業務を、
              シンプルで高速な承認システムで解決します
            </p>

            {/* CTA強化 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={() => navigate('/signup')}
                className="px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-xl transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <span className="text-2xl">🎯</span>
                14日間無料トライアル
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-10 py-5 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-lg text-xl border-2 border-primary-600 transition-colors shadow-lg hover:shadow-xl"
              >
                デモアカウントで試す
              </button>
            </div>

            {/* 信頼バッジ */}
            <div className="flex justify-center items-center gap-6 flex-wrap text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>クレジットカード登録不要</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>導入初日から利用可能</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>契約期間縛りなし</span>
              </div>
            </div>
          </div>

          {/* 実績数値の可視化 */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-primary-600 mb-2">70%</div>
              <div className="text-sm text-gray-600">承認時間短縮</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-primary-600 mb-2">1日</div>
              <div className="text-sm text-gray-600">平均導入期間</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-primary-600 mb-2">3社</div>
              <div className="text-sm text-gray-600">β導入企業</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">セキュア通信</div>
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

          {/* Before/After 比較 */}
          <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold text-center mb-12">
              導入前と導入後の変化
            </h3>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Before */}
              <div className="bg-red-900/30 border-2 border-red-500/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">😰</div>
                  <div>
                    <div className="text-red-400 font-semibold text-sm">BEFORE</div>
                    <div className="text-xl font-bold">導入前の課題</div>
                  </div>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl flex-shrink-0">✗</span>
                    <div>
                      <div className="font-semibold mb-1">承認に3日以上かかる</div>
                      <div className="text-sm text-gray-300">紙の回覧、メールCC、上司不在で滞留...</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl flex-shrink-0">✗</span>
                    <div>
                      <div className="font-semibold mb-1">承認状況が見えない</div>
                      <div className="text-sm text-gray-300">今どこで止まっているのか分からない</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl flex-shrink-0">✗</span>
                    <div>
                      <div className="font-semibold mb-1">履歴が残らない</div>
                      <div className="text-sm text-gray-300">監査時に証跡を探すのが大変</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 text-xl flex-shrink-0">✗</span>
                    <div>
                      <div className="font-semibold mb-1">Excel管理で属人化</div>
                      <div className="text-sm text-gray-300">担当者不在時に業務が止まる</div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* After */}
              <div className="bg-green-900/30 border-2 border-green-500/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🎉</div>
                  <div>
                    <div className="text-green-400 font-semibold text-sm">AFTER</div>
                    <div className="text-xl font-bold">導入後の改善</div>
                  </div>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                    <div>
                      <div className="font-semibold mb-1">承認が半日で完了</div>
                      <div className="text-sm text-gray-300">ワンクリック承認、モバイル対応で即対応</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                    <div>
                      <div className="font-semibold mb-1">リアルタイムで進捗確認</div>
                      <div className="text-sm text-gray-300">ダッシュボードで承認状況を一目で把握</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                    <div>
                      <div className="font-semibold mb-1">完全な監査証跡</div>
                      <div className="text-sm text-gray-300">誰が・いつ・何を承認したか全て記録</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                    <div>
                      <div className="font-semibold mb-1">クラウドで誰でもアクセス</div>
                      <div className="text-sm text-gray-300">出張中でもスマホから承認可能</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* 数値での比較 */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">70%</div>
                <div className="text-sm text-gray-300">時間削減</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">90%</div>
                <div className="text-sm text-gray-300">エラー削減</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-400 mb-2">100%</div>
                <div className="text-sm text-gray-300">証跡保持</div>
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

      {/* 選ばれる理由セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ApprovalHubが選ばれる理由
            </h2>
            <p className="text-xl text-gray-600">
              導入初日から使える簡単さと、エンタープライズにも対応できる強力な機能
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 理由1: 簡単 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                誰でも、かんたん
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>Excel感覚</strong>でフォーム作成<br />
                    <span className="text-sm text-gray-600">難しいコード不要、直感的な操作</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>導入初日</strong>から使える<br />
                    <span className="text-sm text-gray-600">平均導入期間わずか1日</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>マニュアル不要</strong>の分かりやすさ<br />
                    <span className="text-sm text-gray-600">ITに詳しくなくても安心</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 理由2: 柔軟 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                🔧
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                柔軟な承認フロー
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>複雑なルート</strong>にも対応<br />
                    <span className="text-sm text-gray-600">並列承認、条件分岐も自由自在</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>部門・役職</strong>に応じた設定<br />
                    <span className="text-sm text-gray-600">金額・種類で自動振り分け</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>いつでも変更可能</strong><br />
                    <span className="text-sm text-gray-600">組織変更にも即座に対応</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 理由3: 安心 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                🛡️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                安心のセキュリティ
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>SSL/TLS暗号化</strong>通信<br />
                    <span className="text-sm text-gray-600">金融機関レベルのセキュリティ</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>完全な監査証跡</strong><br />
                    <span className="text-sm text-gray-600">誰が・いつ・何を承認したか記録</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 text-xl flex-shrink-0">✓</span>
                  <div>
                    <strong>定期バックアップ</strong>で安心<br />
                    <span className="text-sm text-gray-600">データ消失のリスクを最小化</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 追加の差別化ポイント */}
          <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">さらに、こんなメリットも</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">📱</div>
                <div className="font-semibold text-gray-900 mb-1">モバイル対応</div>
                <div className="text-sm text-gray-600">スマホから<br />どこでも承認</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📊</div>
                <div className="font-semibold text-gray-900 mb-1">レポート機能</div>
                <div className="text-sm text-gray-600">承認状況を<br />一目で把握</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔗</div>
                <div className="font-semibold text-gray-900 mb-1">API連携</div>
                <div className="text-sm text-gray-600">既存システムと<br />シームレス統合</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">💬</div>
                <div className="font-semibold text-gray-900 mb-1">充実サポート</div>
                <div className="text-sm text-gray-600">導入から運用まで<br />手厚くフォロー</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 社会的証明セクション */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              導入企業の実績
            </h2>
            <p className="text-xl text-gray-600">
              業界・規模を問わず、多くの企業で承認業務の効率化を実現
            </p>
          </div>

          {/* 数値実績 */}
          <div className="grid md:grid-cols-4 gap-8 text-center mb-16">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-5xl font-bold text-primary-600 mb-2">3社</div>
              <p className="text-gray-600 font-medium">β導入企業</p>
              <p className="text-xs text-gray-500 mt-1">2024年11月時点</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-5xl font-bold text-primary-600 mb-2">70%</div>
              <p className="text-gray-600 font-medium">承認時間短縮</p>
              <p className="text-xs text-gray-500 mt-1">平均値（最大90%）</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-5xl font-bold text-primary-600 mb-2">1日</div>
              <p className="text-gray-600 font-medium">平均導入期間</p>
              <p className="text-xs text-gray-500 mt-1">最短即日稼働</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-5xl font-bold text-primary-600 mb-2">100%</div>
              <p className="text-gray-600 font-medium">セキュア通信</p>
              <p className="text-xs text-gray-500 mt-1">SSL/TLS暗号化</p>
            </div>
          </div>

          {/* 顧客の声 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">導入企業様の声</h3>

            <div className="grid md:grid-cols-3 gap-6">
              {/* 顧客の声 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                    🏭
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">製造業A社</div>
                    <div className="text-xs text-gray-500">従業員120名</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic mb-3">
                  「見積承認が紙からデジタルに変わり、<strong>承認スピードが3日→半日</strong>に。
                  出張中の役員もスマホで承認できるようになり、業務が止まらなくなりました。」
                </p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  ★★★★★
                </div>
              </div>

              {/* 顧客の声 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                    💻
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">IT企業B社</div>
                    <div className="text-xs text-gray-500">従業員50名</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic mb-3">
                  「Excel管理からの脱却を検討していたところ、ApprovalHubに出会いました。
                  <strong>導入初日から使えて</strong>、承認待ちの滞留が激減しました。」
                </p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  ★★★★★
                </div>
              </div>

              {/* 顧客の声 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">商社C社</div>
                    <div className="text-xs text-gray-500">従業員80名</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic mb-3">
                  「取引先登録の承認フローが複雑で困っていました。
                  ApprovalHubで<strong>承認ルートを可視化</strong>できて、新人でもすぐ理解できるように。」
                </p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>

          {/* 導入業界 */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">導入実績のある業界</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">製造業</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">IT・ソフトウェア</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">商社・卸売</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">建設・不動産</span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow">サービス業</span>
            </div>
          </div>
        </div>
      </section>

      {/* 価格セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              シンプルで分かりやすい料金プラン
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              初期費用0円・契約期間縛りなし
            </p>
            <p className="text-sm text-gray-500">
              14日間の無料トライアルで、全ての機能をお試しいただけます
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* スタータープラン */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">スターター</h3>
                <p className="text-sm text-gray-600">小規模チーム向け</p>
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">無料</div>
                <p className="text-sm text-gray-500">ずっと0円</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-700">ユーザー数: <strong>5名まで</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-700">月間承認件数: <strong>50件</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-700">承認ルート: 3段階</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-700">基本的な通知機能</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-700">メールサポート</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition"
              >
                無料で始める
              </button>
            </div>

            {/* ビジネスプラン（おすすめ） */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-500 rounded-2xl p-8 relative hover:shadow-2xl transition-shadow">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-6 py-1 rounded-full text-sm font-semibold">
                おすすめ 🌟
              </div>
              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">ビジネス</h3>
                <p className="text-sm text-gray-600">成長企業向け</p>
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-primary-600 mb-2">¥9,800</div>
                <p className="text-sm text-gray-600">月額 / 50名まで</p>
                <p className="text-xs text-gray-500 mt-1">1名あたり ¥196</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-sm text-gray-700">ユーザー数: <strong>50名まで</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-sm text-gray-700">月間承認件数: <strong>無制限</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-sm text-gray-700">承認ルート: 無制限</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-sm text-gray-700">高度な通知・リマインダー</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-sm text-gray-700">優先メールサポート</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">✓</span>
                  <span className="text-sm text-gray-700">監査ログ・レポート</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/signup?plan=business')}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition shadow-lg"
              >
                14日間無料トライアル
              </button>
            </div>

            {/* エンタープライズプラン */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">エンタープライズ</h3>
                <p className="text-sm text-gray-600">大企業向け</p>
              </div>
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-gray-900 mb-2">お問い合わせ</div>
                <p className="text-sm text-gray-500">カスタム対応</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-sm text-gray-700">ユーザー数: <strong>無制限</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-sm text-gray-700">複数テナント管理</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-sm text-gray-700">SSO/SAML認証</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-sm text-gray-700">専任サポート担当</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-sm text-gray-700">SLA保証（99.9%）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">✓</span>
                  <span className="text-sm text-gray-700">導入支援・トレーニング</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition"
              >
                お問い合わせ
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/pricing')}
              className="text-primary-600 hover:text-primary-700 font-semibold underline"
            >
              詳しい料金プランを見る →
            </button>
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

      {/* FAQセクション */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              よくあるご質問
            </h2>
            <p className="text-xl text-gray-600">
              導入前の疑問を解消します
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>導入までにどのくらい時間がかかりますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                <strong className="text-primary-600">平均1日で導入可能</strong>です。アカウント作成後、すぐに承認ルートの設定を始められます。
                ユーザー登録もCSVで一括インポートできるため、<strong>最短で即日稼働</strong>した実績もあります。
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>無料プランでも機能制限はありますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                ユーザー数5名、月間承認件数50件までの制限がありますが、<strong>基本的な承認フロー機能は全て利用可能</strong>です。
                小規模チームであれば、無料プランでも十分にご活用いただけます。
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>既存のExcel・他社システムからデータ移行できますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                はい、<strong>CSV形式で一括インポート</strong>が可能です。ユーザー情報、承認ルート、過去の承認履歴など、
                既存データをそのまま移行できます。kintone、サイボウズ、各種ワークフローシステムからの移行実績もあります。
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>プランのアップグレード/ダウングレードはできますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                <strong>いつでも可能</strong>です。月の途中でアップグレードした場合は日割り計算で請求されます。
                契約期間の縛りもないため、ビジネスの成長に合わせて柔軟にプラン変更できます。
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>セキュリティ対策はどうなっていますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                全通信を<strong>SSL/TLS暗号化</strong>、データベースも暗号化保存しています。
                また、誰が・いつ・何を承認したか<strong>完全な監査証跡</strong>を記録。
                定期的なセキュリティ監査も実施しており、エンタープライズプランではIP制限・SSO認証にも対応しています。
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>複雑な承認フロー（並列承認・条件分岐）にも対応できますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                はい、対応可能です。<strong>並列承認</strong>（複数の承認者が同時に承認）、
                <strong>金額による自動振り分け</strong>（10万円以下は課長、100万円以上は役員など）、
                <strong>部門別のルート設定</strong>など、柔軟な承認フローを構築できます。
              </p>
            </div>

            {/* FAQ 7 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>スマホ・タブレットからも使えますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                はい、<strong>完全レスポンシブ対応</strong>です。iPhone、Android、iPadなど、
                あらゆるデバイスから承認操作が可能です。出張中や外出先からでも、
                スマホでワンタップ承認できます。
              </p>
            </div>

            {/* FAQ 8 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-start gap-2">
                <span className="text-primary-600 text-xl">Q.</span>
                <span>サポート体制はどうなっていますか？</span>
              </h3>
              <p className="text-gray-700 ml-7">
                全プランで<strong>メールサポート</strong>を提供。ビジネスプラン以上は優先対応いたします。
                エンタープライズプランでは専任サポート担当が付き、導入支援からトレーニングまで手厚くフォローします。
                平均返信時間は<strong>24時間以内</strong>です。
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">その他のご質問は、お気軽にお問い合わせください</p>
            <button
              onClick={() => navigate('/contact')}
              className="text-primary-600 hover:text-primary-700 font-semibold underline"
            >
              お問い合わせフォームへ →
            </button>
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
