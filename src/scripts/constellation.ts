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
  curved?: boolean; // 是否使用曲線
}

export interface ConstellationState {
  stars: Star[];
  lines: Line[];
}

// ═══════════════════════════════════════════════════════════════
// 樣式配置
// ═══════════════════════════════════════════════════════════════

const STAR_STYLES: Record<StarType, { fill: string; filter: string; radius: number }> = {
  main: { fill: '#5eead4', filter: 'url(#glow-cyan)', radius: 5 },
  feature: { fill: '#c4b5fd', filter: 'url(#glow-purple)', radius: 4 },
  merge: { fill: '#fcd34d', filter: 'url(#glow-gold)', radius: 7 },
  conflict: { fill: '#fb7185', filter: 'url(#glow-rose)', radius: 5 },
};

const LINE_STYLES: Record<LineType, { stroke: string; opacity: number }> = {
  main: { stroke: '#5eead4', opacity: 0.4 },
  feature: { stroke: '#c4b5fd', opacity: 0.3 },
  merge: { stroke: '#fcd34d', opacity: 0.5 },
};

// ═══════════════════════════════════════════════════════════════
// 章節星座狀態配置
// ═══════════════════════════════════════════════════════════════

export const chapterStates: Record<string, ConstellationState> = {
  intro: {
    stars: [],
    lines: [],
  },

  'ch1-root': {
    stars: [{ id: 'root', x: 50, y: 70, type: 'main' }],
    lines: [],
  },

  'ch2-trunk': {
    stars: [
      { id: 'root', x: 50, y: 70, type: 'main' },
      { id: 'c1', x: 50, y: 55, type: 'main' },
      { id: 'c2', x: 50, y: 40, type: 'main' },
      { id: 'c3', x: 50, y: 25, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
    ],
  },

  'ch3-branch': {
    stars: [
      { id: 'root', x: 50, y: 70, type: 'main' },
      { id: 'c1', x: 50, y: 55, type: 'main' },
      { id: 'c2', x: 50, y: 40, type: 'main' },
      { id: 'f1', x: 62, y: 32, type: 'feature' },
      { id: 'f2', x: 70, y: 22, type: 'feature' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'f1', type: 'feature', curved: true },
      { id: 'l4', from: 'f1', to: 'f2', type: 'feature' },
    ],
  },

  'ch4-sync': {
    stars: [
      { id: 'root', x: 35, y: 70, type: 'main' },
      { id: 'c1', x: 35, y: 55, type: 'main' },
      { id: 'c2', x: 35, y: 40, type: 'main' },
      { id: 'f1', x: 47, y: 32, type: 'feature' },
      { id: 'f2', x: 55, y: 22, type: 'feature' },
      // 遠端副本（右側）
      { id: 'r-root', x: 75, y: 70, type: 'main' },
      { id: 'r-c1', x: 75, y: 55, type: 'main' },
      { id: 'r-c2', x: 75, y: 40, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'f1', type: 'feature', curved: true },
      { id: 'l4', from: 'f1', to: 'f2', type: 'feature' },
      // 遠端連線
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'main' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'main' },
    ],
  },

  'ch5-issue': {
    // 與 ch4-sync 相同
    stars: [
      { id: 'root', x: 35, y: 70, type: 'main' },
      { id: 'c1', x: 35, y: 55, type: 'main' },
      { id: 'c2', x: 35, y: 40, type: 'main' },
      { id: 'f1', x: 47, y: 32, type: 'feature' },
      { id: 'f2', x: 55, y: 22, type: 'feature' },
      { id: 'r-root', x: 75, y: 70, type: 'main' },
      { id: 'r-c1', x: 75, y: 55, type: 'main' },
      { id: 'r-c2', x: 75, y: 40, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'f1', type: 'feature', curved: true },
      { id: 'l4', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'r-l1', from: 'r-root', to: 'r-c1', type: 'main' },
      { id: 'r-l2', from: 'r-c1', to: 'r-c2', type: 'main' },
    ],
  },

  'ch6-pr': {
    stars: [
      { id: 'root', x: 35, y: 70, type: 'main' },
      { id: 'c1', x: 35, y: 55, type: 'main' },
      { id: 'c2', x: 35, y: 40, type: 'main' },
      { id: 'c3', x: 35, y: 25, type: 'main' },
      { id: 'f1', x: 47, y: 32, type: 'feature' },
      { id: 'f2', x: 55, y: 22, type: 'feature' },
      { id: 'f3', x: 50, y: 12, type: 'feature' }, // 準備合併
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c2', to: 'f1', type: 'feature', curved: true },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'f2', to: 'f3', type: 'feature' },
    ],
  },

  'ch7-merge': {
    stars: [
      { id: 'root', x: 50, y: 75, type: 'main' },
      { id: 'c1', x: 50, y: 62, type: 'main' },
      { id: 'c2', x: 50, y: 49, type: 'main' },
      { id: 'c3', x: 50, y: 36, type: 'main' },
      { id: 'f1', x: 62, y: 42, type: 'feature' },
      { id: 'f2', x: 70, y: 32, type: 'feature' },
      { id: 'merge', x: 50, y: 20, type: 'merge' }, // 合併點
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c2', to: 'f1', type: 'feature', curved: true },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'c3', to: 'merge', type: 'main' },
      { id: 'l7', from: 'f2', to: 'merge', type: 'merge', curved: true },
    ],
  },

  'next-steps': {
    // 完整展示
    stars: [
      { id: 'root', x: 50, y: 80, type: 'main' },
      { id: 'c1', x: 50, y: 68, type: 'main' },
      { id: 'c2', x: 50, y: 56, type: 'main' },
      { id: 'c3', x: 50, y: 44, type: 'main' },
      { id: 'f1', x: 62, y: 50, type: 'feature' },
      { id: 'f2', x: 70, y: 40, type: 'feature' },
      { id: 'merge', x: 50, y: 30, type: 'merge' },
      { id: 'c4', x: 50, y: 18, type: 'main' },
    ],
    lines: [
      { id: 'l1', from: 'root', to: 'c1', type: 'main' },
      { id: 'l2', from: 'c1', to: 'c2', type: 'main' },
      { id: 'l3', from: 'c2', to: 'c3', type: 'main' },
      { id: 'l4', from: 'c2', to: 'f1', type: 'feature', curved: true },
      { id: 'l5', from: 'f1', to: 'f2', type: 'feature' },
      { id: 'l6', from: 'c3', to: 'merge', type: 'main' },
      { id: 'l7', from: 'f2', to: 'merge', type: 'merge', curved: true },
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

    // 監聽視窗大小變化
    window.addEventListener('resize', this.handleResize.bind(this));
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

    const { toAdd: starsToAdd, toRemove: starsToRemove } = this.diffItems(
      this.currentState.stars,
      targetState.stars
    );

    const { toAdd: linesToAdd, toRemove: linesToRemove } = this.diffItems(
      this.currentState.lines,
      targetState.lines
    );

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

    // 2. 移除舊星點
    starsToRemove.forEach((star) => {
      const el = this.starElements.get(star.id);
      if (el) {
        if (this.reducedMotion) {
          el.remove();
        } else {
          tl.to(el, { scale: 0, opacity: 0, duration: 0.2, transformOrigin: 'center' }, 0);
          tl.add(() => el.remove(), 0.2);
        }
        this.starElements.delete(star.id);
      }
    });

    // 3. 新增星點
    starsToAdd.forEach((star, index) => {
      const el = this.createStarElement(star);
      this.starsContainer?.appendChild(el);
      this.starElements.set(star.id, el);

      if (this.reducedMotion) {
        gsap.set(el, { opacity: 1, scale: 1 });
      } else {
        gsap.set(el, { opacity: 0, scale: 0 });
        tl.to(
          el,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
            transformOrigin: 'center',
          },
          0.3 + index * 0.1
        );
      }
    });

    // 4. 新增連線
    linesToAdd.forEach((line, index) => {
      const el = this.createLineElement(line, targetState.stars);
      if (el) {
        this.linesContainer?.appendChild(el);
        this.lineElements.set(line.id, el);

        if (this.reducedMotion) {
          gsap.set(el, { strokeDashoffset: 0, opacity: LINE_STYLES[line.type].opacity });
        } else {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
          tl.to(
            el,
            {
              strokeDashoffset: 0,
              opacity: LINE_STYLES[line.type].opacity,
              duration: 0.5,
              ease: 'power2.out',
            },
            0.5 + index * 0.1
          );
        }
      }
    });

    // 更新當前狀態
    this.currentState = targetState;
  }

  /**
   * 計算兩個陣列的差異
   */
  private diffItems<T extends { id: string }>(
    current: T[],
    target: T[]
  ): { toAdd: T[]; toRemove: T[] } {
    const currentIds = new Set(current.map((item) => item.id));
    const targetIds = new Set(target.map((item) => item.id));

    const toAdd = target.filter((item) => !currentIds.has(item.id));
    const toRemove = current.filter((item) => !targetIds.has(item.id));

    return { toAdd, toRemove };
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

    let d: string;
    if (line.curved) {
      // 二次貝茲曲線
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const controlX = midX + (to.x - from.x) * 0.3;
      const controlY = midY - Math.abs(to.y - from.y) * 0.2;
      d = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
    } else {
      d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }

    el.setAttribute('d', d);
    el.setAttribute('stroke', style.stroke);
    el.setAttribute('stroke-width', '1.5');
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke-linecap', 'round');
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

    // 重新計算所有連線
    this.currentState.lines.forEach((line) => {
      const el = this.lineElements.get(line.id);
      if (el) {
        const fromStar = this.currentState.stars.find((s) => s.id === line.from);
        const toStar = this.currentState.stars.find((s) => s.id === line.to);
        if (fromStar && toStar) {
          const from = this.relativeToAbsolute(fromStar.x, fromStar.y);
          const to = this.relativeToAbsolute(toStar.x, toStar.y);

          let d: string;
          if (line.curved) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const controlX = midX + (to.x - from.x) * 0.3;
            const controlY = midY - Math.abs(to.y - from.y) * 0.2;
            d = `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`;
          } else {
            d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
          }

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
