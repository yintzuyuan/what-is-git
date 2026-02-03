# 什麼是 Git？(What is Git?)

讓創意工作者「看懂」Git 邏輯的引導式互動展示。

## 專案定位

這不是 Git 教學工具，而是一個幫助建立「心智模型」的視覺化展示。目標受眾是設計師、字型師、藝術家等創意工作者——他們可能完全沒用過版本控制，但已有雲端備份（Google Drive / Dropbox）的心智模型。

## 成功指標

看完展示後，使用者應該：
- ✓ 建立 commit / branch / merge 的心智模型
- ✓ 從「Git 好可怕」變成「原來就是這樣，我可以試試」
- ✓ 認知到版本控制不是程式師專屬，而是創作流程的核心
- ✗ 不需要立即能操作（這不是目標）

## 技術棧

- [Astro](https://astro.build/) — 靜態網站生成器
- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/) — 捲動驅動動畫
- [GitHub Pages](https://pages.github.com/) — 託管

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置靜態檔案
npm run build

# 預覽建置結果
npm run preview
```

## 部署

推送到 `main` 分支自動觸發 GitHub Actions 部署至 GitHub Pages。

**網址**：https://yintzuyuan.github.io/what-is-git/

## 授權

MIT License
