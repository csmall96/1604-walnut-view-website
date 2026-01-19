/**
 * Neighborhood Section Slideshow
 * - Auto-cycling photos of Wesley Heights
 * - Navigation dots
 * - Pause on hover
 */

document.addEventListener('DOMContentLoaded', () => {
  const slideshow = document.querySelector('.neighborhood-slideshow');
  if (!slideshow) return;

  const images = slideshow.querySelectorAll('img');
  const dotsContainer = slideshow.querySelector('.neighborhood-slideshow-dots');

  if (images.length <= 1) return; // No slideshow needed for single image

  let currentIndex = 0;
  let autoplayInterval = null;
  const AUTOPLAY_DELAY = 4000; // 4 seconds between transitions

  // Create navigation dots
  function createDots() {
    if (!dotsContainer) return;

    images.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'neighborhood-slideshow-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Update active states
  function updateSlide() {
    images.forEach((img, index) => {
      img.classList.toggle('active', index === currentIndex);
    });

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.neighborhood-slideshow-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    updateSlide();
    resetAutoplay();
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    updateSlide();
  }

  // Start autoplay
  function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
  }

  // Stop autoplay
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Reset autoplay timer
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pause on hover
  slideshow.addEventListener('mouseenter', stopAutoplay);
  slideshow.addEventListener('mouseleave', startAutoplay);

  // Touch support - pause during touch
  slideshow.addEventListener('touchstart', stopAutoplay, { passive: true });
  slideshow.addEventListener('touchend', () => {
    // Slight delay before restarting
    setTimeout(startAutoplay, 1000);
  }, { passive: true });

  // Initialize
  createDots();
  images[0].classList.add('active');
  startAutoplay();
});
