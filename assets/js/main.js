/**
 * STOLAŘSTVÍ PODOBA — INTERAKTIVNÍ JAVASCRIPT ENGINE
 * Zajišťuje:
 * 1. Přepínač reprezentativních prací v Hero sekci (kuchyně, masiv, schodiště).
 * 2. Plynulé tažení a prostorové 3D natáčení fotografií do stran bez šipek a bez neonových glow efektů.
 * 3. 3D náklon karet při přejetí myší s decentním odleskem laku.
 * 4. 3D inspekční prohlížeč s možností volně natáčet snímek doleva a doprava.
 * 5. 100% bezpečný kód bez zranitelných DOM sinků (žádný innerHTML).
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroShowcase();
  initDraggable3DStage();
  initCard3DTilt();
  initTurntableModal();
  initSmoothScroll();
});

/**
 * 1. PŘEPÍNAČ REPREZENTATIVNÍCH PRACÍ V HERO SEKCI
 */
function initHeroShowcase() {
  const switchBtns = document.querySelectorAll('.hero-switch-btn');
  const heroImg = document.getElementById('heroBgImg');
  if (!switchBtns.length || !heroImg) return;

  function setActiveSlide(btn) {
    switchBtns.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');

    const newSrc = btn.getAttribute('data-hero-img');
    if (newSrc && heroImg.src !== newSrc) {
      heroImg.style.opacity = '0.4';
      setTimeout(() => {
        heroImg.src = newSrc;
        heroImg.style.opacity = '1';
      }, 150);
    }
  }

  switchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveSlide(btn);
    });
  });

  // Automatické střídání po 8 sekundách pro oživení stránky
  let currentIndex = 0;
  let intervalId = setInterval(() => {
    currentIndex = (currentIndex + 1) % switchBtns.length;
    setActiveSlide(switchBtns[currentIndex]);
  }, 8000);

  // Pozastavení rotace při najetí myší nebo interakci s obsahem hera
  const heroContent = document.querySelector('.hero-content') || document.querySelector('.hero-section');
  if (heroContent) {
    heroContent.addEventListener('mouseenter', () => clearInterval(intervalId));
  }
}

/**
 * 2. INTERAKTIVNÍ 3D STAGE PRO FOTOGALERII
 * Umožňuje přirozené tažení myší i prstem bez zbytečných šipek.
 */
function initDraggable3DStage() {
  const stage = document.getElementById('interactiveStage');
  const track = document.getElementById('stageTrack');
  if (!stage || !track) return;

  let isPointerDown = false;
  let startX = 0;
  let scrollStart = 0;
  let prevX = 0;
  let velocityX = 0;
  let momentumAnimId = null;
  let hasDragged = false;

  const cards = track.querySelectorAll('.photo-card');

  function updateCard3DRotation(tiltDeg) {
    const clampedTilt = Math.max(-16, Math.min(16, tiltDeg));
    cards.forEach((card) => {
      card.style.transform = `rotateY(${clampedTilt}deg)`;
    });
  }

  stage.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    hasDragged = false;
    stage.classList.add('is-dragging');
    startX = e.pageX - stage.offsetLeft;
    scrollStart = stage.scrollLeft;
    prevX = e.pageX;
    velocityX = 0;
    if (momentumAnimId) cancelAnimationFrame(momentumAnimId);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const x = e.pageX - stage.offsetLeft;
    const walk = (x - startX) * 1.35;
    
    // Pokud je posun větší než 6px, označit jako tažení a potlačit nechtěný klik
    if (Math.abs(x - startX) > 6) {
      hasDragged = true;
    }

    stage.scrollLeft = scrollStart - walk;

    const deltaX = e.pageX - prevX;
    velocityX = deltaX;
    prevX = e.pageX;

    updateCard3DRotation(-velocityX * 0.65);
  });

  const handlePointerUp = () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    stage.classList.remove('is-dragging');

    // Reset flagu tažení po doběhnutí event loopu, aby click zachytil stav
    setTimeout(() => {
      hasDragged = false;
    }, 120);

    function applyMomentum() {
      if (Math.abs(velocityX) > 0.5) {
        stage.scrollLeft -= velocityX;
        velocityX *= 0.92;
        updateCard3DRotation(-velocityX * 0.55);
        momentumAnimId = requestAnimationFrame(applyMomentum);
      } else {
        updateCard3DRotation(0);
      }
    }
    momentumAnimId = requestAnimationFrame(applyMomentum);
  };

  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);

  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      stage.scrollBy({ left: 320, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stage.scrollBy({ left: -320, behavior: 'smooth' });
    }
  });
}

/**
 * 3. 3D NÁKLON KARET PŘI PŘEJETÍ MYŠÍ S JEMNÝM ODLESKEM LAKU
 */
function initCard3DTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cardInners = document.querySelectorAll('.photo-card-inner');

  cardInners.forEach((card) => {
    const sheen = card.querySelector('.wood-sheen');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (sheen) {
        const sheenX = (x / rect.width) * 100;
        const sheenY = (y / rect.height) * 100;
        sheen.style.background = `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (sheen) {
        sheen.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 60%)';
      }
    });
  });
}

/**
 * 4. 3D INSPEKČNÍ PROHLÍŽEČ S MOŽNOSTÍ OTÁČET SNÍMKY DOLEVA A DOPRAVA
 */
function initTurntableModal() {
  const modal = document.getElementById('turntableModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const stage = document.getElementById('turntableStage');
  const card = document.getElementById('turntableCard');
  const img = document.getElementById('turntableImg');
  const title = document.getElementById('turntableTitle');
  const angleDisplay = document.getElementById('angleDisplay');
  const specular = document.getElementById('turntableSpecular');

  if (!modal || !stage || !card || !img) return;

  let currentAngle = 0;
  let isDragging = false;
  let startX = 0;
  let startAngle = 0;

  const photoCards = document.querySelectorAll('.photo-card');
  let lastActiveElement = null;

  photoCards.forEach((photoCard) => {
    photoCard.addEventListener('click', (e) => {
      // Pokud uživatel táhnul pruh, zabránit nechtěnému otevření modalu
      const stage = document.getElementById('interactiveStage');
      if (stage && stage.classList.contains('is-dragging')) {
        return;
      }

      const cardImg = photoCard.querySelector('img');
      const cardTitle = photoCard.getAttribute('data-title') || 'Ukázka práce';

      if (cardImg) {
        img.src = cardImg.src;
        img.alt = cardImg.alt;
      }
      if (title) {
        title.textContent = cardTitle;
      }

      lastActiveElement = photoCard;
      currentAngle = 0;
      applyAngle(0);
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    });
  });

  function closeModal() {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  function applyAngle(deg) {
    currentAngle = deg;
    card.style.transform = `rotateY(${deg}deg)`;
    if (angleDisplay) {
      angleDisplay.textContent = `${Math.round(deg)}°`;
    }

    if (specular) {
      const pos = 50 + (deg / 45) * 40;
      specular.style.background = `linear-gradient(${105 + deg * 0.5}deg, rgba(255, 255, 255, 0.22) 0%, transparent ${pos}%)`;
    }
  }

  stage.addEventListener('pointerdown', (e) => {
    isDragging = true;
    stage.classList.add('is-turning');
    startX = e.clientX;
    startAngle = currentAngle;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    let newAngle = startAngle + deltaX * 0.45;
    newAngle = Math.max(-45, Math.min(45, newAngle));
    applyAngle(newAngle);
  });

  const stopTurn = () => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-turning');
  };

  window.addEventListener('pointerup', stopTurn);
  window.addEventListener('pointercancel', stopTurn);
}

/**
 * 5. PLYNULÉ KOTVY PRO NAVIGACI
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
