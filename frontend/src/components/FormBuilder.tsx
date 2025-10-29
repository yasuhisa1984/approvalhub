import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react'
import { FormTemplate, FormField, FieldType } from '../types/form'

interface FormBuilderProps {
  template: FormTemplate | null
  onSave: (template: FormTemplate) => void
  onCancel: () => void
}

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'テキスト',
  number: '数値',
  textarea: '複数行テキスト',
  date: '日付',
  select: '選択（ドロップダウン）',
  radio: 'ラジオボタン',
  checkbox: 'チェックボックス',
  file: 'ファイル',
}

const fieldTypeIcons: Record<FieldType, string> = {
  text: '📝',
  number: '🔢',
  textarea: '📄',
  date: '📅',
  select: '📋',
  radio: '◉',
  checkbox: '☑',
  file: '📎',
}

export default function FormBuilder({ template, onSave, onCancel }: FormBuilderProps) {
  const [name, setName] = useState(template?.name || '')
  const [description, setDescription] = useState(template?.description || '')
  const [icon, setIcon] = useState(template?.icon || '📝')
  const [fields, setFields] = useState<FormField[]>(template?.fields || [])
  const [showSuccess, setShowSuccess] = useState(false)

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: '',
      required: false,
      ...(type === 'select' || type === 'radio' || type === 'checkbox'
        ? { options: [{ label: '選択肢1', value: 'option1' }] }
        : {}),
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
  }

  const moveField = (id: string, direction: 'up' | 'down') => {
    const index = fields.findIndex((f) => f.id === id)
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === fields.length - 1)) {
      return
    }

    const newFields = [...fields]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
    setFields(newFields)
  }

  const handleSave = () => {
    const newTemplate: FormTemplate = {
      id: template?.id || Date.now(),
      name,
      description,
      icon,
      fields,
      isActive: true,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setShowSuccess(true)
    setTimeout(() => {
      onSave(newTemplate)
    }, 1000)
  }

  const isValid = name.trim() && description.trim() && fields.length > 0

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Save className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            フォームテンプレートを保存しました！
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {template ? 'テンプレート編集' : '新規テンプレート作成'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            フォームの項目を追加・編集します
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">基本情報</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                アイコン
              </label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-2xl text-center"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テンプレート名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 契約書承認フォーム"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="このテンプレートの用途"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              />
            </div>
          </div>

          {/* Field Types */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">項目を追加</h3>
            <div className="space-y-2">
              {(Object.keys(fieldTypeLabels) as FieldType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => addField(type)}
                  className="w-full flex items-center gap-3 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <span className="text-xl">{fieldTypeIcons[type]}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {fieldTypeLabels[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Field List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            フォーム項目 ({fields.length})
          </h3>

          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">フォーム項目がありません</p>
              <p className="text-sm">左側から項目を追加してください</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  index={index}
                  total={fields.length}
                  onUpdate={(updates) => updateField(field.id, updates)}
                  onRemove={() => removeField(field.id)}
                  onMove={(direction) => moveField(field.id, direction)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3 sticky bottom-4 bg-white p-4 rounded-lg border border-gray-200 shadow-lg">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${
            isValid ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          保存
        </button>
      </div>
    </div>
  )
}

interface FieldEditorProps {
  field: FormField
  index: number
  total: number
  onUpdate: (updates: Partial<FormField>) => void
  onRemove: () => void
  onMove: (direction: 'up' | 'down') => void
}

function FieldEditor({ field, index, total, onUpdate, onRemove, onMove }: FieldEditorProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-start gap-3">
        {/* Move Buttons */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === total - 1}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Field Icon */}
        <div className="text-2xl">{fieldTypeIcons[field.type]}</div>

        {/* Field Settings */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              placeholder="項目名を入力"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            />
            <span className="text-xs text-gray-500">{fieldTypeLabels[field.type]}</span>
          </div>

          {(field.type === 'text' || field.type === 'textarea' || field.type === 'number') && (
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => onUpdate({ placeholder: e.target.value })}
              placeholder="プレースホルダー（任意）"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <span className="text-sm text-gray-700">必須項目</span>
          </label>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
