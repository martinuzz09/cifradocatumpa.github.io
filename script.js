document.addEventListener('DOMContentLoaded', () => {
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mainHeader = document.getElementById('mainHeader');

  const projectImage = document.getElementById('projectImage');
  const imageUploadInput = document.getElementById('imageUploadInput');
  const btnResetImage = document.getElementById('btnResetImage');

  const lightboxModal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  const navLinks = document.querySelectorAll('.header-nav .nav-link');
  const sections = document.querySelectorAll('.content-block');

  const DEFAULT_IMAGE_SRC = projectImage ? projectImage.src : '';

  // 1. TEMA CLARO / OSCURO
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

  // 2. HEADER SCROLL SHADOW
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      mainHeader.classList.add('is-scrolled');
    } else {
      mainHeader.classList.remove('is-scrolled');
    }
  }, { passive: true });

  // 3. LIGHTBOX / ZOOM
  function openLightbox(src, caption) {
    if (!lightboxModal) return;
    lightboxImg.src = src || (projectImage ? projectImage.src : '');
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || 'Caso de Estudio BBC micro:bit';
    }
    lightboxModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.zoom-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('.mockup-footer-actions')) return;

      const imgSrc = trigger.getAttribute('data-img-src') ||
        trigger.querySelector('img')?.src ||
        (projectImage ? projectImage.src : '');
      const caption = trigger.getAttribute('data-caption') ||
        trigger.querySelector('.gallery-card-title, .featured-card-title')?.textContent ||
        'Dispositivo Asistivo micro:bit';
      openLightbox(imgSrc, caption);
    });
  });

  if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && !lightboxModal.hasAttribute('hidden')) {
      closeLightbox();
    }
  });

  // 4. CARGADOR DE IMAGEN PERSONALIZADA
  if (imageUploadInput) {
    imageUploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (projectImage) projectImage.src = event.target.result;
          if (lightboxImg) lightboxImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnResetImage) {
    btnResetImage.addEventListener('click', () => {
      if (projectImage) projectImage.src = DEFAULT_IMAGE_SRC;
      if (lightboxImg) lightboxImg.src = DEFAULT_IMAGE_SRC;
      if (imageUploadInput) imageUploadInput.value = '';
    });
  }
});