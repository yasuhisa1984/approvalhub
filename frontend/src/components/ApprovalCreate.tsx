import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Upload, X, Loader } from 'lucide-react'
import { approvalApi } from '../lib/api'
import { FormTemplate, FormData } from '../types/form'
import { mockFormTemplates } from '../data/formTemplates'

interface ApprovalRouteStep {
  step_order: number
  approver_id: number
  approver_name: string
  is_required: boolean
}

interface ApprovalRoute {
  id: number
  name: string
  description: string
  step_count: number
  steps: ApprovalRouteStep[]
}

export default function ApprovalCreate() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [files, setFiles] = useState<File[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [routes, setRoutes] = useState<ApprovalRoute[]>([])
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)

  // 承認ルート一覧を取得
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setIsLoadingRoutes(true)
        const data = await approvalApi.getApprovalRoutes()
        setRoutes(data)
      } catch (err) {
        console.error('承認ルート取得失敗:', err)
        setError('承認ルートの取得に失敗しました')
      } finally {
        setIsLoadingRoutes(false)
      }
    }
    fetchRoutes()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleTemplateSelect = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setFormData({}) // テンプレート変更時にフォームデータをリセット
    setTitle(template.name) // テンプレート名を申請タイトルに自動設定
  }

  const handleFormDataChange = (fieldId: string, value: string | string[] | File | File[]) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // テンプレート選択時は説明任意、未選択時は説明必須
    const isDescriptionRequired = !selectedTemplate
    if (!title.trim() || (isDescriptionRequired && !description.trim()) || !selectedRoute) {
      setError('すべての必須項目を入力してください')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // API呼び出し
      const response = await approvalApi.createApproval({
        title: title.trim(),
        description: description.trim(),
        route_id: selectedRoute,
        form_data: selectedTemplate ? formData : undefined,
        template_id: selectedTemplate?.id,
        attachments: files,
      })

      console.log('申請作成成功:', response)

      setShowSuccess(true)

      // 2秒後に作成した申請の詳細ページへリダイレクト
      setTimeout(() => {
        if (response.approval_id) {
          navigate(`/approvals/${response.approval_id}`)
        } else {
          navigate('/')
        }
      }, 2000)
    } catch (err) {
      console.error('申請作成失敗:', err)
      setError('申請の作成に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedRouteData = routes.find((r) => r.id === selectedRoute)
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <X className="w-5 h-5 text-red-600" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoadingRoutes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <Loader className="w-5 h-5 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-blue-800">
            承認ルートを読み込み中...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">新規申請作成</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            承認が必要な申請を作成します
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            申請タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={selectedTemplate ? "テンプレート選択時に自動入力されます" : "例: 新規取引先との業務委託契約"}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            required
          />
          {selectedTemplate && (
            <p className="text-xs text-gray-500 mt-2">
              ※ テンプレート選択時は自動で入力されます（編集可能）
            </p>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            申請内容 {!selectedTemplate && <span className="text-red-500">*</span>}
            {selectedTemplate && <span className="text-gray-500">(任意)</span>}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={selectedTemplate
              ? "テンプレートの項目で入力した内容が申請内容となります。追加で記載したい内容があればここに入力してください。"
              : "承認依頼の詳細を記入してください&#10;&#10;例:&#10;株式会社サンプルとの業務委託契約書の承認をお願いします。&#10;契約金額: 年間300万円&#10;契約期間: 2025年4月〜2026年3月"}
            rows={selectedTemplate ? 4 : 8}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
            required={!selectedTemplate}
          />
          <p className="text-xs text-gray-500 mt-2">
            {selectedTemplate
              ? "※ テンプレート選択時は任意です"
              : "承認者が判断しやすいよう、具体的に記載してください"}
          </p>
        </div>

        {/* Route Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            承認ルート <span className="text-red-500">*</span>
          </label>
          {isLoadingRoutes ? (
            <div className="text-center py-8 text-gray-500">
              <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm">承認ルートを読み込み中...</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">承認ルートが見つかりません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {routes.map((route) => (
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
                        {route.step_count}段階承認
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {route.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Form Template Selection */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            フォームテンプレート <span className="text-gray-500">(任意)</span>
          </label>
          <p className="text-xs text-gray-600 mb-4">
            申請内容に応じたテンプレートを選択すると、必要な項目が自動的に表示されます
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mockFormTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <div className="font-semibold text-sm text-gray-900">{template.name}</div>
                <div className="text-xs text-gray-600 mt-1">{template.description}</div>
              </button>
            ))}
          </div>
          {selectedTemplate && (
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate(null)
                setFormData({})
                setTitle('') // タイトルもクリア
              }}
              className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              テンプレートをクリア
            </button>
          )}
        </div>

        {/* Dynamic Form Fields */}
        {selectedTemplate && selectedTemplate.fields && selectedTemplate.fields.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {selectedTemplate.icon} {selectedTemplate.name}の詳細情報
            </h3>
            <div className="space-y-4">
              {selectedTemplate.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {/* Text Input */}
                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  )}

                  {/* Number Input */}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      min={field.validation?.min}
                      max={field.validation?.max}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  )}

                  {/* Textarea */}
                  {field.type === 'textarea' && (
                    <textarea
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
                    />
                  )}

                  {/* Date Input */}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    />
                  )}

                  {/* Select */}
                  {field.type === 'select' && field.options && (
                    <select
                      value={(formData[field.id] as string) || ''}
                      onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="">選択してください</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Radio */}
                  {field.type === 'radio' && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={field.id}
                            value={option.value}
                            checked={(formData[field.id] as string) === option.value}
                            onChange={(e) => handleFormDataChange(field.id, e.target.value)}
                            required={field.required}
                            className="w-4 h-4 text-primary-600"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* File Input */}
                  {field.type === 'file' && (
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFormDataChange(field.id, e.target.files[0])
                        }
                      }}
                      required={field.required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            添付ファイル <span className="text-gray-500">(任意)</span>
          </label>

          {/* Upload Button */}
          <label className="flex items-center justify-center gap-2 p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
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
        {selectedRouteData && selectedRouteData.steps && selectedRouteData.steps.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-primary-900 mb-3">
              📋 承認フロー
            </h3>
            <div className="overflow-x-auto -mx-2 px-2">
              <div className="flex items-center gap-2 min-w-max">
                {selectedRouteData.steps.map((step, i) => (
                  <div key={step.step_order} className="flex items-center">
                    <div className="px-3 sm:px-4 py-2 bg-white border border-primary-300 rounded-lg text-xs sm:text-sm whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {step.approver_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {step.step_order}段階目
                      </div>
                    </div>
                    {i < selectedRouteData.steps.length - 1 && (
                      <div className="w-6 sm:w-8 h-0.5 bg-primary-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            disabled={isSubmitting}
            className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
              isValid && !isSubmitting
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                作成中...
              </>
            ) : (
              '申請を作成'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
