const $=(s)=>document.querySelector(s);
const $$=(s)=>Array.from(document.querySelectorAll(s));

const FALLBACK_EXTERNAL_TEMPLATES=[
 {id:'ext-001',template_name:'Business Pitch Templates',category:'business',provider:'SlidesCarnival',source_url:'https://www.slidescarnival.com/category/free-templates/business',access_type:'free',button_text:'打开官网',tags:['pitch','corporate','free'],description:'商务汇报、创业路演、企业方案常用入口。',style:'corporate'},
 {id:'ext-002',template_name:'Startup Pitch Deck',category:'business',provider:'SlidesCarnival',source_url:'https://www.slidescarnival.com/category/free-templates/startup',access_type:'free',button_text:'打开官网',tags:['startup','investor','pitch'],description:'适合融资、商业计划、投资人演示。',style:'dark'},
 {id:'ext-003',template_name:'Canva Pitch Deck Templates',category:'business',provider:'Canva',source_url:'https://www.canva.com/templates/search/pitch-deck/',access_type:'login_required',button_text:'打开官网',tags:['canva','startup','editable'],description:'在线编辑风格丰富，适合快速做视觉稿。',style:'creative'},
 {id:'ext-004',template_name:'Microsoft Business Presentation',category:'business',provider:'Microsoft Create',source_url:'https://create.microsoft.com/en-us/search?query=business%20presentation',access_type:'login_required',button_text:'打开官网',tags:['office','powerpoint','business'],description:'微软官方模板入口，适合 Office 工作流。',style:'clean'},
 {id:'ext-005',template_name:'Medical Presentation Templates',category:'medical',provider:'Slidesgo',source_url:'https://slidesgo.com/medical',access_type:'mixed',button_text:'打开官网',tags:['medical','clinic','health'],description:'医疗健康、诊所、科普、培训演示模板。',style:'medical'},
 {id:'ext-006',template_name:'PresentationGO Medical',category:'medical',provider:'PresentationGO',source_url:'https://www.presentationgo.com/presentation/category/by-topics/medical/',access_type:'free',button_text:'打开官网',tags:['medical','diagram','powerpoint'],description:'偏图表、结构页，适合医疗项目汇报。',style:'medical'},
 {id:'ext-007',template_name:'Education Templates',category:'education',provider:'SlidesCarnival',source_url:'https://www.slidescarnival.com/category/free-templates/education',access_type:'free',button_text:'打开官网',tags:['education','training','lesson'],description:'教育培训、课程、学习报告常用模板。',style:'warm'},
 {id:'ext-008',template_name:'Slidesgo Education',category:'education',provider:'Slidesgo',source_url:'https://slidesgo.com/education',access_type:'mixed',button_text:'打开官网',tags:['school','lesson','creative'],description:'教育课件、活动教学、儿童主题模板较多。',style:'creative'},
 {id:'ext-009',template_name:'Public Policy White Paper Style',category:'public',provider:'SlidesCarnival',source_url:'https://www.slidescarnival.com/category/free-templates/formal',access_type:'free',button_text:'打开官网',tags:['policy','formal','public'],description:'政府汇报、公益项目、白皮书风格可参考。',style:'public'},
 {id:'ext-010',template_name:'Charts & Diagrams',category:'data',provider:'PresentationGO',source_url:'https://www.presentationgo.com/presentation/category/charts-diagrams/',access_type:'free',button_text:'打开官网',tags:['charts','data','diagram'],description:'图表、流程、架构、数据页素材入口。',style:'data'},
 {id:'ext-011',template_name:'Marketing Presentation',category:'marketing',provider:'Slidesgo',source_url:'https://slidesgo.com/marketing',access_type:'mixed',button_text:'打开官网',tags:['marketing','brand','campaign'],description:'营销、品牌、活动方案模板入口。',style:'creative'},
 {id:'ext-012',template_name:'WPS PPT Templates',category:'general',provider:'WPS Template',source_url:'https://template.wps.com/ppt/',access_type:'mixed',button_text:'打开官网',tags:['wps','ppt','templates'],description:'WPS 模板中心，适合中文环境找模板。',style:'general'},
 {id:'ext-013',template_name:'SlidesMania Templates',category:'general',provider:'SlidesMania',source_url:'https://slidesmania.com/',access_type:'mixed',button_text:'打开官网',tags:['google slides','free','creative'],description:'模板总入口，风格轻松，适合教育和创意演示。',style:'warm'},
 {id:'ext-014',template_name:'Microsoft Presentation Templates',category:'general',provider:'Microsoft Create',source_url:'https://create.microsoft.com/en-us/templates/presentations',access_type:'login_required',button_text:'打开官网',tags:['microsoft','official','powerpoint'],description:'微软官方演示模板总入口。',style:'clean'}
];

const state={outline:[],selectedTemplate:null,isMember:false,lastCoverData:null,lastTemplateFile:null,externalTemplates:[],templateTab:'external',lastTopic:''};

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

function escapeHtml(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function short(s,n=48){s=String(s||'');return s.length>n?s.slice(0,n-1)+'…':s;}
function slug(s){return String(s||'ppt').replace(/[\\/:*?"<>|\s]+/g,'-').slice(0,42)||'ppt';}
function getImportedTemplates(){try{return JSON.parse(localStorage.getItem('realTemplateCloud')||'[]')}catch{return []}}
function setImportedTemplates(arr){localStorage.setItem('realTemplateCloud',JSON.stringify(arr));}
function isRealTemplate(t){return Boolean(t&&t.coverData&&t.templateData&&['pptx','potx'].includes(t.templateExt));}
function splitLongText(t){return String(t||'').split(/\n+|[。！？!?；;]+/).map(s=>s.trim()).filter(Boolean);}
function topicTheme(topic){return short(String(topic||'AI PPT Studio').replace(/\s+/g,' ').trim(),34);}

function buildOutline(){
 const topic=$('#topicInput').value.trim()||'未命名简报';
 const scene=$('#sceneSelect').value;
 const n=Number($('#pageCount').value||10);
 const lang=$('#languageSelect').value;
 const base=(sceneTitles[scene]||sceneTitles.public).slice(0,n);
 const segments=splitLongText(topic);
 const theme=topicTheme(topic);
 state.lastTopic=theme;
 state.outline=base.map((title,i)=>{
   const seed=segments[i%Math.max(segments.length,1)]||theme;
   const evidence=segments[(i+1)%Math.max(segments.length,1)]||`${title}的事实、数据或案例说明`;
   const action=segments[(i+2)%Math.max(segments.length,1)]||`${title}对应的执行动作与责任分工`;
   return {
    title,
    subtitle:`围绕「${theme}」的第 ${i+1} 个汇报重点`,
    bullets:[
      `核心结论：${short(seed,42)}`,
      `支撑说明：${short(evidence,42)}`,
      `落地动作：${short(action,42)}`
    ],
    speaker:`这一页用于说明 ${title}，让听众先理解为什么重要，再看到如何执行。`,
    lang
   };
 });
 renderOutline();
 showPanel('outlinePanel');
}

function renderOutline(){
 $('#outlineSummary').innerHTML=`<b>已生成 ${state.outline.length} 页结构：</b> ${state.outline.map(x=>escapeHtml(x.title)).join(' → ')}`;
 $('#outlineList').innerHTML=state.outline.map((it,i)=>`<article class="outline-item"><div class="page-no">${String(i+1).padStart(2,'0')}</div><h3>${escapeHtml(it.title)}</h3><p class="outline-sub">${escapeHtml(it.subtitle)}</p><ul>${it.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul><p class="speaker-note">${escapeHtml(it.speaker)}</p></article>`).join('');
}

function normalizeExternalTemplates(data){
 const arr=Array.isArray(data)?data:[];
 return arr.map((t,i)=>({
  id:t.id||`ext-${i+1}`,
  template_name:t.template_name||t.name||'Presentation Template',
  category:t.category||'general',
  provider:t.provider||t.source||'External Site',
  source_url:t.source_url||t.url||'#',
  access_type:t.access_type||'mixed',
  button_text:t.button_text||'打开官网',
  tags:Array.isArray(t.tags)?t.tags:[],
  description:t.description||'外部模板网站入口。',
  license_note:t.license_note||'请以原网站页面说明为准；登录、下载、付费和授权由原网站处理。',
  style:t.style||t.category||'general'
 })).filter(t=>t.source_url&&t.source_url!=='#');
}

function filteredExternalTemplates(){
 const q=($('#templateSearch')?.value||'').toLowerCase().trim();
 const cat=$('#categoryFilter')?.value||'all';
 return state.externalTemplates.filter(t=>{
  const text=[t.template_name,t.provider,t.category,t.description,(t.tags||[]).join(' ')].join(' ').toLowerCase();
  const catOk=cat==='all'||t.category===cat;
  const qOk=!q||text.includes(q);
  return catOk&&qOk;
 });
}

function renderExternalTemplates(){
 const list=filteredExternalTemplates();
 const grid=$('#externalTemplateGrid');
 $('#externalTemplateEmpty').classList.toggle('hidden',list.length>0);
 grid.innerHTML=list.map(t=>`<article class="tpl-card text-only" data-id="${escapeHtml(t.id)}">
   <div class="tpl-cover gradient ${escapeHtml(t.style)}"><span>${escapeHtml(t.provider)}</span><b>${escapeHtml(short(t.template_name,34))}</b></div>
   <div class="tpl-info">
    <div class="badges"><span class="badge">${escapeHtml(t.category)}</span><span class="badge">${escapeHtml(t.access_type)}</span>${(t.tags||[]).slice(0,3).map(x=>`<span class="badge">${escapeHtml(x)}</span>`).join('')}</div>
    <h3>${escapeHtml(t.template_name)}</h3>
    <p>${escapeHtml(t.description)}</p>
    <p class="license-note">${escapeHtml(t.license_note)}</p>
    <div class="card-actions"><button class="preview ext-preview" data-id="${escapeHtml(t.id)}">用这个风格预览</button><button class="apply ext-go" data-url="${escapeHtml(t.source_url)}">${escapeHtml(t.button_text)}</button></div>
   </div>
  </article>`).join('');
 $$('.ext-go').forEach(b=>b.onclick=(e)=>{e.stopPropagation();window.open(b.dataset.url,'_blank','noopener');});
 $$('.ext-preview,.tpl-card.text-only').forEach(el=>el.onclick=(e)=>{const id=e.currentTarget.dataset.id||e.target.dataset.id;selectExternalTemplate(id);});
}

function renderMyTemplates(){
 const list=getImportedTemplates().filter(isRealTemplate);
 const empty=$('#myTemplateEmpty');
 const grid=$('#myTemplateGrid');
 empty.classList.toggle('hidden',list.length>0);
 grid.innerHTML=list.map(t=>`<article class="tpl-card mine" data-id="${escapeHtml(t.id)}"><img class="tpl-cover" src="${t.coverData}" alt="template cover"/><div class="tpl-info"><div class="badges"><span class="badge">${escapeHtml(t.category||'mine')}</span><span class="badge">${escapeHtml(t.source||'user')}</span></div><h3>${escapeHtml(t.name)}</h3><p>${escapeHtml(t.credit||'已导入真实模板')}</p><div class="card-actions"><button class="preview mine-preview" data-id="${escapeHtml(t.id)}">预览</button><button class="apply mine-dl" data-id="${escapeHtml(t.id)}">下载 PPTX/POTX</button></div></div></article>`).join('');
 $$('.mine-preview,.tpl-card.mine').forEach(el=>el.onclick=(e)=>{const id=e.currentTarget.dataset.id||e.target.dataset.id;selectMineTemplate(id);});
 $$('.mine-dl').forEach(b=>b.onclick=(e)=>{e.stopPropagation();const id=e.target.dataset.id;state.selectedTemplate=list.find(x=>x.id===id);downloadPptx();});
}

function renderTemplateTabs(){
 $$('.tpl-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.templateTab));
 $('#externalTemplateArea').classList.toggle('hidden',state.templateTab!=='external');
 $('#myTemplateArea').classList.toggle('hidden',state.templateTab!=='mine');
 if(state.templateTab==='external')renderExternalTemplates();else renderMyTemplates();
}

function ensureOutline(){if(state.outline.length===0)buildOutline();}
function selectExternalTemplate(id){ensureOutline();state.selectedTemplate=state.externalTemplates.find(t=>t.id===id)||state.externalTemplates[0];state.selectedTemplate.type='external';renderPreview();showPanel('previewPanel');}
function selectMineTemplate(id){ensureOutline();const list=getImportedTemplates().filter(isRealTemplate);state.selectedTemplate=list.find(t=>t.id===id)||list[0];if(state.selectedTemplate)state.selectedTemplate.type='mine';renderPreview();showPanel('previewPanel');}

function renderPreview(){
 const tpl=state.selectedTemplate||state.externalTemplates[0];
 if(!tpl){$('#previewStrip').innerHTML='';return;}
 const isMine=tpl.type==='mine'||tpl.templateData;
 $('#previewHint').textContent=isMine?'这是你导入的真实模板，可下载原 PPTX/POTX 文件。':'这是结构预览；外部模板需点击按钮到原网站下载或编辑。';
 $('#deliveryChecklist').innerHTML=`<b>当前选择：</b>${escapeHtml(tpl.template_name||tpl.name)} · ${escapeHtml(tpl.provider||tpl.source||'我的模板')}<br><b>交付逻辑：</b>${isMine?'下载你上传的真实 PPTX/POTX':'打开官网获取模板，本平台只做大纲与结构预览'}`;
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

function dataUrlToBlob(dataUrl){
 const [meta,data]=String(dataUrl||'').split(',');
 if(!meta||!data)return null;
 const mime=((meta.match(/data:(.*?);base64/)||[])[1])||'application/octet-stream';
 const binary=atob(data);
 const arr=new Uint8Array(binary.length);
 for(let i=0;i<binary.length;i++)arr[i]=binary.charCodeAt(i);
 return new Blob([arr],{type:mime});
}
function triggerDownload(blob,fileName){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);}
async function downloadPptx(){
 if(!state.selectedTemplate)return alert('请先选择模板');
 const tpl=state.selectedTemplate;
 if(tpl.source_url&&!tpl.templateData){window.open(tpl.source_url,'_blank','noopener');return;}
 if(!state.isMember){$('#memberModal').classList.remove('hidden');return;}
 const blob=dataUrlToBlob(tpl.templateData);
 if(!blob)return alert('模板文件损坏，请重新导入。');
 triggerDownload(blob,`${slug(tpl.name||'template')}.${tpl.templateExt}`);
}
function saveImported(){
 const name=$('#tplName').value.trim();
 const credit=$('#tplCredit').value.trim();
 if(!name)return alert('请先填模板名称');
 if(!state.lastTemplateFile)return alert('请先上传 PPTX/POTX');
 if(!state.lastCoverData)return alert('请先上传封面图');
 const arr=getImportedTemplates();
 arr.unshift({id:'imp-'+Date.now(),name,category:$('#tplCategory').value,source:$('#tplSource').value,credit,coverData:state.lastCoverData,templateData:state.lastTemplateFile.data,templateExt:state.lastTemplateFile.ext,templateMime:state.lastTemplateFile.mime});
 setImportedTemplates(arr);
 state.lastTemplateFile=null;state.lastCoverData=null;
 $('#templateFile').value='';$('#coverFile').value='';$('#tplName').value='';$('#tplCredit').value='';$('#importPreview').innerHTML='';
 alert('已成功导入到“我的真模板库”。');
 $('#adminModal').classList.add('hidden');
 state.templateTab='mine';showPanel('templatePanel');
}

async function loadExternalTemplates(){
 try{
  const res=await fetch(`./templates/external_templates.json?v=${Date.now()}`,{cache:'no-store'});
  if(!res.ok)throw new Error('external_templates not found');
  const data=await res.json();
  state.externalTemplates=normalizeExternalTemplates(data);
  if(state.externalTemplates.length===0)state.externalTemplates=FALLBACK_EXTERNAL_TEMPLATES;
 }catch{
  state.externalTemplates=FALLBACK_EXTERNAL_TEMPLATES;
 }
 renderTemplateTabs();
}

async function hardRefreshApp(){
 try{
  if('serviceWorker' in navigator){
   const regs=await navigator.serviceWorker.getRegistrations();
   await Promise.all(regs.map(r=>r.unregister()));
  }
  if(window.caches){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}
 }catch(e){}
 location.href=location.pathname+`?v=${Date.now()}`;
}

$('#topicInput').addEventListener('input',e=>$('#charCount').textContent=e.target.value.length+' 字');
$('#generateBtn').onclick=buildOutline;
$('#editOutlineBtn').onclick=()=>showPanel('createPanel');
$('#goTemplateBtn').onclick=()=>{state.templateTab='external';showPanel('templatePanel');};
$('#backOutlineBtn').onclick=()=>showPanel('outlinePanel');
$('#changeTemplateBtn').onclick=()=>showPanel('templatePanel');
$('#downloadBtn').onclick=downloadPptx;
$('#templateSearch').addEventListener('input',renderExternalTemplates);
$('#categoryFilter').addEventListener('change',renderExternalTemplates);
$('#refreshAppBtn').onclick=hardRefreshApp;
$('#adminBtn').onclick=()=>$('#adminModal').classList.remove('hidden');
$('#openImporterBtn').onclick=()=>$('#adminModal').classList.remove('hidden');
$('#closeAdmin').onclick=()=>$('#adminModal').classList.add('hidden');
$('#saveTemplateBtn').onclick=saveImported;
$('#clearTemplatesBtn').onclick=()=>{if(confirm('确定清空本地导入模板？')){localStorage.removeItem('realTemplateCloud');renderMyTemplates();}};
$('#coverFile').onchange=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{state.lastCoverData=r.result;$('#importPreview').innerHTML=`<img src="${r.result}" alt="cover preview"/>`;};r.readAsDataURL(f);};
$('#templateFile').onchange=(e)=>{const f=e.target.files[0];if(!f)return;const ext=((f.name||'').split('.').pop()||'').toLowerCase();if(!['pptx','potx'].includes(ext)){e.target.value='';state.lastTemplateFile=null;return alert('只支持上传 PPTX/POTX');}const r=new FileReader();r.onload=()=>{state.lastTemplateFile={data:r.result,ext,mime:f.type||''};};r.readAsDataURL(f);};
$('#loginBtn').onclick=()=>alert('已模拟登入。正式版后续接 Supabase / Firebase / 自建后台。');
$('#memberBtn').onclick=()=>$('#memberModal').classList.remove('hidden');
$('#closeMember').onclick=()=>$('#memberModal').classList.add('hidden');
$('#fakePayBtn').onclick=()=>{state.isMember=true;$('#memberModal').classList.add('hidden');alert('已模拟开通会员，现在可以下载你导入的真实 PPTX/POTX。');};
$$('.mode').forEach(b=>b.onclick=()=>{$$('.mode').forEach(x=>x.classList.remove('active'));b.classList.add('active');});
$$('.tpl-tab').forEach(b=>b.onclick=()=>{state.templateTab=b.dataset.tab;renderTemplateTabs();});
$$('.nav-item').forEach(b=>b.onclick=()=>{const p=b.dataset.panel;if(p==='member')return $('#memberModal').classList.remove('hidden');if(p==='admin')return $('#adminModal').classList.remove('hidden');if(p==='outlinePanel')return showPanel('outlinePanel');showPanel(p);});

loadExternalTemplates();
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js?v=14.0.1').catch(()=>{});}
