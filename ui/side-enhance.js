
// ui/side-enhance.js — add Puzzle icon, color icons, slide animation, relocate sliders
(function(){
  function $(s, r=document){ return r.querySelector(s); }
  function $all(s, r=document){ return Array.from(r.querySelectorAll(s)); }

  function ensureSide(){
    let side = $('#sideMenu') || $('.side-menu');
    if (!side){
      side = document.createElement('aside');
      side.id = 'sideMenu';
      document.body.appendChild(side);
    }
    side.classList.add('kp-side');
    // if empty or missing items, (re)build minimal items list
    if (!side.querySelector('[data-item="game"]')){
      const frag = document.createDocumentFragment();
      const items = [
        {key:'game', label:'Game', ico:'🧩', cls:'game'},
        {key:'settings', label:'Settings', ico:'⚙️', cls:'settings'},
        {key:'leader', label:'Leaderboard', ico:'🏆', cls:'leader'},
        {key:'shop', label:'Shop', ico:'🛍️', cls:'shop'}
      ];
      items.forEach(it=>{
        const div = document.createElement('div');
        div.className = 'item'; div.setAttribute('data-item', it.key);
        div.innerHTML = `<div class="kp-ico ${it.cls}">${it.ico}</div><div class="label">${it.label}</div>`;
        frag.appendChild(div);
      });
      // insert at top
      side.innerHTML = '';
      side.appendChild(frag);
    }
    return side;
  }

  function setupToggle(side){
    // try to hook existing hamburger/menu button
    let btn = $('#menuToggle') || $('#menuBtn') || $('.hamburger') || $('.menu-btn');
    if (!btn){
      // create a minimal floating toggle
      btn = document.createElement('button');
      btn.id = 'menuToggle';
      btn.textContent = '☰';
      Object.assign(btn.style, {position:'fixed', top:'10px', left:'10px', zIndex:10000, border:'0', padding:'8px 10px', borderRadius:'10px', background:'rgba(0,0,0,.65)', color:'#fff', cursor:'pointer'});
      document.body.appendChild(btn);
    }
    btn.addEventListener('click', ()=> side.classList.toggle('open'));
  }

  function relocateSliders(){
    // Find sliders in main menu and move them to settings panel
    const main = $('#mainMenu') || $('#menu') || document.body;
    const settings = $('#settingsPanel') || $('[data-panel="settings"]') || $('#settings') || (function(){
      // create simple settings panel if not exists
      const p = document.createElement('div'); p.id='settingsPanel';
      Object.assign(p.style, {position:'fixed', right:'20px', bottom:'20px', background:'rgba(255,255,255,.9)', padding:'12px', borderRadius:'12px', boxShadow:'0 6px 18px rgba(0,0,0,.18)', zIndex:9999});
      p.innerHTML = '<div style="font-weight:800; margin-bottom:8px;">Settings</div>';
      document.body.appendChild(p);
      return p;
    })();

    const candidates = $all('input[type="range"]', main);
    candidates.forEach(sl=>{
      // move only once
      if (sl.dataset.kpMoved) return;
      sl.dataset.kpMoved = '1';
      const wrap = document.createElement('div');
      wrap.style.margin = '6px 0';
      const label = document.createElement('label');
      label.style.display='block'; label.style.fontWeight='700'; label.style.marginBottom='4px';
      label.textContent = (sl.id || sl.name || 'Control').replace(/[-_]/g,' ').toUpperCase();
      settings.appendChild(label);
      wrap.appendChild(sl);
      settings.appendChild(wrap);
    });
  }

  function bindNav(side){
    side.addEventListener('click', (e)=>{
      const item = e.target.closest('.item'); if (!item) return;
      const key = item.getAttribute('data-item');
      if (key==='settings'){
        // toggle settings panel visibility
        const p = $('#settingsPanel');
        if (p){ p.style.display = (p.style.display==='none'?'block':'none'); }
      }
      // Close menu on selection (mobile friendly)
      side.classList.remove('open');
    });
  }

  function init(){
    const side = ensureSide();
    setupToggle(side);
    relocateSliders();
    bindNav(side);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


// --- Fix: remove duplicate/legacy side menus & extra hamburgers ---
(function(){
  function removeDupes(){
    const ours = document.getElementById('sideMenu');
    document.querySelectorAll('.side-menu, .menu-side, #leftMenu, #rightMenu, #drawerMenu').forEach(el=>{
      if (el !== ours) el.remove();
    });
    // keep only our toggle
    const keep = document.getElementById('menuToggle');
    const toggles = Array.from(document.querySelectorAll('.menu-btn, .hamburger, #menuBtn')).filter(el=> el !== keep);
    toggles.forEach(el=> el.remove());
    // remove mini hamburger inside cards
    document.querySelectorAll('.hamburger-mini, .card-hamburger').forEach(el=> el.remove());
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', removeDupes);
  else removeDupes();
})();
