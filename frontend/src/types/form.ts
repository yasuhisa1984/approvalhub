// フォームフィールドの型定義

export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'

export interface FieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: FieldOption[]  // select, radio, checkbox用
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface FormTemplate {
  id: number
  name: string
  description: string
  icon: string
  fields: FormField[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FormData {
  [fieldId: string]: string | string[] | File | File[]
}
