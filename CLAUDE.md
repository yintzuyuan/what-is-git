<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always use `/opsx:*` skills when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Quick reference:
- `/opsx:new` - Start a new change
- `/opsx:continue` - Continue working on a change
- `/opsx:apply` - Implement tasks

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# 什麼是 Git？

## 專案概述

讓創意工作者「看懂」Git 版本控制概念的互動式 Scrollytelling 網站。

## 技術棧

- **框架**：Astro（靜態輸出）
- **動畫**：GSAP + ScrollTrigger
- **部署**：GitHub Pages

## 開發指令

```bash
npm run dev      # 開發伺服器
npm run build    # 建置
npm run preview  # 預覽建置結果
```

## 設計系統

與主網站 erikyin.net 一致：
- 字型：IBM Plex Sans/Mono + Noto Sans TC
- 間距：5 級制（xs/sm/md/lg/xl）
- 行高：1.75
- 背景：#1a1a1a（深色主題）

## 專案進度

- [x] Phase 0：專案初始化
- [x] Phase 1：規格撰寫（已遷移至 OpenSpec）
- [x] Phase 2：設計系統
- [x] Phase 3：核心動畫引擎
- [ ] Phase 4：星座視覺化動畫
- [ ] Phase 5：番外篇（Fork、貢獻、Code Review）
- [ ] Phase 6：測試與優化

## OpenSpec 規格

目前已定義的 capabilities：
- `design-system`：色彩、字型、間距系統
- `scroll-engine`：GSAP ScrollTrigger 捲動引擎
- `cli-mirror`：CLI 指令鏡像組件
- `chapter-structure`：章節內容結構
