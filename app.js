const $=(s)=>document.querySelector(s);
const $$=(s)=>Array.from(document.querySelectorAll(s));

const INTERNAL_TEMPLATES=[
 {id:'pro-gov-blue',template_name:'政企汇报 · 深蓝专业版',category:'public',style:'policy',tags:['政府汇报','公益项目','白皮书'],description:'适合政府、公益、制度化项目，强调可信、稳重、可执行。',colors:{bg:'071426',accent:'D6A43A',soft:'F7F1E6',ink:'071426'}},
 {id:'investor-black-gold',template_name:'投资路演 · 黑金高端版',category:'business',style:'dark',tags:['融资','商业计划','投资人'],description:'适合融资路演、商业模式、增长计划，视觉更像投资人简报。',colors:{bg:'050505',accent:'D4AF37',soft:'111827',ink:'FFFFFF'}},
 {id:'medical-clean',template_name:'医疗健康 · 蓝绿专业版',category:'medical',style:'medical',tags:['医疗','诊所','健康'],description:'适合诊所、设备、医学项目和专业培训，清爽可信。',colors:{bg:'0F766E',accent:'38BDF8',soft:'ECFEFF',ink:'073B3A'}},
 {id:'ai-gradient',template_name:'AI 科技 · 紫蓝渐变版',category:'tech',style:'creative',tags:['AI','SaaS','自动化'],description:'适合 AI 产品、自动化工具、科技平台发布。',colors:{bg:'312E81',accent:'A78BFA',soft:'F5F3FF',ink:'111827'}},
 {id:'edu-warm',template_name:'教育课件 · 暖色互动版',category:'education',style:'warm',tags:['课程','教学','培训'],description:'适合课程、教学、培训、学习报告，更亲和。',colors:{bg:'FB923C',accent:'FACC15',soft:'FFF7ED',ink:'431407'}},
 {id:'data-dashboard',template_name:'数据报告 · 仪表盘版',category:'data',style:'data',tags:['数据','KPI','图表'],description:'适合运营数据、KPI、业务看板和分析报告。',colors:{bg:'155E75',accent:'22D3EE',soft:'ECFEFF',ink:'083344'}},
 {id:'brand-campaign',template_name:'品牌营销 · 活力版',category:'marketing',style:'brand',tags:['营销','品牌','活动'],description:'适合营销策划、品牌发布、活动方案。',colors:{bg:'BE123C',accent:'FB7185',soft:'FFF1F2',ink:'4C0519'}},
 {id:'minimal-office',template_name:'商务办公 · 极简白版',category:'business',style:'clean',tags:['商务','汇报','通用'],description:'适合公司内部汇报、客户提案，干净耐看。',colors:{bg:'E5E7EB',accent:'2563EB',soft:'F8FAFC',ink:'111827'}},
 {id:'cat-welfare',template_name:'公益生命教育 · 温暖版',category:'public',style:'warmcat',tags:['公益','生命教育','猫咪'],description:'适合猫咪公益、生命教育、社区项目，专业但有温度。',colors:{bg:'F97316',accent:'FED7AA',soft:'FFF7ED',ink:'7C2D12'}},
 {id:'luxury-proposal',template_name:'高端提案 · 奶油金版',category:'business',style:'luxury',tags:['高端','客户方案','提案'],description:'适合客户方案、品牌合作、商务展示，视觉更高级。',colors:{bg:'7C2D12',accent:'F5D0A9',soft:'FFFBEB',ink:'3F1D0B'}},
 {id:'product-launch',template_name:'产品发布 · 现代亮色版',category:'product',style:'product',tags:['产品','发布','增长'],description:'适合小程序、Web App、产品路线图、功能发布。',colors:{bg:'0F4CBD',accent:'38BDF8',soft:'EFF6FF',ink:'0B1220'}},
 {id:'finance-report',template_name:'金融报告 · 冷静蓝灰版',category:'finance',style:'finance',tags:['金融','分析','策略'],description:'适合市场分析、财务汇报、策略建议。',colors:{bg:'1E293B',accent:'94A3B8',soft:'F1F5F9',ink:'0F172A'}}
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

const slideLogic={
 public:['定义项目为什么值得被支持','说明目前问题不是单点问题，而是系统性缺口','把服务对象、使用场景和社会价值说清楚','给出可落地的流程、空间或产品方案','说明谁负责、如何监管、如何透明','拆出阶段目标，避免方案停留在概念','讲清资源投入、成本结构与收益来源','提前回答安全、合规、运营和持续性风险','把社会影响变成可衡量指标','明确需要什么决策、资源或下一步行动'],
 gov:['对齐政策方向，降低理解成本','用现况证明治理必要性','把目标、原则和边界说清楚','说明工作机制如何运转','讲清跨部门协作和责任分工','说明数据、监管和透明度安排','展示阶段成果和公共效益','列出资源需求和风险控制','给出时间表与验收节点','提出需要审批或支持的事项'],
 biz:['说明市场为什么现在值得做','把用户痛点讲成刚性需求','用一句话定义产品与目标客户','拆解功能和服务流程','说明如何赚钱和如何交付','证明为什么不是别人轻易复制','给出收入来源和定价逻辑','讲获客渠道和转化路径','明确 30/90/180 天里程碑','提出合作、资源或融资诉求'],
 medical:['说明临床或服务背景','界定目标人群和真实需求','把检测、服务或跟进流程讲清楚','说明设备、数据和记录怎样管理','控制误差、安全与质量风险','处理隐私、合规与责任边界','配置人员、场地与运营流程','用指标证明效果','比较成本投入和服务价值','给出试点与推广计划'],
 finance:['先交代宏观与行业背景','展示关键数据和变化趋势','提炼核心观察和判断','列出风险因素和不确定性','提出策略建议和优先级','说明资产或资源配置逻辑','给出收益假设和敏感点','做乐观、中性、保守情景','安排执行节奏和复盘机制','收束为决策建议'],
 tech:['定义用户问题和技术切入点','说明 AI 或系统如何解决问题','展示核心能力与产品模块','解释前后端、数据和模型架构','让用户看到完整使用流程','说明安全、成本和稳定性','设计商业化路径','给出演示案例和应用场景','安排版本迭代路线','明确下一步开发和上线动作'],
 education:['明确课程要解决的学习目标','说明学习对象和起点差异','搭建知识框架','安排教学流程和节奏','设计互动和练习','用案例降低理解难度','说明评估与反馈方法','准备资料、工具和作业','突出课程特色和价值','安排课后行动和延伸学习'],
 product:['说明用户痛点和使用动机','定义产品位置和核心价值','提炼 3 个最强卖点','展示典型使用场景','拆解功能模块','说明用户路径和关键转化点','比较竞品差异','安排上线和迭代计划','规划推广策略','定义转化目标和数据追踪']
};

function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function short(s,n=48){s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s;}
function slug(s){return String(s||'ppt').replace(/[\\/:*?"<>|\s]+/g,'-').slice(0,42)||'ppt';}
function getImportedTemplates(){try{return JSON.parse(localStorage.getItem('realTemplateCloud')||'[]')}catch{return []}}
function setImportedTemplates(arr){localStorage.setItem('realTemplateCloud',JSON.stringify(arr));}
function isRealTemplate(t){return Boolean(t&&t.coverData&&t.templateData&&['pptx','potx'].includes(t.templateExt));}
function splitLongText(t){return String(t||'').split(/\n+|[。！？!?；;，,：:]+/).map(s=>s.trim()).filter(Boolean);}
function topicTheme(topic){return short(String(topic||'AI PPT Studio').replace(/\s+/g,' ').trim(),34);}
function getKeywords(text){
 const stop='这个 那个 一个 一些 以及 然后 就是 可以 需要 通过 进行 提供 使用 用户 平台 系统 项目 方案 内容 模板 大纲 自动 生成'.split(' ');
 const words=String(text).replace(/[，。！？；：、,.!?;:()（）\n]/g,' ').split(/\s+/).map(x=>x.trim()).filter(x=>x.length>=2&&!stop.includes(x));
 const chunks=splitLongText(text).flatMap(x=>x.length>12?[x.slice(0,18),x.slice(18,36)].filter(Boolean):[x]);
 return [...new Set([...words,...chunks])].slice(0,24);
}
function pick(arr,i,fallback){return arr.length?arr[i%arr.length]:fallback;}

function buildOutline(){
 const topic=$('#topicInput').value.trim()||'未命名简报';
 const scene=$('#sceneSelect').value;
 const n=Number($('#pageCount').value||10);
 const lang=$('#languageSelect').value;
 const base=(sceneTitles[scene]||sceneTitles.public).slice(0,n);
 const chunks=splitLongText(topic);
 const keys=getKeywords(topic);
 const logic=slideLogic[scene]||slideLogic.public;
 const theme=topicTheme(topic);
 state.lastTopic=theme;
 state.outline=base.map((title,i)=>{
   const k1=pick(keys,i,theme);
   const k2=pick(keys,i+3,'执行路径');
   const k3=pick(keys,i+6,'可衡量结果');
   const source=pick(chunks,i,theme);
   const why=pick(logic,i,'把概念转成可执行安排');
   return {
    title,
    subtitle:`本页重点：${why}`,
    bullets:[
      `判断：围绕「${short(k1,18)}」，先给出清晰结论，而不是堆文字。`,
      `证据：结合「${short(source,28)}」说明现况、需求或机会。`,
      `动作：把「${short(k2,18)}」落实为责任、流程、时间或指标。`,
      `结果：最终要形成「${short(k3,18)}」这种可检查的交付物。`
    ],
    speaker:`讲这一页时，先用一句话说明结论，再解释为什么现在要做，最后落到下一步行动。`,
    lang
   };
 });
 renderOutline();
 showPanel('outlinePanel');
}

function renderOutline(){
 $('#outlineSummary').innerHTML=`<b>已生成 ${state.outline.length} 页专业结构：</b> ${state.outline.map(x=>escapeHtml(x.title)).join(' → ')}`;
 $('#outlineList').innerHTML=state.outline.map((it,i)=>`<article class="outline-item"><div class="page-no">${String(i+1).padStart(2,'0')}</div><h3>${escapeHtml(it.title)}</h3><p class="outline-sub">${escapeHtml(it.subtitle)}</p><ul>${it.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul><p class="speaker-note">${escapeHtml(it.speaker)}</p></article>`).join('');
}

function filteredExternalTemplates(){
 const q=($('#templateSearch')?.value||'').toLowerCase().trim();
 const cat=$('#categoryFilter')?.value||'all';
 return state.externalTemplates.filter(t=>{
  const text=[t.template_name,t.category,t.description,(t.tags||[]).join(' ')].join(' ').toLowerCase();
  return (cat==='all'||t.category===cat)&&(!q||text.includes(q));
 });
}

function renderExternalTemplates(){
 const list=filteredExternalTemplates();
 const grid=$('#externalTemplateGrid');
 $('#externalTemplateEmpty').classList.toggle('hidden',list.length>0);
 grid.innerHTML=list.map(t=>`<article class="tpl-card text-only" data-id="${escapeHtml(t.id)}">
   <div class="tpl-cover gradient ${escapeHtml(t.style)}"><span>AI PPT Studio Cloud</span><b>${escapeHtml(short(t.template_name,34))}</b><em>${escapeHtml(t.tags.slice(0,2).join(' · '))}</em></div>
   <div class="tpl-info">
    <div class="badges"><span class="badge">平台内置</span><span class="badge">${escapeHtml(t.category)}</span>${(t.tags||[]).slice(0,3).map(x=>`<span class="badge">${escapeHtml(x)}</span>`).join('')}</div>
    <h3>${escapeHtml(t.template_name)}</h3>
    <p>${escapeHtml(t.description)}</p>
    <p class="license-note">演示版为平台自有内置设计风格；正式商业版可替换为已授权 PPTX 模板库。</p>
    <div class="card-actions"><button class="preview ext-preview" data-id="${escapeHtml(t.id)}">预览效果</button><button class="apply ext-go" data-id="${escapeHtml(t.id)}">选择模板</button></div>
   </div>
  </article>`).join('');
 $$('.ext-go,.ext-preview,.tpl-card.text-only').forEach(el=>el.onclick=(e)=>{const id=e.currentTarget.dataset.id||e.target.dataset.id;selectInternalTemplate(id);});
}

function renderMyTemplates(){
 const list=getImportedTemplates().filter(isRealTemplate);
 const empty=$('#myTemplateEmpty');
 const grid=$('#myTemplateGrid');
 empty.classList.toggle('hidden',list.length>0);
 grid.innerHTML=list.map(t=>`<article class="tpl-card mine" data-id="${escapeHtml(t.id)}"><img class="tpl-cover" src="${t.coverData}" alt="template cover"/><div class="tpl-info"><div class="badges"><span class="badge">我的模板</span><span class="badge">${escapeHtml(t.category||'mine')}</span></div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.credit||'已导入真实模板')}</p><div class="card-actions"><button class="preview mine-preview" data-id="${escapeHtml(t.id)}">预览</button><button class="apply mine-dl" data-id="${escapeHtml(t.id)}">下载 PPTX/POTX</button></div></div></article>`).join('');
 $$('.mine-preview,.tpl-card.mine').forEach(el=>el.onclick=(e)=>{const id=e.currentTarget.dataset.id||e.target.dataset.id;selectMineTemplate(id);});
 $$('.mine-dl').forEach(b=>b.onclick=(e)=>{e.stopPropagation();const id=e.target.dataset.id;state.selectedTemplate=list.find(x=>x.id===id);if(state.selectedTemplate)state.selectedTemplate.type='mine';downloadPptx();});
}

function renderTemplateTabs(){
 $$('.tpl-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.templateTab));
 $('#externalTemplateArea').classList.toggle('hidden',state.templateTab!=='external');
 $('#myTemplateArea').classList.toggle('hidden',state.templateTab!=='mine');
 if(state.templateTab==='external')renderExternalTemplates();else renderMyTemplates();
}
function ensureOutline(){if(state.outline.length===0)buildOutline();}
function selectInternalTemplate(id){ensureOutline();state.selectedTemplate=state.externalTemplates.find(t=>t.id===id)||state.externalTemplates[0];state.selectedTemplate.type='internal';renderPreview();showPanel('previewPanel');}
function selectMineTemplate(id){ensureOutline();const list=getImportedTemplates().filter(isRealTemplate);state.selectedTemplate=list.find(t=>t.id===id)||list[0];if(state.selectedTemplate)state.selectedTemplate.type='mine';renderPreview();showPanel('previewPanel');}

function renderPreview(){
 const tpl=state.selectedTemplate||state.externalTemplates[0];
 if(!tpl){$('#previewStrip').innerHTML='';return;}
 const isMine=tpl.type==='mine'||tpl.templateData;
 $('#previewHint').textContent=isMine?'这是你导入的真实模板，可下载原 PPTX/POTX 文件。':'这是平台内置模板效果预览；点击下载会在本平台生成 PPTX，不跳转第三方网站。';
 $('#deliveryChecklist').innerHTML=`<b>当前选择：</b>${escapeHtml(tpl.template_name||tpl.name)}<br><b>交付逻辑：</b>${isMine?'下载你上传的真实 PPTX/POTX':'在本平台生成一份可打开的 PPTX 演示文件，正式版再替换为授权模板引擎'}`;
 $('#previewStrip').innerHTML=state.outline.map((it,i)=>`<div class="slide-thumb ${escapeHtml(tpl.style||tpl.category||'general')}"><div class="slide-top"><span>${String(i+1).padStart(2,'0')}</span><b>${escapeHtml(short(tpl.template_name||tpl.name,26))}</b></div><h3>${escapeHtml(it.title)}</h3><p>${escapeHtml(it.subtitle)}</p><ul>${it.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`).join('');
}

function showPanel(id){
 $$('.panel').forEach(p=>p.classList.add('hidden'));
 $('#'+id).classList.remove('hidden');
 $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.panel===id));
 if(id==='templatePanel')renderTemplateTabs();
 if(id==='outlinePanel'&&state.outline.length===0)buildOutline();
 window.scrollTo({top:0,behavior:'smooth'});
}

function dataUrlToBlob(dataUrl){const [meta,data]=String(dataUrl||'').split(',');if(!meta||!data)return null;const mime=((meta.match(/data:(.*?);base64/)||[])[1])||'application/octet-stream';const binary=atob(data);const arr=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)arr[i]=binary.charCodeAt(i);return new Blob([arr],{type:mime});}
function triggerDownload(blob,fileName){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}

async function generateInternalPptx(tpl){
 if(typeof pptxgen==='undefined')return alert('PPTX 引擎未载入，请刷新新版后重试。');
 const pptx=new pptxgen();
 pptx.layout='LAYOUT_WIDE';
 pptx.author='AI PPT Studio Cloud';
 pptx.subject=state.lastTopic||'AI PPT';
 const c=tpl.colors||{bg:'071426',accent:'0F4CBD',soft:'F8FAFC',ink:'111827'};
 const topic=$('#topicInput').value.trim()||'AI PPT Studio';
 const titleColor=(c.ink||'111827').replace('#','');
 const accent=(c.accent||'0F4CBD').replace('#','');
 const bg=(c.bg||'071426').replace('#','');
 const soft=(c.soft||'F8FAFC').replace('#','');
 let s=pptx.addSlide();
 s.background={color:bg};
 s.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.333,h:7.5,fill:{color:bg},line:{color:bg}});
 s.addShape(pptx.ShapeType.rect,{x:.7,y:.7,w:1.25,h:.14,fill:{color:accent},line:{color:accent}});
 s.addText(tpl.template_name,{x:.7,y:1.05,w:8.8,h:.45,fontSize:18,bold:true,color:'FFFFFF',margin:0});
 s.addText(topic,{x:.7,y:2.0,w:10.8,h:1.45,fontSize:36,bold:true,color:'FFFFFF',fit:'shrink',margin:0});
 s.addText('Generated by AI PPT Studio Cloud',{x:.75,y:6.55,w:5,h:.25,fontSize:11,color:'E5E7EB',margin:0});
 state.outline.forEach((it,i)=>{
  const slide=pptx.addSlide();
  const isDark=['dark','policy'].includes(tpl.style);
  slide.background={color:isDark?bg:'FFFFFF'};
  slide.addShape(pptx.ShapeType.rect,{x:0,y:0,w:13.333,h:.18,fill:{color:accent},line:{color:accent}});
  slide.addText(String(i+1).padStart(2,'0'),{x:.65,y:.55,w:.7,h:.28,fontSize:12,bold:true,color:accent,margin:0});
  slide.addText(it.title,{x:.65,y:.95,w:11.6,h:.55,fontSize:29,bold:true,color:isDark?'FFFFFF':titleColor,fit:'shrink',margin:0});
  slide.addText(it.subtitle,{x:.68,y:1.6,w:11.5,h:.3,fontSize:12,color:isDark?'CBD5E1':'667085',margin:0});
  it.bullets.forEach((b,idx)=>{
   slide.addShape(pptx.ShapeType.roundRect,{x:.85,y:2.35+idx*.82,w:11.5,h:.56,rectRadius:.08,fill:{color:isDark?'1F2937':soft},line:{color:isDark?'334155':'E5E7EB'}});
   slide.addText(b,{x:1.1,y:2.49+idx*.82,w:10.8,h:.2,fontSize:13.5,bold:idx===0,color:isDark?'F8FAFC':'111827',fit:'shrink',margin:0});
  });
  slide.addText('AI PPT Studio Cloud',{x:10.2,y:6.95,w:2.3,h:.18,fontSize:8,color:isDark?'94A3B8':'94A3B8',margin:0});
 });
 await pptx.writeFile({fileName:`${slug(state.lastTopic||topic)}-${slug(tpl.template_name)}.pptx`});
}

async function downloadPptx(){
 if(!state.selectedTemplate)return alert('请先选择模板');
 const tpl=state.selectedTemplate;
 if(!state.isMember){$('#memberModal').classList.remove('hidden');return;}
 if(tpl.type==='mine'||tpl.templateData){const blob=dataUrlToBlob(tpl.templateData);if(!blob)return alert('模板文件损坏，请重新导入。');return triggerDownload(blob,`${slug(tpl.name||'template')}.${tpl.templateExt}`);}
 return generateInternalPptx(tpl);
}

function saveImported(){
 const name=$('#tplName').value.trim();
 const credit=$('#tplCredit').value.trim();
 if(!name)return alert('请先填模板名称');
 if(!state.lastTemplateFile)return alert('请先上传 PPTX/POTX');
 if(!state.lastCoverData)return alert('请先上传封面图');
 const arr=getImportedTemplates();
 arr.unshift({id:'imp-'+Date.now(),name,category:$('#tplCategory').value,source:$('#tplSource').value,credit,coverData:state.lastCoverData,templateData:state.lastTemplateFile.data,templateExt:state.lastTemplateFile.ext,templateMime:state.lastTemplateFile.mime});
 setImportedTemplates(arr);state.lastTemplateFile=null;state.lastCoverData=null;
 $('#templateFile').value='';$('#coverFile').value='';$('#tplName').value='';$('#tplCredit').value='';$('#importPreview').innerHTML='';
 alert('已成功导入到“我的真模板库”。');$('#adminModal').classList.add('hidden');state.templateTab='mine';showPanel('templatePanel');
}
async function hardRefreshApp(){try{if('serviceWorker' in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));}if(window.caches){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}}catch(e){}location.href=location.pathname+`?v=${Date.now()}`;}

$('#topicInput').addEventListener('input',e=>$('#charCount').textContent=e.target.value.length+' 字');
$('#generateBtn').onclick=buildOutline;$('#editOutlineBtn').onclick=()=>showPanel('createPanel');$('#goTemplateBtn').onclick=()=>{state.templateTab='external';showPanel('templatePanel');};$('#backOutlineBtn').onclick=()=>showPanel('outlinePanel');$('#changeTemplateBtn').onclick=()=>showPanel('templatePanel');$('#downloadBtn').onclick=downloadPptx;
$('#templateSearch').addEventListener('input',renderExternalTemplates);$('#categoryFilter').addEventListener('change',renderExternalTemplates);$('#refreshAppBtn').onclick=hardRefreshApp;
$('#adminBtn').onclick=()=>$('#adminModal').classList.remove('hidden');$('#openImporterBtn').onclick=()=>$('#adminModal').classList.remove('hidden');$('#closeAdmin').onclick=()=>$('#adminModal').classList.add('hidden');$('#saveTemplateBtn').onclick=saveImported;
$('#clearTemplatesBtn').onclick=()=>{if(confirm('确定清空本地导入模板？')){localStorage.removeItem('realTemplateCloud');renderMyTemplates();}};
$('#coverFile').onchange=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.lastCoverData=r.result;$('#importPreview').innerHTML=`<img src="${r.result}" alt="cover preview"/>`;};r.readAsDataURL(f);};
$('#templateFile').onchange=(e)=>{const f=e.target.files[0];if(!f)return;const ext=((f.name||'').split('.').pop()||'').toLowerCase();if(!['pptx','potx'].includes(ext)){e.target.value='';state.lastTemplateFile=null;return alert('只支持上传 PPTX/POTX');}const r=new FileReader();r.onload=()=>{state.lastTemplateFile={data:r.result,ext,mime:f.type||''};};r.readAsDataURL(f);};
$('#loginBtn').onclick=()=>alert('已模拟登入。正式版后续接 Supabase / Firebase / 自建后台。');$('#memberBtn').onclick=()=>$('#memberModal').classList.remove('hidden');$('#closeMember').onclick=()=>$('#memberModal').classList.add('hidden');$('#fakePayBtn').onclick=()=>{state.isMember=true;$('#memberModal').classList.add('hidden');alert('已模拟开通会员，现在可以在本平台下载生成 PPTX。');};
$$('.mode').forEach(b=>b.onclick=()=>{$$('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');});$$('.tpl-tab').forEach(b=>b.onclick=()=>{state.templateTab=b.dataset.tab;renderTemplateTabs();});
$$('.nav-item').forEach(b=>b.onclick=()=>{const p=b.dataset.panel;if(p==='member')return $('#memberModal').classList.remove('hidden');if(p==='admin')return $('#adminModal').classList.remove('hidden');if(p==='outlinePanel')return showPanel('outlinePanel');showPanel(p);});

renderTemplateTabs();
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js?v=15.0.0').catch(()=>{});}
