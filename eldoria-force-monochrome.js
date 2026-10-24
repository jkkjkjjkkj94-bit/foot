(()=>{
const ID='eldoria-force-monochrome-v1';
if(document.getElementById(ID))return;
const style=document.createElement('style');
style.id=ID;
style.textContent=`
:root{
 --bg:#080808!important;--panel:#121212!important;--line:#343434!important;--text:#f1f1f1!important;--muted:#9f9f9f!important;
 --gold:#bdbdbd!important;--red:#777!important;
 --eld-blue:#9b9b9b!important;--eld-cyan:#d5d5d5!important;--eld-gold:#c4c4c4!important;--eld-yellow:#dedede!important;--eld-orange:#8e8e8e!important;
 --ui-blue:#9c9c9c!important;--ui-cyan:#d6d6d6!important;--ui-gold:#c8c8c8!important;--ui-orange:#8e8e8e!important;
 --hc-red:#707070!important;--hc-red2:#999!important;--hc-orange:#aaa!important;--hc-gold:#c8c8c8!important;--hc-gold2:#ededed!important;
}
html,body{background:#050505!important;color:#eee!important}
body:before,body:after{filter:grayscale(1)!important;opacity:.22!important}
.site{background:linear-gradient(180deg,#0c0c0c,#060606 62%,#030303)!important;box-shadow:0 0 0 1px #222,0 28px 80px #000!important}
.hc-topbar{background:linear-gradient(180deg,#1a1a1a,#080808)!important;border-bottom-color:#343434!important}
.hc-brand-mark{background:radial-gradient(circle at 35% 28%,#3a3a3a,#0b0b0b 70%)!important;border-color:#5c5c5c!important;color:#e5e5e5!important;box-shadow:none!important}
.hc-brand-copy b{color:#f0f0f0!important}.hc-brand-copy small{color:#888!important}
.hc-nav button{color:#aaa!important}.hc-nav button:hover,.hc-nav button.is-current{color:#fff!important;background:linear-gradient(180deg,#333,#171717)!important;box-shadow:inset 0 -2px #bdbdbd!important}
.hc-server,.hc-online small{color:#888!important}.hc-server i{background:#c8c8c8!important;box-shadow:0 0 10px #888!important}.hc-online b{color:#d7d7d7!important}
.banner{border-bottom-color:#353535!important;filter:grayscale(.92) saturate(.12) contrast(1.03)!important;box-shadow:inset 0 -170px 120px rgba(0,0,0,.9),0 16px 34px #000!important}
.banner:before{background:linear-gradient(90deg,rgba(5,5,5,.96),rgba(20,20,20,.68) 35%,rgba(8,8,8,.2) 64%,rgba(5,5,5,.62))!important}.banner:after{background:linear-gradient(0deg,#050505,rgba(5,5,5,.95) 8%,transparent 58%)!important}
.hc-kicker,.hc-logo-text span{color:#aaa!important}.hc-rune{background:radial-gradient(circle,#353535,#0b0b0b 72%)!important;border-color:#666!important;color:#e3e3e3!important;box-shadow:0 0 0 6px rgba(255,255,255,.035)!important;text-shadow:none!important}.hc-logo-text h1{color:#f0f0f0!important;text-shadow:0 3px 12px #000!important}.hc-hero-copy>p:not(.hc-kicker){color:#b5b5b5!important}
.hc-play,.btn.gold,.training-card button,.shopItem>button,.ceo-btn.primary{background:linear-gradient(180deg,#e2e2e2,#a7a7a7 58%,#777)!important;border-color:#eee!important;color:#070707!important;box-shadow:0 8px 20px #0008!important}.hc-play:hover,.btn.gold:hover,.training-card button:hover,.shopItem>button:hover{background:linear-gradient(180deg,#f2f2f2,#b9b9b9)!important;border-color:#fff!important}
.hc-secondary,.btn,.profile-action,.hc-link{background:linear-gradient(180deg,#262626,#111)!important;border-color:#444!important;color:#dedede!important}.hc-secondary:hover,.btn:hover,.profile-action:hover,.hc-link:hover{background:linear-gradient(180deg,#353535,#191919)!important;border-color:#777!important}
.titlebar{border-bottom-color:#303030!important}.titlebar h1{background:linear-gradient(90deg,#fff,#cfcfcf 65%,#888)!important;-webkit-background-clip:text!important;background-clip:text!important;color:transparent!important}.titlebar h1:after{background:linear-gradient(90deg,#666,#aaa,#e5e5e5)!important;box-shadow:none!important}
.stat,.panel,.card,.hero,.profile-hero,.character-card,.character-profile-card,.character-profile-info,.training-summary,.training-effects,.training-card,.shopItem,.lootCard,.inventory-equip-slot,.hub-card,.ceo-shell,.ceo-character-card,.hc-home-card{background:linear-gradient(180deg,#181818,#080808)!important;border-color:#303030!important;box-shadow:0 18px 42px #0008!important;color:#eee!important}
.panelHead,.hc-home-card-head{background:linear-gradient(90deg,#232323,#0d0d0d)!important;border-color:#333!important;color:#ddd!important}.panelHead:before{background:linear-gradient(#777,#d0d0d0)!important}.hc-home-card-head b{color:#c9c9c9!important}.hc-home-card-head small{color:#777!important}
.muted,.profile-action small,.hub-card p,.hc-promo-copy p,.hc-news-row time{color:#9f9f9f!important}.tag,.hub-card .hub-meta span{background:#181818!important;border-color:#3c3c3c!important;color:#c6c6c6!important}
.hc-promo{filter:grayscale(.92) saturate(.12)!important}.hc-promo-copy small{color:#aaa!important}.hc-promo-copy h2{color:#eee!important}.hc-news-row{border-bottom-color:#2a2a2a!important}.hc-news-row span{color:#ccc!important}
.hc-table th{color:#999!important;border-bottom-color:#333!important}.hc-table td{color:#c9c9c9!important;border-bottom-color:#292929!important}.hc-table tr:first-child td{color:#eee!important}.hc-event{border-bottom-color:#292929!important}.hc-event span{color:#bcbcbc!important}.hc-event b{color:#dedede!important}.hc-link i{background:#343434!important;color:#ddd!important}
.quest,.item{background:linear-gradient(135deg,#181818,#090909)!important;border-color:#343434!important}.quest:hover,.item:hover{border-color:#666!important}.missionThumb{border-color:#444!important;filter:grayscale(.82) saturate(.15)!important}.worldmap{border-color:#414141!important;filter:grayscale(.78) saturate(.18)!important;box-shadow:0 18px 45px #0009,inset 0 0 45px rgba(255,255,255,.03)!important}.mapSpot{background:#181818!important;border-color:#777!important;color:#e5e5e5!important}.mapSpot.is-current,.mapSpot.boss-ready{border-color:#ddd!important;box-shadow:0 0 0 3px rgba(255,255,255,.07),0 0 22px rgba(255,255,255,.08)!important}
.combat-enemy-hud,.combat-player-hud,.combat-actions-pro,.combat-log-pro{background:linear-gradient(180deg,#191919,#080808)!important;border-color:#343434!important}.combat-enemy-hud,.combat-player-hud{border-top-color:#777!important}.combat-stage-pro{background:radial-gradient(circle at 50% 38%,#333,#161616 44%,#070707 80%)!important;border-color:#454545!important}.combat-monster-frame{background:linear-gradient(135deg,#555,#111 56%,#888)!important}.combat-action-btn.art{background:linear-gradient(145deg,#181818,#090909)!important;border-color:#404040!important}.combat-action-btn.art:hover:not(:disabled){border-color:#bbb!important;box-shadow:0 10px 24px #0009!important}.combat-section-kicker,.combat-action-copy small{color:#999!important}.combat-action-copy b{color:#eee!important}.combat-action-cost,.combat-action-badge{color:#ddd!important}
.bar,.combat-meter{background:#080808!important;border-color:#303030!important}.bar i,.combat-meter>i,.combat-meter.mana>i,.bar.hp i,.combat-meter.hp>i{background:linear-gradient(90deg,#666,#cfcfcf)!important;box-shadow:none!important}
.profile-action:before,.profile-action:nth-child(3n+2):before,.profile-action:nth-child(3n):before,.hub-card:before,.hub-card.gold:before,.hub-card.orange:before{background:#aaa!important}.hub-label{color:#999!important}.hub-objective{background:linear-gradient(90deg,rgba(255,255,255,.04),rgba(255,255,255,.01))!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)!important}.hub-region-icon{background:radial-gradient(circle at 35% 25%,#333,#111 70%)!important}
.ceo-tab{background:#151515!important;border-color:#333!important;color:#aaa!important}.ceo-tab.active,.ceo-tab:hover{background:linear-gradient(135deg,#333,#171717)!important;border-color:#666!important;color:#eee!important}
.rarity-comum,.rarity-raro,.rarity-epico,.rarity-lendario{--rarity:#b0b0b0!important}
[style*="#d79a2b"],[style*="#ffc247"],[style*="#f0d77a"],[style*="#ff7a1a"],[style*="#b77b1f"]{color:#d0d0d0!important;border-color:#555!important}
`;
document.head.appendChild(style);
const vars={
 '--gold':'#bdbdbd','--eld-gold':'#c4c4c4','--eld-yellow':'#dedede','--eld-orange':'#8e8e8e','--ui-gold':'#c8c8c8','--ui-orange':'#8e8e8e','--hc-gold':'#c8c8c8','--hc-gold2':'#ededed','--hc-orange':'#aaa'
};
Object.entries(vars).forEach(([k,v])=>document.documentElement.style.setProperty(k,v,'important'));
})();
