import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const cursorGlow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  cursorGlow.animate(
    {
      left: `${event.clientX}px`,
      top: `${event.clientY}px`
    },
    { duration: 500, fill: 'forwards' }
  );
});

const header = document.querySelector('.site-header');
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  header.classList.toggle('is-scrolled', currentScroll > 24);
  header.classList.toggle('is-scrolling-up', currentScroll < lastScrollTop && currentScroll > 80);
  header.classList.toggle('is-scrolling-down', currentScroll > lastScrollTop && currentScroll > 80);
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, { passive: true });

const navLinks = document.querySelectorAll('.nav-link');
const sectionTargets = document.querySelectorAll('main section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -45% 0px', threshold: 0.15 });
sectionTargets.forEach((section) => sectionObserver.observe(section));

const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  }
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const heroCanvas = document.getElementById('hero-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 6);

const group = new THREE.Group();
scene.add(group);

const pointCount = 250;
const positions = new Float32Array(pointCount * 3);
const colors = new Float32Array(pointCount * 3);
for (let i = 0; i < pointCount; i += 1) {
  const radius = 1.8 + Math.random() * 1.6;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = radius * Math.cos(phi);
  positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
  const color = new THREE.Color().setHSL(0.55 + Math.random() * 0.12, 0.7, 0.62);
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
const material = new THREE.PointsMaterial({ size: 0.012, transparent: true, opacity: 0.9, vertexColors: true });
const points = new THREE.Points(geometry, material);
scene.add(points);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0x63e8ff, transparent: true, opacity: 0.22 });
const linePositions = [];
for (let i = 0; i < pointCount; i += 1) {
  for (let j = i + 1; j < pointCount; j += 1) {
    const a = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    const b = new THREE.Vector3(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
    if (a.distanceTo(b) < 0.55) {
      linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
  }
}
const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(lines);

const torus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.2, 0.22, 160, 24),
  new THREE.MeshPhysicalMaterial({
    color: 0x67dfff,
    emissive: 0x0d2940,
    metalness: 0.2,
    roughness: 0.18,
    transparent: true,
    opacity: 0.78
  })
);
torus.rotation.x = 1;
torus.rotation.y = 1.4;
scene.add(torus);

const clock = new THREE.Clock();
function animate() {
  const elapsed = clock.getElapsedTime();
  group.rotation.y = elapsed * 0.08;
  torus.rotation.y = elapsed * 0.28;
  torus.rotation.z = elapsed * 0.12;
  points.rotation.y = elapsed * 0.04;
  lines.rotation.y = elapsed * 0.04;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 0.8;
  const y = (event.clientY / window.innerHeight - 0.5) * 0.8;
  camera.position.x = x * 0.8;
  camera.position.y = -y * 0.8;
});

const revealItems = document.querySelectorAll('.service-module, .case-card, .showcase-panel, .stat-card, .testimonial-shell, .project-card, .cta-shell');
revealItems.forEach((item, index) => {
  gsap.fromTo(item, { y: 40, opacity: 0, filter: 'blur(14px)' }, {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 1,
    delay: index * 0.04,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 88%'
    }
  });
});

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = `${value.toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.7 });

counters.forEach((counter) => counterObserver.observe(counter));

const testimonials = [
  {
    quote: 'MorpheLabs gave us a voice-driven growth experience that felt as premium as the brand itself. It turned every missed opportunity into momentum.',
    name: 'Ava Moreno',
    role: 'VP Growth, Northstar',
    initials: 'AM',
    rating: '★★★★★'
  },
  {
    quote: 'The intelligence layer feels alive. Calls, follow-ups, and CRM updates now happen in the background without ever compromising quality.',
    name: 'Daniel Cho',
    role: 'Founder, Helio Labs',
    initials: 'DC',
    rating: '★★★★★'
  },
  {
    quote: 'It feels like we finally have a team of operators working around the clock. The experience is elegant and deeply reliable.',
    name: 'Mina Patel',
    role: 'COO, Quantum Labs',
    initials: 'MP',
    rating: '★★★★★'
  }
];

let currentTestimonial = 0;
const quoteEl = document.getElementById('testimonial-quote');
const nameEl = document.getElementById('testimonial-name');
const roleEl = document.getElementById('testimonial-role');
const avatarEl = document.getElementById('testimonial-avatar');
const ratingEl = document.getElementById('testimonial-rating');

function renderTestimonial(index) {
  const item = testimonials[index];
  quoteEl.textContent = item.quote;
  nameEl.textContent = item.name;
  roleEl.textContent = item.role;
  avatarEl.textContent = item.initials;
  ratingEl.textContent = item.rating;
}

renderTestimonial(currentTestimonial);

document.querySelectorAll('[data-direction]').forEach((button) => {
  button.addEventListener('click', () => {
    currentTestimonial = button.dataset.direction === 'next'
      ? (currentTestimonial + 1) % testimonials.length
      : (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentTestimonial);
  });
});

setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  renderTestimonial(currentTestimonial);
}, 7000);

const ctaShell = document.querySelector('.cta-shell');
const ctaOrb = document.querySelector('.cta-orb');
window.addEventListener('scroll', () => {
  if (!ctaShell || !ctaOrb) return;
  const rect = ctaShell.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, 1 - (rect.top + rect.height * 0.3) / window.innerHeight));
  const offsetY = progress * 24;
  const offsetX = (window.innerWidth * 0.5 - (rect.left + rect.width * 0.5)) * 0.01;
  ctaOrb.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
}, { passive: true });

const magneticButton = document.querySelector('.magnetic-btn');
if (magneticButton) {
  magneticButton.addEventListener('pointermove', (event) => {
    const rect = magneticButton.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    magneticButton.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) scale(1.02)`;
  });
  magneticButton.addEventListener('pointerleave', () => {
    magneticButton.style.transform = '';
  });
}
