/**
 * Scripts principales del sitio
 * Optimizaciones de performance y UX
 */

document.addEventListener('DOMContentLoaded', () => {
  // Lazy loading mejorado para imágenes
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // Preload de recursos críticos
  const preloadLinks = [
    '/assets/css/main.css',
    '/assets/js/carrito.js'
  ];

  preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = href.endsWith('.css') ? 'style' : 'script';
    link.href = href;
    document.head.appendChild(link);
  });
});

// Service Worker para PWA (opcional, para futuras mejoras)
if ('serviceWorker' in navigator) {
  // Registro de service worker puede agregarse aquí
}

