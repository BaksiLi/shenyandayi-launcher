# 深言達意更新紀錄

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
