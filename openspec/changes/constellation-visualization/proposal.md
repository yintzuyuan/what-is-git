## Why

目前頁面只有靜態背景星點，缺乏視覺化 Git 概念的動態元素。星座視覺化是專案的核心特色——透過「星點 = commit」、「連線 = 歷史」的隱喻，讓抽象的版本控制概念變得可見、可理解。

## What Changes

- 實作動態星點生成系統，隨捲動進度逐步出現
- 實作連線繪製系統，呈現 commit 之間的關係
- 實作分支視覺化，展示 main 與 feature 分支的分離與合併
- 整合 ScrollTrigger 驅動星座動畫時間軸
- 實作衝突視覺效果（脈動動畫）

## Capabilities

### New Capabilities

- `constellation-stars`: 動態星點系統，管理 commit 節點的生成、樣式與動畫
- `constellation-lines`: 連線系統，管理 commit 之間的路徑繪製與動畫
- `constellation-timeline`: 時間軸控制系統，整合 ScrollTrigger 驅動整體動畫進度

### Modified Capabilities

- `scroll-engine`: 新增星座動畫整合，章節捲動時觸發對應的星座狀態變化

## Impact

- **新增檔案**：
  - `src/scripts/constellation.ts` — 星座視覺化核心邏輯
- **修改檔案**：
  - `src/layouts/BaseLayout.astro` — 整合星座動畫初始化
  - `src/styles/design-system.css` — 可能新增星點/連線動畫樣式
- **效能考量**：
  - SVG 元素數量需控制在合理範圍（< 100 個動態元素）
  - 使用 GSAP 硬體加速屬性優化動畫效能
