/**
 * Photo Gallery functionality
 * - Filter tabs (DOM-based filtering)
 * - Lightbox viewer
 * - Keyboard navigation
 * - Touch/swipe support for mobile
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-image');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext = lightbox?.querySelector('.lightbox-next');
  const lightboxCurrentSpan = document.getElementById('lightbox-current');
  const lightboxTotalSpan = document.getElementById('lightbox-total');

  let currentFilter = 'bedrooms';
  let currentIndex = 0;
  let visibleItems = [];

  // Get visible gallery items based on current filter
  // Matches the combined category logic in filterGallery
  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => {
      const itemCategory = item.dataset.category;

      if (currentFilter === 'all') {
        return true;
      } else if (currentFilter === 'bedrooms') {
        return itemCategory === 'bedroom';
      } else if (currentFilter === 'bathrooms') {
        return itemCategory === 'bathroom';
      } else if (currentFilter === 'kitchen-living') {
        return itemCategory === 'kitchen' || itemCategory === 'living';
      } else if (currentFilter === 'exterior') {
        return itemCategory === 'exterior';
      }
      return false;
    });

    // Update lightbox total count
    if (lightboxTotalSpan) {
      lightboxTotalSpan.textContent = visibleItems.length;
    }
  }

  // Filter gallery by showing/hiding DOM elements
  // Supports combined categories: bedrooms, bathrooms, kitchen-living, exterior
  function filterGallery(category) {
    currentFilter = category;

    galleryItems.forEach(item => {
      const itemCategory = item.dataset.category;
      let shouldShow = false;

      if (category === 'all') {
        shouldShow = true;
      } else if (category === 'bedrooms') {
        shouldShow = itemCategory === 'bedroom';
      } else if (category === 'bathrooms') {
        shouldShow = itemCategory === 'bathroom';
      } else if (category === 'kitchen-living') {
        shouldShow = itemCategory === 'kitchen' || itemCategory === 'living';
      } else if (category === 'exterior') {
        shouldShow = itemCategory === 'exterior';
      }

      if (shouldShow) {
        item.style.display = '';
        item.classList.remove('gallery-item-hidden');
      } else {
        item.style.display = 'none';
        item.classList.add('gallery-item-hidden');
      }
    });

    updateVisibleItems();
  }

  // Filter tab click handlers
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active state
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter photos
      filterGallery(tab.dataset.filter);
    });
  });

  // Lightbox functionality
  function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;

    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (!lightboxImage || visibleItems.length === 0) return;

    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');

    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
    }

    if (lightboxCurrentSpan) {
      lightboxCurrentSpan.textContent = currentIndex + 1;
    }
  }

  function nextImage() {
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxImage();
  }

  function prevImage() {
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }

  // Add click listeners to gallery items
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Find index within visible items
      const index = visibleItems.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  // Lightbox control event listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextImage();
    });
  }

  // Close lightbox on overlay click (but not on image or controls)
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });

  // Touch/swipe support for lightbox (mobile)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);

    // Only handle horizontal swipes (not vertical scrolling)
    if (Math.abs(diffX) > swipeThreshold && diffY < 100) {
      if (diffX > 0) {
        nextImage(); // Swipe left = next
      } else {
        prevImage(); // Swipe right = prev
      }
    }
  }

  // Initialize with bedrooms filter
  filterGallery('bedrooms');
});
