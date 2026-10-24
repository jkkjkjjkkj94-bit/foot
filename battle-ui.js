(()=>{
if(!document.querySelector('link[data-eldoria-theme]')){const t=document.createElement('link');t.rel='stylesheet';t.href='eldoria-theme.css?v=20261024-2';t.dataset.eldoriaTheme='1';document.head.appendChild(t)}
if(!document.querySelector('link[data-eldoria-palette]')){const p=document.createElement('link');p.rel='stylesheet';p.href='eldoria-palette.css?v=20261024-1';p.dataset.eldoriaPalette='1';document.head.appendChild(p)}
if(!document.querySelector('link[data-eldoria-motion]')){const m=document.createElement('link');m.rel='stylesheet';m.href='eldoria-motion.css?v=20261024-1';m.dataset.eldoriaMotion='1';document.head.appendChild(m)}
if(!document.querySelector('link[data-combat-actions-css]')){const l=document.createElement('link');l.rel='stylesheet';l.href='combat-actions.css?v=20261024-2';l.dataset.combatActionsCss='1';document.head.appendChild(l)}
const icons={
attack:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 4.5 19.5 9.5M5 19l5.8-5.8M9.5 4.5l10 10M4.5 9.5l5-5 10 10-5 5z"/></svg>`,
skill:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.5 4.2L18 9l-4.5 1.8L12 15l-1.5-4.2L6 9l4.5-1.8L12 3Z"/><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/></svg>`,
potion:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v4l-4.5 8a4 4 0 0 0 3.5 6h6a4 4 0 0 0 3.5-6L14 7V3"/><path d="M8 14h8"/></svg>`,
escape:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/></svg>`};
const actionArt={
 attack:'combat-actions/attack.svg?v=20261024-2',
 'Golpe do Guardião':'combat-actions/guardian.svg?v=20261024-2',
 'Investida':'combat-actions/charge.svg?v=20261024-2',
 'Ruptura':'combat-actions/rupture.svg?v=20261024-2',
 potion:'combat-actions/potion.svg?v=20261024-2',
 escape:'combat-actions/escape.svg?v=20261024-2'
};
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function actionButton({kind='normal',icon='attack',title,sub,onClick,image='',disabled=false,badge=''}){
 const label=[title,sub].filter(Boolean).join(' · ');
 if(image)return `<button class="combat-action-btn art ${kind}" onclick="${onClick}" aria-label="${esc(label)}" title="${esc(label)}" ${disabled?'disabled':''}><span class="combat-action-thumb"><img src="${image}" alt=""></span><span class="combat-action-copy"><b>${esc(title)}</b><small>${esc(sub||'')}</small></span>${badge?`<span class="combat-action-badge">${esc(badge)}</span>`:''}${disabled?'<span class="combat-action-disabled">Mana insuficiente</span>':''}</button>`;
 return `<button class="combat-action-btn ${kind}" onclick="${onClick}" ${disabled?'disabled':''}><span class="combat-action-icon">${icons[icon]}</span><span class="combat-action-copy"><b>${esc(title)}</b><small>${esc(sub||'')}</small></span>${disabled?'<span class="combat-action-disabled">Mana insuficiente</span>':''}</button>`
}
function monsterVisualPro(){const custom=window.CEO&&window.CEO.getMonsterImage?window.CEO.getMonsterImage(enemy.name):'';if(custom)return `<img src="${custom}" alt="${enemy.name}">`;if(enemy.name==='Slime Sombrio')return `<img src="slime-sombrio.png" alt="Slime Sombrio">`;return `<div class="combat-monster-fallback">${enemy.icon||'👹'}</div>`}
function playerVisual(){const c=window.ELDORIA_CHARACTERS&&window.ELDORIA_CHARACTERS.selected?window.ELDORIA_CHARACTERS.selected():null;if(c?.image)return `<img src="${c.image}" alt="${c.name}">`;return CLASSES[S.className]?.icon||'🧙'}
function playerName(){const c=window.ELDORIA_CHARACTERS&&window.ELDORIA_CHARACTERS.selected?window.ELDORIA_CHARACTERS.selected():null;return c?.name||S.name}
function potionQty(){const p=S.inventory&&S.inventory.find(x=>x.n==='Poção de Vida');return Math.max(0,Number(p?.qty||0))}
window.battle=function(){
 if(!enemy){enemy=makeEnemy()}
 const classSkills=ELDORIA_SKILLS[S.className]||[];
 const skills=classSkills.filter(x=>S.level>=x[1]);
 const enemyHp=Math.max(0,enemy.hp/enemy.maxHp*100);
 const playerHp=Math.max(0,S.hp/S.maxHp*100);
 const mana=Math.max(0,S.mana/S.maxMana*100);
 const skillButtons=skills.map((s,i)=>actionButton({kind:'primary',icon:'skill',title:s[0],sub:`${s[2]} mana`,onClick:`skillAttack(${i})`,image:actionArt[s[0]]||'',disabled:S.mana<s[2]})).join('');
 const pq=potionQty();
 shell('Batalha em '+ZONES[S.zone].n,`<div class="combat-pro">
  <section class="combat-enemy-hud"><div class="combat-enemy-title"><div><h2>${enemy.boss?'CHEFE · ':''}${enemy.name}</h2><p>Nível ${enemy.level}${enemy.boss?' · Encontro especial':''}</p></div><div class="combat-hp-number">${Math.max(0,enemy.hp)} / ${enemy.maxHp} HP</div></div><div class="combat-meter hp"><i style="width:${enemyHp}%"></i><span>${Math.round(enemyHp)}%</span></div></section>
  <section class="combat-stage-pro"><div class="combat-monster-frame">${monsterVisualPro()}<div class="combat-monster-badge"><b>${enemy.name}</b><span>Nível ${enemy.level}</span></div></div></section>
  <aside class="combat-player-hud"><div class="combat-player-head"><div class="combat-avatar">${playerVisual()}</div><div><b>${playerName()}</b><small>${S.className} · Nível ${S.level}</small></div></div><div class="combat-stat-block"><div class="combat-stat-label"><span>Vida</span><b>${S.hp}/${S.maxHp}</b></div><div class="combat-meter hp"><i style="width:${playerHp}%"></i><span>${Math.round(playerHp)}%</span></div></div><div class="combat-stat-block"><div class="combat-stat-label"><span>Mana</span><b>${S.mana}/${S.maxMana}</b></div><div class="combat-meter mana"><i style="width:${mana}%"></i><span>${Math.round(mana)}%</span></div></div><div class="combat-numbers"><div class="combat-number"><small>Ataque</small><b>⚔ ${effectiveAtk()}</b></div><div class="combat-number"><small>Defesa</small><b>🛡 ${effectiveDef()}</b></div><div class="combat-number"><small>Ouro</small><b>🪙 ${S.gold}</b></div><div class="combat-number"><small>XP</small><b>${S.xp}/${xpNeed()}</b></div></div><div class="combat-zone">Região atual<b>${ZONES[S.zone].n}</b></div></aside>
  <section class="combat-actions-pro"><div class="combat-section-kicker">Ações de combate</div><div class="combat-action-grid illustrated">
   ${actionButton({kind:'primary',title:'Ataque',sub:'Ataque básico',onClick:'attack(false)',image:actionArt.attack})}
   ${skillButtons}
   ${actionButton({kind:'item',title:'Poção',sub:'Recuperar vida',onClick:'potion()',image:actionArt.potion,badge:`×${pq}`})}
   ${actionButton({kind:'danger',title:'Fugir',sub:'Encerrar combate',onClick:'home()',image:actionArt.escape})}
  </div></section>
  <section class="combat-log-pro"><div class="combat-section-kicker">Log da batalha</div><div class="combat-log-list">${S.log.slice(0,6).map(x=>`<div>${x}</div>`).join('')}</div></section>
 </div>`)
}
})();