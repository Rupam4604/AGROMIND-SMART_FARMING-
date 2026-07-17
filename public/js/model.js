/* ═══════════════════════════════════════════════════
   model.js — AUTO-LOADING MODEL & INFERENCE
   Includes leaf pre-check using MobileNet classifier
═══════════════════════════════════════════════════ */

let tfModel    = null;
let leafModel  = null;
let modelReady = false;

/* ── Load leaf detection model (MobileNet from CDN) ── */
async function loadLeafDetector() {
  try {
    leafModel = await mobilenet.load({ version: 2, alpha: 1.0 });
    console.log('✅ Leaf detector loaded');
  } catch (e) {
    console.warn('Leaf detector not available:', e.message);
    leafModel = null;
  }
}

/* ── Check if image contains a plant leaf ── */
async function isLeafImage(imgEl) {
  if (!leafModel) return true;
  try {
    const results = await leafModel.classify(imgEl, 5);
    console.log('Leaf check results:', results);
    const plantKeywords = [
      'leaf','plant','tree','flower','herb','shrub','vine','cabbage',
      'cauliflower','broccoli','cucumber','pepper','tomato','potato',
      'corn','maize','lettuce','spinach','strawberry','apple','orange',
      'grape','peach','pear','banana','mango','fig','raspberry',
      'blueberry','berry','moss','fern','fungus','mushroom','daisy',
      'dandelion','sunflower','rose','tulip','ear','hip','lemon',
      'rapeseed','artichoke','buckeye','acorn','dock','sorrel',
    ];
    const found = results.some(r =>
      plantKeywords.some(k => r.className.toLowerCase().includes(k))
    );
    return found;
  } catch (e) {
    console.warn('Leaf check failed:', e.message);
    return true;
  }
}

/* ── Auto-load model on app start ── */
async function autoLoadModel() {
  setModelUI('loading', 'Loading model…');
  try {
    tfModel = await tf.loadLayersModel('model/tfjs_model/model.json');
    const dummy = tf.zeros([1, 160, 160, 3]);
    await tfModel.predict(dummy).data();
    dummy.dispose();
    modelReady = true;
    setModelUI('ready', '✓ AgroMind Ready');
    updateAnalyseBtn();
    console.log('✅ AgroMind model loaded from model/tfjs_model/');
    loadLeafDetector();
  } catch (err) {
    console.warn('TF.js model not found, switching to demo mode:', err.message);
    modelReady = 'simulate';
    setModelUI('simulate', '⚡ Demo Mode');
    updateAnalyseBtn();
  }
}

/* ── Image input / drop zone ── */
(() => {
  const zone = document.getElementById('drop-zone');
  const inp  = document.getElementById('img-input');
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('over'); });
  zone.addEventListener('dragleave', ()  => zone.classList.remove('over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('over');
    if (e.dataTransfer.files[0]) loadImg(e.dataTransfer.files[0]);
  });
  inp.addEventListener('change', e => { if (e.target.files[0]) loadImg(e.target.files[0]); });
})();

let currentImg = null;

function loadImg(file) {
  if (file.size > 10 * 1024 * 1024) { toast('Image must be under 10 MB', 'error'); return; }
  const r = new FileReader();
  r.onload = e => showPreview(e.target.result, file.name);
  r.readAsDataURL(file);
}

function showPreview(src, name) {
  const pw = document.getElementById('preview-wrap');
  const pi = document.getElementById('preview-img');
  pi.src = src;
  currentImg = pi;
  setEl('preview-name', name || 'image');
  pw.classList.add('show');
  document.getElementById('result-panel').classList.remove('show');
  document.getElementById('results-empty').style.display = 'flex';
  updateAnalyseBtn();
}

function clearImg() {
  document.getElementById('preview-wrap').classList.remove('show');
  document.getElementById('img-input').value = '';
  currentImg = null;
  document.getElementById('result-panel').classList.remove('show');
  document.getElementById('results-empty').style.display = 'flex';
  updateAnalyseBtn();
}

function updateAnalyseBtn() {
  document.getElementById('btn-analyze').disabled = !currentImg || !modelReady;
}

/* ── Run Inference ── */
async function runAnalysis() {
  if (!currentImg || !modelReady) return;
  const btn = document.getElementById('btn-analyze');
  btn.disabled = true;
  document.getElementById('btn-spin').style.display = 'block';
  btn.querySelector('span').textContent = 'Analysing…';

  try {
    let topK;
    if (modelReady === 'simulate') {
      await sleep(1000);
      topK = CLASSES.map((name, i) => ({ name, prob: Math.random() }))
        .sort((a, b) => b.prob - a.prob).slice(0, 5);
      const s = topK.reduce((a, x) => a + x.prob, 0);
      topK.forEach(x => x.prob /= s);
    } else {

      // ── STEP 1: Leaf pre-check ──
      btn.querySelector('span').textContent = 'Checking image…';
      const isLeaf = await isLeafImage(currentImg);
      if (!isLeaf && topK && topK[0] && topK[0].prob > 0.85){
        toast('🌿 No plant leaf detected — please upload a clear leaf photo', 'error');
        btn.disabled = false;
        document.getElementById('btn-spin').style.display = 'none';
        btn.querySelector('span').textContent = '🔬 Analyse Disease';
        updateAnalyzeBtn();
        return;
      }

      // ── STEP 2: Disease detection ──
      btn.querySelector('span').textContent = 'Detecting disease…';
      const tensor = tf.tidy(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 160; canvas.height = 160;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 160, 160);
        const iw = currentImg.naturalWidth  || currentImg.width;
        const ih = currentImg.naturalHeight || currentImg.height;
        const size = Math.min(iw, ih);
        const sx = (iw - size) / 2;
        const sy = (ih - size) / 2;
        ctx.drawImage(currentImg, sx, sy, size, size, 0, 0, 160, 160);
        return tf.browser.fromPixels(canvas)
          .toFloat()
          .div(tf.scalar(127.5))
          .sub(tf.scalar(1.0))
          .expandDims(0);
      });

      const preds = await tfModel.predict(tensor).data();
      tensor.dispose();

      topK = Array.from(preds)
        .map((prob, i) => ({ name: CLASSES[i] || `Class ${i}`, prob }))
        .sort((a, b) => b.prob - a.prob)
        .slice(0, 5);

      const topIdx = Array.from(preds).indexOf(Math.max(...Array.from(preds)));
      if (topIdx === 38) {
        toast('🌿 No plant detected — please upload a clear leaf photo', 'warning');
        topK = [{ name: 'Background — No Plant', prob: 1.0 }];
      } else if (topK[0].prob < 0.5) {
        toast('⚠️ Low confidence — try a clearer, closer photo of the leaf', 'warning');
      }
    }
    showResults(topK, currentImg.src);
  } catch (e) {
    console.error(e);
    toast('Inference error: ' + e.message.slice(0, 60), 'error');
  } finally {
    btn.disabled = false;
    document.getElementById('btn-spin').style.display = 'none';
    btn.querySelector('span').textContent = '🔬 Analyse Disease';
    updateAnalyseBtn();
  }
}

/* ── Demo Predictions ── */
function demoPredict(type) {
  const maps = {
    healthy: [37, 3, 6, 14, 19],
    blight:  [30, 21, 29, 8, 20],
    rust:    [8, 2, 11, 13, 12],
    spot:    [32, 28, 13, 34, 7],
  };
  const idxs = maps[type] || maps.healthy;
  const raws = idxs.map(() => Math.random());
  raws[0] = raws[0] * 0.45 + 0.42;
  const s = raws.reduce((a, b) => a + b, 0);
  const topK = idxs.map((ci, i) => ({ name: CLASSES[ci], prob: raws[i] / s }))
    .sort((a, b) => b.prob - a.prob);
  const c = document.createElement('canvas'); c.width = 160; c.height = 160;
  const ctx = c.getContext('2d');
  const cols = { healthy: '#4CAF50', blight: '#795548', rust: '#FF9800', spot: '#EF5350' };
  const grad = ctx.createLinearGradient(0, 0, 160, 160);
  grad.addColorStop(0, cols[type]); grad.addColorStop(1, '#1a1a1a');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 160, 160);
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * .3})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 160, Math.random() * 160, Math.random() * 18 + 3, 0, Math.PI * 2);
    ctx.fill();
  }
  showPreview(c.toDataURL(), 'demo_' + type + '.png');
  setTimeout(() => showResults(topK, c.toDataURL()), 300);
}