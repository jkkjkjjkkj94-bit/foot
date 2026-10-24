(()=>{
'use strict';
const SUPABASE_URL='https://innziuzgtpfsiywqmies.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_fJB7zijdznI9ob9l9jSGlQ_6oU_J-d1';
const WRITE_URL=SUPABASE_URL+'/functions/v1/eldoria-ceo-content';
const CLOUD_KEY='eldoriaCeoCloudKey';
const TRACKED={
  eldoriaCeoConfigV1:['ceo_config','main'],
  eldoriaCharactersV1:['characters','catalog']
};
const scripts=[
  'app.js?v=20261023-10',
  'game-expansion.js?v=20261023-1',
  'ceo-panel.js?v=20261023-1',
  'ceo-items-admin.js?v=20261023-1',
  'characters.js?v=20261023-4',
  'attribute-training.js?v=20261023-1',
  'eldoria-mythic.js?v=20261024-1',
  'eldoria-mythic-runtime-fix.js?v=20261024-1'
];

const nativeSet=Storage.prototype.setItem;
const nativeRemove=Storage.prototype.removeItem;
let loadingCloud=false;
let lastWrite=Promise.resolve();

function rawSet(key,value){nativeSet.call(localStorage,key,value)}
function rawRemove(key){nativeRemove.call(localStorage,key)}
function cloudKey(promptIfMissing=true){
  let key=localStorage.getItem(CLOUD_KEY)||'';
  if(!key&&promptIfMissing){
    key=(prompt('Digite a chave de sincronização do Painel CEO:')||'').trim();
    if(key)rawSet(CLOUD_KEY,key);
  }
  return key;
}
async function writeContent(contentType,contentKey,payload,action='upsert'){
  const key=cloudKey(true);
  if(!key)throw new Error('Chave de sincronização não informada.');
  const res=await fetch(WRITE_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json','x-ceo-key':key},
    body:JSON.stringify({action,content_type:contentType,content_key:contentKey,payload})
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok){
    if(res.status===401)rawRemove(CLOUD_KEY);
    throw new Error(data.error||('Falha na sincronização ('+res.status+').'));
  }
  return data;
}
async function loadCloud(){
  const url=SUPABASE_URL+'/rest/v1/game_content?select=content_type,content_key,payload&content_type=in.(ceo_config,characters)';
  const res=await fetch(url,{headers:{apikey:PUBLISHABLE_KEY,Authorization:'Bearer '+PUBLISHABLE_KEY}});
  if(!res.ok)throw new Error('Não foi possível carregar o conteúdo do jogo.');
  const rows=await res.json();
  loadingCloud=true;
  try{
    for(const row of rows){
      if(row.content_type==='ceo_config'&&row.content_key==='main')rawSet('eldoriaCeoConfigV1',JSON.stringify(row.payload||{}));
      if(row.content_type==='characters'&&row.content_key==='catalog'&&Array.isArray(row.payload))rawSet('eldoriaCharactersV1',JSON.stringify(row.payload));
    }
  }finally{loadingCloud=false}
}
function queueSync(storageKey,value,action='upsert'){
  if(loadingCloud)return;
  const target=TRACKED[storageKey];
  if(!target)return;
  const canWrite=sessionStorage.getItem('eldoriaCeoUnlocked')==='1'||!!localStorage.getItem(CLOUD_KEY);
  if(!canWrite)return;
  let payload=null;
  if(action==='upsert'){
    try{payload=JSON.parse(value)}catch{return}
  }
  lastWrite=lastWrite.then(()=>writeContent(target[0],target[1],payload,action)).then(()=>{
    window.GameDBStatus={ok:true,at:Date.now()};
    if(typeof window.mythicToast==='function')window.mythicToast('Banco sincronizado','Alteração do Painel CEO salva na nuvem.');
  }).catch(err=>{
    window.GameDBStatus={ok:false,error:err.message,at:Date.now()};
    console.error('[GameDB]',err);
    alert('A alteração foi salva neste navegador, mas não chegou ao banco: '+err.message);
  });
}
Storage.prototype.setItem=function(key,value){
  nativeSet.call(this,key,value);
  if(this===localStorage)queueSync(String(key),String(value),'upsert');
};
Storage.prototype.removeItem=function(key){
  nativeRemove.call(this,key);
  if(this===localStorage)queueSync(String(key),'','delete');
};

window.GameDB={
  url:SUPABASE_URL,
  ready:null,
  get lastWrite(){return lastWrite},
  configureKey(){const key=(prompt('Digite a nova chave de sincronização do Painel CEO:')||'').trim();if(key)rawSet(CLOUD_KEY,key);return !!key},
  forgetKey(){rawRemove(CLOUD_KEY)},
  async put(type,key,payload){lastWrite=writeContent(type,key,payload,'upsert');return lastWrite},
  async remove(type,key){lastWrite=writeContent(type,key,null,'delete');return lastWrite},
  async syncLocal(){
    const tasks=[];
    for(const [storageKey,[type,key]] of Object.entries(TRACKED)){
      const raw=localStorage.getItem(storageKey);if(!raw)continue;
      try{tasks.push(writeContent(type,key,JSON.parse(raw),'upsert'))}catch{}
    }
    await Promise.all(tasks);
    return true;
  }
};

function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s)})}
async function boot(){
  try{await loadCloud()}catch(err){console.warn('[GameDB] usando cache local:',err.message)}
  for(const src of scripts){await loadScript(src)}
  const originalDashboard=window.ceoDashboard;
  if(typeof originalDashboard==='function')window.ceoDashboard=function(){const out=originalDashboard.apply(this,arguments);setTimeout(()=>{const host=document.querySelector('.ceo-shell');if(host&&!host.querySelector('[data-cloud-status]'))host.insertAdjacentHTML('afterbegin','<div class="ceo-note" data-cloud-status>☁️ Banco do jogo conectado. Alterações do CEO são sincronizadas com o Supabase.</div>')},0);return out};
}
window.GameDB.ready=boot();
})();