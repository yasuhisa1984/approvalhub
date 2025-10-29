<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Payment;

use BEAR\Resource\ResourceObject;

class CreateCheckoutSession extends ResourceObject
{
    /**
     * POST /payment/create-checkout-session
     * Stripe Checkout セッションを作成
     *
     * @param array{plan: string, tenantId: int, successUrl: string, cancelUrl: string} $body
     */
    public function onPost(array $body): static
    {
        // バリデーション
        if (empty($body['plan']) || empty($body['tenantId'])) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'プランとテナントIDは必須です',
                ],
            ];

            return $this;
        }

        $validPlans = ['pro', 'enterprise'];
        if (! in_array($body['plan'], $validPlans, true)) {
            $this->code = 400;
            $this->body = [
                'error' => [
                    'code' => 'INVALID_PLAN',
                    'message' => '無効なプランです',
                ],
            ];

            return $this;
        }

        // Stripe Checkout セッションを作成
        // 本番環境では Stripe SDK を使用
        // composer require stripe/stripe-php
        // \Stripe\Stripe::setApiKey(getenv('STRIPE_SECRET_KEY'));

        $priceId = $this->getPriceIdByPlan($body['plan']);
        $sessionId = $this->createStripeSession($priceId, $body['tenantId'], $body['successUrl'] ?? '', $body['cancelUrl'] ?? '');

        $this->code = 200;
        $this->body = [
            'sessionId' => $sessionId,
            'url' => 'https://checkout.stripe.com/pay/' . $sessionId,
        ];

        return $this;
    }

    private function getPriceIdByPlan(string $plan): string
    {
        // 本番環境ではStripeで作成したPrice IDを使用
        return match ($plan) {
            'pro' => 'price_pro_monthly_19800',
            'enterprise' => 'price_enterprise_monthly_98000',
            default => '',
        };
    }

    private function createStripeSession(string $priceId, int $tenantId, string $successUrl, string $cancelUrl): string
    {
        // デモ実装
        // 本番環境では以下のように実装:
        /*
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
            'client_reference_id' => (string) $tenantId,
            'metadata' => [
                'tenant_id' => $tenantId,
            ],
            'subscription_data' => [
                'trial_period_days' => 14,
            ],
        ]);

        return $session->id;
        */

        return 'cs_test_' . bin2hex(random_bytes(32));
    }
}
