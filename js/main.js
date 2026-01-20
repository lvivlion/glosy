/**
 * Glossy Bathtub - Main JavaScript
 * Handles navigation, animations, and form interactions
 */

// Global form success handler
let formSubmitted = false;

window.handleFormSubmit = function () {
  if (formSubmitted) {
    console.log('Form submission response received');
    const googleForm = document.getElementById('contactForm');
    const formSuccessMsg = document.getElementById('formSuccess');

    if (googleForm && formSuccessMsg) {
      googleForm.style.display = 'none';
      formSuccessMsg.style.display = 'block';
      formSuccessMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Reset flag
    formSubmitted = false;
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function () {
      formSubmitted = true;
      console.log('Form submitting...');
    });
  }
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function (e) {
      console.log('Mobile toggle clicked');
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle('active');
      this.classList.toggle('active');

      // Prevent scrolling when menu is open
      if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Header scroll effect
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.background = 'rgba(13, 13, 13, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
      header.style.background = 'rgba(13, 13, 13, 0.95)';
      header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.benefit-card, .service-card, .pricing-card, .why-us-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Form handling is now managed by the Google Forms success handler below.
  // The submit event will now naturally submit to the hidden_iframe.

  // Phone number formatting
  const phoneInput = document.getElementById('phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');

      if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      }

      e.target.value = value;
    });
  }

  // Add animation delays to grid items
  document.querySelectorAll('.benefits-grid .benefit-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  document.querySelectorAll('.services-grid .service-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  document.querySelectorAll('.pricing-grid .pricing-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  document.querySelectorAll('.why-us-grid .why-us-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
  });

  // Set dynamic year in footer
  const currentYearElement = document.getElementById('currentYear');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Google Forms success handler
  const googleForm = document.getElementById('contactForm');
  const formSuccessMsg = document.getElementById('formSuccess');
  const resetBtn = document.getElementById('resetFormBtn');

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      googleForm.reset();
      googleForm.style.display = 'block';
      formSuccessMsg.style.display = 'none';
      googleForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Load More Gallery Images (8 at a time)
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    // Initial state: hide items from index 8 onwards
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
      if (index >= 8) {
        item.classList.add('hidden-gallery');
      }
    });

    loadMoreBtn.addEventListener('click', function () {
      const hiddenItems = document.querySelectorAll('.hidden-gallery');
      const itemsToShow = Array.from(hiddenItems).slice(0, 8);

      itemsToShow.forEach(item => {
        item.classList.remove('hidden-gallery');
        item.classList.add('fade-in');
      });

      // Hide button if no more hidden items
      if (document.querySelectorAll('.hidden-gallery').length === 0) {
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) {
          loadMoreContainer.style.display = 'none';
        } else {
          loadMoreBtn.parentElement.style.display = 'none';
        }
      }
    });
  }
});

// Lightbox functionality
const galleryImages = document.querySelectorAll('.gallery-item img');
let currentImageIndex = 0;

window.openLightbox = function (index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');

  currentImageIndex = index;
  // Ensure galleryImages has items before accessing
  if (galleryImages.length > 0 && galleryImages[index]) {
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    counter.textContent = `${index + 1} / ${galleryImages.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    console.error('Image source not found for index:', index);
  }
};

window.closeLightbox = function () {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.changeImage = function (direction) {
  currentImageIndex += direction;

  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  } else if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }

  // Update view
  window.openLightbox(currentImageIndex);
};

