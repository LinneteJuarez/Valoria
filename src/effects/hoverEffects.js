import { gsap } from 'gsap';
import { magicLights } from '../core/lights.js';
import { models } from '../maps/extrasLoader.js';
import { zones } from '../maps/mapsLoader.js';
import { setHovering } from '../utils/rotateMap.js';

// Cache for smoother transitions between hovers
let currentHover = null;
let activeAnimations = {};
const validMaps = ['map1', 'map2', 'map3', 'map4', 'map5'];

// Timing and easing configurations for consistent animations
const timings = {
  rotation: 0.4,
  lights: 0.6,
  models: {
    show: 0.8,
    float: 2.5,
    rotate: 3.2
  }
};

// Standardized easing curves
const easings = {
  enter: 'power2.out',
  exit: 'power1.inOut',
  float: 'sine.inOut',
  bounce: 'elastic.out(1, 0.6)'
};

/**
 * Handle hover state with optimized animations
 * @param {string} hoveredMapId - The ID of the currently hovered map
 */
function handleHoverState(hoveredMapId) {
  // No change in hover state, exit early
  if (hoveredMapId === currentHover) return;
  
  // Clean up any existing animations to prevent conflicts
  cleanupActiveAnimations();
  
  const previousHover = currentHover;
  currentHover = hoveredMapId;
  
  const hoveredMap = zones.find(zone => zone.userData.id === hoveredMapId);
  const isValidHover = validMaps.includes(hoveredMapId) && hoveredMap;
  
  // Update hover state
  setHovering(isValidHover);
  
  if (isValidHover) {
    // Activate hover effects
    animateMapHover(hoveredMap);
    animateLights(true);
    animateModels(true);
    
    // Create particles if available
    if (typeof createMagicParticles === 'function') {
      createMagicParticles(hoveredMap.position, 15);
    }
  } else {
    // Reset everything to default state
    resetAllAnimations();
  }
}

/**
 * Clean up any active animations to prevent conflicts
 */
function cleanupActiveAnimations() {
  Object.keys(activeAnimations).forEach(key => {
    if (activeAnimations[key] && activeAnimations[key].kill) {
      activeAnimations[key].kill();
    }
  });
  activeAnimations = {};
}

/**
 * Animate the map on hover
 * @param {Object} hoveredMap - The map object currently being hovered
 */
function animateMapHover(hoveredMap) {
  // Create a subtle floating effect for the hovered map
  activeAnimations.mapRotation = gsap.to(hoveredMap.rotation, {
    x: 0.04,
    y: 0.01,
    z: 0.005,
    duration: timings.rotation,
    ease: easings.enter,
    onComplete: () => {
      // Add a subtle continuous movement
      activeAnimations.mapFloat = gsap.to(hoveredMap.position, {
        y: hoveredMap.position.y + 0.2,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: easings.float
      });
    }
  });
  
  // Reset rotation for other maps
  zones.forEach(zone => {
    if (zone !== hoveredMap) {
      gsap.to(zone.rotation, {
        x: 0, y: 0, z: 0,
        duration: timings.rotation,
        ease: easings.exit
      });
    }
  });
}

/**
 * Animate lights based on hover state
 * @param {boolean} active - Whether lights should be active
 */
function animateLights(active) {
  const timeline = gsap.timeline();
  
  magicLights.forEach((light, index) => {
    const delay = index * 0.12;
    
    if (active) {
      // Create a staggered light activation effect
      timeline.to(light, {
        intensity: 1.2 + Math.random() * 0.4,
        duration: timings.lights,
        delay,
        ease: easings.enter
      }, 0);
      
      // Add subtle movement to lights
      activeAnimations[`light${index}`] = gsap.to(light.position, {
        x: light.position.x + (Math.random() - 0.5) * 6,
        z: light.position.z + (Math.random() - 0.5) * 6,
        duration: timings.models.float + (index * 0.5),
        repeat: -1,
        yoyo: true,
        ease: easings.float
      });
    } else {
      // Fade out lights smoothly
      timeline.to(light, {
        intensity: 0,
        duration: timings.lights * 0.8,
        delay: delay * 0.5,
        ease: easings.exit
      }, 0);
    }
  });
  
  activeAnimations.lightsTimeline = timeline;
}

/**
 * Animate associated models based on hover state
 * @param {boolean} active - Whether models should be visible and animated
 */
function animateModels(active) {
  models.forEach((model, index) => {
    const delay = index * 0.08;
    
    if (active) {
      // Fade in and scale up with staggered timing
      model.visible = true;
      model.userData.visible = true;
      
      // Create a timeline for coordinated animations
      const modelTimeline = gsap.timeline();
      
      model.traverse((child) => {
        if (child.isMesh && child.material.transparent) {
          modelTimeline.to(child.material, {
            opacity: 1,
            duration: timings.models.show * 0.8,
            ease: easings.enter
          }, 0);
        }
      });
      
      // Scale up with a bounce effect
      modelTimeline.to(model.scale, {
        x: 1, y: 1, z: 1,
        duration: timings.models.show,
        ease: easings.bounce
      }, delay * 0.5);
      
      // Add floating animation
      activeAnimations[`modelFloat${index}`] = gsap.to(model.position, {
        y: model.userData.originalY + 1 + (index * 0.15),
        duration: timings.models.float + (index * 0.3),
        yoyo: true,
        repeat: -1,
        ease: easings.float,
        delay: delay
      });
      

      
      activeAnimations[`modelTimeline${index}`] = modelTimeline;
    } else {
      // Fade out and scale down models
      if (model.userData.visible) {
        const hideTimeline = gsap.timeline({
          onComplete: () => {
            model.userData.visible = false;
          }
        });
        
        model.traverse((child) => {
          if (child.isMesh && child.material.transparent) {
            hideTimeline.to(child.material, {
              opacity: 0,
              duration: timings.models.show * 0.6,
              ease: easings.exit
            }, 0);
          }
        });
        
        hideTimeline.to(model.scale, {
          x: 0.01, y: 0.01, z: 0.01,
          duration: timings.models.show * 0.7,
          ease: easings.exit
        }, 0);
        
        hideTimeline.to(model.position, {
          y: model.userData.originalY,
          duration: timings.models.show * 0.5,
          ease: easings.exit
        }, 0);
        
        activeAnimations[`modelHideTimeline${index}`] = hideTimeline;
      }
    }
  });
}

/**
 * Reset all animations to default state
 */
function resetAllAnimations() {
  // Reset all zone rotations
  zones.forEach(zone => {
    gsap.to(zone.rotation, {
      x: 0, y: 0, z: 0,
      duration: timings.rotation,
      ease: easings.exit
    });
    
    gsap.to(zone.position, {
      y: zone.userData.originalY || zone.position.y,
      duration: timings.rotation,
      ease: easings.exit
    });
  });
  
  // Turn off lights
  animateLights(false);
  
  // Hide models
  animateModels(false);
}

export { handleHoverState };