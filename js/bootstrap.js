'use strict';
(async()=>{
  const parts=['js/gzparts/p01.txt','js/gzparts/p02.txt','js/gzparts/p03.txt','js/gzparts/p04.txt','js/gzparts/p05.txt'];
  const chunks=await Promise.all(parts.map(async p=>{const r=await fetch(p); if(!r.ok) throw new Error('Falha ao carregar '+p); return (await r.text()).trim();}));
  const bin=Uint8Array.from(atob(chunks.join('')),c=>c.charCodeAt(0));
  const stream=new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'));
  const source=await new Response(stream).text();
  (0,eval)(source);
})().catch(err=>{
  console.error(err);
  document.body.innerHTML='<pre style="color:white;background:#111;padding:20px">Erro ao carregar Legends of Eldoria: '+err.message+'</pre>';
});
