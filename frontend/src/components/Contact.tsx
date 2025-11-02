import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    category: 'general',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: 実際のAPI呼び出しに置き換える
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('お問い合わせ送信:', formData)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            </nav>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">送信完了しました</h2>
            <p className="text-gray-600 mb-8">
              お問い合わせありがとうございます。<br />
              担当者より<strong>1営業日以内</strong>にご連絡させていただきます。
            </p>
            <Link
              to="/"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    )
  }

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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          お問い合わせ
        </h2>
        <p className="text-xl text-gray-600">
          製品に関するご質問、導入のご相談など、お気軽にお問い合わせください
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">メール</h3>
                  <p className="text-gray-600 text-sm">info@approvalhub.com</p>
                  <p className="text-xs text-gray-500 mt-1">24時間受付</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">電話</h3>
                  <p className="text-gray-600 text-sm">03-1234-5678</p>
                  <p className="text-xs text-gray-500 mt-1">平日 10:00-18:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">所在地</h3>
                  <p className="text-gray-600 text-sm">
                    〒150-0001<br />
                    東京都渋谷区神宮前1-1-1
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">営業時間</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex justify-between">
                  <span>平日</span>
                  <span className="font-medium">10:00 - 18:00</span>
                </li>
                <li className="flex justify-between">
                  <span>土日祝</span>
                  <span className="font-medium text-gray-500">休業</span>
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                ※メールでのお問い合わせは24時間受付しております
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      会社名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="株式会社○○"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      お名前 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="山田 太郎"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      メールアドレス <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="example@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="03-1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    お問い合わせ種別 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  >
                    <option value="general">一般的なお問い合わせ</option>
                    <option value="sales">導入・見積もりのご相談</option>
                    <option value="support">技術サポート</option>
                    <option value="partnership">提携・協業のご相談</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    お問い合わせ内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                    placeholder="お問い合わせ内容をご記入ください"
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                  <p className="mb-2">ご記入いただいた個人情報は、お問い合わせ対応のみに使用いたします。</p>
                  <p>詳しくは<Link to="/privacy" className="text-primary-600 hover:underline">プライバシーポリシー</Link>をご確認ください。</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      送信する
                    </>
                  )}
                </button>
              </form>
            </div>
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
