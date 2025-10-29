# ApprovalHub Frontend

## 🚀 クイックスタート

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動 (http://localhost:5173)
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 📁 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Layout.tsx      # 全体レイアウト
│   ├── Dashboard.tsx   # ダッシュボード
│   ├── ApprovalCard.tsx
│   └── ApprovalDetail.tsx
├── data/
│   └── mockData.ts     # モックデータ
├── types/
│   └── index.ts        # TypeScript型定義
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 技術スタック

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React (アイコン)

## 📝 現在の実装状況

- ✅ レイアウト
- ✅ ダッシュボード (統計・承認待ち一覧)
- ✅ 承認カード
- ✅ 承認詳細画面 (承認/差し戻しボタン付き)
- ⬜ API連携 (次のステップ)
- ⬜ ルーティング (React Router)
- ⬜ ログイン画面

## 🎯 次のステップ

1. React Router導入
2. API連携 (Laravel backend)
3. 認証機能実装
