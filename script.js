/* ============================================================
   KKS Portfolio — script.js
   ============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ============================================================
   READING PROGRESS BAR
   ============================================================ */
const progressBar = $('#progress-bar');
if (progressBar) {
  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((window.scrollY / total) * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorDot  = $('#cursor-dot');
const cursorRing = $('#cursor-ring');
const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (cursorDot && cursorRing && isFine) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  // Ring follows with slight lag
  const animateRing = () => {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover state on interactive elements
  const interactives = $$('a, button, .project-card, .contact-card, .skill-group');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovered');
      cursorRing.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovered');
      cursorRing.classList.remove('hovered');
    });
  });
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
const menuToggle = $('.menu-toggle');
const navList    = $('#nav-list');

if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  $$('#nav-list a').forEach(a => {
    a.addEventListener('click', () => {
      navList.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  $$('#nav-list a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================
   NAV SCROLL SPY
   ============================================================ */
const sections  = $$('section[id]');
const navLinks  = $$('#nav-list a');

const activateLink = () => {
  const mid = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (mid >= top && mid < bottom) {
      navLinks.forEach(l => l.classList.remove('active'));
      const match = $(`#nav-list a[href="#${sec.id}"]`);
      if (match) match.classList.add('active');
    }
  });
};

window.addEventListener('scroll', activateLink, { passive: true });

/* ============================================================
   SCROLL REVEAL  (Intersection Observer)
   ============================================================ */
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const dur    = 1200;
      const step   = 16;
      const steps  = dur / step;
      let current  = 0;

      const tick = () => {
        current = Math.min(current + target / steps, target);
        el.textContent = Math.round(current) + suffix;
        if (current < target) setTimeout(tick, step);
      };
      tick();
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

/* ============================================================
   ROLE CYCLER
   ============================================================ */
const roleItems = $$('.role-item');
let currentRole = 0;

if (roleItems.length > 1) {
  setInterval(() => {
    roleItems[currentRole].classList.remove('active');
    roleItems[currentRole].classList.add('exit');
    setTimeout(() => roleItems[currentRole].classList.remove('exit'), 500);
    currentRole = (currentRole + 1) % roleItems.length;
    roleItems[currentRole].classList.add('active');
  }, 2800);
}

/* ============================================================
   STAGGERED CARD ANIMATIONS
   ============================================================ */
const staggerGroups = [
  { selector: '.project-card.reveal',   delay: 0.09 },
  { selector: '.skill-group.reveal',    delay: 0.12 },
  { selector: '.timeline-item.reveal',  delay: 0.15 },
];

/* ============================================================
   INIT  (DOMContentLoaded)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Attach reveal observer
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Attach counter observer
  $$('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

  // Apply stagger delays
  staggerGroups.forEach(({ selector, delay }) => {
    $$(selector).forEach((el, i) => {
      el.style.transitionDelay = (i * delay).toFixed(2) + 's';
    });
  });

  // Initial scroll spy
  activateLink();
});
