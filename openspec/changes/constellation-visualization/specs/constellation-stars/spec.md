## ADDED Requirements

### Requirement: 星點代表 Commit
系統 SHALL 使用 SVG 圓形元素代表 Git commit，每個星點具有：
- 唯一識別 ID
- 座標位置 (x, y)
- 星點類型（main / feature / merge / conflict）
- 對應的章節 ID

#### Scenario: 星點正確渲染
- **WHEN** 星點被加入星座系統
- **THEN** 在 `#constellation-stars` 容器內生成對應的 SVG circle 元素

#### Scenario: 星點類型對應樣式
- **WHEN** 星點類型為 main
- **THEN** 使用 `--star-cyan` 青色與 `glow-cyan` 濾鏡

### Requirement: 星點類型樣式
系統 SHALL 根據星點類型套用不同視覺樣式：
- **main**：青色 (#5eead4)，半徑 4-6px
- **feature**：紫色 (#c4b5fd)，半徑 3-5px
- **merge**：金色 (#fcd34d)，半徑 6-8px，較強發光
- **conflict**：玫瑰色 (#fb7185)，脈動動畫

#### Scenario: Feature 分支星點
- **WHEN** 星點類型為 feature
- **THEN** 使用 `--star-purple` 紫色與 `glow-purple` 濾鏡

#### Scenario: Merge 星點
- **WHEN** 星點類型為 merge
- **THEN** 使用 `--star-gold` 金色與 `glow-gold` 濾鏡，半徑較大

#### Scenario: Conflict 星點
- **WHEN** 星點類型為 conflict
- **THEN** 使用 `--star-rose` 玫瑰色，套用 pulse 脈動動畫

### Requirement: 星點淡入動畫
系統 SHALL 為新出現的星點提供淡入動畫效果：
- 初始狀態：opacity 0, scale 0
- 最終狀態：opacity 1, scale 1
- 動畫時長：300-500ms
- 緩動函數：ease-out

#### Scenario: 星點出現動畫
- **WHEN** 星點首次顯示
- **THEN** 從透明縮小狀態淡入放大至正常尺寸

### Requirement: 星點響應式位置
系統 SHALL 根據視窗尺寸調整星點位置，確保在不同螢幕尺寸下視覺效果一致。

#### Scenario: 視窗縮放
- **WHEN** 視窗尺寸改變
- **THEN** 星點位置按比例調整，保持相對關係
