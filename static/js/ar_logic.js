// js/ar_logic.js - versión combinada con filtro alienígena

let arActive = false;
let cameraStream = null;
let detectionLoopId = null;
let lastFaceTime = 0;
let lastObjectTime = 0;

// Referencias a DOM
const video        = document.getElementById('camera-video');
const placeholder  = document.getElementById('camera-placeholder');
const errorMessage = document.getElementById('error-message');
const arInterface  = document.getElementById('ar-interface');
const arContainer  = document.getElementById('ar-container');
const faceEffect      = document.getElementById('face-effect');
const alienFilterImg  = document.getElementById('alien-filter'); // <img id="alien-filter">
const effectIcon      = document.getElementById('effect-icon');
const effectName      = document.getElementById('effect-name');
const randomCreature  = document.getElementById('random-creature');
const creatureIcon    = document.getElementById('creature-icon');
const creatureName    = document.getElementById('creature-name');
const creatureAction  = document.getElementById('creature-action');
const windowAnimation = document.getElementById('window-animation');
const plantAnimal     = document.getElementById('plant-animal');
const animalIcon      = document.getElementById('animal-icon');
const animalName      = document.getElementById('animal-name');

// Canvas off-screen para procesar frames
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx    = offscreenCanvas.getContext('2d');

// Modelos
let cocoModel = null;

function show(el){ el.style.display = 'flex'; }
function hide(el){ el.style.display = 'none'; }
function showError(msg){ errorMessage.innerText = msg; errorMessage.style.display = 'block'; }
function hideError(){ errorMessage.innerText = ''; errorMessage.style.display = 'none'; }

async function startCamera(){
  try {
    if(cameraStream) stopCamera();

    const prefs = [
      { video: { facingMode: 'environment' } },
      { video: { facingMode: 'user' } },
      { video: true }
    ];
    for(let p of prefs){
      try { cameraStream = await navigator.mediaDevices.getUserMedia(p); break; }
      catch{}
    }
    if(!cameraStream) throw new Error('No se pudo acceder a la cámara');

    video.srcObject = cameraStream;
    await video.play();

    offscreenCanvas.width  = video.videoWidth;
    offscreenCanvas.height = video.videoHeight;

    hide(placeholder);
    return true;
  } catch(err){
    showError(err.message || 'Error al acceder a la cámara');
    show(placeholder);
    return false;
  }
}

function stopCamera(){
  if(cameraStream){
    cameraStream.getTracks().forEach(t=>t.stop());
    cameraStream = null;
  }
  video.srcObject = null;
  show(placeholder);
}

async function loadModels(){
  await faceapi.nets.tinyFaceDetector.loadFromUri('/static/models');
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/static/models');
  cocoModel = await cocoSsd.load();
}

// Filtro alienígena
async function handleFaceDetection() {
  const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true);
  if (!detection) {
    alienFilterImg.style.display = 'none';
    return;
  }

  const landmarks = detection.landmarks;
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose = landmarks.getNose();

  const noseX = (nose[0].x + nose[nose.length - 1].x) / 2;
  const noseY = (nose[0].y + nose[nose.length - 1].y) / 2;

  const eyeDistance = Math.abs(leftEye[0].x - rightEye[3].x);
  const width = eyeDistance * 3.2;
  const height = width * 1.3;

  alienFilterImg.style.display = 'block';
  alienFilterImg.style.width = `${width}px`;
  alienFilterImg.style.height = `${height}px`;
  alienFilterImg.style.left = `${noseX}px`;
  alienFilterImg.style.top = `${noseY - height / 2}px`;
  alienFilterImg.style.transform = 'translate(-50%, -50%)';
}

function spawnRandomCreature(){
  const opts = [
    {name:'Conejo',  icon:'🐇', action:'Saltó'},
    {name:'Araña',   icon:'🕷️', action:'Escurrió'},
    {name:'Robot',   icon:'🤖', action:'Desapareció'},
    {name:'Dragón',  icon:'🐉', action:'Huyó'},
    {name:'Mariposa',icon:'🦋', action:'Voló'}
  ];
  const pick = opts[Math.floor(Math.random()*opts.length)];
  creatureIcon.innerText   = pick.icon;
  creatureName.innerText   = pick.name;
  creatureAction.innerText = pick.action + '!';
  show(randomCreature);
  setTimeout(()=>hide(randomCreature), 3000);
}

function triggerPlantAnimal(){
  const opts = [
    {name:'Colibrí',   icon:'🐦'},
    {name:'Mariquita', icon:'🐞'},
    {name:'Ardilla',   icon:'🐿️'},
    {name:'Serpiente', icon:'🐍'},
    {name:'Mariposa',  icon:'🦋'}
  ];
  const pick = opts[Math.floor(Math.random()*opts.length)];
  animalIcon.innerText = pick.icon;
  animalName.innerText = pick.name;
  show(plantAnimal);
  setTimeout(()=>hide(plantAnimal), 4000);
}

function triggerWindowAnimation(data){
  show(windowAnimation);
  setTimeout(()=>hide(windowAnimation), 5000);
}

async function detectionLoop(){
  if(!arActive) return;

  offscreenCtx.drawImage(video,0,0,offscreenCanvas.width,offscreenCanvas.height);
  const frame = offscreenCtx.getImageData(0,0,offscreenCanvas.width,offscreenCanvas.height);
  const now = Date.now();

  if(now - lastFaceTime > 1500){
    lastFaceTime = now;
    const faces = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    if(faces.length) handleFaceDetection();
  }

  if(now - lastObjectTime > 2000){
    lastObjectTime = now;
    const objs = await cocoModel.detect(video);
    if(objs.find(o => o.class==='potted plant')) triggerPlantAnimal();
    else if(objs.find(o => o.class==='person')) spawnRandomCreature();
  }

  const code = jsQR(frame.data, frame.width, frame.height);
  if(code) triggerWindowAnimation(code.data);

  detectionLoopId = requestAnimationFrame(detectionLoop);
}

async function startARExperience(){
  hideError();
  arInterface.style.display = 'none';
  arContainer.style.display  = 'flex';
  arActive = true;

  const ready = await startCamera();
  if(!ready) return stopARExperience();

  await loadModels();
  lastFaceTime   = 0;
  lastObjectTime = 0;
  detectionLoop();
}

function stopARExperience(){
  arActive = false;
  cancelAnimationFrame(detectionLoopId);
  stopCamera();
  hide(faceEffect);
  hide(randomCreature);
  hide(windowAnimation);
  hide(plantAnimal);
  alienFilterImg.style.display = 'none';
  arContainer.style.display  = 'none';
  arInterface.style.display = 'flex';
}

document.getElementById('start-btn').addEventListener('click', startARExperience);
document.getElementById('exit-btn').addEventListener('click',  stopARExperience);
