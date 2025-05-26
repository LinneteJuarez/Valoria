import * as THREE from 'three';
import { camera, renderer, scene, rotationGroup } from './scene.js'; // Importa rotationGroup
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

// Para raycasting y hover
document.addEventListener('mousemove', (event) => {
  const normalized = getNormalizedMousePosition(event, renderer.domElement);
  
  mouse.x = normalized.x;
  mouse.y = normalized.y;
});

// Variables para rotación drag
let isDragging = false;
let previousMouseX = 0;

function onMouseDown(event) {
  isDragging = true;
  previousMouseX = event.clientX;
  document.body.style.cursor = 'grabbing';
}

function onMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - previousMouseX;
  previousMouseX = event.clientX;

  const rotationSpeed = 0.005; // Ajusta la sensibilidad aquí

  // Rota el grupo sobre Y
  rotationGroup.rotation.y += deltaX * rotationSpeed;
}

function onMouseUp() {
  isDragging = false;
  document.body.style.cursor = 'default';
}

// Event listeners para drag-rotate sobre el canvas de Three.js
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mouseup', onMouseUp);
renderer.domElement.addEventListener('mouseleave', onMouseUp);

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
      document.body.style.cursor = isDragging ? 'grabbing' : 'pointer';
    } else {
      handleHoverState(null);
      if (!isDragging) document.body.style.cursor = 'default';
    }
  } else {
    handleHoverState(null);
    if (!isDragging) document.body.style.cursor = 'default';
  }

  renderer.render(scene, camera);
}

animate();
