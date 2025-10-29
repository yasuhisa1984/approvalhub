export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'member'
  avatar_url?: string
}

export interface Approval {
  id: number
  title: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
  current_step: number
  total_steps: number
  applicant: User
  current_approver?: User
  route_name: string
  created_at: string
  updated_at: string
}

export interface ApprovalHistory {
  id: number
  user: User
  action: 'approved' | 'rejected' | 'withdrawn' | 'commented'
  comment?: string
  created_at: string
  step_order: number
}

export interface ApprovalDetail extends Approval {
  histories: ApprovalHistory[]
}
