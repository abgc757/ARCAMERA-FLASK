
# 🧠 Explorador de Realidad Aumentada

Una aplicación web interactiva que utiliza **Flask**, **JavaScript**, **face-api.js** y **TensorFlow.js** para ofrecer una experiencia de **Realidad Aumentada (AR)** directamente desde el navegador.

<div align="center">
  <img src="static/img/Filtroalien.png" alt="Filtro Alienígena" width="120" />
</div>

## 🎯 Características

- 📷 Detección facial en tiempo real usando `face-api.js`
- 👽 Filtros faciales animados (como el filtro alienígena)
- 🦄 Criaturas mágicas que aparecen de forma aleatoria
- 🌿 Detección de plantas y animales
- 🏠 Animaciones activadas por QR
- 🧠 Detección de objetos usando `coco-ssd`
- 🔲 Lector de códigos QR en vivo

---

## 🛠️ Tecnologías utilizadas

- **Python 3** con [Flask](https://flask.palletsprojects.com/)
- **JavaScript** (ES6)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [jsQR](https://github.com/cozmo/jsQR)
- HTML5 + CSS3

---

## 🚀 Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/abgc757/ARCAMERA-FLASK.git
cd ARCAMERA-FLASK
```

### 2. Crear y activar entorno virtual

```bash
python -m venv env
source env/bin/activate  # En Windows: env\Scripts\activate
```

### 3. Instalar dependencias de Flask

```bash
pip install -r requirements.txt
```

### 4. Ejecutar el servidor

```bash
python app.py
```

Luego abre el navegador en:  
**http://127.0.0.1:5000**

---

## 🧩 Estructura del proyecto

```
explorador-ar/
├── app.py
├── requirements.txt
├── static/
│   ├── css/
│   │   └── style.css
│   ├── img/
│   │   └── Filtroalien.png
│   ├── js/
│   │   └── ar_logic.js
│   └── models/
│       ├── face_landmark_68_tiny_model-*
│       ├── tiny_face_detector_model-*
├── templates/
│   └── index.html
└── README.md
```

---

## 🧠 Modelos necesarios

Coloca los siguientes modelos en `static/models/`:

- `tiny_face_detector_model`
- `face_landmark_68_tiny_model`

Puedes descargarlos desde:  
https://github.com/justadudewhohacks/face-api.js-models

O ejecuta el siguiente script

```bash
python descargar_modelos.py
```

---

## 📸 Créditos

- Filtro `Filtroalien.png` diseñado para superposición facial.
- Basado en las librerías libres mencionadas arriba.
---
