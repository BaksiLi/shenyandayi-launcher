# 深言達意 · Tinycast / Raycast

在啟動器中輸入描述，使用[深言達意](https://www.shenyandayi.com/)尋詞或覓句。這是非官方用戶端。

- **尋詞（WantWords）**：以意思、情境或英文描述尋找中文詞語。
- **覓句（WantQuotes）**：以主題或意境尋找詩詞、名言與佳句。
- **三語介面**：預設美式英語，可切換繁體中文或簡體中文。繁體文案使用「箇」，例如「想找哪一箇詞？」。
- **原生結果**：尋詞清單、句子全文、作者與作品、複製原文及出處。
- **內建 OpenCC**：繁體查詢可在本機轉為簡體，不需 Homebrew 或系統 OpenCC，也不會啟動 shell。
- **單一轉換開關**：「搜尋前自動轉為簡體」預設開啟，尋詞、覓句共用；關閉後送出原文。
- **搜尋文字預覽**：轉換後的查詢會顯示在清單中，可直接複製。

## 在 Tinycast 安裝

1. 從 [GitHub Releases](https://github.com/BaksiLi/shenyandayi-launcher/releases) 下載並解開 `Shenyandayi-Tinycast.zip`。
2. 在 Tinycast 選 **Settings → Extensions → Add from folder**，選取解開的 `Shenyandayi` 資料夾。
3. 在啟動器搜尋 **Search Words** 或 **Search Quotes**。也可以搜尋「尋詞」或「覓句」。

Tinycast 會複製建置產物。匯入後可移除下載的資料夾。已裝過舊版時，重新匯入更新即可。

也可用 **Install from GitHub** 輸入 `BaksiLi/shenyandayi-launcher`，在本機從原始碼建置。此方式需要 Xcode、Node.js 與套件管理器。

## 結果顯示方式

新版按 Enter 後會在背景載入深言達意的公開結果頁，再顯示詞語清單或句子全文詳情。句子可顯示作者、作品並連同出處複製。按 `⌘O` 可在預設瀏覽器開啟同一箇搜尋。

查詢由 macOS 內建 WebKit 在暫存訪客工作階段執行。擴充套件讀取頁面顯示的第一頁結果，保留原文和出處。網站改版或限制存取時，可使用瀏覽器備用動作。詳見 [SERVICE_INTEGRATION.md](SERVICE_INTEGRATION.md)。

## 在 Raycast 使用

保留 Raycast 擴充套件格式與 `@raycast/api`，可在已安裝 Raycast 的 Mac 上執行 `npm run dev` 載入開發版本。本專案沒有在 Raycast Store 發布；目前的手動驗證以 Tinycast 為主。

Raycast 英文送審包與 Tinycast 三語版由同一份搜尋程式產生：

```sh
npm run prepare:raycast
cd build/raycast
npm ci --ignore-scripts
npm run build
npm run check
```

`build/raycast` 的 manifest、指令、設定、動作、錯誤訊息與 README 均使用英文；查詢文字仍可輸入中文。此資料夾是可獨立安裝與建置的來源包，不會使用根目錄的依賴。它沒有語言切換設定，也不包含中文介面資源。

根目錄的新版支援三語並預設美式英語。Raycast 的[目前送審規範](https://developers.raycast.com/basics/prepare-an-extension-for-store#localization--language)要求美式英語，並請勿自行實作介面本地化，因此送審包會移除語言選擇與中文介面資源。英文預設不代表保證過審；待辦見 [RAYCAST_SUBMISSION.md](RAYCAST_SUBMISSION.md)。

## 使用方式與設定

開啟「尋詞」或「覓句」，輸入描述，再按 Enter。新版不會在打字時連續發出請求，空白查詢不會送出。修改文字後，過期回應不會覆蓋目前畫面。中文、英文、引號、換行與網址特殊字元都會作為查詢文字處理。

在 Tinycast 的擴充套件設定中，新版的 **Interface Language / 介面語言 / 界面语言** 提供 **English (US)**、**繁體中文**、**简体中文**。指令內的提示、動作與錯誤訊息會切換；啟動器的靜態指令名稱及設定欄位不隨此偏好改名。

「搜尋前轉簡體」是尋詞、覓句共用的單一開關，預設開啟。只轉換查詢文字，關閉後送出原文；不轉換結果，也沒有另一箇轉換指令或方向選擇。OpenCC 轉換在本機執行。新版按 Enter 時，查詢文字會傳給深言達意；使用瀏覽器動作時會另將搜尋網址交給預設瀏覽器。本擴充套件不儲存查詢歷史或結果快取。

沿用原擴充套件 ID `deeplang`、指令 ID `wantwords` / `wantquotes` 與設定鍵 `useSystemOpencc`，以保留現有安裝的指令設定與轉換偏好；這個舊設定鍵現在控制內建 OpenCC，不再呼叫系統程式。

## 開發與來源

```sh
npm ci --ignore-scripts
npm run build
npm run check
npm run format:check
```

原始版本由 BaksiLi 開發，位於 [`BaksiLi/raycast-extensions` 的 `ext/deeplang` 分支](https://github.com/BaksiLi/raycast-extensions/tree/ext/deeplang/extensions/deeplang)，取自提交 `aca2701f8769412a9870fd54362ff0bbb480a74b`。本儲存庫將該擴充套件獨立維護。

已在 Tinycast 0.12.15 實測兩箇指令的原生結果。詳見 [驗證記錄](VALIDATION.md)。

繁簡轉換使用 [`opencc-js`](https://github.com/nk2028/opencc-js) 的 `t2cn` 套件入口與 `t → cn` 設定。程式採 MIT 授權；內建 OpenCC 程式與字典的授權見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

本專案與深言達意、DeepLang AI、Tinycast、Raycast 均無隸屬關係。
