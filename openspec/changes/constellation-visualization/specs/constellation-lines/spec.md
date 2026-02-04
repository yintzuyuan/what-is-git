## ADDED Requirements

### Requirement: 連線代表 Commit 關係
系統 SHALL 使用 SVG path 或 line 元素連接相關的星點，表示 commit 之間的父子關係。

#### Scenario: 連線正確渲染
- **WHEN** 兩個星點建立連接
- **THEN** 在 `#constellation-lines` 容器內生成連接線元素

#### Scenario: 連線端點對齊
- **WHEN** 連線渲染
- **THEN** 連線端點精確對齊至對應星點中心

### Requirement: 連線類型樣式
系統 SHALL 根據連線類型套用不同視覺樣式：
- **main**：青色 (#5eead4)，實線，opacity 0.4
- **feature**：紫色 (#c4b5fd)，實線，opacity 0.3
- **merge**：漸層（feature 色 → main 色），opacity 0.5

#### Scenario: Main 分支連線
- **WHEN** 連線類型為 main
- **THEN** 使用 `--star-cyan` 青色，stroke-width 1.5px

#### Scenario: Feature 分支連線
- **WHEN** 連線類型為 feature
- **THEN** 使用 `--star-purple` 紫色，stroke-width 1.5px

### Requirement: 連線繪製動畫
系統 SHALL 為連線提供「生長」動畫效果，從起點星點向終點星點繪製。
- 使用 SVG stroke-dasharray 與 stroke-dashoffset 技術
- 動畫時長：400-600ms
- 緩動函數：ease-out

#### Scenario: 連線生長動畫
- **WHEN** 連線首次顯示
- **THEN** 從起點星點開始，動畫繪製至終點星點

### Requirement: 連線層級
系統 SHALL 確保連線繪製在星點下方（z-index 較低），避免遮擋星點。

#### Scenario: 連線不遮擋星點
- **WHEN** 連線與星點同時顯示
- **THEN** 星點始終顯示在連線上方

### Requirement: 曲線連線支援
系統 SHALL 支援曲線連線（用於分支分離與合併的視覺效果），使用 SVG quadratic 或 cubic bezier 曲線。

#### Scenario: 分支分離曲線
- **WHEN** feature 分支從 main 分離
- **THEN** 使用曲線而非直線，呈現平滑的分離視覺

#### Scenario: 合併曲線
- **WHEN** feature 分支合併回 main
- **THEN** 使用曲線呈現兩線交會的視覺效果
