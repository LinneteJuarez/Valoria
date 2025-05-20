import * as THREE from 'three';

// Create elements but DON'T append the renderer to document yet
// (we need to make sure the DOM is loaded first)
const container = document.getElementById('right'); // This might be null if DOM isn't ready!

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(
  60,
  container ? container.clientWidth / container.clientHeight : window.innerWidth / window.innerHeight,
  0.1,
  5000
);
camera.position.set(-100, 650, 350);
camera.lookAt(50, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);  // Negro con 0 de opacidad (transparente)
// Initialize with fallback values in case container isn't ready
renderer.setSize(
  container ? container.clientWidth : window.innerWidth, 
  container ? container.clientHeight : window.innerHeight
);
renderer.setPixelRatio(window.devicePixelRatio);

// Critical change: Only append if container exists, else wait
function initRenderer() {
  const container = document.getElementById('right');
  if (container && !container.querySelector('canvas')) {
    container.appendChild(renderer.domElement);
    console.log('Three.js renderer added to container');
    
    // Update sizes with real container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  } else if (!container) {
    console.error('Container #right not found in DOM');
  }
}

// Add window resize handler
window.addEventListener('resize', () => {
  const container = document.getElementById('right');
  if (container) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
});

// Execute this when DOM is ready to ensure container exists
document.addEventListener('DOMContentLoaded', initRenderer);

// Alternatively, if page is already loaded, run immediately
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initRenderer, 0);
}

export { scene, camera, renderer };