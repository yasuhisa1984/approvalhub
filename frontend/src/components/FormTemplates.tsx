import { useState } from 'react'
import { Plus, Edit2, Copy, Trash2, Eye } from 'lucide-react'
import { mockFormTemplates } from '../data/formTemplates'
import { FormTemplate } from '../types/form'
import FormBuilder from './FormBuilder'

export default function FormTemplates() {
  const [templates, setTemplates] = useState<FormTemplate[]>(mockFormTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)

  const handleCreateNew = () => {
    setSelectedTemplate(null)
    setIsBuilderOpen(true)
  }

  const handleEdit = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setIsBuilderOpen(true)
  }

  const handleSave = (template: FormTemplate) => {
    if (selectedTemplate) {
      // 更新
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)))
    } else {
      // 新規作成
      setTemplates([...templates, { ...template, id: Date.now() }])
    }
    setIsBuilderOpen(false)
    setSelectedTemplate(null)
  }

  if (isBuilderOpen) {
    return (
      <FormBuilder
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={() => {
          setIsBuilderOpen(false)
          setSelectedTemplate(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">フォームテンプレート</h2>
          <p className="text-sm text-gray-600 mt-1">
            申請フォームのテンプレートを管理します
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規テンプレート作成
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={() => handleEdit(template)}
          />
        ))}
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: FormTemplate
  onEdit: () => void
}

function TemplateCard({ template, onEdit }: TemplateCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Icon & Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-2xl">
          {template.icon}
        </div>
        {template.isActive ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            有効
          </span>
        ) : (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
            無効
          </span>
        )}
      </div>

      {/* Name & Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{template.description}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{template.fields.length}</span>
          <span>項目</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            {template.fields.filter((f) => f.required).length}
          </span>
          <span>必須</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Edit2 className="w-4 h-4" />
          編集
        </button>
        <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
