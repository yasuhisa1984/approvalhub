import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, User, Clock, MessageSquare, Send, Paperclip, Loader } from 'lucide-react'
import { approvalApi } from '../lib/api'
import { Comment } from '../types/comment'
import { useAuth } from '../contexts/AuthContext'

interface ApprovalDetailType {
  id: number
  title: string
  description: string
  status: string
  current_step: number
  total_steps: number
  route_name: string
  applicant: { id: number; name: string }
  current_approver?: { id: number; name: string }
  created_at: string
  histories: Array<{
    id: number
    user: { name: string }
    comment: string
    created_at: string
  }>
}

export default function ApprovalDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [approval, setApproval] = useState<ApprovalDetailType | null>(null)
  const [comment, setComment] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  // データ取得
  useEffect(() => {
    const fetchApproval = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await approvalApi.getApprovalById(Number(id))
        setApproval(response.data || response)
      } catch (err) {
        console.error('Failed to fetch approval:', err)
        setError('承認情報の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchApproval()
    }
  }, [id])

  const handleApprove = async () => {
    if (!approval) return

    try {
      setIsSubmitting(true)
      await approvalApi.approve(approval.id, comment)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        navigate('/') // ダッシュボードに戻る
      }, 2000)
    } catch (err) {
      console.error('Failed to approve:', err)
      alert('承認に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!approval) return

    if (!comment.trim()) {
      alert('差し戻しの理由を入力してください')
      return
    }

    try {
      setIsSubmitting(true)
      await approvalApi.reject(approval.id, comment)
      alert('差し戻しました')
      navigate('/') // ダッシュボードに戻る
    } catch (err) {
      console.error('Failed to reject:', err)
      alert('差し戻しに失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        approvalId: approval!.id,
        userId: 1,
        userName: 'やっくん隊長',
        content: newComment,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        mentions: [],
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">読み込み中...</span>
      </div>
    )
  }

  // エラー時
  if (error || !approval) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error || '承認情報が見つかりません'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
        >
          ダッシュボードに戻る
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">承認が完了しました！</p>
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
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">承認詳細</h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Title Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">{approval.title}</h3>
            <StatusBadge status={approval.status} />
          </div>
          <p className="text-sm sm:text-base text-gray-600 whitespace-pre-wrap">{approval.description}</p>
        </div>

        {/* Info Section */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <InfoItem
              icon={<User className="w-5 h-5" />}
              label="申請者"
              value={approval.applicant.name}
            />
            <InfoItem
              icon={<Clock className="w-5 h-5" />}
              label="申請日時"
              value={formatDateTime(approval.created_at)}
            />
            <InfoItem
              label="承認ルート"
              value={approval.route_name}
            />
            <InfoItem
              label="現在のステップ"
              value={`${approval.current_step} / ${approval.total_steps}`}
            />
          </div>
        </div>

        {/* Approval Progress */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">承認フロー</h4>
          <div className="space-y-3">
            <ApprovalStep
              stepNumber={1}
              approverName="田中部長"
              status="current"
            />
            <ApprovalStep
              stepNumber={2}
              approverName="やっくん隊長"
              status="pending"
            />
          </div>
        </div>

        {/* History */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">承認履歴</h4>
          <div className="space-y-4">
            {approval.histories.map((history) => (
              <div key={history.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
                  {history.user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {history.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(history.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{history.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section - Only show if not own request */}
        {approval.status === 'pending' && user && approval.applicant.id !== user.id && (
          <div className="p-4 sm:p-6 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">承認アクション</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  コメント (任意)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="承認/差し戻しのコメントを入力してください"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {isSubmitting ? '承認中...' : '承認する'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  {isSubmitting ? '処理中...' : '差し戻す'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              コメント ({comments.length})
            </h3>
          </div>

          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                まだコメントがありません
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base">
                    {c.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {c.userName}
                        </span>
                        <span className="text-xs text-gray-500">{c.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                        {c.content}
                      </p>
                      {c.attachments && c.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {c.attachments.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                            >
                              <Paperclip className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{file.name}</span>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                ({(file.size / 1024 / 1024).toFixed(2)}MB)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              placeholder="コメントを入力... (@でメンション可能)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <button className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4" />
                ファイル添付
              </button>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
              >
                <Send className="w-4 h-4" />
                送信
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
  }

  const labels = {
    pending: '承認待ち',
    approved: '承認済み',
    rejected: '差し戻し',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  )
}

interface InfoItemProps {
  icon?: React.ReactNode
  label: string
  value: string
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

interface ApprovalStepProps {
  stepNumber: number
  approverName: string
  status: 'completed' | 'current' | 'pending'
}

function ApprovalStep({ stepNumber, approverName, status }: ApprovalStepProps) {
  const styles = {
    completed: 'bg-green-100 text-green-700 border-green-300',
    current: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    pending: 'bg-gray-100 text-gray-500 border-gray-300',
  }

  const icons = {
    completed: <CheckCircle className="w-4 h-4" />,
    current: <Clock className="w-4 h-4" />,
    pending: <MessageSquare className="w-4 h-4" />,
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${styles[status]}`}>
      {icons[status]}
      <div className="flex-1">
        <span className="text-sm font-medium">
          Step {stepNumber}: {approverName}
        </span>
      </div>
      {status === 'current' && (
        <span className="text-xs font-semibold">承認待ち</span>
      )}
    </div>
  )
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
