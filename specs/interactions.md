# 互動行為規格

## 核心機制：Scrollytelling

使用者向下捲動，觸發以下行為：
1. 章節內容淡入
2. CLI 鏡像更新
3. 進度指示更新
4. 星座視覺化演進（Phase 3+）

## 章節觸發邏輯

### ScrollTrigger 設定

```javascript
ScrollTrigger.create({
  trigger: chapter,
  start: 'top center',    // 章節頂部到達視窗中央時觸發
  end: 'bottom center',   // 章節底部離開視窗中央時結束
  onEnter: () => {
    revealChapter(chapter);
    updateCli(chapter.dataset.cli);
    updateProgress(index);
  },
  onEnterBack: () => {
    updateCli(chapter.dataset.cli);
    updateProgress(index);
  },
});
```

### 章節淡入動畫

```javascript
// 元素初始狀態
.reveal {
  opacity: 0;
  transform: translateY(40px);
}

// 可見狀態
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

// 標題特殊效果（加上模糊）
.reveal-title {
  opacity: 0;
  transform: translateY(60px);
  filter: blur(10px);
}

.reveal-title.is-visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}
```

### 延遲交錯

```css
.reveal-delay-1 { transition-delay: 100ms; }
.reveal-delay-2 { transition-delay: 200ms; }
.reveal-delay-3 { transition-delay: 300ms; }
.reveal-delay-4 { transition-delay: 400ms; }
.reveal-delay-5 { transition-delay: 500ms; }
```

## CLI 鏡像行為

### 更新邏輯

1. 當前 CLI 淡出（opacity: 0, y: 10）
2. 更新文字內容
3. 新 CLI 淡入（opacity: 1, y: 0）

### 無指令時

- 序章和結尾沒有 `data-cli` 屬性
- CLI 鏡像隱藏（移除 `.is-visible` class）

## 進度指示行為

### 狀態切換

```javascript
progressDots.forEach((dot, i) => {
  dot.classList.toggle('is-active', i === activeIndex);
});
```

### 活躍狀態樣式

```css
.progress__dot.is-active {
  background: var(--star-cyan);
  box-shadow: var(--glow-cyan);
}
```

### 點擊導航

- 點擊進度點可跳轉到對應章節
- 使用平滑捲動：`scroll-behavior: smooth`

## 星座視覺化行為（Phase 3）

### 視覺元素

1. **背景星點**：靜態裝飾，低透明度
2. **主線（Trunk）**：垂直向上生長
3. **分支線**：從主線偏轉
4. **節點（Commits）**：發光圓點
5. **合併點**：兩線交會處

### 各章節視覺演進

| 章節 | 視覺變化 |
|------|----------|
| 序章 | 僅背景星點 |
| 第一章 | 出現第一個節點（origin） |
| 第二章 | 主線向上生長，新增 2-3 個節點 |
| 第三章 | 分支線從主線偏轉 |
| 第四章 | 右側出現「遠端」虛影 |
| 第五章 | 出現任務標籤連結線 |
| 第六章 | 分支前端出現「PR 檢查站」 |
| 第七章 | 分支線合併回主線 |
| 結尾 | 完整星座圖淡出 |

### 動畫時序

- 線條生長：使用 `stroke-dashoffset` 動畫
- 節點出現：scale(0) → scale(1) + 發光
- 整體與捲動同步（scrub: true）

## 響應式行為

### 桌面版（≥1024px）

- CLI 鏡像：右側中央
- 進度指示：左側中央
- 星座視覺化：全螢幕背景

### 行動版（<1024px）

- CLI 鏡像：底部中央
- 進度指示：隱藏
- 星座視覺化：簡化或隱藏

## 無障礙行為

### 減少動畫模式

```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .reveal-title {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
```

### 鍵盤導航

- Tab 可聚焦進度指示點
- Enter/Space 可觸發跳轉
- 焦點樣式清晰可見
