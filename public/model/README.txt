AgroMind Model Folder
=====================

AgroMind.keras       ← Your trained model (Keras 3.13.2 format)
tfjs_model/          ← TF.js converted model (auto-generated)

To generate tfjs_model/, run from the project root:
    python convert_model.py

Requirements:
    pip install tensorflowjs tensorflow

After conversion, reload the app — the AI will activate automatically.
