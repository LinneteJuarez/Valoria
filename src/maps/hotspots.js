import * as THREE from 'three'; 
import { scene, camera, renderer, rotationGroup } from '../core/scene.js';
import gsap from 'gsap';

const hotspotGroup = new THREE.Group();
rotationGroup.add(hotspotGroup);

// Posiciones distribuidas sobre mapas 1 a 4
const hotspotPositions = [
  { id: 'hs1', position: new THREE.Vector3( 10, 305, -20) },
  { id: 'hs2', position: new THREE.Vector3(90, 255, 120) },
  { id: 'hs3', position: new THREE.Vector3(-40, 205, -60) },
  { id: 'hs4', position: new THREE.Vector3(160, 295, 30) },
  { id: 'hs5', position: new THREE.Vector3(90, 245, 250) },
  { id: 'hs6', position: new THREE.Vector3(-110, 300, -170) }
];

// Información asociada a cada hotspot con tus textos completos
const hotspotData = {
  hs1: { 
    title: 'Un Legado de Magia', 
    text: `En un pueblo llamado Valoria, en una casa en lo alto de una montaña desde donde se podía ver todo, vivía una bruja llamada Acantha. Todos en el pueblo la conocían bien, pues protegía la aldea y ayudaba a sus habitantes con su magia.
Acantha creció con su madre, quien también era bruja, y le enseñó todo lo que sabía. Desde pequeña estuvo rodeada por la belleza de la naturaleza, conectada con sus emociones y su magia. Los aldeanos la vieron crecer y, al heredar la responsabilidad de su madre, Acantha asumió su deber de proteger el pueblo con orgullo. Para ella, la seguridad de Valoria era lo más importante. Pero con el tiempo, su deseo de proteger comenzó a confundirse con la necesidad de controlar.` 
  },
  hs2: { 
    title: 'La bruja y la justicia', 
    text: `Acantha odiaba la injusticia. Como aquella vez en que vio a un ladrón huyendo de la casa de una anciana con las manos llenas de pertenencias ajenas. Furiosa, corrió a su taller, encendió su caldero y comenzó a preparar un conjuro: tres moscas, un gusano, una mano de duende, seis lágrimas de dragón y unas de viejito. Revolvió la mezcla y pronunció en voz alta: "Amenos roberus, neo mano, absentus".
Una densa bola de humo se elevó del caldero y, momentos después, un grito de desesperación resonó afuera. Era el ladrón, observando con horror cómo sus manos se encogían hasta quedar del tamaño de un niño. "¡Maldita bruja, ¿qué me hiciste?!", gritó, mientras Acantha lo observaba desde su ventana con una satisfacción silenciosa. Se sentía toda una heroína. Había impartido justicia, pero, ¿realmente había protegido al pueblo o simplemente impuesto su voluntad?`
  },
  hs3: { 
    title: 'El castigo de la tierra', 
    text: `Otro día, durante la cosecha, Acantha notó que un grupo de niños jugaba cerca de los cultivos, pisoteando las plantas sin darse cuenta del daño que causaban. Aunque los granjeros parecían no darle mucha importancia, ella sintió que debía intervenir. Se acercó y, con un murmullo, hizo que las ramas de los árboles cobraran vida, extendiéndose como serpientes hasta rodear a los niños. "Si no respetan la tierra, la tierra los castigará", dijo con firmeza. Los pequeños gritaron asustados y corrieron de regreso al pueblo. Desde ese día, ningún niño se atrevió a acercarse a los cultivos sin permiso. Acantha se convenció de que había hecho lo correcto, pero algunos aldeanos comenzaron a mirarla con cierta preocupación.`
  },
  hs4: { 
    title: 'La peste de la aldea', 
    text: `Cayó la noche y el pueblo se sumergió en el silencio, listo para dormir. Pero entonces, una música estridente rompió la tranquilidad. El responsable era Blorgo, la peste de la aldea: un hombre nefasto, asqueroso y maloliente. Grosero con todos, ahuyentaba a las mujeres y los hombres solo le tenían lástima. Blorgo se creía especial y distinto, pero en realidad solo era un incordio. Cuando los aldeanos le pidieron que bajara el volumen, él se limitó a responder con desdén: "Deberían agradecerme, mi gusto musical es demasiado bueno para sus oídos simples y aburridos".
Acantha no lo soportaba. Blorgo representaba todo lo que ella detestaba. No encajaba en el pueblo, y ella iba a hacer algo al respecto. Pensó en el bienestar de la aldea, pero también en cómo la perturbaba su mera existencia.`
  },
  hs5: { 
    title: 'El hechizo de la maldad', 
    text: `Acantha esperó hasta la madrugada, cuando todos dormían, y comenzó a buscar entre sus libros hasta dar con un tomo de artes oscuras. Ahí encontró un hechizo poderoso, uno que le arrancaría toda la maldad a Blorgo. Pasó días reuniendo los ingredientes: ojos de rana, cinco pétalos de lirio de cala, musgo de pantano y, lo más difícil de conseguir, un pelo de Blorgo. Logró obtenerlo cuando él, tras una noche de embriaguez y alucinaciones causadas por lamer sapos, quedó dormido en la calle.
Con todos los ingredientes en mano, Acantha encendió su caldero, mezcló los componentes y pronunció las palabras mágicas: "Almonius, laingus, trotofodo, paraba, lito limpa".
Un escalofrío recorrió la cabaña cuando todas las velas se apagaron y la temperatura cayó drásticamente. Entonces, un grito aterrador rasgó la noche. Blorgo se retorció en el suelo mientras una sustancia negra y viscosa brotaba de su boca. Hedía a podredumbre, y su masa informe comenzó a crecer y a tomar forma. La maldad de Blorgo ya no estaba dentro de él… ahora era un monstruo, uno real, enorme y despiadado, que rugió con furia y se lanzó contra el pueblo de Valoria.`
  },
  hs6: { 
    title: 'El eco de la oscuridad', 
    text: `Acantha sintió un nudo en el estómago. Había querido corregir un problema, pero quizás había cometido un error aún mayor. ¡Debía detenerlo, antes de que fuera demasiado tarde! Su deseo de proteger al pueblo la había llevado demasiado lejos, convirtiéndola en la amenaza que siempre quiso evitar.
Con determinación, Acantha reunió su magia y se enfrentó a la criatura. Pero cada hechizo que lanzaba solo la debilitaba más. Finalmente, comprendió la verdad: la maldad no podía ser destruida a la fuerza. La única solución era devolverla a su origen. Con un último conjuro, Acantha absorbió la oscuridad dentro de sí y la encerró en su propio ser.
Cansada y tambaleante, se dio cuenta de que no podía seguir decidiendo el destino de los demás. Blorgo, ahora libre de su maldad, se desmayó. Cuando despertó, miró a su alrededor con extrañeza, como si fuera un hombre distinto. El pueblo, que antes veneraba a Acantha, ahora la miraba con asombro y temor. Pero ella, por primera vez, no buscó su aprobación.
Desde ese día, Acantha cambió. Siguió protegiendo Valoria, pero con una nueva comprensión: no podía forzar a nadie a ser mejor, solo guiar a quienes estuvieran dispuestos a cambiar por sí mismos.`
  }
};

const hotspotMaterial = new THREE.MeshStandardMaterial({
  color: 0xeab045,
  emissive: 0x7B3F00,
  emissiveIntensity: 0.5,
  roughness: 0.7,
  metalness: 0.1
});

const hotspotGeometry = new THREE.SphereGeometry(4, 32, 32);
const hotspots = [];
const haloSprites = new Map();

// Halo visual
function createHaloTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(size/2, size/2, 10, size/2, size/2, size/2);
  gradient.addColorStop(0, 'rgba(213, 146, 21, 0.9)');
  gradient.addColorStop(0.5, 'rgba(186, 134, 37, 0.97)');
  gradient.addColorStop(1, 'rgba(119, 77, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

const haloTexture = createHaloTexture();

// Crear hotspots
hotspotPositions.forEach(({ id, position }) => {
  const hotspot = new THREE.Mesh(hotspotGeometry, hotspotMaterial.clone());
  hotspot.position.copy(position);
  hotspot.name = id;
  hotspot.userData.isHotspot = true;

  // Flotación
  gsap.to(hotspot.position, {
    y: position.y + 4,
    duration: 2 + Math.random(),
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Escala viva
  gsap.to(hotspot.scale, {
    x: 1.1,
    y: 1.1,
    z: 1.1,
    duration: 1.5 + Math.random(),
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  });

  // Halo
  const spriteMaterial = new THREE.SpriteMaterial({
    map: haloTexture,
    color: 0xffa500,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const haloSprite = new THREE.Sprite(spriteMaterial);
  haloSprite.scale.set(20, 20, 1);
  haloSprite.visible = false;
  hotspot.add(haloSprite);
  haloSprites.set(id, haloSprite);

  hotspotGroup.add(hotspot);
  hotspots.push(hotspot);
});

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedHotspotId = null;

// Manejo de clics (adaptado para canvas no full screen)
function onClick(event) {
  const container = document.getElementById('right');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const canvasBounds = renderer.domElement.getBoundingClientRect();

  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  mouse.y = - ((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hotspots);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const clickedId = clicked.name;

    // **Aquí agregas la llamada al sonido**
    playClickSound();

    // Mostrar / ocultar halo e info
    if (selectedHotspotId === clickedId) {
      haloSprites.get(clickedId).visible = false;
      selectedHotspotId = null;
      document.getElementById('hotspotTitle').textContent = 'ninguna';
      document.getElementById('hotspotDescription').textContent = '';
    } else {
      if (selectedHotspotId) {
        haloSprites.get(selectedHotspotId).visible = false;
      }
      haloSprites.get(clickedId).visible = true;
      selectedHotspotId = clickedId;

      const info = hotspotData[clickedId];
      if (info) {
        document.getElementById('hotspotTitle').textContent = info.title;
        document.getElementById('hotspotDescription').textContent = info.text;
      }
    }
  }
}


// Cerrar caja de info
document.getElementById('close-info').addEventListener('click', () => {
  document.getElementById('hotspot-info').classList.remove('visible');
  if (selectedHotspotId) {
    haloSprites.get(selectedHotspotId).visible = false;
    selectedHotspotId = null;
  }
});

// Escuchar clics en #right
document.getElementById('right').addEventListener('click', onClick);

export { hotspots, hotspotData };

import { initClickSound, playClickSound } from '/src/audio/soundEffect.js'; // o donde tengas la función

// Luego de inicializar el audio principal
initClickSound(camera);

