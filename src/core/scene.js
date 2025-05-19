// src/core/scene.js
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.FogExp2(0xa8c8e0, 0.0008);

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 5000
);

// 🧭 Mover la cámara hacia la derecha y bajarla un poco para mejor perspectiva
camera.position.set(200, 250, 400);  // X=100 mueve la cámara a la derecha, Y=150 es más baja
camera.lookAt(50, 0, 0);             // Mira un poco más a la derecha también

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export { scene, camera, renderer };