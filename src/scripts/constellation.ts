/**
 * 星座視覺化系統
 * 將 Git 概念視覺化為星點（commit）與連線（關係）
 */

import { gsap } from 'gsap';

// ═══════════════════════════════════════════════════════════════
// 型別定義
// ═══════════════════════════════════════════════════════════════

export type StarType = 'main' | 'feature' | 'merge' | 'conflict';
export type LineType = 'main' | 'feature' | 'merge';

export interface Star {
  id: string;
  x: number; // 相對座標 0-100
  y: number; // 相對座標 0-100
  type: StarType;
  radius?: number; // 可選，預設依類型決定
}

export interface Line {
  id: string;
  from: string; // star id
  to: string; // star id
  type: LineType;
}

export interface ConstellationState {
  stars: Star[];
  lines: Line[];
}

// ═══════════════════════════════════════════════════════════════
// 樣式配置
// ═══════════════════════════════════════════════════════════════

const STAR_STYLES: Record<StarType, { fill: string; filter: string; radius: number }> = {
  main: { fill: '#5eead4', filter: 'url(#glow-cyan)', radius: 8 },
  feature: { fill: '#c4b5fd', filter: 'url(#glow-purple)', radius: 7 },
  merge: { fill: '#fcd34d', filter: 'url(#glow-gold)', radius: 12 },
  conflict: { fill: '#fb7185', filter: 'url(#glow-rose)', radius: 8 },
};

const LINE_STYLES: Record<LineType, { stroke: string; opacity: number }> = {
  main: { stroke: '#5eead4', opacity: 0.5 },
  feature: { stroke: '#c4b5fd', opacity: 0.4 },
  merge: { stroke: '#fcd34d', opacity: 0.6 },
};

// ═══════════════════════════════════════════════════════════════
// 佈局配置 - 統一座標設計
// ═══════════════════════════════════════════════════════════════

const LAYOUT = {
  mainBranch: 70, // 主線 x 座標（畫面右側，留出空間給遠端）
  featureOffset: 10, // feature 分支的水平偏移 → x: 80
  remoteOffset: 18, // 遠端副本的額外偏移 → x: 88（留出 12% 邊距）
};

// 地鐵風格連線的圓角半徑
const METRO_CORNER_RADIUS = 20;

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

  'ch1-root': {
    stars: [{ id: 'root', x: M, y: 70, type: 'main' }],
    lines: [],
  },

  'ch2-trunk': {
    stars: [
      { id: 'root', x: M, y: 70, type: 'main' },
      { id: 'c1', x: M, y: 55, type: 'main' },
      { id: 'c2', x: M, y: 40, type: 'main' },
      { id: 'c3', x: M, y: 25, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
    ],
  },

  'ch3-branch': {
    stars: [
      { id: 'root', x: M, y: 70, type: 'main' },
      { id: 'c1', x: M, y: 55, type: 'main' },
      { id: 'c2', x: M, y: 40, type: 'main' },
      { id: 'f1', x: F, y: 30, type: 'feature' },
      { id: 'f2', x: F, y: 20, type: 'feature' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'f1', type: 'feature' },
      { id: 'l4', from: 'f1', to: 'f2', type: 'feature' },
    ],
  },

  'ch4-sync': {
    stars: [
      { id: 'root', x: M, y: 70, type: 'main' },
      { id: 'c1', x: M, y: 55, type: 'main' },
      { id: 'c2', x: M, y: 40, type: 'main' },
      { id: 'f1', x: F, y: 30, type: 'feature' },
      { id: 'f2', x: F, y: 20, type: 'feature' },
      // 遠端副本（右側）
      { id: 'r-root', x: R, y: 70, type: 'main' },
      { id: 'r-c1', x: R, y: 55, type: 'main' },
      { id: 'r-c2', x: R, y: 40, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'f1', type: 'feature' },
      { id: 'l4', from: 'f1', to: 'f2', type: 'feature' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'main' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'main' },
    ],
  },

  'ch5-issue': {
    // 與 ch4-sync 相同
    stars: [
      { id: 'root', x: M, y: 70, type: 'main' },
      { id: 'c1', x: M, y: 55, type: 'main' },
      { id: 'c2', x: M, y: 40, type: 'main' },
      { id: 'f1', x: F, y: 30, type: 'feature' },
      { id: 'f2', x: F, y: 20, type: 'feature' },
      { id: 'r-root', x: R, y: 70, type: 'main' },
      { id: 'r-c1', x: R, y: 55, type: 'main' },
      { id: 'r-c2', x: R, y: 40, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'f1', type: 'feature' },
      { id: 'l4', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'main' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'main' },
    ],
  },

  'ch6-pr': {
    stars: [
      { id: 'root', x: M, y: 70, type: 'main' },
      { id: 'c1', x: M, y: 55, type: 'main' },
      { id: 'c2', x: M, y: 40, type: 'main' },
      { id: 'c3', x: M, y: 25, type: 'main' },
      { id: 'f1', x: F, y: 32, type: 'feature' },
      { id: 'f2', x: F, y: 22, type: 'feature' },
      { id: 'f3', x: F, y: 12, type: 'feature' }, // 準備合併
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c2', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'f2', to: 'f3', type: 'feature' },
    ],
  },

  'ch7-merge': {
    stars: [
      { id: 'root', x: M, y: 75, type: 'main' },
      { id: 'c1', x: M, y: 62, type: 'main' },
      { id: 'c2', x: M, y: 49, type: 'main' },
      { id: 'c3', x: M, y: 36, type: 'main' },
      { id: 'f1', x: F, y: 42, type: 'feature' },
      { id: 'f2', x: F, y: 32, type: 'feature' },
      { id: 'merge', x: M, y: 20, type: 'merge' }, // 合併點
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c2', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'c3', to: 'merge', type: 'main' },
      { id: 'l7', from: 'f2', to: 'merge', type: 'merge' },
    ],
  },

  'next-steps': {
    // 完整展示
    stars: [
      { id: 'root', x: M, y: 80, type: 'main' },
      { id: 'c1', x: M, y: 68, type: 'main' },
      { id: 'c2', x: M, y: 56, type: 'main' },
      { id: 'c3', x: M, y: 44, type: 'main' },
      { id: 'f1', x: F, y: 50, type: 'feature' },
      { id: 'f2', x: F, y: 40, type: 'feature' },
      { id: 'merge', x: M, y: 30, type: 'merge' },
      { id: 'c4', x: M, y: 18, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c2', to: 'f1', type: 'feature' },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'c3', to: 'merge', type: 'main' },
      { id: 'l7', from: 'f2', to: 'merge', type: 'merge' },
      { id: 'l8', from: 'merge', to: 'c4', type: 'main' },
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
  private currentState: ConstellationState = { stars: [], lines: [] };
  private starElements: Map<string, SVGCircleElement> = new Map();
  private lineElements: Map<string, SVGPathElement> = new Map();
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

    if (!this.starsContainer || !this.linesContainer) {
      console.warn('Constellation containers not found');
      return;
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

    // 1. 移除舊連線
    linesToRemove.forEach((line) => {
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

    // 2. 移除舊星點（使用 radius 動畫取代 scale，避免閃爍）
    starsToRemove.forEach((star) => {
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

    // 3. 移動持續存在但位置改變的星點
    starsToKeep.forEach((targetStar) => {
      const currentStar = this.currentState.stars.find((s) => s.id === targetStar.id);
      const el = this.starElements.get(targetStar.id);

      if (currentStar && el && (currentStar.x !== targetStar.x || currentStar.y !== targetStar.y)) {
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

    // 5. 新增星點（使用 radius 動畫取代 scale，避免閃爍）
    starsToAdd.forEach((star, index) => {
      const el = this.createStarElement(star);
      const targetRadius = star.radius || STAR_STYLES[star.type].radius;

      // 初始半徑為 0，透過動畫長大
      el.setAttribute('r', '0');
      this.starsContainer?.appendChild(el);
      this.starElements.set(star.id, el);

      if (this.reducedMotion) {
        el.setAttribute('r', targetRadius.toString());
        gsap.set(el, { opacity: 1 });
      } else {
        gsap.set(el, { opacity: 0 });
        tl.to(
          el,
          {
            attr: { r: targetRadius },
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          0.3 + index * 0.1
        );
      }
    });

    // 6. 新增連線（植物生長風格：來源星點完成後才開始生長）
    linesToAdd.forEach((line) => {
      const el = this.createLineElement(line, targetState.stars);
      if (el) {
        this.linesContainer?.appendChild(el);
        this.lineElements.set(line.id, el);

        if (this.reducedMotion) {
          gsap.set(el, { strokeDashoffset: 0, opacity: LINE_STYLES[line.type].opacity });
        } else {
          const length = el.getTotalLength();
          // 計算動畫起始時間：基於來源星點的動畫結束時間
          const startTime = this.getLineStartTime(line, starsToAdd);
          // 計算動畫持續時間：依連線長度動態調整
          const duration = this.getLineDuration(length);

          // 立即設定不透明度（不漸變），只動畫 strokeDashoffset
          gsap.set(el, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: LINE_STYLES[line.type].opacity,
          });
          tl.to(
            el,
            {
              strokeDashoffset: 0,
              duration,
              ease: 'power1.out', // 更線性的生長感
            },
            startTime
          );
        }
      }
    });

    // 更新當前狀態
    this.currentState = targetState;
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

    // 斜向連接：使用二次貝茲曲線
    // 控制點放在 (to.x, from.y)，讓曲線先水平彎出再垂直到達
    const controlX = to.x;
    const controlY = from.y;

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
    this.starElements.clear();
    this.lineElements.clear();
    this.currentState = { stars: [], lines: [] };
  }
}

// ═══════════════════════════════════════════════════════════════
// 匯出單例
// ═══════════════════════════════════════════════════════════════

export const constellation = new ConstellationController();
