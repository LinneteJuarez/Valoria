// src/maps/hotspots.js
import * as THREE from 'three';
import { scene } from '../core/scene.js';
import gsap from 'gsap';

const hotspotGroup = new THREE.Group();
scene.add(hotspotGroup);

// Posiciones distribuidas sobre mapas 1 a 4 (ajústalas según lo que ves)
const hotspotPositions = [
  { id: 'hs1', position: new THREE.Vector3(-50, 95, -110) }, // Mapa 1
  { id: 'hs2', position: new THREE.Vector3(-30, 95, 60) },   // Mapa 2
  { id: 'hs3', position: new THREE.Vector3(100, 95, 250) },  // Mapa 2
  { id: 'hs4', position: new THREE.Vector3(60, 95, -20) },   // Mapa 3
  { id: 'hs5', position: new THREE.Vector3(100, 95, 100) },  // Mapa 4
  { id: 'hs6', position: new THREE.Vector3(200, 95, 180) }   // Mapa 4
];

// Información asociada a cada hotspot
const hotspotData = {
  hs1: {
    title: 'El Inicio',
    text: 'Acantha despierta en un bosque desconocido...'
    // image: '/assets/hotspot1.jpg'
  },
  hs2: {
    title: 'El Portal',
    text: 'Encuentra una puerta de luz entre las raíces.'
  },
  hs3: {
    title: 'Aliado Secreto',
    text: 'Una criatura la guía en su viaje.'
  },
  hs4: {
    title: 'Laberinto de Cristal',
    text: 'El lugar donde Acantha enfrenta sus dudas.'
  },
  hs5: {
    title: 'La Torre del Tiempo',
    text: 'Aquí aprende sobre su linaje olvidado.'
  },
  hs6: {
    title: 'Última Elección',
    text: 'Una decisión que cambiará Valoria para siempre.'
  }
};

// Geometría y material de los hotspots
const hotspotMaterial = new THREE.MeshStandardMaterial({
  color: 0xffcc00,
  emissive: 0xffa500,
  roughness: 0.4,
  metalness: 0.3
});
const hotspotGeometry = new THREE.SphereGeometry(2, 32, 32);

const hotspots = [];

hotspotPositions.forEach(({ id, position }) => {
  const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial.clone());
  hotspot.position.copy(position);
  hotspot.name = id;
  hotspot.userData.isHotspot = true;

  // Animación de flotación con gsap
  gsap.to(hotspot.position, {
    y: position.y + 2,
    duration: 2 + Math.random(),
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  hotspotGroup.add(hotspot);
  hotspots.push(hotspot);
});

// ✅ Exporta todo al final
export { hotspots, hotspotData };
