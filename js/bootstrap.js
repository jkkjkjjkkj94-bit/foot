'use strict';
(async()=>{
  const r=await fetch('js/game.gz.b64');
  if(!r.ok) throw new Error('Falha ao carregar o jogo');
  const b64=(await r.text()).trim();
  const bin=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
  const stream=new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'));
  const source=await new Response(stream).text();
  (0,eval)(source);
})().catch(err=>{
  console.error(err);
  document.body.innerHTML='<pre style="color:white;background:#111;padding:20px">Erro ao carregar Legends of Eldoria: '+err.message+'</pre>';
});
