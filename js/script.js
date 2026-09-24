/* ===========================================================
   POWER FITNESS — script.js
   JavaScript puro, sem dependências de build
   =========================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initIcons();
    initHeaderScroll();
    initMobileMenu();
    initSmoothAnchors();
    initScrollReveal();
    initLightbox();
  }

  /* -----------------------------------------------------------
     Ícones Lucide
  ----------------------------------------------------------- */
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    } else {
      // Caso o script dos ícones ainda não tenha carregado, tenta novamente.
      window.addEventListener('load', function () {
        if (window.lucide) window.lucide.createIcons();
      });
    }
  }

  /* -----------------------------------------------------------
     Header: fundo sólido ao rolar a página
  ----------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    var THRESHOLD = 40;

    function onScroll() {
      if (window.scrollY > THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -----------------------------------------------------------
     Menu mobile (hamburger)
  ----------------------------------------------------------- */
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var navMobile = document.getElementById('navMobile');
    if (!hamburger || !navMobile) return;

    function closeMenu() {
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function openMenu() {
      hamburger.classList.add('active');
      navMobile.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    hamburger.addEventListener('click', function () {
      var isOpen = navMobile.classList.contains('open');
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    // Fecha o menu ao clicar em qualquer link
    navMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fecha o menu com a tecla Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMobile.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* -----------------------------------------------------------
     Scroll suave para âncoras internas
  ----------------------------------------------------------- */
  function initSmoothAnchors() {
    var header = document.getElementById('header');

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (!id || id === '#') return;

        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;

        window.scrollTo({ top: top, behavior: 'smooth' });

        // Atualiza a URL sem saltar a página
        history.pushState(null, '', id);
      });
    });
  }

  /* -----------------------------------------------------------
     Fade-in suave das seções ao entrar na viewport
  ----------------------------------------------------------- */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* -----------------------------------------------------------
     Lightbox da galeria (Estrutura)
  ----------------------------------------------------------- */
  function initLightbox() {
    var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    var lightbox = document.getElementById('lightbox');
    if (!galleryItems.length || !lightbox) return;

    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var closeBtn = document.getElementById('lightboxClose');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');

    var currentIndex = 0;
    var lastFocusedElement = null;

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxContent();
      lastFocusedElement = document.activeElement;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    function updateLightboxContent() {
      var item = galleryItems[currentIndex];
      var img = item.querySelector('img');
      var caption = item.getAttribute('data-caption') || '';

      lightboxImg.src = img.getAttribute('src');
      lightboxImg.alt = img.getAttribute('alt') || caption;
      lightboxCaption.textContent = caption;
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent();
    }

    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () { openLightbox(index); });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Clique fora da imagem fecha o lightbox
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Navegação por teclado
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  }

})();
