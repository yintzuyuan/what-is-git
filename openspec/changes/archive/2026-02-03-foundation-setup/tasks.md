## 1. 專案配置

- [x] 1.1 設定 `astro.config.mjs` GitHub Pages 配置（site、base）
- [x] 1.2 建立 `.github/workflows/deploy.yml` GitHub Actions 部署流程
- [x] 1.3 更新 `.gitignore` 排除建置產物
- [x] 1.4 建立 `CLAUDE.md` 專案記憶檔

## 2. 設計系統

- [x] 2.1 建立 `src/styles/design-system.css` 設計系統變數
- [x] 2.2 定義色彩系統（背景、文字、強調色、發光效果）
- [x] 2.3 定義字型系統（IBM Plex Sans/Mono + Noto Sans TC）
- [x] 2.4 定義間距系統（5 級制：xs/sm/md/lg/xl）
- [x] 2.5 定義動畫變數（緩動函數、時長）

## 3. 基礎佈局

- [x] 3.1 建立 `src/layouts/BaseLayout.astro` 基礎佈局
- [x] 3.2 整合 Google Fonts 載入
- [x] 3.3 建立星座畫布 SVG 容器與濾鏡定義
- [x] 3.4 實作進度指示導航組件
- [x] 3.5 實作 CLI 鏡像組件

## 4. 捲動引擎

- [x] 4.1 整合 GSAP 與 ScrollTrigger
- [x] 4.2 實作章節進入/離開觸發邏輯
- [x] 4.3 實作 CLI 鏡像更新函數（淡出/更新/淡入）
- [x] 4.4 實作進度指示更新函數
- [x] 4.5 實作章節淡入動畫（.reveal, .reveal-title）

## 5. 章節內容

- [x] 5.1 建立序章（intro）：標題與專案介紹
- [x] 5.2 建立第一章（ch1-root）：秩序的紮根
- [x] 5.3 建立第二章（ch2-trunk）：線性的累積
- [x] 5.4 建立第三章（ch3-branch）：維度的偏轉
- [x] 5.5 建立第四章（ch4-sync）：空間的共鳴
- [x] 5.6 建立第五章（ch5-issue）：任務的可視化
- [x] 5.7 建立第六章（ch6-pr）：自我審查的儀式
- [x] 5.8 建立第七章（ch7-merge）：邏輯的歸一
- [x] 5.9 建立結語（next-steps）：下一步行動

## 6. 響應式與無障礙

- [x] 6.1 實作行動版樣式（< 768px）
- [x] 6.2 實作 CLI 鏡像響應式位置（底部/右側）
- [x] 6.3 實作進度指示響應式顯示（行動版隱藏）
- [x] 6.4 實作 `prefers-reduced-motion` 支援
- [x] 6.5 實作 `:focus-visible` 焦點樣式
- [x] 6.6 加入 `aria-live` 螢幕閱讀器支援

## 7. 驗證與部署

- [x] 7.1 本地建置測試（`npm run build`）
- [x] 7.2 推送至 GitHub 並觸發部署
- [x] 7.3 驗證 GitHub Pages 正常顯示
