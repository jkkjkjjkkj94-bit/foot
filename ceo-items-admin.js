(()=>{
const KEY='eldoriaCeoConfigV1';
const cfg=window.CEO&&window.CEO.config?window.CEO.config():{};
cfg.items=cfg.items||{};
cfg.customItems=Array.isArray(cfg.customItems)?cfg.customItems:[];
cfg.deletedItems=Array.isArray(cfg.deletedItems)?cfg.deletedItems:[];
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function persist(){localStorage.setItem(KEY,JSON.stringify(cfg))}
function syncCatalog(){
  for(let i=ELDORIA_ITEMS.length-1;i>=0;i--)if(cfg.deletedItems.includes(ELDORIA_ITEMS[i].id))ELDORIA_ITEMS.splice(i,1);
  cfg.customItems.forEach(raw=>{if(!raw||!raw.id)return;let it=ELDORIA_ITEMS.find(x=>x.id===raw.id);if(!it){ELDORIA_ITEMS.push({...raw});it=ELDORIA_ITEMS[ELDORIA_ITEMS.length-1]}let c=cfg.items[it.id]||{};['name','rarity','slot','icon'].forEach(k=>{if(c[k]!==undefined&&c[k]!=='')it[k]=c[k]});['atk','def','price'].forEach(k=>{if(c[k]!==undefined&&c[k]!=='')it[k]=Number(c[k])});if(c.shop!==undefined)it.ceoShop=c.shop});
}
syncCatalog();persist();
function itemPreview(it,i){let c=cfg.items[it.id]||{},img=c.image||'';return img?`<img src="${esc(img)}" alt="${esc(it.name)}">`:`<span>${esc(it.icon||'✨')}</span>`}
function slots(current){return [['weapon','Arma'],['armor','Armadura'],['boots','Botas'],['ring','Anel'],['amulet','Amuleto']].map(([v,n])=>`<option value="${v}" ${current===v?'selected':''}>${n}</option>`).join('')}
function rarities(current){return ['Comum','Raro','Épico','Lendário'].map(r=>`<option ${current===r?'selected':''}>${r}</option>`).join('')}
window.ceoItems=function(){
  if(sessionStorage.getItem('eldoriaCeoUnlocked')!=='1')return typeof ceoOpen==='function'?ceoOpen():null;
  syncCatalog();
  let cards=ELDORIA_ITEMS.map((it,i)=>{let c=cfg.items[it.id]||{},img=c.image||'';return `<div class="ceo-card"><div class="ceo-preview" id="itemPreview${i}">${itemPreview(it,i)}</div><div><h3>${esc(it.name)}</h3><div class="ceo-fields"><div class="ceo-field full"><label>Nome</label><input id="itemName${i}" value="${esc(it.name)}"></div><div class="ceo-field"><label>Tipo</label><select id="itemSlot${i}">${slots(it.slot)}</select></div><div class="ceo-field"><label>Ícone fallback</label><input id="itemIcon${i}" value="${esc(it.icon||'✨')}" maxlength="8"></div><div class="ceo-field"><label>Ataque</label><input id="itemAtk${i}" type="number" value="${it.atk}"></div><div class="ceo-field"><label>Defesa</label><input id="itemDef${i}" type="number" value="${it.def}"></div><div class="ceo-field"><label>Preço</label><input id="itemPrice${i}" type="number" value="${it.price}"></div><div class="ceo-field"><label>Raridade</label><select id="itemRarity${i}">${rarities(it.rarity)}</select></div><div class="ceo-field full"><label>Imagem / caminho / URL</label><div class="ceo-upload-row"><input id="itemImage${i}" value="${esc(img)}" placeholder="ex.: espada.png" oninput="ceoPreview('itemImage${i}','itemPreview${i}','${esc(it.icon||'✨')}')"><label class="ceo-upload">Enviar imagem<input type="file" accept="image/*" onchange="ceoFile(this,'itemImage${i}','itemPreview${i}')"></label></div></div><div class="ceo-field full"><label><input id="itemShop${i}" type="checkbox" ${c.shop===false?'':'checked'}> Exibir na loja</label></div></div><div class="ceo-card-actions"><button class="ceo-btn danger" onclick="ceoDeleteItem('${it.id}')">Excluir</button><button class="ceo-btn primary" onclick="ceoSaveItemAdmin(${i},'${it.id}')">Salvar item</button></div></div></div>`}).join('');
  shell('Painel CEO',`<div class="ceo-shell"><div class="ceo-toolbar"><div><h2>Loja e itens</h2><div class="muted">Crie, edite ou exclua equipamentos do jogo.</div></div><div class="ceo-toolbar-actions"><button class="ceo-btn primary" onclick="ceoAddItem()">+ Novo item</button><button class="ceo-btn" onclick="ceoDashboard()">Visão geral</button><button class="ceo-btn" onclick="ceoLogout()">Sair</button></div></div><div class="ceo-tabs"><button class="ceo-tab" onclick="ceoDashboard()">Visão geral</button><button class="ceo-tab" onclick="ceoEnemies()">Inimigos</button><button class="ceo-tab active" onclick="ceoItems()">Loja e itens</button>${typeof ceoCharacters==='function'?'<button class="ceo-tab" onclick="ceoCharacters()">Personagens</button>':''}</div><div class="ceo-note">Itens novos passam a funcionar na loja, inventário, equipamentos e drops. Ao excluir, o item também é removido do save atual para evitar referências quebradas.</div><div class="ceo-grid">${cards}</div></div>`)
};
window.ceoAddItem=function(){
  let id='custom_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,6);
  let item={id,name:'Novo Item',slot:'weapon',rarity:'Comum',atk:0,def:0,price:100,icon:'✨',ceoShop:true};
  cfg.customItems.push({...item});cfg.items[id]={shop:true};ELDORIA_ITEMS.push(item);persist();ceoItems();
};
window.ceoSaveItemAdmin=function(i,id){
  let it=ELDORIA_ITEMS.find(x=>x.id===id);if(!it)return alert('Item não encontrado.');
  let c=cfg.items[id]=cfg.items[id]||{};
  c.name=document.getElementById('itemName'+i).value.trim()||'Item';
  c.slot=document.getElementById('itemSlot'+i).value;
  c.icon=document.getElementById('itemIcon'+i).value.trim()||'✨';
  c.atk=Math.max(0,Number(document.getElementById('itemAtk'+i).value)||0);
  c.def=Math.max(0,Number(document.getElementById('itemDef'+i).value)||0);
  c.price=Math.max(0,Number(document.getElementById('itemPrice'+i).value)||0);
  c.rarity=document.getElementById('itemRarity'+i).value;
  c.image=document.getElementById('itemImage'+i).value.trim();
  c.shop=document.getElementById('itemShop'+i).checked;
  Object.assign(it,{name:c.name,slot:c.slot,icon:c.icon,atk:c.atk,def:c.def,price:c.price,rarity:c.rarity,ceoShop:c.shop});
  let custom=cfg.customItems.find(x=>x.id===id);if(custom)Object.assign(custom,{name:c.name,slot:c.slot,icon:c.icon,atk:c.atk,def:c.def,price:c.price,rarity:c.rarity,ceoShop:c.shop});
  persist();alert('Item salvo.');ceoItems();
};
window.ceoDeleteItem=function(id){
  let it=ELDORIA_ITEMS.find(x=>x.id===id);if(!it)return;
  if(!confirm(`Excluir ${it.name}?`))return;
  let customIndex=cfg.customItems.findIndex(x=>x.id===id);
  if(customIndex>=0)cfg.customItems.splice(customIndex,1);else if(!cfg.deletedItems.includes(id))cfg.deletedItems.push(id);
  delete cfg.items[id];
  let idx=ELDORIA_ITEMS.findIndex(x=>x.id===id);if(idx>=0)ELDORIA_ITEMS.splice(idx,1);
  if(typeof S!=='undefined'){
    if(Array.isArray(S.bag))S.bag=S.bag.filter(x=>x!==id);
    if(S.equipped)Object.keys(S.equipped).forEach(k=>{if(S.equipped[k]===id)S.equipped[k]=null});
    if(S.lastVictory&&S.lastVictory.drop===id)S.lastVictory.drop=null;
    if(typeof save==='function')save();
  }
  persist();ceoItems();
};
})();