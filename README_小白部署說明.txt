AI PPT Studio Cloud V9 App-Grade Flow

這版修正重點：
1. 首頁不再直接展示模板牆。
2. 用戶必須先輸入主題 / 文檔內容，再生成大綱。
3. 生成大綱後才推薦模板。
4. 模板縮略圖不再是同一堆顏色骨架，而是多種 App 級封面視覺。
5. 前台不展示第三方網站入口；外部模板只能作為後台靈感 / 授權管理 / 用戶自帶模板來源。
6. 下載 PPTX 需要模擬登入，正式版後續可接真實登入和付款。

Netlify 上傳：
1. 解壓整個 zip。
2. 確認文件夾內有 index.html、styles.css、app.js、vendor/pptxgen.bundle.js。
3. 把整個解壓後文件夾拖到 Netlify Production deploys 上傳框。
4. 發布後打開網站，按 Ctrl+R 或瀏覽器刷新。

成功標誌：
頁面頂部顯示：V9 App-Grade Flow · 先創建，再推薦模板
首頁不是模板牆，而是 AI 創建 / 導入文檔 / Google Drive 或 Web。
