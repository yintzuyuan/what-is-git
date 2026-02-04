## Context

星座視覺化是「什麼是 Git？」的核心視覺特色。目前 BaseLayout.astro 已有：
- SVG 畫布容器 (`.constellation-canvas`)
- 發光濾鏡定義 (`glow-cyan`, `glow-purple`, `glow-gold`, `glow-rose`)
- 靜態背景星點
- 動態元素容器 (`#constellation-lines`, `#constellation-stars`)

需要實作動態星點與連線系統，並與 ScrollTrigger 整合。

## Goals / Non-Goals

**Goals:**
- 實作 SVG 動態星點生成與動畫
- 實作 SVG 連線繪製與生長動畫
- 整合 ScrollTrigger 控制動畫時間軸
- 支援 7 個教學章節的星座狀態轉換
- 效能優化，確保動畫流暢

**Non-Goals:**
- 3D 視覺效果（保持 2D 平面風格）
- 使用者互動（點擊、拖曳星點）
- Canvas 實作（維持 SVG 方案）
- 行動版特殊手勢

## Decisions

### D1: 使用純 SVG 而非 Canvas

**選擇**：SVG
**理由**：
- 元素數量有限（< 50 個動態元素），SVG 效能足夠
- SVG 濾鏡（發光效果）已定義，可直接使用
- GSAP 對 SVG 屬性動畫支援極佳
- 更好的無障礙支援（雖然標記為 aria-hidden）

**替代方案**：
- Canvas：對大量粒子效能更好，但增加複雜度
- WebGL：過度工程化

### D2: 星座資料結構

**選擇**：宣告式章節狀態配置
```typescript
interface ConstellationState {
  stars: Star[];
  lines: Line[];
}

interface Star {
  id: string;
  x: number;
  y: number;
  type: 'main' | 'feature' | 'merge' | 'conflict';
}

interface Line {
  from: string;  // star id
  to: string;    // star id
  type: 'main' | 'feature' | 'merge';
  curved?: boolean;
}

const chapterStates: Record<string, ConstellationState> = {
  'ch1-root': { stars: [...], lines: [...] },
  // ...
};
```

**理由**：
- 資料與渲染邏輯分離
- 容易維護與調整
- 支援狀態差異計算（新增/移除元素）

### D3: 動畫控制策略

**選擇**：GSAP Timeline + 狀態差異
**理由**：
- 計算當前狀態與目標狀態的差異
- 為新增元素建立進入動畫
- 為移除元素建立離開動畫（或直接隱藏）
- 使用 GSAP timeline 協調多元素動畫

**替代方案**：
- 每次重繪所有元素：效能差，動畫不連貫
- CSS Transitions：對 SVG 屬性支援有限

### D4: 座標系統

**選擇**：相對座標 (0-100) + 動態計算實際位置
**理由**：
- 星座配置使用相對座標（0-100 範圍）
- 根據視窗尺寸動態計算實際 SVG 座標
- 響應式調整時只需重新計算，不需修改配置

**計算邏輯**：
```typescript
const actualX = (relativeX / 100) * viewportWidth;
const actualY = (relativeY / 100) * viewportHeight;
```

### D5: 檔案組織

**選擇**：單一 TypeScript 模組
```
src/scripts/constellation.ts
├── types          // 型別定義
├── config         // 章節狀態配置
├── renderer       // SVG 渲染函數
├── animator       // GSAP 動畫函數
└── controller     // 主控制器（對外介面）
```

**理由**：
- 功能內聚，避免過度拆分
- 單一進入點，易於與 BaseLayout 整合
- 未來可視需要拆分為多檔案

## Risks / Trade-offs

### R1: SVG 元素過多影響效能
**風險**：若星點與連線數量過多，可能影響捲動效能
**緩解**：
- 限制每個狀態的元素數量（建議 < 30 個星點）
- 使用 GSAP 的 `will-change` 優化
- 離開視窗的元素設為 `visibility: hidden`

### R2: 反向捲動動畫複雜度
**風險**：使用者向上捲動時，動畫需反向執行或重置
**緩解**：
- 採用狀態機模式，每個章節都是獨立狀態
- 反向捲動時直接轉換到目標狀態，不需「反播」動畫

### R3: 響應式座標同步
**風險**：視窗縮放時可能導致動畫中的元素位置錯誤
**緩解**：
- 視窗 resize 時重新計算座標
- 動畫期間禁用 resize 重新計算（或使用 debounce）

## Open Questions

1. **星點精確位置**：需要視覺設計稿確定每個章節的星點佈局？還是程式動態生成？
   - **建議**：先以程式動態生成合理佈局，後續可微調

2. **第四章遠端視覺**：「遠端副本」如何視覺化？虛線框？鏡像複製？
   - **建議**：使用虛線連接至右側區域的半透明複製

3. **動畫精細度**：每個章節的動畫應有多精細？是否需要分段動畫？
   - **建議**：MVP 先做章節進入時的一次性動畫，後續可增加細節
