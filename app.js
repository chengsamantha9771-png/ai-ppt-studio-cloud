/* AI PPT Studio Cloud V10 - Professional template previews, static GitHub Pages build */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

let isLoggedIn = false;
let isMember = false;
let currentTopic = '';
let currentScene = 'public';
let currentOutline = [];
let recommendedTemplates = [];
let selectedTemplate = null;

const SCENES = {
  public: ['公益項目','項目定位與公共價值','現況痛點與政策背景','目標對象與服務場景','核心方案與空間/流程設計','治理機制與監管透明度','實施路徑與階段里程碑','資源配置與成本收益','社會影響與可持續模型','下一步行動'],
  gov: ['政府匯報','政策背景與工作目標','問題現況與需求分析','整體方案框架','治理架構與部門協同','執行路線與時間表','資源預算與風險控制','監管透明與績效指標','試點成果與擴展計劃','請示事項與下一步'],
  biz: ['商業計劃','市場機會與行業趨勢','目標客群與核心痛點','產品/服務解決方案','商業模式與收入來源','競爭優勢與壁壘','營銷獲客與渠道策略','財務預測與成本結構','團隊能力與里程碑','合作/融資需求'],
  product: ['產品發布','產品定位與一句話價值','用戶痛點與使用場景','核心功能與體驗亮點','產品流程與界面演示','技術架構與安全能力','差異化競爭優勢','上線計劃與運營節奏','增長指標與轉化模型','發布總結與行動'],
  medical: ['醫療健康','臨床/診所場景需求','現有流程問題與風險','解決方案與服務模式','設備/系統功能介紹','患者/診所體驗流程','合規與數據安全','成本效率與管理收益','推廣落地計劃','後續合作建議'],
  education: ['教育課件','學習目標與課程導入','核心概念拆解','案例故事與互動問題','知識點一：原理說明','知識點二：場景應用','練習與小組討論','重點總結與思維導圖','延伸閱讀與作業','課後行動'],
  finance: ['金融報告','宏觀背景與市場概覽','核心數據與關鍵指標','業務表現與增長拆解','風險因素與敏感性分析','投資邏輯與估值框架','同業比較與競爭格局','策略建議與資產配置','未來展望與監測指標','結論'],
  data: ['數據分析','分析目標與數據來源','總覽儀表板','關鍵指標一：趨勢變化','關鍵指標二：群體差異','關鍵指標三：轉化漏斗','問題定位與原因假設','行動建議與優先級','監測機制與復盤節奏','總結'],
  tech: ['AI 科技','產品願景與技術定位','用戶痛點與自動化機會','AI 工作流總覽','核心能力與模型策略','系統架構與數據流','安全合規與可替換模型','落地案例與效率提升','迭代路線圖','下一步開發計劃'],
  brand: ['品牌宣傳','品牌故事與市場定位','目標人群與情感洞察','品牌視覺與語氣風格','核心產品/服務亮點','內容矩陣與傳播節奏','渠道策略與社群運營','合作資源與活動策劃','品牌資產沉澱','行動計劃']
};

const TEMPLATES = [
  {id:'career-3d', title:'Career Steps 3D 進階風', cat:'business', scene:['biz','education','product'], premium:false, visual:'career', desc:'3D 階梯與空間感封面，適合職業成長、培訓、方案匯報。', colors:['#1f4e79','#7fb3d5','#f8d49a']},
  {id:'medical-photo', title:'Medical Training Workshop', cat:'medical', scene:['medical','education'], premium:true, visual:'medicalPhoto', desc:'醫療照片式版面，白藍大標題區，適合醫療培訓和診所匯報。', colors:['#1f5fbf','#ffffff','#f5c542']},
  {id:'green-health', title:'Disease Prevention Strategy', cat:'medical', scene:['medical','public'], premium:false, visual:'greenHealth', desc:'綠色醫療策略風，適合疾病預防、社區健康和公益醫療。', colors:['#3c7a5f','#b6dec7','#ffffff']},
  {id:'health-trends', title:'Healthcare Trends', cat:'medical', scene:['medical','data'], premium:true, visual:'healthTrends', desc:'醫療趨勢封面，藍白卡片與人物區，適合趨勢報告。', colors:['#1d4ed8','#93c5fd','#0f172a']},
  {id:'quantum', title:'Quantum Radiation 科技霓虹', cat:'tech', scene:['tech','product'], premium:false, visual:'quantum', desc:'科技霓虹、光束與晶體感，適合 AI、科技、產品發布。', colors:['#6d28d9','#22d3ee','#f5f3ff']},
  {id:'gov-whitepaper', title:'政府白皮書 · 公共治理', cat:'public', scene:['gov','public'], premium:false, visual:'gov', desc:'正式政府白皮書風，適合政策、治理、公共項目匯報。', colors:['#0b1d35','#d6a43a','#f6f1e6']},
  {id:'blackgold-pitch', title:'Black Gold Pitch Deck', cat:'finance', scene:['biz','finance'], premium:true, visual:'blackGold', desc:'黑金高端路演風，適合投資、金融、商業計劃書。', colors:['#0a0a0a','#d4af37','#ffffff']},
  {id:'dashboard', title:'Executive Data Dashboard', cat:'business', scene:['data','finance','gov'], premium:false, visual:'dashboard', desc:'數據看板風，適合 KPI、分析報告和管理層簡報。', colors:['#0b1220','#38bdf8','#22c55e']},
  {id:'app-launch', title:'Mobile App Product Launch', cat:'tech', scene:['product','tech'], premium:false, visual:'appLaunch', desc:'手機介面與產品卡片風，適合小程序、App、SaaS 發布。', colors:['#4f46e5','#a78bfa','#e0e7ff']},
  {id:'edu-chalk', title:'Education Workshop Chalk', cat:'creative', scene:['education'], premium:false, visual:'chalk', desc:'教育黑板與便利貼風，適合課程、培訓和工作坊。', colors:['#1f3f36','#facc15','#ffffff']},
  {id:'cat-public', title:'Cat Welfare Warm Brand', cat:'public', scene:['public','brand'], premium:true, visual:'cat', desc:'溫暖公益貓咪品牌風，適合生命教育、動物福利和公益項目。', colors:['#f97316','#fde68a','#7c2d12']},
  {id:'hk-finance', title:'Hong Kong Finance Report', cat:'finance', scene:['finance','biz'], premium:false, visual:'hkFinance', desc:'城市天際線與金融報告風，適合香港金融、商務匯報。', colors:['#0f172a','#2563eb','#fbbf24']},
  {id:'guochao', title:'國潮現代品牌發表', cat:'creative', scene:['brand','product'], premium:true, visual:'guochao', desc:'紅金國潮與現代幾何版面，適合品牌發布與文化項目。', colors:['#991b1b','#f59e0b','#fff7ed']},
  {id:'consulting', title:'Strategy Consulting Minimal', cat:'business', scene:['biz','gov'], premium:false, visual:'consulting', desc:'極簡諮詢報告風，適合策略、企業管理、專業方案。', colors:['#111827','#e5e7eb','#f97316']},
  {id:'eco', title:'Sustainable Green Future', cat:'public', scene:['public','brand'], premium:false, visual:'eco', desc:'可持續發展綠色視覺，適合 ESG、環保、公益項目。', colors:['#047857','#86efac','#ecfdf5']},
  {id:'luxury', title:'Luxury Brand Magazine', cat:'creative', scene:['brand','biz'], premium:true, visual:'luxury', desc:'高級雜誌式品牌封面，適合品牌宣傳、精品、生活方式。', colors:['#3b2418','#d6a43a','#f8f1e7']},
  {id:'magazine', title:'Editorial Story Deck', cat:'creative', scene:['brand','education'], premium:false, visual:'magazine', desc:'雜誌排版與大圖敘事，適合故事型簡報與內容提案。', colors:['#0f172a','#f43f5e','#f8fafc']},
  {id:'smartcity', title:'Smart City Blueprint', cat:'tech', scene:['gov','tech','data'], premium:true, visual:'smartcity', desc:'智慧城市藍圖與網格資料流，適合城市治理、AI 平台。', colors:['#082f49','#22d3ee','#e0f2fe']},
  {id:'product-3d', title:'3D Product Showcase', cat:'tech', scene:['product','brand'], premium:false, visual:'product3d', desc:'3D 產品展示風，適合硬件、設備、科技產品介紹。', colors:['#334155','#f97316','#f8fafc']},
  {id:'creative-gradient', title:'Creative Gradient Studio', cat:'creative', scene:['brand','product'], premium:false, visual:'gradient', desc:'大膽漸變與創意視覺，適合年輕品牌、小紅書課程。', colors:['#7c3aed','#ec4899','#facc15']},
  {id:'research-lab', title:'Research Lab Report', cat:'medical', scene:['medical','tech','data'], premium:false, visual:'lab', desc:'研究室與數據分析風，適合科研、診斷、測試設備匯報。', colors:['#0e7490','#cffafe','#ffffff']},
  {id:'infrastructure', title:'Infrastructure Masterplan', cat:'public', scene:['gov','public'], premium:true, visual:'infra', desc:'基建規劃、城市發展、公共設施方案專用模板。', colors:['#334155','#f59e0b','#e2e8f0']},
  {id:'warm-startup', title:'Warm Startup Story', cat:'business', scene:['biz','product'], premium:false, visual:'warmStartup', desc:'柔和初創故事風，適合創業提案、品牌故事、產品路線。', colors:['#f97316','#fed7aa','#431407']},
  {id:'neon-roadshow', title:'Neon Investor Roadshow', cat:'finance', scene:['biz','finance','tech'], premium:true, visual:'neon', desc:'暗色霓虹投資路演，適合高增長科技、AI、Web3 方向。', colors:['#020617','#a855f7','#22d3ee']}
];

function escapeXml(s=''){return String(s).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&apos;','"':'&quot;'}[c]));}
function shortTitle(s,n=36){s=String(s||'未命名簡報');return s.length>n?s.slice(0,n)+'…':s;}
function toast(msg,type='ok'){ const el=document.createElement('div'); el.className=`toast ${type}`; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.remove(),2300); }

function buildOutline(topic, sceneKey, count){
  const arr = SCENES[sceneKey] || SCENES.public;
  const titles = [topic, ...arr.slice(1)];
  while(titles.length<count){ titles.push(['補充案例與落地細節','關鍵風險與應對策略','成果展示與管理指標','長期擴展與商業閉環'][titles.length%4]); }
  return titles.slice(0,count).map((title,i)=>({
    title: i===0?topic:title,
    subtitle: i===0 ? `${arr[0]}｜專業簡報封面` : `圍繞「${shortTitle(topic,22)}」展開的重點說明`,
    bullets: [
      i===0 ? '明確匯報對象、用途與價值主張' : `${title}的核心觀點與事實依據`,
      i%3===0 ? '以圖表化方式呈現決策信息' : '拆解目標、流程、資源與時間安排',
      i%2===0 ? '形成可執行的下一步行動' : '突出風險控制與可持續性'
    ]
  }));
}

function recommendTemplates(sceneKey){
  const byScene = TEMPLATES.filter(t=>t.scene.includes(sceneKey));
  const extra = TEMPLATES.filter(t=>!t.scene.includes(sceneKey));
  return [...byScene, ...extra].slice(0,24);
}

function svgBase(w=720,h=405,body=''){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${body}</svg>`;}
function defs(){return `<defs>
  <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#eef4ff"/></linearGradient>
  <linearGradient id="neon" x1="0" x2="1"><stop stop-color="#7c3aed"/><stop offset=".55" stop-color="#22d3ee"/><stop offset="1" stop-color="#facc15"/></linearGradient>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0f172a" flood-opacity=".2"/></filter>
</defs>`;}

function thumbSvg(tpl){
  const title=escapeXml(tpl.title); const [a,b,c]=tpl.colors;
  const commonText = `<text x="48" y="68" font-size="24" font-weight="900" fill="${a}">YOUR LOGO</text>`;
  let body='';
  switch(tpl.visual){
    case 'career': body=`<rect width="720" height="405" fill="#254b6d"/><rect x="0" y="0" width="720" height="405" fill="url(#g1)" opacity=".12"/><path d="M95 317 h315 v-34 H130 v-36 h245 v-34 H165 v-36 h180 v-34" fill="none" stroke="#9fc3de" stroke-width="36" stroke-linejoin="round"/><rect x="0" y="0" width="720" height="405" fill="#0b1d35" opacity=".05"/><circle cx="485" cy="130" r="70" fill="#f8d49a"/><path d="M445 280 L500 160 L558 280 Z" fill="#071426"/><text x="430" y="155" font-size="48" font-weight="900" fill="#fff">Career</text><text x="430" y="210" font-size="48" font-weight="900" fill="#fff">Steps</text><text x="430" y="300" font-size="16" fill="#cde6f7">Here is where your presentation begins</text>`;break;
    case 'medicalPhoto': body=`<rect width="720" height="405" fill="#f8fafc"/><rect x="355" y="0" width="365" height="405" fill="#376bd5"/><circle cx="160" cy="205" r="92" fill="#e2e8f0"/><path d="M105 300 q55-105 110 0" fill="#fff"/><circle cx="160" cy="145" r="36" fill="#9ca3af"/><rect x="55" y="96" width="350" height="185" rx="12" fill="#fff" filter="url(#shadow)"/><text x="86" y="160" font-size="42" font-weight="900" fill="#111827">Medical Training</text><text x="86" y="213" font-size="42" font-weight="900" fill="#111827">Workshop</text><path d="M660 0 L720 0 L720 65 Z" fill="#f5c542"/><text x="90" y="252" font-size="17" fill="#64748b">Here is where your presentation begins</text>`;break;
    case 'greenHealth': body=`<rect width="720" height="405" fill="#b6dec7"/><rect x="350" y="0" width="370" height="405" fill="#eef7ef"/><circle cx="505" cy="198" r="90" fill="#fff"/><circle cx="505" cy="142" r="38" fill="#9ca3af"/><path d="M430 315 q75-120 150 0" fill="#9ca3af"/><rect x="48" y="60" width="42" height="120" fill="#0b6b4c"/><rect x="9" y="99" width="120" height="42" fill="#0b6b4c"/><text x="52" y="215" font-size="45" font-weight="900" fill="#0b1d16">Disease Prevention</text><text x="52" y="268" font-size="45" font-weight="900" fill="#0b1d16">Strategy</text><text x="52" y="332" font-size="16" fill="#31624c">Public health program deck</text>`;break;
    case 'healthTrends': body=`<rect width="720" height="405" fill="#dbeafe"/><rect x="40" y="74" width="360" height="245" rx="22" fill="#fff"/><text x="72" y="165" font-size="56" font-weight="900" fill="#0f172a">HEALTHCARE</text><text x="72" y="232" font-size="56" font-weight="900" fill="#0f172a">TRENDS</text><rect x="78" y="270" width="230" height="22" rx="11" fill="#020617"/><circle cx="300" cy="281" r="10" fill="#2563eb"/><rect x="440" y="78" width="220" height="165" rx="18" fill="#fff" filter="url(#shadow)"/><circle cx="500" cy="145" r="42" fill="#94a3b8"/><circle cx="560" cy="145" r="42" fill="#64748b"/><circle cx="620" cy="145" r="42" fill="#475569"/><text x="440" y="300" font-size="70" fill="#2563eb" font-weight="900">＋</text><text x="580" y="300" font-size="70" fill="#2563eb" font-weight="900">＋</text>`;break;
    case 'quantum': body=`<rect width="720" height="405" fill="#faf5ff"/><circle cx="360" cy="202" r="185" fill="url(#neon)" opacity=".18"/><path d="M115 285 C210 70 350 370 610 90" stroke="url(#neon)" stroke-width="16" fill="none" opacity=".75"/><polygon points="386,110 450,180 410,285 320,260 300,160" fill="#a78bfa" opacity=".55"/><text x="65" y="170" font-size="58" font-weight="900" fill="#6d28d9">QUANTUM</text><text x="65" y="238" font-size="58" font-weight="900" fill="#6d28d9">RADIATION</text><text x="65" y="300" font-size="17" fill="#64748b">Future technology presentation</text>`;break;
    case 'gov': body=`<rect width="720" height="405" fill="#f7f1e6"/><rect x="0" y="0" width="720" height="22" fill="#0b1d35"/><rect x="0" y="22" width="250" height="6" fill="#d6a43a"/><path d="M420 285 h210 v-34 h-210zM455 251 v-95 h22 v95M515 251 v-95 h22 v95M575 251 v-95 h22 v95M440 150 h170 l-85-50z" fill="#0b1d35" opacity=".9"/><text x="58" y="125" font-size="48" font-weight="900" fill="#0b1d35">PUBLIC POLICY</text><text x="58" y="185" font-size="48" font-weight="900" fill="#0b1d35">WHITE PAPER</text><rect x="58" y="245" width="270" height="8" fill="#d6a43a"/><text x="58" y="290" font-size="18" fill="#5b6472">Government briefing deck</text>`;break;
    case 'blackGold': body=`<rect width="720" height="405" fill="#070707"/><circle cx="590" cy="88" r="120" fill="#d4af37" opacity=".25"/><path d="M0 405 L720 160 L720 405Z" fill="#d4af37" opacity=".12"/><text x="58" y="125" font-size="42" font-weight="900" fill="#d4af37">INVESTOR</text><text x="58" y="185" font-size="70" font-weight="900" fill="#fff">ROADSHOW</text><rect x="58" y="235" width="250" height="10" fill="#d4af37"/><text x="58" y="285" font-size="19" fill="#e8d8a3">Premium pitch deck</text>`;break;
    case 'dashboard': body=`<rect width="720" height="405" fill="#071426"/><rect x="42" y="54" width="190" height="110" rx="16" fill="#102a43"/><rect x="260" y="54" width="190" height="110" rx="16" fill="#102a43"/><rect x="478" y="54" width="190" height="110" rx="16" fill="#102a43"/><rect x="42" y="198" width="300" height="150" rx="18" fill="#102a43"/><rect x="370" y="198" width="298" height="150" rx="18" fill="#102a43"/><path d="M75 315 L130 260 L190 290 L260 225 L315 245" stroke="#38bdf8" stroke-width="8" fill="none"/><rect x="405" y="265" width="38" height="60" fill="#22c55e"/><rect x="470" y="240" width="38" height="85" fill="#38bdf8"/><rect x="535" y="210" width="38" height="115" fill="#a855f7"/><text x="58" y="125" font-size="34" font-weight="900" fill="#fff">EXECUTIVE</text><text x="58" y="158" font-size="22" fill="#94a3b8">DATA DASHBOARD</text>`;break;
    case 'appLaunch': body=`<rect width="720" height="405" fill="#eef2ff"/><circle cx="610" cy="80" r="112" fill="#a78bfa" opacity=".35"/><rect x="84" y="48" width="190" height="310" rx="32" fill="#111827"/><rect x="102" y="72" width="154" height="240" rx="18" fill="#fff"/><rect x="126" y="98" width="106" height="22" rx="11" fill="#4f46e5"/><rect x="126" y="145" width="106" height="86" rx="20" fill="#ddd6fe"/><rect x="324" y="105" width="300" height="70" rx="20" fill="#fff"/><rect x="324" y="205" width="250" height="70" rx="20" fill="#fff"/><text x="322" y="288" font-size="50" font-weight="900" fill="#4f46e5">APP LAUNCH</text>`;break;
    case 'chalk': body=`<rect width="720" height="405" fill="#1f3f36"/><rect x="40" y="45" width="640" height="315" rx="22" fill="#17322c" stroke="#f8fafc" stroke-width="3" opacity=".95"/><text x="72" y="118" font-size="48" font-weight="900" fill="#fff">WORKSHOP</text><text x="72" y="177" font-size="42" fill="#facc15">Learning Journey</text><rect x="430" y="88" width="150" height="100" rx="12" fill="#fde68a" transform="rotate(-5 430 88)"/><rect x="480" y="210" width="128" height="95" rx="12" fill="#bfdbfe" transform="rotate(4 480 210)"/><path d="M78 260 h280" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".65"/>`;break;
    case 'cat': body=`<rect width="720" height="405" fill="#fff7ed"/><circle cx="590" cy="105" r="130" fill="#fed7aa"/><circle cx="160" cy="190" r="75" fill="#f97316" opacity=".9"/><path d="M110 150 L130 105 L155 145 M205 145 L235 105 L232 160" fill="#f97316"/><circle cx="142" cy="185" r="10" fill="#fff"/><circle cx="180" cy="185" r="10" fill="#fff"/><path d="M120 230 Q160 260 200 230" stroke="#fff" stroke-width="7" fill="none"/><text x="310" y="145" font-size="48" font-weight="900" fill="#7c2d12">CAT WELFARE</text><text x="310" y="205" font-size="38" font-weight="900" fill="#f97316">LIFE EDUCATION</text><rect x="310" y="245" width="260" height="12" fill="#fed7aa"/>`;break;
    case 'hkFinance': body=`<rect width="720" height="405" fill="#0f172a"/><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#0f172a"/></linearGradient><rect width="720" height="260" fill="url(#sky)" opacity=".55"/><path d="M40 330 v-80 h35 v80h25v-130h55v130h35v-105h45v105h35v-160h65v160h30v-115h60v115h40v-180h70v180h45v-90h55v90" fill="#0b1220"/><text x="56" y="110" font-size="50" font-weight="900" fill="#fff">HONG KONG</text><text x="56" y="170" font-size="50" font-weight="900" fill="#fbbf24">FINANCE</text>`;break;
    case 'guochao': body=`<rect width="720" height="405" fill="#fff7ed"/><circle cx="570" cy="105" r="120" fill="#991b1b"/><circle cx="118" cy="120" r="70" fill="none" stroke="#f59e0b" stroke-width="20"/><path d="M80 105 h220 M80 150 h260" stroke="#991b1b" stroke-width="12"/><text x="78" y="260" font-size="56" font-weight="900" fill="#991b1b">國潮品牌</text><text x="78" y="320" font-size="34" fill="#92400e">Modern Chinese Identity</text>`;break;
    default: body=`<rect width="720" height="405" fill="${c}"/><circle cx="570" cy="90" r="120" fill="${a}" opacity=".25"/><rect x="55" y="80" width="260" height="70" rx="18" fill="#fff"/><rect x="55" y="190" width="420" height="32" rx="16" fill="${a}" opacity=".75"/><text x="62" y="280" font-size="46" font-weight="900" fill="${a}">${title}</text>`;
  }
  return svgBase(720,405,defs()+body);
}

function slideSvg(tpl, item, idx){
  const t=escapeXml(shortTitle(item.title,34)); const sub=escapeXml(shortTitle(item.subtitle,60)); const [a,b,c]=tpl.colors;
  const num=String(idx+1).padStart(2,'0');
  let accent=a, bg='#ffffff', ink='#0b1628';
  if(['blackGold','neon'].includes(tpl.visual)){bg='#05070d'; ink='#ffffff'; accent=b;}
  if(tpl.visual==='gov'){bg='#f7f1e6'; accent='#d6a43a'}
  if(tpl.visual==='cat'){bg='#fff7ed'; accent='#f97316'}
  const bullets=(item.bullets||[]).map((b,i)=>`<text x="86" y="${238+i*35}" font-size="18" font-weight="700" fill="${ink==='white'?'#fff':'#334155'}">• ${escapeXml(shortTitle(b,45))}</text>`).join('');
  let decor='';
  switch(tpl.visual){
    case 'career': decor=`<path d="M465 330 h190 v-28 H495 v-32 h138 v-28 H525 v-32 h90" stroke="#9fc3de" stroke-width="28" fill="none"/><circle cx="575" cy="142" r="52" fill="#f8d49a"/><path d="M540 292 L575 170 L615 292 Z" fill="#071426"/>`;break;
    case 'medicalPhoto': decor=`<rect x="450" y="88" width="190" height="150" rx="18" fill="#eaf2ff"/><circle cx="510" cy="155" r="35" fill="#94a3b8"/><path d="M448 280 q65-90 130 0" fill="#cbd5e1"/><path d="M640 0 L720 0 L720 72 Z" fill="#f5c542"/>`;break;
    case 'dashboard': decor=`<rect x="460" y="102" width="210" height="145" rx="18" fill="#102a43"/><path d="M485 205 L535 150 L585 185 L645 122" stroke="#38bdf8" stroke-width="8" fill="none"/><rect x="475" y="285" width="38" height="55" fill="#22c55e"/><rect x="540" y="250" width="38" height="90" fill="#38bdf8"/><rect x="605" y="220" width="38" height="120" fill="#a855f7"/>`;break;
    case 'cat': decor=`<circle cx="555" cy="190" r="80" fill="#fed7aa"/><circle cx="555" cy="192" r="58" fill="#f97316"/><path d="M512 155 L530 115 L545 155 M588 155 L610 115 L603 160" fill="#f97316"/><circle cx="535" cy="190" r="8" fill="#fff"/><circle cx="575" cy="190" r="8" fill="#fff"/>`;break;
    case 'blackGold': decor=`<circle cx="600" cy="82" r="110" fill="#d4af37" opacity=".25"/><path d="M420 360 L720 180 L720 360Z" fill="#d4af37" opacity=".14"/>`;break;
    default: decor=`<circle cx="600" cy="95" r="105" fill="${accent}" opacity=".16"/><rect x="450" y="176" width="210" height="92" rx="18" fill="${accent}" opacity=".12"/><rect x="480" y="206" width="150" height="10" rx="5" fill="${accent}" opacity=".45"/><rect x="480" y="230" width="110" height="10" rx="5" fill="${accent}" opacity=".25"/>`;
  }
  const card = idx===0 ? `<rect x="56" y="300" width="340" height="48" rx="14" fill="#ffffff" opacity=".92"/><text x="78" y="332" font-size="20" font-weight="900" fill="#0b1628">${t}</text>` : bullets;
  return svgBase(960,540,`${defs()}<rect width="960" height="540" fill="${bg}"/><rect x="0" y="0" width="960" height="20" fill="${ink==='#ffffff'?'#d4af37':'#0b1d35'}"/><rect x="0" y="20" width="280" height="7" fill="${accent}"/><text x="56" y="76" font-size="18" font-weight="900" fill="${accent}">AI PPT STUDIO CLOUD</text><text x="56" y="155" font-size="44" font-weight="900" fill="${ink}">${t}</text><text x="56" y="206" font-size="18" fill="${ink==='#ffffff'?'#d1d5db':'#64748b'}">${sub}</text>${card}${decor}<text x="830" y="494" font-size="18" fill="${ink==='#ffffff'?'#d1d5db':'#64748b'}">${num}/${currentOutline.length}</text>`);
}

function renderOutline(){
  $('#outlineList').innerHTML = currentOutline.map((it,i)=>`<div class="outline-item"><b>${i+1}. ${escapeXml(it.title)}</b><span>${escapeXml(it.subtitle)}</span></div>`).join('');
}
function renderTemplates(){
  const filter=$('#styleFilter').value;
  const data = filter==='all'?recommendedTemplates:recommendedTemplates.filter(t=>t.cat===filter);
  $('#templateHint').textContent=`已根據「${shortTitle(currentTopic,28)}」推薦 ${data.length} 個專業模板；前台不展示任何第三方網站。`;
  $('#templateGrid').innerHTML = data.map(t=>`<article class="template-item ${selectedTemplate?.id===t.id?'selected':''}" data-id="${t.id}">
    <div class="thumb">${thumbSvg(t)}</div>
    <div class="template-meta">
      <div class="pill-row"><span class="pill">內部模板</span><span class="pill">${sceneName()}</span>${t.premium?'<span class="pill vip">會員</span>':'<span class="pill">免費預覽</span>'}</div>
      <div class="template-title">${escapeXml(t.title)}</div>
      <div class="template-desc">${escapeXml(t.desc)}</div>
      <div class="template-actions"><button class="use-btn" data-use="${t.id}">套用模板</button><button class="preview-btn" data-preview="${t.id}">預覽</button></div>
    </div>
  </article>`).join('');
}
function sceneName(){return (SCENES[currentScene]||SCENES.public)[0];}
function renderPreview(){
  const tpl=selectedTemplate||recommendedTemplates[0];
  $('#previewStrip').innerHTML=currentOutline.map((it,i)=>`<div class="slide-preview">${slideSvg(tpl,it,i)}</div>`).join('');
}
function setSection(id){
  ['createPanel','outlinePanel','templatePanel','previewPanel','toolsPanel'].forEach(s=>$('#'+s)?.classList.add('hidden'));
  $('#'+id)?.classList.remove('hidden');
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.target===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
function showTemplates(){ if(!currentOutline.length){toast('請先輸入內容並生成大綱，再選模板','error'); setSection('createPanel'); return;} renderTemplates(); setSection('templatePanel'); }
function selectTemplate(id, preview=true){ selectedTemplate=TEMPLATES.find(t=>t.id===id)||recommendedTemplates[0]; renderTemplates(); renderPreview(); if(preview) setSection('previewPanel'); }
function setLogin(v=true){isLoggedIn=v; $('#loginBtn').textContent=v?'已登入':'登入'; toast(v?'已模擬登入':'已登出');}
function setMember(v=true){isLoggedIn=true; isMember=v; $('#loginBtn').textContent='已登入'; $('#memberModal').classList.add('hidden'); toast(v?'已模擬開通會員':'已模擬登入');}

function colorsForTpl(t){const [a,b,c]=t.colors;return {dark:(['blackGold','neon'].includes(t.visual)?'05070D':'0B1D35'),accent:a.replace('#',''),accent2:b.replace('#',''),soft:c.replace('#',''),bg:['blackGold','neon'].includes(t.visual)?'080B12':'F8FAFC'};}
function addTextBox(slide,pptx,text,x,y,w,h,opts={}){slide.addText(text,{x,y,w,h,fontFace:'Aptos',fontSize:opts.size||14,bold:!!opts.bold,color:opts.color||'172033',fit:'shrink',breakLine:false,margin:opts.margin||0.04,align:opts.align||'left'});}
async function downloadPptx(){
  if(!window.PptxGenJS){toast('PPTX 引擎未載入，請刷新頁面','error');return;}
  if(!currentOutline.length){toast('請先生成大綱','error');return;}
  if(!selectedTemplate){toast('請先選擇模板','error');showTemplates();return;}
  if(selectedTemplate.premium && !isMember){$('#memberModal').classList.remove('hidden');return;}
  if(!isLoggedIn){$('#memberModal').classList.remove('hidden');return;}
  const pptx=new PptxGenJS(); pptx.layout='LAYOUT_WIDE'; pptx.author='AI PPT Studio Cloud V10'; pptx.company='AI PPT Studio Cloud'; pptx.subject=currentTopic; pptx.lang=$('#languageSelect').value; pptx.theme={headFontFace:'Aptos Display',bodyFontFace:'Aptos'};
  const c=colorsForTpl(selectedTemplate); const dark=c.dark, accent=c.accent, accent2=c.accent2;
  currentOutline.forEach((it,i)=>{
    const slide=pptx.addSlide(); const isDark=['blackGold','neon'].includes(selectedTemplate.visual);
    slide.background={color:i===0?(isDark?dark:'F7F4EC'):'F8FAFC'};
    slide.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.333,h:.24,fill:{color:isDark?accent:dark},line:{color:isDark?accent:dark}});
    slide.addShape(pptx.ShapeType.rect,{x:0,y:.24,w:4.3,h:.08,fill:{color:accent},line:{color:accent}});
    const ink=isDark?'FFFFFF':'07152B'; const muted=isDark?'D1D5DB':'526073';
    if(i===0){
      addTextBox(slide,pptx,'AI PPT STUDIO CLOUD',.75,.55,3.6,.25,{size:8,bold:true,color:accent});
      addTextBox(slide,pptx,currentTopic,.75,1.25,7.3,1.4,{size:30,bold:true,color:ink});
      addTextBox(slide,pptx,`${sceneName()}｜${selectedTemplate.title}`,.75,2.9,7.5,.36,{size:13,color:muted});
      if(selectedTemplate.visual==='career'){ slide.addShape(pptx.ShapeType.line,{x:8.7,y:4.7,w:2.8,h:0,line:{color:'9FC3DE',pt:16}}); slide.addShape(pptx.ShapeType.ellipse,{x:9.3,y:1.2,w:.7,h:.7,fill:{color:'F8D49A'},line:{color:'F8D49A'}}); slide.addShape(pptx.ShapeType.triangle,{x:9.1,y:2.0,w:1.3,h:1.6,fill:{color:dark},line:{color:dark}}); }
      else if(selectedTemplate.visual==='cat'){ slide.addShape(pptx.ShapeType.ellipse,{x:9.1,y:1.2,w:1.9,h:1.9,fill:{color:'F97316'},line:{color:'F97316'}}); slide.addShape(pptx.ShapeType.arc,{x:8.8,y:1.0,w:2.3,h:2.3,line:{color:'FED7AA',pt:7}}); }
      else { slide.addShape(pptx.ShapeType.ellipse,{x:9.05,y:.95,w:2.2,h:2.2,fill:{color:accent,transparency:80},line:{color:accent,transparency:70}}); slide.addShape(pptx.ShapeType.roundRect,{x:9.35,y:1.7,w:1.8,h:1.1,rectRadius:.08,fill:{color:accent2,transparency:15},line:{color:accent2,transparency:15}}); }
      [[selectedTemplate.title.split(' ')[0]||'STYLE','專業模板'],[`${currentOutline.length} 頁`, 'PPTX 可下載']].forEach((pair,j)=>{slide.addShape(pptx.ShapeType.roundRect,{x:.75+j*2.9,y:4.65,w:2.55,h:.82,rectRadius:.08,fill:{color:isDark?'1F2937':'FFFFFF'},line:{color:'D9DEE8'}}); addTextBox(slide,pptx,pair[0],.95+j*2.9,4.88,2,.24,{size:14,bold:true,color:ink}); addTextBox(slide,pptx,pair[1],.95+j*2.9,5.17,2,.18,{size:8,color:muted});});
      slide.addShape(pptx.ShapeType.roundRect,{x:9.2,y:4.88,w:2.25,h:.55,rectRadius:.08,fill:{color:isDark?accent:dark},line:{color:isDark?accent:dark}}); addTextBox(slide,pptx,'一鍵生成專業簡報',9.35,5.06,1.95,.16,{size:8,bold:true,color:'FFFFFF',align:'center'});
    }else{
      addTextBox(slide,pptx,it.title,.8,.78,7.8,.55,{size:24,bold:true,color:'07152B'}); addTextBox(slide,pptx,it.subtitle,.8,1.4,8.9,.28,{size:11,color:'526073'});
      const bullets=it.bullets||[]; const mode=i%5;
      if(mode===1){ for(let j=0;j<3;j++){slide.addShape(pptx.ShapeType.roundRect,{x:.85+j*3.95,y:2.15,w:3.5,h:1.55,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}}); slide.addShape(pptx.ShapeType.ellipse,{x:1.08+j*3.95,y:2.45,w:.36,h:.36,fill:{color:accent},line:{color:accent}}); addTextBox(slide,pptx,bullets[j]||'專業重點',1.08+j*3.95,2.95,2.95,.54,{size:13,bold:true,color:'172033'});} }
      else if(mode===2){ slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.05,w:5.55,h:2.9,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}}); addTextBox(slide,pptx,bullets.map((b,k)=>`${k+1}. ${b}`).join('\n'),1.18,2.42,4.8,1.9,{size:14,color:'172033'}); slide.addShape(pptx.ShapeType.roundRect,{x:7.05,y:2.05,w:4.5,h:2.9,rectRadius:.08,fill:{color:c.soft},line:{color:c.soft}}); addTextBox(slide,pptx,'ROADMAP',7.45,2.45,3.7,.5,{size:22,bold:true,color:dark}); for(let k=0;k<3;k++) slide.addShape(pptx.ShapeType.chevron,{x:7.45+k*1.18,y:3.35,w:1,h:.52,fill:{color:accent,transparency:k*20},line:{color:accent}}); }
      else if(mode===3){ slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.05,w:10.7,h:2.85,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}}); for(let j=0;j<3;j++){slide.addShape(pptx.ShapeType.line,{x:1.4+j*3.2,y:3.2,w:2.4,h:0,line:{color:accent,pt:3}}); slide.addShape(pptx.ShapeType.ellipse,{x:1.25+j*3.2,y:3.05,w:.32,h:.32,fill:{color:accent},line:{color:accent}}); addTextBox(slide,pptx,bullets[j]||'里程碑',1.05+j*3.2,3.55,2.6,.58,{size:12,bold:true,color:'172033'});} }
      else if(mode===4){ slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.05,w:4.65,h:2.85,rectRadius:.08,fill:{color:dark},line:{color:dark}}); addTextBox(slide,pptx,'核心重點',1.2,2.45,3.8,.3,{size:18,bold:true,color:'FFFFFF'}); addTextBox(slide,pptx,bullets[0]||'清晰拆解問題與方案',1.2,3.05,3.7,.75,{size:14,color:'FFFFFF'}); slide.addShape(pptx.ShapeType.roundRect,{x:6.05,y:2.05,w:5.5,h:2.85,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}}); addTextBox(slide,pptx,bullets.slice(1).map(b=>'• '+b).join('\n'),6.45,2.5,4.7,1.65,{size:14,color:'172033'}); }
      else { slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.05,w:10.7,h:2.85,rectRadius:.08,fill:{color:'FFFFFF'},line:{color:'DCE4F2'}}); slide.addShape(pptx.ShapeType.ellipse,{x:1.25,y:2.45,w:1.35,h:1.35,fill:{color:accent,transparency:10},line:{color:accent}}); addTextBox(slide,pptx,'01',1.58,2.86,.7,.28,{size:18,bold:true,color:'FFFFFF'}); addTextBox(slide,pptx,bullets.join('\n'),3.05,2.45,7.6,1.5,{size:14,color:'172033'}); }
      addTextBox(slide,pptx,`${i+1}/${currentOutline.length}`,11.85,6.77,.6,.15,{size:8,color:'667085',align:'right'});
    }
  });
  const fname=(currentTopic||'AI_PPT').replace(/[\\/:*?"<>|\s]+/g,'_').slice(0,36)+'_V10.pptx'; await pptx.writeFile({fileName:fname}); toast('PPTX 已生成並下載');
}

function bind(){
  $('#topicInput').addEventListener('input',()=>{$('#charCount').textContent=$('#topicInput').value.length+' 字';});
  $$('.mode').forEach(btn=>btn.addEventListener('click',()=>{$$('.mode').forEach(b=>b.classList.remove('active')); btn.classList.add('active');}));
  $('#generateBtn').addEventListener('click',()=>{ const topic=$('#topicInput').value.trim(); if(!topic){toast('請先輸入主題或內容','error');return;} currentTopic=topic; currentScene=$('#sceneSelect').value; currentOutline=buildOutline(topic,currentScene,Number($('#pageCount').value||10)); recommendedTemplates=recommendTemplates(currentScene); selectedTemplate=null; renderOutline(); setSection('outlinePanel'); toast('已生成大綱'); });
  $('#editOutlineBtn').addEventListener('click',()=>setSection('createPanel'));
  $('#goTemplateBtn').addEventListener('click',showTemplates);
  $('#backOutlineBtn').addEventListener('click',()=>setSection('outlinePanel'));
  $('#styleFilter').addEventListener('change',renderTemplates);
  $('#templateGrid').addEventListener('click',(e)=>{ const use=e.target.closest('[data-use]'); const prev=e.target.closest('[data-preview]'); if(use) selectTemplate(use.dataset.use,true); if(prev) selectTemplate(prev.dataset.preview,true); });
  $('#changeTemplateBtn').addEventListener('click',showTemplates);
  $('#downloadBtn').addEventListener('click',downloadPptx);
  $('#loginBtn').addEventListener('click',()=>setLogin(!isLoggedIn));
  $('#memberBtn').addEventListener('click',()=>$('#memberModal').classList.remove('hidden'));
  $('#closeModal').addEventListener('click',()=>$('#memberModal').classList.add('hidden'));
  $('#fakePayBtn').addEventListener('click',()=>setMember(true));
  $$('.nav-item').forEach(n=>n.addEventListener('click',()=>{ const t=n.dataset.target; if(t==='templatePanel') return showTemplates(); if(t==='member') return $('#memberModal').classList.remove('hidden'); if(t==='account') return toast(isLoggedIn?'目前為模擬登入狀態':'尚未登入，點右上角可模擬登入'); setSection(t); }));
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
  if(window.PptxGenJS){console.log('PPTX engine loaded');}
}

document.addEventListener('DOMContentLoaded',bind);
