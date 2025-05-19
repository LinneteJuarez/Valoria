// src/core/lights.js
import * as THREE from 'three';
import { scene } from './scene';

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(100, 300, 100);
dirLight.castShadow = true;
scene.add(dirLight);

const magicLights = [];
const lightColors = [0x9966ff, 0x66ffff, 0xffcc00];

for (let i = 0; i < 3; i++) {
  const pointLight = new THREE.PointLight(lightColors[i], 0, 30);
  pointLight.position.set(
    (Math.random() - 0.5) * 20,
    15 + Math.random() * 10,
    (Math.random() - 0.5) * 20
  );
  scene.add(pointLight);
  magicLights.push(pointLight);
}

export { ambientLight, dirLight, magicLights };
