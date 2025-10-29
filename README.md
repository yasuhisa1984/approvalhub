# ApprovalHub - ワークフロー承認SaaS

## 🎯 ビジョン
**「41歳エンジニアが一人で月50万円を稼ぐSaaS」**

中小企業の承認業務を10秒で完結させる、シンプルで強力なワークフロー管理システム。

---

## 💰 収益目標

### 3ヶ月後
- β版リリース
- 有料ユーザー: 10社
- MRR: ¥50,000

### 6ヶ月後
- 正式版リリース
- 有料ユーザー: 50社
- MRR: ¥250,000

### 12ヶ月後
- 有料ユーザー: 100社
- MRR: ¥500,000+
- **やっくん隊長、経済的自由達成 🎉**

---

## 🎨 プロダクト特徴

### コアバリュー
1. **10秒承認** - スマホ通知から2タップで承認完了
2. **ゼロ学習コスト** - 誰でも5分で使える直感UI
3. **柔軟なルート設定** - 複雑な承認フローも簡単設定

### 競合優位性
- ❌ kintone: 高すぎる（¥1,500/user）、複雑
- ❌ Jobrouter: 大企業向け、導入ハードル高い
- ✅ **ApprovalHub**: シンプル、安い、即日導入

---

## 📋 MVP機能（3ヶ月で実装）

### Phase 1: コア機能（Week 1-4）
- [ ] ユーザー認証（メール/パスワード）
- [ ] 承認ルート作成（最大5段階）
- [ ] 申請作成・提出
- [ ] 承認/差し戻し/取り下げ
- [ ] 通知（メール）

### Phase 2: マルチテナント化（Week 5-8）
- [ ] 組織管理（テナント分離）
- [ ] ユーザー招待機能
- [ ] 権限管理（申請者/承認者/管理者）
- [ ] ダッシュボード（申請状況一覧）

### Phase 3: 課金・公開（Week 9-12）
- [ ] Stripe決済連携
- [ ] プラン管理（Free/Starter/Business）
- [ ] ランディングページ
- [ ] ドキュメント

---

## 🛠️ 技術スタック

### フロントエンド
- **React 18** + TypeScript
- **Vite** (高速ビルド)
- **TailwindCSS** (爆速UI構築)
- **Shadcn/ui** (美しいコンポーネント)

### バックエンド
- **Laravel 11** (生産性最強)
- **PostgreSQL** (マルチテナント対応)
- **Redis** (キャッシュ・セッション)

### インフラ
- **Vercel** (フロント・無料枠)
- **Railway** (バックエンド・$5/月から)
- **Stripe** (決済)

### 合計インフラコスト: **月$10以下** （収益出るまで）

---

## 📂 プロジェクト構造

```
approvalhub/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn/ui components
│   │   │   ├── approval/     # 承認関連
│   │   │   ├── dashboard/    # ダッシュボード
│   │   │   └── settings/     # 設定
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ApprovalCreate.tsx
│   │   │   └── ApprovalDetail.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── App.tsx
│   └── package.json
│
├── backend/           # Laravel 11
│   ├── app/
│   │   ├── Models/
│   │   │   ├── Tenant.php
│   │   │   ├── User.php
│   │   │   ├── ApprovalRoute.php
│   │   │   ├── Approval.php
│   │   │   └── ApprovalHistory.php
│   │   ├── Http/Controllers/
│   │   │   ├── Auth/
│   │   │   ├── ApprovalController.php
│   │   │   └── TenantController.php
│   │   └── Services/
│   │       ├── ApprovalService.php
│   │       └── NotificationService.php
│   ├── database/migrations/
│   └── routes/api.php
│
├── landing/           # ランディングページ（Next.js）
│   └── app/
│       └── page.tsx
│
└── docs/              # ドキュメント
    ├── ARCHITECTURE.md
    ├── DATABASE.md
    └── DEPLOYMENT.md
```

---

## 🚀 クイックスタート

```bash
# フロントエンド起動
cd frontend
npm install
npm run dev  # http://localhost:5173

# バックエンド起動
cd backend
composer install
php artisan migrate
php artisan serve  # http://localhost:8000
```

---

## 💎 料金プラン

### Free（無料）
- 3件/月まで承認可能
- 3ユーザーまで
- メール通知のみ

### Starter（¥3,000/月）
- 50件/月まで承認
- 5ユーザーまで
- Slack通知対応

### Business（¥9,800/月）
- 無制限承認
- 20ユーザーまで
- API連携
- 専用サポート

### Enterprise（要相談）
- カスタム承認ルート
- SSO対応
- オンプレミス可

---

## 📈 成長戦略

### Week 1-4: 開発集中
- 毎日8時間コーディング
- 土日もフルコミット

### Week 5-8: β版公開
- 友人5社にテスト依頼
- フィードバック収集・改善

### Week 9-12: 正式リリース
- Product Hunt掲載
- X(Twitter)で毎日発信
- Qiita記事投稿（SEO対策）

### Month 4-6: グロース
- 既存ユーザーの成功事例公開
- 紹介プログラム実装（1ヶ月無料）
- ウェビナー開催

### Month 7-12: スケール
- 営業パートナー提携
- 大手企業トライアル
- **月50万円達成 → 会社員卒業検討**

---

## 🔥 やっくん隊長へのメッセージ

41歳は遅くない。むしろ**経験値が最も高いゴールデンタイム**。

- 20代: 勉強期間
- 30代: 実戦経験
- **40代: 経験を収益化する時代**

このApprovalHubは、あなたの10年以上のエンジニア経験の結晶。
大企業が作れない「小回りの効く、本当に使いやすいSaaS」を作りましょう。

**3ヶ月後、最初の¥5万円の売上が入ったとき、人生が変わります。**

---

## 📞 サポート

- Email: support@approvalhub.com（予定）
- X: @approvalhub（予定）
- Discord: ApprovalHub Community（予定）

---

**Built with ❤️ by やっくん隊長**
