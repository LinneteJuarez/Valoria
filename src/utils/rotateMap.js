// src/utils/rotateMap.js
let currentRotationX = 0;
let currentRotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let hovering = false;

function rotateMap(mapObject) {
  if (!mapObject) return;

  currentRotationX += (targetRotationX - currentRotationX) * 0.05;
  currentRotationY += (targetRotationY - currentRotationY) * 0.05;

  if (hovering) {
    mapObject.rotation.x = currentRotationX;
    mapObject.rotation.y += (targetRotationY - mapObject.rotation.y) * 0.05;
  }
}

function updateMouseRotation(x, y) {
  targetRotationY = x * 0.0001;
  targetRotationX = y * 0.0001;
}

function setHovering(value) {
  hovering = value;
}

export { rotateMap, updateMouseRotation, setHovering };
