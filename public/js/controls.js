/* ═══════════════════════════════════════════════════
   controls.js — DEVICE CONTROLS & CROP SELECTION
   Now synced with Firebase Realtime Database
═══════════════════════════════════════════════════ */

/* ── System Mode (Auto / Manual) ── */
function setMode(mode) {
  sysMode = mode;
  ['auto', 'manual'].forEach(m => {
    document.getElementById('tab-' + m).classList.toggle('active', m === mode);
  });
  const isManual = mode === 'manual';
  ['pump', 'fan', 'light','humidifier'].forEach(d => {
    const b = document.getElementById('btn-' + d);
    if (b) b.disabled = !isManual;
  });
  setEl('mode-desc', isManual
    ? '✋ Manual mode — you control each device'
    : '🤖 Auto mode — devices managed by sensor thresholds');
  setEl('mode-label-dash', isManual ? 'Manual mode' : 'Auto mode');
  toast(isManual ? 'Switched to Manual mode' : 'Switched to Auto mode', 'info');

  // Sync mode to Firebase
  db.ref('config/auto_mode').set(mode === 'auto')
    .catch(err => console.error('Firebase mode sync error:', err));
}

/* ── Toggle a Device (manual only) ── */
function toggleDevice(dev) {
  if (sysMode !== 'manual') return;
  devices[dev] = !devices[dev];
  refreshDeviceUI();
  toast(
    `${dev.charAt(0).toUpperCase() + dev.slice(1)} turned ${devices[dev] ? 'ON' : 'OFF'}`,
    devices[dev] ? 'success' : 'info'
  );

  // Sync device state to Firebase — ESP32 listens to this path
  db.ref('devices/' + dev).set(devices[dev])
    .then(() => console.log(`✅ ${dev} synced to Firebase: ${devices[dev]}`))
    .catch(err => console.error('Firebase device sync error:', err));
}

/* ── Sync All Device UI ── */
function refreshDeviceUI() {
  [['pump'], ['fan'], ['light'],['humidifier']].forEach(([d]) => {
    const on = devices[d];
    // Dashboard pills
    const dp = document.getElementById('dash-' + d);
    if (dp) {
      dp.textContent = on ? 'ON' : 'OFF';
      dp.className = 'status-pill ' + (on ? 'on' : 'off');
    }
    // Control card highlight
    const cc = document.getElementById('cc-' + d);
    if (cc) cc.classList.toggle('active-device', on);
    // Button text & state
    const btn = document.getElementById('btn-' + d);
    if (btn) {
      btn.textContent = on ? 'Turn OFF' : 'Turn ON';
      btn.classList.toggle('on', on);
    }
    // Status text
    const st = document.getElementById('cc-' + d + '-status');
    if (st) {
      st.textContent = `Status: ${on ? 'ON' : 'OFF'} · ${sysMode === 'auto' ? 'Auto controlled' : 'Manual'}`;
    }
  });
}

/* ── Listen for Firebase device state changes ──
   This keeps the dashboard in sync if ESP32 or another
   browser tab changes device states (e.g. in Auto mode) */
function listenToFirebaseDevices() {
  db.ref('devices').on('value', (snapshot) => {
    const fbDevices = snapshot.val();
    if (!fbDevices) return;

    let changed = false;
    ['pump', 'fan', 'light', 'humidifier'].forEach(d => {
      if (fbDevices[d] !== undefined && fbDevices[d] !== devices[d]) {
        devices[d] = fbDevices[d];
        changed = true;
      }
    });

    if (changed) refreshDeviceUI();
  }, (err) => console.error('Firebase device listener error:', err));
}

/* ── Crop Selection ── */
function selectCrop(key, el) {
  selectedCrop = key;
  document.querySelectorAll('.crop-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  const cfg = cropConfig[key];
  setEl('crop-detail-name', cfg.label);
  setEl('crop-min',         cfg.min + '%');
  setEl('crop-opt',         cfg.opt + '%');
  setEl('crop-max',         cfg.max + '%');
  setEl('current-crop-dash', cfg.emoji + ' ' + cfg.label);
  setEl('moisture-target',  cfg.min + '–' + cfg.max + '%');
  toast(`${cfg.emoji} ${cfg.label} selected — threshold ${cfg.min}–${cfg.max}%`, 'success');

  // Sync selected crop to Firebase — ESP32 reads this for irrigation thresholds
  db.ref('config/selected_crop').set(key)
    .catch(err => console.error('Firebase crop sync error:', err));
}

/* ── Start listening to Firebase on load ── */
listenToFirebaseDevices();