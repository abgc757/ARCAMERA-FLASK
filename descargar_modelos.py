import os
import requests

# Ruta local para guardar los modelos
MODEL_DIR = "static/models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Lista de modelos a descargar desde el repositorio oficial
base_url = "https://justadudewhohacks.github.io/face-api.js/models/"
model_files = [
    "tiny_face_detector_model-shard1",
    "tiny_face_detector_model-weights_manifest.json",
    "face_landmark_68_tiny_model-shard1",
    "face_landmark_68_tiny_model-weights_manifest.json"
]

def descargar_modelo(nombre_archivo):
    url = base_url + nombre_archivo
    local_path = os.path.join(MODEL_DIR, nombre_archivo)
    if os.path.exists(local_path):
        print(f"✔️ Ya existe: {nombre_archivo}")
        return
    print(f"⬇️ Descargando: {nombre_archivo}")
    r = requests.get(url, stream=True)
    with open(local_path, 'wb') as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f"✅ Guardado en: {local_path}")

if __name__ == "__main__":
    for archivo in model_files:
        descargar_modelo(archivo)
