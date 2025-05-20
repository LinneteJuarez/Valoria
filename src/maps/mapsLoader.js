import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from '../core/scene';

const loader = new GLTFLoader();
const zones = [];
const textureLoader = new THREE.TextureLoader();

// Paleta cálida tipo hoja vieja (sin naranjas brillantes)
const warmColors = [
  0xede3d1,
  0xd6c4a8,
  0xcbb499,
  0xa38e74,
  0x8c7a62,
  0x74614d,
];

// Textura de papel manchado
const paperBumpMap = textureLoader.load('/textures/papel_manchado.jpg');
paperBumpMap.wrapS = THREE.RepeatWrapping;
paperBumpMap.wrapT = THREE.RepeatWrapping;
paperBumpMap.repeat.set(2, 2);

const positions = [
  [-80, 150, 100], 
  [-80, 150, 100], 
  [-80, 150, 100], 
  [-80, 150, 100]
];

for (let i = 0; i < 4; i++) {
  loader.load(`/models/${i + 1}.glb`, (gltf) => {
    const model = gltf.scene;
    model.position.set(...positions[i]);

    model.traverse((child) => {
      if (child.isMesh) {
        const randomColor = warmColors[Math.floor(Math.random() * warmColors.length)];

        child.material = new THREE.MeshStandardMaterial({
          color: randomColor,
          roughness: 0.95,
          metalness: 0.05,
          flatShading: true,
          bumpMap: paperBumpMap,
          bumpScale: 0.6, // Aumentado para que se note más
        });

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.userData.id = `map${i + 1}`;
    scene.add(model);
    zones.push(model);

    console.log(`Loaded map${i + 1} at position:`, positions[i]);
  });
}

export { zones, loader, positions };
