# 深言達意更新紀錄

## 未發布

- Tinycast 新增美式英語、繁體中文、簡體中文介面，預設美式英語；繁體文案使用「箇」。
- 新增由共用程式產生的 Raycast 英文來源包，移除語言選擇與中文介面資源。
- 寫好原生尋詞清單、句子全文詳情、作者／作品及複製原文與出處。
- 隨套件建置 Swift 輔助程式，用 macOS WebKit 在背景讀取深言達意公開結果頁。加入 15 秒逾時、重試、過期回應處理及瀏覽器備用動作。
- OpenCC 只在搜尋前繁轉簡，尋詞、覓句共用一個預設開啟的設定開關。
- 搜尋時顯示轉換後的查詢，並可直接複製。

## 2026-11-18

- 從 Raycast 擴充套件分支獨立為 `shenyandayi-launcher`。
- 指令、搜尋提示、設定與錯誤訊息改用繁體中文。
- 內建 OpenCC 轉換與字典，移除 shell 指令、固定 Homebrew 路徑及外部程式依賴。
- 查詢非空白時顯示可操作的搜尋項目；空白時顯示中文說明。
- 保留原擴充套件、指令與偏好設定 ID。

## 原始版本 · 2025-01-15

- Initial release with two main commands:
  - Search Words (WantWords/尋詞): Find Chinese words based on descriptions
  - Search Quotes (WantQuotes/覓句): Find matching quotes and expressions
- Added OpenCC integration for traditional/simplified Chinese conversion
- Added bilingual interface support
