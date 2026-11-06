/**
 * ==========================================================================
 * CASO DE ESTUDIO — LÓGICA INTERACTIVA EN JAVASCRIPT VANILLA
 * - Alternador de Modo Claro / Modo Oscuro con persistencia
 * - Visualizador de imagen en Modal / Lightbox
 * - Carga interactiva de imagen local para probar capturas personalizadas
 * - Observador de desplazamiento (ScrollSpy) y efectos de Header
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SELECTORES PRINCIPALES
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mainHeader = document.getElementById('mainHeader');

  // Elementos de Mockup e Imagen
  const projectImage = document.getElementById('projectImage');
  const imageFrame = document.querySelector('.mockup-image-frame');
  const btnZoomMockup = document.getElementById('btnZoomMockup');
  const imageUploadInput = document.getElementById('imageUploadInput');
  const btnResetImage = document.getElementById('btnResetImage');

  // Modal Lightbox
  const lightboxModal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  // Enlaces de navegación
  const navLinks = document.querySelectorAll('.header-nav .nav-link');
  const sections = document.querySelectorAll('.content-block');

  const DEFAULT_IMAGE_SRC = 'assets/project-mockup.jpg';

  /* ------------------------------------------------------------------------
     2. GESTIÓN DEL TEMA (LIGHT / DARK MODE)
     ------------------------------------------------------------------------ */
  const savedTheme = localStorage.getItem('portfolio_theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
  }

  /* ------------------------------------------------------------------------
     3. HEADER CON SOMBRA AL HACER SCROLL
     ------------------------------------------------------------------------ */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader.classList.add('is-scrolled');
    } else {
      mainHeader.classList.remove('is-scrolled');
    }
  }, { passive: true });

  /* ------------------------------------------------------------------------
     4. LIGHTBOX / ZOOM DE IMAGEN MULTI-IMAGEN
     Soporta visualización en alta definición de todas las fotos de la galería
     ------------------------------------------------------------------------ */
  function openLightbox(src, caption) {
    if (!lightboxModal) return;
    lightboxImg.src = src || projectImage.src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || 'Nexora Analytics — Vista de Pantalla';
    }
    lightboxModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Click en cualquier contenedor con .zoom-trigger (Mockup principal, tarjetas de galería, foto destacada)
  document.querySelectorAll('.zoom-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      // Ignorar si el clic fue en botones de reemplazar o restablecer
      if (e.target.closest('.mockup-footer-actions')) return;

      const imgSrc = trigger.getAttribute('data-img-src') ||
        trigger.querySelector('img')?.src ||
        projectImage.src;
      const caption = trigger.getAttribute('data-caption') ||
        trigger.querySelector('.gallery-card-title, .featured-card-title')?.textContent ||
        'Nexora Analytics — Captura de pantalla';
      openLightbox(imgSrc, caption);
    });
  });

  // Click en botones de icono de zoom dedicados
  document.querySelectorAll('.zoom-trigger-btn, .gallery-zoom-icon').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = btn.closest('.zoom-trigger, .gallery-card, .visual-featured-card, .visual-card');
      const imgSrc = btn.getAttribute('data-img-src') ||
        parentCard?.getAttribute('data-img-src') ||
        parentCard?.querySelector('img')?.src ||
        projectImage.src;
      const caption = btn.getAttribute('data-caption') ||
        parentCard?.getAttribute('data-caption') ||
        parentCard?.querySelector('.gallery-card-title, .featured-card-title')?.textContent ||
        'Nexora Analytics — Captura ampliada';
      openLightbox(imgSrc, caption);
    });
  });

  if (btnCloseLightbox) {
    btnCloseLightbox.addEventListener('click', closeLightbox);
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }

  // Cerrar lightbox con tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && !lightboxModal.hasAttribute('hidden')) {
      closeLightbox();
    }
  });

  /* ------------------------------------------------------------------------
     5. CARGADOR DINÁMICO DE IMAGEN
     Permite al usuario probar instantáneamente su propia captura en el mockup
     ------------------------------------------------------------------------ */
  if (imageUploadInput) {
    imageUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          projectImage.src = event.target.result;
          lightboxImg.src = event.target.result;
          showToast('✓ Imagen personalizada cargada en el mockup');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnResetImage) {
    btnResetImage.addEventListener('click', () => {
      projectImage.src = DEFAULT_IMAGE_SRC;
      lightboxImg.src = DEFAULT_IMAGE_SRC;
      if (imageUploadInput) imageUploadInput.value = '';
      showToast('Imagen restaurada a la predeterminada');
    });
  }

  /* ------------------------------------------------------------------------
     6. SCROLLSPY (RESALTAR SECCIÓN ACTIVA EN LA NAVEGACIÓN)
     ------------------------------------------------------------------------ */
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--accent-primary)';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  /* ------------------------------------------------------------------------
     7. FEEDBACK TOAST LIGERO
     ------------------------------------------------------------------------ */
  function showToast(message) {
    let toast = document.getElementById('actionToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'actionToast';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #0f172a;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 2000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.25s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, 2800);
  }
});
