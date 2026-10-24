(()=>{
'use strict';
if(!document.querySelector('link[data-inventory-item-images]')){const l=document.createElement('link');l.rel='stylesheet';l.href='inventory-item-images.css?v=20261024-1';l.dataset.inventoryItemImages='1';document.head.appendChild(l)}
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const attr=s=>esc(s).replace(/`/g,'&#96;');
const rarityClass=r=>'rarity-'+String(r||'Comum').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-');
let selectedBagIndex=0;

function itemImageSrc(it){
  if(!it)return '';
  const fromItem=String(it.image||it.img||it.photo||it.thumbnail||'').trim();
  if(fromItem)return fromItem;
  try{
    const fromCeo=window.CEO?.getItemImage?.(it.id)||'';
    if(fromCeo)return String(fromCeo).trim();
  }catch{}
  return '';
}

function itemVisual(it,large=false){
  const src=itemImageSrc(it),icon=esc(it?.icon||'◇'),name=attr(it?.name||'Item');
  if(src){
    return `<span class="mx-item-visual ${large?'is-large':''}"><img src="${attr(src)}" alt="${name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="mx-item-fallback" style="display:none">${icon}</span></span>`;
  }
  return `<span class="mx-item-visual ${large?'is-large':''}"><span class="mx-item-fallback">${icon}</span></span>`;
}

function itemByLocal(id){
  if(typeof itemById==='function')return itemById(id);
  if(typeof ELDORIA_ITEMS!=='undefined')return ELDORIA_ITEMS.find(x=>x.id===id);
  return null;
}

function bagEntries(){
  const gear=(S.bag||[]).map((id,i)=>({kind:'gear',id,index:i,item:itemByLocal(id)})).filter(x=>x.item);
  const consumables=(S.inventory||[]).filter(x=>x.qty>0).map((x,i)=>({kind:'consumable',index:i,item:{id:'consumable-'+i,name:x.n,rarity:'Comum',icon:x.n.includes('Poção')?'🧪':'🥖',price:0,atk:0,def:0,qty:x.qty,slot:'Consumível'}}));
  return [...gear,...consumables];
}

window.selectMythicItem=function(i){selectedBagIndex=i;window.inventory()};

window.inventory=function(){
  if(typeof ensureExpansion==='function')ensureExpansion();
  const entries=bagEntries();
  if(selectedBagIndex>=entries.length)selectedBagIndex=Math.max(0,entries.length-1);
  const sel=entries[selectedBagIndex];

  const slots=Array.from({length:35},(_,i)=>{
    const e=entries[i];
    if(!e)return '<div class="mx-slot"></div>';
    const it=e.item;
    return `<button class="mx-slot ${rarityClass(it.rarity)} ${i===selectedBagIndex?'selected':''}" onclick="selectMythicItem(${i})" title="${attr(it.name)}">${itemVisual(it,false)}${it.qty?`<small>${it.qty}</small>`:''}</button>`;
  }).join('');

  const detail=sel?(()=>{
    const it=sel.item;
    return `<div class="mx-detail-art">${itemVisual(it,true)}</div><span class="mx-rarity ${rarityClass(it.rarity)}">${esc(it.rarity||'Comum')}</span><h2>${esc(it.name)}</h2><p>${sel.kind==='gear'?`Equipamento de ${esc(it.slot||'aventura')}. Compare os atributos e escolha se deseja equipar ou vender.`:'Item consumível usado durante a jornada.'}</p><div class="mx-item-stats"><div>Ataque <b>+${it.atk||0}</b></div><div>Defesa <b>+${it.def||0}</b></div><div>Valor <b>${it.price||0}</b></div><div>Tipo <b>${esc(it.slot||'Item')}</b></div></div><div class="mx-item-actions">${sel.kind==='gear'?`<button class="mx-btn primary" onclick="equipItem(${sel.index})">Equipar</button><button class="mx-btn" onclick="sellItem(${sel.index})">Vender ${Math.floor((it.price||0)*.45)}</button>`:`<button class="mx-btn primary" onclick="potion()">Usar</button>`}</div>`;
  })():'<div class="mx-empty">Sua mochila está vazia.</div>';

  shell('Inventário',`<div class="mx-inventory"><section class="mx-bag mx-window"><div class="mx-section-title"><h2>Mochila</h2><small>${entries.length}/35 slots</small></div><div class="mx-filterbar"><span class="mx-chip active">Todos</span><span class="mx-chip">Armas</span><span class="mx-chip">Armaduras</span><span class="mx-chip">Consumíveis</span><span class="mx-chip">Raros</span></div><div class="mx-slotgrid">${slots}</div></section><aside class="mx-item-detail mx-window ${sel?rarityClass(sel.item.rarity):''}">${detail}</aside></div>`,'As imagens cadastradas no Painel CEO aparecem nos slots e nos detalhes dos itens.');
};
})();