(function() {
  'use strict';

  function initPageLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) {
      document.body.classList.add('is-loaded');
      return;
    }

    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sessionStorage.getItem('loader_shown')) {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      document.body.classList.add('is-loaded');
      return;
    }

    document.body.classList.add('loading');
    var lines = Array.prototype.slice.call(loader.querySelectorAll('.loader-line'));
    var progress = loader.querySelector('.loader-progress');
    var successLine = loader.querySelector('.loader-success');
    var cursor = document.createElement('span');
    cursor.className = 'loader-cursor';

    function setProgress(value) {
      if (progress) progress.style.width = value + '%';
    }

    function exitLoader(delay) {
      var exitDelay = typeof delay === 'number' ? delay : 450;
      setTimeout(function() {
        loader.classList.add('exit');
        document.body.classList.remove('loading');
        document.body.classList.add('is-loaded');
        sessionStorage.setItem('loader_shown', 'true');
        setTimeout(function() { loader.classList.add('hidden'); }, 600);
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      }, exitDelay);
    }

    function prepareLines() {
      lines.forEach(function(line) {
        if (line.querySelector('.loader-line-content')) return;
        var html = line.innerHTML;
        line.setAttribute('data-full-html', html);
        line.innerHTML = '<span class="loader-line-content">' + html + '</span>';
      });
    }

    function showAllLines() {
      lines.forEach(function(line) {
        line.classList.add('is-typed');
        var content = line.querySelector('.loader-line-content');
        if (content) content.style.maxWidth = 'none';
      });
      if (successLine) successLine.classList.add('success-visible');
      setProgress(100);
      exitLoader(0);
    }

    prepareLines();

    var skipBtn = loader.querySelector('.loader-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', function() {
        showAllLines();
      });
    }

    if (prefersReduced) {
      showAllLines();
      return;
    }

    var totalChars = 0;
    var totalSteps = 0;
    var lineLengths = lines.map(function(line) {
      var text = line.textContent || '';
      var isBlank = text.replace(/\s/g, '').length === 0;
      var length = isBlank ? 0 : text.length;
      totalChars += length;
      totalSteps += 4;
      return length;
    });

    totalSteps += totalChars;
    var targetDuration = 2000;
    var lineGap = 40;
    var blankDelay = 70;
    var charTime = 18;
    if (totalChars > 0) {
      var computed = Math.floor((targetDuration - (lines.length * lineGap)) / totalChars);
      charTime = Math.max(6, Math.min(16, computed));
    }

    var typedChars = 0;
    var currentLine = 0;

    function updateProgress() {
      var progressValue = Math.min(100, Math.round(((typedChars + (currentLine * 4)) / totalSteps) * 100));
      setProgress(progressValue);
    }

    function typeNextLine() {
      if (currentLine >= lines.length) {
        setProgress(100);
        exitLoader(450);
        return;
      }

      var line = lines[currentLine];
      var content = line.querySelector('.loader-line-content');
      var length = lineLengths[currentLine] || 0;
      line.classList.add('is-typing');
      line.appendChild(cursor);

      if (length === 0) {
        line.classList.add('is-typed');
        line.classList.remove('is-typing');
        currentLine++;
        updateProgress();
        setTimeout(typeNextLine, blankDelay);
        return;
      }

      var reveal = 0;
      function tick() {
        reveal += 1;
        typedChars += 1;
        if (content) content.style.maxWidth = reveal + 'ch';
        updateProgress();
        if (reveal >= length) {
          line.classList.add('is-typed');
          line.classList.remove('is-typing');
          if (line === successLine) {
            line.classList.add('success-visible');
          }
          currentLine++;
          setTimeout(typeNextLine, line === successLine ? 250 : lineGap);
          return;
        }
        setTimeout(tick, charTime);
      }
      tick();
    }

    setTimeout(typeNextLine, 250);
  }

  initPageLoader();

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

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, 0, 0, size, size);

      faviconLink.href = canvas.toDataURL('image/png');
    };

    img.src = imgSrc;
  }

  function initTheme() {
    var themeToggle = document.getElementById('themeToggle');
    var html = document.documentElement;

    function getInitialTheme() {
      var saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
      updateIcons(theme);
    }

    function updateIcons(theme) {
      var sunIcon = document.getElementById('sunIcon');
      var moonIcon = document.getElementById('moonIcon');
      if (sunIcon && moonIcon) {
        if (theme === 'dark') {
          sunIcon.classList.remove('is-active');
          moonIcon.classList.add('is-active');
        } else {
          sunIcon.classList.add('is-active');
          moonIcon.classList.remove('is-active');
        }
      }
    }

    applyTheme(getInitialTheme());

    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        var current = html.classList.contains('dark') ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  function initMobileMenu() {
    var btn = document.getElementById('mobileMenuBtn');
    var menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function() {
      var isActive = menu.classList.toggle('active');
      btn.setAttribute('aria-expanded', isActive);
    });

    document.addEventListener('click', function(e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initNavScrollSpy() {
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
    var linksById = [];

    if (!navLinks.length) return;

    function cacheSections() {
      linksById = [];
      navLinks.forEach(function(link) {
        var href = link.getAttribute('href');
        var id = href ? href.substring(1) : '';
        var section = id ? document.getElementById(id) : null;
        if (section) {
          linksById.push({
            id: id,
            section: section,
            link: link
          });
        }
      });
    }

    function activateById(activeId) {
      navLinks.forEach(function(link) {
        link.classList.toggle('active', link.getAttribute('href') === ('#' + activeId));
      });
    }

    function syncActiveSection() {
      if (!linksById.length) return;

      var header = document.querySelector('.site-header');
      var offset = header ? header.offsetHeight + 20 : 80;
      var currentPos = window.pageYOffset + offset;
      var activeId = linksById[0].id;

      for (var i = 0; i < linksById.length; i++) {
        if (currentPos >= linksById[i].section.offsetTop) {
          activeId = linksById[i].id;
        }
      }

      activateById(activeId);
    }

    cacheSections();
    syncActiveSection();

    window.addEventListener('resize', function() {
      cacheSections();
      syncActiveSection();
    }, { passive: true });

    window.addEventListener('scroll', function() {
      syncActiveSection();
    }, { passive: true });
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initParticles() {
    if (prefersReducedMotion) return;
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.particle-host').forEach(function(host) {
      var canvas = document.createElement('canvas');
      canvas.className = 'particle-canvas';
      host.insertBefore(canvas, host.firstChild);

      var ctx = canvas.getContext('2d');
      var width, height, particles, mouse, animationId;

      mouse = { x: -1000, y: -1000 };

      function resize() {
        width = host.offsetWidth;
        height = host.offsetHeight;
        canvas.width = width;
        canvas.height = height;
      }

      function createParticles() {
        var count = window.innerWidth < 768 ? 30 : 60;
        particles = [];
        for (var i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3
          });
        }
      }

      function animate() {
        if (document.hidden) {
          animationId = requestAnimationFrame(animate);
          return;
        }
        ctx.clearRect(0, 0, width, height);

        particles.forEach(function(p) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            p.x += (dx / dist) * 1.5;
            p.y += (dy / dist) * 1.5;
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 217, 255, ' + p.opacity + ')';
          ctx.fill();
        });

        for (var i = 0; i < particles.length; i++) {
          for (var j = i + 1; j < particles.length; j++) {
            var dx = particles[i].x - particles[j].x;
            var dy = particles[i].y - particles[j].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = 'rgba(0, 217, 255, ' + (0.15 * (1 - dist / 120)) + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }

          var mdx = particles[i].x - mouse.x;
          var mdy = particles[i].y - mouse.y;
          var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(0, 217, 255, ' + (0.2 * (1 - mDist / 150)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        animationId = requestAnimationFrame(animate);
      }

      host.addEventListener('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      host.addEventListener('mouseleave', function() {
        mouse.x = -1000;
        mouse.y = -1000;
      });

      resize();
      createParticles();
      animate();

      window.addEventListener('resize', function() {
        resize();
        createParticles();
      });
    });
  }

  function initCursorTrail() {
    if (prefersReducedMotion) return;
    if (window.innerWidth < 768) return;
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    var dots = [];
    var numDots = 15;
    var mouseX = 0, mouseY = 0;

    for (var i = 0; i < numDots; i++) {
      var dot = document.createElement('div');
      dot.className = 'cursor-dot';
      var size = Math.max(3, 8 - (i * 0.4));
      var opacity = Math.max(0.1, 0.6 - (i * 0.04));
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.opacity = opacity;
      dot.style.boxShadow = '0 0 ' + (size * 2) + 'px rgba(0,217,255,' + (opacity * 0.5) + ')';
      document.body.appendChild(dot);
      dots.push({ el: dot, x: 0, y: 0 });
    }

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateTrail() {
      var x = mouseX;
      var y = mouseY;

      dots.forEach(function(dot, i) {
        var prev = i === 0 ? { x: x, y: y } : dots[i - 1];
        dot.x += (prev.x - dot.x) * 0.35;
        dot.y += (prev.y - dot.y) * 0.35;
        dot.el.style.transform = 'translate(' + dot.x + 'px, ' + dot.y + 'px) translate(-50%, -50%)';
      });

      requestAnimationFrame(animateTrail);
    }

    animateTrail();
  }

  function initScrollAnimations() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(function() {
            entry.target.classList.add('animated');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate]').forEach(function(el) {
      observer.observe(el);
    });
  }

  function initParallax() {
    if (prefersReducedMotion) return;
    if (window.innerWidth < 768) return;

    var parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    var ticking = false;

    function updateParallax() {
      var scrollTop = window.pageYOffset;
      parallaxElements.forEach(function(el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        var rect = el.getBoundingClientRect();
        var offset = (rect.top + scrollTop) * speed - scrollTop * speed;
        el.style.transform = 'translateY(' + offset + 'px)';
      });
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) { observer.observe(el); });

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var duration = 2000;
      var start = performance.now();

      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * eased);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    }
  }

  function initHeroTypewriter() {
    if (prefersReducedMotion) return;

    var target = document.querySelector('.typewriter-track');
    if (!target) return;

    var phrases = [
      'Python Backend Systems',
      'High Throughput APIs',
      'Web3 Infrastructure',
      'Distributed Systems'
    ];

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var delayBeforeNext = 1200;
    var typingSpeed = 60;
    var deletingSpeed = 40;

    function animate() {
      var currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        target.textContent = currentPhrase.slice(0, Math.max(0, charIndex - 1));
        charIndex--;
      } else {
        target.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(animate, delayBeforeNext);
        return;
      }

      if (isDeleting && charIndex <= 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(animate, 350);
        return;
      }

      setTimeout(
        animate,
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    target.textContent = '';
    animate();
  }

  function initMagneticButtons() {
    if (prefersReducedMotion) return;
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.btn-magnetic').forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });

      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.3s ease';
        setTimeout(function() { btn.style.transition = ''; }, 300);
      });
    });
  }

  function initCardTilt() {
    if (prefersReducedMotion) return;
    if (window.innerWidth < 768) return;

    document.querySelectorAll('.tilt-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / 15;
        var rotateY = (centerX - x) / 15;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(function() { card.style.transition = ''; }, 500);
      });
    });
  }

  function initGlitchText() {
    if (prefersReducedMotion) return;

    var glitchElements = document.querySelectorAll('.glitch-text');
    if (!glitchElements.length) return;

    function triggerGlitch() {
      glitchElements.forEach(function(el) {
        el.classList.add('glitching');
        setTimeout(function() { el.classList.remove('glitching'); }, 300);
      });
    }

    setInterval(triggerGlitch, 5000 + Math.random() * 2000);
  }

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          var header = document.querySelector('.site-header');
          var offset = header ? header.offsetHeight : 0;
          window.scrollTo({
            top: target.offsetTop - offset - 20,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  function initPageTransitions() {
    document.body.classList.add('page-enter');

    document.querySelectorAll('a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || link.getAttribute('target') === '_blank' || link.hasAttribute('download')) return;

      link.addEventListener('click', function(e) {
        e.preventDefault();
        var url = this.href;
        document.body.classList.add('page-exit');
        setTimeout(function() { window.location = url; }, 350);
      });
    });
  }

  var sliderState = {};

  function initProjectSliders() {
    document.querySelectorAll(".project-slider").forEach(function(slider, sliderIdx) {
      var slides = Array.from(slider.querySelectorAll(".project-slide"));
      var prevBtn = slider.querySelector(".slider-prev");
      var nextBtn = slider.querySelector(".slider-next");
      var index = 0;
      var timer = null;

      var showSlide = function(i) {
        slides.forEach(function(slide, idx) {
          slide.classList.toggle("active", idx === i);
        });
      };

      var next = function() {
        index = (index + 1) % slides.length;
        showSlide(index);
      };

      var prev = function() {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
      };

      if (nextBtn)
        nextBtn.addEventListener("click", function() {
          next();
          resetTimer();
        });

      if (prevBtn)
        prevBtn.addEventListener("click", function() {
          prev();
          resetTimer();
        });

      var resetTimer = function() {
        clearInterval(timer);
        timer = setInterval(next, 3000);
      };

      var startTimer = function() {
        timer = setInterval(next, 3000);
      };

      var stopTimer = function() {
        clearInterval(timer);
      };

      startTimer();
      showSlide(index);

      sliderState[sliderIdx] = {
        slider: slider,
        slides: slides,
        timer: null,
        stopTimer: stopTimer,
        startTimer: startTimer
      };
    });
  }

  function initImageModal() {
    var modal = document.getElementById("image-modal");
    if (!modal) return;

    var modalImg = modal.querySelector(".image-modal__img");
    var closeButtons = modal.querySelectorAll("[data-action='close']");
    var prevBtn = modal.querySelector("[data-action='prev']");
    var nextBtn = modal.querySelector("[data-action='next']");

    var sliders = Array.from(document.querySelectorAll(".project-slider"));
    var items = [];
    var sliderMap = {};

    sliders.forEach(function(slider, sliderIdx) {
      var slides = Array.from(slider.querySelectorAll(".project-slide"));
      slides.forEach(function(slide) {
        items.push(slide);
        sliderMap[items.length - 1] = sliderIdx;
      });
    });

    if (items.length === 0) return;

    var currentIndex = 0;

    function showAt(index) {
      currentIndex = (index + items.length) % items.length;
      var src =
        items[currentIndex].getAttribute("data-large") || items[currentIndex].src;
      var alt = items[currentIndex].alt || "";
      modalImg.src = src;
      modalImg.alt = alt;
    }

    function stopSliderAutoplay() {
      Object.values(sliderState).forEach(function(state) {
        state.stopTimer();
      });
    }

    function resumeSliderAutoplay() {
      Object.values(sliderState).forEach(function(state) {
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

    items.forEach(function(img, i) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function() { openModal(i); });
    });

    if (prevBtn) prevBtn.addEventListener("click", function() { showAt(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function() { showAt(currentIndex + 1); });

    closeButtons.forEach(function(btn) { btn.addEventListener("click", closeModal); });
    var backdrop = modal.querySelector(".image-modal__backdrop");
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", function(e) {
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

  function initCopyChips() {
    var buttons = document.querySelectorAll(".copy-chip");
    if (!buttons.length) return;

    buttons.forEach(function(button) {
      var parentCard = button.closest(".contact-card");
      var feedback = parentCard ? parentCard.querySelector(".copy-feedback") : null;
      var defaultLabel = button.dataset.defaultLabel || (button.textContent ? button.textContent.trim() : "") || "Copy";
      button.dataset.defaultLabel = defaultLabel;

      button.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();

        var value = button.dataset.copy;
        if (!value) return;

        copyText(value)
          .then(function() { showCopied(feedback, button, defaultLabel); })
          .catch(function() { showCopied(feedback, button, defaultLabel); });
      });
    });
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function(resolve, reject) {
      try {
        var textArea = document.createElement("textarea");
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
      setTimeout(function() { feedback.classList.remove("is-visible"); }, 1600);
    }

    if (button) {
      button.textContent = "Copied!";
      setTimeout(function() {
        button.textContent = defaultLabel;
      }, 1600);
    }
  }

  function initProfileTilt() {
    var profileCard = document.querySelector('.profile-tilt');
    if (!profileCard) return;

    profileCard.addEventListener('mousemove', function(e) {
      var rect = profileCard.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / 10;
      var rotateY = (centerX - x) / 10;

      profileCard.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.05, 1.05, 1.05)';
    });

    profileCard.addEventListener('mouseleave', function() {
      profileCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setCircularFavicon();
    initTheme();
    initMobileMenu();
    initNavScrollSpy();
    initHeaderScroll();
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
    initCounters();
    initParticles();
    initCursorTrail();
    initMagneticButtons();
    initCardTilt();
    initGlitchText();
    initHeroTypewriter();
    initPageTransitions();
    initProjectSliders();
    initImageModal();
    initCopyChips();
    initProfileTilt();
  }

})();
