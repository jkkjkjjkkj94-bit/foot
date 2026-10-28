(() => {
  const ICONS = {
    woodFloor:'🪵', stoneFloor:'🪨', wall:'🧱', door:'🚪', fence:'🪚', torch:'🔥', chest:'📦',
    workbench:'🛠️', forge:'⚒️', campfire:'🔥', alchemy:'⚗️', bed:'🛏️', table:'🪑', chair:'🪑',
    bookshelf:'📚', rug:'🧶', banner:'🚩', trophy:'🏆', property:'🏠'
  };

  const style = document.createElement('style');
  style.textContent = `
    #buildPanel{display:none!important}
    .craft-open-btn{grid-column:1/-1;background:linear-gradient(#72552c,#49351f)!important;border-color:#a98343!important;color:#f8e8b6!important;font-weight:700}
    .craft-overlay{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.68);backdrop-filter:blur(2px)}
    .craft-overlay.open{display:flex}
    .craft-window{width:min(820px,92vw);max-height:82vh;display:flex;flex-direction:column;background:#c6c6c6;border:4px solid #232323;box-shadow:inset 3px 3px #fff,inset -3px -3px #555,0 18px 60px #000b;color:#222;font-family:Arial,sans-serif}
    .craft-title{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#8b8b8b;border-bottom:3px solid #3d3d3d;color:#fff;text-shadow:1px 1px #222;font-weight:800}
    .craft-close{width:38px;height:34px;border:2px solid #2c2c2c;background:#bcbcbc;box-shadow:inset 2px 2px #fff,inset -2px -2px #555;cursor:pointer;font-size:20px}
    .craft-resources{padding:9px 12px;background:#dedede;border-bottom:2px solid #777;font-weight:700;color:#2c2c2c}
    .craft-scroll{overflow:auto;padding:14px;background:#b7b7b7}
    .craft-grid{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(105px,1fr))!important;gap:8px!important}
    .craft-grid button{min-height:104px!important;padding:8px!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#8b8b8b!important;border:2px solid #373737!important;border-radius:0!important;box-shadow:inset 2px 2px #d8d8d8,inset -2px -2px #555!important;color:#fff!important;font:700 12px Arial,sans-serif!important;text-shadow:1px 1px #222;cursor:pointer}
    .craft-grid button:hover{background:#a2a2a2!important;filter:none!important}
    .craft-grid button:active{box-shadow:inset 2px 2px #555,inset -2px -2px #ddd!important;transform:none!important}
    .craft-grid button .craft-icon{font-size:30px;line-height:1;filter:drop-shadow(1px 2px 0 #333)}
    .craft-grid button small{color:#f0df9a!important;font-size:10px!important;text-align:center;line-height:1.15}
    .craft-help{padding:9px 12px;background:#d2d2d2;border-top:2px solid #777;color:#343434;font-size:11px}
    @media(max-width:640px){.craft-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important}.craft-grid button{min-height:88px!important;font-size:10px!important}.craft-window{max-height:88vh}.craft-scroll{padding:8px}}
  `;
  document.head.appendChild(style);

  function init() {
    const buildPanel = document.getElementById('buildPanel');
    const grid = buildPanel?.querySelector('.build-grid');
    const status = document.getElementById('buildStatus');
    const buttonArea = document.querySelector('.sidebar .buttons-grid');
    if (!buildPanel || !grid || !status || !buttonArea) return false;
    if (document.getElementById('craftOverlay')) return true;

    const overlay = document.createElement('div');
    overlay.id = 'craftOverlay';
    overlay.className = 'craft-overlay';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = `
      <div class="craft-window" role="dialog" aria-modal="true" aria-label="Crafting e construção">
        <div class="craft-title"><span>CRAFTING / CONSTRUÇÃO</span><button class="craft-close" type="button" aria-label="Fechar">×</button></div>
        <div class="craft-resources"></div>
        <div class="craft-scroll"></div>
        <div class="craft-help">Escolha um item. A janela fecha e você posiciona o objeto no mapa. Pressione B para abrir novamente.</div>
      </div>`;
    document.body.appendChild(overlay);

    const resources = overlay.querySelector('.craft-resources');
    const scroll = overlay.querySelector('.craft-scroll');
    const closeBtn = overlay.querySelector('.craft-close');
    grid.classList.add('craft-grid');
    scroll.appendChild(grid);

    [...grid.querySelectorAll('button[data-buildtype]')].forEach(btn => {
      const type = btn.dataset.buildtype;
      if (!btn.querySelector('.craft-icon')) {
        const icon = document.createElement('span');
        icon.className = 'craft-icon';
        icon.textContent = ICONS[type] || '⬜';
        btn.prepend(icon);
      }
      btn.addEventListener('click', () => setTimeout(close, 0));
    });

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'craft-open-btn';
    openBtn.textContent = 'Crafting / Construção (B)';
    buttonArea.prepend(openBtn);

    function syncStatus(){ resources.textContent = status.textContent || 'Recursos'; }
    const observer = new MutationObserver(syncStatus);
    observer.observe(status,{childList:true,subtree:true,characterData:true});
    syncStatus();

    function open(){
      syncStatus();
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden','false');
      closeBtn.focus();
    }
    function close(){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden','true');
      openBtn.focus();
    }
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if(e.target === overlay) close(); });

    window.addEventListener('keydown', e => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key.toLowerCase() === 'b') {
        if (!document.getElementById('gameScreen')?.classList.contains('active')) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        overlay.classList.contains('open') ? close() : open();
      }
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    }, true);

    const oldToggle = document.getElementById('buildToggle');
    if (oldToggle) oldToggle.addEventListener('click', open);
    return true;
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries++;
    if (init() || tries > 100) clearInterval(timer);
  }, 100);
})();
