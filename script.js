/* Interações do site — compatível com Safari/iOS e navegadores modernos. */
document.documentElement.classList.add('js');

var menuToggle = document.querySelector('.menu-toggle');
var nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  Array.prototype.forEach.call(nav.querySelectorAll('a'), function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

var year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Revela os elementos conforme entram na tela. Em navegadores sem suporte,
// mantém todo o conteúdo visível em vez de deixá-lo oculto.
if (typeof window.IntersectionObserver === 'function') {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (element) {
    revealObserver.observe(element);
  });
} else {
  Array.prototype.forEach.call(document.querySelectorAll('.reveal'), function (element) {
    element.classList.add('visible');
  });
}

// Filtros das quatro categorias do portfólio.
var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
var portfolioItems = Array.prototype.slice.call(document.querySelectorAll('.portfolio-item[data-category]'));
var portfolioCount = document.querySelector('#portfolio-count');

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var selected = button.dataset.filter;
    filterButtons.forEach(function (item) {
      var active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    portfolioItems.forEach(function (item) {
      item.hidden = item.dataset.category !== selected;
    });
    if (portfolioCount) {
      portfolioCount.textContent = button.dataset.count || String(
        portfolioItems.filter(function (item) { return item.dataset.category === selected; }).length
      );
    }
  });
});

// Visualizador de fotos e vídeos. O bloqueio de rolagem também preserva
// a posição da página no Safari do iPhone.
var lightbox = document.querySelector('#lightbox');
var lightboxImage = document.querySelector('#lightbox-image');
var lightboxVideo = document.querySelector('#lightbox-video');
var closeButton = lightbox ? lightbox.querySelector('.lightbox-close') : null;
var videoFallback = document.querySelector('#video-fallback');
var videoOpenFile = document.querySelector('#video-open-file');
var lastTrigger = null;
var savedScrollY = 0;
var bodyWasLocked = false;

function lockPageScroll() {
  if (bodyWasLocked) return;
  savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + savedScrollY + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  bodyWasLocked = true;
}

function unlockPageScroll() {
  if (!bodyWasLocked) return;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  bodyWasLocked = false;
  window.scrollTo(0, savedScrollY);
}

function closeLightbox() {
  if (!lightbox) return;

  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.removeAttribute('poster');
    lightboxVideo.load();
    lightboxVideo.hidden = true;
  }
  if (videoFallback) videoFallback.hidden = true;

  if (lightboxImage) {
    lightboxImage.removeAttribute('src');
    lightboxImage.hidden = true;
  }

  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  unlockPageScroll();

  if (lastTrigger && typeof lastTrigger.focus === 'function') {
    lastTrigger.focus();
  }
}

function openLightbox(trigger) {
  if (!lightbox) return;
  lastTrigger = trigger;

  if (trigger.dataset.mediaType === 'video' && lightboxVideo) {
    if (lightboxImage) lightboxImage.hidden = true;
    lightboxVideo.hidden = false;
    if (videoFallback) videoFallback.hidden = true;
    if (videoOpenFile) videoOpenFile.href = trigger.dataset.videoSrc;

    lightboxVideo.poster = trigger.dataset.videoPoster || '';
    lightboxVideo.src = trigger.dataset.videoSrc;
    lightboxVideo.load();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lockPageScroll();

    if (closeButton) closeButton.focus();
    var playRequest;
    try {
      playRequest = lightboxVideo.play();
    } catch (error) {
      if (videoFallback) videoFallback.hidden = false;
    }
    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(function () {
        if (videoFallback) videoFallback.hidden = false;
      });
    }
  } else if (trigger.dataset.full && lightboxImage) {
    if (lightboxVideo) lightboxVideo.hidden = true;
    lightboxImage.src = trigger.dataset.full;
    lightboxImage.hidden = false;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    lockPageScroll();
    if (closeButton) closeButton.focus();
  }
}

Array.prototype.forEach.call(document.querySelectorAll('[data-full], [data-video-src]'), function (button) {
  button.addEventListener('click', function () { openLightbox(button); });
});

if (closeButton) closeButton.addEventListener('click', closeLightbox);

if (lightboxVideo) {
  lightboxVideo.addEventListener('error', function () {
    if (videoFallback) videoFallback.hidden = false;
    if (videoOpenFile && lightboxVideo.currentSrc) videoOpenFile.href = lightboxVideo.currentSrc;
  });
}

if (lightbox) {
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

// Cabeçalho compacto durante a rolagem e restaurado no topo.
var siteHeader = document.querySelector('.site-header');
function updateHeaderSize() {
  if (siteHeader) {
    var scrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
    siteHeader.classList.toggle('is-compact', scrollPosition > 24);
  }
}
updateHeaderSize();
window.addEventListener('scroll', updateHeaderSize, { passive: true });
