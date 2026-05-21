/* AI PPT Studio Cloud V9 - App Grade Flow */
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

let isLoggedIn = false;
let currentTopic = '';
let currentScene = '智能判斷';
let currentOutline = [];
let selectedTemplate = null;
let recommendedTemplates = [];

const scenes = ['政府匯報','商業計劃','醫療健康','教育課件','公益項目','AI科技','產品發布','數據報告','金融報告','品牌宣傳','企業培訓','城市治理'];

const templateTypes = [
  { id:'career3d', name:'Career Steps', scene:'商業計劃', style:'business', color:'blue', title:'職涯階梯 · 3D 商務', desc:'3D 階梯與人物方向感，適合職業、培訓、成長路線。', premium:false },
  { id:'medicalWorkshop', name:'Medical Workshop', scene:'醫療健康', style:'medical', color:'blue', title:'醫療培訓 · 白藍照片風', desc:'醫護照片式構圖，適合診所、醫療課程、健康趨勢。', premium:true },
  { id:'diseaseGreen', name:'Disease Prevention', scene:'醫療健康', style:'medical', color:'green', title:'疾病預防 · 綠色專業', desc:'綠色醫療背景與人物卡片，適合健康管理與醫療方案。', premium:false },
  { id:'healthcareBlue', name:'Healthcare Trends', scene:'醫療健康', style:'medical', color:'blue', title:'健康趨勢 · 藍色卡片', desc:'科技醫療藍、團隊照片感，適合醫療數據與趨勢匯報。', premium:false },
  { id:'heartCare', name:'Heart Care', scene:'醫療健康', style:'warm', color:'blue', title:'心臟健康 · 插畫關懷', desc:'柔和插畫與醫療符號，適合公益健康教育。', premium:false },
  { id:'quantum', name:'Quantum Radiation', scene:'AI科技', style:'tech', color:'purple', title:'量子科技 · 霓虹光束', desc:'霓虹、晶體、科技光感，適合 AI、量子、科技產品。', premium:true },
  { id:'govSeal', name:'Policy Report', scene:'政府匯報', style:'premium', color:'blue', title:'政策白皮書 · 藍金正式', desc:'正式章印、城市線條、政府匯報感。', premium:false },
  { id:'blackGold', name:'Investor Pitch', scene:'商業計劃', style:'premium', color:'gold', title:'黑金路演 · 投資人版', desc:'高端黑金、強對比封面，適合商業計劃與融資。', premium:true },
  { id:'dashboard', name:'Data Dashboard', scene:'數據報告', style:'tech', color:'blue', title:'數據看板 · 儀表盤', desc:'大數據卡片和圖表模塊，適合分析報告。', premium:false },
  { id:'appLaunch', name:'App Launch', scene:'產品發布', style:'tech', color:'purple', title:'App 發布 · 產品界面', desc:'手機框、功能模塊與發布節奏，適合小程序與 SaaS。', premium:false },
  { id:'eduBoard', name:'Training Course', scene:'教育課件', style:'warm', color:'green', title:'教育課程 · 黑板書本', desc:'學習元素與課程感，適合培訓和教學。', premium:false },
  { id:'charityCats', name:'Cat Welfare', scene:'公益項目', style:'warm', color:'warm', title:'公益項目 · 溫暖生命教育', desc:'柔和公益視覺，適合動物福利、生命教育與社企。', premium:true },
  { id:'financeHK', name:'Finance Report', scene:'金融報告', style:'business', color:'blue', title:'港式金融 · 天際線報告', desc:'金融藍、城市線條、數字指標，適合金融與市場報告。', premium:false },
  { id:'magazine', name:'Brand Magazine', scene:'品牌宣傳', style:'minimal', color:'warm', title:'品牌雜誌 · 大圖版式', desc:'大圖雜誌感，適合品牌故事和產品介紹。', premium:false },
  { id:'chinaInk', name:'Modern Guochao', scene:'品牌宣傳', style:'premium', color:'warm', title:'國潮現代 · 東方品牌', desc:'水墨圓形、朱紅與留白，適合文化、旅遊、品牌項目。', premium:true },
  { id:'consulting', name:'Consulting Report', scene:'企業培訓', style:'minimal', color:'blue', title:'極簡咨詢 · 雙欄報告', desc:'清爽諮詢公司版式，適合企業內部方案。', premium:false },
  { id:'cityPlan', name:'City Governance', scene:'城市治理', style:'business', color:'blue', title:'城市治理 · 藍色規劃', desc:'城市網格、政策路徑和治理框架，適合公共項目。', premium:false },
  { id:'neonGrid', name:'AI Automation', scene:'AI科技', style:'tech', color:'purple', title:'AI 自動化 · 霓虹網格', desc:'暗色科技感，適合 AI 工作流、Agent、Automation。', premium:true },
  { id:'creamSoft', name:'Cream Soft Brand', scene:'公益項目', style:'warm', color:'warm', title:'奶油柔和 · 品牌提案', desc:'奶油色、圓角卡片與溫暖視覺，適合公益與輕品牌。', premium:false },
  { id:'businessBlocks', name:'Business Blocks', scene:'商業計劃', style:'business', color:'blue', title:'商務模塊 · 大塊拼接', desc:'大色塊與分層信息，適合產品方案和 B2B 報告。', premium:false },
  { id:'product3d', name:'3D Product', scene:'產品發布', style:'tech', color:'blue', title:'3D 產品 · 發布會風', desc:'3D 產品台、功能賣點卡，適合科技產品介紹。', premium:true },
  { id:'youthCourse', name:'Youth Course', scene:'教育課件', style:'warm', color:'purple', title:'青年課程 · 活潑插畫', desc:'柔和插畫與課程卡片，適合教育、親子、短視頻課程。', premium:false },
  { id:'govGold', name:'Government Gold', scene:'政府匯報', style:'premium', color:'gold', title:'政府金線 · 高端匯報', desc:'深色金線與正式留白，適合高層匯報。', premium:true },
  { id:'marketTrend', name:'Market Trend', scene:'數據報告', style:'business', color:'green', title:'市場趨勢 · 綠色增長', desc:'趨勢曲線與市場模塊，適合數據、增長、業績。', premium:false }
];

const topicInput = $('#topicInput');
const charCount = $('#charCount');
const engineStatus = $('#engineStatus');

function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.remove('hidden');
  setTimeout(()=>t.classList.add('hidden'), 2300);
}

function escapeXml(str=''){
  return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&apos;','"':'&quot;'}[c]));
}

function switchView(name){
  $$('.view').forEach(v => v.classList.remove('active'));
  $(`#view${name}`).classList.add('active');
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view===name));
}

function detectScene(topic, explicit){
  if(explicit && explicit !== 'auto') return explicit;
  const t = topic.toLowerCase();
  if(/醫|病|診所|健康|clinical|medical|clinic|老人|阿爾茨/.test(t)) return '醫療健康';
  if(/政府|政策|公共|園區|治理|旅遊|城市|land|bureau/.test(t)) return '政府匯報';
  if(/貓|公益|社企|福利|生命教育|救助|動物/.test(t)) return '公益項目';
  if(/ai|自動化|工作流|agent|coze|n8n|小程序|app|軟件|平台/.test(t)) return 'AI科技';
  if(/投資|融資|商業|收入|市場|盈利|計劃書|business/.test(t)) return '商業計劃';
  if(/數據|分析|報告|dashboard|kpi|指標/.test(t)) return '數據報告';
  if(/課程|教育|培訓|教學|學生|小朋友/.test(t)) return '教育課件';
  return '商業計劃';
}

function generateOutline(topic, scene, pages){
  const map = {
    '政府匯報':['項目定位與公共價值','現況痛點與政策背景','目標對象與服務場景','核心方案與空間/流程設計','治理機制與監管透明度','實施路徑與階段里程碑','資源配置與成本收益','風險控制與合規安排','社會效益與可量化 KPI','下一步行動'],
    '公益項目':['項目願景與公益定位','社會痛點與受益群體','服務模型與生命教育場景','運營機制與志願者/專業支持','透明治理與數據化管理','品牌傳播與社區參與','成本結構與可持續收入','風險合規與動物福利標準','階段計劃與合作需求','總結與行動呼籲'],
    'AI科技':['產品定位與目標用戶','核心痛點與使用場景','AI 工作流與功能架構','生成流程與輸出效果','技術路線與可替換模型','模板系統與產品體驗','商業模式與付費功能','部署方案與擴展路線','風險限制與下一步優化','總結與落地計劃'],
    '醫療健康':['背景與臨床/服務痛點','目標人群與應用場景','解決方案與流程設計','產品/服務功能模塊','數據指標與質量控制','診所落地與操作 SOP','合規、隱私與風險管理','成本與收益評估','推廣路線與合作模式','下一步行動'],
    '商業計劃':['市場機會與用戶痛點','產品方案與核心價值','目標客群與使用場景','競爭格局與差異化','商業模式與收入來源','增長路徑與渠道策略','成本結構與財務假設','團隊與執行計劃','里程碑與融資用途','總結與合作邀請'],
    '數據報告':['報告目標與數據範圍','核心發現摘要','關鍵指標儀表盤','趨勢變化與對比分析','分群洞察與原因推測','風險信號與改善空間','策略建議與優先級','執行計劃與負責人','監測機制與 KPI','結論與下一步'],
    '教育課件':['課程目標與學習成果','學員痛點與課程價值','核心概念與知識框架','案例演示與步驟拆解','互動練習與常見錯誤','工具/方法清單','實作任務與評估方式','延伸學習與資源','課後行動計劃','總結回顧'],
    '產品發布':['產品定位與發布背景','目標用戶與核心痛點','功能亮點與使用流程','產品界面與體驗設計','技術/服務架構','市場差異化與競品對比','定價與商業模式','上線計劃與推廣策略','風險與迭代路線','發布總結與 CTA']
  };
  const base = map[scene] || map['商業計劃'];
  const count = Number(pages) || 10;
  const titles = ['封面',...base].slice(0, count);
  return titles.map((title, i)=>({
    title: i===0 ? topic : title,
    subtitle: i===0 ? `${scene}｜專業簡報` : `圍繞「${topic.slice(0,26)}」展開的重點說明`,
    bullets: i===0 ? [] : [`清晰說明 ${title} 的核心目的`, `用可執行語言呈現重點，而非堆砌文字`, `為後續落地、合作或決策提供依據`]
  }));
}

function recommendTemplates(scene, topic){
  let pool = templateTypes.filter(t => t.scene === scene);
  if(scene==='政府匯報') pool = [...pool, ...templateTypes.filter(t=>['cityPlan','govGold','financeHK','consulting'].includes(t.id))];
  if(scene==='公益項目') pool = [...pool, ...templateTypes.filter(t=>['charityCats','creamSoft','chinaInk','govSeal'].includes(t.id))];
  if(scene==='AI科技') pool = [...pool, ...templateTypes.filter(t=>['neonGrid','quantum','appLaunch','product3d','dashboard'].includes(t.id))];
  if(scene==='醫療健康') pool = [...pool, ...templateTypes.filter(t=>t.style==='medical')];
  if(pool.length < 8) pool = [...pool, ...templateTypes.filter(t=>t.style==='business' || t.style==='premium')];
  const unique = [...new Map(pool.map(t=>[t.id,t])).values()];
  return unique.slice(0, 12);
}

function thumbSvg(type, title){
  const safe = escapeXml(title.split('·')[0].trim());
  const svgs = {
    career3d:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#173d63"/><stop offset="1" stop-color="#78a8d6"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><rect x="0" y="0" width="720" height="405" fill="#0d2740" opacity=".18"/><path d="M120 315h300v34H120zM175 265h245v34H175zM230 215h190v34H230zM285 165h135v34H285z" fill="#c8d7e7" opacity=".72"/><circle cx="392" cy="132" r="40" fill="#ffd9a3"/><path d="M365 172h50l30 88h-110z" fill="#12263e"/><text x="468" y="150" fill="white" font-family="Arial" font-size="46" font-weight="800">Career</text><text x="468" y="202" fill="white" font-family="Arial" font-size="46" font-weight="800">Steps</text><text x="520" y="310" fill="#dbeafe" font-family="Arial" font-size="17">Here is where your presentation begins</text></svg>`,
    medicalWorkshop:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#4777d6"/><rect x="0" y="0" width="335" height="405" fill="#eef4ff"/><circle cx="165" cy="140" r="72" fill="#c98d65"/><path d="M105 305c15-78 110-78 125 0z" fill="#5ba1d8"/><rect x="298" y="85" width="335" height="180" fill="white"/><polygon points="600,85 633,85 633,118" fill="#ffd043"/><text x="340" y="158" fill="#111827" font-family="Arial" font-size="41" font-weight="900">Medical</text><text x="340" y="210" fill="#111827" font-family="Arial" font-size="41" font-weight="900">Training</text><text x="340" y="255" fill="#111827" font-family="Arial" font-size="29" font-weight="900">Workshop</text></svg>`,
    diseaseGreen:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#a8d9bd"/><rect x="360" y="0" width="360" height="405" fill="#f7f8f2"/><circle cx="520" cy="150" r="70" fill="#c99772"/><rect x="470" y="220" width="120" height="115" rx="36" fill="#fff"/><path d="M102 105h42v42h42v42h-42v42h-42v-42H60v-42h42z" fill="#0b6b45"/><text x="58" y="285" fill="#0b1f18" font-family="Arial" font-size="44" font-weight="900">Disease</text><text x="58" y="335" fill="#0b1f18" font-family="Arial" font-size="44" font-weight="900">Prevention</text></svg>`,
    healthcareBlue:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#d8f0ff"/><stop offset="1" stop-color="#b4d6ff"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><rect x="390" y="92" width="245" height="168" rx="22" fill="white" filter="drop-shadow(0 12px 20px rgba(0,0,0,.12))"/><circle cx="455" cy="158" r="42" fill="#d59b75"/><circle cx="520" cy="158" r="42" fill="#bf8463"/><circle cx="585" cy="158" r="42" fill="#7c5a4b"/><text x="60" y="140" fill="#0b1c35" font-family="Arial" font-size="55" font-weight="900">HEALTHCARE</text><text x="60" y="205" fill="#0b1c35" font-family="Arial" font-size="55" font-weight="900">TRENDS</text><rect x="60" y="265" width="230" height="34" rx="17" fill="#08172b"/><circle cx="305" cy="282" r="17" fill="#186dff"/><text x="555" y="340" fill="#2d7fff" font-family="Arial" font-size="70" font-weight="900">+</text></svg>`,
    heartCare:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#72c7ff"/><stop offset="1" stop-color="#c6f1ff"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><circle cx="500" cy="200" r="105" fill="#fff" opacity=".35"/><circle cx="520" cy="190" r="58" fill="#ff795c"/><path d="M520 260c-58-42-88-70-88-112 0-60 70-75 88-28 18-47 88-32 88 28 0 42-30 70-88 112z" fill="#ff553d"/><circle cx="205" cy="175" r="58" fill="#f2c196"/><path d="M145 342c15-86 105-86 120 0z" fill="#2e5c8f"/><text x="55" y="120" fill="#fff" font-family="Arial" font-size="66" font-weight="900">Heart</text></svg>`,
    quantum:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#efe7ff"/><stop offset="1" stop-color="#fff1fb"/></linearGradient><linearGradient id="r" x1="0" x2="1"><stop stop-color="#8b5cf6"/><stop offset=".5" stop-color="#67e8f9"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><polygon points="330,80 430,130 330,180 230,130" fill="url(#r)" opacity=".75"/><polygon points="330,180 430,130 430,240 330,300" fill="#9b6dff" opacity=".45"/><polygon points="330,180 230,130 230,240 330,300" fill="#47c3e8" opacity=".35"/><line x1="330" y1="55" x2="330" y2="335" stroke="#fff" stroke-width="16" opacity=".65"/><text x="390" y="225" fill="#7c3aed" font-family="Arial" font-size="47" font-weight="900">QUANTUM</text><text x="390" y="278" fill="#7c3aed" font-family="Arial" font-size="41" font-weight="900">RADIATION</text></svg>`,
    govSeal:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#f6f3ea"/><path d="M0 0h720v38H0z" fill="#0b1d35"/><path d="M0 38h310v6H0z" fill="#d46c4a"/><circle cx="590" cy="130" r="115" fill="#dbeafe" opacity=".7"/><path d="M545 92h90v90h-90z" fill="#f8dfa9"/><text x="70" y="135" fill="#07152b" font-family="Arial" font-size="48" font-weight="900">${safe}</text><text x="70" y="195" fill="#07152b" font-family="Arial" font-size="48" font-weight="900">Policy Report</text><rect x="70" y="255" width="190" height="52" rx="10" fill="#fff" stroke="#e2d7c4"/><rect x="280" y="255" width="190" height="52" rx="10" fill="#fff" stroke="#e2d7c4"/></svg>`,
    blackGold:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#050505"/><stop offset="1" stop-color="#38280e"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><circle cx="585" cy="120" r="68" fill="none" stroke="#d8a829" stroke-width="3"/><rect x="62" y="110" width="320" height="52" rx="6" fill="#d8a829"/><rect x="62" y="182" width="240" height="18" rx="9" fill="#fff7d0"/><text x="62" y="290" fill="#fff" font-family="Arial" font-size="52" font-weight="900">Investor Pitch</text><text x="62" y="336" fill="#d8a829" font-family="Arial" font-size="25" font-weight="700">Growth · Capital · Strategy</text></svg>`,
    dashboard:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#eef6ff"/><rect x="40" y="42" width="300" height="150" rx="24" fill="#0b1d35"/><rect x="370" y="42" width="310" height="150" rx="24" fill="#fff"/><rect x="40" y="220" width="200" height="135" rx="24" fill="#fff"/><rect x="265" y="220" width="200" height="135" rx="24" fill="#fff"/><rect x="490" y="220" width="190" height="135" rx="24" fill="#fff"/><polyline points="75,150 125,120 175,132 225,86 295,106" fill="none" stroke="#61d394" stroke-width="12" stroke-linecap="round"/><rect x="400" y="85" width="210" height="18" rx="9" fill="#2563eb"/><rect x="400" y="125" width="155" height="18" rx="9" fill="#8cc1ff"/><text x="70" y="305" fill="#0b1d35" font-family="Arial" font-size="36" font-weight="900">DATA</text></svg>`,
    appLaunch:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#ede9fe"/><stop offset="1" stop-color="#e0f2fe"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><rect x="82" y="58" width="180" height="290" rx="36" fill="#0b1d35"/><rect x="105" y="100" width="134" height="205" rx="24" fill="#fff"/><rect x="340" y="85" width="270" height="56" rx="18" fill="#fff"/><rect x="340" y="165" width="220" height="56" rx="18" fill="#fff"/><rect x="340" y="245" width="250" height="56" rx="18" fill="#fff"/><circle cx="172" cy="204" r="44" fill="#7c4dff"/><text x="380" y="130" fill="#111827" font-family="Arial" font-size="40" font-weight="900">App Launch</text></svg>`,
    eduBoard:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#fbf5df"/><rect x="65" y="65" width="365" height="220" rx="18" fill="#23423a"/><rect x="95" y="102" width="250" height="16" rx="8" fill="#fff"/><rect x="95" y="150" width="180" height="14" rx="7" fill="#ffd166"/><rect x="95" y="196" width="230" height="14" rx="7" fill="#8ee7c2"/><path d="M500 280l120 30v-190l-120-30z" fill="#7c4dff" opacity=".85"/><path d="M500 280l-105 30v-190l105-30z" fill="#a78bfa"/><text x="75" y="342" fill="#123" font-family="Arial" font-size="40" font-weight="900">Training Course</text></svg>`,
    charityCats:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#fff5e8"/><stop offset="1" stop-color="#fde2e4"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><circle cx="515" cy="195" r="105" fill="#ffcf99" opacity=".45"/><circle cx="470" cy="200" r="58" fill="#f6c08e"/><circle cx="560" cy="200" r="58" fill="#fff"/><polygon points="430,154 450,105 475,160" fill="#f6c08e"/><polygon points="520,154 550,105 575,160" fill="#fff"/><text x="60" y="145" fill="#8a4a2f" font-family="Arial" font-size="45" font-weight="900">Warm Welfare</text><text x="60" y="202" fill="#8a4a2f" font-family="Arial" font-size="45" font-weight="900">Life Education</text></svg>`,
    financeHK:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#eaf4ff"/><path d="M0 270h720v135H0z" fill="#0b1d35"/><path d="M70 270V150h55v120M150 270V90h70v180M245 270V130h55v140M330 270V70h90v200M445 270V120h60v150M530 270V170h70v100" fill="#1d4f8f" opacity=".8"/><polyline points="70,215 170,180 250,205 340,120 465,155 610,100" fill="none" stroke="#ffd25a" stroke-width="10" stroke-linecap="round"/><text x="65" y="340" fill="white" font-family="Arial" font-size="42" font-weight="900">Finance Report</text></svg>`,
    magazine:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#fff"/><rect x="0" y="0" width="360" height="405" fill="#e1d5c7"/><circle cx="235" cy="185" r="98" fill="#b77f5d"/><rect x="405" y="80" width="235" height="28" rx="14" fill="#111827"/><text x="405" y="180" fill="#111827" font-family="Arial" font-size="54" font-weight="900">Brand</text><text x="405" y="240" fill="#111827" font-family="Arial" font-size="54" font-weight="900">Story</text><rect x="405" y="285" width="180" height="12" rx="6" fill="#d1d5db"/></svg>`,
    chinaInk:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#f9f3e7"/><circle cx="510" cy="170" r="130" fill="#a11d21"/><circle cx="210" cy="185" r="85" fill="none" stroke="#d97706" stroke-width="18"/><path d="M90 180h350" stroke="#120a0a" stroke-width="28"/><path d="M90 225h210" stroke="#a11d21" stroke-width="12"/><text x="90" y="320" fill="#17110f" font-family="Arial" font-size="41" font-weight="900">Modern Guochao</text></svg>`,
    consulting:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#f7f8fb"/><rect x="50" y="65" width="285" height="260" rx="24" fill="#fff" stroke="#dfe6f0"/><rect x="385" y="65" width="285" height="260" rx="24" fill="#0b1d35"/><rect x="88" y="110" width="170" height="20" rx="10" fill="#2563eb"/><rect x="88" y="160" width="205" height="12" rx="6" fill="#cbd5e1"/><rect x="425" y="112" width="185" height="22" rx="11" fill="#fff"/><circle cx="520" cy="230" r="62" fill="none" stroke="#5cc8ff" stroke-width="18"/><text x="88" y="275" fill="#0b1d35" font-family="Arial" font-size="35" font-weight="900">Consulting</text></svg>`,
    cityPlan:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#eef6ff"/><path d="M0 320h720v85H0z" fill="#cbdaf2"/><path d="M90 320V185h75v135M190 320V105h90v215M310 320V160h75v160M410 320V85h105v235M545 320V170h85v150" fill="#315c99"/><circle cx="560" cy="90" r="52" fill="#ffd166" opacity=".8"/><text x="60" y="90" fill="#0b1d35" font-family="Arial" font-size="45" font-weight="900">City Governance</text><rect x="60" y="125" width="260" height="14" rx="7" fill="#7aa7df"/></svg>`,
    neonGrid:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#060a1f"/><stop offset="1" stop-color="#17103d"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><path d="M0 300h720M0 245h720M0 195h720M0 150h720M85 405L320 110M190 405L380 95M300 405L440 80M430 405L510 70M560 405L590 80" stroke="#7c4dff" stroke-width="2" opacity=".5"/><circle cx="530" cy="142" r="65" fill="none" stroke="#5eead4" stroke-width="12"/><text x="70" y="150" fill="#fff" font-family="Arial" font-size="52" font-weight="900">AI Automation</text><text x="70" y="205" fill="#a78bfa" font-family="Arial" font-size="30" font-weight="900">Workflow Studio</text></svg>`,
    creamSoft:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#fff7ed"/><rect x="60" y="70" width="250" height="260" rx="35" fill="#fff"/><rect x="350" y="70" width="250" height="260" rx="35" fill="#ffe0c2"/><circle cx="510" cy="170" r="70" fill="#fdbb74"/><rect x="95" y="120" width="160" height="20" rx="10" fill="#fb923c"/><rect x="95" y="170" width="120" height="14" rx="7" fill="#fed7aa"/><text x="95" y="260" fill="#7c2d12" font-family="Arial" font-size="36" font-weight="900">Soft Brand</text></svg>`,
    businessBlocks:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#f5f7fb"/><rect x="40" y="50" width="305" height="140" rx="24" fill="#1f4f7a"/><rect x="375" y="50" width="305" height="140" rx="24" fill="#f2b84b"/><rect x="40" y="220" width="640" height="110" rx="24" fill="#fff"/><text x="70" y="135" fill="white" font-family="Arial" font-size="40" font-weight="900">Business</text><text x="405" y="135" fill="#1d2939" font-family="Arial" font-size="40" font-weight="900">Strategy</text><rect x="75" y="258" width="500" height="18" rx="9" fill="#dbe4f0"/></svg>`,
    product3d:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#dff4ff"/><stop offset="1" stop-color="#f7edff"/></linearGradient></defs><rect width="720" height="405" fill="url(#g)"/><ellipse cx="440" cy="300" rx="150" ry="32" fill="#9ca3af" opacity=".28"/><rect x="340" y="120" width="190" height="170" rx="36" fill="#0b1d35"/><rect x="365" y="145" width="140" height="95" rx="22" fill="#7c4dff"/><circle cx="455" cy="268" r="10" fill="#fff"/><text x="70" y="150" fill="#0b1d35" font-family="Arial" font-size="50" font-weight="900">3D Product</text><text x="70" y="202" fill="#0b1d35" font-family="Arial" font-size="34" font-weight="700">Launch Deck</text></svg>`,
    youthCourse:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#f4e8ff"/><circle cx="170" cy="150" r="58" fill="#f7b7a3"/><path d="M92 330c10-90 145-90 156 0z" fill="#8b5cf6"/><rect x="340" y="70" width="300" height="240" rx="30" fill="#fff"/><rect x="380" y="120" width="170" height="18" rx="9" fill="#c084fc"/><rect x="380" y="170" width="220" height="14" rx="7" fill="#ddd6fe"/><rect x="380" y="215" width="160" height="14" rx="7" fill="#ddd6fe"/><text x="70" y="80" fill="#5b21b6" font-family="Arial" font-size="34" font-weight="900">Youth Course</text></svg>`,
    govGold:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#090b0e"/><path d="M0 0h720v35H0z" fill="#d6a43a"/><circle cx="560" cy="160" r="105" fill="none" stroke="#d6a43a" stroke-width="2"/><rect x="80" y="110" width="360" height="10" fill="#d6a43a"/><text x="80" y="205" fill="#fff" font-family="Arial" font-size="55" font-weight="900">Government</text><text x="80" y="263" fill="#d6a43a" font-family="Arial" font-size="40" font-weight="900">Executive Report</text></svg>`,
    marketTrend:`<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#f0fdf4"/><rect x="55" y="62" width="610" height="275" rx="28" fill="#fff"/><polyline points="95,270 170,235 250,245 335,190 440,165 560,105" fill="none" stroke="#22c55e" stroke-width="15" stroke-linecap="round"/><circle cx="560" cy="105" r="18" fill="#166534"/><text x="95" y="150" fill="#14532d" font-family="Arial" font-size="48" font-weight="900">Market Trend</text><rect x="95" y="185" width="220" height="16" rx="8" fill="#bbf7d0"/></svg>`
  };
  return svgs[type] || svgs.govSeal;
}

function renderOutline(){
  const box = $('#outlinePreview');
  box.innerHTML = currentOutline.slice(0,8).map((s,i)=>`<div class="outline-pill"><small>${String(i+1).padStart(2,'0')}</small><strong>${escapeXml(s.title)}</strong></div>`).join('');
  $('#outlineSummary').textContent = `已根據「${currentTopic}」推薦 ${recommendedTemplates.length} 個內部模板；前台不展示第三方來源。`;
}

function renderTemplates(){
  const style = $('#styleFilter').value;
  const color = $('#colorFilter').value;
  let list = recommendedTemplates.filter(t => (style==='all'||t.style===style) && (color==='all'||t.color===color));
  if(!list.length) list = recommendedTemplates;
  $('#templateGrid').innerHTML = list.map(t=>`
    <article class="template-card" data-id="${t.id}">
      <div class="thumb">${thumbSvg(t.id, t.title)}</div>
      <div class="tpl-body">
        <div class="tpl-tags"><span class="tag">${t.scene}</span><span class="tag">${styleLabel(t.style)}</span>${t.premium?'<span class="tag vip">會員</span>':''}</div>
        <h3>${escapeXml(t.title)}</h3>
        <p>${escapeXml(t.desc)}</p>
        <div class="tpl-actions"><button class="use" data-use="${t.id}">套用模板</button><button class="preview" data-prev="${t.id}">預覽</button></div>
      </div>
    </article>`).join('');
}
function styleLabel(s){return ({minimal:'極簡',business:'商務',tech:'科技感',warm:'溫暖',medical:'醫療',premium:'高端'}[s]||s)}

function buildSlides(){
  const tpl = selectedTemplate || recommendedTemplates[0] || templateTypes[0];
  return currentOutline.map((o,i)=>({index:i+1,title:o.title,subtitle:o.subtitle,bullets:o.bullets,template:tpl}));
}

function slidePreviewSvg(slide){
  const tpl = slide.template || selectedTemplate || templateTypes[0];
  const title = escapeXml(slide.title.length>36 ? slide.title.slice(0,36)+'…' : slide.title);
  const type = tpl.id;
  if(slide.index===1) return thumbSvg(type, tpl.title).replace('</svg>', `<rect x="40" y="310" width="640" height="70" rx="18" fill="rgba(255,255,255,.72)"/><text x="65" y="355" fill="#0b1d35" font-family="Arial" font-size="26" font-weight="900">${title}</text></svg>`);
  return `<svg viewBox="0 0 720 405" xmlns="http://www.w3.org/2000/svg"><rect width="720" height="405" fill="#f8fafc"/><rect x="0" y="0" width="720" height="52" fill="${tpl.color==='gold'?'#0b0b0b': tpl.color==='purple'?'#6d28d9': tpl.color==='green'?'#0f766e':'#0b1d35'}"/><circle cx="640" cy="120" r="80" fill="${tpl.color==='warm'?'#fed7aa':tpl.color==='gold'?'#d6a43a':tpl.color==='green'?'#bbf7d0':tpl.color==='purple'?'#ddd6fe':'#dbeafe'}" opacity=".8"/><text x="55" y="120" fill="#0b1d35" font-family="Arial" font-size="34" font-weight="900">${title}</text><rect x="55" y="165" width="270" height="118" rx="20" fill="white" stroke="#dfe7f1"/><rect x="360" y="165" width="270" height="118" rx="20" fill="white" stroke="#dfe7f1"/><rect x="83" y="198" width="190" height="16" rx="8" fill="#cbd5e1"/><rect x="83" y="235" width="150" height="12" rx="6" fill="#e2e8f0"/><rect x="388" y="198" width="190" height="16" rx="8" fill="#cbd5e1"/><rect x="388" y="235" width="150" height="12" rx="6" fill="#e2e8f0"/><rect x="55" y="320" width="580" height="14" rx="7" fill="#e2e8f0"/></svg>`;
}

function renderDeckPreview(){
  const slides = buildSlides();
  $('#deckPreview').innerHTML = slides.map(s=>`
    <div class="slide-card"><div class="slide-shot">${slidePreviewSvg(s)}</div><div class="slide-info"><strong>${s.index}. ${escapeXml(s.title)}</strong><span>${escapeXml(s.subtitle||'')}</span></div></div>`).join('');
}

function afterGenerate(){
  currentTopic = topicInput.value.trim();
  if(!currentTopic){ toast('請先輸入主題或內容'); return; }
  currentScene = detectScene(currentTopic, $('#sceneInput').value);
  currentOutline = generateOutline(currentTopic, currentScene, $('#pageInput').value);
  recommendedTemplates = recommendTemplates(currentScene, currentTopic);
  selectedTemplate = recommendedTemplates[0];
  $('#templateLocked').classList.add('hidden');
  $('#templateReady').classList.remove('hidden');
  renderOutline();
  renderTemplates();
  switchView('Templates');
  toast(`已根據「${currentScene}」推薦模板`);
}

function selectTemplate(id, preview=false){
  selectedTemplate = templateTypes.find(t=>t.id===id) || recommendedTemplates[0];
  renderDeckPreview();
  switchView('Preview');
  toast(preview ? '正在預覽模板效果' : '已套用模板，可預覽或下載');
}

function setLogin(v=true){
  isLoggedIn = v;
  $('#accountName').textContent = v ? 'AIPPT Demo User' : '未登入';
  $('#loginBtn').textContent = v ? '已登入' : '登入';
  toast(v ? '已模擬登入' : '已登出');
}

function colorsForTpl(tpl){
  const map = {
    blue:{dark:'0B1D35',accent:'2563EB',soft:'DBEAFE',warm:'F6F3EA'},
    gold:{dark:'090B0E',accent:'D6A43A',soft:'FFF4CC',warm:'F6F3EA'},
    green:{dark:'064E3B',accent:'10B981',soft:'D1FAE5',warm:'F0FDF4'},
    purple:{dark:'2E1065',accent:'7C3AED',soft:'EDE9FE',warm:'F7F0FF'},
    warm:{dark:'7C2D12',accent:'FB923C',soft:'FFEDD5',warm:'FFF7ED'}
  };
  return map[tpl.color] || map.blue;
}

async function downloadPptx(){
  if(!window.PptxGenJS){ toast('PPTX 引擎未載入，請刷新頁面'); return; }
  if(!isLoggedIn){ $('#memberModal').classList.remove('hidden'); return; }
  const tpl = selectedTemplate || recommendedTemplates[0] || templateTypes[0];
  const c = colorsForTpl(tpl);
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'AI PPT Studio Cloud V9';
  pptx.subject = currentTopic;
  pptx.company = 'AI PPT Studio Cloud';
  pptx.lang = $('#langInput').value;
  pptx.theme = { headFontFace:'Aptos Display', bodyFontFace:'Aptos' };

  currentOutline.forEach((item, idx)=>{
    const slide = pptx.addSlide();
    slide.background = { color: idx===0 ? (tpl.color==='gold'?'090B0E':'F7F4EC') : 'F8FAFC' };
    if(idx===0){
      slide.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.333,h:.22,fill:{color:c.dark},line:{color:c.dark}});
      slide.addShape(pptx.ShapeType.rect,{x:0,y:.22,w:4.2,h:.07,fill:{color:c.accent},line:{color:c.accent}});
      slide.addText('AI PPT STUDIO CLOUD', {x:.75,y:.55,w:3,h:.25,fontSize:8,bold:true,color:c.accent,margin:0});
      slide.addText(currentTopic, {x:.75,y:1.35,w:7.2,h:1.3,fontSize:30,bold:true,color:tpl.color==='gold'?'FFFFFF':'07152B',breakLine:false,fit:'shrink'});
      slide.addText(`${currentScene}｜${tpl.title}`, {x:.75,y:2.95,w:7.2,h:.36,fontSize:13,color:tpl.color==='gold'?'EBD89A':'526073'});
      slide.addShape(pptx.ShapeType.arc,{x:9.15,y:.92,w:2.1,h:2.1,adjustPoint:.35,line:{color:c.accent,transparency:15,pt:6},rotate:0});
      slide.addShape(pptx.ShapeType.rect,{x:9.4,y:1.65,w:1.7,h:1.15,fill:{color:c.soft,transparency:0},line:{color:c.soft}});
      slide.addShape(pptx.ShapeType.roundRect,{x:.75,y:4.6,w:2.55,h:.8,rectRadius:.08,fill:{color:tpl.color==='gold'?'1F2937':'FFFFFF'},line:{color:'D9DEE8'}});
      slide.addText(tpl.title.split('·')[0],{x:.95,y:4.85,w:2.1,h:.2,fontSize:13,bold:true,color:tpl.color==='gold'?'FFFFFF':'07152B'});
      slide.addShape(pptx.ShapeType.roundRect,{x:3.55,y:4.6,w:2.55,h:.8,rectRadius:.08,fill:{color:tpl.color==='gold'?'1F2937':'FFFFFF'},line:{color:'D9DEE8'}});
      slide.addText(`${currentOutline.length} 頁 PPTX`,{x:3.75,y:4.85,w:2.1,h:.2,fontSize:13,bold:true,color:tpl.color==='gold'?'FFFFFF':'07152B'});
      slide.addShape(pptx.ShapeType.roundRect,{x:9.2,y:4.85,w:2.3,h:.55,rectRadius:.08,fill:{color:c.dark},line:{color:c.dark}});
      slide.addText('一鍵生成專業簡報',{x:9.35,y:5.03,w:2,h:.16,fontSize:8,bold:true,color:'FFFFFF',align:'center'});
      slide.addText(new Date().toLocaleDateString('zh-HK'),{x:.75,y:6.55,w:2,h:.2,fontSize:8,color:tpl.color==='gold'?'C9B879':'667085'});
    } else {
      slide.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.333,h:.16,fill:{color:c.dark},line:{color:c.dark}});
      slide.addShape(pptx.ShapeType.rect,{x:0,y:.16,w:4.2,h:.06,fill:{color:c.accent},line:{color:c.accent}});
      slide.addText(item.title,{x:.8,y:.78,w:7.4,h:.52,fontSize:24,bold:true,color:'07152B',fit:'shrink'});
      slide.addText(item.subtitle,{x:.8,y:1.38,w:8.8,h:.28,fontSize:11,color:'526073',fit:'shrink'});
      const bullets = item.bullets.length ? item.bullets : ['清晰拆解問題、方案與行動路線','用圖表化語言提升匯報效率','保留後續接入 AI 模型和模板庫空間'];
      const layouts = idx % 4;
      if(layouts===1){
        bullets.forEach((b,j)=>{ slide.addShape(pptx.ShapeType.roundRect,{x:.85+j*3.95,y:2.2,w:3.5,h:1.45,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}}); slide.addShape(pptx.ShapeType.ellipse,{x:1.08+j*3.95,y:2.45,w:.32,h:.32,fill:{color:c.accent},line:{color:c.accent}}); slide.addText(b,{x:1.08+j*3.95,y:2.95,w:2.95,h:.45,fontSize:13,bold:true,color:'172033',fit:'shrink'}); });
      } else if(layouts===2){
        slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.05,w:5.6,h:2.8,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}});
        slide.addText(bullets.map((b,i)=>`${i+1}. ${b}`).join('\n'),{x:1.15,y:2.42,w:4.9,h:1.9,fontSize:14,color:'172033',breakLine:false,fit:'shrink'});
        slide.addShape(pptx.ShapeType.roundRect,{x:7.05,y:2.05,w:4.5,h:2.8,rectRadius:.08,fill:{color:c.soft},line:{color:c.soft}});
        slide.addText(idx%3===0?'KPI':'ROADMAP',{x:7.45,y:2.45,w:3.7,h:.5,fontSize:22,bold:true,color:c.dark});
        slide.addShape(pptx.ShapeType.chevron,{x:7.45,y:3.35,w:1,h:.5,fill:{color:c.accent},line:{color:c.accent}});
        slide.addShape(pptx.ShapeType.chevron,{x:8.65,y:3.35,w:1,h:.5,fill:{color:c.accent,transparency:20},line:{color:c.accent}});
        slide.addShape(pptx.ShapeType.chevron,{x:9.85,y:3.35,w:1,h:.5,fill:{color:c.accent,transparency:35},line:{color:c.accent}});
      } else if(layouts===3){
        slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.05,w:10.7,h:2.8,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}});
        bullets.forEach((b,j)=>{ slide.addShape(pptx.ShapeType.line,{x:1.4+j*3.2,y:3.2,w:2.4,h:0,line:{color:c.accent,pt:3}}); slide.addShape(pptx.ShapeType.ellipse,{x:1.25+j*3.2,y:3.05,w:.3,h:.3,fill:{color:c.accent},line:{color:c.accent}}); slide.addText(b,{x:1.05+j*3.2,y:3.55,w:2.6,h:.56,fontSize:12,bold:true,color:'172033',fit:'shrink'}); });
      } else {
        slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.05,w:4.7,h:2.8,rectRadius:.08,fill:{color:c.dark},line:{color:c.dark}});
        slide.addText('核心重點',{x:1.2,y:2.45,w:3.8,h:.3,fontSize:18,bold:true,color:'FFFFFF'});
        slide.addText(bullets[0],{x:1.2,y:3.05,w:3.7,h:.7,fontSize:14,color:'FFFFFF',fit:'shrink'});
        slide.addShape(pptx.ShapeType.roundRect,{x:6.05,y:2.05,w:5.5,h:2.8,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}});
        slide.addText(bullets.slice(1).map(b=>'• '+b).join('\n'),{x:6.45,y:2.5,w:4.7,h:1.65,fontSize:14,color:'172033',fit:'shrink'});
      }
      slide.addText(`${idx+1}/${currentOutline.length}`,{x:11.9,y:6.78,w:.6,h:.15,fontSize:8,color:'667085',align:'right'});
    }
  });
  const name = (currentTopic || 'AI_PPT').replace(/[\\/:*?"<>|\s]+/g,'_').slice(0,36) + '_V9.pptx';
  await pptx.writeFile({ fileName:name });
  toast('PPTX 已生成並下載');
}

function bind(){
  if(window.PptxGenJS){ engineStatus.textContent='PPTX 引擎已本地載入'; engineStatus.className='engine good'; }
  else { engineStatus.textContent='PPTX 引擎未載入'; engineStatus.className='engine bad'; }

  topicInput.addEventListener('input',()=> charCount.textContent = topicInput.value.length);
  $('#sampleBtn').addEventListener('click',()=>{ topicInput.value='香港城市流浪貓科學福利及生命教育園區：希望做成政府、教育、公益、旅遊和可持續營運結合的專業匯報簡報，強調科學管理、透明監管、生命教育、社會企業模式和長期公共價值。'; charCount.textContent=topicInput.value.length; });
  $('#generateOutlineBtn').addEventListener('click', afterGenerate);
  $('#backEditBtn').addEventListener('click',()=> switchView('Create'));
  $('#regenBtn').addEventListener('click',()=>{ recommendedTemplates = recommendTemplates(currentScene,currentTopic).sort(()=>Math.random()-.5); renderTemplates(); toast('已重新推薦模板'); });
  $('#styleFilter').addEventListener('change', renderTemplates);
  $('#colorFilter').addEventListener('change', renderTemplates);
  $('#templateGrid').addEventListener('click',e=>{ const use=e.target.dataset.use; const prev=e.target.dataset.prev; if(use) selectTemplate(use,false); if(prev) selectTemplate(prev,true); });
  $('#changeTplBtn').addEventListener('click',()=> switchView('Templates'));
  $('#downloadBtn').addEventListener('click',downloadPptx);
  $('#loginBtn').addEventListener('click',()=>setLogin(true));
  $('#loginBtn2').addEventListener('click',()=>setLogin(true));
  $('#upgradeBtn').addEventListener('click',()=>switchView('Pro'));
  $('#closeModal').addEventListener('click',()=>$('#memberModal').classList.add('hidden'));
  $('#modalLogin').addEventListener('click',async()=>{ $('#memberModal').classList.add('hidden'); setLogin(true); await downloadPptx(); });
  $$('.nav-item').forEach(btn=> btn.addEventListener('click',()=> switchView(btn.dataset.view)));
  $$('[data-jump="create"]').forEach(b=>b.addEventListener('click',()=>switchView('Create')));
  $$('.mode').forEach(m=>m.addEventListener('click',()=>{ $$('.mode').forEach(x=>x.classList.remove('active')); m.classList.add('active'); const mode=m.dataset.mode; $('#inputTitle').textContent = mode==='ai'?'輸入簡報需求':mode==='doc'?'導入文檔 / 貼上內容':'貼上 Google Drive 或 Web 內容'; topicInput.placeholder = mode==='ai'?'例如：香港城市流浪貓科學福利及生命教育園區 / AI 自動化短視頻生成工作流':'可以先貼上文檔內容。正式版再接 Word / PDF / URL 解析。'; }));
}

window.addEventListener('DOMContentLoaded', bind);
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{})); }
