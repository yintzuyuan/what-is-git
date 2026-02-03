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

## 開發指令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置靜態檔案
npm run preview  # 預覽建置結果
```

## 部署

- 推送到 `main` 分支自動觸發 GitHub Actions 部署
- 網址：https://yintzuyuan.github.io/what-is-git/

## 實作計畫

### Phase 0：專案初始化 ✓
- [x] 建立專案目錄
- [x] 初始化 Git 儲存庫
- [x] 建立 GitHub 遠端儲存庫
- [x] 初始化 Astro 專案
- [x] 設定 GitHub Pages 部署

### Phase 1：規格撰寫（OpenSpec）
- [ ] 撰寫核心規格文件
- [ ] 定義各章節的互動行為規格
- [ ] 定義設計系統規格

### Phase 2：設計系統
- [ ] 定義色彩變數（深色背景 + 發光線條）
- [ ] 選擇字型（中英文雙語考量）
- [ ] 建立基礎 CSS 架構

### Phase 3：核心動畫引擎
- [ ] 整合 GSAP ScrollTrigger
- [ ] 建立「節點」與「路徑」的基礎組件
- [ ] 實作捲動驅動的生長動畫

### Phase 4：章節內容
- [ ] 第一章：秩序的紮根 (git init)
- [ ] 第二章：線性的累積 (git commit)
- [ ] 第三章：維度的偏轉 (git checkout -b)
- [ ] 第四章：空間的共鳴 (git push)
- [ ] 第五章：任務的可視化 (gh issue)
- [ ] 第六章：自我審查的儀式 (gh pr)
- [ ] 第七章：邏輯的歸一 (git merge)
- [ ] 結尾：下一步（工具推薦）

### Phase 5：番外篇（多人模式）
- [ ] 番外一：複製他人的世界 (Fork)
- [ ] 番外二：向他人貢獻 (Contribution)
- [ ] 番外三：共同審查 (Code Review)

### Phase 6：測試與優化
- [ ] 跨瀏覽器測試
- [ ] 手機版適配
- [ ] 效能優化
- [ ] 無障礙檢查
