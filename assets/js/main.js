/**
 * STOLAŘSTVÍ PODOBA — INTERAKTIVNÍ MOTOR REALIZACÍ
 * 1. Filtrování kategorií nábytku (Kuchyně, Stoly, Schodiště, Skříně)
 * 2. Posuvný fullscreen prohlížeč konkrétní realizace (swipe, šipky, náhledy)
 * 3. Responzivní horní menu
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCategoryTabs();
  initRealizationSlider();
  initSmoothScroll();
});

/**
 * 1. RESPONZIVNÍ MENU
 */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * 2. KATEGORIE REALIZACÍ (FILTROVÁNÍ)
 */
function initCategoryTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.gallery-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      const selectedCat = tab.getAttribute('data-cat');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 3. POSUVNÝ PROHLÍŽEČ FOTEK DANÉ REALIZACE
 * Umožňuje otevřít např. realizaci typu kuchyňská linka a posouvat si fotky dané realizace.
 */
function initRealizationSlider() {
  const modal = document.getElementById('sliderModal');
  const backdrop = document.getElementById('sliderBackdrop');
  const closeBtn = document.getElementById('sliderCloseBtn');
  const prevBtn = document.getElementById('sliderPrevBtn');
  const nextBtn = document.getElementById('sliderNextBtn');
  const mainImg = document.getElementById('sliderMainImg');
  const catBadge = document.getElementById('sliderCatBadge');
  const photoTitle = document.getElementById('sliderPhotoTitle');
  const counter = document.getElementById('sliderCounter');
  const thumbsContainer = document.getElementById('sliderThumbs');
  const viewport = document.getElementById('sliderViewport');

  if (!modal || !mainImg) return;

  let currentAlbum = [];
  let currentIndex = 0;
  let categoryName = '';

  function renderPhoto(index) {
    if (!currentAlbum.length) return;
    currentIndex = (index + currentAlbum.length) % currentAlbum.length;
    const item = currentAlbum[currentIndex];

    mainImg.style.opacity = '0.3';
    mainImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      mainImg.src = item.src;
      mainImg.alt = item.title || categoryName;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 120);

    if (photoTitle) photoTitle.textContent = item.title || categoryName;
    if (catBadge) catBadge.textContent = categoryName;
    if (counter) counter.textContent = `${currentIndex + 1} / ${currentAlbum.length}`;

    // Aktualizace aktivního náhledu
    const thumbs = thumbsContainer.querySelectorAll('.slider-thumb-btn');
    thumbs.forEach((thumb, idx) => {
      thumb.classList.toggle('is-active', idx === currentIndex);
    });
  }

  function openAlbum(albumData, catTitle, startIndex = 0) {
    currentAlbum = albumData;
    categoryName = catTitle;
    currentIndex = startIndex;

    // Vykreslení spodních miniatur
    thumbsContainer.innerHTML = '';
    currentAlbum.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `slider-thumb-btn ${idx === startIndex ? 'is-active' : ''}`;
      btn.setAttribute('aria-label', `Zobrazit fotku ${idx + 1}`);

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.title || '';
      btn.appendChild(img);

      btn.addEventListener('click', () => {
        renderPhoto(idx);
      });
      thumbsContainer.appendChild(btn);
    });

    renderPhoto(startIndex);
    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Kliknutí na kartu realizace otevře posuvný prohlížeč pro dané album
  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const rawData = card.getAttribute('data-album');
      const catTitle = card.getAttribute('data-category-title') || 'Realizace';
      try {
        const albumData = JSON.parse(rawData);
        if (albumData && albumData.length) {
          openAlbum(albumData, catTitle, 0);
        }
      } catch (err) {
        console.error('Chyba při čtení alba:', err);
      }
    });
  });

  // Tlačítka pro posun
  if (prevBtn) prevBtn.addEventListener('click', () => renderPhoto(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderPhoto(currentIndex + 1));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Klávesové zkratky (šipky a Escape)
  window.addEventListener('keydown', (e) => {
    if (modal.hasAttribute('hidden')) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      renderPhoto(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      renderPhoto(currentIndex + 1);
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Gesta tažení prstem (Touch swipe na mobilu)
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        renderPhoto(currentIndex - 1); // Posun doprava -> předchozí
      } else {
        renderPhoto(currentIndex + 1); // Posun doleva -> další
      }
    }
  }, { passive: true });
}

/**
 * 4. PLYNULÉ SKROLOVÁNÍ KOTEV
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
