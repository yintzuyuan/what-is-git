/**
 * 星座視覺化系統
 * 將 Git 概念視覺化為星點（commit）與連線（關係）
 */

import { gsap } from 'gsap';

// ═══════════════════════════════════════════════════════════════
// 型別定義
// ═══════════════════════════════════════════════════════════════

export type StarType = 'main' | 'feature' | 'merge' | 'conflict' | 'hero' | 'remote';
export type LineType = 'main' | 'feature' | 'merge' | 'remote';
export type LabelType = 'issue' | 'pr' | 'merged';
export type LabelPosition = 'left' | 'right' | 'top' | 'bottom';

export interface Star {
  id: string;
  x: number; // 相對座標 0-100
  y: number; // 相對座標 0-100
  type: StarType;
  radius?: number; // 可選，預設依類型決定
  message?: string; // 可選：提交訊息（打字機效果顯示）
}

export interface Line {
  id: string;
  from: string; // star id
  to: string; // star id
  type: LineType;
}

export interface Label {
  id: string;
  anchorStar: string; // 依附的星點 ID
  position: LabelPosition;
  type: LabelType;
  title: string;
  body: string;
}

export interface ConstellationState {
  stars: Star[];
  lines: Line[];
  labels?: Label[];
}

// ═══════════════════════════════════════════════════════════════
// 樣式配置
// ═══════════════════════════════════════════════════════════════

const STAR_STYLES: Record<StarType, { fill: string; filter: string; radius: number }> = {
  main: { fill: '#5eead4', filter: 'url(#glow-cyan)', radius: 8 },
  feature: { fill: '#c4b5fd', filter: 'url(#glow-purple)', radius: 7 },
  merge: { fill: '#fcd34d', filter: 'url(#glow-gold)', radius: 12 },
  conflict: { fill: '#fb7185', filter: 'url(#glow-rose)', radius: 8 },
  hero: { fill: '#5eead4', filter: 'url(#glow-cyan)', radius: 10 }, // 第一章專用，較大
  remote: { fill: '#94a3b8', filter: 'url(#glow-slate)', radius: 6 }, // 遠端副本：較淡的藍灰色，較小
};

const LINE_STYLES: Record<LineType, { stroke: string; opacity: number }> = {
  main: { stroke: '#5eead4', opacity: 0.5 },
  feature: { stroke: '#c4b5fd', opacity: 0.4 },
  merge: { stroke: '#fcd34d', opacity: 0.6 },
  remote: { stroke: '#94a3b8', opacity: 0.25 }, // 遠端副本：較淡
};

// ═══════════════════════════════════════════════════════════════
// 佈局配置 - 統一座標設計
// ═══════════════════════════════════════════════════════════════

const LAYOUT = {
  mainBranch: 70, // 主線 x 座標（70%，配合縮窄的內容區）
  featureOffset: 5, // feature 分支的水平偏移 → x: 75
  remoteOffset: 12, // 遠端副本的額外偏移 → x: 82
};

// 垂直座標計算
const Y_START = 76; // 起始 y 座標（底部）
const Y_SPACING = 7; // 節點間距
const getY = (level: number): number => Y_START - level * Y_SPACING;

// 統一的曲線半徑（viewBox 單位）
const CURVE_RADIUS = 60;

// ═══════════════════════════════════════════════════════════════
// 章節星座狀態配置
// ═══════════════════════════════════════════════════════════════

// 使用 LAYOUT 常數生成座標
const M = LAYOUT.mainBranch; // 主線 x 座標
const F = M + LAYOUT.featureOffset; // feature 分支 x 座標
const R = M + LAYOUT.remoteOffset; // 遠端副本 x 座標

export const chapterStates: Record<string, ConstellationState> = {
  intro: {
    stars: [],
    lines: [],
  },

  // ═══════════════════════════════════════════════════════════════
  // 座標設計原則：
  // - 使用 getY(level) 計算垂直座標，level 0 = 起始點
  // - 「只進不退」：已出現的節點不消失
  // - 分支從 c3（最新主線節點）長出
  // ═══════════════════════════════════════════════════════════════

  'ch1-root': {
    stars: [{ id: 'root', x: M, y: getY(0), type: 'hero', message: 'init: 專案初始化' }],
    lines: [],
  },

  'ch2-trunk': {
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
    ],
  },

  'ch3-sync': {
    // 推送 main 到遠端（遠端副本首次出現，只有 main）
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      // 遠端副本（右側）— 使用 remote 類型，較淡的藍灰色
      { id: 'r-root', x: R, y: getY(0), type: 'remote' },
      { id: 'r-c1', x: R, y: getY(1), type: 'remote' },
      { id: 'r-c2', x: R, y: getY(2), type: 'remote' },
      { id: 'r-c3', x: R, y: getY(3), type: 'remote' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'remote' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'remote' },
      { id: 'r-l3', from: 'r-c2', to: 'r-c3', type: 'remote' },
    ],
  },

  'ch4-branch': {
    // 本地新增 feature 分支，遠端滑出（專注本地操作）
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 深色模式切換' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'style: 調整配色方案' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' }, // 分支從 c3 長出
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
    ],
  },

  'ch5-issue': {
    // 保留分支，Issue 標籤錨定到 c3，遠端仍滑出（專注本地操作）
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 深色模式切換' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'style: 調整配色方案' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
    ],
    labels: [
      {
        id: 'issue-label',
        anchorStar: 'c3',
        position: 'left',
        type: 'issue',
        title: '首頁載入太慢',
        body: '圖片沒有壓縮，需要優化',
      },
    ],
  },

  'ch6-pr': {
    // 同 ch5 + PR 標籤在 f2 + 遠端新增 feature 分支
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 深色模式切換' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'test: 新增單元測試' },
      // 遠端副本（main + feature 分支）
      { id: 'r-root', x: R, y: getY(0), type: 'remote' },
      { id: 'r-c1', x: R, y: getY(1), type: 'remote' },
      { id: 'r-c2', x: R, y: getY(2), type: 'remote' },
      { id: 'r-c3', x: R, y: getY(3), type: 'remote' },
      { id: 'r-f1', x: R + LAYOUT.featureOffset, y: getY(4), type: 'remote' },
      { id: 'r-f2', x: R + LAYOUT.featureOffset, y: getY(5), type: 'remote' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      // 遠端連線（main + feature）
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'remote' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'remote' },
      { id: 'r-l3', from: 'r-c2', to: 'r-c3', type: 'remote' },
      { id: 'r-l4', from: 'r-c3', to: 'r-f1', type: 'remote' },
      { id: 'r-l5', from: 'r-f1', to: 'r-f2', type: 'remote' },
    ],
    labels: [
      {
        id: 'pr-label',
        anchorStar: 'f2',
        position: 'left',
        type: 'pr',
        title: '新增深色模式',
        body: 'feat/dark-mode → main',
      },
    ],
  },

  'ch7-merge': {
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 深色模式切換' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'test: 新增單元測試' },
      { id: 'merge', x: M, y: getY(6), type: 'merge', message: 'merge: feat/dark-mode' },
      // 遠端副本（main + feature + merge）
      { id: 'r-root', x: R, y: getY(0), type: 'remote' },
      { id: 'r-c1', x: R, y: getY(1), type: 'remote' },
      { id: 'r-c2', x: R, y: getY(2), type: 'remote' },
      { id: 'r-c3', x: R, y: getY(3), type: 'remote' },
      { id: 'r-f1', x: R + LAYOUT.featureOffset, y: getY(4), type: 'remote' },
      { id: 'r-f2', x: R + LAYOUT.featureOffset, y: getY(5), type: 'remote' },
      { id: 'r-merge', x: R, y: getY(6), type: 'remote' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'c3', to: 'merge', type: 'main' },
      { id: 'l7', from: 'f2', to: 'merge', type: 'merge' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'remote' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'remote' },
      { id: 'r-l3', from: 'r-c2', to: 'r-c3', type: 'remote' },
      { id: 'r-l4', from: 'r-c3', to: 'r-f1', type: 'remote' },
      { id: 'r-l5', from: 'r-f1', to: 'r-f2', type: 'remote' },
      { id: 'r-l6', from: 'r-c3', to: 'r-merge', type: 'remote' },
      { id: 'r-l7', from: 'r-f2', to: 'r-merge', type: 'remote' },
    ],
    labels: [
      {
        id: 'merged-label',
        anchorStar: 'merge',
        position: 'left',
        type: 'merged',
        title: '新增深色模式',
        body: 'feat/dark-mode → main',
      },
    ],
  },

  'next-steps': {
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 深色模式切換' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'test: 新增單元測試' },
      { id: 'merge', x: M, y: getY(6), type: 'merge', message: 'merge: feat/dark-mode' },
      { id: 'c4', x: M, y: getY(7), type: 'main', message: 'feat: 新增搜尋功能' },
      // 遠端副本（完整歷史）
      { id: 'r-root', x: R, y: getY(0), type: 'remote' },
      { id: 'r-c1', x: R, y: getY(1), type: 'remote' },
      { id: 'r-c2', x: R, y: getY(2), type: 'remote' },
      { id: 'r-c3', x: R, y: getY(3), type: 'remote' },
      { id: 'r-f1', x: R + LAYOUT.featureOffset, y: getY(4), type: 'remote' },
      { id: 'r-f2', x: R + LAYOUT.featureOffset, y: getY(5), type: 'remote' },
      { id: 'r-merge', x: R, y: getY(6), type: 'remote' },
      { id: 'r-c4', x: R, y: getY(7), type: 'remote' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'c3', to: 'merge', type: 'main' },
      { id: 'l7', from: 'f2', to: 'merge', type: 'merge' },
      { id: 'l8', from: 'merge', to: 'c4', type: 'main' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'remote' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'remote' },
      { id: 'r-l3', from: 'r-c2', to: 'r-c3', type: 'remote' },
      { id: 'r-l4', from: 'r-c3', to: 'r-f1', type: 'remote' },
      { id: 'r-l5', from: 'r-f1', to: 'r-f2', type: 'remote' },
      { id: 'r-l6', from: 'r-c3', to: 'r-merge', type: 'remote' },
      { id: 'r-l7', from: 'r-f2', to: 'r-merge', type: 'remote' },
      { id: 'r-l8', from: 'r-merge', to: 'r-c4', type: 'remote' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 番外篇：團隊協作流程
  // ═══════════════════════════════════════════════════════════════

  'bonus-protected': {
    // Protected Branch：main 分支受保護，feature 分支指向但無法直接合併
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 新功能開發' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'test: 新增測試' },
      // 遠端副本
      { id: 'r-root', x: R, y: getY(0), type: 'remote' },
      { id: 'r-c1', x: R, y: getY(1), type: 'remote' },
      { id: 'r-c2', x: R, y: getY(2), type: 'remote' },
      { id: 'r-c3', x: R, y: getY(3), type: 'remote' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'remote' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'remote' },
      { id: 'r-l3', from: 'r-c2', to: 'r-c3', type: 'remote' },
    ],
    labels: [
      {
        id: 'protected-label',
        anchorStar: 'c3',
        position: 'left',
        type: 'issue',
        title: '🔒 protected',
        body: '禁止直接 push',
      },
    ],
  },

  'bonus-review': {
    // Code Review：PR 等待審查，收到回饋後修改
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 新功能開發' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'test: 新增測試' },
      { id: 'f3', x: F, y: getY(6), type: 'feature', message: 'fix: 根據 review 修正' },
      // 遠端副本（含 feature 分支）
      { id: 'r-root', x: R, y: getY(0), type: 'remote' },
      { id: 'r-c1', x: R, y: getY(1), type: 'remote' },
      { id: 'r-c2', x: R, y: getY(2), type: 'remote' },
      { id: 'r-c3', x: R, y: getY(3), type: 'remote' },
      { id: 'r-f1', x: R + LAYOUT.featureOffset, y: getY(4), type: 'remote' },
      { id: 'r-f2', x: R + LAYOUT.featureOffset, y: getY(5), type: 'remote' },
      { id: 'r-f3', x: R + LAYOUT.featureOffset, y: getY(6), type: 'remote' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'f2', to: 'f3', type: 'feature' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'remote' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'remote' },
      { id: 'r-l3', from: 'r-c2', to: 'r-c3', type: 'remote' },
      { id: 'r-l4', from: 'r-c3', to: 'r-f1', type: 'remote' },
      { id: 'r-l5', from: 'r-f1', to: 'r-f2', type: 'remote' },
      { id: 'r-l6', from: 'r-f2', to: 'r-f3', type: 'remote' },
    ],
    labels: [
      {
        id: 'review-label',
        anchorStar: 'f3',
        position: 'left',
        type: 'pr',
        title: '✅ Approved',
        body: '審查通過，可以合併',
      },
    ],
  },

  'bonus-merge-strategy': {
    // Merge Strategy：展示合併後的結果
    stars: [
      { id: 'root', x: M, y: getY(0), type: 'main', message: 'init: 專案初始化' },
      { id: 'c1', x: M, y: getY(1), type: 'main', message: 'feat: 建立首頁' },
      { id: 'c2', x: M, y: getY(2), type: 'main', message: 'fix: 修正導覽連結' },
      { id: 'c3', x: M, y: getY(3), type: 'main', message: 'docs: 更新 README' },
      { id: 'f1', x: F, y: getY(4), type: 'feature', message: 'feat: 新功能開發' },
      { id: 'f2', x: F, y: getY(5), type: 'feature', message: 'test: 新增測試' },
      { id: 'merge', x: M, y: getY(6), type: 'merge', message: 'merge: 合併功能分支' },
      // 遠端副本（完整歷史）
      { id: 'r-root', x: R, y: getY(0), type: 'remote' },
      { id: 'r-c1', x: R, y: getY(1), type: 'remote' },
      { id: 'r-c2', x: R, y: getY(2), type: 'remote' },
      { id: 'r-c3', x: R, y: getY(3), type: 'remote' },
      { id: 'r-f1', x: R + LAYOUT.featureOffset, y: getY(4), type: 'remote' },
      { id: 'r-f2', x: R + LAYOUT.featureOffset, y: getY(5), type: 'remote' },
      { id: 'r-merge', x: R, y: getY(6), type: 'remote' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c3', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'c3', to: 'merge', type: 'main' },
      { id: 'l7', from: 'f2', to: 'merge', type: 'merge' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'remote' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'remote' },
      { id: 'r-l3', from: 'r-c2', to: 'r-c3', type: 'remote' },
      { id: 'r-l4', from: 'r-c3', to: 'r-f1', type: 'remote' },
      { id: 'r-l5', from: 'r-f1', to: 'r-f2', type: 'remote' },
      { id: 'r-l6', from: 'r-c3', to: 'r-merge', type: 'remote' },
      { id: 'r-l7', from: 'r-f2', to: 'r-merge', type: 'remote' },
    ],
    labels: [
      {
        id: 'strategy-label',
        anchorStar: 'merge',
        position: 'left',
        type: 'merged',
        title: 'Merge commit',
        body: '保留完整分支歷史',
      },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// SVG 命名空間
// ═══════════════════════════════════════════════════════════════

const SVG_NS = 'http://www.w3.org/2000/svg';

// ═══════════════════════════════════════════════════════════════
// 星座控制器類別
// ═══════════════════════════════════════════════════════════════

export class ConstellationController {
  private starsContainer: SVGGElement | null = null;
  private linesContainer: SVGGElement | null = null;
  private labelsContainer: SVGGElement | null = null;
  private messagesContainer: SVGGElement | null = null;
  private currentState: ConstellationState = { stars: [], lines: [], labels: [] };
  private starElements: Map<string, SVGCircleElement> = new Map();
  private lineElements: Map<string, SVGPathElement> = new Map();
  private labelElements: Map<string, SVGForeignObjectElement> = new Map();
  private messageElements: Map<string, SVGForeignObjectElement> = new Map();
  private rippleElements: Map<string, SVGCircleElement[]> = new Map(); // hero 漣漪
  private remoteGroupElement: SVGGElement | null = null; // 遠端副本群組
  private viewBox = { width: 1920, height: 1080 };
  private reducedMotion = false;

  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 初始化控制器
   */
  init(): void {
    this.starsContainer = document.getElementById('constellation-stars') as SVGGElement | null;
    this.linesContainer = document.getElementById('constellation-lines') as SVGGElement | null;
    this.labelsContainer = document.getElementById('constellation-labels') as SVGGElement | null;

    if (!this.starsContainer || !this.linesContainer) {
      console.warn('Constellation containers not found');
      return;
    }

    // 如果沒有 labels container，動態建立
    if (!this.labelsContainer && this.starsContainer?.parentElement) {
      this.labelsContainer = document.createElementNS(SVG_NS, 'g');
      this.labelsContainer.setAttribute('id', 'constellation-labels');
      this.starsContainer.parentElement.appendChild(this.labelsContainer);
    }

    // 建立訊息容器
    if (!this.messagesContainer && this.starsContainer?.parentElement) {
      this.messagesContainer = document.createElementNS(SVG_NS, 'g');
      this.messagesContainer.setAttribute('id', 'constellation-messages');
      this.starsContainer.parentElement.appendChild(this.messagesContainer);
    }

    // 監聯視窗大小變化
    window.addEventListener('resize', this.handleResize.bind(this));

    // 監聽星點 hover 事件（事件代理）
    this.starsContainer.addEventListener('mouseenter', this.handleStarHover.bind(this), true);
    this.starsContainer.addEventListener('mouseleave', this.handleStarLeave.bind(this), true);
  }

  /**
   * 星點 hover 時高亮鄰接連線
   */
  private handleStarHover(event: Event): void {
    const target = event.target as SVGCircleElement;
    if (!target.classList.contains('star')) return;

    const starId = target.getAttribute('data-id');
    if (!starId) return;

    // 找出所有連接此星點的連線
    this.currentState.lines.forEach((line) => {
      if (line.from === starId || line.to === starId) {
        const lineEl = this.lineElements.get(line.id);
        if (lineEl) {
          lineEl.style.opacity = '0.8';
        }
      }
    });
  }

  /**
   * 星點離開時恢復連線透明度
   */
  private handleStarLeave(event: Event): void {
    const target = event.target as SVGCircleElement;
    if (!target.classList.contains('star')) return;

    const starId = target.getAttribute('data-id');
    if (!starId) return;

    // 恢復連線原本的透明度
    this.currentState.lines.forEach((line) => {
      if (line.from === starId || line.to === starId) {
        const lineEl = this.lineElements.get(line.id);
        if (lineEl) {
          lineEl.style.opacity = '';
        }
      }
    });
  }

  /**
   * 轉換到指定章節的星座狀態
   */
  transitionTo(chapterId: string): void {
    const targetState = chapterStates[chapterId];
    if (!targetState) {
      console.warn(`No constellation state for chapter: ${chapterId}`);
      return;
    }

    const { toAdd: starsToAdd, toRemove: starsToRemove, toKeep: starsToKeep } = this.diffItems(
      this.currentState.stars,
      targetState.stars
    );

    // 連線的 diff 需要額外檢查：如果 from/to 改變了，當作「移除 + 新增」
    const lineDiff = this.diffItems(this.currentState.lines, targetState.lines);
    const linesToRemove = [...lineDiff.toRemove];
    const linesToAdd = [...lineDiff.toAdd];
    const linesToKeep: Line[] = [];

    lineDiff.toKeep.forEach((targetLine) => {
      const currentLine = this.currentState.lines.find((l) => l.id === targetLine.id);
      if (currentLine && (currentLine.from !== targetLine.from || currentLine.to !== targetLine.to)) {
        // 端點改變 → 當作移除舊的 + 新增新的
        linesToRemove.push(currentLine);
        linesToAdd.push(targetLine);
      } else {
        linesToKeep.push(targetLine);
      }
    });

    // 建立動畫時間軸
    const tl = gsap.timeline();

    // 輔助函式：判斷是否為遠端副本
    const isRemoteCopy = (id: string) => id.startsWith('r-');

    // 判斷目標狀態是否有遠端副本
    const targetHasRemote = targetState.stars.some((s) => isRemoteCopy(s.id));
    const currentHasRemote = this.remoteGroupElement !== null;

    // 分離遠端副本和一般元素
    const remoteStarsToRemove = starsToRemove.filter((s) => isRemoteCopy(s.id));
    const regularStarsToRemove = starsToRemove.filter((s) => !isRemoteCopy(s.id));
    const remoteLinesToRemove = linesToRemove.filter((l) => isRemoteCopy(l.id));
    const regularLinesToRemove = linesToRemove.filter((l) => !isRemoteCopy(l.id));

    // 0. 遠端副本群組整體滑出動畫
    // 條件：當前有遠端群組，且目標狀態沒有遠端副本
    if (currentHasRemote && !targetHasRemote) {
      if (this.reducedMotion) {
        this.remoteGroupElement!.remove();
      } else {
        tl.to(
          this.remoteGroupElement,
          {
            x: 300, // 向右滑出
            opacity: 0,
            duration: 0.5,
            ease: 'power2.in',
          },
          0
        );
        const groupToRemove = this.remoteGroupElement!;
        tl.add(() => groupToRemove.remove(), 0.5);
      }
      // 從 Map 中移除所有遠端元素的參照
      this.currentState.stars
        .filter((s) => isRemoteCopy(s.id))
        .forEach((star) => this.starElements.delete(star.id));
      this.currentState.lines
        .filter((l) => isRemoteCopy(l.id))
        .forEach((line) => this.lineElements.delete(line.id));
      this.remoteGroupElement = null;
    }

    // 0b. 遠端副本部分移除（當前和目標都有遠端，但需要移除部分元素）
    if (currentHasRemote && targetHasRemote && this.remoteGroupElement) {
      // 移除多餘的遠端連線
      remoteLinesToRemove.forEach((line) => {
        const el = this.lineElements.get(line.id);
        if (el) {
          if (this.reducedMotion) {
            el.remove();
          } else {
            tl.to(el, { opacity: 0, duration: 0.2 }, 0);
            tl.add(() => el.remove(), 0.2);
          }
          this.lineElements.delete(line.id);
        }
      });

      // 移除多餘的遠端星點
      remoteStarsToRemove.forEach((star) => {
        const el = this.starElements.get(star.id);
        if (el) {
          if (this.reducedMotion) {
            el.remove();
          } else {
            tl.to(
              el,
              {
                attr: { r: 0 },
                opacity: 0,
                duration: 0.2,
              },
              0
            );
            tl.add(() => el.remove(), 0.2);
          }
          this.starElements.delete(star.id);
        }
      });
    }

    // 1. 移除一般舊連線（不是遠端副本）
    regularLinesToRemove.forEach((line) => {
      const el = this.lineElements.get(line.id);
      if (el) {
        if (this.reducedMotion) {
          el.remove();
        } else {
          tl.to(el, { opacity: 0, duration: 0.2 }, 0);
          tl.add(() => el.remove(), 0.2);
        }
        this.lineElements.delete(line.id);
      }
    });

    // 2. 移除一般舊星點（不是遠端副本，使用 radius 動畫取代 scale，避免閃爍）
    regularStarsToRemove.forEach((star) => {
      const el = this.starElements.get(star.id);
      if (el) {
        if (this.reducedMotion) {
          el.remove();
        } else {
          tl.to(
            el,
            {
              attr: { r: 0 },
              opacity: 0,
              duration: 0.2,
            },
            0
          );
          tl.add(() => el.remove(), 0.2);
        }
        this.starElements.delete(star.id);
      }
      // 同時移除漣漪
      const ripples = this.rippleElements.get(star.id);
      if (ripples) {
        ripples.forEach((r) => r.remove());
        this.rippleElements.delete(star.id);
      }
      // 同時移除訊息
      const msgEl = this.messageElements.get(star.id);
      if (msgEl) {
        if (this.reducedMotion) {
          msgEl.remove();
        } else {
          tl.to(msgEl, { opacity: 0, duration: 0.2 }, 0);
          tl.add(() => msgEl.remove(), 0.2);
        }
        this.messageElements.delete(star.id);
      }
    });

    // 3. 移動持續存在但位置改變的星點，並處理類型改變
    starsToKeep.forEach((targetStar) => {
      const currentStar = this.currentState.stars.find((s) => s.id === targetStar.id);
      const el = this.starElements.get(targetStar.id);
      if (!currentStar || !el) return;

      // 處理位置改變
      if (currentStar.x !== targetStar.x || currentStar.y !== targetStar.y) {
        const { x, y } = this.relativeToAbsolute(targetStar.x, targetStar.y);

        if (this.reducedMotion) {
          el.setAttribute('cx', x.toString());
          el.setAttribute('cy', y.toString());
        } else {
          tl.to(
            el,
            {
              attr: { cx: x, cy: y },
              duration: 0.5,
              ease: 'power2.inOut',
            },
            0.2
          );
        }

        // 同步更新訊息位置
        const msgEl = this.messageElements.get(targetStar.id);
        if (msgEl) {
          const newX = x + 20;
          const newY = y - 10;
          if (this.reducedMotion) {
            msgEl.setAttribute('x', newX.toString());
            msgEl.setAttribute('y', newY.toString());
          } else {
            tl.to(
              msgEl,
              {
                attr: { x: newX, y: newY },
                duration: 0.5,
                ease: 'power2.inOut',
              },
              0.2
            );
          }
        }
      }

      // 處理類型改變（hero ↔ 其他）
      if (currentStar.type !== targetStar.type) {
        const newStyle = STAR_STYLES[targetStar.type];
        el.setAttribute('fill', newStyle.fill);
        el.setAttribute('filter', newStyle.filter);
        el.classList.remove(`star--${currentStar.type}`);
        el.classList.add(`star--${targetStar.type}`);

        // 從 hero 變成其他：移除漣漪
        if (currentStar.type === 'hero') {
          const ripples = this.rippleElements.get(targetStar.id);
          if (ripples) {
            ripples.forEach((r) => {
              if (this.reducedMotion) {
                r.remove();
              } else {
                tl.to(r, { opacity: 0, duration: 0.3 }, 0);
                tl.add(() => r.remove(), 0.3);
              }
            });
            this.rippleElements.delete(targetStar.id);
          }
        }

        // 從其他變成 hero：創建漣漪（這種情況應該很少見）
        if (targetStar.type === 'hero' && !this.reducedMotion) {
          const { x, y } = this.relativeToAbsolute(targetStar.x, targetStar.y);
          const targetRadius = targetStar.radius || newStyle.radius;
          const ripples: SVGCircleElement[] = [];

          for (let i = 0; i < 2; i++) {
            const ripple = document.createElementNS(SVG_NS, 'circle');
            ripple.setAttribute('cx', x.toString());
            ripple.setAttribute('cy', y.toString());
            ripple.setAttribute('r', targetRadius.toString());
            ripple.classList.add('ripple');
            ripple.style.animationDelay = `${i * 1}s`;
            this.starsContainer?.insertBefore(ripple, el);
            ripples.push(ripple);
          }
          this.rippleElements.set(targetStar.id, ripples);
        }
      }
    });

    // 4. 更新持續存在但端點位置改變的連線
    linesToKeep.forEach((targetLine) => {
      const el = this.lineElements.get(targetLine.id);
      if (!el) return;

      const fromStar = targetState.stars.find((s) => s.id === targetLine.from);
      const toStar = targetState.stars.find((s) => s.id === targetLine.to);
      if (!fromStar || !toStar) return;

      const from = this.relativeToAbsolute(fromStar.x, fromStar.y);
      const to = this.relativeToAbsolute(toStar.x, toStar.y);

      // 使用地鐵風格路徑
      const d = this.createMetroPath(from, to);

      if (this.reducedMotion) {
        el.setAttribute('d', d);
      } else {
        tl.to(
          el,
          {
            attr: { d },
            duration: 0.5,
            ease: 'power2.inOut',
          },
          0.2
        );
      }
    });

    // 5. 分離遠端副本和一般新增元素（遠端副本用位移動畫）
    const getLocalId = (remoteId: string) => remoteId.slice(2); // 去掉 "r-" 前綴

    const remoteStars = starsToAdd.filter((s) => isRemoteCopy(s.id));
    const regularStars = starsToAdd.filter((s) => !isRemoteCopy(s.id));
    const remoteLines = linesToAdd.filter((l) => isRemoteCopy(l.id));
    const regularLines = linesToAdd.filter((l) => !isRemoteCopy(l.id));

    // 6. 計算一般連線和星點的動畫時間
    const starAppearTimes: Map<string, number> = new Map();

    // 已存在的星點：出現時間為 0
    this.currentState.stars.forEach((star) => {
      starAppearTimes.set(star.id, 0);
    });

    // 找出沒有連線指向的「起始星點」，它們先出現
    const targetStarIds = new Set(regularLines.map((l) => l.to));
    const startingStars = regularStars.filter((s) => !targetStarIds.has(s.id));
    startingStars.forEach((star, index) => {
      starAppearTimes.set(star.id, 0.3 + index * 0.1);
    });

    // 計算連線動畫參數
    const lineAnimParams: Map<string, { startTime: number; duration: number; endTime: number }> =
      new Map();

    let maxIterations = regularLines.length + 1;
    while (lineAnimParams.size < regularLines.length && maxIterations-- > 0) {
      regularLines.forEach((line) => {
        if (lineAnimParams.has(line.id)) return;

        // 找出指向 from 星點的前置連線
        const prerequisiteLines = regularLines.filter((l) => l.to === line.from);
        let fromAppearTime = starAppearTimes.get(line.from);
        if (fromAppearTime === undefined) return;

        // 如果有前置連線，等待它完成
        prerequisiteLines.forEach((prereq) => {
          const prereqParams = lineAnimParams.get(prereq.id);
          if (prereqParams && prereqParams.endTime > fromAppearTime!) {
            fromAppearTime = prereqParams.endTime;
          }
        });

        const startTime = fromAppearTime + 0.3;
        const el = this.createLineElement(line, targetState.stars);
        if (!el) return;

        const length = el.getTotalLength();
        const duration = this.getLineDuration(length);
        const endTime = startTime + duration;

        lineAnimParams.set(line.id, { startTime, duration, endTime });

        const currentTime = starAppearTimes.get(line.to);
        if (currentTime === undefined || endTime < currentTime) {
          starAppearTimes.set(line.to, endTime);
        }

        el.remove();
      });
    }

    // 7. 新增一般連線動畫
    regularLines.forEach((line) => {
      const el = this.createLineElement(line, targetState.stars);
      if (el) {
        this.linesContainer?.appendChild(el);
        this.lineElements.set(line.id, el);

        const params = lineAnimParams.get(line.id);
        if (this.reducedMotion || !params) {
          gsap.set(el, { strokeDashoffset: 0, opacity: LINE_STYLES[line.type].opacity });
        } else {
          const length = el.getTotalLength();
          gsap.set(el, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: LINE_STYLES[line.type].opacity,
          });
          tl.to(
            el,
            { strokeDashoffset: 0, duration: params.duration, ease: 'power1.out' },
            params.startTime
          );
        }
      }
    });

    // 8. 新增一般星點動畫
    regularStars.forEach((star) => {
      const el = this.createStarElement(star);
      const targetRadius = star.radius || STAR_STYLES[star.type].radius;

      el.setAttribute('r', '0');
      this.starsContainer?.appendChild(el);
      this.starElements.set(star.id, el);

      const appearTime = starAppearTimes.get(star.id) ?? 0.3;

      if (this.reducedMotion) {
        el.setAttribute('r', targetRadius.toString());
        gsap.set(el, { opacity: 1 });
      } else {
        gsap.set(el, { opacity: 0 });
        tl.to(
          el,
          { attr: { r: targetRadius }, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
          appearTime
        );
      }

      // hero 類型：創建漣漪效果
      if (star.type === 'hero' && !this.reducedMotion) {
        const { x, y } = this.relativeToAbsolute(star.x, star.y);
        const ripples: SVGCircleElement[] = [];

        // 創建 2 個錯開的漣漪
        for (let i = 0; i < 2; i++) {
          const ripple = document.createElementNS(SVG_NS, 'circle');
          ripple.setAttribute('cx', x.toString());
          ripple.setAttribute('cy', y.toString());
          ripple.setAttribute('r', targetRadius.toString());
          ripple.classList.add('ripple');
          ripple.style.animationDelay = `${i * 1}s`; // 錯開 1 秒
          // 插入在星點之前（下層）
          this.starsContainer?.insertBefore(ripple, el);
          ripples.push(ripple);
        }

        this.rippleElements.set(star.id, ripples);
      }

      // 訊息打字機效果
      if (star.message) {
        const msgEl = this.createMessageElement(star);
        if (msgEl) {
          this.messagesContainer?.appendChild(msgEl);
          this.messageElements.set(star.id, msgEl);

          const textEl = msgEl.querySelector('.constellation-message') as HTMLElement;
          if (textEl) {
            const starAppearEnd = appearTime + 0.3;
            if (this.reducedMotion) {
              textEl.textContent = star.message;
            } else {
              this.animateTypewriter(textEl, star.message, starAppearEnd, tl);
            }
          }
        }
      }
    });

    // 9. 遠端副本動畫（使用 group 確保完全同步）
    // 條件：目標有遠端副本，且當前沒有 remoteGroupElement（需要創建）
    if (targetHasRemote && !this.remoteGroupElement && (remoteStars.length > 0 || remoteLines.length > 0)) {
      // 計算一般分支動畫的結束時間
      let maxRegularEndTime = 0;

      // 檢查新增連線的結束時間
      lineAnimParams.forEach((params) => {
        if (params.endTime > maxRegularEndTime) {
          maxRegularEndTime = params.endTime;
        }
      });

      // 檢查新增星點的結束時間
      starAppearTimes.forEach((time, starId) => {
        // 只計算新增的一般星點（不是遠端副本）
        if (!isRemoteCopy(starId)) {
          const endTime = time + 0.3;
          if (endTime > maxRegularEndTime) {
            maxRegularEndTime = endTime;
          }
        }
      });

      // 如果沒有新增的一般元素，使用基礎延遲讓動畫有時間差
      if (maxRegularEndTime < 0.5) {
        maxRegularEndTime = 0.5;
      }

      // 計算位移量（從本地到遠端的偏移）
      // 假設所有遠端副本的偏移量相同
      const firstRemoteStar = remoteStars[0];
      const localId = getLocalId(firstRemoteStar.id);
      const localStar = targetState.stars.find((s) => s.id === localId);
      const offsetX = localStar
        ? ((firstRemoteStar.x - localStar.x) / 100) * this.viewBox.width
        : 0;
      const offsetY = localStar
        ? ((firstRemoteStar.y - localStar.y) / 100) * this.viewBox.height
        : 0;

      // 創建 group 元素
      const remoteGroup = document.createElementNS(SVG_NS, 'g');
      remoteGroup.setAttribute('data-remote-group', 'true');

      // 新增遠端連線到 group（先畫線，再畫點，這樣點會在上層）
      remoteLines.forEach((line) => {
        const remoteFromStar = targetState.stars.find((s) => s.id === line.from);
        const remoteToStar = targetState.stars.find((s) => s.id === line.to);
        if (!remoteFromStar || !remoteToStar) return;

        const from = this.relativeToAbsolute(remoteFromStar.x, remoteFromStar.y);
        const to = this.relativeToAbsolute(remoteToStar.x, remoteToStar.y);

        const el = document.createElementNS(SVG_NS, 'path');
        const style = LINE_STYLES[line.type];
        const d = this.createMetroPath(from, to);

        el.setAttribute('d', d);
        el.setAttribute('stroke', style.stroke);
        el.setAttribute('stroke-width', '2.5');
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke-linecap', 'round');
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('data-id', line.id);
        el.classList.add('constellation-line', `constellation-line--${line.type}`);
        gsap.set(el, { opacity: style.opacity });

        remoteGroup.appendChild(el);
        this.lineElements.set(line.id, el);
      });

      // 新增遠端星點到 group
      remoteStars.forEach((star) => {
        const el = this.createStarElement(star);
        const targetRadius = star.radius || STAR_STYLES[star.type].radius;
        el.setAttribute('r', targetRadius.toString());
        gsap.set(el, { opacity: 1 });

        remoteGroup.appendChild(el);
        this.starElements.set(star.id, el);
      });

      // 動畫：group 從本地位置滑動到遠端位置
      const remoteAnimStartTime = maxRegularEndTime + 0.2;

      // 先設置初始狀態再添加到 DOM，避免閃爍
      if (!this.reducedMotion) {
        gsap.set(remoteGroup, {
          x: -offsetX,
          y: -offsetY,
          opacity: 0,
        });
      }

      // 將 group 加入 DOM（加到 starsContainer 的父元素，確保在正確層級）
      const svgRoot = this.starsContainer?.parentElement;
      if (svgRoot) {
        svgRoot.appendChild(remoteGroup);
        // 保存遠端群組參照以便滑出動畫使用
        this.remoteGroupElement = remoteGroup;
      }

      // 淡入 + 滑動到最終位置
      if (!this.reducedMotion) {
        tl.to(
          remoteGroup,
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
          },
          remoteAnimStartTime
        );
      }
    }

    // 9b. 如果目標有遠端且當前也有遠端群組，直接添加新元素到現有 group
    if (targetHasRemote && this.remoteGroupElement && (remoteStars.length > 0 || remoteLines.length > 0)) {
      // 添加新的遠端連線
      remoteLines.forEach((line) => {
        const remoteFromStar = targetState.stars.find((s) => s.id === line.from);
        const remoteToStar = targetState.stars.find((s) => s.id === line.to);
        if (!remoteFromStar || !remoteToStar) return;

        const from = this.relativeToAbsolute(remoteFromStar.x, remoteFromStar.y);
        const to = this.relativeToAbsolute(remoteToStar.x, remoteToStar.y);

        const el = document.createElementNS(SVG_NS, 'path');
        const style = LINE_STYLES[line.type];
        const d = this.createMetroPath(from, to);

        el.setAttribute('d', d);
        el.setAttribute('stroke', style.stroke);
        el.setAttribute('stroke-width', '2.5');
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke-linecap', 'round');
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('data-id', line.id);
        el.classList.add('constellation-line', `constellation-line--${line.type}`);

        // 先設置初始狀態再添加到 DOM，避免閃爍
        if (!this.reducedMotion) {
          gsap.set(el, { opacity: 0 });
        } else {
          gsap.set(el, { opacity: style.opacity });
        }

        this.remoteGroupElement!.appendChild(el);
        this.lineElements.set(line.id, el);

        // 淡入動畫
        if (!this.reducedMotion) {
          tl.to(el, { opacity: style.opacity, duration: 0.3 }, 0.3);
        }
      });

      // 添加新的遠端星點
      remoteStars.forEach((star) => {
        const el = this.createStarElement(star);
        const targetRadius = star.radius || STAR_STYLES[star.type].radius;

        // 先設置初始狀態再添加到 DOM，避免閃爍
        if (!this.reducedMotion) {
          el.setAttribute('r', '0');
          gsap.set(el, { opacity: 0 });
        } else {
          el.setAttribute('r', targetRadius.toString());
          gsap.set(el, { opacity: 1 });
        }

        this.remoteGroupElement!.appendChild(el);
        this.starElements.set(star.id, el);

        // 淡入動畫
        if (!this.reducedMotion) {
          tl.to(el, { attr: { r: targetRadius }, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }, 0.3);
        }
      });
    }

    // 10. 處理標籤的新增/移除
    const currentLabels = this.currentState.labels || [];
    const targetLabels = targetState.labels || [];
    const labelDiff = this.diffItems(currentLabels, targetLabels);

    // 移除舊標籤
    labelDiff.toRemove.forEach((label) => {
      const el = this.labelElements.get(label.id);
      if (el) {
        if (this.reducedMotion) {
          el.remove();
        } else {
          tl.to(el, { opacity: 0, duration: 0.2 }, 0);
          tl.add(() => el.remove(), 0.2);
        }
        this.labelElements.delete(label.id);
      }
    });

    // 新增新標籤（延遲到星點動畫完成後）
    const labelStartTime = 0.5;
    labelDiff.toAdd.forEach((label) => {
      const el = this.createLabelElement(label, targetState.stars);
      if (el) {
        this.labelsContainer?.appendChild(el);
        this.labelElements.set(label.id, el);

        if (this.reducedMotion) {
          gsap.set(el, { opacity: 1 });
        } else {
          gsap.set(el, { opacity: 0 });
          tl.to(el, { opacity: 1, duration: 0.4, ease: 'power2.out' }, labelStartTime);
        }
      }
    });

    // 更新當前狀態
    this.currentState = { ...targetState, labels: targetLabels };
  }

  /**
   * 計算連線生長的起始時間（基於來源星點的動畫結束時間）
   */
  private getLineStartTime(line: Line, starsToAdd: Star[]): number {
    const fromStarIndex = starsToAdd.findIndex((s) => s.id === line.from);
    if (fromStarIndex >= 0) {
      // 來源星點的動畫結束時間 = 起始時間 + duration
      // 星點動畫：0.3 + index * 0.1 開始，持續 0.4s
      return 0.3 + fromStarIndex * 0.1 + 0.4;
    }
    // 如果來源星點不是新增的（已存在），使用基礎延遲
    return 0.3;
  }

  /**
   * 根據連線長度計算動畫持續時間
   * 長連線生長時間較長，短連線較快
   */
  private getLineDuration(length: number): number {
    const baseDuration = 0.3;
    const lengthFactor = length / 500; // 正規化（viewBox 高度約 1080）
    return baseDuration + lengthFactor * 0.4; // 範圍：0.3s ~ 0.7s
  }

  /**
   * 計算兩個陣列的差異
   */
  private diffItems<T extends { id: string }>(
    current: T[],
    target: T[]
  ): { toAdd: T[]; toRemove: T[]; toKeep: T[] } {
    const currentIds = new Set(current.map((item) => item.id));
    const targetIds = new Set(target.map((item) => item.id));

    const toAdd = target.filter((item) => !currentIds.has(item.id));
    const toRemove = current.filter((item) => !targetIds.has(item.id));
    const toKeep = target.filter((item) => currentIds.has(item.id));

    return { toAdd, toRemove, toKeep };
  }

  /**
   * 建立標籤 SVG foreignObject 元素
   * 使用 DOM API 而非 innerHTML 避免 XSS 風險
   */
  private createLabelElement(label: Label, stars: Star[]): SVGForeignObjectElement | null {
    const anchor = stars.find((s) => s.id === label.anchorStar);
    if (!anchor) {
      console.warn(`Cannot find anchor star for label: ${label.id}`);
      return null;
    }

    const { x, y } = this.relativeToAbsolute(anchor.x, anchor.y);

    // 標籤寬高
    const width = 180;
    const height = 80;

    // 依據位置計算偏移量
    let offsetX = 0;
    let offsetY = 0;
    switch (label.position) {
      case 'left':
        offsetX = -width - 20;
        offsetY = -height / 2;
        break;
      case 'right':
        offsetX = 20;
        offsetY = -height / 2;
        break;
      case 'top':
        offsetX = -width / 2;
        offsetY = -height - 20;
        break;
      case 'bottom':
        offsetX = -width / 2;
        offsetY = 20;
        break;
    }

    // 建立 foreignObject
    const fo = document.createElementNS(SVG_NS, 'foreignObject');
    fo.setAttribute('x', (x + offsetX).toString());
    fo.setAttribute('y', (y + offsetY).toString());
    fo.setAttribute('width', width.toString());
    fo.setAttribute('height', height.toString());
    fo.setAttribute('data-id', label.id);
    fo.classList.add('constellation-label-fo');

    // 使用 DOM API 建構卡片
    const card = document.createElement('div');
    card.className = `constellation-label inline-card inline-card--${label.type}`;

    const header = document.createElement('div');
    header.className = 'inline-card__header';

    const icon = document.createElement('i');
    // 圖示依據類型設定（與 GitHub 狀態一致）
    // issue: 綠色圓點、pr: 綠色 PR 圖示（準備合併）、merged: 紫色 merge 圖示（已合併）
    const iconClasses: Record<LabelType, string> = {
      issue: 'ph-fill ph-circle inline-card__icon',
      pr: 'ph ph-git-pull-request inline-card__icon',
      merged: 'ph ph-git-merge inline-card__icon',
    };
    icon.className = iconClasses[label.type];

    const title = document.createElement('h3');
    title.className = 'inline-card__title';
    title.textContent = label.title;

    const body = document.createElement('p');
    body.className = 'inline-card__body';
    body.textContent = label.body;

    header.append(icon, title);
    card.append(header, body);
    fo.appendChild(card);

    return fo;
  }

  /**
   * 建立訊息 SVG foreignObject 元素
   * 訊息顯示在星點右側，低調淡色樣式
   */
  private createMessageElement(star: Star): SVGForeignObjectElement | null {
    if (!star.message) return null;

    const { x, y } = this.relativeToAbsolute(star.x, star.y);
    const fo = document.createElementNS(SVG_NS, 'foreignObject');

    // 訊息顯示在星點右側，垂直居中對齊
    fo.setAttribute('x', (x + 20).toString());
    fo.setAttribute('y', (y - 10).toString());
    fo.setAttribute('width', '200');
    fo.setAttribute('height', '20');
    fo.setAttribute('data-star-id', star.id);
    fo.classList.add('constellation-message-fo');

    const span = document.createElement('span');
    span.className = 'constellation-message';
    span.setAttribute('data-text', star.message);
    // 初始為空，打字機效果會逐字填入
    span.textContent = '';

    fo.appendChild(span);
    return fo;
  }

  /**
   * 打字機動畫：逐字顯示訊息
   */
  private animateTypewriter(
    element: HTMLElement,
    text: string,
    startTime: number,
    tl: gsap.core.Timeline
  ): void {
    const chars = text.split('');
    const charDelay = 0.04; // 每字 40ms

    chars.forEach((char, index) => {
      tl.add(() => {
        element.textContent += char;
      }, startTime + index * charDelay);
    });
  }

  /**
   * 建立星點 SVG 元素
   */
  private createStarElement(star: Star): SVGCircleElement {
    const el = document.createElementNS(SVG_NS, 'circle');
    const style = STAR_STYLES[star.type];
    const { x, y } = this.relativeToAbsolute(star.x, star.y);

    el.setAttribute('cx', x.toString());
    el.setAttribute('cy', y.toString());
    el.setAttribute('r', (star.radius || style.radius).toString());
    el.setAttribute('fill', style.fill);
    el.setAttribute('filter', style.filter);
    el.setAttribute('data-id', star.id);
    el.classList.add('star', `star--${star.type}`);

    return el;
  }

  /**
   * 建立地鐵風格連線路徑
   * 垂直連接使用直線，斜向連接使用平滑弧線（二次貝茲曲線）
   * strokeDashoffset 動畫 length → 0 會讓線從路徑起點向終點生長
   */
  private createMetroPath(
    from: { x: number; y: number },
    to: { x: number; y: number }
  ): string {
    const dx = to.x - from.x;

    // 垂直線：直接連接
    if (Math.abs(dx) < 1) {
      return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }

    // 斜向連接：使用二次貝茲曲線，控制點在拐角處
    // - 向右（分岔）：先水平再垂直 → 控制點 (to.x, from.y)
    // - 向左（合併）：先垂直再水平 → 控制點 (from.x, to.y)
    const controlX = dx > 0 ? to.x : from.x;
    const controlY = dx > 0 ? from.y : to.y;

    return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
  }

  /**
   * 建立連線 SVG 元素
   */
  private createLineElement(line: Line, stars: Star[]): SVGPathElement | null {
    const fromStar = stars.find((s) => s.id === line.from);
    const toStar = stars.find((s) => s.id === line.to);

    if (!fromStar || !toStar) {
      console.warn(`Cannot find stars for line: ${line.id}`);
      return null;
    }

    const from = this.relativeToAbsolute(fromStar.x, fromStar.y);
    const to = this.relativeToAbsolute(toStar.x, toStar.y);

    const el = document.createElementNS(SVG_NS, 'path');
    const style = LINE_STYLES[line.type];

    // 使用地鐵風格路徑
    const d = this.createMetroPath(from, to);

    el.setAttribute('d', d);
    el.setAttribute('stroke', style.stroke);
    el.setAttribute('stroke-width', '2.5');
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('data-id', line.id);
    el.classList.add('constellation-line', `constellation-line--${line.type}`);

    return el;
  }

  /**
   * 相對座標轉絕對座標
   */
  private relativeToAbsolute(x: number, y: number): { x: number; y: number } {
    return {
      x: (x / 100) * this.viewBox.width,
      y: (y / 100) * this.viewBox.height,
    };
  }

  /**
   * 處理視窗大小變化
   */
  private handleResize(): void {
    // 重新計算所有星點位置
    this.currentState.stars.forEach((star) => {
      const el = this.starElements.get(star.id);
      if (el) {
        const { x, y } = this.relativeToAbsolute(star.x, star.y);
        el.setAttribute('cx', x.toString());
        el.setAttribute('cy', y.toString());
      }

      // 同步更新訊息位置
      const msgEl = this.messageElements.get(star.id);
      if (msgEl) {
        const { x, y } = this.relativeToAbsolute(star.x, star.y);
        msgEl.setAttribute('x', (x + 20).toString());
        msgEl.setAttribute('y', (y - 10).toString());
      }
    });

    // 重新計算所有連線（使用地鐵風格路徑）
    this.currentState.lines.forEach((line) => {
      const el = this.lineElements.get(line.id);
      if (el) {
        const fromStar = this.currentState.stars.find((s) => s.id === line.from);
        const toStar = this.currentState.stars.find((s) => s.id === line.to);
        if (fromStar && toStar) {
          const from = this.relativeToAbsolute(fromStar.x, fromStar.y);
          const to = this.relativeToAbsolute(toStar.x, toStar.y);
          const d = this.createMetroPath(from, to);
          el.setAttribute('d', d);
        }
      }
    });
  }

  /**
   * 清除所有元素
   */
  clear(): void {
    this.starElements.forEach((el) => el.remove());
    this.lineElements.forEach((el) => el.remove());
    this.labelElements.forEach((el) => el.remove());
    this.messageElements.forEach((el) => el.remove());
    this.rippleElements.forEach((ripples) => ripples.forEach((r) => r.remove()));
    this.remoteGroupElement?.remove();
    this.starElements.clear();
    this.lineElements.clear();
    this.labelElements.clear();
    this.messageElements.clear();
    this.rippleElements.clear();
    this.remoteGroupElement = null;
    this.currentState = { stars: [], lines: [], labels: [] };
  }
}

// ═══════════════════════════════════════════════════════════════
// 匯出單例
// ═══════════════════════════════════════════════════════════════

export const constellation = new ConstellationController();
