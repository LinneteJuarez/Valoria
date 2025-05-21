import * as THREE from 'three';
import { scene, camera, renderer } from '../core/scene.js';  // Importa cámara y renderer para raycaster
import gsap from 'gsap';

const hotspotGroup = new THREE.Group();
scene.add(hotspotGroup);

// Posiciones distribuidas sobre mapas 1 a 4 (ajústalas según lo que ves)
const hotspotPositions = [
  { id: 'hs1', position: new THREE.Vector3(-150, 305, -50) },
  { id: 'hs2', position: new THREE.Vector3(-160, 305, 60) },
  { id: 'hs3', position: new THREE.Vector3(100, 305, 250) },
  { id: 'hs4', position: new THREE.Vector3(-60, 305, 150) },
  { id: 'hs5', position: new THREE.Vector3(-60, 305, 250) },
  { id: 'hs6', position: new THREE.Vector3(20, 305, 100) }
];

// Información asociada a cada hotspot
const hotspotData = {
  hs1: { title: 'El Inicio', text: 'Acantha despierta en un bosque desconocido...' },
  hs2: { title: 'El Portal', text: 'Encuentra una puerta de luz entre las raíces.' },
  hs3: { title: 'Aliado Secreto', text: 'Una criatura la guía en su viaje.' },
  hs4: { title: 'Laberinto de Cristal', text: 'El lugar donde Acantha enfrenta sus dudas.' },
  hs5: { title: 'La Torre del Tiempo', text: 'Aquí aprende sobre su linaje olvidado.' },
  hs6: { title: 'Última Elección', text: 'Una decisión que cambiará Valoria para siempre.' }
};

// Material estilo vintage, con color cálido y brillo sutil
const hotspotMaterial = new THREE.MeshStandardMaterial({
  color: 0xA0522D,       // Sienna, café rojizo
  emissive: 0x7B3F00,    // Emisión naranja oscuro
  emissiveIntensity: 0.5,
  roughness: 0.7,
  metalness: 0.1
});

// Geometría un poco más grande para mejor visibilidad
const hotspotGeometry = new THREE.SphereGeometry(4, 32, 32);

const hotspots = [];
const haloSprites = new Map();  // Guarda sprites de halo por hotspot

// Crear textura para el halo (canvas con gradiente radial)
function createHaloTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(size/2, size/2, 10, size/2, size/2, size/2);
  gradient.addColorStop(0, 'rgba(255, 165, 0, 0.9)');      // naranja fuerte en el centro
  gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');        // transparente en bordes

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

const haloTexture = createHaloTexture();

hotspotPositions.forEach(({ id, position }) => {
  const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial.clone());
  hotspot.position.copy(position);
  hotspot.name = id;
  hotspot.userData.isHotspot = true;

  // Animación de flotación vertical con GSAP (pulsación suave)
  gsap.to(hotspot.position, {
    y: position.y + 4,
    duration: 2 + Math.random(),
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Pulsación sutil del tamaño para darle vida
  gsap.to(hotspot.scale, {
    x: 1.1,
    y: 1.1,
    z: 1.1,
    duration: 1.5 + Math.random(),
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Crear sprite halo pero NO agregarlo aún a la escena
  const spriteMaterial = new THREE.SpriteMaterial({
    map: haloTexture,
    color: 0xffa500,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const haloSprite = new THREE.Sprite(spriteMaterial);
  haloSprite.scale.set(20, 20, 1); // tamaño del halo
  haloSprite.visible = false;      // inicialmente oculto
  hotspot.add(haloSprite);         // lo añado como hijo para que se mueva con el hotspot

  haloSprites.set(id, haloSprite);

  hotspotGroup.add(hotspot);
  hotspots.push(hotspot);
});

// Raycaster para detectar clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedHotspotId = null;

function onClick(event) {
  // Coordenadas normalizadas para raycaster (ajustar al canvas #right)
  const container = document.getElementById('right');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hotspots);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const clickedId = clicked.name;

    if (selectedHotspotId === clickedId) {
      // Si ya estaba seleccionado, quitar halo
      haloSprites.get(clickedId).visible = false;
      selectedHotspotId = null;
    } else {
      // Quitar halo de cualquier otro hotspot previamente seleccionado
      if (selectedHotspotId) {
        haloSprites.get(selectedHotspotId).visible = false;
      }
      // Mostrar halo en el seleccionado
      haloSprites.get(clickedId).visible = true;
      selectedHotspotId = clickedId;
    }
  }
}

// Añadir evento click al canvas donde se renderiza Three.js
document.getElementById('right').addEventListener('click', onClick);

export { hotspots, hotspotData };
