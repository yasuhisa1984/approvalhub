import { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Calendar,
  Trash2,
  Edit,
  Upload,
  Download,
  Loader,
} from 'lucide-react'
import { mockDepartments, roleLabels, roleBadgeColors } from '../data/teamData'
import { TeamMember, MemberRole } from '../types/team'
import { userApi } from '../lib/api'

// テナント情報（モック）
const mockTeam = {
  name: 'デモ株式会社',
  description: 'ワークフロー承認システムを運用中',
  plan: 'Business',
  memberCount: 0,
  maxMembers: 100,
  createdAt: '2025-01-01',
}

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<MemberRole | 'all'>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showCsvImportModal, setShowCsvImportModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const usersResponse = await userApi.getUsers()

        // APIレスポンスをTeamMember型にマッピング
        const mappedMembers: TeamMember[] = (usersResponse || []).map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as MemberRole,
          department: user.department || '未設定',
          position: user.position || '未設定',
          joinedAt: user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          isActive: true,
        }))

        setMembers(mappedMembers)
      } catch (err) {
        console.error('Failed to fetch team members:', err)
        setError('チームメンバーの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment

    return matchesSearch && matchesRole && matchesDepartment && member.isActive
  })

  const handleInviteMember = async (email: string, role: MemberRole, department: string) => {
    try {
      const newUser = await userApi.createUser({
        name: email.split('@')[0],
        email,
        password: 'temporary123', // 仮パスワード（後でパスワードリセット機能で変更）
        role,
      })

      const newMember: TeamMember = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as MemberRole,
        department,
        position: '未設定',
        joinedAt: new Date().toISOString().split('T')[0],
        isActive: true,
      }

      setMembers([...members, newMember])
      setShowInviteModal(false)
    } catch (err) {
      console.error('Failed to invite member:', err)
      alert('メンバーの招待に失敗しました')
    }
  }

  const handleRemoveMember = async (id: number) => {
    if (!window.confirm('このメンバーを削除しますか？')) {
      return
    }

    try {
      await userApi.deleteUser(id)
      setMembers(members.filter((m) => m.id !== id))
    } catch (err) {
      console.error('Failed to remove member:', err)
      alert('メンバーの削除に失敗しました')
    }
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // エラー表示
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          再読み込み
        </button>
      </div>
    )
  }

  const handleDownloadTemplate = () => {
    const csvContent = 'name,email,role,department,position\n田中太郎,tanaka@example.com,member,営業部,営業担当\n'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'team_members_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCsvImport = async (csvData: Array<{
    name: string
    email: string
    role: MemberRole
    department: string
    position: string
  }>) => {
    try {
      // 各ユーザーを順番に作成
      const createdUsers = []
      for (const data of csvData) {
        const newUser = await userApi.createUser({
          name: data.name,
          email: data.email,
          password: 'temporary123', // 仮パスワード
          role: data.role,
        })
        createdUsers.push({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as MemberRole,
          department: data.department,
          position: data.position,
          joinedAt: new Date().toISOString().split('T')[0],
          isActive: true,
        })
      }

      setMembers([...members, ...createdUsers])
      setShowCsvImportModal(false)
    } catch (err) {
      console.error('Failed to import CSV:', err)
      alert('CSVインポートに失敗しました')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">チーム管理</h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">メンバーの招待や権限管理を行います</p>
      </div>

      {/* Team Info Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">{mockTeam.name}</h3>
            <p className="text-sm sm:text-base text-primary-100">{mockTeam.description}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{mockTeam.memberCount}名のメンバー</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>作成日: {mockTeam.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">メンバーを招待</span>
              <span className="sm:hidden">招待</span>
            </button>
            <button
              onClick={() => setShowCsvImportModal(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors whitespace-nowrap"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden sm:inline">CSV一括登録</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="名前、メール、部署で検索"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as MemberRole | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべての権限</option>
            <option value="admin">管理者</option>
            <option value="manager">マネージャー</option>
            <option value="member">メンバー</option>
          </select>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">すべての部署</option>
            {mockDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  メンバー
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  部署
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  役職
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  権限
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  参加日
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{member.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{member.position}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        roleBadgeColors[member.role]
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {roleLabels[member.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{member.joinedAt}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        disabled={member.role === 'admin'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>メンバーが見つかりませんでした</p>
          </div>
        )}
      </div>

      {/* Members Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>メンバーが見つかりませんでした</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500 truncate">{member.email}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        roleBadgeColors[member.role]
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {roleLabels[member.role]}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <p className="text-xs text-gray-500">部署</p>
                  <p className="font-medium text-gray-900">{member.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">役職</p>
                  <p className="font-medium text-gray-900">{member.position}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">参加日</p>
                  <p className="font-medium text-gray-900">{member.joinedAt}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setSelectedMember(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  編集
                </button>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  disabled={member.role === 'admin'}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  削除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInviteMember}
          departments={mockDepartments}
        />
      )}

      {/* Edit Member Modal */}
      {selectedMember && (
        <EditMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onSave={(updated) => {
            setMembers(members.map((m) => (m.id === updated.id ? updated : m)))
            setSelectedMember(null)
          }}
          departments={mockDepartments}
        />
      )}

      {/* CSV Import Modal */}
      {showCsvImportModal && (
        <CsvImportModal
          onClose={() => setShowCsvImportModal(false)}
          onImport={handleCsvImport}
          onDownloadTemplate={handleDownloadTemplate}
        />
      )}
    </div>
  )
}

interface InviteModalProps {
  onClose: () => void
  onInvite: (email: string, role: MemberRole, department: string) => void
  departments: string[]
}

function InviteModal({ onClose, onInvite, departments }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [department, setDepartment] = useState(departments[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onInvite(email, role, department)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">メンバーを招待</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@company.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">権限</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="member">メンバー</option>
              <option value="manager">マネージャー</option>
              <option value="admin">管理者</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部署</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              招待を送信
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface EditMemberModalProps {
  member: TeamMember
  onClose: () => void
  onSave: (member: TeamMember) => void
  departments: string[]
}

function EditMemberModal({ member, onClose, onSave, departments }: EditMemberModalProps) {
  const [name, setName] = useState(member.name)
  const [position, setPosition] = useState(member.position)
  const [role, setRole] = useState(member.role)
  const [department, setDepartment] = useState(member.department)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...member,
      name,
      position,
      role,
      department,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">メンバー情報を編集</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">役職</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">権限</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="member">メンバー</option>
              <option value="manager">マネージャー</option>
              <option value="admin">管理者</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部署</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface CsvImportModalProps {
  onClose: () => void
  onImport: (data: Array<{
    name: string
    email: string
    role: MemberRole
    department: string
    position: string
  }>) => void
  onDownloadTemplate: () => void
}

function CsvImportModal({ onClose, onImport, onDownloadTemplate }: CsvImportModalProps) {
  const [_file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [error, setError] = useState<string>('')
  const [importing, setImporting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      setError('CSVファイルを選択してください')
      return
    }

    setFile(selectedFile)
    setError('')

    // CSVファイルを読み込む
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      parseCSV(text)
    }
    reader.readAsText(selectedFile)
  }

  const parseCSV = (text: string) => {
    try {
      const lines = text.trim().split('\n')
      if (lines.length < 2) {
        setError('CSVファイルにデータが含まれていません')
        return
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const requiredHeaders = ['name', 'email', 'role', 'department', 'position']

      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
      if (missingHeaders.length > 0) {
        setError(`必須カラムが不足しています: ${missingHeaders.join(', ')}`)
        return
      }

      const data = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length !== headers.length) continue

        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })

        // バリデーション
        if (!row.name || !row.email || !row.role || !row.department || !row.position) {
          setError(`${i}行目: すべてのカラムを入力してください`)
          return
        }

        if (!['admin', 'manager', 'member'].includes(row.role)) {
          setError(`${i}行目: roleは admin, manager, member のいずれかである必要があります`)
          return
        }

        data.push(row)
      }

      setPreview(data)
      setError('')
    } catch (err) {
      setError('CSVファイルの解析に失敗しました')
    }
  }

  const handleImport = () => {
    if (preview.length === 0) {
      setError('インポートするデータがありません')
      return
    }

    setImporting(true)
    // 実際のAPIコールをシミュレート
    setTimeout(() => {
      onImport(preview)
      setImporting(false)
    }, 500)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">CSV一括インポート</h3>

        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-900 mb-2">
              <strong>CSVフォーマット:</strong> name, email, role, department, position
            </p>
            <p className="text-xs text-blue-700 mb-3">
              role: admin (管理者) / manager (マネージャー) / member (メンバー)
            </p>
            <button
              onClick={onDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              テンプレートをダウンロード
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CSVファイルを選択 <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {preview.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              プレビュー ({preview.length}件)
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">名前</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">メール</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">権限</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">部署</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">役職</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {preview.slice(0, 5).map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-900">{row.name}</td>
                      <td className="px-3 py-2 text-gray-600">{row.email}</td>
                      <td className="px-3 py-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {row.role}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-900">{row.department}</td>
                      <td className="px-3 py-2 text-gray-900">{row.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 5 && (
                <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 text-center">
                  他 {preview.length - 5}件
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0 || importing}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {importing ? 'インポート中...' : `${preview.length}件をインポート`}
          </button>
        </div>
      </div>
    </div>
  )
}
