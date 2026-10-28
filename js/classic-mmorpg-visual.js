'use strict';
(() => {
  const fillMap = new Map(Object.entries({
    '#4b7a47':'#4e8a35','#57904e':'#5f9a3f','#806d42':'#6f7d35','#d6e3d8':'#8ba65f',
    '#315f82':'#1764b5','#3d7398':'#1d76d1','#295470':'#0d4f9e','#6cb8d8':'#74c9f0',
    '#263f2c':'#073c16','#397c42':'#146d24','#2f7139':'#1f7a2b','#4d9450':'#3d9d42',
    '#5a3921':'#4b2d18','#7f674d':'#8d5a30','#9c815d':'#c08a52','#634f3c':'#65401f',
    '#744826':'#85502b','#d6b15b':'#d6af54','#777d7a':'#777a70','#8c928f':'#85887e',
    '#b9a36e':'#b69b5e','#927852':'#9a7448','#6b573f':'#795431','#4b4947':'#4e4a43',
    '#cf6363':'#4fa43e','#cd5959':'#4fa43e','#ffd95c':'#ff3434','#f4efe0':'#7fd65b',
    '#e5cf72':'#e8d64b','#d98fc2':'#d75cb2','#315d34':'#1d5c23','#555c5b':'#59605a',
    '#7b8482':'#838b83','#3c82a9':'#1c78bf','#8b9491':'#949b93','#5c3c25':'#5a341b',
    '#8c6036':'#8a562d','#b98a4f':'#c39759','#4f5353':'#404440','#858987':'#747a73',
    '#9a9d9a':'#979d95','#f0a33b':'#f37a18','#ffe07a':'#ffe16e'
  }));
  const strokeMap = new Map(Object.entries({
    '#ffd95c':'#ff3434','#656b68':'#5b5d57','#a68a4d':'#9f7a2f','#39443d':'#4f5135'
  }));
  const norm = value => typeof value === 'string' ? value.toLowerCase() : value;
  const mapFill = value => fillMap.get(norm(value)) || value;
  const mapStroke = value => strokeMap.get(norm(value)) || value;

  const P = CanvasRenderingContext2D.prototype;
  const fillRect = P.fillRect;
  const fill = P.fill;
  const strokeRect = P.strokeRect;
  const stroke = P.stroke;
  const fillText = P.fillText;
  const drawImage = P.drawImage;

  P.fillRect = function(...args){
    const old = this.fillStyle;
    const mapped = mapFill(old);
    if (mapped !== old) this.fillStyle = mapped;
    fillRect.apply(this,args);
    if (mapped !== old) this.fillStyle = old;
  };
  P.fill = function(...args){
    const old = this.fillStyle;
    const mapped = mapFill(old);
    if (mapped !== old) this.fillStyle = mapped;
    const r = fill.apply(this,args);
    if (mapped !== old) this.fillStyle = old;
    return r;
  };
  P.strokeRect = function(...args){
    const old = this.strokeStyle;
    const mapped = mapStroke(old);
    if (mapped !== old) this.strokeStyle = mapped;
    strokeRect.apply(this,args);
    if (mapped !== old) this.strokeStyle = old;
  };
  P.stroke = function(...args){
    const old = this.strokeStyle;
    const mapped = mapStroke(old);
    if (mapped !== old) this.strokeStyle = mapped;
    const r = stroke.apply(this,args);
    if (mapped !== old) this.strokeStyle = old;
    return r;
  };
  P.drawImage = function(...args){
    this.imageSmoothingEnabled = false;
    return drawImage.apply(this,args);
  };
  P.fillText = function(text,x,y,...rest){
    if (this.canvas && this.canvas.id === 'gameCanvas' && typeof text === 'string' && text.length <= 28) {
      this.save();
      const fs = this.fillStyle;
      const isEnemy = /slime|lobo|aranha|espectro|goblin|boss|guardião/i.test(text);
      if (isEnemy) this.fillStyle = '#68c94f';
      this.strokeStyle = 'rgba(0,0,0,.92)';
      this.lineWidth = 3;
      this.strokeText(text,x,y,...rest);
      fillText.call(this,text,x,y,...rest);
      this.fillStyle = fs;
      this.restore();
      return;
    }
    return fillText.call(this,text,x,y,...rest);
  };

  const applyCanvasLook = () => {
    const c = document.getElementById('gameCanvas');
    if (c) {
      c.style.imageRendering='pixelated';
      c.style.filter='saturate(1.18) contrast(1.08) brightness(.98)';
    }
    const m = document.getElementById('miniMap');
    if (m) m.style.filter='saturate(1.14) contrast(1.05)';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',applyCanvasLook,{once:true});
  else applyCanvasLook();
})();
