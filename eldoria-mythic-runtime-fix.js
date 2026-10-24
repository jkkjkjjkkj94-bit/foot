(()=>{
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pct=(v,max)=>max?Math.max(0,Math.min(100,(Number(v)||0)/(Number(max)||1)*100)):0;
const char=()=>window.ELDORIA_CHARACTERS?.selected?.()||null;
const atk=()=>typeof effectiveAtk==='function'?effectiveAtk():Number(S.atk||0);
const def=()=>typeof effectiveDef==='function'?effectiveDef():Number(S.def||0);
function avatar(){const c=char();if(c?.image)return `<img src="${esc(c.image)}" alt="${esc(c.name)}">`;return `<span>${CLASSES[S.className]?.icon||'✦'}</span>`}
function monster(){if(typeof enemy==='undefined'||!enemy)return '<div class="monsterEmoji">?</div>';if(enemy.name==='Slime Sombrio')return `<img src="slime-sombrio.png" alt="${esc(enemy.name)}">`;return `<div class="monsterEmoji">${esc(enemy.icon||'👹')}</div>`}
window.battle=function(){
 if(typeof enemy==='undefined'||!enemy)return typeof home==='function'?home():null;
 const skills=typeof skillsForPlayer==='function'?skillsForPlayer():(typeof ELDORIA_SKILLS!=='undefined'?(ELDORIA_SKILLS[S.className]||[]).filter(s=>S.level>=s[1]):[]);
 shell('Combate',`<section class="mx-battle"><div class="mx-enemy-title"><small>${enemy.boss?'CHEFE REGIONAL':'CRIATURA HOSTIL'}</small><h2>${esc(enemy.name)}</h2><p>Nível ${enemy.level} · Defesa ${enemy.def||0}</p><div class="mx-enemy-bar"><i style="width:${pct(enemy.hp,enemy.maxHp)}%"></i></div></div><div class="mx-enemy-stage">${monster()}</div><aside class="mx-player-hud"><div class="mx-player-line"><div class="mx-player-mini">${avatar()}</div><div class="mx-player-copy"><b>${esc(char()?.name||S.name)}</b><small>${esc(S.className)} · Nível ${S.level}</small></div></div><div style="margin-top:10px"><div class="mx-vital hp"><label>HP</label><div class="mx-track"><i style="width:${pct(S.hp,S.maxHp)}%"></i></div><b>${S.hp}/${S.maxHp}</b></div><div class="mx-vital mana"><label>MP</label><div class="mx-track"><i style="width:${pct(S.mana,S.maxMana)}%"></i></div><b>${S.mana}/${S.maxMana}</b></div></div><div class="mx-player-stats"><span>ATQ ${atk()}</span><span>DEF ${def()}</span></div></aside><div class="mx-actions"><button class="mx-action" onclick="attack(false)"><span class="ico">⚔</span><b>Atacar</b><small>Básico</small></button>${skills.map((s,i)=>`<button class="mx-action" onclick="skillAttack(${i})"><span class="ico">${s[4]}</span><b>${esc(s[0])}</b><small>${s[2]} mana</small></button>`).join('')}<button class="mx-action" onclick="potion()"><span class="ico">✚</span><b>Poção</b><small>Recuperar</small></button><button class="mx-action" onclick="home()"><span class="ico">↩</span><b>Fugir</b><small>Retornar</small></button></div><aside class="mx-loot-preview"><b>Recompensas possíveis</b><span>Experiência, moedas e chance de equipamento.</span></aside></section>`,'A arena é o foco da tela. Escolha ataques e habilidades no hotbar inferior.');
};
})();
