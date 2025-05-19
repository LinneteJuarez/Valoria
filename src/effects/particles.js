// src/effects/particles.js
import * as THREE from 'three';
import { scene } from '../core/scene';

const particleGroups = [];
const particleCount = 80;
const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8);
const particleMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.9 }),
  new THREE.MeshBasicMaterial({ color: 0xff66ff, transparent: true, opacity: 0.9 }),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 })
];

function createMagicParticles(position) {
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);

  for (let i = 0; i < particleCount; i++) {
    const material = particleMaterials[Math.floor(Math.random() * particleMaterials.length)].clone();
    const particle = new THREE.Mesh(particleGeometry, material);
    particle.position.copy(position);
    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.8,
      Math.random() * 1.5,
      (Math.random() - 0.5) * 0.8
    );
    particle.userData.lifetime = 1.5 + Math.random() * 1.5;
    particle.userData.age = 0;
    particleGroup.add(particle);
  }

  particleGroups.push(particleGroup);

  setTimeout(() => {
    scene.remove(particleGroup);
    const index = particleGroups.indexOf(particleGroup);
    if (index > -1) particleGroups.splice(index, 1);
  }, 3000);
}

function updateParticles(delta = 0.016) {
  particleGroups.forEach(group => {
    group.children.forEach(particle => {
      particle.userData.age += delta;
      particle.position.addScaledVector(particle.userData.velocity, 0.8);
      particle.userData.velocity.y -= 0.03;
      particle.userData.velocity.multiplyScalar(0.97);
      const lifeRatio = particle.userData.age / particle.userData.lifetime;
      if (lifeRatio > 1) {
        particle.visible = false;
      } else {
        particle.material.opacity = 1 - lifeRatio;
        particle.scale.setScalar(
          Math.max(0.2, 1 - lifeRatio) * (0.9 + Math.sin(particle.userData.age * 10) * 0.3)
        );
      }
    });
  });
}

export { createMagicParticles, updateParticles };
