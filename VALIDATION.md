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

## GitHub 來源獨立建置

從公開儲存庫 `BaksiLi/shenyandayi-launcher` 的 `main` 下載原始碼至新的暫存資料夾，未使用既有本機專案的 `node_modules` 或建置檔。`npm ci --ignore-scripts`、`npm run check`、`npm run format:check` 與 `npm run build` 全數通過。

Tinycast 的「Install from GitHub」介面確認接受 `owner/repo`，並說明安裝時暫存下載原始碼及依賴，完成後只保留建置產物。本次已填入儲存庫並選擇 npm；尚未按下最後的 Install，因此這項驗證只確認遠端來源可獨立建置，不能當作 Tinycast 的 GitHub 安裝已完成。

## 原生結果整合調查

檢查官網目前公開前端使用的查詢路徑後，對下列端點各送出一次普通 JSON POST 請求，未使用瀏覽器 cookie、訪客識別或登入憑證：

- `/api/v1/words/pc/semantic/zh/association/`
- `/api/v1/sentences/pc/quote/match/`

查詢分別使用「学习中文与表达」與「海内存知己，天涯若比邻」，並帶入前端使用的 `lang`、`category`、`is_filter` 欄位。兩者 HTTP 狀態均為 200，但回應內容皆為 `{"code":20009,"msg":"该账号存在异常","data":null}`，沒有搜尋結果。

因此尚未完成原生結果整合。這個結果僅表示上述匿名請求被拒絕，不代表網站沒有其他授權接入方式。現有發布版仍使用已通過實際操作驗證的網站搜尋流程。
