'use strict';
(async()=>{
  const parts=['js/chunks/game-01.part','js/chunks/game-02.part','js/chunks/game-03.part','js/chunks/game-04.part','js/chunks/game-05.part','js/chunks/game-06.part','js/chunks/game-07.part'];
  const texts=await Promise.all(parts.map(p=>fetch(p).then(r=>{if(!r.ok) throw new Error('Falha ao carregar '+p); return r.text();})));
  (0,eval)(texts.join(''));
})().catch(err=>{console.error(err); document.body.innerHTML='<pre style="color:white;background:#111;padding:20px">Erro ao carregar Legends of Eldoria: '+err.message+'</pre>';});
