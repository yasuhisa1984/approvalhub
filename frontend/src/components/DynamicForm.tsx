import { useState } from 'react'
import { FormField, FormData } from '../types/form'

interface DynamicFormProps {
  fields: FormField[]
  formData: FormData
  onChange: (data: FormData) => void
  onSubmit: (data: FormData) => void
  routeSelected: boolean
}

export default function DynamicForm({
  fields,
  formData,
  onChange,
  onSubmit,
  routeSelected,
}: DynamicFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange({ ...formData, [fieldId]: value })
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: '' })
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label}は必須項目です`
      }

      if (field.type === 'number' && formData[field.id]) {
        const value = Number(formData[field.id])
        if (field.validation?.min !== undefined && value < field.validation.min) {
          newErrors[field.id] = `${field.validation.min}以上の値を入力してください`
        }
        if (field.validation?.max !== undefined && value > field.validation.max) {
          newErrors[field.id] = `${field.validation.max}以下の値を入力してください`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate() && routeSelected) {
      onSubmit(formData)
    }
  }

  const isValid = routeSelected && fields.every((field) => !field.required || formData[field.id])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fields */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900">申請内容</h3>

        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Text Input */}
            {field.type === 'text' && (
              <input
                type="text"
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors[field.id] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}

            {/* Number Input */}
            {field.type === 'number' && (
              <input
                type="number"
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors[field.id] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}

            {/* Textarea */}
            {field.type === 'textarea' && (
              <textarea
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                  errors[field.id] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}

            {/* Date Input */}
            {field.type === 'date' && (
              <input
                type="date"
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors[field.id] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}

            {/* Select Dropdown */}
            {field.type === 'select' && (
              <select
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors[field.id] ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">選択してください</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {/* Radio Buttons */}
            {field.type === 'radio' && (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={field.id}
                      value={option.value}
                      checked={formData[field.id] === option.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Checkbox */}
            {field.type === 'checkbox' && (
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={
                        Array.isArray(formData[field.id]) &&
                        (formData[field.id] as string[]).includes(option.value)
                      }
                      onChange={(e) => {
                        const currentValues = (formData[field.id] as string[]) || []
                        const newValues = e.target.checked
                          ? [...currentValues, option.value]
                          : currentValues.filter((v) => v !== option.value)
                        handleFieldChange(field.id, newValues)
                      }}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-gray-900">{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* File Upload */}
            {field.type === 'file' && (
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFieldChange(field.id, file)
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors[field.id] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}

            {/* Error Message */}
            {errors[field.id] && (
              <p className="text-sm text-red-500 mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
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
  )
}
