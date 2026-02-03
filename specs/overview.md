# 什麼是 Git？— 核心規格

## 專案定位

**一句話定義**：讓創意工作者「看懂」Git 邏輯的引導式互動展示。

## 目標受眾

- 設計師、字型師、藝術家等創意工作者
- 可能完全沒用過版本控制
- 已有雲端備份的心智模型（Google Drive / Dropbox）

## 成功指標

看完展示後，使用者應該：
1. ✓ 建立 commit/branch/merge 的心智模型
2. ✓ 從「Git 好可怕」變成「原來就是這樣，我可以試試」
3. ✓ 認知到版本控制不是程式師專屬
4. ✗ 不需要立即能操作（這不是目標）

## 互動形式

**MVP：純 Scrollytelling**
- 使用者向下捲動，畫面自動演化
- 不提供自由探索模式（降低複雜度）

## 章節結構

### 主篇章（7 章 + 結尾）

| 章節 | 標題 | 概念 | CLI 鏡像 |
|------|------|------|----------|
| 序章 | 什麼是 Git？ | 引言 | - |
| 第一章 | 秩序的紮根 | git init | `git init` |
| 第二章 | 線性的累積 | git commit | `git commit -m "訊息"` |
| 第三章 | 維度的偏轉 | git checkout -b | `git checkout -b feature` |
| 第四章 | 空間的共鳴 | git push | `git push origin main` |
| 第五章 | 任務的可視化 | GitHub Issue | `gh issue create` |
| 第六章 | 自我審查的儀式 | Pull Request | `gh pr create` |
| 第七章 | 邏輯的歸一 | git merge | `git merge feature` |
| 結尾 | 下一步 | 工具推薦 | - |

### 番外篇（Phase 5）

| 章節 | 標題 | 概念 |
|------|------|------|
| 番外一 | 複製他人的世界 | Fork |
| 番外二 | 向他人貢獻 | Contribution |
| 番外三 | 共同審查 | Code Review |

## 技術需求

- 靜態網站（GitHub Pages 託管）
- 捲動驅動動畫（GSAP ScrollTrigger）
- 響應式設計（桌面 + 行動）
- 無障礙支援（prefers-reduced-motion）
