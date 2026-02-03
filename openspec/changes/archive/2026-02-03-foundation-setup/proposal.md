## Why

讓創意工作者「看懂」Git 版本控制概念的互動式 Scrollytelling 網站需要建立基礎架構。這是專案的第一個變更，奠定整個展示的技術基礎與視覺語言。

## What Changes

- 建立 Astro 專案架構與 GitHub Pages 部署流程
- 實作與主網站 (erikyin.net) 一致的設計系統（深色主題變體）
- 建立 GSAP ScrollTrigger 驅動的章節捲動系統
- 實作 CLI 鏡像組件，顯示對應的 Git 指令
- 建立進度指示導航系統
- 完成 9 個章節的內容結構（序章 + 7 章 + 結語）

## Capabilities

### New Capabilities

- `design-system`: 色彩、字型、間距系統，與 erikyin.net 保持一致
- `scroll-engine`: GSAP ScrollTrigger 驅動的章節捲動與動畫系統
- `cli-mirror`: 側邊 CLI 指令鏡像組件，隨捲動顯示對應指令
- `chapter-structure`: 9 章節內容結構與淡入動畫

### Modified Capabilities

（無，這是全新專案）

## Impact

- **新增檔案**：
  - `src/styles/design-system.css` — 設計系統 CSS 變數
  - `src/layouts/BaseLayout.astro` — 基礎佈局與 GSAP 整合
  - `src/pages/index.astro` — 主頁面章節內容
  - `.github/workflows/deploy.yml` — GitHub Actions 部署
- **配置調整**：
  - `astro.config.mjs` — GitHub Pages 設定
- **依賴**：
  - `gsap` — 動畫引擎
  - `@gsap/react` — React 整合（預留）
