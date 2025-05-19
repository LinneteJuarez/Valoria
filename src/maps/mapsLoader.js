// src/maps/mapsLoader.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from '../core/scene';

const loader = new GLTFLoader();
const zones = [];

const positions = [
  [0, 0, 2], // map1
  [0, 0, 2], // map2
  [0, 0, 2], // map3
  [0, 0, 2], // map4
  [0, 0, 2], // map5
  [0, 0, 2]  // map6
];

for (let i = 0; i < 4; i++) {
  loader.load(`/models/${i + 1}.glb`, (gltf) => {
    const model = gltf.scene;

    model.position.set(...positions[i]);

    const baseColor = 0x4a7c3c;

    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.9,
          metalness: 0.1,
          flatShading: true
        });
        child.userData.originalColor = baseColor;
        child.userData.hoverColor = 0x3a5f2e; // mismo hover para todos
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.userData.id = `map${i + 1}`;
    scene.add(model);
    zones.push(model);

    console.log(`Loaded map${i + 1} at position:`, positions[i]);
  },
  (xhr) => {
    console.log(`Loading map ${i+1}: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
  },
  (error) => {
    console.error(`Error loading map ${i+1}:`, error);
  });
}

export { zones, loader, positions };
