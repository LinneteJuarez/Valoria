import './core/scene.js';
import './core/lights.js';
import './maps/mapsLoader.js';
import './maps/extrasLoader.js';
import './effects/particles.js';
import './effects/hoverEffects.js';
import './core/events.js';       // <-- Aquí importa la lógica de eventos y animación
import './maps/hotspots.js';
import { camera } from './core/scene.js'; // Ajusta la ruta si es diferente
import { initAudio } from './audio/background.js';

initAudio(camera);

startButton.addEventListener('click', () => {
  playAudio(); // al hacer clic
  // el resto de tu lógica: mostrar mapa, ocultar splash, etc.
  });