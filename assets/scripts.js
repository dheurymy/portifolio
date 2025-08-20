window.addEventListener('load', () => {
  const carrosselConfigs = [
    { wrapper: '.carousel-wrapper', track: '.languages' },
    { wrapper: '.carousel-wrapper2', track: '.tech' }
  ];

  carrosselConfigs.forEach(({ wrapper, track }) => {
    const trackEl = document.querySelector(track);
    const originalBadges = Array.from(trackEl.children);
    const badgeWidth = originalBadges[0].offsetWidth + 20;
    let index = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let autoplayId = null;

    // 🔁 Duplicar o conjunto
    originalBadges.forEach(badge => {
      const clone = badge.cloneNode(true);
      trackEl.appendChild(clone);
    });

    let allBadges = Array.from(trackEl.children);
    const totalBadges = originalBadges.length;

    // 🧭 Posicionar no início
    trackEl.style.transition = 'none';
    trackEl.style.transform = `translateX(-${index * badgeWidth}px)`;

    // ▶️ Autoplay controlado
    function iniciarAutoplay() {
      autoplayId = setInterval(() => {
        index++;
        trackEl.style.transition = 'transform 0.4s ease';
        trackEl.style.transform = `translateX(-${index * badgeWidth}px)`;

        setTimeout(() => {
          if (index === totalBadges) {
            trackEl.style.transition = 'none';
            index = 0;
            trackEl.style.transform = `translateX(-${index * badgeWidth}px)`;
          }
        }, 400);
      }, 2000);
    }

    function pararAutoplay() {
      clearInterval(autoplayId);
    }

    iniciarAutoplay();

    // 🖱️ Hover pause
    const wrapperEl = document.querySelector(wrapper);
    wrapperEl.addEventListener('mouseenter', pararAutoplay);
    wrapperEl.addEventListener('mouseleave', iniciarAutoplay);

    

    trackEl.addEventListener('touchstart', (e) => startDrag(e.touches[0].pageX));
    trackEl.addEventListener('touchend', endDrag);
    trackEl.addEventListener('touchmove', (e) => moveDrag(e.touches[0].pageX));

    function startDrag(x) {
      isDragging = true;
      startX = x;
      trackEl.style.transition = 'none';
      pararAutoplay();
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      index = Math.round(currentTranslate / badgeWidth);
      trackEl.style.transition = 'transform 0.4s ease';
      trackEl.style.transform = `translateX(-${index * badgeWidth}px)`;

      setTimeout(() => {
        if (index >= totalBadges) {
          trackEl.style.transition = 'none';
          index = 0;
          trackEl.style.transform = `translateX(-${index * badgeWidth}px)`;
        }
      }, 400);

      iniciarAutoplay();
    }

    function moveDrag(x) {
      if (!isDragging) return;
      const dx = startX - x;
      currentTranslate = index * badgeWidth + dx;
      trackEl.style.transform = `translateX(-${currentTranslate}px)`;
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.slider-track');
  const dotsContainer = document.querySelector('.slider-dots');
  const slides = document.querySelectorAll('.project');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoplay;

  // 🔘 Criar pontinhos
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }

  function startAutoplay() {
    autoplay = setInterval(nextSlide, 3000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  // ▶️ Iniciar autoplay
  startAutoplay();

  // 🖱️ Pausar no hover
  slides.forEach(slide => {
    slide.addEventListener('mouseenter', () => clearInterval(autoplay));
    slide.addEventListener('mouseleave', () => startAutoplay());
  });
});