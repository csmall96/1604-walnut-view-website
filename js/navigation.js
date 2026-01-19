/**
 * Navigation functionality
 * - Mobile hamburger menu
 * - Smooth scroll navigation
 * - Active link highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link, .footer-link');

  // Mobile menu toggle
  function openMobileMenu() {
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Event listeners for mobile menu
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileMenu);
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Smooth scroll for all navigation links
  const allNavLinks = document.querySelectorAll('a[href^="#"]');

  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Get header height for offset
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;

        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active nav link on scroll
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
        });

        // Add active class to current section's link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }

  // Floating CTA visibility (mobile only)
  const floatingCta = document.querySelector('.floating-cta');
  const heroScheduleBtn = document.getElementById('hero-schedule-btn');

  function updateFloatingCtaVisibility() {
    if (!floatingCta || !heroScheduleBtn) return;

    // Only apply on mobile
    if (window.innerWidth >= 768) {
      floatingCta.classList.remove('visible');
      return;
    }

    const rect = heroScheduleBtn.getBoundingClientRect();
    // Show floating CTA when hero button is above the viewport
    if (rect.bottom < 0) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  }

  // Throttle scroll events
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        updateFloatingCtaVisibility();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Also check on resize
  window.addEventListener('resize', updateFloatingCtaVisibility);

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Show success message
          contactForm.classList.add('hidden');
          formSuccess.classList.add('active');
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form error:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('There was an error submitting the form. Please try again or contact us directly.');
      }
    });
  }

  // Show all businesses toggle
  const showAllBtn = document.getElementById('show-all-businesses');
  const hiddenBusinessCards = document.querySelectorAll('.business-card-hidden');

  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      hiddenBusinessCards.forEach(card => {
        card.classList.remove('business-card-hidden');
      });
      showAllBtn.style.display = 'none';
    });
  }

  // Feature Showcase interactivity
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const showcasePanels = document.querySelectorAll('.showcase-panel');
  let showcaseAutoplayInterval = null;
  let userHasInteracted = false;

  // Track if showcase section is visible (for conditional scrollIntoView)
  let showcaseSectionVisible = false;
  const showcaseSection = document.querySelector('.showcase-section');

  if (showcaseSection) {
    const observer = new IntersectionObserver((entries) => {
      showcaseSectionVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(showcaseSection);
  }

  // Infinite carousel state
  let currentShowcaseIndex = 0;
  const totalTabs = showcaseTabs.length;
  const tabsContainer = document.querySelector('.showcase-tabs');
  let isTransitioning = false;

  // Setup infinite carousel on mobile - clone tabs at both ends
  function setupInfiniteCarousel() {
    if (!tabsContainer || totalTabs === 0) return;
    if (window.innerWidth >= 768) return;

    // Remove any existing clones first
    const existingClones = tabsContainer.querySelectorAll('.showcase-tab-clone');
    existingClones.forEach(clone => clone.remove());

    // Clone all tabs and append to both ends for seamless looping
    const tabsArray = Array.from(showcaseTabs);

    // Clone last few tabs and prepend
    for (let i = totalTabs - 1; i >= Math.max(0, totalTabs - 3); i--) {
      const clone = tabsArray[i].cloneNode(true);
      clone.classList.add('showcase-tab-clone');
      clone.dataset.cloneOf = i;
      tabsContainer.insertBefore(clone, tabsContainer.firstChild);
    }

    // Clone first few tabs and append
    for (let i = 0; i < Math.min(3, totalTabs); i++) {
      const clone = tabsArray[i].cloneNode(true);
      clone.classList.add('showcase-tab-clone');
      clone.dataset.cloneOf = i;
      tabsContainer.appendChild(clone);
    }

    // Add click handlers to clones
    const allClones = tabsContainer.querySelectorAll('.showcase-tab-clone');
    allClones.forEach(clone => {
      clone.addEventListener('click', () => {
        const originalIndex = parseInt(clone.dataset.cloneOf);
        stopShowcaseAutoplay();
        activateShowcaseTab(originalIndex, true);
      });
    });

    // Set initial scroll position to show the first real tab
    const firstRealTab = tabsArray[0];
    const containerPadding = 16;
    tabsContainer.scrollLeft = firstRealTab.offsetLeft - containerPadding;
  }

  // Function to activate a specific tab with infinite loop support
  function activateShowcaseTab(index, instant = false) {
    if (index < 0 || index >= totalTabs) return;
    if (isTransitioning && !instant) return;

    currentShowcaseIndex = index;
    const tabsArray = Array.from(showcaseTabs);
    const tab = tabsArray[index];
    const featureId = tab.dataset.feature;

    // Remove active class from all tabs (including clones) and panels
    tabsContainer?.querySelectorAll('.showcase-tab, .showcase-tab-clone').forEach(t => t.classList.remove('active'));
    showcasePanels.forEach(p => p.classList.remove('active'));

    // Add active class to target tab and corresponding panel
    tab.classList.add('active');

    // Also activate matching clones
    tabsContainer?.querySelectorAll(`.showcase-tab-clone[data-clone-of="${index}"]`).forEach(clone => {
      clone.classList.add('active');
    });

    const activePanel = document.querySelector(`.showcase-panel[data-feature="${featureId}"]`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // On mobile, scroll the tab into view
    if (window.innerWidth < 768 && showcaseSectionVisible && tabsContainer) {
      const containerPadding = 16;
      const scrollPosition = tab.offsetLeft - containerPadding;

      if (instant) {
        tabsContainer.scrollLeft = scrollPosition;
      } else {
        tabsContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }

  // Navigate with infinite loop support
  function navigateShowcase(direction) {
    if (isTransitioning) return;

    const tabsArray = Array.from(showcaseTabs);
    let newIndex = currentShowcaseIndex + direction;

    // Handle wrapping with smooth animation
    if (window.innerWidth < 768 && tabsContainer) {
      isTransitioning = true;

      if (newIndex >= totalTabs) {
        // Going forward past end - scroll to clone, then jump to real
        newIndex = 0;
        const cloneTab = tabsContainer.querySelector(`.showcase-tab-clone[data-clone-of="0"]:last-of-type`);
        if (cloneTab) {
          const containerPadding = 16;
          tabsContainer.scrollTo({ left: cloneTab.offsetLeft - containerPadding, behavior: 'smooth' });

          setTimeout(() => {
            activateShowcaseTab(0, true);
            isTransitioning = false;
          }, 350);

          // Update panel immediately
          const featureId = tabsArray[0].dataset.feature;
          showcasePanels.forEach(p => p.classList.remove('active'));
          const activePanel = document.querySelector(`.showcase-panel[data-feature="${featureId}"]`);
          if (activePanel) activePanel.classList.add('active');
          return;
        }
      } else if (newIndex < 0) {
        // Going backward past start - scroll to clone, then jump to real
        newIndex = totalTabs - 1;
        const cloneTab = tabsContainer.querySelector(`.showcase-tab-clone[data-clone-of="${newIndex}"]`);
        if (cloneTab) {
          const containerPadding = 16;
          tabsContainer.scrollTo({ left: cloneTab.offsetLeft - containerPadding, behavior: 'smooth' });

          setTimeout(() => {
            activateShowcaseTab(newIndex, true);
            isTransitioning = false;
          }, 350);

          // Update panel immediately
          const featureId = tabsArray[newIndex].dataset.feature;
          showcasePanels.forEach(p => p.classList.remove('active'));
          const activePanel = document.querySelector(`.showcase-panel[data-feature="${featureId}"]`);
          if (activePanel) activePanel.classList.add('active');
          return;
        }
      }

      isTransitioning = false;
    } else {
      // Desktop: simple wrap
      if (newIndex >= totalTabs) newIndex = 0;
      if (newIndex < 0) newIndex = totalTabs - 1;
    }

    activateShowcaseTab(newIndex);
  }

  // Function to get current active tab index
  function getCurrentShowcaseIndex() {
    return currentShowcaseIndex;
  }

  // Start auto-cycling tabs
  function startShowcaseAutoplay() {
    if (userHasInteracted || showcaseAutoplayInterval) return;

    showcaseAutoplayInterval = setInterval(() => {
      navigateShowcase(1);
    }, 4000);
  }

  // Stop auto-cycling
  function stopShowcaseAutoplay() {
    if (showcaseAutoplayInterval) {
      clearInterval(showcaseAutoplayInterval);
      showcaseAutoplayInterval = null;
    }
    userHasInteracted = true;
  }

  if (showcaseTabs.length > 0) {
    // Setup infinite carousel on mobile
    setupInfiniteCarousel();
    window.addEventListener('resize', () => {
      setupInfiniteCarousel();
    });

    // Stop autoplay when user interacts with tabs
    showcaseTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        stopShowcaseAutoplay();
        activateShowcaseTab(index);
      });
    });

    // Arrow navigation
    const showcasePrev = document.querySelector('.showcase-prev');
    const showcaseNext = document.querySelector('.showcase-next');

    if (showcasePrev) {
      showcasePrev.addEventListener('click', () => {
        stopShowcaseAutoplay();
        navigateShowcase(-1);
      });
    }

    if (showcaseNext) {
      showcaseNext.addEventListener('click', () => {
        stopShowcaseAutoplay();
        navigateShowcase(1);
      });
    }

    // Also stop autoplay on scroll within the tabs container (mobile swipe)
    if (tabsContainer) {
      tabsContainer.addEventListener('scroll', () => {
        stopShowcaseAutoplay();
      }, { passive: true });

      // Keyboard navigation for tabs
      tabsContainer.addEventListener('keydown', (e) => {
        stopShowcaseAutoplay();

        const currentTab = document.activeElement;
        if (!currentTab.classList.contains('showcase-tab')) return;

        const tabsArray = Array.from(showcaseTabs);
        const currentIndex = tabsArray.indexOf(currentTab);

        let direction = 0;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          direction = 1;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          direction = -1;
        } else if (e.key === 'Home') {
          e.preventDefault();
          activateShowcaseTab(0);
          tabsArray[0].focus();
          return;
        } else if (e.key === 'End') {
          e.preventDefault();
          activateShowcaseTab(tabsArray.length - 1);
          tabsArray[tabsArray.length - 1].focus();
          return;
        }

        if (direction !== 0) {
          navigateShowcase(direction);
          tabsArray[currentShowcaseIndex].focus();
        }
      });
    }
  }

  // Image transitions for multi-image showcase panels (Murphy bed, Closet)
  const transitionPanels = document.querySelectorAll('.showcase-transition');

  transitionPanels.forEach(panel => {
    const images = panel.querySelectorAll('.showcase-image');
    if (images.length < 2) return;

    let currentIndex = 0;

    // Auto-transition every 3 seconds
    setInterval(() => {
      images[currentIndex].classList.remove('showcase-img-active');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('showcase-img-active');
    }, 3000);
  });
});
