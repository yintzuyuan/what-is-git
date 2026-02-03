# cli-mirror Specification

## Purpose
TBD - created by archiving change foundation-setup. Update Purpose after archive.
## Requirements
### Requirement: CLI 鏡像顯示對應指令
系統 SHALL 在畫面固定位置顯示 CLI 鏡像組件，隨捲動進度顯示當前章節對應的 Git 指令。

#### Scenario: 有指令的章節
- **WHEN** 使用者捲動至帶有 `data-cli` 屬性的章節
- **THEN** CLI 鏡像顯示該屬性值作為指令

#### Scenario: 無指令的章節
- **WHEN** 使用者捲動至不帶 `data-cli` 屬性的章節
- **THEN** CLI 鏡像淡出隱藏

### Requirement: CLI 鏡像位置響應式
系統 SHALL 根據螢幕尺寸調整 CLI 鏡像位置：
- **行動版 (< 1024px)**：固定於底部中央
- **桌面版 (≥ 1024px)**：固定於右側中央

#### Scenario: 桌面版位置
- **WHEN** 視窗寬度 ≥ 1024px
- **THEN** CLI 鏡像固定於右側中央，垂直排列

#### Scenario: 行動版位置
- **WHEN** 視窗寬度 < 1024px
- **THEN** CLI 鏡像固定於底部中央，水平排列

### Requirement: CLI 鏡像淡化呈現
系統 SHALL 以淡化樣式呈現 CLI 鏡像，不搶走主視覺焦點：
- 使用等寬字型 (--font-mono)
- 字級較小 (0.8125rem 桌面版 / 0.75rem 行動版)
- 低對比度文字色 (--text-ghost / --text-secondary)
- 半透明背景與模糊效果

#### Scenario: 視覺樣式正確
- **WHEN** CLI 鏡像顯示
- **THEN** 使用等寬字型，呈現低調的終端機風格

### Requirement: CLI 鏡像過渡動畫
系統 SHALL 為 CLI 鏡像切換提供平滑過渡動畫。

#### Scenario: 指令切換動畫
- **WHEN** 從一個章節捲動至另一個章節
- **THEN** CLI 鏡像先淡出下移，更新內容後淡入歸位

### Requirement: CLI 鏡像無障礙
系統 SHALL 使用 `aria-live="polite"` 讓螢幕閱讀器通知指令更新。

#### Scenario: 螢幕閱讀器通知
- **WHEN** CLI 鏡像內容更新
- **THEN** 螢幕閱讀器以禮貌方式宣告新指令

