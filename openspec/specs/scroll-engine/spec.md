# scroll-engine Specification

## Purpose
TBD - created by archiving change foundation-setup. Update Purpose after archive.
## Requirements
### Requirement: 使用 GSAP ScrollTrigger 驅動捲動
系統 SHALL 使用 GSAP ScrollTrigger 作為捲動動畫引擎，監聽各章節的進入與離開事件。

#### Scenario: ScrollTrigger 正確初始化
- **WHEN** 頁面載入完成
- **THEN** GSAP 與 ScrollTrigger 已註冊並可運作

#### Scenario: 章節進入觸發
- **WHEN** 使用者捲動至章節中心點
- **THEN** 觸發 `onEnter` 回呼，更新 CLI 鏡像與進度指示

### Requirement: 章節淡入動畫
系統 SHALL 為每個章節內的元素提供淡入動畫效果：
- `.reveal` 類別：從下方 30px 淡入
- `.reveal-title` 類別：從下方 40px 淡入
- 動畫時長：1000ms (--duration-slower)
- 緩動函數：cubic-bezier(0.16, 1, 0.3, 1)

#### Scenario: 章節內容淡入
- **WHEN** 章節進入視窗
- **THEN** 帶有 `.reveal` 類別的元素依序淡入顯示

#### Scenario: 延遲淡入支援
- **WHEN** 元素同時帶有 `.reveal` 與 `.reveal-delay-N` 類別
- **THEN** 該元素延遲 N * 100ms 後開始動畫

### Requirement: 減少動畫偏好支援
系統 SHALL 尊重使用者的 `prefers-reduced-motion` 設定。

#### Scenario: 減少動畫模式啟用
- **WHEN** 使用者系統設定為 `prefers-reduced-motion: reduce`
- **THEN** 所有動畫與過渡效果被停用，內容直接顯示

### Requirement: 平滑捲動
系統 SHALL 支援平滑捲動行為：`scroll-behavior: smooth`

#### Scenario: 點擊導航平滑捲動
- **WHEN** 使用者點擊進度指示點
- **THEN** 頁面平滑捲動至對應章節

