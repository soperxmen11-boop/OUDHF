
// ui/hud.js — injects a top HUD bar (Stars / Score / Level + Pause/Mute)
(function(){
  function $(s, r=document){ return r.querySelector(s); }

  function ensureHud(){
    if ($('#kp-hud')) return;
    const bar = document.createElement('div');
    bar.id = 'kp-hud';
    bar.innerHTML = `
      <div class="group">
        <div class="pill"><span>⭐ Stars</span><span class="val" id="kpStars">0</span></div>
        <div class="pill"><span>🏆 Score</span><span class="val" id="kpScore">0</span></div>
        <div class="pill"><span>📶 Level</span><span class="val" id="kpLevel">1</span></div>
      </div>
      <div class="group">
        <button class="kp-icon" id="kpPause" title="Pause/Resume">⏯️</button>
        <button class="kp-icon" id="kpMute" title="Mute/Unmute Music">🔊</button>
      </div>
    `;
    document.body.appendChild(bar);

    // Try to sync with existing counters if present
    const starsEl = $('#stars'); const scoreEl = $('#score'); const levelEl = $('#level');
    if (starsEl){ $('#kpStars').textContent = (starsEl.textContent.match(/\d+/)||[0])[0]; }
    if (scoreEl){ $('#kpScore').textContent = (scoreEl.textContent.match(/\d+/)||[0])[0]; }
    if (levelEl){ $('#kpLevel').textContent = (levelEl.textContent.match(/\d+/)||[1])[0]; }

    // Buttons
    $('#kpMute').addEventListener('click', ()=>{
      if (window.KPAudio && KPAudio.setMuted){
        const muted = localStorage.getItem('kidsMusicMuted') === '1';
        KPAudio.setMuted(!muted);
      } else {
        // fallback: toggle page-level audio elements
        document.querySelectorAll('audio').forEach(a=> a.muted = !a.muted);
      }
    });
    let paused = false;
    $('#kpPause').addEventListener('click', ()=>{
      paused = !paused;
      // Expose a simple event other scripts can listen to
      document.dispatchEvent(new CustomEvent('kp:pause', {detail:{paused}}));
    });
  }

  // public setters (game can update the HUD)
  function setStars(v){ const el = document.getElementById('kpStars'); if (el) el.textContent = v; }
  function setScore(v){ const el = document.getElementById('kpScore'); if (el) el.textContent = v; }
  function setLevel(v){ const el = document.getElementById('kpLevel'); if (el) el.textContent = v; }

  document.addEventListener('DOMContentLoaded', ensureHud);

  window.KPHud = { setStars, setScore, setLevel };
})();
