# 深言達意網頁接入

兩箇命令使用官網的 `/wantWordsResult` 與 `/wantQuotesResult` 頁面。直接 GET 只會取得 React 的 HTML 外殼。隨套件建置的 Swift 輔助程式以 `WKWebView` 渲染公開網頁，從頁面讀取第一頁的詞語、引文、作者及作品，再交給啟動器的清單。

每次查詢使用暫存訪客工作階段。擴充套件在按 Enter 時送出查詢，略過舊查詢的回應，並提供 15 秒逾時及「在瀏覽器中搜尋」動作。它不讀取瀏覽器的登入狀態，也不儲存查詢或結果。

先前直接對兩箇網站內部端點送出匿名 JSON 的實驗均回 `20009`。目前的實作以正常訪客方式載入網頁，由官網程式完成查詢。

專案作者已確認取得深言達意的許可，可在擴充套件中顯示搜尋結果。送審說明記載了許可與網頁擷取方式。 [深言達意服務條款](https://www.shenyandayi.com/userCenter?tab=registrationAndServiceTerms) · [Raycast PR](https://github.com/raycast/extensions/pull/16372)
