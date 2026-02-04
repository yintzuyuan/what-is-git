## 1. 型別與資料結構

- [x] 1.1 建立 `src/scripts/constellation.ts` 檔案
- [x] 1.2 定義 Star、Line、ConstellationState 型別
- [x] 1.3 定義各章節的星座狀態配置 (chapterStates)

## 2. SVG 渲染系統

- [x] 2.1 實作 createStar() 函數：生成 SVG circle 元素
- [x] 2.2 實作 createLine() 函數：生成 SVG path/line 元素
- [x] 2.3 實作 createCurvedLine() 函數：生成 SVG quadratic bezier 曲線
- [x] 2.4 實作星點類型樣式對應（main/feature/merge/conflict）
- [x] 2.5 實作連線類型樣式對應

## 3. 動畫系統

- [x] 3.1 實作 animateStarIn() 函數：星點淡入放大動畫
- [x] 3.2 實作 animateStarOut() 函數：星點淡出縮小動畫
- [x] 3.3 實作 animateLineGrow() 函數：連線生長動畫（stroke-dashoffset）
- [x] 3.4 實作 animateLineRemove() 函數：連線移除動畫
- [ ] 3.5 實作 conflict 星點脈動動畫

## 4. 狀態管理

- [x] 4.1 實作狀態差異計算函數 (diffStates)
- [x] 4.2 實作狀態轉換函數 (transitionTo)
- [x] 4.3 實作 GSAP Timeline 協調多元素動畫

## 5. 座標系統

- [x] 5.1 實作相對座標轉換函數 (relativeToAbsolute)
- [x] 5.2 實作視窗 resize 處理（debounced 重新計算）
- [x] 5.3 調整各章節星點相對座標配置

## 6. ScrollTrigger 整合

- [x] 6.1 修改 BaseLayout.astro 引入 constellation 模組
- [x] 6.2 在 ScrollTrigger onEnter/onEnterBack 回呼中加入星座更新
- [ ] 6.3 測試前進與後退捲動的狀態轉換

## 7. 無障礙與效能

- [x] 7.1 實作 prefers-reduced-motion 檢測與處理
- [ ] 7.2 效能測試與優化（確保 60fps 捲動）
- [x] 7.3 確認 aria-hidden 正確套用

## 8. 各章節星座配置

- [x] 8.1 ch1-root：單一根節點
- [x] 8.2 ch2-trunk：main 分支線性生長（3-4 commits）
- [x] 8.3 ch3-branch：feature 分支分離
- [x] 8.4 ch4-sync：遠端副本視覺化
- [x] 8.5 ch5-issue：維持 ch4 狀態
- [x] 8.6 ch6-pr：準備合併視覺
- [x] 8.7 ch7-merge：合併完成
- [x] 8.8 next-steps：完整星座展示

## 9. 測試與調整

- [ ] 9.1 本地測試所有章節轉換
- [ ] 9.2 測試行動版顯示
- [ ] 9.3 微調動畫時序與緩動
- [ ] 9.4 建置並部署測試
