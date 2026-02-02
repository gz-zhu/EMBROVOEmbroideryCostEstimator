# 刺繍コスト見積りシミュレーター

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

針数と複雑さに基づき、ミシン刺繍プロジェクトの正確な価格を算出するWebアプリケーション。

![アプリケーションスクリーンショット](./docs/screenshot.png)

## ✨ 主な機能

### 📊 リアルタイム見積計算
- **針数ベース計算**: 1,000針あたりの単価から自動算出
- **難易度調整**: 0.8倍〜2.0倍のデザイン難易度による価格調整
- **材料費管理**: ボディ・生地代、糸代、アップリケ費用の個別計算
- **特急対応オプション**: +¥4,000の特急対応費用に対応

### 🎨 プリセット機能
以下のプリセットで素早く見積作成:
- 持ち込み刺繍サービス
- ベースボールキャップ
- ポロシャツ
- ジャケット / パーカー
- カスタム（自由入力）

### 📄 PDF見積書生成
- **日本語フォント対応**: Noto Sans JPで完全な日文表示
- **プロフェッショナルな書式**: ロゴ、表格、カラーリング
- **自動ファイル名**: `{プロジェクト名}_見積書.pdf` で保存
- **完全な明細**: 項目別費用、小計、総合計を表示

### 🎯 製作時間目安
- 800針/分での製作時間自動計算
- 1点あたりの時間
- 総製作時間（複数個の場合）

---

## 🚀 クイックスタート

### 前提条件

- **Node.js**: 18.0.0以上
- **npm**: 8.0.0以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/gz-zhu/EMBROVOEmbroideryCostEstimator.git
cd embroidery-cost-estimator

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開きます。

### ビルド

```bash
npm run build
```

本番用ファイルは `dist/` ディレクトリに生成されます。

### プレビュー

```bash
npm run preview
```

---

## 📁 プロジェクト構成

```
embroidery-cost-estimator/
├── public/                  # 静的ファイル
│   ├── OC 03.png           # 背景画像
│   ├── logo.png            # Webロゴ
│   └── logoblack.png       # PDFロゴ
├── src/
│   ├── components/         # UIコンポーネント
│   │   └── ui/            # shadcn/ui コンポーネント
│   ├── App.tsx            # メインアプリケーション
│   ├── EstimatePDF.tsx    # PDF生成コンポーネント
│   ├── main.tsx           # エントリーポイント
│   ├── index.css          # グローバルスタイル
│   └── vite-env.d.ts      # TypeScript型定義
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🛠️ 技術スタック

### フロントエンド
- **React 18.3.1**: UIライブラリ
- **TypeScript**: 型安全性
- **Vite**: 高速ビルドツール
- **Tailwind CSS**: ユーティリティファーストCSS

### UIコンポーネント
- **Radix UI**: アクセシブルなプリミティブ
- **shadcn/ui**: 美しいコンポーネント
- **Lucide React**: アイコン

### PDF生成
- **@react-pdf/renderer**: React PDFドキュメント生成
- **file-saver**: ファイルダウンロード
- **Noto Sans JP**: 日本語フォントサポート

### データ可視化
- **Recharts**: チャート作成（将来の拡張用）

---

## 💡 使い方

### 1. 基本情報の入力

```
貴社名/お名前: Beauxsacs Embroidery and Monogramming
案件名（品名）: 企業ロゴ刺繍
数量: 6 点
```

### 2. 刺繍詳細の設定

```
総針数: 8,000 針
1,000針あたりの単価: ¥80
刺繍型代: ¥5,000 (初回のみ)
難易度: 標準（通常のデザイン） 1.0倍
```

### 3. 材料費の入力

```
ボディ・生地代: ¥2,000
糸・副資材費: ¥200
アップリケの個数: 1
アップリケ追加単価: ¥100
```

### 4. オプション選択

```
☑ 特急対応 / お急ぎ便 (+¥4,000)
```

### 5. 見積確認とPDF生成

右側の「お見積り明細」でリアルタイムに確認し、「PDF見積書をダウンロード」ボタンでPDF保存。

---

## 📊 料金計算ロジック

### 基本計算式

```
刺繍加工賃 = (針数 / 1000) × 単価
難易度調整 = 刺繍加工賃 × (難易度倍率 - 1)
刺繍型代（1点あたり） = 刺繍型代 ÷ 数量
アップリケ費用 = アップリケ個数 × 単価

小計 = 刺繍加工賃 + 難易度調整 + 刺繍型代 + ボディ代 + 糸代 + アップリケ費用
1点あたりの合計 = 小計 + 特急費（該当する場合）
総合計 = (小計 × 数量) + 特急費（該当する場合）
```

### 難易度設定

| レベル | 倍率 | 説明 |
|--------|------|------|
| 簡易 | 0.8 | テキスト・シンプル図形 |
| 標準 | 1.0 | 通常のデザイン |
| 複雑 | 1.2 | 細部のあるデザイン |
| 高密度 | 1.5 | 緻密なアートワーク |
| プレミアム | 2.0 | 写真・3D刺繍 |

---

## 🎨 カスタマイズ

### ロゴ・背景の変更

```bash
public/
├── OC 03.png      # 背景画像に置き換え
├── logo.png       # Webロゴに置き換え
└── logoblack.png  # PDFロゴに置き換え
```

### 価格プリセットの変更

`src/App.tsx` の `PRESETS` オブジェクトを編集:

```typescript
const PRESETS = {
  custom: {
    baseRate: 80,        // 1,000針あたりの単価
    setupFee: 4000,      // 刺繍型代
    materialCost: 2000,  // ボディ代
    threadCost: 200,     // 糸代
    complexityMultiplier: 1.0,
    numberOfAppliques: 0,
    appliqueRate: 100,
  },
};
```

### PDFスタイルの変更

`src/EstimatePDF.tsx` の `styles` オブジェクトを編集:

```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    color: '#2C3E50',  // タイトル色
    // ...
  },
  tableHeaderRow: {
    backgroundColor: '#2980B9',  // 表ヘッダー色
    // ...
  },
});
```

---

## 🐛 トラブルシューティング

### PDF生成エラー

**問題**: PDF生成時にエラーが発生する

**解決策**:
1. ブラウザのキャッシュをクリア
2. `npm install` を再実行
3. `node_modules` を削除して再インストール

```bash
rm -rf node_modules package-lock.json
npm install
```

### 日本語が表示されない

**問題**: PDFで日本語が□□□と表示される

**解決策**: 
- `EstimatePDF.tsx` でNoto Sans JPフォントが正しく読み込まれているか確認
- CDN接続を確認

### TypeScriptエラー

**問題**: 画像importで型エラーが出る

**解決策**: `src/vite-env.d.ts` に型定義を追加

```typescript
declare module '*.png' {
  const value: string;
  export default value;
}
```

---

## 📈 今後の拡張予定

- [ ] 過去の見積履歴保存機能
- [ ] データエクスポート（CSV, Excel）
- [ ] 複数通貨対応
- [ ] ダークモード
- [ ] 多言語対応（英語、中国語）
- [ ] 顧客データベース連携
- [ ] チャート・グラフ機能

---

## 🤝 コントリビューション

貢献を歓迎します！以下の手順でお願いします:

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

---

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

---

## 👥 作者

**Beauxsacs Embroidery and Monogramming**

- Website: [https://beauxsacs.com](https://beauxsacs.com)
- Email: info@beauxsacs.com

---

## 🙏 謝辞

- [shadcn/ui](https://ui.shadcn.com/) - 美しいUIコンポーネント
- [Radix UI](https://www.radix-ui.com/) - アクセシブルなプリミティブ
- [React PDF](https://react-pdf.org/) - PDF生成ライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティCSS
- [Lucide](https://lucide.dev/) - アイコンライブラリ

---

## 📞 サポート

質問やサポートが必要な場合は、以下の方法でお問い合わせください:

- **Issues**: [GitHub Issues](https://github.com/yourusername/embroidery-cost-estimator/issues)
- **Email**: support@beauxsacs.com
- **Documentation**: [Wiki](https://github.com/yourusername/embroidery-cost-estimator/wiki)

---

<div align="center">

**刺繍コスト見積りシミュレーター** で正確な見積作成を！

Made with ❤️ by Beauxsacs

</div>
