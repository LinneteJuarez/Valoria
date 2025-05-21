import * as THREE from 'three';
import { scene, camera, renderer } from './scene.js';

const particleCount = 50;
const particles = [];

const particleGeometry = new THREE.SphereGeometry(3, 8, 8); // Aumentado para visibilidad
const particleMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xffff66, transparent: true, opacity: 0.9 }),
  new THREE.MeshBasicMaterial({ color: 0xffcc33, transparent: true, opacity: 0.9 }),
  new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.9 }),
];

const particleGroup = new THREE.Group();
scene.add(particleGroup);

for (let i = 0; i < particleCount; i++) {
  const mat = particleMaterials[Math.floor(Math.random() * particleMaterials.length)].clone();
  const p = new THREE.Mesh(particleGeometry, mat);

  // Posición inicial centrada donde mira la cámara
  p.position.set(
    Math.random() * 200 - 50,  // X: -50 a 150
    Math.random() * 60 + 600,  // Y: 600 a 660
    Math.random() * 200 + 200  // Z: 200 a 400
  );

  p.userData.velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2
  );

  particleGroup.add(p);
  particles.push(p);
}

function updateParticles(delta = 0.016) {
  const bounds = {
    xMin: -100,
    xMax: 200,
    yMin: 580,
    yMax: 680,
    zMin: 150,
    zMax: 500,
  };

  particles.forEach(p => {
    const noise = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    );

    p.userData.velocity.add(noise);
    p.userData.velocity.multiplyScalar(0.95);
    p.position.add(p.userData.velocity);

    // Rebote en los límites
    if (p.position.x < bounds.xMin || p.position.x > bounds.xMax) p.userData.velocity.x *= -1;
    if (p.position.y < bounds.yMin || p.position.y > bounds.yMax) p.userData.velocity.y *= -1;
    if (p.position.z < bounds.zMin || p.position.z > bounds.zMax) p.userData.velocity.z *= -1;

    // Opacidad oscilante
    p.material.opacity = 0.6 + 0.4 * Math.sin(performance.now() * 0.002 + p.id);
  });
}

// Loop de animación
function animate(time) {
  requestAnimationFrame(animate);
  updateParticles(time * 0.001);
  renderer.render(scene, camera);
}

animate();