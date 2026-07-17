/* ═══════════════════════════════════════════════════
   ui.js — RESULTS, HISTORY, NOTIFICATIONS, TOASTS
═══════════════════════════════════════════════════ */

/* ── Show Analysis Results ── */
function showResults(topK, imgSrc) {
  const top       = topK[0];
  const pct       = (top.prob * 100).toFixed(1);
  const label     = top.name;
  const isHealthy = label.toLowerCase().includes('healthy');
  const isUnknown = label.toLowerCase().includes('background') || top.prob < 0.30;

  // Hero card
  const hero = document.getElementById('result-hero');
  hero.className = 'card result-hero ' + (isUnknown ? 'rh-unknown' : isHealthy ? 'rh-healthy' : 'rh-diseased');

  const tag = document.getElementById('result-tag');
  tag.className   = 'result-tag ' + (isUnknown ? 'tag-unknown' : isHealthy ? 'tag-healthy' : 'tag-diseased');
  tag.textContent = isUnknown ? '◌ Low Confidence' : isHealthy ? '✓ Healthy' : '⚠ Disease Detected';

  const parts = label.split('—').map(s => s.trim());
  setEl('result-dname', parts[1] || parts[0]);
  setEl('result-plant', parts.length > 1 ? parts[0] : '');

  // Confidence ring animation
  const circ = 2 * Math.PI * 33;
  const ring  = document.getElementById('ring-fill');
  ring.style.stroke           = isHealthy ? '#2E7D32' : isUnknown ? '#1565C0' : '#C62828';
  ring.style.strokeDasharray  = circ;
  ring.style.strokeDashoffset = circ;
  setTimeout(() => { ring.style.strokeDashoffset = circ * (1 - top.prob); }, 60);
  setEl('ring-pct',  pct + '%');
  setEl('conf-val',  pct + '%');

  // Top-5 probability bars
  const bl = document.getElementById('bar-list');
  bl.innerHTML = topK.map((item, i) => `
    <div class="bar-row">
      <div class="bar-meta">
        <span class="bar-name">${item.name}</span>
        <span class="bar-pct">${(item.prob * 100).toFixed(1)}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${i === 0 ? 'rank-1' : 'rank-other'}" style="width:0%" data-w="${item.prob * 100}%"></div>
      </div>
    </div>`).join('');
  setTimeout(() => {
    document.querySelectorAll('.bar-fill[data-w]').forEach(el => el.style.width = el.dataset.w);
  }, 80);

  // Disease info panel
  const key  = findDiseaseKey(label);
  const info = (isHealthy ? DIS_DB.healthy : DIS_DB[key]) || DIS_DB._default;
  setEl('info-panel-title', isHealthy ? '✅ Plant Health' : '🔍 ' + (parts[1] || parts[0]));
  document.getElementById('info-grid').innerHTML = `
    <div class="info-card"><div class="ic-icon">📋</div><div class="ic-label">Description</div><div class="ic-text">${info.desc}</div></div>
    <div class="info-card"><div class="ic-icon">💊</div><div class="ic-label">Treatment</div><div class="ic-text">${info.treat}</div></div>
    <div class="info-card"><div class="ic-icon">🛡️</div><div class="ic-label">Prevention</div><div class="ic-text">${info.prev}</div></div>
    <div class="info-card"><div class="ic-icon">⚠️</div><div class="ic-label">Severity</div><div class="ic-text">Risk level: <span class="sev-chip sev-${info.sev}">${info.sev.toUpperCase()}</span></div></div>`;

  document.getElementById('results-empty').style.display = 'none';
  document.getElementById('result-panel').classList.add('show');

  // Save to history
  addToHistory({ label, pct, imgSrc, isHealthy, ts: Date.now() });

  // Alert notification if disease detected
  if (!isHealthy && !isUnknown) {
    addNotif('🔴', 'Disease Detected — ' + (label.split('—')[1]?.trim() || label),
      `Confidence: ${pct}%. Please take immediate action.`, 'error');
  }
}

function findDiseaseKey(label) {
  const l = label.toLowerCase();
  for (const k of Object.keys(DIS_DB)) if (l.includes(k)) return k;
  return '_default';
}

/* ── Scan History ── */
function addToHistory(entry) {
  scanHistory.unshift(entry);
  if (scanHistory.length > 30) scanHistory.pop();
  localStorage.setItem('agromind_history', JSON.stringify(scanHistory));
  renderHistory();
}

function renderHistory() {
  const grid = document.getElementById('history-grid');
  if (!scanHistory.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text3)">
      <div style="font-size:48px;opacity:.2;margin-bottom:12px">📂</div>
      <div>No scans yet — analyse your first leaf on the Disease Detection page.</div>
    </div>`;
    return;
  }
  grid.innerHTML = scanHistory.map(h => {
    const parts = h.label.split('—').map(s => s.trim());
    const dt    = new Date(h.ts).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    return `<div class="hc">
      <img class="hc-img" src="${h.imgSrc}" alt="${h.label}" loading="lazy">
      <div class="hc-body">
        <span class="hc-badge ${h.isHealthy ? 'healthy' : 'diseased'}">${h.isHealthy ? '✓ Healthy' : '⚠ Disease'}</span>
        <div class="hc-name">${parts[1] || parts[0]}</div>
        <div class="hc-meta">${parts.length > 1 ? parts[0] + ' · ' : ''}${dt} <span class="hc-conf">${h.pct}%</span></div>
      </div>
    </div>`;
  }).join('');
}

function clearHistory() {
  scanHistory = [];
  localStorage.removeItem('agromind_history');
  renderHistory();
  toast('History cleared', 'info');
}

/* ── Notifications ── */
let notificationsEnabled = true;

function toggleNotifications() {
  notificationsEnabled = !notificationsEnabled;
  const toggle = document.getElementById('notif-toggle');
  if (toggle) toggle.classList.toggle('on', notificationsEnabled);
  toast(notificationsEnabled ? '🔔 Notifications enabled' : '🔕 Notifications disabled', 'info');
}

function addNotif(icon, title, desc, type) {
  if (!notificationsEnabled) return;
  const list  = document.getElementById('notif-list');
  const bgMap = {
    warn:    'rgba(230,81,0,.12)',
    error:   'rgba(211,47,47,.12)',
    info:    'rgba(2,136,209,.12)',
    success: 'rgba(45,106,79,.12)',
  };
  const el = document.createElement('div');
  el.className = 'notif-item unread';
  el.onclick   = () => markRead(el);
  el.innerHTML = `
    <div class="ni-icon" style="background:${bgMap[type] || bgMap.info}">${icon}</div>
    <div class="ni-body">
      <div class="ni-title">${title}</div>
      <div class="ni-desc">${desc}</div>
      <div class="ni-time">Just now</div>
    </div>`;
  list.prepend(el);
  notifCount++;
  document.getElementById('notif-btn').setAttribute('data-count', notifCount);
  setEl('sidebar-notif-count', notifCount);
}

function markRead(el) {
  el.classList.remove('unread');
  notifCount = Math.max(0, notifCount - 1);
  document.getElementById('notif-btn').setAttribute('data-count', notifCount);
  setEl('sidebar-notif-count', notifCount || '');
}

function clearNotifs() {
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  notifCount = 0;
  document.getElementById('notif-btn').setAttribute('data-count', 0);
  setEl('sidebar-notif-count', '');
}

function toast(msg, type = 'info', dur = 3200) {
  const icons = { success: '✅', error: '❌', warn: '⚠️', info: 'ℹ️' };
  const el    = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <span style="flex:1">${msg}</span>
    <span class="toast-close" onclick="this.parentElement.remove()">✕</span>`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 350);
  }, dur);
}

/* ── Model Status UI (sidebar + banner) ── */
function setModelUI(state, label) {
  // Sidebar pill
  const pill = document.getElementById('sms-pill');
  const sp   = document.getElementById('settings-model-pill');
  const clsMap = { loading: 'loading', ready: 'ready', simulate: 'ready', error: 'error' };
  const cls = clsMap[state] || 'loading';
  if (pill) { pill.className = 'sms-pill ' + cls; setEl('sms-label', label); }
  if (sp)   { sp.className = 'sms-pill ' + cls; setEl('settings-model-label', label); }

  // Pill 2 on disease page
  const p2 = document.getElementById('sms-pill2');
  if (p2) { p2.className = 'sms-pill ' + cls; setEl('sms-label2', label); }

  // Banner
  const banner = document.getElementById('model-banner');
  const icon   = document.getElementById('msb-icon');
  const title  = document.getElementById('msb-title');
  const sub    = document.getElementById('msb-sub');
  if (!banner) return;
  banner.className = 'model-status-banner ' + state;
  const iconMap  = { loading: '⏳', ready: '✅', simulate: '⚡', error: '⚠️' };
  const titleMap = {
    loading:  'Loading AgroMind AI Model…',
    ready:    '✅ AgroMind Model Ready — AI is active',
    simulate: '⚡ Demo Mode — AI simulation active',
    error:    '⚠️ Model not found — running demo mode',
  };
  const subMap = {
    loading:  'MobileNetV2 · 39 crop disease classes · loading from model/tfjs_model/',
    ready:    'MobileNetV2 · 160×160 px · 39 PlantVillage classes · 100% in-browser inference',
    simulate: 'Drop a leaf photo to test the UI — convert AgroMind.keras to enable real inference',
    error:    'Run convert_model.py to generate model/tfjs_model/ — see README for instructions',
  };
  if (icon)  icon.textContent  = iconMap[state]  || '⏳';
  if (title) title.textContent = titleMap[state] || label;
  if (sub)   sub.textContent   = subMap[state]   || '';
}
