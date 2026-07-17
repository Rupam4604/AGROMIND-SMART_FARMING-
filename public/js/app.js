/* ═══════════════════════════════════════════════════
   app.js — CORE APP: Boot, Auth, Navigation, Theme
═══════════════════════════════════════════════════ */

let sysMode       = 'auto';
let devices       = { pump: false, fan: false, light: false, humidifier: false };
let selectedCrop  = 'tomato';
let weatherData   = null;
let locationData  = null;
let scanHistory   = JSON.parse(localStorage.getItem('agromind_history') || '[]');
let notifCount    = 3;

/* ── Boot Sequence ── */
window.addEventListener('DOMContentLoaded', async () => {
  const fill = document.getElementById('boot-fill');
  const sub = document.querySelector('.boot-sub');

  if (localStorage.getItem('agromind_dark') === '1') enableDark(true);

  const msgs = {
    0:  'Starting up…',
    10: 'Loading resources…',
    20: 'Initialising AI engine…',
    30: 'Loading TensorFlow.js…',
    40: 'Connecting sensors…',
    50: 'Fetching weather…',
    60: 'Loading AI model…',
    70: 'Calibrating systems…',
    80: 'Preparing dashboard…',
    90: 'Almost ready…',
    100: '✅ Ready!',
  };

  for (let i = 0; i <= 100; i += 10) {
    fill.style.width = i + '%';
    if (sub && msgs[i]) sub.textContent = msgs[i];
    await sleep(300);
  }

  await sleep(500);

  const boot = document.getElementById('boot-screen');
  boot.style.transition = 'opacity .6s';
  boot.style.opacity = '0';
  await sleep(600);
  boot.style.display = 'none';

  updateClock();
  setInterval(updateClock, 1000);
  renderHistory();
  autoLoadModel();

  // Test Firebase connection
  db.ref('test').set({ message: 'Hello from AgroMind', time: Date.now() })
    .then(() => console.log('✅ Firebase connected!'))
    .catch(err => console.error('❌ Firebase error:', err));
});

/* ── Auth ── */
async function doLogin() {
  const email = document.getElementById('li-email').value;
  const password = document.getElementById('li-pass').value;
  const correctEmail = 'farmer@agromind.ai';
  const correctPassword = '123456';
  if (email !== correctEmail || password !== correctPassword) {
    toast('Wrong email ID or password', 'warn');
    return;
  }
  // Save email for next login
  localStorage.setItem('agromind_email', email);
  // ... rest of your existing login code below
  
  /* LOGIN SUCCESS */
  const page =
    document.getElementById('login-page');
  page.style.opacity = '0';
  page.style.transition =
    'opacity .4s';
  await sleep(400);
  page.style.display = 'none';
  document
    .getElementById('app')
    .classList.add('visible');
  initCharts();
  await getWeather();
  startSensorSim();
  toast(
    '👋 Welcome to AgroMind!',
    'success'
  );
}

function doLogout() {
  const app = document.getElementById('app');
  app.style.opacity = '0';
  app.style.transition = 'opacity .4s';
  setTimeout(() => {
    app.classList.remove('visible');
    app.style.opacity = '1';
    const loginPage = document.getElementById('login-page');
    loginPage.style.display = 'flex';
    loginPage.style.opacity = '0';
    setTimeout(() => { loginPage.style.opacity = '1'; }, 50);
    // Restore saved email
    const savedEmail = localStorage.getItem('agromind_email');
    if (savedEmail) {
      const emailField = document.getElementById('li-email');
      if (emailField) emailField.value = savedEmail;
    }
  }, 400);
}
/* ── Navigation ── */
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ── Dark Mode ── */
function toggleDark() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  enableDark(!isDark);
}

function enableDark(on) {
  document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
  document.getElementById('dark-btn').textContent = on ? '☀️' : '🌙';
  const t = document.getElementById('dark-toggle');
  if (t) on ? t.classList.add('on') : t.classList.remove('on');
  localStorage.setItem('agromind_dark', on ? '1' : '0');
}

/* ── Clock ── */
function updateClock() {
  const n = new Date();
  const t = n.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('hdr-time').textContent = t;
  const dt = n.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  const el = document.getElementById('dash-timestamp');
  if (el) el.textContent = dt;
}

/* ── Utilities ── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function setEl(id, v) { const e = document.getElementById(id); if (e) e.textContent = v; }
