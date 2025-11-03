-- ファイルテーブル作成
-- Cloudflare R2と連携してファイルアップロード機能を実現

CREATE TABLE IF NOT EXISTS files (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL REFERENCES tenants(id),
  uploader_id BIGINT NOT NULL REFERENCES users(id),

  -- ファイル情報
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- バイト単位
  mime_type TEXT NOT NULL,

  -- Cloudflare R2 パス
  storage_path TEXT NOT NULL UNIQUE, -- 例: "1/abc-123-def.pdf"

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
CREATE INDEX IF NOT EXISTS idx_files_tenant_id ON files(tenant_id);
CREATE INDEX IF NOT EXISTS idx_files_approval_id ON files(approval_id);
CREATE INDEX IF NOT EXISTS idx_files_uploader_id ON files(uploader_id);
CREATE INDEX IF NOT EXISTS idx_files_deleted_at ON files(deleted_at);
CREATE INDEX IF NOT EXISTS idx_files_storage_path ON files(storage_path);

-- コメント
COMMENT ON TABLE files IS 'ファイルメタデータ管理テーブル（実体はCloudflare R2に保存）';
COMMENT ON COLUMN files.storage_path IS 'Cloudflare R2内のパス（例: 1/uuid.pdf）';
COMMENT ON COLUMN files.file_size IS 'ファイルサイズ（バイト単位）';
