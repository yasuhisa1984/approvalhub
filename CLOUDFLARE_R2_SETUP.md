# Cloudflare R2 セットアップガイド

## 📦 概要

ApprovalHubでファイルアップロード機能を実現するために、Cloudflare R2を使用します。

**なぜCloudflare R2？**
- ✅ **完全無料で10GB**（永久無料枠）
- ✅ **転送量完全無料**（エグレス料金ゼロ）
- ✅ **S3互換API**（業界標準）
- ✅ **グローバルCDN配信**

## 💰 料金

### 無料枠（永久無料）
- ストレージ: **10GB/月**
- Class A操作（書き込み）: 100万リクエスト/月
- Class B操作（読み込み）: 1,000万リクエスト/月
- エグレス（転送量）: **完全無料（無制限）**

### 10GB超過後の従量課金
- ストレージ: $0.015/GB/月（超低価格）
- 転送量: $0（無料のまま）

**例**: 月間50GB使用 → $0.60/月（約90円）

---

## 🔧 1. Cloudflareアカウント作成

1. **Cloudflareにサインアップ**
   - https://dash.cloudflare.com/sign-up にアクセス
   - メールアドレスとパスワードで登録
   - 無料プランで開始

2. **クレジットカード登録**
   - 無料枠内の使用でも登録が必要
   - 料金は発生しません（10GB以内）

---

## 🪣 2. R2バケット作成

### 手順

1. **Cloudflare Dashboardにログイン**
   - https://dash.cloudflare.com

2. **R2セクションに移動**
   - 左サイドバーから「R2」をクリック
   - 「Get Started」または「Create Bucket」をクリック

3. **バケット作成**
   ```
   Bucket Name: approvalhub-files
   Location: Automatic (推奨)
   ```
   - 「Create Bucket」をクリック

4. **バケットが作成されました！**

---

## 🔑 3. API認証情報の取得

### 手順

1. **R2 API Tokens**
   - R2ダッシュボード右上の「Manage R2 API Tokens」をクリック

2. **新しいAPIトークン作成**
   - 「Create API Token」をクリック
   - 設定:
     ```
     Token Name: approvalhub-api
     Permissions: Object Read & Write
     TTL: Forever（推奨）
     Specific Buckets: approvalhub-files（選択）
     ```

3. **認証情報を保存**
   - 表示される以下の情報を**必ず安全に保存**:
     ```
     Access Key ID: xxxxxxxxxxxxxx
     Secret Access Key: xxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - ⚠️ Secret Access Keyは一度しか表示されません！

4. **Account IDを取得**
   - R2ダッシュボードの右側に表示される
   - 例: `abc123def456`

---

## 🔐 4. 環境変数設定

`.env` ファイルに以下を追加:

```bash
# Cloudflare R2設定
R2_ACCOUNT_ID=your-account-id              # 例: abc123def456
R2_ACCESS_KEY_ID=your-access-key-id        # ステップ3で取得
R2_SECRET_ACCESS_KEY=your-secret-key       # ステップ3で取得
R2_BUCKET_NAME=approvalhub-files           # バケット名
MAX_FILE_SIZE_MB=10                        # ファイルサイズ上限（MB）
```

**⚠️ 重要**:
- `.env`ファイルを`.gitignore`に追加
- 認証情報を絶対にGitHubにpushしない

---

## 🗄️ 5. データベーステーブル作成

ファイルのメタデータを管理するテーブルを作成:

```sql
-- ファイルテーブル
CREATE TABLE files (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id),
  uploader_id BIGINT NOT NULL REFERENCES users(id),

  -- ファイル情報
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- バイト単位
  mime_type TEXT NOT NULL,

  -- Cloudflare R2 パス
  storage_path TEXT NOT NULL UNIQUE, -- 例: "1/abc123.pdf"

  -- 関連エンティティ（オプション）
  approval_id BIGINT REFERENCES approvals(id),

  -- メタデータ
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  CONSTRAINT files_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- RLS有効化
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: 自分のテナントのファイルのみ操作可能
CREATE POLICY "Users can manage files in their tenant"
ON files
FOR ALL
USING (tenant_id = current_setting('app.current_tenant_id')::bigint);

-- インデックス
CREATE INDEX idx_files_tenant_id ON files(tenant_id);
CREATE INDEX idx_files_approval_id ON files(approval_id);
CREATE INDEX idx_files_uploader_id ON files(uploader_id);
CREATE INDEX idx_files_deleted_at ON files(deleted_at);
CREATE INDEX idx_files_storage_path ON files(storage_path);
```

または、マイグレーションSQLを実行:
```bash
psql $DATABASE_URL < database/migrations/003_create_files_table.sql
```

---

## 📁 6. ファイルパス構造

Cloudflare R2内のファイルパスは以下の形式:

```
approvalhub-files/
├── {tenant_id}/
│   ├── {uuid}.pdf
│   ├── {uuid}.jpg
│   └── {uuid}.docx
```

**パス例**:
- テナントID: 1
- ファイル: `invoice.pdf`
- 保存パス: `1/abc-def-123.pdf`

ファイル名の衝突を避けるため、UUIDを使用します。

---

## 🚀 7. ライブラリインストール

```bash
cd backend-api
pip install -r requirements.txt
```

これで`boto3`（S3互換クライアント）がインストールされます。

---

## 🧪 8. 動作確認

### 手動テスト

```bash
# バックエンド起動
cd backend-api
uvicorn main:app --reload

# 別のターミナルでテスト
curl -X POST http://localhost:8080/api/files/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test.pdf"
```

### 期待される応答

```json
{
  "id": 1,
  "fileName": "test.pdf",
  "fileSize": 12345,
  "mimeType": "application/pdf",
  "storagePath": "1/abc-123-def.pdf",
  "createdAt": "2025-01-15T10:30:00"
}
```

---

## 📊 容量見積もり

### シナリオ1: 小規模（月30申請）
- 1申請あたり平均2ファイル（各1.5MB）= 3MB
- 月間使用量: 30申請 × 3MB = 90MB/月
- **10GBで使える期間**: 約110ヶ月（9年以上！）
- **コスト**: $0

### シナリオ2: 中規模（月100申請）
- 月間使用量: 100申請 × 3MB = 300MB/月
- **10GBで使える期間**: 約33ヶ月（約3年）
- **コスト**: $0

### シナリオ3: 大規模（月500申請）
- 月間使用量: 500申請 × 3MB = 1.5GB/月
- 1年後の総容量: 18GB
- **コスト**: (18GB - 10GB) × $0.015 = **$0.12/月（約18円）**

→ **売上が出るまで完全無料で運用可能！**

---

## 🔒 セキュリティ機能

- ✅ マルチテナント分離（`{tenant_id}/`フォルダ）
- ✅ JWT認証必須
- ✅ Row Level Security (RLS)
- ✅ ファイルサイズ制限
- ✅ 権限ベース削除制御
- ✅ 署名付きURL（時限式、1時間有効）
- ✅ S3互換API（業界標準のセキュリティ）

---

## 🐛 トラブルシューティング

### エラー: "File storage is not configured"
**原因**: 環境変数が設定されていない

**解決策**:
1. `.env`ファイルに`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`が設定されているか確認
2. バックエンドを再起動

### エラー: "SignatureDoesNotMatch"
**原因**: Access KeyまたはSecret Keyが間違っている

**解決策**:
1. Cloudflare DashboardでAPIトークンを再確認
2. 新しいAPIトークンを作成して`.env`を更新

### エラー: "NoSuchBucket"
**原因**: バケット名が間違っている、またはバケットが存在しない

**解決策**:
1. Cloudflare R2ダッシュボードでバケット名を確認
2. `.env`の`R2_BUCKET_NAME`を修正

---

## ✅ セットアップ完了チェックリスト

- [ ] Cloudflareアカウント作成完了
- [ ] R2バケット `approvalhub-files` 作成完了
- [ ] APIトークン作成・保存完了
- [ ] `.env` に環境変数追加完了
- [ ] `files` テーブルをデータベースに作成完了
- [ ] `pip install -r requirements.txt` 実行完了
- [ ] ファイルアップロード機能のテスト完了

---

## 🎉 完了！

Cloudflare R2でファイルアップロード機能が使えるようになりました！

**次のステップ**:
- フロントエンドでファイルアップロードUIを実装
- 承認申請にファイル添付機能を追加
