// src/maps/extrasLoader.js
import * as THREE from 'three';
import { loader, positions } from './mapsLoader';
import { scene } from '../core/scene';

// Cargamos texturas
const textureLoader = new THREE.TextureLoader();
const treeTexture = textureLoader.load('/textures/arboltexture.jpg');
const buildingTextures = [
  textureLoader.load('/textures/madera1.jpg'),
  textureLoader.load('/textures/madera2.jpg'),
  textureLoader.load('/textures/madera3.jpg'),
];

function getRandomColor(baseColor, variation = 0.15) {
  const color = new THREE.Color(baseColor);
  const hsl = {};
  color.getHSL(hsl);

  hsl.s += (Math.random() - 0.5) * variation;
  hsl.l += (Math.random() - 0.5) * variation;

  hsl.s = THREE.MathUtils.clamp(hsl.s, 0, 1);
  hsl.l = THREE.MathUtils.clamp(hsl.l, 0, 1);

  const newColor = new THREE.Color();
  newColor.setHSL(hsl.h, hsl.s, hsl.l);

  return newColor;
}

const models = [];

// Modificamos función para asignar texturas según tipo (tree/building)
function applyMaterialWithTexture(child, texture, baseColor, withVariation = true) {
  const color = withVariation ? getRandomColor(baseColor, 0.2) : new THREE.Color(baseColor);
  child.material = new THREE.MeshStandardMaterial({
    map: texture,
    color: color,
    roughness: 0.9,
    metalness: 0.05,
    flatShading: true,
    transparent: true,
    opacity: 0.95, // Le subí un poco para que no esté tan transparente, ajusta si quieres
  });
  child.material.map.wrapS = THREE.RepeatWrapping;
  child.material.map.wrapT = THREE.RepeatWrapping;
  child.material.map.repeat.set(1, 1);

  child.castShadow = true;
  child.receiveShadow = true;
}

// Para alternar texturas madera en edificios
let buildingTextureIndex = 0;

function loadModelWithTexture(file, baseColor, posIndex, offset, isBuilding) {
  loader.load(`/models/${file}`, (gltf) => {
    const model = gltf.scene;
    const [x, y, z] = offset;

    model.position.set(
      positions[posIndex][0] + x,
      positions[posIndex][1] + y,
      positions[posIndex][2] + z
    );

    model.scale.set(0.1, 0.1, 0.1);
    model.userData.initialScale = new THREE.Vector3(1, 1, 1);
    model.userData.originalY = model.position.y;
    model.userData.visible = false;

    model.traverse((child) => {
      if (child.isMesh) {
        if (isBuilding) {
          // Asignar textura madera rotando entre las 3
          const tex = buildingTextures[buildingTextureIndex % buildingTextures.length];
          buildingTextureIndex++;
          applyMaterialWithTexture(child, tex, baseColor);
        } else {
          // Es árbol, asignar textura arboltexture
          applyMaterialWithTexture(child, treeTexture, baseColor);
        }
      }
    });

    scene.add(model);
    models.push(model);
  });
}


// MAPA 1 extras actualizados
const extras = [
  { file: 'map1building.glb', color: 0x334422, offset: [0, 0, 0], isBuilding: true },
  { file: 'map1tree1.glb', color: 0x88a068, offset: [0, 0, -5], isBuilding: false },
  { file: 'map1tree2.glb', color: 0x88a068, offset: [0, 0, 5], isBuilding: false },
  { file: 'map1tree3.glb', color: 0x88a068, offset: [0, 0, -8], isBuilding: false }
];

extras.forEach(({ file, color, offset, isBuilding }) => {
  loadModelWithTexture(file, color, 0, offset, isBuilding);
});


// MAPA 2
const map2Extras = [
  { file: 'map2building.glb', color: 0x664422, isBuilding: true },
  { file: 'map2building1.glb', color: 0x664422, isBuilding: true },
  { file: 'map2building3.glb', color: 0x664422, isBuilding: true },
  { file: 'map2tree1.glb', color: 0x88a068, isBuilding: false },
  { file: 'map2tree2.glb', color: 0x88a068, isBuilding: false },
  { file: 'map2tree3.glb', color: 0x88a068, isBuilding: false },
  { file: 'map2tree4.glb', color: 0x88a068, isBuilding: false },
  { file: 'map2tree5.glb', color: 0x88a068, isBuilding: false }
];
const map2Positions = [
  [0, 0, 5], [0, 0, 6], [0, 0, 5],
  [0, 0, -6], [0, 0, 6], [0, 0, -6],
  [0, 0, 4], [0, 0, -4]
];
map2Extras.forEach(({ file, color, isBuilding }, i) => {
  loadModelWithTexture(file, color, 1, map2Positions[i], isBuilding);
});


// MAPA 3
const map3Extras = [
  { file: 'map3building.glb', color: 0x664422, isBuilding: true },
  { file: 'map3tree1.glb', color: 0x88a068, isBuilding: false },
  { file: 'map3tree2.glb', color: 0x88a068, isBuilding: false },
  { file: 'map3tree3.glb', color: 0x88a068, isBuilding: false },
  { file: 'map3tree4.glb', color: 0x88a068, isBuilding: false }
];
const map3Positions = [
  [0, 0, 5], [0, 0, 6], [0, 0, 5],
  [0, 0, -6], [0, 0, 6]
];
map3Extras.forEach(({ file, color, isBuilding }, i) => {
  loadModelWithTexture(file, color, 2, map3Positions[i], isBuilding);
});


// MAPA 4
const map4Extras = [
  { file: 'map4building.glb', color: 0x664422, isBuilding: true },
  { file: 'map4building1.glb', color: 0x664422, isBuilding: true },
  { file: 'map4building2.glb', color: 0x664422, isBuilding: true },
  { file: 'map4tree1.glb', color: 0x88a068, isBuilding: false },
  { file: 'map4tree2.glb', color: 0x88a068, isBuilding: false },
  { file: 'map4tree3.glb', color: 0x88a068, isBuilding: false }
];
const map4Positions = [
  [0, 0, 5], [0, 0, 6], [0, 0, 5],
  [0, 0, -6], [0, 0, 6], [0, 0, -6]
];
map4Extras.forEach(({ file, color, isBuilding }, i) => {
  loadModelWithTexture(file, color, 3, map4Positions[i], isBuilding);
});

export { models };
