(()=>{
if(!document.querySelector('link[data-eldoria-ui-upgrade]')){const l=document.createElement('link');l.rel='stylesheet';l.href='eldoria-ui-upgrade.css?v=20261024-2';l.dataset.eldoriaUiUpgrade='1';document.head.appendChild(l)}
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

const NAV_ICONS={
 'Início':'<svg viewBox="0 0 24 24"><path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4z"/></svg>',
 'Aventura':'<svg viewBox="0 0 24 24"><path d="m14 4 6 6-9 9H5v-6z"/><path d="m12 6 6 6M5 19l-2 2"/></svg>',
 'Missões':'<svg viewBox="0 0 24 24"><path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
 'Personagem':'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21c.7-4 3.1-6 7-6s6.3 2 7 6"/></svg>',
 'Inventário':'<svg viewBox="0 0 24 24"><path d="M5 8h14v12H5z"/><path d="M8 8a4 4 0 0 1 8 0M9 12h6"/></svg>',
 'Mapa':'<svg viewBox="0 0 24 24"><path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/></svg>',
 'Treinamento':'<svg viewBox="0 0 24 24"><path d="M7 7v10M17 7v10M4 10v4M20 10v4M7 12h10"/></svg>'
};

function decorateNav(){
 const nav=q('#nav');if(!nav)return;
 qa('button',nav).forEach(btn=>{
   const raw=btn.dataset.uiNav||(btn.textContent||'').replace(/^\s*›\s*/,'').trim();
   if(btn.dataset.uiNav!==raw){const icon=NAV_ICONS[raw]||'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/></svg>';btn.classList.add('ui-nav');btn.dataset.uiNav=raw;btn.innerHTML=`<span class="ui-nav-icon">${icon}</span><span class="ui-nav-label">${esc(raw)}</span>`}
 });
}
function activeNav(title=''){
 let name='';if(title==='Jornada'||title.includes('Área Principal'))name='Início';else if(title.includes('Batalha')||title.includes('Combate')||title.includes('Vitória'))name='Aventura';else if(title.includes('Miss'))name='Missões';else if(title.includes('Personagem'))name='Personagem';else if(title.includes('Inventário'))name='Inventário';else if(title.includes('Mapa'))name='Mapa';else if(title.includes('Treinamento'))name='Treinamento';
 qa('#nav button').forEach(b=>b.classList.toggle('is-active',b.dataset.uiNav===name));
}

function missionInfo(){if(!S.mission)return null;const m=typeof MISSIONS!=='undefined'?MISSIONS.find(x=>x.id===S.mission.id):null;if(!m)return null;const total=Math.max(1,Number(m.duration||1)*1000),remaining=Math.max(0,Number(S.mission.endsAt||0)-Date.now());return{m,remaining,pct:Math.max(0,Math.min(100,(1-remaining/total)*100)),done:remaining<=0}}
function formatRemaining(ms){let sec=Math.max(0,Math.ceil(ms/1000));let m=Math.floor(sec/60),s=sec%60;if(m>=60){const h=Math.floor(m/60);m%=60;return `${h}h ${String(m).padStart(2,'0')}m`}return `${m}m ${String(s).padStart(2,'0')}s`}

function enhanceHome(){
 const main=q('#main'),hero=q('.profile-hero',main),actions=q('.profile-actions',main);if(!main||!hero||!actions||q('.rpg-hub',main))return;
 const oldRow=[...main.children].find(el=>el.classList?.contains('row'));const z=ZONES[S.zone],boss=typeof ELDORIA_BOSSES!=='undefined'?ELDORIA_BOSSES[S.zone]:null,kills=Number(S.zoneKills?.[S.zone]||0),mission=missionInfo();
 const hub=document.createElement('div');hub.className='rpg-hub';hero.parentNode.insertBefore(hub,hero);hub.appendChild(hero);const dashboard=document.createElement('div');dashboard.className='hub-dashboard';const left=document.createElement('div');left.className='hub-left';const right=document.createElement('div');right.className='hub-right';left.appendChild(actions);
 const missionCard=document.createElement('section');missionCard.className='hub-card gold';missionCard.innerHTML=mission?`<div class="hub-label">Missão ativa</div><h3>${esc(mission.m.icon)} ${esc(mission.m.n)}</h3><p>${esc(mission.m.desc)}</p><div class="hub-objective"><small>${mission.done?'Objetivo concluído':'Tempo restante'}</small><strong>${mission.done?'Recompensa disponível':formatRemaining(mission.remaining)}</strong></div><div class="hub-mission-progress"><i style="width:${mission.pct}%"></i></div><button class="btn gold" onclick="quests()">${mission.done?'Receber recompensa':'Ver missão'}</button>`:`<div class="hub-label">Próximo passo</div><h3>Escolha uma missão</h3><p>Assuma contratos para ganhar experiência, ouro e avançar por Eldoria.</p><div class="hub-objective"><small>Objetivo recomendado</small><strong>Visite o quadro de missões</strong></div><button class="btn" onclick="quests()">Abrir missões</button>`;left.appendChild(missionCard);
 const region=document.createElement('section');region.className='hub-card';region.innerHTML=`<div class="hub-region-icon">${esc(z.icon)}</div><div class="hub-label">Região atual</div><h3>${esc(z.n)}</h3><p>${esc(z.desc)}</p><div class="hub-meta"><span>Nível recomendado ${z.lv}+</span><span>${S.kills||0} inimigos derrotados</span></div><button class="btn" onclick="map()">Abrir mapa</button>`;right.appendChild(region);
 const objective=document.createElement('section');objective.className='hub-card orange';let objectiveTitle='Fortaleça seu aventureiro',objectiveText=`Nível ${S.level} · ${S.attributePoints||0} pontos de atributo disponíveis`;if(boss&&!S.bossesDefeated?.[S.zone]){objectiveTitle=kills>=boss.need?`${boss.name} foi localizado`:`Localize ${boss.name}`;objectiveText=kills>=boss.need?'O chefe desta região já pode ser enfrentado.':`${kills}/${boss.need} inimigos derrotados nesta região.`}
 objective.innerHTML=`<div class="hub-label">Próximo objetivo</div><h3>${esc(objectiveTitle)}</h3><p>${esc(objectiveText)}</p><div class="hub-meta"><span>🪙 ${S.gold} ouro</span><span>📜 ${S.missionsDone||0} missões</span><span>☠ ${S.kills||0} vitórias</span></div>${boss&&kills>=boss.need&&!S.bossesDefeated?.[S.zone]?`<button class="btn gold" onclick="fightBoss()">Enfrentar chefe</button>`:`<button class="btn" onclick="attributeTraining()">Treinamento</button>`}`;right.appendChild(objective);
 dashboard.append(left,right);hub.appendChild(dashboard);if(oldRow)oldRow.remove();const title=q('.titlebar h1',main);if(title)title.textContent='Jornada';
}

function decorateMap(){const spots=qa('.mapSpot');if(!spots.length)return;spots.forEach((spot,i)=>{const z=ZONES[i];if(!z)return;spot.classList.toggle('is-current',i===S.zone);spot.classList.toggle('is-locked',Number(S.level)<Number(z.lv));const b=typeof ELDORIA_BOSSES!=='undefined'?ELDORIA_BOSSES[i]:null,ready=!!(b&&!S.bossesDefeated?.[i]&&Number(S.zoneKills?.[i]||0)>=b.need);spot.classList.toggle('boss-ready',ready);spot.dataset.uiTip=`${z.n} · Nv. ${z.lv}+${i===S.zone?' · Região atual':''}${ready?' · Chefe disponível':''}`})}
function decorateStates(){qa('.inventory-equip-slot').forEach(x=>x.classList.toggle('is-equipped',!!q('.inventory-equip-copy',x)));qa('.quest').forEach(x=>{const t=x.textContent||'';x.classList.toggle('is-locked',t.includes('Bloqueada'))});qa('button:disabled').forEach(x=>x.classList.add('is-disabled'))}
function decorateScreen(){decorateNav();decorateMap();decorateStates();const title=q('.titlebar h1')?.textContent||'';activeNav(title);document.body.dataset.screen=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-')}

function addFloat(parent,text,type){if(!parent||!text)return;const el=document.createElement('span');el.className=`battle-float ${type}`;el.textContent=text;parent.appendChild(el);setTimeout(()=>el.remove(),800)}
function battleFx(beforeEnemy,beforeHp,kind,beforeHeal){const root=q('.combat-pro');if(!root)return;const stage=q('.combat-stage-pro',root),player=q('.combat-player-hud',root);if(player)player.style.position='relative';const enemyLoss=beforeEnemy!=null&&enemy?Math.max(0,beforeEnemy-Number(enemy.hp||0)):0,playerLoss=Math.max(0,Number(beforeHp||0)-Number(S.hp||0)),heal=Math.max(0,Number(S.hp||0)-Number(beforeHeal??S.hp));if(enemyLoss>0){root.classList.add('battle-hit-enemy');addFloat(stage,`-${enemyLoss}`,'enemy')}if(playerLoss>0){root.classList.add('battle-hit-player');addFloat(player,`-${playerLoss}`,'player')}if(kind==='skill')root.classList.add('battle-skill');if(heal>0)addFloat(player,`+${heal}`,'heal');setTimeout(()=>root.classList.remove('battle-hit-enemy','battle-hit-player','battle-skill'),390)}
function wrapCombat(){if(typeof window.attack==='function'&&!window.attack.__uiWrapped){const base=window.attack;const fn=function(){const be=enemy?.hp,bh=S.hp;const out=base.apply(this,arguments);setTimeout(()=>battleFx(be,bh,'attack'),20);return out};fn.__uiWrapped=1;window.attack=fn}if(typeof window.skillAttack==='function'&&!window.skillAttack.__uiWrapped){const base=window.skillAttack;const fn=function(){const be=enemy?.hp,bh=S.hp;const out=base.apply(this,arguments);setTimeout(()=>battleFx(be,bh,'skill'),20);return out};fn.__uiWrapped=1;window.skillAttack=fn}if(typeof window.potion==='function'&&!window.potion.__uiWrapped){const base=window.potion;const fn=function(){const before=S.hp;const out=base.apply(this,arguments);setTimeout(()=>battleFx(null,S.hp,'heal',before),20);return out};fn.__uiWrapped=1;window.potion=fn}}

if(typeof window.home==='function'){const baseHome=window.home;window.home=function(){const out=baseHome.apply(this,arguments);requestAnimationFrame(()=>{enhanceHome();decorateScreen()});return out}}
if(typeof window.nav==='function'){const baseNav=window.nav;window.nav=function(){const out=baseNav.apply(this,arguments);decorateNav();return out}}
wrapCombat();decorateScreen();if(q('.profile-hero'))enhanceHome();const main=q('#main');if(main)new MutationObserver(()=>requestAnimationFrame(decorateScreen)).observe(main,{childList:true,subtree:true});document.addEventListener('click',e=>{const spot=e.target.closest?.('.mapSpot');if(spot&&!spot.classList.contains('is-locked'))q('.worldmap')?.classList.add('is-traveling')});
})();
