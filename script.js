// Helpers
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Mobile nav
const toggleBtn = $('.menu-toggle');
const navList = $('#nav-list');
if (toggleBtn && navList){
  toggleBtn.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(open));
  });
  // close on link click
  $$('#nav-list a').forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }));
}

// Dark mode toggle (persisted)
const themeToggle = $('#themeToggle');
const root = document.documentElement;
const pref = localStorage.getItem('theme');
if (pref) root.setAttribute('data-theme', pref);
if (themeToggle){
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // swap icon
    themeToggle.innerHTML = next === 'dark'
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  });
  // initial icon state
  themeToggle.innerHTML = (root.getAttribute('data-theme') === 'dark')
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
}

// Smooth reveal on scroll (no external libs)
const onReveal = () => {
  const trigger = window.innerHeight * 0.9;
  $$('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) el.classList.add('in');
  });
};
document.addEventListener('scroll', onReveal, { passive:true });
document.addEventListener('DOMContentLoaded', () => {
  onReveal();
  // update year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Respect reduced motion for smooth scroll
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  $$('#nav-list a').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')){
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });
}
