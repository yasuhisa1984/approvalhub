import { Link } from 'react-router-dom'

export default function Privacy() {
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
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition">料金</Link>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">ログイン</Link>
            <Link to="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
              無料で始める
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">プライバシーポリシー</h1>
          <p className="text-gray-600 mb-8">最終更新日: 2024年11月2日</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 基本方針</h2>
              <p className="text-gray-700 leading-relaxed">
                ApprovalHub（以下「当社」）は、お客様の個人情報保護の重要性について認識し、個人情報の保護に関する法律（以下「個人情報保護法」）を遵守すると共に、以下のプライバシーポリシー（以下「本ポリシー」）に従い、適切な取扱い及び保護に努めます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 個人情報の定義</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                本ポリシーにおいて「個人情報」とは、個人情報保護法第2条第1項により定義された個人情報、すなわち、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含みます）を指します。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 収集する個人情報</h2>
              <p className="text-gray-700 leading-relaxed mb-3">当社は、以下の個人情報を収集します：</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>アカウント情報</strong>: 氏名、メールアドレス、会社名、部署名、役職</li>
                <li><strong>利用情報</strong>: ログイン日時、IPアドレス、利用履歴、承認履歴</li>
                <li><strong>申請データ</strong>: 承認申請の内容、添付ファイル、コメント</li>
                <li><strong>お問い合わせ情報</strong>: お問い合わせ内容、電話番号</li>
                <li><strong>決済情報</strong>: クレジットカード情報（決済代行会社経由、当社は保持しません）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 個人情報の利用目的</h2>
              <p className="text-gray-700 leading-relaxed mb-3">当社は、収集した個人情報を以下の目的で利用します：</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>サービスの提供、運営、維持、改善</li>
                <li>ユーザー認証、本人確認</li>
                <li>承認フローの実行、通知の送信</li>
                <li>お問い合わせへの対応、カスタマーサポート</li>
                <li>利用料金の請求、決済処理</li>
                <li>サービスに関する重要なお知らせの通知</li>
                <li>利用規約違反、不正利用の検出と防止</li>
                <li>サービス利用状況の分析、統計データの作成</li>
                <li>新機能、キャンペーン情報のご案内（オプトアウト可能）</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 個人情報の第三者提供</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                当社は、以下のいずれかに該当する場合を除き、お客様の同意なく個人情報を第三者に提供することはありません：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 個人情報の共同利用・委託</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">6.1 業務委託</h3>
                  <p className="leading-relaxed mb-2">
                    当社は、以下の業務を外部事業者に委託する場合があります。この場合、個人情報保護契約を締結し、適切な管理・監督を行います：
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>クラウドインフラ提供（Supabase、Render.com、Vercel等）</li>
                    <li>決済処理（Stripe等）</li>
                    <li>メール配信サービス</li>
                    <li>カスタマーサポートツール</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 個人情報の安全管理措置</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                当社は、個人情報の漏洩、滅失または毀損の防止その他の個人情報の安全管理のため、以下の措置を講じています：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>技術的安全管理措置</strong>: SSL/TLS暗号化通信、データベース暗号化、アクセス制御、ファイアウォール</li>
                <li><strong>組織的安全管理措置</strong>: 個人情報保護規程の策定、責任者の設置、定期的な従業員教育</li>
                <li><strong>人的安全管理措置</strong>: 秘密保持契約の締結、アクセス権限の最小化</li>
                <li><strong>物理的安全管理措置</strong>: データセンターの物理的セキュリティ、バックアップの実施</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookie（クッキー）について</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                当社のサービスでは、ユーザー体験の向上のためCookieを使用しています。Cookieとは、ウェブサイトがお客様のコンピュータに送信する小さなテキストファイルです。
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-3">
                <h4 className="font-semibold text-gray-900 mb-2">Cookieの利用目的</h4>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>ログイン状態の維持（セッション管理）</li>
                  <li>ユーザー設定の保存</li>
                  <li>サービス利用状況の分析</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                ブラウザの設定により、Cookieの受け入れを拒否することが可能ですが、一部の機能が利用できなくなる場合があります。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. お客様の権利</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                お客様は、ご自身の個人情報について、以下の権利を有します：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>開示請求</strong>: 当社が保有する個人情報の開示を請求できます</li>
                <li><strong>訂正・追加・削除</strong>: 個人情報が事実でない場合、訂正、追加または削除を請求できます</li>
                <li><strong>利用停止・消去</strong>: 利用目的の範囲を超えて取り扱われている場合、利用の停止または消去を請求できます</li>
                <li><strong>アカウント削除</strong>: サービス画面から、またはお問い合わせにより、いつでもアカウントを削除できます</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                これらの権利行使をご希望の場合は、<Link to="/contact" className="text-primary-600 hover:underline">お問い合わせフォーム</Link>よりご連絡ください。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. データの保存期間と削除</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                当社は、個人情報を利用目的の達成に必要な期間のみ保持します：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>アカウント情報</strong>: アカウント削除後30日以内に削除（バックアップからは90日以内）</li>
                <li><strong>承認データ</strong>: プランに応じた保持期間（スターター: 3ヶ月、ビジネス以上: 無制限）</li>
                <li><strong>監査ログ</strong>: セキュリティ・法令遵守のため最大7年間保持</li>
                <li><strong>お問い合わせ履歴</strong>: 対応完了後3年間保持</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. プライバシーポリシーの変更</h2>
              <p className="text-gray-700 leading-relaxed">
                当社は、法令改正、サービス変更等に伴い、本ポリシーを変更することがあります。重要な変更がある場合は、サービス内での通知またはメールにてお知らせします。変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. お問い合わせ窓口</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                個人情報の取扱いに関するお問い合わせは、以下までご連絡ください：
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">ApprovalHub 個人情報保護管理者</p>
                <p className="text-gray-700 mb-1">メール: privacy@approvalhub.com</p>
                <p className="text-gray-700 mb-1">電話: 03-1234-5678（平日 10:00-18:00）</p>
                <p className="text-gray-700">
                  お問い合わせフォーム: <Link to="/contact" className="text-primary-600 hover:underline">こちら</Link>
                </p>
              </div>
            </section>

            <section className="border-t pt-8">
              <p className="text-sm text-gray-500">
                ApprovalHub<br />
                〒150-0001 東京都渋谷区神宮前1-1-1<br />
                最終更新日: 2024年11月2日
              </p>
            </section>
          </div>
        </div>
      </div>

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
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/contact" className="hover:text-white transition">お問い合わせ</Link></li>
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
