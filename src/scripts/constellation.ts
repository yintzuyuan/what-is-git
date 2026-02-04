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

    // 5. 分離遠端副本和一般新增元素（遠端副本用位移動畫）
    const isRemoteCopy = (id: string) => id.startsWith('r-');
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

        const fromAppearTime = starAppearTimes.get(line.from);
        if (fromAppearTime === undefined) return;

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
    });

    // 9. 遠端副本動畫（使用 group 確保完全同步）
    if (remoteStars.length > 0 || remoteLines.length > 0) {
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

      // 將 group 加入 DOM（加到 starsContainer 的父元素，確保在正確層級）
      const svgRoot = this.starsContainer?.parentElement;
      if (svgRoot) {
        svgRoot.appendChild(remoteGroup);
      }

      // 動畫：group 從本地位置滑動到遠端位置
      const remoteAnimStartTime = maxRegularEndTime + 0.2;

      if (this.reducedMotion) {
        // 無動畫
      } else {
        // 初始位置：向左偏移（回到本地位置）
        gsap.set(remoteGroup, {
          x: -offsetX,
          y: -offsetY,
          opacity: 0,
        });

        // 淡入 + 滑動到最終位置
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
    // 根據方向決定控制點位置：
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
