import * as THREE from 'three';
import { scene } from '../core/scene.js';

const rightContainer = document.getElementById('right');

rightContainer.addEventListener('mousemove', function(e) {
  // Obtener la posición relativa del mouse dentro del contenedor #right
  const rect = rightContainer.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let i = 0; i < 3; i++) {
    const star = document.createElement('div');
    star.classList.add('trail-star');

    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;

    const size = Math.random() * 4 + 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    const colors = ['#ffffff', '#ffe0f7', '#ccffff', '#ffd6f6'];
    star.style.background = colors[Math.floor(Math.random() * colors.length)];

    // Ubicar dentro del contenedor #right
    star.style.left = `${mouseX + offsetX}px`;
    star.style.top = `${mouseY + offsetY}px`;

    rightContainer.appendChild(star);

    // Transición y remoción
    requestAnimationFrame(() => {
      star.style.transform = `translateY(-10px) scale(0.5)`;
      star.style.opacity = '0';
    });

    setTimeout(() => {
      star.remove();
    }, 1000);
  }
});
