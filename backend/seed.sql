-- ApprovalHub サンプルデータ (PostgreSQL)

-- ========================================
-- 1. テナント
-- ========================================
INSERT INTO tenants (id, name, slug, plan, max_users, max_approvals_per_month)
VALUES (1, 'デモ株式会社', 'demo', 'business', 20, 999999);

-- ========================================
-- 2. ユーザー
-- ========================================
-- パスワード: password (bcrypt)
INSERT INTO users (id, tenant_id, name, email, password, role) VALUES
(1, 1, 'やっくん隊長', 'yakkun@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
(2, 1, '田中部長', 'tanaka@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
(3, 1, '佐藤一般', 'sato@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member'),
(4, 1, '鈴木エンジニア', 'suzuki@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member'),
(5, 1, '山田人事', 'yamada@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member');

-- ========================================
-- 3. 承認ルート
-- ========================================
INSERT INTO approval_routes (id, tenant_id, name, description, created_by) VALUES
(1, 1, '契約書承認フロー', '新規取引先との契約書用 (2段階承認)', 1),
(2, 1, '経費申請フロー', '10万円以上の経費申請用 (3段階承認)', 1),
(3, 1, '人事施策承認フロー', '採用・異動・昇格等の人事関連 (3段階承認)', 1),
(4, 1, '簡易承認フロー', '10万円未満の少額経費用 (1段階承認)', 1);

-- ========================================
-- 4. 承認ルートステップ
-- ========================================
-- 契約書承認フロー (2段階)
INSERT INTO approval_route_steps (route_id, step_order, approver_id, approver_name) VALUES
(1, 1, 2, '田中部長'),
(1, 2, 1, 'やっくん隊長');

-- 経費申請フロー (3段階)
INSERT INTO approval_route_steps (route_id, step_order, approver_id, approver_name) VALUES
(2, 1, 2, '田中部長'),
(2, 2, 1, 'やっくん隊長'),
(2, 3, 1, 'やっくん隊長');

-- 人事施策承認フロー (3段階)
INSERT INTO approval_route_steps (route_id, step_order, approver_id, approver_name) VALUES
(3, 1, 2, '田中部長'),
(3, 2, 1, 'やっくん隊長'),
(3, 3, 1, 'やっくん隊長');

-- 簡易承認フロー (1段階)
INSERT INTO approval_route_steps (route_id, step_order, approver_id, approver_name) VALUES
(4, 1, 2, '田中部長');

-- ========================================
-- 5. 申請
-- ========================================
INSERT INTO approvals (id, tenant_id, route_id, applicant_id, title, description, status, current_step, current_approver_id, created_at) VALUES
(1, 1, 1, 3, '新規取引先との業務委託契約', '株式会社サンプルとの業務委託契約書の承認をお願いします。契約金額は年間300万円です。', 'pending', 1, 2, '2025-01-15 10:30:00'),
(2, 1, 2, 4, '開発環境サーバー購入申請', 'AWS EC2インスタンス (t3.large) を3台追加購入したいです。月額費用は約15万円の見込みです。', 'pending', 1, 2, '2025-01-14 15:20:00'),
(3, 1, 3, 5, '新卒採用計画の承認依頼', '2026年度新卒採用として、エンジニア5名、営業3名の計8名を採用予定です。', 'pending', 2, 1, '2025-01-13 09:00:00');

-- ========================================
-- 6. 承認履歴
-- ========================================
INSERT INTO approval_histories (approval_id, user_id, user_name, action, step_order, comment, created_at) VALUES
(1, 3, '佐藤一般', 'commented', 0, '申請を作成しました。ご確認よろしくお願いします。', '2025-01-15 10:30:00'),
(2, 4, '鈴木エンジニア', 'commented', 0, '開発環境の性能向上のため、ご承認お願いします。', '2025-01-14 15:20:00'),
(3, 5, '山田人事', 'commented', 0, '採用計画の承認をお願いします。', '2025-01-13 09:00:00'),
(3, 2, '田中部長', 'approved', 1, '内容確認しました。承認します。', '2025-01-14 11:30:00');

-- ========================================
-- 7. 通知
-- ========================================
INSERT INTO notifications (tenant_id, user_id, type, title, message, link, is_read) VALUES
(1, 2, 'approval_request', '新しい承認依頼', '佐藤一般さんから「新規取引先との業務委託契約」の承認依頼が届いています', '/approvals/1', false),
(1, 2, 'approval_request', '新しい承認依頼', '鈴木エンジニアさんから「開発環境サーバー購入申請」の承認依頼が届いています', '/approvals/2', false),
(1, 1, 'approval_request', '新しい承認依頼', '山田人事さんから「新卒採用計画の承認依頼」の承認依頼が届いています (2段階目)', '/approvals/3', false);

-- シーケンスをリセット
SELECT setval('tenants_id_seq', (SELECT MAX(id) FROM tenants));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('approval_routes_id_seq', (SELECT MAX(id) FROM approval_routes));
SELECT setval('approval_route_steps_id_seq', (SELECT MAX(id) FROM approval_route_steps));
SELECT setval('approvals_id_seq', (SELECT MAX(id) FROM approvals));
SELECT setval('approval_histories_id_seq', (SELECT MAX(id) FROM approval_histories));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
