/**
 * Hero Carousel - Swipeable Image Gallery
 * Touch/swipe support for mobile, click navigation for all devices
 */

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.hero-carousel-track');
  const slides = carousel.querySelectorAll('.hero-carousel-slide');
  const dots = carousel.querySelectorAll('.hero-carousel-dot');

  if (slides.length === 0) return;

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;
  let autoplayInterval = null;
  let restartTimeout = null;

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    // Update slide positions
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active states
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Touch event handlers
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    isDragging = true;
    stopAutoplay();
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    touchEndX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;

    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }

    touchStartX = 0;
    touchEndX = 0;

    scheduleAutoplayRestart();
  }

  // Add touch listeners to carousel
  carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
  carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
  carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(index);
      scheduleAutoplayRestart();
    });
  });

  // Arrow navigation buttons
  const prevBtn = carousel.querySelector('.hero-carousel-prev');
  const nextBtn = carousel.querySelector('.hero-carousel-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAutoplay();
      goToSlide(currentIndex - 1);
      scheduleAutoplayRestart();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAutoplay();
      goToSlide(currentIndex + 1);
      scheduleAutoplayRestart();
    });
  }

  // Click on carousel image area to advance (desktop convenience)
  carousel.addEventListener('click', (e) => {
    // Don't advance if clicking on dots or nav buttons
    if (e.target.closest('.hero-carousel-dots')) return;
    if (e.target.closest('.hero-carousel-nav')) return;

    stopAutoplay();
    goToSlide(currentIndex + 1);
    scheduleAutoplayRestart();
  });

  // Autoplay functions - works on all screen sizes
  function startAutoplay() {
    if (autoplayInterval !== null) return;

    autoplayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  function stopAutoplay() {
    // Clear any pending restart
    if (restartTimeout !== null) {
      clearTimeout(restartTimeout);
      restartTimeout = null;
    }

    // Clear the interval
    if (autoplayInterval !== null) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function scheduleAutoplayRestart() {
    // Clear any existing restart timeout first
    if (restartTimeout !== null) {
      clearTimeout(restartTimeout);
      restartTimeout = null;
    }

    // Schedule a new restart
    restartTimeout = setTimeout(() => {
      restartTimeout = null;
      startAutoplay();
    }, 10000);
  }

  // Start autoplay on load
  startAutoplay();
});
