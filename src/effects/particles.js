import * as THREE from 'three';
import { scene } from '../core/scene.js';

const particleCount = 50;
const particles = [];
// Geometría más pequeña para luciérnagas más delicadas
const particleGeometry = new THREE.SphereGeometry(0.05, 6, 6);
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
  // Posiciones más dispersas en un rango mayor
  p.position.set(
    (Math.random() - 0.5) * 40,  // rango más ancho
    (Math.random() - 0.5) * 40 + 2,
    (Math.random() - 0.5) * 40
  );
  // Velocidades más lentas para movimientos suaves y calmados
  p.userData.velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.005,
    (Math.random() - 0.5) * 0.005,
    (Math.random() - 0.5) * 0.005
  );
  particleGroup.add(p);
  particles.push(p);
}

let targetPosition = new THREE.Vector3();

function updateFireflyTargetFromMouse(mouseX, mouseY, camera) {
  // Proyectar el mouse en un plano delante de la cámara
  const vector = new THREE.Vector3(mouseX, mouseY, 0.5);
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = 10; // distancia desde cámara para el target
  targetPosition.copy(camera.position).add(dir.multiplyScalar(distance));
}

function updateParticles(delta = 0.016) {
  particles.forEach(p => {
    // Movimiento suave hacia el target con algo de ruido
    const toTarget = new THREE.Vector3().subVectors(targetPosition, p.position);
    toTarget.multiplyScalar(0.008); // velocidad hacia target más lenta

    // Movimiento aleatorio muy sutil para efecto mágico
    const noise = new THREE.Vector3(
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003
    );

    p.userData.velocity.add(toTarget).add(noise);
    p.userData.velocity.multiplyScalar(0.9); // más fricción para movimientos suaves

    p.position.add(p.userData.velocity);

    // Brillo pulsante sutil
    p.material.opacity = 0.6 + 0.4 * Math.sin(performance.now() * 0.003 + p.id);
  });
}

export { updateParticles, updateFireflyTargetFromMouse };
