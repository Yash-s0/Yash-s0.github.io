/* ============================================================================
   MODERN PORTFOLIO - VANILLA JAVASCRIPT
   Theme Toggle, Navigation, Smooth Scrolling, & Interactions
   ============================================================================ */

(function() {
  'use strict';

  /* --------------------------------------------------------------------------
     CIRCULAR FAVICON GENERATOR
     -------------------------------------------------------------------------- */
  function setCircularFavicon() {
    const faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) return;
    
    const imgSrc = faviconLink.href;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const size = 128;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Create circular clip
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw image
      ctx.drawImage(img, 0, 0, size, size);
      
      // Update favicon
      faviconLink.href = canvas.toDataURL('image/png');
    };
    
    img.src = imgSrc;
  }
  
  // Set circular favicon on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setCircularFavicon);
  } else {
    setCircularFavicon();
  }

  /* --------------------------------------------------------------------------
     THEME TOGGLE - Dark/Light Mode with localStorage
     -------------------------------------------------------------------------- */
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;
  
  // Get saved theme or default to system preference
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon (if needed)
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) {
        if (theme === 'dark') {
          // Show sun icon for switching to light
          icon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          `;
        } else {
          // Show moon icon for switching to dark
          icon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          `;
        }
      }
    }
  }
  
  // Initialize theme
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  /* --------------------------------------------------------------------------
     MOBILE MENU TOGGLE
     -------------------------------------------------------------------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --------------------------------------------------------------------------
     HEADER SCROLL EFFECT
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    lastScrollTop = scrollTop;
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* --------------------------------------------------------------------------
     ACTIVE NAV LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  setActiveNavLink();

  /* --------------------------------------------------------------------------
     SMOOTH SCROLL FOR ANCHOR LINKS
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
     -------------------------------------------------------------------------- */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe cards and sections
  document.querySelectorAll('.card, .section-header, .timeline-item, .skill-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  /* --------------------------------------------------------------------------
     PROJECT SLIDER (For individual project pages)
     -------------------------------------------------------------------------- */
  const sliderState = {}; // store slider states globally for modal access
  
  function initProjectSliders() {
    document.querySelectorAll(".project-slider").forEach((slider, sliderIdx) => {
      const slides = Array.from(slider.querySelectorAll(".project-slide"));
      const prevBtn = slider.querySelector(".slider-prev");
      const nextBtn = slider.querySelector(".slider-next");
      let index = 0;
      let timer = null;

      const showSlide = (i) =>
        slides.forEach((slide, idx) => slide.classList.toggle("active", idx === i));

      const next = () => {
        index = (index + 1) % slides.length;
        showSlide(index);
      };

      const prev = () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
      };

      if (nextBtn)
        nextBtn.addEventListener("click", () => {
          next();
          resetTimer();
        });

      if (prevBtn)
        prevBtn.addEventListener("click", () => {
          prev();
          resetTimer();
        });

      const resetTimer = () => {
        clearInterval(timer);
        timer = setInterval(next, 3000);
      };

      const startTimer = () => {
        timer = setInterval(next, 3000);
      };

      const stopTimer = () => {
        clearInterval(timer);
      };

      startTimer();
      showSlide(index);

      // store slider state for modal access
      sliderState[sliderIdx] = {
        slider,
        slides,
        timer: null,
        stopTimer,
        startTimer,
      };
    });
  }

  /* --------------------------------------------------------------------------
     IMAGE MODAL (For project galleries)
     -------------------------------------------------------------------------- */
  function initImageModal() {
    const modal = document.getElementById("image-modal");
    if (!modal) return; // modal not present on this page

    const modalImg = modal.querySelector(".image-modal__img");
    const closeButtons = modal.querySelectorAll("[data-action='close']");
    const prevBtn = modal.querySelector("[data-action='prev']");
    const nextBtn = modal.querySelector("[data-action='next']");

    // collect all slider images from project-slider
    const sliders = Array.from(document.querySelectorAll(".project-slider"));
    const items = [];
    const sliderMap = {}; // maps image index to slider index

    sliders.forEach((slider, sliderIdx) => {
      const slides = Array.from(slider.querySelectorAll(".project-slide"));
      slides.forEach((slide) => {
        items.push(slide);
        sliderMap[items.length - 1] = sliderIdx;
      });
    });

    if (items.length === 0) return; // no images to show

    let currentIndex = 0;

    function showAt(index) {
      currentIndex = (index + items.length) % items.length;
      const src =
        items[currentIndex].getAttribute("data-large") || items[currentIndex].src;
      const alt = items[currentIndex].alt || "";
      modalImg.src = src;
      modalImg.alt = alt;
    }

    function stopSliderAutoplay() {
      // stop all sliders when modal opens
      Object.values(sliderState).forEach((state) => {
        state.stopTimer();
      });
    }

    function resumeSliderAutoplay() {
      // resume all sliders when modal closes
      Object.values(sliderState).forEach((state) => {
        state.startTimer();
      });
    }

    function openModal(index) {
      stopSliderAutoplay();
      showAt(index);
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      nextBtn.focus();
    }

    function closeModal() {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      resumeSliderAutoplay();
    }

    // attach click on gallery items
    items.forEach((img, i) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openModal(i));
    });

    // nav handlers
    if (prevBtn) prevBtn.addEventListener("click", () => showAt(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => showAt(currentIndex + 1));

    // close handlers
    closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));
    const backdrop = modal.querySelector(".image-modal__backdrop");
    if (backdrop) backdrop.addEventListener("click", closeModal);

    // keyboard support
    document.addEventListener("keydown", (e) => {
      if (modal.getAttribute("aria-hidden") === "false") {
        if (e.key === "ArrowRight") {
          showAt(currentIndex + 1);
          e.preventDefault();
        }
        if (e.key === "ArrowLeft") {
          showAt(currentIndex - 1);
          e.preventDefault();
        }
        if (e.key === "Escape") {
          closeModal();
          e.preventDefault();
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     PROFILE CARD TILT EFFECT (if exists)
     -------------------------------------------------------------------------- */
  function initProfileTilt() {
    const profileCard = document.querySelector('.profile-tilt');
    if (!profileCard) return;

    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      profileCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    profileCard.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  }

  /* --------------------------------------------------------------------------
     COPY TO CLIPBOARD (for contact/CV pages)
     -------------------------------------------------------------------------- */
  function initCopyChips() {
    const buttons = document.querySelectorAll(".copy-chip");
    if (!buttons.length) return;

    buttons.forEach((button) => {
      const parentCard = button.closest(".contact-card");
      const feedback = parentCard?.querySelector(".copy-feedback");
      const defaultLabel = button.dataset.defaultLabel || button.textContent?.trim() || "Copy";
      button.dataset.defaultLabel = defaultLabel;

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const value = button.dataset.copy;
        if (!value) return;

        copyText(value)
          .then(() => showCopied(feedback, button, defaultLabel))
          .catch(() => showCopied(feedback, button, defaultLabel));
      });
    });
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function showCopied(feedback, button, defaultLabel) {
    if (feedback) {
      feedback.classList.add("is-visible");
      setTimeout(() => feedback.classList.remove("is-visible"), 1600);
    }

    if (button) {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1600);
    }
  }

  /* --------------------------------------------------------------------------
     INITIALIZE ALL FUNCTIONS
     -------------------------------------------------------------------------- */
  initProfileTilt();
  initProjectSliders();
  initImageModal();
  initCopyChips();

  // Log initialization
  console.log('%c Portfolio Loaded! ', 'background: #00d9ff; color: #0a0d14; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
  console.log('Theme:', html.getAttribute('data-theme'));

})();
