(()=>{
const POINTS_PER_LEVEL=2;
const KEYS=['str','dex','con','int','wis','cha'];
const LABELS={str:'FOR',dex:'DES',con:'CON',int:'INT',wis:'SAB',cha:'CAR'};
const NAMES={str:'Força',dex:'Destreza',con:'Constituição',int:'Inteligência',wis:'Sabedoria',cha:'Carisma'};
const ICONS={str:'⚔️',dex:'🏹',con:'❤️',int:'🔮',wis:'👁️',cha:'👑'};
const DESCS={str:'Aumenta o poder ofensivo do Cavaleiro.',dex:'Aumenta o poder do Arqueiro, a defesa e a iniciativa.',con:'Aumenta a vida máxima.',int:'Aumenta o poder do Mago e a mana máxima.',wis:'Melhora a recuperação das poções.',cha:'Reduz os preços dos itens na loja.'};
function abilityMod(v){return Math.floor((Number(v||10)-10)/2)}
function abilities(){
  if(window.ELDORIA_CHARACTERS&&ELDORIA_CHARACTERS.abilities)return ELDORIA_CHARACTERS.abilities();
  S.abilities=S.abilities||{str:10,dex:10,con:10,int:10,wis:10,cha:10};return S.abilities;
}
function primaryKey(){return S.className==='Mago'?'int':S.className==='Arqueiro'?'dex':'str'}
function ensureTraining(){
  const a=abilities();S.abilities={...a};
  if(S.attributePoints===undefined){S.attributePoints=Math.max(0,(Number(S.level||1)-1)*POINTS_PER_LEVEL);S.attributePointLevel=Number(S.level||1)}
  if(S.attributePointLevel===undefined)S.attributePointLevel=Number(S.level||1);
  if(S.attributeBaseMaxHp===undefined)S.attributeBaseMaxHp=Number(S.maxHp||100);
  if(S.attributeBaseMaxMana===undefined)S.attributeBaseMaxMana=Number(S.maxMana||50);
  recalcResources(false);
  save();
}
function recalcResources(healIncrease=true){
  const a=abilities(),oldHp=Number(S.maxHp||0),oldMana=Number(S.maxMana||0);
  const hpBonus=abilityMod(a.con)*12,manaBonus=abilityMod(a.int)*8;
  S.maxHp=Math.max(1,Number(S.attributeBaseMaxHp||100)+hpBonus);
  S.maxMana=Math.max(0,Number(S.attributeBaseMaxMana||50)+manaBonus);
  if(healIncrease){S.hp=Math.min(S.maxHp,Number(S.hp||0)+Math.max(0,S.maxHp-oldHp));S.mana=Math.min(S.maxMana,Number(S.mana||0)+Math.max(0,S.maxMana-oldMana))}
  else{S.hp=Math.min(S.maxHp,Number(S.hp||0));S.mana=Math.min(S.maxMana,Number(S.mana||0))}
}
window.attributeEffects=function(){const a=abilities(),pk=primaryKey();return{attack:abilityMod(a[pk])*2,defense:abilityMod(a.dex)+Math.max(0,abilityMod(a.con)),hp:abilityMod(a.con)*12,mana:abilityMod(a.int)*8,potion:Math.max(0,abilityMod(a.wis))*8,discount:Math.min(.24,Math.max(0,abilityMod(a.cha))*.03),primary:pk}}
ensureTraining();

// Níveis agora concedem pontos em vez de aumentar atributos automaticamente.
gainXp=function(amount){
  ensureTraining();
  S.xp+=Math.max(0,Number(amount)||0);
  let levels=0;
  while(S.xp>=xpNeed()){
    S.xp-=xpNeed();S.level++;levels++;
    S.attributePoints=(S.attributePoints||0)+POINTS_PER_LEVEL;
    S.attributePointLevel=S.level;
    S.hp=S.maxHp;S.mana=S.maxMana;
    S.log.unshift(`Você alcançou o nível ${S.level}! +${POINTS_PER_LEVEL} pontos de atributo.`)
  }
  save();return levels;
};window.gainXp=gainXp;

// Atributos afetam o combate.
if(typeof effectiveAtk==='function'){
  const baseEffectiveAtk=effectiveAtk;
  effectiveAtk=function(){return Math.max(1,baseEffectiveAtk()+attributeEffects().attack)};window.effectiveAtk=effectiveAtk;
}
if(typeof effectiveDef==='function'){
  const baseEffectiveDef=effectiveDef;
  effectiveDef=function(){return Math.max(0,baseEffectiveDef()+attributeEffects().defense)};window.effectiveDef=effectiveDef;
}

// SAB melhora poções.
if(typeof potion==='function'){
  potion=function(){
    const p=S.inventory&&S.inventory.find(x=>x.n==='Poção de Vida'&&x.qty>0);if(!p)return battle();
    p.qty--;const heal=60+attributeEffects().potion;S.hp=Math.min(S.maxHp,S.hp+heal);S.log.unshift(`Poção recuperou ${heal} de vida.`);save();battle();
  };window.potion=potion;
}

// CAR reduz preços da loja.
if(typeof buyItem==='function'){
  buyItem=function(id){const it=itemById(id);if(!it)return;const price=Math.max(1,Math.round(it.price*(1-attributeEffects().discount)));if(S.gold<price)return alert('Ouro insuficiente.');S.gold-=price;addItem(id);save();shop()};window.buyItem=buyItem;
}

function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function modText(v){const m=abilityMod(v);return `${m>=0?'+':''}${m}`}
function trainingCards(){const a=abilities();return KEYS.map(k=>`<article class="training-card"><div class="training-card-head"><span>${ICONS[k]}</span><div><small>${LABELS[k]}</small><h3>${NAMES[k]}</h3></div><strong>${a[k]}</strong></div><p>${DESCS[k]}</p><div class="training-mod">Modificador <b>${modText(a[k])}</b></div><button ${S.attributePoints<=0||a[k]>=30?'disabled':''} onclick="trainAttribute('${k}')">${a[k]>=30?'Máximo':'Treinar +1'}</button></article>`).join('')}
window.attributeTraining=function(){ensureTraining();const fx=attributeEffects();shell('Treinamento de Atributos',`<div class="training-page"><section class="training-summary"><div><p class="eyebrow">EVOLUÇÃO</p><h2>Pontos de atributo</h2><p>Ao subir de nível você recebe <b>${POINTS_PER_LEVEL} pontos</b>. Use os pontos para treinar as características do seu personagem.</p></div><div class="training-points"><small>DISPONÍVEIS</small><b>${S.attributePoints||0}</b><span>pontos</span></div></section><div class="training-grid">${trainingCards()}</div><section class="training-effects"><h3>Efeitos atuais</h3><div><span>Ataque por ${LABELS[fx.primary]} <b>${fx.attack>=0?'+':''}${fx.attack}</b></span><span>Defesa <b>${fx.defense>=0?'+':''}${fx.defense}</b></span><span>Vida máxima <b>${fx.hp>=0?'+':''}${fx.hp}</b></span><span>Mana máxima <b>${fx.mana>=0?'+':''}${fx.mana}</b></span><span>Cura de poção <b>+${fx.potion}</b></span><span>Desconto na loja <b>${Math.round(fx.discount*100)}%</b></span></div></section></div>`)};
window.trainAttribute=function(key){ensureTraining();if(!KEYS.includes(key)||S.attributePoints<=0)return;const a=abilities();if(a[key]>=30)return;S.abilities={...a,[key]:a[key]+1};S.attributePoints--;recalcResources(true);save();attributeTraining()};

// Atalho na ficha do personagem e na home.
if(typeof window.character==='function'){
  const baseCharacter=window.character;window.character=function(){baseCharacter();ensureTraining();const host=document.querySelector('.character-profile-info');if(host&&!host.querySelector('.training-shortcut'))host.insertAdjacentHTML('beforeend',`<div class="training-shortcut"><div><small>TREINAMENTO</small><b>${S.attributePoints||0} pontos disponíveis</b></div><button class="btn gold" onclick="attributeTraining()">Treinar atributos</button></div>`)};
}
if(typeof window.home==='function'){
  const baseHome=window.home;window.home=function(){baseHome();ensureTraining();const actions=document.querySelector('.profile-actions');if(actions&&!actions.querySelector('[data-training]'))actions.insertAdjacentHTML('beforeend',`<button class="profile-action" data-training onclick="attributeTraining()"><b>🏋️ Treinamento</b><small>${S.attributePoints||0} pontos disponíveis</small></button>`)};
}

// Navegação lateral.
if(typeof window.go==='function'){
  const baseGo=window.go;window.go=function(p){if(p==='Treinamento')return attributeTraining();return baseGo(p)};
}
if(typeof window.nav==='function'){
  const baseNav=window.nav;window.nav=function(){baseNav();const n=document.getElementById('nav');if(n&&!n.querySelector('[data-training-nav]')){const b=document.createElement('button');b.dataset.trainingNav='1';b.textContent='› Treinamento';b.onclick=()=>attributeTraining();n.appendChild(b)}};nav();
}

// Loja: mostra o preço real com desconto de CAR.
if(typeof window.shop==='function'){
  const baseShop=window.shop;window.shop=function(){baseShop();const d=attributeEffects().discount;if(!d)return;document.querySelectorAll('.shopItem button[onclick^="buyItem"]').forEach(btn=>{const m=btn.getAttribute('onclick').match(/buyItem\('([^']+)'\)/);if(!m)return;const it=itemById(m[1]);if(!it)return;const price=Math.max(1,Math.round(it.price*(1-d)));btn.textContent=`Comprar · ${price} 🪙 (-${Math.round(d*100)}%)`})};
}
})();