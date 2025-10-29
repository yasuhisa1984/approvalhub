export interface TeamMember {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'member'
  department: string
  position: string
  joinedAt: string
  avatar?: string
  isActive: boolean
}

export interface Team {
  id: number
  name: string
  description: string
  memberCount: number
  createdAt: string
  owner: TeamMember
}

export type MemberRole = 'admin' | 'manager' | 'member'

export interface InviteMember {
  email: string
  role: MemberRole
  department: string
}
