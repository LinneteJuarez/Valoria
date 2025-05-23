import * as THREE from 'three';

export function initAudio(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const sound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('/sounds/sonidoIdle.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
  });
}

export function playAudio() {
  if (sound && !sound.isPlaying) {
    console.log("▶️ Reproduciendo sonido...");
    sound.play();
  } else {
    console.log("⚠️ No se pudo reproducir.");
  }
}


