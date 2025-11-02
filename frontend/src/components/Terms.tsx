import { Link } from 'react-router-dom'

export default function Terms() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">利用規約</h1>
          <p className="text-gray-600 mb-8">最終更新日: 2024年11月2日</p>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第1条（適用）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>本利用規約（以下「本規約」）は、ApprovalHub（以下「当社」）が提供する承認管理サービス「ApprovalHub」（以下「本サービス」）の利用条件を定めるものです。</li>
                <li>本規約は、本サービスの利用に関し、当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。</li>
                <li>ユーザーは、本サービスを利用することにより、本規約の全ての内容に同意したものとみなされます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第2条（定義）</h2>
              <p className="text-gray-700 mb-3">本規約において使用する用語の定義は、以下のとおりとします。</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>「ユーザー」</strong>: 本サービスを利用する個人または法人</li>
                <li><strong>「契約者」</strong>: 本サービスの利用契約を締結した法人または個人事業主</li>
                <li><strong>「利用者」</strong>: 契約者によって本サービスの利用を許可された個人</li>
                <li><strong>「アカウント」</strong>: 本サービスを利用するために必要な登録情報</li>
                <li><strong>「コンテンツ」</strong>: ユーザーが本サービスを通じて投稿、アップロード、送信するテキスト、画像、ファイル等のデータ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第3条（アカウント登録）</h2>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>本サービスの利用を希望する者は、本規約に同意の上、当社所定の方法により登録を申請するものとします。</li>
                <li>当社は、登録申請者が以下のいずれかに該当する場合、登録を拒否することがあります：
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>登録情報に虚偽、誤記、記載漏れがあった場合</li>
                    <li>過去に本規約違反により利用停止処分を受けたことがある場合</li>
                    <li>反社会的勢力等（暴力団、暴力団員、右翼団体、反社会的勢力、その他これに準ずる者）である、または関係を有していると当社が判断した場合</li>
                    <li>その他、当社が登録を適当でないと判断した場合</li>
                  </ul>
                </li>
                <li>ユーザーは、登録情報に変更があった場合、速やかに当社所定の方法により変更手続きを行うものとします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第4条（アカウント管理）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>ユーザーは、自己の責任において、アカウントのパスワードを適切に管理するものとします。</li>
                <li>ユーザーは、いかなる場合にも、アカウントを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</li>
                <li>アカウントとパスワードの組み合わせが登録情報と一致してログインされた場合、当該アカウントを保有するユーザー自身の利用とみなします。</li>
                <li>アカウントが第三者によって不正に使用されたことによりユーザーに生じた損害について、当社は一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第5条（利用料金および支払方法）</h2>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>本サービスの利用料金は、<Link to="/pricing" className="text-primary-600 hover:underline">料金ページ</Link>に定めるとおりとします。</li>
                <li>ユーザーは、利用料金を当社が指定する方法により支払うものとします。</li>
                <li>有料プランの支払いは、クレジットカード決済による月額自動課金とします。</li>
                <li>ユーザーが利用料金の支払いを遅滞した場合、当社は本サービスの提供を停止することができます。</li>
                <li>一度支払われた利用料金は、当社の責めに帰すべき事由がある場合を除き、返金されません。</li>
                <li>プランの変更は、変更手続き完了後の次回課金日から適用されます。アップグレードの場合は日割り計算で差額を請求します。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第6条（禁止事項）</h2>
              <p className="text-gray-700 mb-3">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当社、本サービスの他のユーザー、または第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為</li>
                <li>本サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                <li>本サービスの運営を妨害するおそれのある行為</li>
                <li>当社のネットワークまたはシステム等への不正アクセス</li>
                <li>第三者に成りすます行為</li>
                <li>本サービスの他のユーザーのアカウントを利用する行為</li>
                <li>反社会的勢力等への利益供与行為</li>
                <li>本サービスを通じて入手した情報を商業的に利用する行為</li>
                <li>当社が事前に許諾しない本サービス上での宣伝、広告、勧誘、または営業行為</li>
                <li>他のユーザーの情報の収集</li>
                <li>当社、本サービスの他のユーザーまたは第三者に不利益、損害、不快感を与える行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第7条（コンテンツの取扱い）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>ユーザーが本サービスを利用して投稿したコンテンツの著作権は、ユーザーに帰属します。</li>
                <li>ユーザーは、投稿したコンテンツについて、当社に対し、世界的、非独占的、無償、サブライセンス可能かつ譲渡可能な使用権を付与するものとします。</li>
                <li>ユーザーは、投稿するコンテンツについて、自らが投稿その他送信することについての適法な権利を有していることを保証するものとします。</li>
                <li>当社は、ユーザーが投稿したコンテンツについて、本規約に違反すると判断した場合、事前の通知なく削除することができます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第8条（サービスの変更・停止）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>当社は、ユーザーへの事前の通知なく、本サービスの内容の全部または一部を変更、追加、廃止することができます。</li>
                <li>当社は、以下のいずれかに該当する場合、ユーザーに事前に通知することなく、本サービスの全部または一部の提供を停止または中断することができます：
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>本サービスに係るシステムの保守点検または更新を行う場合</li>
                    <li>地震、落雷、火災、停電、天災などの不可抗力により本サービスの提供が困難な場合</li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                  </ul>
                </li>
                <li>当社は、本条に基づく措置により生じたユーザーの損害について、一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第9条（データのバックアップ）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>当社は、本サービス上のデータについて、定期的にバックアップを実施します。</li>
                <li>ただし、ユーザーは、自己の責任において、重要なデータについては別途バックアップを保持するものとします。</li>
                <li>当社は、システム障害、天災、その他やむを得ない事由により、ユーザーのデータが消失した場合でも、一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第10条（契約の解除）</h2>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                <li>ユーザーは、当社所定の手続きにより、いつでも本サービスの利用契約を解約できます。</li>
                <li>当社は、ユーザーが以下のいずれかに該当する場合、事前の通知なく、本サービスの利用停止または契約解除ができます：
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>本規約のいずれかの条項に違反した場合</li>
                    <li>登録情報に虚偽の事実があることが判明した場合</li>
                    <li>利用料金の支払いを遅滞した場合</li>
                    <li>当社からの問い合わせに対し、30日以上応答がない場合</li>
                    <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
                  </ul>
                </li>
                <li>契約解除後も、解除前に生じた債務は消滅しません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第11条（免責事項）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含む）がないことを保証しません。</li>
                <li>当社は、本サービスに起因してユーザーに生じた損害について、一切の責任を負いません。ただし、当社に故意または重過失がある場合を除きます。</li>
                <li>ユーザー間のトラブル、またはユーザーと第三者との間のトラブルについて、当社は一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第12条（秘密保持）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>ユーザーは、本サービスの利用を通じて知り得た当社の技術上、営業上その他の秘密情報を第三者に開示、漏洩してはなりません。</li>
                <li>当社は、ユーザーの個人情報を、<Link to="/privacy" className="text-primary-600 hover:underline">プライバシーポリシー</Link>に従って適切に取り扱います。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第13条（利用規約の変更）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>当社は、必要に応じて本規約を変更することができます。</li>
                <li>本規約を変更した場合、変更後の利用規約の施行日の14日前までに、本サービス上またはメールにて通知します。</li>
                <li>変更後の利用規約の施行日以降に本サービスを利用したユーザーは、変更後の利用規約に同意したものとみなします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">第14条（準拠法および管轄裁判所）</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
              </ol>
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
