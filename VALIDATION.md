# 驗證記錄

日期：2026-11-18（Asia/Taipei）。環境：macOS、Tinycast 0.12.15、預設瀏覽器 Arc；建置工具為 Node.js 26.4.0、Raycast API 1.88.4。

## Tinycast 實際操作

以 `npm run build` 產生的 manifest、兩個指令與 `assets/` 更新既有 `deeplang` 安裝，再重新啟動 Tinycast 載入。測試時保留「搜尋前將繁體轉為簡體」設定。

| 指令 | 輸入 | 網站查詢文字 | 結果 |
| --- | --- | --- | --- |
| 尋詞 | 學習中文與表達 | 学习中文与表达 | 中文提示與「開啟尋詞」動作顯示正常；Enter 開啟 `/wantWordsResult`，網站顯示查詢文字與詞語結果。 |
| 覓句 | 海內存知己，天涯若比鄰 | 海内存知己，天涯若比邻 | 中文提示與「開啟覓句」動作顯示正常；Enter 開啟 `/wantQuotesResult`，網站顯示查詢文字與句子結果。 |

兩個指令在未輸入文字時，均顯示各自的中文說明。網站以游客模式正常回傳結果；網站本身仍可能要求登入以使用完整功能。

## 程式與建置檢查

- `npm ci --ignore-scripts`：依鎖檔安裝。
- `npm run check`：TypeScript 與 ESLint 通過。
- `npm run format:check`：格式檢查通過。
- `npm run build`：兩個發布用指令建置成功，OpenCC 與字典已打包。
- 另執行 7 項查詢邏輯檢查，涵蓋一般繁體、句子繁體、關閉轉換、英文、換行與 shell 字面文字，以及兩個搜尋網址的編碼。

包含引號、`$HOME`、`$(...)`、反引號與網址特殊字元的查詢均保留為文字，沒有啟動 shell 或產生測試標記檔。URL 解碼後的查詢與輸入一致，`lang` 固定為 `zh`。

關閉轉換的案例以程式驗證；本次未手動切換 Tinycast 的既有偏好設定。Raycast 原生介面未在本次手動測試範圍內。
