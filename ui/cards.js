
// ui/cards.js — upgrade option buttons to pretty cards (auto + safe)
(function(){
  function up(el){
    if (!el) return;
    // add base class
    if (!el.classList.contains('game-card') && !el.classList.contains('option-btn')){
      el.classList.add('game-card');
    }
    // glow on click
    if (!el.classList.contains('kp-glow')){
      el.classList.add('kp-glow');
      el.addEventListener('click', ()=>{
        el.classList.remove('trigger');
        void el.offsetWidth;
        el.classList.add('trigger');
      });
    }
    // accessibility
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.addEventListener('keydown', (e)=>{
      if (e.key==='Enter' || e.key===' ') el.click();
    });
  }

  function upgradeAll(){
    document.querySelectorAll('#gameArea button, #gameArea .option, #gameArea .answer').forEach(up);
  }

  // initial + future nodes
  if (document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', upgradeAll);
  } else { upgradeAll(); }

  const obs = new MutationObserver((muts)=>{
    for (const m of muts){
      m.addedNodes && m.addedNodes.forEach(n=>{
        if (!(n instanceof HTMLElement)) return;
        if (n.matches && (n.matches('#gameArea button, #gameArea .option, #gameArea .answer'))) up(n);
        n.querySelectorAll && n.querySelectorAll('#gameArea button, #gameArea .option, #gameArea .answer').forEach(up);
      });
    }
  });
  obs.observe(document.body, {childList:true, subtree:true});
})();
