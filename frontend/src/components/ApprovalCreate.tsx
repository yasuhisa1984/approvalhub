import { useState } from 'react'
import { ArrowLeft, CheckCircle, Upload, X } from 'lucide-react'

interface ApprovalRoute {
  id: number
  name: string
  description: string
  steps: number
}

const mockRoutes: ApprovalRoute[] = [
  {
    id: 1,
    name: '契約書承認フロー',
    description: '新規取引先との契約書用 (2段階承認)',
    steps: 2,
  },
  {
    id: 2,
    name: '経費申請フロー',
    description: '10万円以上の経費申請用 (3段階承認)',
    steps: 3,
  },
  {
    id: 3,
    name: '人事施策承認フロー',
    description: '採用・異動・昇格等の人事関連 (3段階承認)',
    steps: 3,
  },
  {
    id: 4,
    name: '簡易承認フロー',
    description: '10万円未満の少額経費用 (1段階承認)',
    steps: 1,
  },
]

export default function ApprovalCreate() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('申請作成:', { title, description, selectedRoute, files })
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      // Reset form
      setTitle('')
      setDescription('')
      setSelectedRoute(null)
      setFiles([])
    }, 2000)
  }

  const selectedRouteData = mockRoutes.find((r) => r.id === selectedRoute)
  const isValid = title.trim() && description.trim() && selectedRoute

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            申請を作成しました！承認者に通知が送信されました。
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">新規申請作成</h2>
          <p className="text-sm text-gray-600 mt-1">
            承認が必要な申請を作成します
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            申請タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 新規取引先との業務委託契約"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            申請内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="承認依頼の詳細を記入してください&#10;&#10;例:&#10;株式会社サンプルとの業務委託契約書の承認をお願いします。&#10;契約金額: 年間300万円&#10;契約期間: 2025年4月〜2026年3月"
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-2">
            承認者が判断しやすいよう、具体的に記載してください
          </p>
        </div>

        {/* Route Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            承認ルート <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {mockRoutes.map((route) => (
              <label
                key={route.id}
                className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedRoute === route.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="route"
                  value={route.id}
                  checked={selectedRoute === route.id}
                  onChange={() => setSelectedRoute(route.id)}
                  className="mt-1 w-4 h-4 text-primary-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {route.name}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {route.steps}段階承認
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {route.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            添付ファイル <span className="text-gray-500">(任意)</span>
          </label>

          {/* Upload Button */}
          <label className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              ファイルを選択
            </span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary-700">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        {selectedRouteData && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-primary-900 mb-3">
              📋 承認フロー
            </h3>
            <div className="flex items-center gap-2">
              {Array.from({ length: selectedRouteData.steps }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="px-4 py-2 bg-white border border-primary-300 rounded-lg text-sm font-medium text-gray-700">
                    承認者 {i + 1}
                  </div>
                  {i < selectedRouteData.steps - 1 && (
                    <div className="w-8 h-0.5 bg-primary-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isValid
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            申請を作成
          </button>
        </div>
      </form>
    </div>
  )
}
