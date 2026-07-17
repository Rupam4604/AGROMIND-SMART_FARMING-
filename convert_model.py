#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════╗
║   AgroMind — convert_model.py                           ║
║   Converts AgroMind.keras → TF.js format                ║
║   Run this ONCE before opening the web app.             ║
╚══════════════════════════════════════════════════════════╝

STEP 1 — Install dependencies (run once):
    pip install tensorflowjs tensorflow

STEP 2 — Run this script:
    python convert_model.py

STEP 3 — Open the app:
    Open public/index.html with Live Server in VS Code
    OR run:  npm install && npm start

After conversion, public/model/tfjs_model/ will contain:
    model.json   — model architecture
    *.bin        — weight shards
"""

import os
import sys
import shutil

KERAS_FILE   = os.path.join("public", "model", "AgroMind.keras")
OUTPUT_DIR   = os.path.join("public", "model", "tfjs_model")

def main():
    print("🌱 AgroMind Model Converter")
    print("=" * 50)

    # Check keras file exists
    if not os.path.exists(KERAS_FILE):
        print(f"❌ Model file not found: {KERAS_FILE}")
        print("   Make sure AgroMind.keras is in public/model/")
        sys.exit(1)

    print(f"✅ Found: {KERAS_FILE}  ({os.path.getsize(KERAS_FILE)/1024/1024:.1f} MB)")

    # Check tensorflowjs
    try:
        import tensorflowjs as tfjs
        import tensorflow as tf
        print(f"✅ TensorFlow   {tf.__version__}")
        print(f"✅ TensorFlow.js converter ready")
    except ImportError as e:
        print(f"\n❌ Missing package: {e}")
        print("\nInstall with:")
        print("   pip install tensorflowjs tensorflow")
        sys.exit(1)

    # Clean output dir
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)

    print(f"\n⏳ Converting {KERAS_FILE} → {OUTPUT_DIR} …")
    print("   (this may take 30–60 seconds)\n")

    try:
        import tensorflow as tf
        import tensorflowjs as tfjs

        model = tf.keras.models.load_model(KERAS_FILE)
        print(f"   Model loaded: input={model.input_shape}  output={model.output_shape}")

        tfjs.converters.save_keras_model(model, OUTPUT_DIR)

        files = os.listdir(OUTPUT_DIR)
        total = sum(os.path.getsize(os.path.join(OUTPUT_DIR, f)) for f in files)
        print(f"\n✅ Conversion complete!")
        print(f"   Output: {OUTPUT_DIR}/")
        for f in sorted(files):
            sz = os.path.getsize(os.path.join(OUTPUT_DIR, f))
            print(f"     {f:40s}  {sz/1024:.0f} KB")
        print(f"   Total: {total/1024/1024:.1f} MB")
        print(f"\n🚀 Now open the app:")
        print(f"   npm install && npm start")
        print(f"   OR right-click public/index.html → Open with Live Server")

    except Exception as e:
        print(f"\n❌ Conversion failed: {e}")
        import traceback; traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
