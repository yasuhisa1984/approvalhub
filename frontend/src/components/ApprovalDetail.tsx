import { useState } from 'react'
import { ArrowLeft, CheckCircle, XCircle, User, Clock, MessageSquare, Send, Paperclip } from 'lucide-react'
import { mockApprovalDetail } from '../data/mockData'
import { getCommentsForApproval } from '../data/commentData'
import { Comment } from '../types/comment'

export default function ApprovalDetail() {
  const [approval] = useState(mockApprovalDetail)
  const [comment, setComment] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [comments, setComments] = useState<Comment[]>(getCommentsForApproval(approval.id))
  const [newComment, setNewComment] = useState('')

  const handleApprove = () => {
    console.log('承認:', comment)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleReject = () => {
    console.log('差し戻し:', comment)
    alert('差し戻しました')
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        approvalId: approval.id,
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
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">承認詳細</h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Title Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{approval.title}</h3>
            <StatusBadge status={approval.status} />
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">{approval.description}</p>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-6">
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
        <div className="p-6 border-b border-gray-200">
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
        <div className="p-6 border-b border-gray-200">
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

        {/* Action Section */}
        {approval.status === 'pending' && (
          <div className="p-6 bg-gray-50">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  承認する
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  差し戻す
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
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
                <div key={c.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {c.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {c.userName}
                        </span>
                        <span className="text-xs text-gray-500">{c.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {c.content}
                      </p>
                      {c.attachments && c.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {c.attachments.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span>{file.name}</span>
                              <span className="text-xs text-gray-500">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-between items-center">
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4" />
                ファイル添付
              </button>
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
