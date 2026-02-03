# 設計系統規格

## 設計原則

**與主網站 (erikyin.net) 一致**
- 延續相同的字型系統（IBM Plex 系列）
- 延續相同的間距系統（5 級）
- 延續相同的行高（1.75）
- 調整為深色主題，但保持視覺語言一致

## 色彩系統

### 背景（基於主網站深色模式）

```css
--ink-black: #1a1a1a;   /* 主背景，與主網站深色模式一致 */
--deep-black: #0f0f12;  /* 更深的層次 */
--void: #08080c;        /* 最深層 */
```

### 星點強調色

```css
--star-cyan: #5eead4;   /* 主分支、主要元素 */
--star-purple: #c4b5fd; /* Feature 分支 */
--star-gold: #fcd34d;   /* 合併成功 */
--star-rose: #fb7185;   /* 衝突警示 */
```

### 文字層次（基於主網站深色模式）

```css
--text-bright: #ffffff;   /* 標題、強調 */
--text-primary: #e8e6e0;  /* 主要內文，與主網站一致 */
--text-secondary: #9ca3af; /* 次要說明 */
--text-ghost: #6b7280;    /* 最淡的提示 */
```

### 邊框（基於主網站深色模式）

```css
--border: rgba(248, 246, 240, 0.2);  /* 與主網站一致 */
--border-light: #374151;
```

## 字型系統（與主網站完全一致）

```css
/* 基礎字型 */
--font-base: "IBM Plex Sans", "Noto Sans TC", -apple-system, BlinkMacSystemFont, "Microsoft JhengHei", "PingFang TC", sans-serif;

/* 等寬字型 */
--font-mono: "IBM Plex Mono", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
```

## 間距系統（與主網站完全一致）

```css
--space-xs: 0.25rem;  /* 4px */
--space-sm: 0.5rem;   /* 8px */
--space-md: 1rem;     /* 16px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
```

## 排版

### 行高

```css
line-height: 1.75;  /* 與主網站一致 */
```

### 字級

```css
h1: clamp(2rem, 6vw, 2.5rem);
h2: 1.5rem;
h3: 1.125rem;
body: 1rem;
```

### 字重

```css
h1-h6: font-weight: 400;
strong: font-weight: 600;
```

## 佈局

### 內容寬度

```css
--content-width: 42rem;  /* 與主網站一致 */
```

### 章節容器

- 最小高度：100vh（100dvh for mobile）
- 垂直置中對齊
- 水平 padding：響應式調整

### CLI 鏡像位置

- **桌面版**：固定於右側中央
- **行動版**：固定於底部中央

### 進度指示

- **桌面版**：固定於左側中央，垂直排列的圓點
- **行動版**：隱藏

## 響應式斷點

```css
/* 行動版 */
@media (max-width: 768px) { }

/* 桌面版 */
@media (min-width: 1024px) { }
```

## 無障礙需求

### 減少動畫

```css
@media (prefers-reduced-motion: reduce) {
  /* 停用所有動畫和過渡 */
}
```

### 焦點樣式

```css
:focus-visible {
  outline: 2px solid var(--star-cyan);
  outline-offset: 4px;
}
```

### 螢幕閱讀器

- 所有章節使用語義化 HTML（section, h1-h3）
- CLI 鏡像使用 `aria-live="polite"` 通知更新
- 進度指示使用 `aria-label` 描述
