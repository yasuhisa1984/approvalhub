import { useState } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockFormTemplates } from '../data/formTemplates'
import { FormTemplate, FormField, FormData } from '../types/form'
import DynamicForm from './DynamicForm'

export default function ApprovalCreateWithTemplate() {
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleTemplateSelect = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setFormData({})
  }

  const handleSubmit = (data: FormData) => {
    console.log('申請作成:', {
      template: selectedTemplate?.name,
      routeId: selectedRouteId,
      data,
    })

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setSelectedTemplate(null)
      setSelectedRouteId(null)
      setFormData({})
    }, 2000)
  }

  const mockRoutes = [
    { id: 1, name: '契約書承認フロー', steps: 2 },
    { id: 2, name: '経費申請フロー', steps: 3 },
    { id: 3, name: '人事施策承認フロー', steps: 3 },
    { id: 4, name: '簡易承認フロー', steps: 1 },
  ]

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
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">新規申請作成（テンプレート）</h2>
          <p className="text-sm text-gray-600 mt-1">
            フォームテンプレートを選択して申請を作成します
          </p>
        </div>
      </div>

      {/* Template Selection */}
      {!selectedTemplate ? (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              フォームテンプレートを選択
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockFormTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{template.fields.length}項目</span>
                      <span>•</span>
                      <span>{template.fields.filter((f) => f.required).length}必須</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Or Custom Form */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">または</p>
            <Link
              to="/approvals/create"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              カスタムフォームで作成
            </Link>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="space-y-6">
          {/* Template Info */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center gap-3">
            <div className="text-2xl">{selectedTemplate.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-primary-900">{selectedTemplate.name}</h3>
              <p className="text-sm text-primary-700">{selectedTemplate.description}</p>
            </div>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              変更
            </button>
          </div>

          {/* Route Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              承認ルート <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {mockRoutes.map((route) => (
                <label
                  key={route.id}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedRouteId === route.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="route"
                    value={route.id}
                    checked={selectedRouteId === route.id}
                    onChange={() => setSelectedRouteId(route.id)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{route.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({route.steps}段階承認)
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Dynamic Form */}
          <DynamicForm
            fields={selectedTemplate.fields}
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            routeSelected={selectedRouteId !== null}
          />
        </div>
      )}
    </div>
  )
}
