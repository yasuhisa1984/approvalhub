import { useState } from 'react'
import { Code, Lock, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'
import { apiEndpoints, apiTags } from '../data/apiSpec'

export default function ApiDocs() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set())
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const filteredEndpoints = selectedTag
    ? apiEndpoints.filter((endpoint) => endpoint.tags.includes(selectedTag))
    : apiEndpoints

  const toggleEndpoint = (key: string) => {
    const newSet = new Set(expandedEndpoints)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setExpandedEndpoints(newSet)
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(key)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'POST':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PATCH':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-10 h-10" />
          <h1 className="text-3xl font-bold">ApprovalHub API</h1>
        </div>
        <p className="text-primary-100 text-lg mb-4">
          RESTful API for ApprovalHub - 承認ワークフローシステム
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="px-3 py-1 bg-white/20 rounded-full">v1.0.0</div>
          <div>Base URL: <code className="bg-white/20 px-2 py-1 rounded">https://api.approvalhub.com</code></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Tags */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">カテゴリ</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedTag(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedTag === null
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                すべて ({apiEndpoints.length})
              </button>
              {apiTags.map((tag) => {
                const count = apiEndpoints.filter((e) => e.tags.includes(tag)).length
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedTag === tag
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                )
              })}
            </div>

            {/* Authentication Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">認証</h4>
              <p className="text-xs text-gray-600 mb-3">
                ほとんどのエンドポイントはJWT認証が必要です
              </p>
              <div className="bg-gray-50 rounded p-3">
                <code className="text-xs text-gray-800 break-all">
                  Authorization: Bearer &lt;token&gt;
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Endpoints */}
        <div className="lg:col-span-3 space-y-4">
          {filteredEndpoints.map((endpoint) => {
            const key = `${endpoint.method}-${endpoint.path}`
            const isExpanded = expandedEndpoints.has(key)

            return (
              <div key={key} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Endpoint Header */}
                <button
                  onClick={() => toggleEndpoint(key)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span
                      className={`px-3 py-1 rounded font-mono text-sm font-bold border ${getMethodColor(
                        endpoint.method
                      )}`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                    {endpoint.auth && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{endpoint.summary}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Endpoint Details */}
                {isExpanded && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">説明</h4>
                      <p className="text-sm text-gray-700">{endpoint.description}</p>
                    </div>

                    {/* Parameters */}
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">パラメータ</h4>
                        <div className="bg-white rounded-lg border border-gray-200">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                  名前
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                  位置
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                  型
                                </th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                                  説明
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {endpoint.parameters.map((param, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-3">
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {param.name}
                                    </code>
                                    {param.required && (
                                      <span className="ml-2 text-xs text-red-600">*</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-xs text-gray-600">{param.in}</span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="text-xs text-gray-600">{param.type}</span>
                                  </td>
                                  <td className="px-4 py-3 text-gray-700">
                                    {param.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Request Body */}
                    {endpoint.requestBody && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          リクエストボディ
                        </h4>
                        <div className="bg-gray-900 rounded-lg p-4 relative">
                          <button
                            onClick={() =>
                              copyToClipboard(
                                JSON.stringify(endpoint.requestBody?.properties || {}, null, 2),
                                `req-${key}`
                              )
                            }
                            className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition-colors"
                          >
                            {copiedCode === `req-${key}` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <pre className="text-xs text-gray-300 overflow-x-auto">
                            {JSON.stringify(
                              Object.entries(endpoint.requestBody.properties).reduce(
                                (acc, [key, val]) => ({
                                  ...acc,
                                  [key]: val.type === 'string' ? 'string' : 0,
                                }),
                                {}
                              ),
                              null,
                              2
                            )}
                          </pre>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          {Object.entries(endpoint.requestBody.properties).map(([key, val]) => (
                            <div key={key} className="py-1">
                              <code className="bg-gray-100 px-2 py-0.5 rounded">{key}</code>
                              {val.required && <span className="text-red-600 ml-1">*</span>}:{' '}
                              {val.description}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">レスポンス</h4>
                      <div className="space-y-3">
                        {endpoint.responses.map((response, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div
                              className={`px-4 py-2 flex items-center gap-3 ${
                                response.code >= 200 && response.code < 300
                                  ? 'bg-green-50 border-b border-green-200'
                                  : response.code >= 400
                                  ? 'bg-red-50 border-b border-red-200'
                                  : 'bg-gray-50 border-b border-gray-200'
                              }`}
                            >
                              <span className="font-mono text-sm font-bold">{response.code}</span>
                              <span className="text-sm text-gray-700">{response.description}</span>
                            </div>
                            {response.example && (
                              <div className="bg-gray-900 p-4 relative">
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      JSON.stringify(response.example, null, 2),
                                      `res-${key}-${idx}`
                                    )
                                  }
                                  className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded transition-colors"
                                >
                                  {copiedCode === `res-${key}-${idx}` ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                                <pre className="text-xs text-gray-300 overflow-x-auto">
                                  {JSON.stringify(response.example, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
