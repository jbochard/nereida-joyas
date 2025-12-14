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

  // Inicializar carruseles de productos
  inicializarCarruseles();
  
  // Inicializar lightbox
  inicializarLightbox();
});

/**
 * Sistema de carrusel para imágenes de productos
 */
function inicializarCarruseles() {
  const carruseles = document.querySelectorAll('.producto-carrusel');
  
  carruseles.forEach(carrusel => {
    const slides = carrusel.querySelectorAll('.carrusel-slide');
    const prevBtn = carrusel.querySelector('.carrusel-prev');
    const nextBtn = carrusel.querySelector('.carrusel-next');
    const indicators = carrusel.querySelectorAll('.carrusel-indicator');
    
    if (slides.length <= 1) return; // No necesita carrusel si solo hay una imagen
    
    let currentSlide = 0;
    
    // Función para mostrar una slide específica
    const mostrarSlide = (index) => {
      // Asegurar que el índice esté en rango
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }
      
      // Actualizar slides
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
      });
      
      // Actualizar indicadores
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
      });
    };
    
    // Navegación anterior
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mostrarSlide(currentSlide - 1);
      });
    }
    
    // Navegación siguiente
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mostrarSlide(currentSlide + 1);
      });
    }
    
    // Navegación por indicadores
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', (e) => {
        e.stopPropagation();
        mostrarSlide(index);
      });
    });
    
    // Soporte para teclado (accesibilidad)
    carrusel.setAttribute('tabindex', '0');
    carrusel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        mostrarSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        mostrarSlide(currentSlide + 1);
      }
    });
    
    // Auto-play opcional (pausa al hover)
    let autoPlayInterval;
    const iniciarAutoPlay = () => {
      autoPlayInterval = setInterval(() => {
        mostrarSlide(currentSlide + 1);
      }, 5000); // Cambia cada 5 segundos
    };
    
    const detenerAutoPlay = () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
    
    // Iniciar auto-play
    iniciarAutoPlay();
    
    // Pausar al hacer hover
    const productoCard = carrusel.closest('.producto-card');
    if (productoCard) {
      productoCard.addEventListener('mouseenter', detenerAutoPlay);
      productoCard.addEventListener('mouseleave', iniciarAutoPlay);
    }
  });
}

/**
 * Sistema de lightbox para visualización ampliada de imágenes
 */
function inicializarLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCurrent = document.getElementById('lightbox-current');
  const lightboxTotal = document.getElementById('lightbox-total');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');
  
  let imagenes = [];
  let imagenActual = 0;
  let nombreProducto = '';
  
  // Abrir lightbox al hacer clic en la imagen del producto
  document.querySelectorAll('.producto-imagen').forEach(imagenContainer => {
    // Agregar listener al contenedor, pero verificar el target
    imagenContainer.addEventListener('click', (e) => {
      // Evitar abrir si se hace clic en los botones del carrusel o indicadores
      const target = e.target;
      if (target.closest('.carrusel-btn') || 
          target.closest('.carrusel-indicator') || 
          target.closest('.carrusel-indicators') ||
          target.classList.contains('carrusel-btn') ||
          target.classList.contains('carrusel-indicator')) {
        return;
      }
      
      const imagenesData = imagenContainer.dataset.imagenes;
      nombreProducto = imagenContainer.dataset.productoNombre || '';
      
      if (imagenesData) {
        try {
          imagenes = JSON.parse(imagenesData);
          imagenActual = 0;
          
          // Determinar qué imagen mostrar (la activa del carrusel si existe)
          const carrusel = imagenContainer.querySelector('.producto-carrusel');
          if (carrusel) {
            const slideActiva = carrusel.querySelector('.carrusel-slide.active');
            if (slideActiva) {
              const imgActiva = slideActiva.querySelector('img');
              if (imgActiva) {
                const srcActiva = imgActiva.src;
                // Buscar el índice de la imagen actual
                imagenes.forEach((img, index) => {
                  const imgName = img.split('/').pop();
                  if (srcActiva.includes(imgName)) {
                    imagenActual = index;
                  }
                });
              }
            }
          }
          
          abrirLightbox();
        } catch (error) {
          console.error('Error al parsear imágenes:', error);
        }
      }
    });
  });
  
  const abrirLightbox = () => {
    if (imagenes.length === 0) return;
    
    actualizarLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Enfocar el botón de cerrar para accesibilidad
    if (lightboxClose) {
      lightboxClose.focus();
    }
  };
  
  const cerrarLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  const actualizarLightbox = () => {
    if (imagenes.length === 0) return;
    
    const imagen = imagenes[imagenActual];
    if (lightboxImage) {
      lightboxImage.src = imagen;
      lightboxImage.alt = nombreProducto ? `${nombreProducto} - Imagen ${imagenActual + 1}` : `Imagen ${imagenActual + 1}`;
    }
    
    if (lightboxTitle) {
      lightboxTitle.textContent = nombreProducto || '';
    }
    
    if (lightboxCurrent) {
      lightboxCurrent.textContent = imagenActual + 1;
    }
    
    if (lightboxTotal) {
      lightboxTotal.textContent = imagenes.length;
    }
    
    // Mostrar/ocultar botones de navegación
    if (lightboxPrev) {
      lightboxPrev.style.display = imagenes.length > 1 ? 'flex' : 'none';
    }
    if (lightboxNext) {
      lightboxNext.style.display = imagenes.length > 1 ? 'flex' : 'none';
    }
  };
  
  const siguienteImagen = () => {
    if (imagenes.length === 0) return;
    imagenActual = (imagenActual + 1) % imagenes.length;
    actualizarLightbox();
  };
  
  const imagenAnterior = () => {
    if (imagenes.length === 0) return;
    imagenActual = (imagenActual - 1 + imagenes.length) % imagenes.length;
    actualizarLightbox();
  };
  
  // Event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', cerrarLightbox);
  }
  
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', cerrarLightbox);
  }
  
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      imagenAnterior();
    });
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      siguienteImagen();
    });
  }
  
  // Navegación con teclado
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      cerrarLightbox();
    } else if (e.key === 'ArrowLeft') {
      imagenAnterior();
    } else if (e.key === 'ArrowRight') {
      siguienteImagen();
    }
  });
  
  // Prevenir que el clic en la imagen cierre el lightbox
  if (lightboxImage) {
    lightboxImage.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Service Worker para PWA (opcional, para futuras mejoras)
if ('serviceWorker' in navigator) {
  // Registro de service worker puede agregarse aquí
}

