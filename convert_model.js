/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  AgroMind — convert_model.js                        ║
 * ║  Converts AgroMind.keras → TF.js format             ║
 * ║  Uses Node.js — no Python/uvloop issues on Windows  ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * STEP 1 — Install (run once, inside the agromind/ folder):
 *   npm install @tensorflow/tfjs-node
 *
 * STEP 2 — Run:
 *   node convert_model.js
 *
 * Output: public/model/tfjs_model/model.json + .bin shards
 */

const tf   = require('@tensorflow/tfjs-node');
const path = require('path');
const fs   = require('fs');

const KERAS_PATH = path.join(__dirname, 'public', 'model', 'AgroMind.keras');
const OUT_DIR    = path.join(__dirname, 'public', 'model', 'tfjs_model');

async function convert() {
  console.log('\n🌱 AgroMind Model Converter (Node.js)');
  console.log('='.repeat(50));

  // Check keras file exists
  if (!fs.existsSync(KERAS_PATH)) {
    console.error(`\n❌ Not found: ${KERAS_PATH}`);
    console.error('   Make sure AgroMind.keras is in public/model/');
    process.exit(1);
  }

  const sizeMB = (fs.statSync(KERAS_PATH).size / 1024 / 1024).toFixed(1);
  console.log(`✅ Found: AgroMind.keras (${sizeMB} MB)`);
  console.log('\n⏳ Loading model into TensorFlow.js…');
  console.log('   (first load may take 30–60 seconds)\n');

  try {
    // Load the .keras file
    const model = await tf.loadLayersModel(`file://${KERAS_PATH}`);

    console.log(`✅ Model loaded`);
    console.log(`   Input  shape: ${JSON.stringify(model.inputs[0].shape)}`);
    console.log(`   Output shape: ${JSON.stringify(model.outputs[0].shape)}`);
    console.log(`   Parameters:   ${model.countParams().toLocaleString()}`);

    // Clean output dir
    if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
    fs.mkdirSync(OUT_DIR, { recursive: true });

    console.log(`\n⏳ Saving to ${OUT_DIR} …`);

    // Save as TF.js format
    await model.save(`file://${OUT_DIR}`);

    // Show output files
    const files = fs.readdirSync(OUT_DIR);
    const total = files.reduce((s, f) =>
      s + fs.statSync(path.join(OUT_DIR, f)).size, 0);

    console.log('\n✅ Conversion complete!');
    console.log(`   Output: public/model/tfjs_model/`);
    files.sort().forEach(f => {
      const kb = (fs.statSync(path.join(OUT_DIR, f)).size / 1024).toFixed(0);
      console.log(`     ${f.padEnd(40)} ${kb} KB`);
    });
    console.log(`   Total: ${(total / 1024 / 1024).toFixed(1)} MB`);
    console.log('\n🚀 Done! Now start the app:');
    console.log('   npm start');
    console.log('   OR right-click public/index.html → Open with Live Server\n');

  } catch (err) {
    console.error('\n❌ Conversion failed:', err.message);
    console.error('\nFull error:');
    console.error(err);
    process.exit(1);
  }
}

convert();
