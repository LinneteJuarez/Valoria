import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { rotationGroup } from '../core/scene.js'; // ⬅️ Importar el grupo desde core

const loader = new GLTFLoader();
const zones = [];
const textureLoader = new THREE.TextureLoader();

// Paleta cálida tipo hoja vieja (sin naranjas brillantes)
const warmColors = [
  0x8B9454,
  0xA1AA81,
  0x6C8745,
  0x869856,
  0x607656,
  0x839869,
];

// Textura de papel manchado
const paperBumpMap = textureLoader.load('/textures/papel_manchado.jpg');
paperBumpMap.wrapS = THREE.RepeatWrapping;
paperBumpMap.wrapT = THREE.RepeatWrapping;
paperBumpMap.repeat.set(2, 2);

// Posiciones (las puedes personalizar más adelante si necesitas que estén en diferentes lugares)
const positions = [
  [0, 150, 100],
  [0, 150, 100],
  [0, 150, 100],
  [0, 150, 100]
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
          bumpScale: 0.6,
        });

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.userData.id = `map${i + 1}`;
    rotationGroup.add(model); // ⬅️ Añadido al rotationGroup en lugar de scene directamente
    zones.push(model);

    console.log(`Loaded map${i + 1} at position:`, positions[i]);
  });
}

export { zones, loader, positions };
