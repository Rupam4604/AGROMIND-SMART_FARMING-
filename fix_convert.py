import os, sys, json, numpy as np

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['KERAS_BACKEND'] = 'tensorflow'

import keras

KERAS_FILE = os.path.join("public", "model", "AgroMind.keras")
OUTPUT_DIR = os.path.join("public", "model", "tfjs_model")
os.makedirs(OUTPUT_DIR, exist_ok=True)

original_init = keras.layers.Dense.__init__
def patched_init(self, *args, **kwargs):
    kwargs.pop('quantization_config', None)
    original_init(self, *args, **kwargs)
keras.layers.Dense.__init__ = patched_init

print("Loading model...")
model = keras.saving.load_model(KERAS_FILE, compile=False)
print(f"Input: {model.input_shape}, Output: {model.output_shape}")

print("Extracting weights...")
weights = []
weight_bytes_list = []
offset = 0

for layer in model.layers:
    if not layer.weights:
        continue
    for w in layer.weights:
        arr = w.numpy().astype(np.float32)
        b = arr.tobytes()
        weights.append({
            "name": w.name,
            "shape": list(arr.shape),
            "dtype": "float32",
            "offset": offset,
            "byteLength": len(b)
        })
        weight_bytes_list.append(b)
        offset += len(b)

bin_path = os.path.join(OUTPUT_DIR, "group1-shard1of1.bin")
with open(bin_path, 'wb') as f:
    for b in weight_bytes_list:
        f.write(b)

model_json = {
    "format": "layers-model",
    "generatedBy": "fix_convert.py",
    "convertedBy": "manual",
    "modelTopology": json.loads(model.to_json()),
    "weightsManifest": [{
        "paths": ["group1-shard1of1.bin"],
        "weights": [{"name": w["name"], "shape": w["shape"], "dtype": w["dtype"]} for w in weights]
    }]
}

json_path = os.path.join(OUTPUT_DIR, "model.json")
with open(json_path, 'w') as f:
    json.dump(model_json, f)

print(f"\n✅ Done!")
print(f"  {json_path}")
print(f"  {bin_path}")