import * as THREE from 'three';

let clickSound;

export function initClickSound(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  clickSound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load('/sounds/sonidoHS.mp3', function(buffer) {
    clickSound.setBuffer(buffer);
    clickSound.setLoop(false);
    clickSound.setVolume(0.7);
  });
}

export function playClickSound() {
  if (clickSound && !clickSound.isPlaying) {
    clickSound.play();
  }
}
