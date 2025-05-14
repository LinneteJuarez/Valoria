// Add helper function to smoothly rotate the map
function rotateMap(mapObject) {
  if (!mapObject) return;
  
  // Smoothly interpolate current rotation towards target rotation
  currentRotationX += (targetRotationX - currentRotationX) * 0.05;
  currentRotationY += (targetRotationY - currentRotationY) * 0.05;
  
  // Apply rotation to the map
  if (hovering) {
    mapObject.rotation.x = currentRotationX;
    mapObject.rotation.y += (targetRotationY - mapObject.rotation.y) * 0.05;
  }
}// Make sure we have a raycaster defined before the mouse event listener
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

// Crear la escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Fondo azul cielo

// Add subtle fog for atmosphere - reduced from previous
scene.fog = new THREE.FogExp2(0xa8c8e0, 0.0008);

// Add stars in the background
const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 1000 - 500;  // Behind the scene
  starPositions.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 1.5,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Crear la cámara
const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 5000
);
camera.position.set(0, 200, 500);
camera.lookAt(0, -30, 0);

// Crear el renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Agregar luces con sombras suaves
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(100, 300, 100);
dirLight.castShadow = true;
scene.add(dirLight);

// Add magical point lights that will activate on hover
const magicLights = [];
const lightColors = [0x9966ff, 0x66ffff, 0xffcc00];

for (let i = 0; i < 3; i++) {
  const pointLight = new THREE.PointLight(lightColors[i], 0, 30); // Reduced range from 50
  // Position lights closer to the center of the map
  pointLight.position.set(
    (Math.random() - 0.5) * 20, // Reduced from 50
    15 + Math.random() * 10,
    (Math.random() - 0.5) * 20  // Reduced from 50
  );
  scene.add(pointLight);
  magicLights.push(pointLight);
}

// Loader
const loader = new GLTFLoader();
const zones = [];
const models = [];

// Restore original positions from your code
const positions = [
  [0, 0, 2],      // map1
  [0, 0, 2],      // map2
  [0, 0, 2],      // map3
  [0, 0, 2],      // map4
  [0, 0, 2],      // map5
  [0, 0, 2]       // map6
];

// Tracking hover state
let currentHover = null;
let hovering = false;

// Debug helper function
function logModelInfo(prefix, model) {
  console.log(`${prefix} - Position:`, 
    model.position.x.toFixed(2), 
    model.position.y.toFixed(2), 
    model.position.z.toFixed(2),
    'Scale:',
    model.scale.x.toFixed(3),
    model.scale.y.toFixed(3),
    model.scale.z.toFixed(3));
}

// Cargar mapas
for (let i = 0; i < 6; i++) {
  loader.load(`/models/${i + 1}.glb`, (gltf) => {
    const model = gltf.scene;
    
    // Set position from the corrected positions array
    model.position.set(positions[i][0], positions[i][1], positions[i][2]);
    
    // Use green colors with different shades
    const baseColor = i === 0 ? 0x4a7c3c : 0x558b2f;
    
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.9,
          metalness: 0.1,
          flatShading: true
        });
        // Store original color for hover effects
        child.userData.originalColor = baseColor;
        child.userData.hoverColor = i === 0 ? 0x3a5f2e : 0x3d6320; // Darker green for hover
        
        // Enable shadows for all meshes
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.userData.id = `map${i + 1}`;
    scene.add(model);
    zones.push(model);
    
    console.log(`Loaded map${i + 1} at position:`, positions[i]);
  }, 
  // Add loading progress handler
  (xhr) => {
    console.log(`Loading map ${i+1}: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
  },
  // Add error handler
  (error) => {
    console.error(`Error loading map ${i+1}:`, error);
  });
}

// Fixed model positions - adjust to be relative to map1 position
const extraPositions = [
  [0, 0, 0],       // building - slight Y offset to prevent z-fighting
  [0, 0, -5],     // tree1
  [0, 0, 5],       // tree2
  [0, 0, -8]       // tree3
];

// Cargar elementos de mapa 1
const extras = [
  { file: 'map1building.glb', color: 0x334422 },
  { file: 'map1tree1.glb', color: 0x88a068 },
  { file: 'map1tree2.glb', color: 0x88a068 },
  { file: 'map1tree3.glb', color: 0x88a068 }
];

extras.forEach(({ file, color }, index) => {
  loader.load(`/models/${file}`, (gltf) => {
    const model = gltf.scene;
    
    // Position the model on map1 using the new positions array
    // Adjust by adding map1's position for correct placement
    model.position.set(
      positions[0][0] + extraPositions[index][0],
      positions[0][1] + extraPositions[index][1],
      positions[0][2] + extraPositions[index][2]
    );
    
    model.traverse((child) => {
      if (child.isMesh) {
        // Create materials that start invisible but not completely transparent
        const material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.9,
          metalness: 0.05,
          flatShading: true,
          transparent: true,
          opacity: 0.05  // Start slightly visible to ensure it's working
        });
        child.material = material;
        
        // Enable shadows
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Set scale to 0.1 instead of 0.001 to be more visible for testing
    model.scale.set(0.1, 0.1, 0.1);
    model.userData.initialScale = new THREE.Vector3(1, 1, 1);
    model.userData.originalY = model.position.y;
    model.userData.visible = false;

    scene.add(model);
    models.push(model);
    
    console.log(`Loaded ${file} at position:`, 
      model.position.x, model.position.y, model.position.z,
      'with scale:', model.scale.x, model.scale.y, model.scale.z);
  },
  // Add loading progress handler 
  (xhr) => {
    console.log(`Loading ${file}: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
  },
  // Add error handler
  (error) => {
    console.error(`Error loading ${file}:`, error);
  });
});

// Elementos de mapa 2
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

const map2ExtraPositions = [
  [0, 0, 5],
  [0, 0, 6],
  [0, 0, 5],
  [0, 0, -6],
  [0, 0, 6],
  [0, 0, -6]
];

map2Extras.forEach(({ file, color }, index) => {
  loader.load(`/models/${file}`, (gltf) => {
    const model = gltf.scene;

    model.position.set(
      positions[1][0] + map2ExtraPositions[index][0],
      positions[1][1] + map2ExtraPositions[index][1],
      positions[1][2] + map2ExtraPositions[index][2]
    );

    model.traverse((child) => {
      if (child.isMesh) {
        const material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.9,
          metalness: 0.05,
          flatShading: true,
          transparent: true,
          opacity: 0.05
        });
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.scale.set(0.1, 0.1, 0.1);
    model.userData.initialScale = new THREE.Vector3(1, 1, 1);
    model.userData.originalY = model.position.y;
    model.userData.visible = false;

    scene.add(model);
    models.push(model);

    console.log(`Loaded ${file} for map2 at position:`, model.position);
  },
  (xhr) => {
    console.log(`Loading ${file} for map2: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
  },
  (error) => {
    console.error(`Error loading ${file} for map2:`, error);
  });
});

// Elementos de mapa 3
const map3Extras = [
  { file: 'map3building.glb', color: 0x664422 },
  { file: 'map3tree1.glb', color: 0x88a068 },
  { file: 'map3tree2.glb', color: 0x88a068 },
  { file: 'map3tree3.glb', color: 0x88a068 },
  { file: 'map3tree4.glb', color: 0x88a068 },
];

const map3ExtraPositions = [
  [0, 0, 5],
  [0, 0, 6],
  [0, 0, 5],
  [0, 0, -6],
  [0, 0, 6],
  [0, 0, -6]
];

map3Extras.forEach(({ file, color }, index) => {
  loader.load(`/models/${file}`, (gltf) => {
    const model = gltf.scene;

    model.position.set(
      positions[1][0] + map3ExtraPositions[index][0],
      positions[1][1] + map3ExtraPositions[index][1],
      positions[1][2] + map3ExtraPositions[index][2]
    );

    model.traverse((child) => {
      if (child.isMesh) {
        const material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.9,
          metalness: 0.05,
          flatShading: true,
          transparent: true,
          opacity: 0.05
        });
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.scale.set(0.1, 0.1, 0.1);
    model.userData.initialScale = new THREE.Vector3(1, 1, 1);
    model.userData.originalY = model.position.y;
    model.userData.visible = false;

    scene.add(model);
    models.push(model);

    console.log(`Loaded ${file} for map3 at position:`, model.position);
  },
  (xhr) => {
    console.log(`Loading ${file} for map3: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
  },
  (error) => {
    console.error(`Error loading ${file} for map3:`, error);
  });
});

// Elementos de mapa 4
const map4Extras = [
  { file: 'map4building.glb', color: 0x664422 },
   { file: 'map4building1.glb', color: 0x664422 },
    { file: 'map4building2.glb', color: 0x664422 },
  { file: 'map4tree1.glb', color: 0x88a068 },
  { file: 'map4tree2.glb', color: 0x88a068 },
  { file: 'map4tree3.glb', color: 0x88a068 },
];

const map4ExtraPositions = [
  [0, 0, 5],
  [0, 0, 6],
  [0, 0, 5],
  [0, 0, -6],
  [0, 0, 6],
  [0, 0, -6]
];

map4Extras.forEach(({ file, color }, index) => {
  loader.load(`/models/${file}`, (gltf) => {
    const model = gltf.scene;

    model.position.set(
      positions[1][0] + map4ExtraPositions[index][0],
      positions[1][1] + map4ExtraPositions[index][1],
      positions[1][2] + map4ExtraPositions[index][2]
    );

    model.traverse((child) => {
      if (child.isMesh) {
        const material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.9,
          metalness: 0.05,
          flatShading: true,
          transparent: true,
          opacity: 0.05
        });
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.scale.set(0.1, 0.1, 0.1);
    model.userData.initialScale = new THREE.Vector3(1, 1, 1);
    model.userData.originalY = model.position.y;
    model.userData.visible = false;

    scene.add(model);
    models.push(model);

    console.log(`Loaded ${file} for map4 at position:`, model.position);
  },
  (xhr) => {
    console.log(`Loading ${file} for map4: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
  },
  (error) => {
    console.error(`Error loading ${file} for map4:`, error);
  });
});

const map5Extras = [
  { file: 'map5building.glb', color: 0x664422 },
  { file: 'map5tree1.glb', color: 0x88a068 },
  { file: 'map5tree2.glb', color: 0x88a068 },
  { file: 'map5tree3.glb', color: 0x88a068 },
];

const map5ExtraPositions = [
  [10, 0, 5],  // ajusta las posiciones
  [15, 0, 6],
  [20, 0, 5],
  [25, 0, -6]
];

map5Extras.forEach(({ file, color }, index) => {
  loader.load(`/models/${file}`, (gltf) => {
    const model = gltf.scene;

    model.position.set(
      positions[4][0] + map5ExtraPositions[index][0],
      positions[4][1] + map5ExtraPositions[index][1],
      positions[4][2] + map5ExtraPositions[index][2]
    );

    model.traverse((child) => {
      if (child.isMesh) {
        const material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.9,
          metalness: 0.05,
          flatShading: true,
          transparent: true,
          opacity: 1 // Cambiado de 0.05 a 1
        });
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.scale.set(0.1, 0.1, 0.1);
    model.userData.initialScale = new THREE.Vector3(1, 1, 1);
    model.userData.originalY = model.position.y;
    model.userData.visible = false;

    scene.add(model);
    models.push(model);

    const box = new THREE.BoxHelper(model, 0xffff00); // Ayuda visual
    scene.add(box);

    console.log(`Loaded ${file} for map5 at position:`, model.position);
  },
  (xhr) => {
    console.log(`Loading ${file} for map5: ${(xhr.loaded / xhr.total * 100).toFixed(0)}%`);
  },
  (error) => {
    console.error(`Error loading ${file} for map5:`, error);
  });
});

const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.set(positions[4][0], positions[4][1] + 1, positions[4][2]);
scene.add(cube);

// Global variables for mouse movement tracking
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

// Track mouse movement across entire document
document.addEventListener('mousemove', (event) => {
  // Update normalized mouse coordinates for raycasting
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Store mouse position for rotation effect
  mouseX = event.clientX - window.innerWidth / 2;
  mouseY = event.clientY - window.innerHeight / 2;
  
  // Map mouse movement to rotation targets
  // Reduced rotation amount for subtle effect
  targetRotationY = mouseX * 0.0001;
  targetRotationX = mouseY * 0.0001;
});

// Click event listener to help debugging
window.addEventListener('click', () => {
  console.log("Click detected");
  
  // Log camera position
  console.log("Camera position:", 
    camera.position.x.toFixed(2), 
    camera.position.y.toFixed(2), 
    camera.position.z.toFixed(2));
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    console.log("Clicked on:", intersects[0].object);
    
    // Find the root object (map) that was clicked
    let targetObject = intersects[0].object;
    while (targetObject && !targetObject.userData.id) {
      targetObject = targetObject.parent;
    }
    
    if (targetObject && targetObject.userData.id) {
      console.log("Clicked map:", targetObject.userData.id);
      
      // Force hover effect on map1 for testing
      if (targetObject.userData.id === 'map1') {
        handleHoverState('map1');
      }
    }
  } else {
    console.log("No object clicked");
  }
});

// Particle system for magical effects
const particleGroups = [];
const particleCount = 80; // Increased from 50 for more visibility
const particleGeometry = new THREE.SphereGeometry(0.5, 8, 8); // Increased size from 0.2
const particleMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.9 }), // Increased opacity
  new THREE.MeshBasicMaterial({ color: 0xff66ff, transparent: true, opacity: 0.9 }),
  new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 })
];

function createMagicParticles(position) {
  // Create new particle group
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);
  
  // Add particles to the group
  for (let i = 0; i < particleCount; i++) {
    const material = particleMaterials[Math.floor(Math.random() * particleMaterials.length)].clone();
    const particle = new THREE.Mesh(particleGeometry, material);
    
    // Set particle at the mouse intersection point
    particle.position.copy(position);
    
    // Reduced velocity values for more contained movement
    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.8, // Reduced from 2
      Math.random() * 1.5,         // Reduced from 3
      (Math.random() - 0.5) * 0.8  // Reduced from 2
    );
    
    // Set particle lifetime
    particle.userData.lifetime = 1.5 + Math.random() * 1.5;
    particle.userData.age = 0;
    
    particleGroup.add(particle);
  }
  
  // Store the particle group for animation
  particleGroups.push(particleGroup);
  
  // Remove after all particles have disappeared
  setTimeout(() => {
    scene.remove(particleGroup);
    const index = particleGroups.indexOf(particleGroup);
    if (index > -1) {
      particleGroups.splice(index, 1);
    }
  }, 3000);
}

// Function to handle hover state changes
function handleHoverState(hoveredMapId) {
  // If we're hovering a new zone or changing from no hover to hover
  if (hoveredMapId !== currentHover) {
    console.log("Hover state changed from", currentHover, "to", hoveredMapId);
    
    // Kill all existing animations to prevent conflicts
    models.forEach((model) => {
      gsap.killTweensOf(model.scale);
      gsap.killTweensOf(model.position);
    });
    
    // Kill light animations
    magicLights.forEach(light => {
      gsap.killTweensOf(light);
    });
    
    currentHover = hoveredMapId;
    
    // Map 1 hover effects
    if (hoveredMapId === 'map1') {
      hovering = true;
      console.log("Activating map1 hover effects");
      
      // Get reference to map1
      const map1 = zones.find(zone => zone.userData.id === 'map1');
      if (map1) {
        // Reset rotation to prepare for mouse controlled rotation
        // Keep a slight tilt for better visibility
        gsap.to(map1.rotation, {
          x: 0.05,
          y: 0,
          z: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      
      // Magical shimmer effect with light animation
      magicLights.forEach((light, index) => {
        // Activate the light with a random delay
        gsap.to(light, {
          intensity: 1.5 + Math.random() * 0.5,
          delay: index * 0.2,
          duration: 0.8,
          ease: 'power2.out'
        });
        
        // Create circular motion for the light
        gsap.to(light.position, {
          x: light.position.x + (Math.random() - 0.5) * 8, // Reduced from 20
          z: light.position.z + (Math.random() - 0.5) * 8, // Reduced from 20
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
      
      // Show models with magical reveal
      models.forEach((model, index) => {
        console.log(`Revealing model ${index}`);
        logModelInfo(`Before reveal model ${index}`, model);
        
        // First make sure opacity is set to 1
        model.traverse((child) => {
          if (child.isMesh && child.material.transparent) {
            gsap.to(child.material, {
              opacity: 1,
              duration: 0.5,
              delay: index * 0.1
            });
          }
        });
        
        // Reveal effect with slight delay between models - scale up from current scale
        gsap.to(model.scale, {
          x: 1, y: 1, z: 1,
          duration: 1.2,
          delay: index * 0.15,
          ease: 'elastic.out(1, 0.75)',
          onUpdate: () => {
            if (index === 0 && Math.round(model.scale.x * 100) % 20 === 0) {
              logModelInfo(`During reveal model ${index}`, model);
            }
          },
          onComplete: () => {
            logModelInfo(`After reveal model ${index}`, model);
          }
        });
        
        // Add gentle floating animation with smaller range
        gsap.to(model.position, {
          y: model.userData.originalY + 1.5 + (index * 0.25), // Reduced from 3 + (index * 0.5)
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
        
        model.userData.visible = true;
        
        // Add very subtle rotation for more magic
        gsap.to(model.rotation, {
          y: model.rotation.y + Math.PI * 0.01, // Reduced from 0.03
          duration: 3 + index,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut'
        });
      });
    } 
    // No hover or different zone hover
    else {
      hovering = false;
      console.log("Deactivating hover effects");
      
      // Find map1 and reset its rotation
      const map1 = zones.find(zone => zone.userData.id === 'map1');
      if (map1) {
        gsap.to(map1.rotation, {
          x: 0, 
          y: 0,
          z: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
      
      // Turn off magic lights
      magicLights.forEach(light => {
        gsap.to(light, {
          intensity: 0,
          duration: 0.8,
          ease: 'power2.in'
        });
      });
      
      models.forEach((model, index) => {
        if (model.userData.visible) {
          console.log(`Hiding model ${index}`);
          
          // Make meshes transparent before scaling down
          model.traverse((child) => {
            if (child.isMesh && child.material.transparent) {
              gsap.to(child.material, {
                opacity: 0,
                duration: 0.5
              });
            }
          });
          
          // Hide models with magical disappear effect
          gsap.to(model.scale, {
            x: 0.1, y: 0.1, z: 0.1, // Changed from 0.001 for better visibility during testing
            duration: 0.6,
            ease: 'back.in(1.5)'
          });
          
          // Reset position
          gsap.to(model.position, {
            y: model.userData.originalY,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
              model.userData.visible = false;
              gsap.killTweensOf(model.rotation);
            }
          });
        }
      });
    }
  }
}

// Add debug box to visualize where map1 should be
function addDebugBox() {
  const geometry = new THREE.BoxGeometry(10, 2, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  });
  const debugBox = new THREE.Mesh(geometry, material);
  debugBox.position.set(positions[0][0], positions[0][1], positions[0][2]);
  scene.add(debugBox);
  console.log("Added debug box at:", debugBox.position.x, debugBox.position.y, debugBox.position.z);
}

// Uncomment to add visual guide
// addDebugBox();

// Animar
function animate() {
  requestAnimationFrame(animate);

  // Animate particles
  particleGroups.forEach(group => {
    group.children.forEach(particle => {
      // Update particle age
      particle.userData.age += 0.016; // Approximately one frame at 60fps
      
      // Move particle based on its velocity (with reduced movement)
      particle.position.x += particle.userData.velocity.x * 0.8; // Added multiplier to slow movement
      particle.position.y += particle.userData.velocity.y * 0.8;
      particle.position.z += particle.userData.velocity.z * 0.8;
      
      // Slow down as it ages
      particle.userData.velocity.y -= 0.03;  // Reduced gravity from 0.05
      particle.userData.velocity.multiplyScalar(0.97); // Increased friction from 0.98
      
      // Fade out as it ages
      const lifeRatio = particle.userData.age / particle.userData.lifetime;
      if (lifeRatio > 1) {
        particle.visible = false;
      } else {
        particle.material.opacity = 1 - lifeRatio;
        
        // Make particles twinkle with increased visibility
        particle.scale.setScalar(
          Math.max(0.2, 1 - lifeRatio) * (0.9 + Math.sin(particle.userData.age * 10) * 0.3) // Increased twinkle effect
        );
      }
    });
  });
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(zones, true);

  // Find map1 for rotation effect
  const map1 = zones.find(zone => zone.userData.id === 'map1');
  
  // Always apply gentle rotation to map1 if it's being hovered
  if (map1) {
    rotateMap(map1);
  }

  // Handle hover states
  if (intersects.length > 0) {
    // Find the parent object with userData.id
    let targetObject = intersects[0].object;
    while (targetObject && !targetObject.userData.id) {
      targetObject = targetObject.parent;
    }
    
    if (targetObject && targetObject.userData.id) {
      handleHoverState(targetObject.userData.id);
      document.body.style.cursor = 'pointer'; // Change cursor to indicate interactivity
      
      // Create magical particles at intersection point - but not every frame to avoid too many particles
      if (targetObject.userData.id === 'map1' && Math.random() < 0.1) { // Increased probability from 0.05
        createMagicParticles(intersects[0].point);
      }
    } else {
      handleHoverState(null);
      document.body.style.cursor = 'default';
    }
  } else {
    handleHoverState(null);
    document.body.style.cursor = 'default';
  }

  // Add pulsing to ambient light - but more subtle
  if (hovering) {
    ambientLight.intensity = 0.6 + Math.sin(Date.now() * 0.0005) * 0.05; // Reduced pulse intensity from 0.1
  } else {
    ambientLight.intensity = 0.6;
  }

  renderer.render(scene, camera);
}
animate();

// Ajustar tamaño de la ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});