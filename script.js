document.documentElement.classList.add('js');

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

// Portfolio category filters.
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const portfolioItems = [...document.querySelectorAll('.portfolio-item[data-category]')];
const portfolioCount = document.querySelector('#portfolio-count');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  portfolioItems.forEach(item => { item.hidden = item.dataset.category !== selected; });
  if (portfolioCount) portfolioCount.textContent = button.dataset.count || String(portfolioItems.filter(item => item.dataset.category === selected).length);
}));

// Shared lightbox. Video files are assigned only after the visitor selects a video preview.
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxVideo = document.querySelector('#lightbox-video');
const closeButton = lightbox?.querySelector('.lightbox-close');
const videoFallback = document.querySelector('#video-fallback');
const videoOpenFile = document.querySelector('#video-open-file');
let lastTrigger = null;
const closeLightbox = () => {
  if (!lightbox) return;
  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.removeAttribute('poster');
    lightboxVideo.load();
    if (videoFallback) videoFallback.hidden = true;
    lightboxVideo.hidden = true;
  }
  if (lightboxImage) {
    lightboxImage.removeAttribute('src');
    lightboxImage.hidden = true;
  }
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastTrigger?.focus?.();
};
const openLightbox = trigger => {
  if (!lightbox) return;
  lastTrigger = trigger;
  if (trigger.dataset.mediaType === 'video' && lightboxVideo) {
    if (lightboxImage) lightboxImage.hidden = true;
    lightboxVideo.hidden = false;
    if (videoFallback) videoFallback.hidden = false;
    if (videoOpenFile) videoOpenFile.href = trigger.dataset.videoSrc;
    if (videoFallback) videoFallback.hidden = true;
    lightboxVideo.poster = trigger.dataset.videoPoster || '';
    lightboxVideo.src = trigger.dataset.videoSrc;
    lightboxVideo.load();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
    const playRequest = lightboxVideo.play();
    if (playRequest?.catch) playRequest.catch(() => {});
  } else if (trigger.dataset.full && lightboxImage) {
    if (lightboxVideo) lightboxVideo.hidden = true;
    lightboxImage.src = trigger.dataset.full;
    lightboxImage.hidden = false;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  }
};
document.querySelectorAll('[data-full], [data-video-src]').forEach(button => {
  button.addEventListener('click', () => openLightbox(button));
});
closeButton?.addEventListener('click', closeLightbox);
lightboxVideo?.addEventListener('error', () => {
  if (videoFallback) videoFallback.hidden = false;
  if (videoOpenFile && lightboxVideo.currentSrc) videoOpenFile.href = lightboxVideo.currentSrc;
});
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox(); });

// Compacta o cabeçalho durante a rolagem e restaura o tamanho no topo.
const siteHeader = document.querySelector('.site-header');
const updateHeaderSize = () => {
  siteHeader?.classList.toggle('is-compact', window.scrollY > 24);
};
updateHeaderSize();
window.addEventListener('scroll', updateHeaderSize, { passive: true });
