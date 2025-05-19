// src/core/animationLoop.js
import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';
import { zones } from '../maps/mapsLoader.js';
import { handleHoverState } from '../effects/hoverEffects.js';
import { rotateMap, updateMouseRotation } from '../utils/rotateMap.js';
import { updateParticles, createMagicParticles } from '../effects/particles.js';
import { ambientLight } from './lights.js';
import { hotspots } from '../maps/hotspots.js';


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const mouseX = event.clientX - window.innerWidth / 2;
  const mouseY = event.clientY - window.innerHeight / 2;
  updateMouseRotation(mouseX, mouseY);
});

function animate() {
  requestAnimationFrame(animate);

  updateParticles(0.016);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(zones, true);

  const map1 = zones.find(zone => zone.userData.id === 'map1');
  if (map1) rotateMap(map1);

  if (intersects.length > 0) {
  let targetObject = intersects[0].object;
  while (targetObject && !targetObject.userData.id) {
    targetObject = targetObject.parent;
  }

  const validMaps = ['map1', 'map2', 'map3', 'map4', 'map5'];

  if (targetObject && validMaps.includes(targetObject.userData.id)) {
    handleHoverState(targetObject.userData.id);
    document.body.style.cursor = 'pointer';

    // ✨ Mostrar partículas mágicas en cualquier mapa válido
    if (Math.random() < 0.1) {
      createMagicParticles(intersects[0].point);
    }

  } else {
    handleHoverState(null);
    document.body.style.cursor = 'default';
  }
} else {
  handleHoverState(null);
  document.body.style.cursor = 'default';
}

  ambientLight.intensity = ambientLight.intensity = 0.6 + Math.sin(Date.now() * 0.0005) * 0.05;

  renderer.render(scene, camera);
}

animate();



// CLIC EN HOTSPOTS
document.addEventListener('click', () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hotspots, true); // hotspots debe estar bien importado

  if (intersects.length > 0) {
    const clickedHotspot = intersects[0].object;
    const data = hotspotData[clickedHotspot.name];

    if (data) {
      const infoBox = document.getElementById('hotspot-info');
      const titleEl = document.getElementById('info-title');
      const textEl = document.getElementById('info-text');
      const imageEl = document.getElementById('info-image');

      if (infoBox && titleEl && textEl && imageEl) {
        titleEl.textContent = data.title;
        textEl.textContent = data.text;
        imageEl.src = data.image || '';
        infoBox.classList.add('visible');
      }
    }
  }
});

// CERRAR INFOBOX — espera que el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close-info');
  const infoBox = document.getElementById('hotspot-info');

  if (closeBtn && infoBox) {
    closeBtn.addEventListener('click', () => {
      infoBox.classList.remove('visible');
    });
  }
});


