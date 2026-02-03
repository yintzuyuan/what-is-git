# 什麼是 Git？(What is Git?)

讓創意工作者「看懂」Git 邏輯的引導式互動展示。

## 專案概述

- **目標**：建立 Git 概念的心智模型，而非教人使用 Git
- **受眾**：創意工作者（設計師、字型師、藝術家）
- **形式**：Scrollytelling 互動展示
- **語言**：MVP 繁體中文，未來加英文

## 技術棧

- **Astro** — 靜態網站生成器
- **GSAP ScrollTrigger** — 捲動驅動動畫
- **GitHub Pages** — 託管

## 設計系統

**與主網站 (erikyin.net) 一致**
- 字型：IBM Plex Sans + IBM Plex Mono + Noto Sans TC
- 間距：5 級（xs, sm, md, lg, xl）
- 行高：1.75
- 背景：#1a1a1a（深色主題，基於主網站深色模式）
- 強調色：#5eead4（星點青）

## 專案結構

```
what-is-git/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    # 基礎佈局
│   ├── pages/
│   │   └── index.astro         # 主頁面（9 章節）
│   └── styles/
│       └── design-system.css   # 設計系統
├── specs/
│   ├── overview.md             # 核心規格
│   ├── design-system.md        # 設計系統規格
│   └── interactions.md         # 互動行為規格
├── public/
│   └── favicon.svg
└── .github/workflows/
    └── deploy.yml              # GitHub Pages 部署
```

## 開發指令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置靜態檔案
npm run preview  # 預覽建置結果
```

## 部署

- 推送到 `main` 分支自動觸發 GitHub Actions 部署
- 網址：https://yintzuyuan.github.io/what-is-git/

## 實作進度

### Phase 0：專案初始化 ✓
- [x] 建立專案目錄
- [x] 初始化 Git 儲存庫
- [x] 建立 GitHub 遠端儲存庫
- [x] 初始化 Astro 專案
- [x] 設定 GitHub Pages 部署

### Phase 1：規格撰寫 ✓
- [x] 撰寫核心規格文件 (specs/overview.md)
- [x] 定義各章節的互動行為規格 (specs/interactions.md)
- [x] 定義設計系統規格 (specs/design-system.md)

### Phase 2：設計系統 ✓
- [x] 定義色彩變數（基於主網站深色模式）
- [x] 統一字型系統（與主網站一致）
- [x] 建立基礎 CSS 架構

### Phase 3：核心動畫引擎 ✓
- [x] 整合 GSAP ScrollTrigger
- [x] 建立章節淡入動畫
- [x] 建立 CLI 鏡像更新邏輯
- [x] 建立進度指示導航

### Phase 4：章節內容（待實作）
- [x] 章節 HTML 結構已建立
- [ ] 星座視覺化動畫（待實作）

### Phase 5：番外篇（未開始）
- [ ] 番外一：複製他人的世界 (Fork)
- [ ] 番外二：向他人貢獻 (Contribution)
- [ ] 番外三：共同審查 (Code Review)

### Phase 6：測試與優化（未開始）
- [ ] 跨瀏覽器測試
- [ ] 手機版適配
- [ ] 效能優化
- [ ] 無障礙檢查
