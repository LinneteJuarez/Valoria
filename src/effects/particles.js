import * as THREE from 'three';
import { scene } from '../core/scene.js';

const particleCount = 50;
const particles = [];

const particleGeometry = new THREE.SphereGeometry(0.1, 6, 6);

const particleMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xffff66, transparent: true, opacity: 0.8 }),
  new THREE.MeshBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.8 }),
  new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.8 }),
];

const particleGroup = new THREE.Group();
scene.add(particleGroup);

for (let i = 0; i < particleCount; i++) {
  const mat = particleMaterials[Math.floor(Math.random() * particleMaterials.length)].clone();
  const p = new THREE.Mesh(particleGeometry, mat);

p.position.set(
  (Math.random() - 0.5) * 200,   // ancho X
  (Math.random() - 0.5) * 80 + 300, // altura Y centrada en 300 (o la altura de tu mapa)
  (Math.random() - 0.5) * 200    // profundidad Z
);
  p.userData.velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.005,
    (Math.random() - 0.5) * 0.005,
    (Math.random() - 0.5) * 0.005
  );
  particleGroup.add(p);
  particles.push(p);
}

let targetPosition = new THREE.Vector3();

/**
 * Proyecta las coordenadas del mouse (normalizadas al canvas) hacia el espacio 3D.
 * @param {number} mouseX - Coordenada X normalizada en [-1, 1]
 * @param {number} mouseY - Coordenada Y normalizada en [-1, 1]
 * @param {THREE.Camera} camera 
 */


function updateParticles(delta = 0.016) {
  particles.forEach(p => {
    const toTarget = new THREE.Vector3().subVectors(targetPosition, p.position);
    toTarget.multiplyScalar(0.008);

    const noise = new THREE.Vector3(
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003
    );

    p.userData.velocity.add(toTarget).add(noise);
    p.userData.velocity.multiplyScalar(0.9);
    p.position.add(p.userData.velocity);

    p.material.opacity = 0.6 + 0.4 * Math.sin(performance.now() * 0.003 + p.id);
  });
}

export { updateParticles};