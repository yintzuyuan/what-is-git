## Context

這是「什麼是 Git？」專案的基礎架構建立。專案目標是透過 Scrollytelling 讓創意工作者（設計師、字型師、藝術家）建立 Git 版本控制的心智模型。

**現有條件**：
- Astro 專案已初始化
- GSAP 與 @gsap/react 依賴已安裝
- GitHub 遠端儲存庫已建立

**設計約束**：
- 視覺語言須與主網站 erikyin.net 一致
- 純靜態輸出，部署至 GitHub Pages
- 優先考慮效能與無障礙

## Goals / Non-Goals

**Goals:**
- 建立可擴展的章節捲動系統
- 實作與主網站一致的設計系統
- 提供清晰的 CLI 指令對照
- 支援無障礙使用

**Non-Goals:**
- 星座視覺化動畫（Phase 4）
- 番外篇章節（Phase 5）
- 多語言支援（未來版本）
- 互動沙盒模式（未來版本）

## Decisions

### D1: 使用 Astro 而非 Next.js

**選擇**：Astro
**理由**：
- 內容網站優先的設計哲學
- 零 JavaScript 輸出（除非必要）
- 原生支援 Markdown 與組件島嶼
- GitHub Pages 部署簡單

**替代方案**：
- Next.js：過度複雜，本專案不需要 SSR 或 API routes
- Vanilla HTML：缺乏組件化能力

### D2: 使用 GSAP ScrollTrigger

**選擇**：GSAP + ScrollTrigger
**理由**：
- Scrollytelling 業界標準
- 精確的捲動位置控制
- 豐富的緩動函數
- 良好的效能優化

**替代方案**：
- Intersection Observer：API 較底層，需自行處理動畫
- Lenis + CSS：對複雜時間軸支援較弱

### D3: CSS Variables 管理設計系統

**選擇**：原生 CSS Variables
**理由**：
- 與主網站 erikyin.net 技術選擇一致
- 無額外建置步驟
- 執行時可動態修改

**替代方案**：
- Tailwind CSS：學習曲線，與現有系統不一致
- CSS-in-JS：增加 JavaScript 打包大小

### D4: 單一頁面章節結構

**選擇**：單一 `index.astro` 包含所有章節
**理由**：
- Scrollytelling 需要連續捲動體驗
- 簡化捲動觸發邏輯
- 減少路由複雜度

**替代方案**：
- 多頁面分章節：破壞連續捲動體驗
- 動態載入章節：增加複雜度，對 9 章內容不必要

### D5: CLI 鏡像使用 data 屬性

**選擇**：`data-cli` 屬性存放指令
**理由**：
- 宣告式，容易維護
- 與 HTML 結構緊密結合
- 支援無指令章節（屬性不存在時隱藏）

**替代方案**：
- JavaScript 物件對照表：與內容分離，同步成本高
- JSON 設定檔：過度工程化

## Risks / Trade-offs

### R1: GSAP 打包大小
**風險**：GSAP 增加約 60KB 打包大小
**緩解**：僅引入必要模組（gsap + ScrollTrigger），啟用 tree-shaking

### R2: 單一頁面首次載入
**風險**：9 個章節的內容可能影響首次載入效能
**緩解**：
- 使用 Astro 的零 JavaScript 基礎輸出
- 圖片資源延遲載入（未來章節）
- 字型使用 `display=swap`

### R3: 設計系統同步
**風險**：與主網站設計系統分離，可能導致不一致
**緩解**：
- 建立明確的設計規格文件
- 使用相同的 CSS 變數命名
- 定期對照主網站更新

## Migration Plan

此為新專案，無需遷移。

**部署步驟**：
1. 推送至 GitHub main 分支
2. GitHub Actions 自動建置
3. 部署至 `yintzuyuan.github.io/what-is-git/`

**回滾策略**：
- 透過 Git revert 回滾提交
- GitHub Pages 自動重新部署

## Open Questions

1. **星座動畫實作方式**：SVG 還是 Canvas？（Phase 4 決定）
2. **行動版手勢支援**：是否需要左右滑動切換章節？（暫不實作）
3. **分析追蹤**：是否加入 Google Analytics 或 Plausible？（待決定）
