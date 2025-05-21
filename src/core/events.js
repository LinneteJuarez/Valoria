// src/core/events.js
import * as THREE from 'three';
import { camera, renderer, scene } from './scene.js';
import { handleHoverState } from '../effects/hoverEffects.js';
import { zones } from '../maps/mapsLoader.js';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getNormalizedMousePosition(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1
  };
}

document.addEventListener('mousemove', (event) => {
  const normalized = getNormalizedMousePosition(event, renderer.domElement);
  
  mouse.x = normalized.x;
  mouse.y = normalized.y;

  updateFireflyTargetFromMouse(normalized.x, normalized.y, camera);
});

function animate(time) {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(zones, true);

  if (intersects.length > 0) {
    let targetObject = intersects[0].object;
    while (targetObject && !targetObject.userData.id) {
      targetObject = targetObject.parent;
    }

    const validMaps = ['map1', 'map2', 'map3', 'map4', 'map5'];

    if (targetObject && validMaps.includes(targetObject.userData.id)) {
      handleHoverState(targetObject.userData.id);
      document.body.style.cursor = 'pointer';
    } else {
      handleHoverState(null);
      document.body.style.cursor = 'default';
    }
  } else {
    handleHoverState(null);
    document.body.style.cursor = 'default';
  }

  renderer.render(scene, camera);
}

animate();