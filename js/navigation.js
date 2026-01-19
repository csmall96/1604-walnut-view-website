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

  // Throttle scroll events
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  });

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

  // Function to activate a specific tab
  function activateShowcaseTab(index) {
    const tabsArray = Array.from(showcaseTabs);
    if (index < 0 || index >= tabsArray.length) return;

    const tab = tabsArray[index];
    const featureId = tab.dataset.feature;

    // Remove active class from all tabs and panels
    showcaseTabs.forEach(t => t.classList.remove('active'));
    showcasePanels.forEach(p => p.classList.remove('active'));

    // Add active class to target tab and corresponding panel
    tab.classList.add('active');
    const activePanel = document.querySelector(`.showcase-panel[data-feature="${featureId}"]`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // On mobile, scroll the tab into view only if section is visible
    if (window.innerWidth < 768 && showcaseSectionVisible) {
      const tabsContainer = document.querySelector('.showcase-tabs');
      if (tabsContainer) {
        // Calculate scroll position with padding offset
        const containerPadding = 16; // Match --space-md
        const scrollPosition = tab.offsetLeft - containerPadding;
        tabsContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  }

  // Function to get current active tab index
  function getCurrentShowcaseIndex() {
    const tabsArray = Array.from(showcaseTabs);
    return tabsArray.findIndex(tab => tab.classList.contains('active'));
  }

  // Start auto-cycling tabs
  function startShowcaseAutoplay() {
    if (userHasInteracted || showcaseAutoplayInterval) return;

    showcaseAutoplayInterval = setInterval(() => {
      const currentIndex = getCurrentShowcaseIndex();
      const nextIndex = (currentIndex + 1) % showcaseTabs.length;
      activateShowcaseTab(nextIndex);
    }, 4000); // Cycle every 4 seconds
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
    // Autoplay disabled - users navigate manually

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
        const currentIndex = getCurrentShowcaseIndex();
        const prevIndex = (currentIndex - 1 + showcaseTabs.length) % showcaseTabs.length;
        activateShowcaseTab(prevIndex);
      });
    }

    if (showcaseNext) {
      showcaseNext.addEventListener('click', () => {
        stopShowcaseAutoplay();
        const currentIndex = getCurrentShowcaseIndex();
        const nextIndex = (currentIndex + 1) % showcaseTabs.length;
        activateShowcaseTab(nextIndex);
      });
    }

    // Also stop autoplay on scroll within the tabs container (mobile swipe)
    const tabsContainer = document.querySelector('.showcase-tabs');
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

        let newIndex;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          newIndex = (currentIndex + 1) % tabsArray.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          newIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIndex = tabsArray.length - 1;
        }

        if (newIndex !== undefined) {
          tabsArray[newIndex].focus();
          activateShowcaseTab(newIndex);
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
