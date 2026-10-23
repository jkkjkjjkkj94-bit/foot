(()=>{
function escInv(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function itemImage(it,cls='inventory-item-image'){
  const src=window.CEO&&window.CEO.getItemImage?window.CEO.getItemImage(it.id):'';
  if(src)return `<div class="inventory-item-visual"><img class="${cls}" src="${escInv(src)}" alt="${escInv(it.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span class="inventory-item-fallback" style="display:none">${it.icon}</span></div>`;
  return `<div class="inventory-item-visual"><span class="inventory-item-fallback">${it.icon}</span></div>`;
}
window.inventory=function(){
  ensureExpansion();
  const slots=[['weapon','Arma'],['armor','Armadura'],['boots','Botas'],['ring','Anel'],['amulet','Amuleto']];
  const eq=slots.map(([slot,label])=>{
    const it=itemById(S.equipped[slot]);
    return `<div class="equipSlot inventory-equip-slot"><small>${label}</small>${it?`${itemImage(it,'inventory-equipped-image')}<div class="inventory-equip-copy"><b>${escInv(it.name)}</b><span>+${it.atk} ATQ · +${it.def} DEF</span><em>${escInv(it.rarity)}</em></div>`:'<div class="inventory-empty-slot">Vazio</div>'}</div>`;
  }).join('');

  const bag=S.bag.length?S.bag.map((id,i)=>{
    const it=itemById(id);
    if(!it)return '';
    return `<div class="lootCard inventory-loot-card ${rarityClass(it.rarity)}">${itemImage(it)}<div class="inventory-loot-copy"><b>${escInv(it.name)}</b><small>${escInv(it.rarity)} · ${escInv(it.slot)}</small><span>+${it.atk} ATQ · +${it.def} DEF</span><span class="inventory-price">Valor: ${Math.floor(it.price*.45)} 🪙</span></div><div class="lootBtns"><button onclick="equipItem(${i})">Equipar</button><button onclick="sellItem(${i})">Vender</button></div></div>`;
  }).join(''):'<div class="emptyState">Nenhum equipamento encontrado ainda.</div>';

  shell('Inventário',`<div class="inventoryLayout inventory-pro"><section><p class="eyebrow">EQUIPADO</p><div class="equipGrid">${eq}</div></section><section><p class="eyebrow">MOCHILA · ${S.bag.length} ITENS</p><div>${bag}</div></section></div>`);
};
})();