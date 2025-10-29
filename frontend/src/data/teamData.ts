import { TeamMember, Team } from '../types/team'

export const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: '山田太郎',
    email: 'yamada@example.com',
    role: 'admin',
    department: '経営企画',
    position: '部長',
    joinedAt: '2024-01-15',
    isActive: true,
  },
  {
    id: 2,
    name: '佐藤花子',
    email: 'sato@example.com',
    role: 'manager',
    department: '営業部',
    position: 'マネージャー',
    joinedAt: '2024-02-01',
    isActive: true,
  },
  {
    id: 3,
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    role: 'member',
    department: '開発部',
    position: 'エンジニア',
    joinedAt: '2024-03-10',
    isActive: true,
  },
  {
    id: 4,
    name: '田中美咲',
    email: 'tanaka@example.com',
    role: 'member',
    department: '人事部',
    position: 'スタッフ',
    joinedAt: '2024-03-15',
    isActive: true,
  },
  {
    id: 5,
    name: '伊藤健太',
    email: 'ito@example.com',
    role: 'manager',
    department: '財務部',
    position: 'マネージャー',
    joinedAt: '2024-04-01',
    isActive: true,
  },
  {
    id: 6,
    name: '渡辺由美',
    email: 'watanabe@example.com',
    role: 'member',
    department: '営業部',
    position: '営業',
    joinedAt: '2024-04-20',
    isActive: true,
  },
  {
    id: 7,
    name: '中村誠',
    email: 'nakamura@example.com',
    role: 'member',
    department: '開発部',
    position: 'エンジニア',
    joinedAt: '2024-05-01',
    isActive: true,
  },
  {
    id: 8,
    name: '小林麻衣',
    email: 'kobayashi@example.com',
    role: 'member',
    department: '営業部',
    position: '営業',
    joinedAt: '2024-05-15',
    isActive: false,
  },
]

export const mockTeam: Team = {
  id: 1,
  name: '株式会社サンプル',
  description: 'サンプル企業のチームアカウント',
  memberCount: mockTeamMembers.filter(m => m.isActive).length,
  createdAt: '2024-01-01',
  owner: mockTeamMembers[0],
}

export const mockDepartments = [
  '経営企画',
  '営業部',
  '開発部',
  '人事部',
  '財務部',
  '総務部',
  'マーケティング部',
]

export const roleLabels = {
  admin: '管理者',
  manager: 'マネージャー',
  member: 'メンバー',
}

export const roleBadgeColors = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-blue-100 text-blue-800',
  member: 'bg-gray-100 text-gray-800',
}
