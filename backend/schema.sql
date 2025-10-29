-- ApprovalHub Database Schema (PostgreSQL 16)
-- マルチテナント対応 (Row Level Security)

-- ========================================
-- 1. テナント（組織）
-- ========================================
CREATE TABLE tenants (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'free',
    max_users INT DEFAULT 3,
    max_approvals_per_month INT DEFAULT 3,
    stripe_customer_id VARCHAR(255),
    trial_ends_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_stripe_customer_id ON tenants(stripe_customer_id);

COMMENT ON TABLE tenants IS '組織・テナント';
COMMENT ON COLUMN tenants.slug IS 'サブドメイン用 (例: demo)';
COMMENT ON COLUMN tenants.plan IS 'プラン: free, starter, business';

-- ========================================
-- 2. ユーザー
-- ========================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    avatar_url VARCHAR(500),
    email_verified_at TIMESTAMP,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS 'ユーザー';
COMMENT ON COLUMN users.role IS 'admin, manager, member';

-- Row Level Security 有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_users ON users
    USING (tenant_id = current_setting('app.current_tenant_id', true)::bigint);

-- ========================================
-- 3. サブスクリプション
-- ========================================
CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_price_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_tenant_id ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

COMMENT ON TABLE subscriptions IS 'サブスクリプション管理';
COMMENT ON COLUMN subscriptions.status IS 'active, canceled, past_due, trialing';

-- ========================================
-- 4. 承認ルート
-- ========================================
CREATE TABLE approval_routes (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_approval_routes_tenant_id ON approval_routes(tenant_id);

COMMENT ON TABLE approval_routes IS '承認ルート (例: 契約書承認フロー)';

-- Row Level Security
ALTER TABLE approval_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_approval_routes ON approval_routes
    USING (tenant_id = current_setting('app.current_tenant_id', true)::bigint);

-- ========================================
-- 5. 承認ルートステップ
-- ========================================
CREATE TABLE approval_route_steps (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT NOT NULL REFERENCES approval_routes(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    approver_id BIGINT NOT NULL REFERENCES users(id),
    approver_name VARCHAR(255),
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, step_order)
);

CREATE INDEX idx_approval_route_steps_route_id ON approval_route_steps(route_id);
CREATE INDEX idx_approval_route_steps_approver_id ON approval_route_steps(approver_id);

COMMENT ON TABLE approval_route_steps IS '承認ルートのステップ (例: 1段階目:部長, 2段階目:役員)';
COMMENT ON COLUMN approval_route_steps.approver_name IS '承認者名（スナップショット）';

-- ========================================
-- 6. 申請
-- ========================================
CREATE TABLE approvals (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    route_id BIGINT NOT NULL REFERENCES approval_routes(id),
    applicant_id BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    current_step INT DEFAULT 1,
    current_approver_id BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    withdrawn_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_approvals_tenant_id ON approvals(tenant_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_current_approver_id ON approvals(current_approver_id);
CREATE INDEX idx_approvals_applicant_id ON approvals(applicant_id);
CREATE INDEX idx_approvals_tenant_status_created ON approvals(tenant_id, status, created_at DESC);

COMMENT ON TABLE approvals IS '申請';
COMMENT ON COLUMN approvals.status IS 'pending, approved, rejected, withdrawn';

-- Row Level Security
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_approvals ON approvals
    USING (tenant_id = current_setting('app.current_tenant_id', true)::bigint);

-- ========================================
-- 7. 承認履歴
-- ========================================
CREATE TABLE approval_histories (
    id BIGSERIAL PRIMARY KEY,
    approval_id BIGINT NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    user_name VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    step_order INT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_histories_approval_id ON approval_histories(approval_id);
CREATE INDEX idx_approval_histories_user_id ON approval_histories(user_id);

COMMENT ON TABLE approval_histories IS '承認履歴';
COMMENT ON COLUMN approval_histories.action IS 'approved, rejected, withdrawn, commented';
COMMENT ON COLUMN approval_histories.user_name IS 'ユーザー名（スナップショット）';

-- ========================================
-- 8. 添付ファイル
-- ========================================
CREATE TABLE approval_attachments (
    id BIGSERIAL PRIMARY KEY,
    approval_id BIGINT NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approval_attachments_approval_id ON approval_attachments(approval_id);

COMMENT ON TABLE approval_attachments IS '添付ファイル';
COMMENT ON COLUMN approval_attachments.file_path IS 'Cloudflare R2のパス';

-- ========================================
-- 9. 通知
-- ========================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

COMMENT ON TABLE notifications IS '通知履歴';
COMMENT ON COLUMN notifications.type IS 'approval_request, approval_approved, approval_rejected';

-- Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_notifications ON notifications
    USING (tenant_id = current_setting('app.current_tenant_id', true)::bigint);
