# chapter-structure Specification

## Purpose
TBD - created by archiving change foundation-setup. Update Purpose after archive.
## Requirements
### Requirement: 9 章節完整結構
系統 SHALL 包含 9 個章節，每個章節佔據至少 100vh 高度：
1. **序章 (intro)**：標題與專案介紹
2. **第一章 (ch1-root)**：秩序的紮根 — `git init`
3. **第二章 (ch2-trunk)**：線性的累積 — `git commit`
4. **第三章 (ch3-branch)**：維度的偏轉 — `git checkout -b`
5. **第四章 (ch4-sync)**：空間的共鳴 — `git push`
6. **第五章 (ch5-issue)**：任務的可視化 — GitHub Issue
7. **第六章 (ch6-pr)**：自我審查的儀式 — Pull Request
8. **第七章 (ch7-merge)**：邏輯的歸一 — `git merge`
9. **結語 (next-steps)**：下一步行動與工具推薦

#### Scenario: 所有章節存在
- **WHEN** 頁面載入
- **THEN** 9 個章節皆存在且可捲動瀏覽

#### Scenario: 章節最小高度
- **WHEN** 任一章節顯示
- **THEN** 該章節高度至少為 100vh (100dvh on mobile)

### Requirement: 章節內容結構一致
每個章節 SHALL 遵循一致的內容結構：
- `.chapter__eyebrow`：章節編號標籤
- `.chapter__title`：章節標題
- `.chapter__subtitle`：副標題（英文概念名）
- `.chapter__body`：內文內容

#### Scenario: 標準章節結構
- **WHEN** 顯示第一章至第七章
- **THEN** 包含 eyebrow、title、subtitle、body 四個區塊

#### Scenario: 特殊章節結構
- **WHEN** 顯示序章或結語
- **THEN** 可省略部分區塊，但保持視覺一致性

### Requirement: 章節水平垂直置中
每個章節 SHALL 將內容區塊水平與垂直置中顯示。

#### Scenario: 置中對齊
- **WHEN** 章節顯示
- **THEN** `.chapter__inner` 內容區塊在視窗中央

### Requirement: 內容最大寬度限制
章節內容 SHALL 限制最大寬度為 42rem (--content-width)，與主網站一致。

#### Scenario: 寬度限制生效
- **WHEN** 視窗寬度超過 42rem
- **THEN** 內容區塊維持 42rem 寬度，不會過度展開

### Requirement: 進度指示導航
系統 SHALL 在桌面版顯示進度指示點，供快速導航：
- 固定於左側中央
- 9 個圓點對應 9 個章節
- 當前章節以青色 (--star-cyan) 高亮
- 點擊可跳轉至對應章節

#### Scenario: 進度指示顯示（桌面版）
- **WHEN** 視窗寬度 ≥ 1024px
- **THEN** 進度指示點顯示於左側

#### Scenario: 進度指示隱藏（行動版）
- **WHEN** 視窗寬度 < 1024px
- **THEN** 進度指示點隱藏

#### Scenario: 點擊導航
- **WHEN** 使用者點擊進度指示點
- **THEN** 頁面平滑捲動至對應章節

### Requirement: 章節 CLI 指令對應
每個教學章節 SHALL 透過 `data-cli` 屬性定義對應的 Git 指令：
- ch1-root: `git init`
- ch2-trunk: `git commit -m "訊息"`
- ch3-branch: `git checkout -b feature`
- ch4-sync: `git push origin main`
- ch5-issue: `gh issue create`
- ch6-pr: `gh pr create`
- ch7-merge: `git merge feature`

#### Scenario: 指令對應正確
- **WHEN** 使用者捲動至第三章
- **THEN** CLI 鏡像顯示 `git checkout -b feature`

