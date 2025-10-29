<?php

declare(strict_types=1);

namespace MyVendor\ApprovalHub\Resource\App\Webhooks;

use BEAR\Resource\ResourceObject;

class Stripe extends ResourceObject
{
    /**
     * POST /webhooks/stripe
     * Stripe Webhook イベントを処理
     */
    public function onPost(): static
    {
        // Webhookペイロードを取得
        $payload = file_get_contents('php://input');
        if ($payload === false) {
            $this->code = 400;
            $this->body = ['error' => 'Invalid payload'];

            return $this;
        }

        $sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

        // Webhook署名を検証
        // 本番環境では実際に検証を行う
        /*
        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sigHeader,
                getenv('STRIPE_WEBHOOK_SECRET')
            );
        } catch (\UnexpectedValueException $e) {
            $this->code = 400;
            $this->body = ['error' => 'Invalid payload'];
            return $this;
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            $this->code = 400;
            $this->body = ['error' => 'Invalid signature'];
            return $this;
        }
        */

        // デモ実装
        $event = json_decode($payload, true);
        if ($event === null) {
            $this->code = 400;
            $this->body = ['error' => 'Invalid JSON'];

            return $this;
        }

        // イベントタイプごとに処理
        $handled = $this->handleWebhookEvent($event);

        if (! $handled) {
            $this->code = 400;
            $this->body = ['error' => 'Unhandled event type'];

            return $this;
        }

        $this->code = 200;
        $this->body = ['received' => true];

        return $this;
    }

    /**
     * @param array<string, mixed> $event
     */
    private function handleWebhookEvent(array $event): bool
    {
        $type = $event['type'] ?? '';

        return match ($type) {
            // 決済成功
            'checkout.session.completed' => $this->handleCheckoutCompleted($event),
            // サブスクリプション作成
            'customer.subscription.created' => $this->handleSubscriptionCreated($event),
            // サブスクリプション更新
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($event),
            // サブスクリプション削除
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($event),
            // 支払い成功
            'invoice.payment_succeeded' => $this->handlePaymentSucceeded($event),
            // 支払い失敗
            'invoice.payment_failed' => $this->handlePaymentFailed($event),
            default => false,
        };
    }

    /**
     * @param array<string, mixed> $event
     */
    private function handleCheckoutCompleted(array $event): bool
    {
        // チェックアウトセッション完了時の処理
        // 1. テナントのステータスを 'trial' から 'active' に変更
        // 2. サブスクリプション情報を保存
        // 3. 管理者に完了メールを送信

        $session = $event['data']['object'] ?? [];
        $tenantId = (int) ($session['client_reference_id'] ?? 0);
        $subscriptionId = $session['subscription'] ?? '';

        // DB更新処理
        // UPDATE tenants SET status = 'active', subscription_id = :subscriptionId WHERE id = :tenantId

        return true;
    }

    /**
     * @param array<string, mixed> $event
     */
    private function handleSubscriptionCreated(array $event): bool
    {
        // サブスクリプション作成時の処理
        return true;
    }

    /**
     * @param array<string, mixed> $event
     */
    private function handleSubscriptionUpdated(array $event): bool
    {
        // サブスクリプション更新時の処理
        // プラン変更、数量変更など
        return true;
    }

    /**
     * @param array<string, mixed> $event
     */
    private function handleSubscriptionDeleted(array $event): bool
    {
        // サブスクリプション削除時の処理
        // テナントステータスを 'cancelled' に変更
        $subscription = $event['data']['object'] ?? [];
        $subscriptionId = $subscription['id'] ?? '';

        // DB更新処理
        // UPDATE tenants SET status = 'cancelled' WHERE subscription_id = :subscriptionId

        return true;
    }

    /**
     * @param array<string, mixed> $event
     */
    private function handlePaymentSucceeded(array $event): bool
    {
        // 支払い成功時の処理
        // 請求書を生成してメール送信
        return true;
    }

    /**
     * @param array<string, mixed> $event
     */
    private function handlePaymentFailed(array $event): bool
    {
        // 支払い失敗時の処理
        // 管理者に通知メールを送信
        return true;
    }
}
