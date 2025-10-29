// Stripe決済サービス

export interface CreateCheckoutSessionRequest {
  plan: 'pro' | 'enterprise'
  tenantId: number
  successUrl?: string
  cancelUrl?: string
}

export interface CreateCheckoutSessionResponse {
  sessionId: string
  url: string
}

/**
 * Stripe Checkoutセッションを作成
 */
export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> {
  // 本番環境ではバックエンドAPIを呼び出し
  const response = await fetch('/api/payment/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify({
      plan: request.plan,
      tenantId: request.tenantId,
      successUrl: request.successUrl || `${window.location.origin}/payment/success`,
      cancelUrl: request.cancelUrl || `${window.location.origin}/payment/cancelled`,
    }),
  })

  if (!response.ok) {
    throw new Error('決済セッションの作成に失敗しました')
  }

  return response.json()
}

/**
 * Stripe Checkoutにリダイレクト
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  // 本番環境では実際のStripe.jsを使用
  // const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!)
  // await stripe.redirectToCheckout({ sessionId })

  // デモ実装：成功ページにリダイレクト
  console.log('Redirecting to Stripe Checkout:', sessionId)
  setTimeout(() => {
    window.location.href = '/payment/success'
  }, 2000)
}

/**
 * サブスクリプション情報を取得
 */
export async function getSubscription(tenantId: number) {
  // 本番環境ではバックエンドAPIを呼び出し
  const response = await fetch(`/api/tenants/${tenantId}/subscription`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  })

  if (!response.ok) {
    throw new Error('サブスクリプション情報の取得に失敗しました')
  }

  return response.json()
}

/**
 * サブスクリプションをキャンセル
 */
export async function cancelSubscription(tenantId: number) {
  const response = await fetch(`/api/tenants/${tenantId}/subscription/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
  })

  if (!response.ok) {
    throw new Error('サブスクリプションのキャンセルに失敗しました')
  }

  return response.json()
}
