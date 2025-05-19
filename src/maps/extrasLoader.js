// src/maps/extrasLoader.js
import * as THREE from 'three';
import { loader, positions } from './mapsLoader';
import { scene } from '../core/scene';

function getRandomColor(baseColor, variation = 0.15) {
  const color = new THREE.Color(baseColor);
  const hsl = {};
  color.getHSL(hsl);

  // Añadir pequeñas variaciones de saturación y luminosidad
  hsl.s += (Math.random() - 0.5) * variation;
  hsl.l += (Math.random() - 0.5) * variation;

  // Clamp para mantener en rango válido
  hsl.s = THREE.MathUtils.clamp(hsl.s, 0, 1);
  hsl.l = THREE.MathUtils.clamp(hsl.l, 0, 1);

  const newColor = new THREE.Color();
  newColor.setHSL(hsl.h, hsl.s, hsl.l);

  return newColor;
}

const models = [];

// Elementos de mapa 1
const extras = [
  { file: 'map1building.glb', color: 0x334422, offset: [0, 0, 0] },
  { file: 'map1tree1.glb', color: 0x88a068, offset: [0, 0, -5] },
  { file: 'map1tree2.glb', color: 0x88a068, offset: [0, 0, 5] },
  { file: 'map1tree3.glb', color: 0x88a068, offset: [0, 0, -8] }
];

extras.forEach(({ file, color, offset }) => {
  loader.load(`/models/${file}`, (gltf) => {
    const model = gltf.scene;
    const [x, y, z] = offset;

    model.position.set(positions[0][0] + x, positions[0][1] + y, positions[0][2] + z);
    model.scale.set(0.1, 0.1, 0.1);
    model.userData.initialScale = new THREE.Vector3(1, 1, 1);
    model.userData.originalY = model.position.y;
    model.userData.visible = false;

    model.traverse((child) => {
      if (child.isMesh) {
const variedColor = getRandomColor(color, 0.2); // Variación ajustable

child.material = new THREE.MeshStandardMaterial({
  color: variedColor,
  roughness: 0.9,
  metalness: 0.05,
  flatShading: true,
  transparent: true,
  opacity: 0.05
});

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model);
    models.push(model);
  });
});

export { models };

// Agrega dentro de extrasLoader.js, después de mapa 1

// Helper para cargar modelos extra por mapa
function loadExtras(mapIndex, entries, positionsArray) {
  entries.forEach(({ file, color }, index) => {
    loader.load(`/models/${file}`, (gltf) => {
      const model = gltf.scene;

      model.position.set(
        positions[mapIndex][0] + positionsArray[index][0],
        positions[mapIndex][1] + positionsArray[index][1],
        positions[mapIndex][2] + positionsArray[index][2]
      );

      model.scale.set(0.1, 0.1, 0.1);
      model.userData.initialScale = new THREE.Vector3(1, 1, 1);
      model.userData.originalY = model.position.y;
      model.userData.visible = false;

      model.traverse((child) => {
        if (child.isMesh) {
          const variedColor = getRandomColor(color, 0.2); // Variación ajustable

child.material = new THREE.MeshStandardMaterial({
  color: variedColor,
  roughness: 0.9,
  metalness: 0.05,
  flatShading: true,
  transparent: true,
  opacity: 0.05
});

          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);
      models.push(model);
    });
  });
}

// MAPA 2
const map2Extras = [
  { file: 'map2building.glb', color: 0x664422 },
  { file: 'map2building1.glb', color: 0x664422 },
  { file: 'map2building3.glb', color: 0x664422 },
  { file: 'map2tree1.glb', color: 0x88a068 },
  { file: 'map2tree2.glb', color: 0x88a068 },
  { file: 'map2tree3.glb', color: 0x88a068 },
  { file: 'map2tree4.glb', color: 0x88a068 },
  { file: 'map2tree5.glb', color: 0x88a068 }
];
const map2Positions = [
  [0, 0, 5], [0, 0, 6], [0, 0, 5],
  [0, 0, -6], [0, 0, 6], [0, 0, -6],
  [0, 0, 4], [0, 0, -4]
];
loadExtras(1, map2Extras, map2Positions);

// MAPA 3
const map3Extras = [
  { file: 'map3building.glb', color: 0x664422 },
  { file: 'map3tree1.glb', color: 0x88a068 },
  { file: 'map3tree2.glb', color: 0x88a068 },
  { file: 'map3tree3.glb', color: 0x88a068 },
  { file: 'map3tree4.glb', color: 0x88a068 }
];
const map3Positions = [
  [0, 0, 5], [0, 0, 6], [0, 0, 5],
  [0, 0, -6], [0, 0, 6]
];
loadExtras(2, map3Extras, map3Positions);

// MAPA 4
const map4Extras = [
  { file: 'map4building.glb', color: 0x664422 },
  { file: 'map4building1.glb', color: 0x664422 },
  { file: 'map4building2.glb', color: 0x664422 },
  { file: 'map4tree1.glb', color: 0x88a068 },
  { file: 'map4tree2.glb', color: 0x88a068 },
  { file: 'map4tree3.glb', color: 0x88a068 }
];
const map4Positions = [
  [0, 0, 5], [0, 0, 6], [0, 0, 5],
  [0, 0, -6], [0, 0, 6], [0, 0, -6]
];
loadExtras(3, map4Extras, map4Positions);
