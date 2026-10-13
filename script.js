/* ══════════════════════════════════════════════════════
   ADRIÁN ORTEGA MARTÍNEZ · PORTFOLIO JAVASCRIPT
   ══════════════════════════════════════════════════════ */

// ── Cursor personalizado ──────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Suavizar el follower del cursor
function animateCursor() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect en elementos interactivos
const hoverTargets = document.querySelectorAll('a, button, .card-click, .info-card, .project-card, .contact-card, .lab-card, .timeline-content');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});


// ── Scroll progress bar ───────────────────────────────
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = pct + '%';
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });


// ── Navbar scroll effect ──────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ── Reveal on scroll (IntersectionObserver) ───────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      // Re-animamos cuando sube también
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


// ── Skill bars animadas ───────────────────────────────
const skillBars = document.querySelectorAll('.skill-bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth + '%';
    } else {
      entry.target.style.width = '0%';
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => barObserver.observe(bar));


// ── Partículas de fondo ───────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

let particles = [];
let W = window.innerWidth;
let H = window.innerHeight;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const COLORS = ['#6c63ff', '#ff6584', '#43e97b', '#4facfe', '#f7971e', '#a18cd1'];

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 0.5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.5 + 0.1;
    this.life  = Math.random() * 200 + 100;
    this.age   = 0;
  }

  update() {
    this.x   += this.vx;
    this.y   += this.vy;
    this.age += 1;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.age > this.life) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha * (1 - this.age / this.life);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// Conexiones entre partículas cercanas
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.07;
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

const PARTICLE_COUNT = 80;
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ── Efecto Ripple al hacer clic ───────────────────────
document.addEventListener('click', (e) => {
  // Ripple principal
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  ripple.style.cssText = `
    left: ${e.clientX}px;
    top:  ${e.clientY}px;
    width: 80px;
    height: 80px;
    margin-left: -40px;
    margin-top: -40px;
    background: rgba(108, 99, 255, 0.35);
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);

  // Partículas de explosión
  const colors = ['#6c63ff', '#ff6584', '#43e97b', '#4facfe', '#f7971e'];
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement('div');
    dot.classList.add('click-burst');
    const angle = (i / 8) * Math.PI * 2;
    const dist  = 40 + Math.random() * 30;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    dot.style.cssText = `
      left: ${e.clientX}px;
      top:  ${e.clientY}px;
      background: ${colors[i % colors.length]};
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  }
});


// ── Color hover dinámico en cards ─────────────────────
document.querySelectorAll('[data-color]').forEach(card => {
  const color = card.getAttribute('data-color');
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = color;
    card.style.boxShadow = `0 0 30px ${color}33, 0 16px 48px rgba(0,0,0,0.4)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '';
    card.style.boxShadow = '';
  });
});


// ── Smooth scroll para los nav links ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── Terminal typing animation ─────────────────────────
const terminalLines = document.querySelectorAll('.terminal-output');
let delay = 600;
terminalLines.forEach(line => {
  const text = line.textContent;
  line.textContent = '';
  line.style.opacity = '0';
  setTimeout(() => {
    line.style.opacity = '1';
    let i = 0;
    const typeInterval = setInterval(() => {
      line.textContent += text[i];
      i++;
      if (i >= text.length) clearInterval(typeInterval);
    }, 30);
  }, delay);
  delay += text.length * 30 + 200;
});


// ── Active nav link en scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = '#fff';
          link.style.background = 'rgba(108, 99, 255, 0.2)';
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));


// ── Parallax sutil en el Hero ─────────────────────────
const heroShapes = document.querySelectorAll('.shape');

window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  heroShapes.forEach((shape, i) => {
    const factor = (i + 1) * 12;
    shape.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
}, { passive: true });
