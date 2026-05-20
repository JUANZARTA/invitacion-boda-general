/* ============================================================
   CONFIGURACIÓN
   ============================================================ */
const BODA = {
  name1:     'Valentina Herrera García',
  name2:     'Santiago Morales Ruiz',
  names:     'Valentina & Santiago',
  nameShort: 'Valentina & Santiago',
  phone:     '573128622945',
  hashtag:   '#ValentinaSantiago',
  eventDate: new Date('2026-08-15T16:00:00'),
};

document.title = `Boda · ${BODA.names}`;
document.querySelectorAll('[data-b="name1"]').forEach(el => el.textContent = BODA.name1);
document.querySelectorAll('[data-b="name2"]').forEach(el => el.textContent = BODA.name2);
document.querySelectorAll('[data-b="names"]').forEach(el => el.textContent = BODA.names);
document.querySelectorAll('[data-b="hashtag"]').forEach(el => el.textContent = BODA.hashtag);
const _waMsg = encodeURIComponent(`Hola! Confirmo mi asistencia a la boda de ${BODA.nameShort} 🥂`);
document.querySelectorAll('[data-b-wa]').forEach(el => {
  el.href = `https://wa.me/${BODA.phone}?text=${_waMsg}`;
});

/* ============================================================
   MÚSICA
   ============================================================ */
const musicBtn = document.getElementById('music-btn');
const bgMusic  = document.getElementById('bg-music');

window.addEventListener('load', () => {
  if (!bgMusic) return;

  bgMusic.volume = 0.65;
  bgMusic.muted  = true;

  bgMusic.play().then(() => {
    musicBtn.classList.add('playing');

    const unmute = () => { bgMusic.muted = false; };
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(e =>
      document.addEventListener(e, unmute, { once: true, passive: true })
    );
  }).catch(() => {
    const startOnClick = () => {
      bgMusic.muted = false;
      bgMusic.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
    };
    document.addEventListener('click', startOnClick, { once: true });
    document.addEventListener('touchstart', startOnClick, { once: true });
  });
});

/* ============================================================
   PARTICLES — SPARKLES DORADOS
   ============================================================ */
(function () {
  const canvas = document.getElementById('sparkles-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#C9A84C', '#E8D5A3', '#F5E8C0', '#A8883A', '#FFE87A'];

  class Sparkle {
    constructor(randomY = false) { this.init(randomY); }
    init(randomY) {
      this.x      = Math.random() * canvas.width;
      this.y      = randomY ? Math.random() * canvas.height : -20;
      this.size   = Math.random() * 5 + 3;
      this.vy     = Math.random() * 1.0 + 0.4;
      this.vx     = (Math.random() - 0.5) * 0.6;
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.05;
      this.wobble = Math.random() * Math.PI * 2;
      this.wSpeed = Math.random() * 0.04 + 0.01;
      this.alpha  = Math.random() * 0.5 + 0.15;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.wobble += this.wSpeed;
      this.x += Math.sin(this.wobble) * 0.6 + this.vx;
      this.y += this.vy;
      this.angle += this.spin;
      if (this.y > canvas.height + 20 || this.x < -30 || this.x > canvas.width + 30) {
        this.init(false);
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.lineTo(this.size * 0.5, 0);
      ctx.lineTo(0, this.size);
      ctx.lineTo(-this.size * 0.5, 0);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  const sparkles = Array.from({ length: 40 }, () => new Sparkle(true));
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparkles.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('nav-hamburger');
const drawer    = document.getElementById('nav-drawer');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   COUNTDOWN
   ============================================================ */
const EVENT_DATE = BODA.eventDate;
const cdDays     = document.getElementById('cd-days');
const cdHours    = document.getElementById('cd-hours');
const cdMinutes  = document.getElementById('cd-minutes');
const cdSeconds  = document.getElementById('cd-seconds');

const crDays     = document.getElementById('cr-days');
const crHours    = document.getElementById('cr-hours');
const crMinutes  = document.getElementById('cr-minutes');
const crSeconds  = document.getElementById('cr-seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function animateFlip(el, newVal) {
  if (el.textContent === newVal) return;
  el.classList.add('flip-out');
  setTimeout(() => {
    el.textContent = newVal;
    el.classList.remove('flip-out');
    el.classList.add('flip-in');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('flip-in')));
  }, 140);
}

function tick() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) {
    const cw = document.querySelector('.countdown-wrapper');
    if (cw) cw.innerHTML =
      '<p style="font-family:var(--ff-script);font-size:2rem;color:#fff;letter-spacing:.1em">¡Hoy es el gran día! ◆</p>';
    return;
  }
  const days    = pad(Math.floor(diff / 86400000));
  const hours   = pad(Math.floor((diff % 86400000) / 3600000));
  const minutes = pad(Math.floor((diff % 3600000)  / 60000));
  const seconds = pad(Math.floor((diff % 60000)    / 1000));

  animateFlip(cdDays,    days);
  animateFlip(cdHours,   hours);
  animateFlip(cdMinutes, minutes);
  animateFlip(cdSeconds, seconds);

  if (crDays)    crDays.textContent    = days;
  if (crHours)   crHours.textContent   = hours;
  if (crMinutes) crMinutes.textContent = minutes;
  if (crSeconds) crSeconds.textContent = seconds;
}
tick();
setInterval(tick, 1000);

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const GALLERY_SRCS = [
  'Fotos/img (1).png',
  'Fotos/img (3).png',
  'Fotos/img (4).png',
  'Fotos/img (5).png',
];

let lbIndex    = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');

function openLightbox(idx) {
  lbIndex = ((idx % GALLERY_SRCS.length) + GALLERY_SRCS.length) % GALLERY_SRCS.length;
  lbImg.src = GALLERY_SRCS[lbIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
document.getElementById('lb-next').addEventListener('click', () => openLightbox(lbIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  openLightbox(lbIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
});

/* ============================================================
   MUSIC BUTTON
   ============================================================ */
musicBtn.addEventListener('click', () => {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.remove('paused');
    musicBtn.classList.add('playing');
  } else {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    musicBtn.classList.add('paused');
  }
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});
