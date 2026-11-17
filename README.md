# 深言達意 · Tinycast / Raycast

在啟動器中輸入描述，開啟[深言達意](https://www.shenyandayi.com/)尋詞或覓句。這是非官方用戶端，搜尋結果由深言達意網站提供，會在預設瀏覽器中顯示。

- **尋詞（WantWords）**：以意思、情境或英文描述尋找中文詞語。
- **覓句（WantQuotes）**：以主題或意境尋找詩詞、名言與佳句。
- **中文介面**：指令、輸入提示、設定與錯誤提示使用繁體中文。
- **內建 OpenCC**：繁體查詢可在本機轉為簡體，不需 Homebrew 或系統 OpenCC，也不會啟動 shell。

## 在 Tinycast 安裝

1. 開啟 **Settings → Extensions → Install from GitHub → Install…**。
2. 輸入 `BaksiLi/shenyandayi-launcher`，Package manager 選 **npm**，再按 **Install**。
3. 等待建置與安裝完成，在啟動器搜尋 **尋詞** 或 **覓句**。

Tinycast 會從 GitHub 暫存下載原始碼、安裝依賴並建置，完成後只保留建置產物，刪除暫存的原始碼與依賴。安裝後不需要保留任何本機專案資料夾，也不需要 Raycast 或系統 OpenCC。

安裝時需要 Node.js 與 npm。Tinycast 不會自動更新這類擴充套件；更新時重新安裝同一個儲存庫即可，無需先解除安裝。

## 結果顯示方式

目前版本會在瀏覽器開啟深言達意結果頁，**尚未在 Tinycast 內直接顯示詞語或句子結果**。

Tinycast 支援原生清單與詳情介面，但內嵌結果仍需要可用的查詢介面。2026-11-18 測試官網兩個查詢端點時，未帶網站身分的請求均回傳錯誤碼 `20009`。目前未完成可用的原生結果整合；測試細節見 [VALIDATION.md](VALIDATION.md)。

## 在 Raycast 使用

保留 Raycast 擴充套件格式與 `@raycast/api`，可在已安裝 Raycast 的 Mac 上執行 `npm run dev` 載入開發版本。本專案沒有在 Raycast Store 發布；目前的手動驗證以 Tinycast 為主。

## 使用方式與設定

開啟「尋詞」或「覓句」，輸入描述，再按 Enter。空白查詢不會開啟瀏覽器。中文、英文、引號、換行與網址特殊字元都會作為查詢文字處理。

在 Tinycast 的擴充套件設定中，可以開關「搜尋前將繁體轉為簡體」。轉換完全在本機執行；開啟搜尋時，查詢文字才會隨網站網址交給預設瀏覽器與深言達意。關閉轉換後會保留原文。

沿用原擴充套件 ID `deeplang`、指令 ID `wantwords` / `wantquotes` 與設定鍵 `useSystemOpencc`，以保留現有安裝的指令設定與轉換偏好；這個舊設定鍵現在控制內建 OpenCC，不再呼叫系統程式。

## 開發與來源

```sh
npm ci --ignore-scripts
npm run check
npm run format:check
npm run build
```

原始版本由 BaksiLi 開發，位於 [`BaksiLi/raycast-extensions` 的 `ext/deeplang` 分支](https://github.com/BaksiLi/raycast-extensions/tree/ext/deeplang/extensions/deeplang)，取自提交 `aca2701f8769412a9870fd54362ff0bbb480a74b`。本儲存庫將該擴充套件獨立維護。

已在 Tinycast 0.12.15 實際操作兩個指令，確認中文介面、繁簡轉換與網站結果頁；詳細記錄見 [VALIDATION.md](VALIDATION.md)。

繁簡轉換使用 [`opencc-js`](https://github.com/nk2028/opencc-js) 的 `t2cn` 套件入口與 `t → cn` 設定。程式採 MIT 授權；內建 OpenCC 程式與字典的授權見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

本專案與深言達意、DeepLang AI、Tinycast、Raycast 均無隸屬關係。
