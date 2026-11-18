# Raycast 重新送審準備

**待確認深言達意的書面許可。** Raycast 英文版已通過兩箇即時查詢並完成錄影。

原 PR：<https://github.com/raycast/extensions/pull/16372>。2025-01-14 建立，2025-01-22 被要求修改並補操作錄影，2025-02-12 因沒有後續活動而關閉；未合併。

## 已完成的程式準備

- 根目錄新版提供美式英語、繁體中文及簡體中文，預設美式英語；繁體文案採用「箇」。
- `npm run prepare:raycast` 產生 `build/raycast` 英文來源包，搜尋、轉換與結果介面和三語版共用。
- 依官方 Localization / Language 規範，英文包移除語言選擇、中文介面資源與語言讀取邏輯；manifest、指令、設定、動作、錯誤提示與文件使用英文。
- OpenCC 與字典內建，移除 Homebrew、shell 與系統程式依賴。
- 尋詞、覓句共用一個預設開啟的 OpenCC 繁轉簡開關；搜尋清單顯示並可複製實際送出的查詢。
- 以 macOS 內建 WebKit 載入官網公開結果頁。擴充套件可顯示詞語清單、句子全文、作者與作品，並複製引文及出處。

## 提交前仍需完成

- [x] 透過 WebKit 讀取尋詞與覓句網頁的即時資料，確認句子原文和出處。
- [ ] 確認深言達意允許在啟動器顯示結果。條款 4.4.1(2) 涉及站外整理展示，Raycast 將未經服務商允許的擷取列為退件理由。見 [網頁接入](SERVICE_INTEGRATION.md)。
- [x] 以目前 Raycast API 獨立建置英文包，確認打包後的兩箇命令可取得即時資料。
- [x] 在 Raycast 2.12.1 實測發行版的兩箇查詢。
- [x] 在 Tinycast 實測三語版的兩箇命令、轉換預覽和原生結果。安裝使用獨立發行建置。
- [x] 錄製英文介面的 OpenCC 預覽、查詢、原生清單、引文出處及複製動作選單。影片位於 `build/Shenyandayi-Raycast-demo.mp4`。送審工作目錄已更新截圖。
- [ ] 依最終行為更新原 PR 分支、描述、檢查清單與錄影，再重新開啟並請求審查。

## 錄影流程

1. 在 Raycast 啟動 **Search Words**，輸入「描寫山很高」。停一下，讓觀眾看見簡體查詢預覽，再按 Return 展示結果及複製動作。
2. 啟動 **Search Quotes**，輸入「朋友要互相幫助」。按 Return，選取一筆有作者與作品的句子，展示詳情和複製出處。
3. 開啟擴充套件設定，展示預設啟用的繁轉簡選項。用 `⌘O` 展示官網備用動作。

## 官方依據

- [Prepare an Extension for Store](https://developers.raycast.com/basics/prepare-an-extension-for-store)：英文介面、目前 API、發布建置實測、第三方服務條款與操作示範。
- [Extensions Guidelines](https://manual.raycast.com/extensions-guidelines)：提供超越內建功能的價值，並遵守整合服務的條款。
