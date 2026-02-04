## ADDED Requirements

### Requirement: 章節對應星座狀態
系統 SHALL 定義每個章節對應的星座狀態，包含該章節應顯示的星點與連線配置。

| 章節 | 星座狀態 |
|------|----------|
| intro | 無動態元素 |
| ch1-root | 單一 main 星點（根節點） |
| ch2-trunk | main 分支線性生長（3-4 個 commit） |
| ch3-branch | feature 分支從 main 分離 |
| ch4-sync | 遠端副本視覺（虛線連接） |
| ch5-issue | 無新增（保持 ch4 狀態） |
| ch6-pr | 準備合併視覺（feature 指向 main） |
| ch7-merge | 合併完成，feature 合入 main |
| next-steps | 完整星座展示 |

#### Scenario: 第一章星座狀態
- **WHEN** 使用者捲動至 ch1-root
- **THEN** 顯示單一 main 類型星點作為根節點

#### Scenario: 第三章星座狀態
- **WHEN** 使用者捲動至 ch3-branch
- **THEN** 顯示 feature 分支從 main 分離的視覺

#### Scenario: 第七章星座狀態
- **WHEN** 使用者捲動至 ch7-merge
- **THEN** 顯示 feature 合併回 main 的完整視覺

### Requirement: ScrollTrigger 整合
系統 SHALL 使用 GSAP ScrollTrigger 控制星座動畫時間軸，與章節捲動同步。

#### Scenario: 捲動觸發星座更新
- **WHEN** 使用者捲動至新章節
- **THEN** 星座狀態平滑過渡至該章節對應配置

#### Scenario: 反向捲動
- **WHEN** 使用者向上捲動回到前一章節
- **THEN** 星座狀態回退至前一章節配置

### Requirement: 動畫時間軸
系統 SHALL 為每個章節轉換建立動畫時間軸，確保多個元素的動畫協調一致：
- 先顯示星點，再繪製連線
- 動畫之間有適當延遲（stagger）
- 整體過渡時長 800-1200ms

#### Scenario: 時間軸順序
- **WHEN** 章節轉換觸發新星點與連線
- **THEN** 星點先淡入，連線再生長

### Requirement: 減少動畫偏好
系統 SHALL 在 `prefers-reduced-motion: reduce` 時跳過星座動畫，直接顯示最終狀態。

#### Scenario: 減少動畫模式
- **WHEN** 使用者啟用減少動畫偏好
- **THEN** 星座直接顯示目標狀態，不執行過渡動畫
