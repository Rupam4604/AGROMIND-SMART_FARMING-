/* ═══════════════════════════════════════════════════
   sensors.js — LIVE FIREBASE SENSOR DATA
   Reads real sensor values from Firebase Realtime DB
   pushed by the ESP32 (see /sensors/ path).
═══════════════════════════════════════════════════ */

let firebaseSensorListenerActive = false;

function startSensorSim() {
  // Kept the same function name so app.js doesn't need changes.
  // Now starts a live Firebase listener instead of random simulation.
  if (firebaseSensorListenerActive) return;
  firebaseSensorListenerActive = true;

  db.ref('sensors').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    updateSensorsFromFirebase(data);
  }, (err) => {
    console.error('Firebase sensors listener error:', err);
  });
}

function updateSensorsFromFirebase(data) {
  const moist   = data.soil_moisture   !== undefined ? Number(data.soil_moisture).toFixed(1)   : '--';
  const temp    = data.temperature     !== undefined ? Number(data.temperature).toFixed(1)      : '--';
  const hum     = data.humidity        !== undefined ? Number(data.humidity).toFixed(1)         : '--';
  const water   = data.water_level     !== undefined ? Number(data.water_level).toFixed(1)      : '--';
  const light   = data.light           !== undefined ? Number(data.light).toFixed(0)            : '--';

  // ── Indoor Sensors card (new section) ──
  setEl('val-moisture',         moist + '%');
  setEl('val-indoor-temp',      temp + '°C');
  setEl('val-indoor-humidity',  hum + '%');
  setEl('val-water-level',      water + '%');
  setEl('val-grow-light-hrs',   light + ' lux');

  // Status pills — green if data present, dim if missing
  setPill('indoor-moist-pill', moist !== '--', moist + '%');
  setPill('indoor-temp-pill',  temp  !== '--', temp + '°C');
  setPill('indoor-hum-pill',   hum   !== '--', hum + '%');
  setPill('indoor-water-pill', water !== '--', water + '%');
  setPill('indoor-grow-pill',  light !== '--', light);

  // ── Crop threshold check (moisture-based auto irrigation alert) ──
  if (moist !== '--' && typeof cropConfig !== 'undefined' && cropConfig[selectedCrop]) {
    const cfg = cropConfig[selectedCrop];
    const moistVal = parseFloat(moist);

    const mb = document.getElementById('moist-badge');
    if (mb) {
      mb.className = 'sc-badge ' + (
        moistVal < cfg.min ? 'err' :
        moistVal > cfg.max ? 'warn' : 'live'
      );
    }

    if (moistVal < cfg.min) {
      addNotif('💧', 'Low Soil Moisture',
        `Soil moisture ${moist}% is below ${cfg.min}% threshold for ${cfg.label}.`, 'warn');
    }
  }

  // ── Push to indoor historical charts ──
  const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  pushIndoorChart(
    moist !== '--' ? parseFloat(moist) : null,
    temp  !== '--' ? parseFloat(temp)  : null,
    hum   !== '--' ? parseFloat(hum)   : null,
    now
  );

  // ── Device status pills (top dashboard row) — synced separately via controls.js listener ──
}

function setPill(id, hasData, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = hasData ? label : '--';
  el.className = 'status-pill ' + (hasData ? 'on' : 'off');
}