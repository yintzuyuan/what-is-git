/**
 * CLI 區塊複製功能
 */

const COPIED_DURATION = 2000;
const COPY_ICON_SVG = `<path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>`;
const CHECK_ICON_SVG = `<path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>`;

/**
 * 初始化所有 CLI 區塊的複製功能
 */
export function initClipboard(): void {
  const copyButtons = document.querySelectorAll<HTMLButtonElement>('.cli-block__copy');

  copyButtons.forEach((button) => {
    button.addEventListener('click', () => handleCopy(button));
  });
}

/**
 * 處理複製按鈕點擊
 */
async function handleCopy(button: HTMLButtonElement): Promise<void> {
  const cliBlock = button.closest('.cli-block');
  if (!cliBlock) return;

  const commandEl = cliBlock.querySelector<HTMLElement>('.cli-block__command');
  if (!commandEl) return;

  const command = commandEl.textContent?.trim() || '';
  if (!command) return;

  try {
    await navigator.clipboard.writeText(command);
    showCopiedFeedback(button);
  } catch {
    // 備援：使用舊版 API
    fallbackCopy(command);
    showCopiedFeedback(button);
  }
}

/**
 * 顯示「已複製」回饋
 */
function showCopiedFeedback(button: HTMLButtonElement): void {
  // 儲存原始狀態
  const icon = button.querySelector<SVGElement>('.cli-block__copy-icon');
  const label = button.querySelector<HTMLSpanElement>('span');

  if (!icon || !label) return;

  const originalIconPath = icon.innerHTML;
  const originalLabel = label.textContent;

  // 更新為已複製狀態
  button.classList.add('is-copied');
  icon.innerHTML = CHECK_ICON_SVG;
  label.textContent = '已複製';

  // 還原
  setTimeout(() => {
    button.classList.remove('is-copied');
    icon.innerHTML = originalIconPath;
    label.textContent = originalLabel;
  }, COPIED_DURATION);
}

/**
 * 備援複製方法（舊瀏覽器）
 */
function fallbackCopy(text: string): void {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/**
 * 建立複製按鈕 HTML 結構的輔助常數
 */
export const COPY_BUTTON_ICON_PATH = COPY_ICON_SVG;
