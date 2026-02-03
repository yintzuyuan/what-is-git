# design-system Specification

## Purpose
TBD - created by archiving change foundation-setup. Update Purpose after archive.
## Requirements
### Requirement: 色彩系統與主網站一致
系統 SHALL 使用與 erikyin.net 深色模式一致的色彩系統：
- 主背景：`#1a1a1a` (--ink-black)
- 深層背景：`#0f0f12` (--deep-black)
- 文字主色：`#e8e6e0` (--text-primary)
- 邊框：`rgba(248, 246, 240, 0.2)` (--border)

系統 SHALL 定義星點強調色系：
- 青色：`#5eead4` (--star-cyan) — 主分支、主要元素
- 紫色：`#c4b5fd` (--star-purple) — Feature 分支
- 金色：`#fcd34d` (--star-gold) — 合併成功
- 玫瑰：`#fb7185` (--star-rose) — 衝突警示

#### Scenario: 深色背景正確顯示
- **WHEN** 使用者載入頁面
- **THEN** 背景色為 `#1a1a1a`，與主網站深色模式一致

#### Scenario: 強調色正確套用
- **WHEN** 主分支相關元素顯示
- **THEN** 使用 `--star-cyan` 青色

### Requirement: 字型系統與主網站一致
系統 SHALL 使用與 erikyin.net 完全相同的字型堆疊：
- 基礎字型：`"IBM Plex Sans", "Noto Sans TC", -apple-system, BlinkMacSystemFont, "Microsoft JhengHei", "PingFang TC", sans-serif`
- 等寬字型：`"IBM Plex Mono", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

#### Scenario: 中英文字型正確顯示
- **WHEN** 頁面包含中英文混排內容
- **THEN** 英文使用 IBM Plex Sans，中文使用 Noto Sans TC

#### Scenario: 程式碼字型正確顯示
- **WHEN** `<code>` 元素顯示
- **THEN** 使用 IBM Plex Mono 字型

### Requirement: 間距系統採用 5 級制
系統 SHALL 使用與 erikyin.net 一致的 5 級間距系統：
- `--space-xs`: 0.25rem (4px)
- `--space-sm`: 0.5rem (8px)
- `--space-md`: 1rem (16px)
- `--space-lg`: 2rem (32px)
- `--space-xl`: 3rem (48px)

#### Scenario: 間距變數可用
- **WHEN** CSS 樣式使用間距變數
- **THEN** 所有 5 級間距變數皆可正常解析

### Requirement: 行高設定一致
系統 SHALL 使用與 erikyin.net 一致的行高：`line-height: 1.75`

#### Scenario: 內文行高正確
- **WHEN** 段落文字顯示
- **THEN** 行高為 1.75 倍字級

