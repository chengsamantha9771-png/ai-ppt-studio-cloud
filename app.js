const $=(s)=>document.querySelector(s);
const $$=(s)=>Array.from(document.querySelectorAll(s));

const INTERNAL_TEMPLATES=[
 {id:'gov-heritage',template_name:'政企白皮书 · 城市治理版',category:'public',coverType:'gov',tags:['政府汇报','公益项目','白皮书'],description:'适合政府、公益、制度化项目，版式有封面大标题、政策卡片、里程碑和 KPI 区。',colors:{bg:'0B1D35',accent:'D6A43A',soft:'F7F1E6',ink:'0B1D35'}},
 {id:'investor-night',template_name:'投资路演 · 黑金资本版',category:'business',coverType:'investor',tags:['融资','商业计划','投资人'],description:'适合融资路演和商业计划，封面是黑金大图、数字看板和投资亮点。',colors:{bg:'050505',accent:'D4AF37',soft:'111827',ink:'FFFFFF'}},
 {id:'medical-lab',template_name:'医疗健康 · 实验室清爽版',category:'medical',coverType:'medical',tags:['医疗','诊所','健康'],description:'适合医疗项目、诊所方案、检测设备，视觉有医疗卡片、数据波形和流程图。',colors:{bg:'0F766E',accent:'38BDF8',soft:'ECFEFF',ink:'073B3A'}},
 {id:'ai-glass',template_name:'AI 科技 · 玻璃拟态版',category:'tech',coverType:'ai',tags:['AI','SaaS','自动化'],description:'适合 AI 工具、自动化平台、SaaS 产品，含网格、节点、模型流程视觉。',colors:{bg:'312E81',accent:'A78BFA',soft:'F5F3FF',ink:'111827'}},
 {id:'edu-card',template_name:'教育课件 · 彩色卡片版',category:'education',coverType:'edu',tags:['课程','教学','培训'],description:'适合课程和培训，视觉是课堂卡片、学习路径和互动模块。',colors:{bg:'FB923C',accent:'FACC15',soft:'FFF7ED',ink:'431407'}},
 {id:'data-command',template_name:'数据报告 · 指挥中心版',category:'data',coverType:'dashboard',tags:['数据','KPI','图表'],description:'适合 KPI、运营报表、业务看板，封面直接呈现仪表盘和趋势图。',colors:{bg:'155E75',accent:'22D3EE',soft:'ECFEFF',ink:'083344'}},
 {id:'brand-pop',template_name:'品牌营销 · 潮流海报版',category:'marketing',coverType:'brand',tags:['营销','品牌','活动'],description:'适合品牌活动、营销策划，视觉强烈，有海报、色块、社媒卡片。',colors:{bg:'BE123C',accent:'FB7185',soft:'FFF1F2',ink:'4C0519'}},
 {id:'office-minimal',template_name:'商务办公 · 极简留白版',category:'business',coverType:'minimal',tags:['商务','汇报','通用'],description:'适合公司内部汇报、客户提案，留白多、层级清楚、适合正式会议。',colors:{bg:'E5E7EB',accent:'2563EB',soft:'F8FAFC',ink:'111827'}},
 {id:'cat-welfare',template_name:'公益生命教育 · 温暖猫咪版',category:'public',coverType:'cat',tags:['公益','生命教育','猫咪'],description:'适合猫咪公益、社区教育、文旅公益，视觉温暖，有猫咪插画感。',colors:{bg:'F97316',accent:'FED7AA',soft:'FFF7ED',ink:'7C2D12'}},
 {id:'luxury-cream',template_name:'高端提案 · 奶油金品牌版',category:'business',coverType:'luxury',tags:['高端','客户方案','提案'],description:'适合高端客户提案、品牌合作、投资人正式沟通。',colors:{bg:'7C2D12',accent:'F5D0A9',soft:'FFFBEB',ink:'3F1D0B'}},
 {id:'product-app',template_name:'产品发布 · App 展示版',category:'product',coverType:'product',tags:['产品','发布','增长'],description:'适合小程序、Web App、PWA 产品发布，视觉有手机框、功能卡和转化漏斗。',colors:{bg:'0F4CBD',accent:'38BDF8',soft:'EFF6FF',ink:'0B1220'}},
 {id:'finance-matrix',template_name:'金融报告 · 蓝灰矩阵版',category:'finance',coverType:'finance',tags:['金融','分析','策略'],description:'适合金融分析、策略汇报、财务模型，视觉稳重、图表感强。',colors:{bg:'1E293B',accent:'94A3B8',soft:'F1F5F9',ink:'0F172A'}},
 {id:'timeline-roadmap',template_name:'项目路线图 · 里程碑版',category:'product',coverType:'roadmap',tags:['路线图','项目','执行'],description:'适合项目计划、实施路径、版本迭代，用时间轴一眼看进度。',colors:{bg:'4338CA',accent:'C4B5FD',soft:'EEF2FF',ink:'111827'}},
 {id:'workshop-grid',template_name:'培训工作坊 · 模块网格版',category:'education',coverType:'workshop',tags:['工作坊','培训','互动'],description:'适合企业内训、学习营、工作坊，模块网格很清楚。',colors:{bg:'0F172A',accent:'2DD4BF',soft:'F0FDFA',ink:'0F172A'}},
 {id:'photo-report',template_name:'形象汇报 · 大图杂志版',category:'business',coverType:'photo',tags:['形象','杂志','汇报'],description:'适合需要高级视觉印象的商业报告，卡片模拟大图杂志风。',colors:{bg:'334155',accent:'F97316',soft:'F8FAFC',ink:'111827'}}
];

const state={outline:[],selectedTemplate:null,isMember:false,lastCoverData:null,lastTemplateFile:null,externalTemplates:INTERNAL_TEMPLATES,templateTab:'external',lastTopic:''};

const sceneTitles={
 public:['项目定位与公共价值','现状痛点与政策背景','目标对象与服务场景','核心方案与流程设计','治理机制与透明度','实施路径与里程碑','资源配置与成本收益','风险控制与可持续运营','KPI 与社会影响','下一步行动'],
 gov:['汇报背景与政策契合','现况问题与治理需要','总体目标与原则','方案架构与工作机制','跨部门协作路径','监管与数据透明','阶段成果与预期效益','资源需求与风险控制','落地时间表','决策事项'],
 biz:['市场机会','用户痛点','产品定位','核心功能与服务流程','商业模式','竞争优势','收入模型','推广策略','里程碑','合作/融资需求'],
 medical:['临床/服务背景','目标人群与需求','核心服务流程','设备与数据管理','质量与风险控制','合规与隐私保护','运营配置','成效指标','成本收益','下一步计划'],
 finance:['宏观背景','市场数据','核心观察','风险因素','策略建议','资产配置','收益假设','情境分析','执行时间表','结论'],
 tech:['问题场景','AI 解决方案','产品能力','技术架构','使用流程','安全与成本','商业化路径','示范案例','迭代规划','下一步'],
 education:['课程目标','学习对象','知识框架','教学流程','互动练习','案例讲解','评估方法','教学资源','课程亮点','课后行动'],
 product:['用户痛点','产品定位','核心卖点','使用场景','功能模块','用户路径','竞争差异','上线计划','推广策略','转化目标']
};

const sceneCopy={
 product:[
  ['一句话定位','把 {theme} 定义成一个从内容输入到模板生成的完整工具，而不是简单排版器。','目标用户不是只想看大纲的人，而是要快速交付可展示 PPT 的人。','这一页要让用户立刻明白：输入内容、选模板、预览、下载是一条闭环。'],
  ['用户痛点','用户最怕三件事：不会写结构、不会排版、找模板浪费时间。','当前流程如果跳到别的网站，会破坏信任感和付费意愿。','痛点页要突出“省时间、少折腾、能交付”。'],
  ['核心功能','系统需要把大纲生成、模板选择、页面预览、会员下载放在同一站内。','模板不是色块，而是不同版式和场景的设计资产。','核心功能页要展示用户从输入到下载的最短路径。'],
  ['模板体系','模板应按场景分类：政企、商业、医疗、教育、数据、营销、产品。','每个模板要有不同封面构图、不同页面节奏和不同信息层级。','这一页说明平台不是几套颜色，而是一套模板引擎。'],
  ['生成逻辑','内容先被拆成标题、结论、证据、动作和结果，再映射到页面组件。','不同场景要使用不同讲法，不能每页重复同一个句式。','生成逻辑页要证明输出是“可汇报结构”，不是文字搬运。'],
  ['预览体验','用户在付款前要能看见页面结构和模板风格，降低不确定感。','预览不需要完全等于最终文件，但要让人相信成品方向。','这一页强调所见即所得和降低试错成本。'],
  ['会员与下载','付费点应该发生在本站：预览免费，下载 PPTX 需要会员。','正式版可接 Stripe、PayPal、支付宝香港或微信支付香港。','下载页要让商业闭环清楚，而不是把钱送到第三方平台。'],
  ['上线计划','第一阶段先跑通静态前端和本地生成 PPTX，便于演示。','第二阶段接真实模型 API 和授权模板库，提升内容质量。','第三阶段加入账户、支付、保存历史和用户上传模板。'],
  ['风险控制','第三方模板不能隐藏来源再转售，除非已经获得再分发授权。','正确路线是自有模板、授权模板、用户自带模板三种来源分清楚。','风险页要证明平台能商业化，同时不踩版权雷。'],
  ['下一步行动','马上把首页、模板库、预览和下载流程稳定下来。','再补真实模板素材、模型 API 和支付系统。','下一步目标是做出可以给客户看的专业 Demo。']
 ],
 public:[
  ['公共价值','把 {theme} 从单点服务升级为长期、可监管、可持续的公共项目。','价值不只在于解决眼前问题，也在于形成示范机制。','这一页要回答：为什么社会、政府或合作方值得支持。'],
  ['现状痛点','目前问题往往分散在资源、管理、认知和执行断点上。','如果没有制度化流程，项目容易变成一次性活动。','痛点页要把零散问题归纳成系统性缺口。'],
  ['服务对象','明确谁会使用、谁会受益、谁负责参与和谁需要监管。','不同对象对应不同服务场景，不能用一套话覆盖所有人。','这一页要把用户、公众、机构和合作方的关系讲清楚。'],
  ['方案设计','方案要同时包含服务流程、空间安排、人员责任和数据记录。','看起来温暖，执行上要有标准，管理上要能复盘。','方案页要让人看到它真的能落地。'],
  ['治理机制','公益项目最重要的是透明、责任和持续运营。','需要明确数据、审批、记录、财务和日常管理规则。','这一页要建立信任感。'],
  ['实施路径','先做试点，再做优化，最后扩大复制，不要一开始铺太大。','每个阶段都要有成果、预算和验收指标。','路径页让决策方看到风险可控。'],
  ['资源配置','资源包括场地、人手、设备、宣传、运营和应急预算。','成本要对应公共收益和长期价值。','这一页要回答钱和资源为什么花得值得。'],
  ['风险控制','提前处理安全、投诉、合规、人员和持续资金问题。','风险不是回避，而是用规则和预案降低。','这一页让项目显得成熟。'],
  ['KPI 与影响','KPI 要包括服务量、满意度、教育触达、透明度和复盘频率。','社会影响需要被看见、被记录、被传播。','这一页把好愿望变成可衡量成果。'],
  ['下一步','明确需要哪些支持、谁来拍板、何时启动第一阶段。','行动清单越具体，项目越容易往前走。','最后一页要促成决定，而不是停留在愿景。']
 ]
};

function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function short(s,n=52){s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s;}
function slug(s){return String(s||'ppt').replace(/[\\/:*?"<>|\s]+/g,'-').slice(0,42)||'ppt';}
function getImportedTemplates(){try{return JSON.parse(localStorage.getItem('realTemplateCloud')||'[]')}catch{return []}}
function setImportedTemplates(arr){localStorage.setItem('realTemplateCloud',JSON.stringify(arr));}
function isRealTemplate(t){return Boolean(t&&t.coverData&&t.templateData&&['pptx','potx'].includes(t.templateExt));}
function splitLongText(t){return String(t||'').split(/\n+|[。！？!?；;]+/).map(s=>s.trim()).filter(Boolean);}
function topicTheme(topic){return short(String(topic||'AI PPT Studio').replace(/\s+/g,' ').trim(),34);}
function inferScene(topic,selected){const t=String(topic).toLowerCase();if(/ppt|模板|小程序|web|app|平台|下载|会员|生成|ai|自动化/.test(t))return 'product';if(/医疗|诊所|检测|健康|临床|设备/.test(t))return 'medical';if(/政府|汇报|政策|监管/.test(t))return 'gov';return selected;}
function uniquePhrases(text){return [...new Set(splitLongText(text).filter(x=>x.length>4))].slice(0,18);}
function coverMarkup(t){return `<div class="tpl-cover art cover-${escapeHtml(t.coverType)}"><div class="cover-brand">AI PPT Studio</div><div class="cover-scene">${escapeHtml(t.tags[0]||t.category)}</div><div class="cover-title">${escapeHtml(t.template_name)}</div><div class="cover-visual"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`;}

function buildOutline(){
 const topic=$('#topicInput').value.trim()||'未命名简报';
 const selected=$('#sceneSelect').value;
 const scene=inferScene(topic,selected);
 const n=Number($('#pageCount').value||10);
 const theme=topicTheme(topic);
 const phrases=uniquePhrases(topic);
 const bank=(sceneCopy[scene]||sceneCopy.public);
 state.lastTopic=theme;
 state.outline=Array.from({length:n},(_,i)=>{
  const source=phrases[i%Math.max(phrases.length,1)]||theme;
  const pack=bank[i%bank.length];
  const title=pack[0];
  return {title,subtitle:pack[1].replace('{theme}',theme),bullets:[pack[2].replace('{source}',source),pack[3].replace('{source}',source),`结合输入重点：「${short(source,36)}」，本页只保留最有说服力的信息。`],speaker:`讲法建议：先讲结论，再用输入内容里的「${short(source,22)}」做例子，最后落到执行。`};
 });
 renderOutline(scene);
 showPanel('outlinePanel');
}
function renderOutline(scene){$('#outlineSummary').innerHTML=`<b>已生成 ${state.outline.length} 页专业结构：</b> 智能识别为「${escapeHtml(scene||'当前')}」场景 · ${state.outline.map(x=>escapeHtml(x.title)).join(' → ')}`;$('#outlineList').innerHTML=state.outline.map((it,i)=>`<article class="outline-item"><div class="page-no">${String(i+1).padStart(2,'0')}</div><h3>${escapeHtml(it.title)}</h3><p class="outline-sub">${escapeHtml(it.subtitle)}</p><ul>${it.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul><p class="speaker-note">${escapeHtml(it.speaker)}</p></article>`).join('');}

function filteredExternalTemplates(){const q=($('#templateSearch')?.value||'').toLowerCase().trim();const cat=$('#categoryFilter')?.value||'all';return state.externalTemplates.filter(t=>{const text=[t.template_name,t.category,t.description,(t.tags||[]).join(' ')].join(' ').toLowerCase();return(cat==='all'||t.category===cat)&&(!q||text.includes(q));});}
function renderExternalTemplates(){const list=filteredExternalTemplates();const grid=$('#externalTemplateGrid');$('#externalTemplateEmpty').classList.toggle('hidden',list.length>0);grid.innerHTML=list.map(t=>`<article class="tpl-card visual-card" data-id="${escapeHtml(t.id)}">${coverMarkup(t)}<div class="tpl-info"><div class="badges"><span class="badge">平台内置</span><span class="badge">${escapeHtml(t.category)}</span>${(t.tags||[]).slice(0,3).map(x=>`<span class="badge">${escapeHtml(x)}</span>`).join('')}</div><h3>${escapeHtml(t.template_name)}</h3><p>${escapeHtml(t.description)}</p><p class="license-note">演示版为平台自有版式引擎；正式版可替换为你的授权真实模板库。</p><div class="card-actions"><button class="preview" data-id="${escapeHtml(t.id)}">预览效果</button><button class="apply" data-id="${escapeHtml(t.id)}">选择模板</button></div></div></article>`).join('');$$('.visual-card,.visual-card button').forEach(el=>el.onclick=(e)=>{const id=e.currentTarget.dataset.id||e.target.dataset.id;selectInternalTemplate(id);});}
function renderMyTemplates(){const list=getImportedTemplates().filter(isRealTemplate),empty=$('#myTemplateEmpty'),grid=$('#myTemplateGrid');empty.classList.toggle('hidden',list.length>0);grid.innerHTML=list.map(t=>`<article class="tpl-card mine" data-id="${escapeHtml(t.id)}"><img class="tpl-cover" src="${t.coverData}" alt="template cover"/><div class="tpl-info"><div class="badges"><span class="badge">我的模板</span><span class="badge">${escapeHtml(t.category||'mine')}</span></div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.credit||'已导入真实模板')}</p><div class="card-actions"><button class="preview mine-preview" data-id="${escapeHtml(t.id)}">预览</button><button class="apply mine-dl" data-id="${escapeHtml(t.id)}">下载 PPTX/POTX</button></div></div></article>`).join('');$$('.mine-preview,.tpl-card.mine').forEach(el=>el.onclick=(e)=>{const id=e.currentTarget.dataset.id||e.target.dataset.id;selectMineTemplate(id);});$$('.mine-dl').forEach(b=>b.onclick=(e)=>{e.stopPropagation();const id=e.target.dataset.id;state.selectedTemplate=list.find(x=>x.id===id);if(state.selectedTemplate)state.selectedTemplate.type='mine';downloadPptx();});}
function renderTemplateTabs(){$$('.tpl-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.templateTab));$('#externalTemplateArea').classList.toggle('hidden',state.templateTab!=='external');$('#myTemplateArea').classList.toggle('hidden',state.templateTab!=='mine');if(state.templateTab==='external')renderExternalTemplates();else renderMyTemplates();}
function ensureOutline(){if(state.outline.length===0)buildOutline();}
function selectInternalTemplate(id){ensureOutline();state.selectedTemplate=state.externalTemplates.find(t=>t.id===id)||state.externalTemplates[0];state.selectedTemplate.type='internal';renderPreview();showPanel('previewPanel');}
function selectMineTemplate(id){ensureOutline();const list=getImportedTemplates().filter(isRealTemplate);state.selectedTemplate=list.find(t=>t.id===id)||list[0];if(state.selectedTemplate)state.selectedTemplate.type='mine';renderPreview();showPanel('previewPanel');}
function renderPreview(){const tpl=state.selectedTemplate||state.externalTemplates[0];if(!tpl){$('#previewStrip').innerHTML='';return;}const isMine=tpl.type==='mine'||tpl.templateData;$('#previewHint').textContent=isMine?'这是你导入的真实模板，可下载原 PPTX/POTX 文件。':'这是平台内置模板效果预览；点击下载会在本平台生成 PPTX，不跳转第三方网站。';$('#deliveryChecklist').innerHTML=`<b>当前选择：</b>${escapeHtml(tpl.template_name||tpl.name)}<br><b>交付逻辑：</b>${isMine?'下载你上传的真实 PPTX/POTX':'在本平台生成一份可打开的 PPTX 演示文件，正式版再替换为授权模板引擎'}`;$('#previewStrip').innerHTML=state.outline.map((it,i)=>`<div class="slide-thumb preview-${escapeHtml(tpl.coverType||tpl.category||'general')}"><div class="slide-top"><span>${String(i+1).padStart(2,'0')}</span><b>${escapeHtml(short(tpl.template_name||tpl.name,26))}</b></div><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.subtitle)}</p><ul>${it.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`).join('');}
function showPanel(id){$$('.panel').forEach(p=>p.classList.add('hidden'));$('#'+id).classList.remove('hidden');$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));if(id==='templatePanel')renderTemplateTabs();if(id==='outlinePanel'&&state.outline.length===0)buildOutline();window.scrollTo({top:0,behavior:'smooth'});}
function dataUrlToBlob(dataUrl){const [meta,data]=String(dataUrl||'').split(',');if(!meta||!data)return null;const mime=((meta.match(/data:(.*?);base64/)||[])[1])||'application/octet-stream';const binary=atob(data);const arr=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)arr[i]=binary.charCodeAt(i);return new Blob([arr],{type:mime});}
function triggerDownload(blob,fileName){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}
async function generateInternalPptx(tpl){if(typeof pptxgen==='undefined')return alert('PPTX 引擎未载入，请刷新新版后重试。');const pptx=new pptxgen();pptx.layout='LAYOUT_WIDE';pptx.author='AI PPT Studio Cloud';const c=tpl.colors||{bg:'071426',accent:'0F4CBD',soft:'F8FAFC',ink:'111827'};const topic=$('#topicInput').value.trim()||'AI PPT Studio';let s=pptx.addSlide();s.background={color:c.bg};s.addText(tpl.template_name,{x:.7,y:1,w:7,h:.4,fontSize:18,bold:true,color:'FFFFFF'});s.addText(topic,{x:.7,y:2,w:10.8,h:1.5,fontSize:36,bold:true,color:'FFFFFF',fit:'shrink'});s.addText('AI PPT Studio Cloud',{x:.7,y:6.65,w:4,h:.2,fontSize:10,color:'E5E7EB'});state.outline.forEach((it,i)=>{const slide=pptx.addSlide();const dark=['investor','gov','ai','finance','dashboard','workshop'].includes(tpl.coverType);slide.background={color:dark?c.bg:'FFFFFF'};slide.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.333,h:.22,fill:{color:c.accent},line:{color:c.accent}});slide.addText(String(i+1).padStart(2,'0'),{x:.65,y:.55,w:.7,h:.28,fontSize:12,bold:true,color:c.accent});slide.addText(it.title,{x:.65,y:.95,w:11.6,h:.55,fontSize:29,bold:true,color:dark?'FFFFFF':c.ink,fit:'shrink'});slide.addText(it.subtitle,{x:.68,y:1.6,w:11.5,h:.32,fontSize:12,color:dark?'CBD5E1':'667085'});it.bullets.forEach((b,idx)=>{slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.35+idx*.85,w:11.5,h:.58,rectRadius:.08,fill:{color:dark?'1F2937':c.soft},line:{color:dark?'334155':'E5E7EB'}});slide.addText(b,{x:1.1,y:2.48+idx*.85,w:10.8,h:.24,fontSize:13.2,bold:idx===0,color:dark?'F8FAFC':'111827',fit:'shrink'});});});await pptx.writeFile({fileName:`${slug(state.lastTopic||topic)}-${slug(tpl.template_name)}.pptx`});}
async function downloadPptx(){if(!state.selectedTemplate)return alert('请先选择模板');const tpl=state.selectedTemplate;if(!state.isMember){$('#memberModal').classList.remove('hidden');return;}if(tpl.type==='mine'||tpl.templateData){const blob=dataUrlToBlob(tpl.templateData);if(!blob)return alert('模板文件损坏，请重新导入。');return triggerDownload(blob,`${slug(tpl.name||'template')}.${tpl.templateExt}`);}return generateInternalPptx(tpl);}
function saveImported(){const name=$('#tplName').value.trim(),credit=$('#tplCredit').value.trim();if(!name)return alert('请先填模板名称');if(!state.lastTemplateFile)return alert('请先上传 PPTX/POTX');if(!state.lastCoverData)return alert('请先上传封面图');const arr=getImportedTemplates();arr.unshift({id:'imp-'+Date.now(),name,category:$('#tplCategory').value,source:$('#tplSource').value,credit,coverData:state.lastCoverData,templateData:state.lastTemplateFile.data,templateExt:state.lastTemplateFile.ext,templateMime:state.lastTemplateFile.mime});setImportedTemplates(arr);state.lastTemplateFile=null;state.lastCoverData=null;$('#templateFile').value='';$('#coverFile').value='';$('#tplName').value='';$('#tplCredit').value='';$('#importPreview').innerHTML='';alert('已成功导入到“我的真模板库”。');$('#adminModal').classList.add('hidden');state.templateTab='mine';showPanel('templatePanel');}
async function hardRefreshApp(){try{if('serviceWorker' in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));}if(window.caches){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}}catch(e){}location.href=location.pathname+`?v=${Date.now()}`;}
$('#topicInput').addEventListener('input',e=>$('#charCount').textContent=e.target.value.length+' 字');$('#generateBtn').onclick=buildOutline;$('#editOutlineBtn').onclick=()=>showPanel('createPanel');$('#goTemplateBtn').onclick=()=>{state.templateTab='external';showPanel('templatePanel');};$('#backOutlineBtn').onclick=()=>showPanel('outlinePanel');$('#changeTemplateBtn').onclick=()=>showPanel('templatePanel');$('#downloadBtn').onclick=downloadPptx;$('#templateSearch').addEventListener('input',renderExternalTemplates);$('#categoryFilter').addEventListener('change',renderExternalTemplates);$('#refreshAppBtn').onclick=hardRefreshApp;$('#adminBtn').onclick=()=>$('#adminModal').classList.remove('hidden');$('#openImporterBtn').onclick=()=>$('#adminModal').classList.remove('hidden');$('#closeAdmin').onclick=()=>$('#adminModal').classList.add('hidden');$('#saveTemplateBtn').onclick=saveImported;$('#clearTemplatesBtn').onclick=()=>{if(confirm('确定清空本地导入模板？')){localStorage.removeItem('realTemplateCloud');renderMyTemplates();}};$('#coverFile').onchange=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.lastCoverData=r.result;$('#importPreview').innerHTML=`<img src="${r.result}" alt="cover preview"/>`;};r.readAsDataURL(f);};$('#templateFile').onchange=(e)=>{const f=e.target.files[0];if(!f)return;const ext=((f.name||'').split('.').pop()||'').toLowerCase();if(!['pptx','potx'].includes(ext)){e.target.value='';state.lastTemplateFile=null;return alert('只支持上传 PPTX/POTX');}const r=new FileReader();r.onload=()=>{state.lastTemplateFile={data:r.result,ext,mime:f.type||''};};r.readAsDataURL(f);};$('#loginBtn').onclick=()=>alert('已模拟登入。正式版后续接 Supabase / Firebase / 自建后台。');$('#memberBtn').onclick=()=>$('#memberModal').classList.remove('hidden');$('#closeMember').onclick=()=>$('#memberModal').classList.add('hidden');$('#fakePayBtn').onclick=()=>{state.isMember=true;$('#memberModal').classList.add('hidden');alert('已模拟开通会员，现在可以在本平台下载生成 PPTX。');};$$('.mode').forEach(b=>b.onclick=()=>{$$('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');});$$('.tpl-tab').forEach(b=>b.onclick=()=>{state.templateTab=b.dataset.tab;renderTemplateTabs();});$$('.nav-item').forEach(b=>b.onclick=()=>{const p=b.dataset.panel;if(p==='member')return $('#memberModal').classList.remove('hidden');if(p==='admin')return $('#adminModal').classList.remove('hidden');if(p==='outlinePanel')return showPanel('outlinePanel');showPanel(p);});
renderTemplateTabs();if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js?v=16.0.0').catch(()=>{});}
