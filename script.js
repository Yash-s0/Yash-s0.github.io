(() => {
  /* ----- Canvas background (grid + particles) ----- */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  let W = innerWidth,
    H = innerHeight;
  const particles = [];
  const PARTICLE_COUNT = 120;
  function resizeCanvas() {
    if (!canvas) return;
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  if (canvas && ctx) {
    resizeCanvas();
    // create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        o: Math.random() * 0.7 + 0.15,
      });
    }
    function drawBg() {
      ctx.clearRect(0, 0, W, H);
      // soft radial vignette
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "rgba(4,6,12,0.02)");
      g.addColorStop(1, "rgba(0,0,0,0.16)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // grid lines
      const GAP = Math.max(60, Math.floor(W / 18));
      ctx.strokeStyle = "rgba(77,166,255,0.03)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < W; x += GAP) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let y = 0; y < H; y += GAP) {
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();

      // particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;
        ctx.beginPath();
        ctx.fillStyle = `rgba(0,240,255,${p.o})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(drawBg);
    }
    requestAnimationFrame(drawBg);
  }

  /* ----- Cursor glow parallax ----- */
  const cursor = document.createElement("div");
  cursor.className = "cursor-glow";
  document.body.appendChild(cursor);
  window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  /* ----- Smooth hash routing (no reload) ----- */
  const pages = [
    "index.html",
    "about.html",
    "experience.html",
    "projects.html",
    "contact.html",
    "cv.html",
  ];

  const PROJECT_DETAILS = {
    binance: {
      title: "Binance 24h Crypto Tracker",
      summary:
        "Real-time dashboard that polls Binance public endpoints and surfaces price, highs/lows, and volume via a Flask backend.",
      features: [
        "Live updates by polling Binance API snapshots",
        "Shows price, 24h high/low, and volume",
        "Lightweight Flask backend for rate-limited proxying",
        "Responsive neon UI with auto-rotating gallery",
      ],
      skills: ["Python", "Flask", "Binance API", "JavaScript", "Frontend UI"],
      internal: "projects/binance.html",
      repo: "https://github.com/Yash-s0/binance",
    },
    url: {
      title: "URL Shortener (API + UI)",
      summary:
        "End-to-end URL platform with JWT auth, FastAPI backend, SQLAlchemy persistence, and a bespoke frontend.",
      features: [
        "JWT-secured registration and login",
        "Short/long URL persistence with SQLAlchemy",
        "Searchable history per-user",
        "Custom UI powered by vanilla JS + CSS",
      ],
      skills: [
        "Python",
        "FastAPI",
        "SQLAlchemy",
        "JWT",
        "JavaScript",
        "HTML",
        "CSS",
      ],
      internal: "projects/url.html",
      repo: "https://github.com/yash-s0/url_shortner",
    },
    rps: {
      title: "Rock Paper Scissors",
      summary:
        "A playful frontend game with smooth animations, score tracking, and quick rounds — built to showcase polished JS UX.",
      features: [
        "Instant gameplay with win/lose/draw animations",
        "Running scoreboard + streak logic",
        "Responsive layout for touch/desktop",
        "Lightweight deployment on GitHub Pages",
      ],
      skills: ["JavaScript", "HTML", "CSS"],
      internal: "projects/rps.html",
      repo: "https://github.com/yash-s0/rps_web",
    },
  };
  function navigateTo(hashOrPath) {
    // if anchor starts with '#', scroll to element on same page.
    if (!hashOrPath) hashOrPath = "index.html";
    // if it's a path like 'about.html' load location.href accordingly
    // here we assume we are served from file system or GH pages: we navigate by setting location.href
    // BUT we also support single-file SPA behavior using sections inside index.html via '#home' anchors.
    // For this theme we'll prefer real pages: so just set location to path.
    if (hashOrPath.startsWith("#")) {
      const id = hashOrPath.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // if path is same as current file, do nothing
    const current = location.pathname.split("/").pop() || "index.html";
    if (current === hashOrPath) return;
    // navigate
    location.href = hashOrPath;
  }

  // attach nav events
  document.querySelectorAll(".nav a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      navigateTo(href);
    });
  });

  /* ----- Page enter animations (apply on load) ----- */
  function pageEnter() {
    // find main .page and run enter animation
    const page = document.querySelector(".page");
    if (!page) return;
    page.classList.add("enter-from-right");
    requestAnimationFrame(() => {
      page.classList.add("enter-in");
      page.style.opacity = 1;
    });
    // clear after a bit
    setTimeout(() => page.classList.remove("enter-from-right"), 700);
  }
  document.addEventListener("DOMContentLoaded", pageEnter);

  /* ----- Typewriter for hero title (if present) ----- */
  const heroTitle = document.getElementById("hero-type");
  if (heroTitle) {
    const lines = ["➜ whoami", "Yash Sharma — Backend & Web3 Engineer"];
    let li = 0,
      ci = 0;
    function typeLoop() {
      const text = lines[li];
      if (ci <= text.length) {
        heroTitle.textContent = text.slice(0, ci);
        ci++;
        setTimeout(typeLoop, 28);
      } else {
        setTimeout(() => {
          ci = 0;
          li = (li + 1) % lines.length;
          setTimeout(typeLoop, 800);
        }, 1200);
      }
    }
    typeLoop();
  }

  /* ----- Reveal on scroll ----- */
  const revealEls = document.querySelectorAll(
    ".card, .page, .hero, .metric, .profile-card, .project-card, .h2"
  );
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("visible");
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  /* ----- Project modal handler ----- */
  const modalBackdrop = document.createElement("div");
  modalBackdrop.className = "modal-backdrop";
  modalBackdrop.innerHTML = `<div class="modal highlight-modal" role="dialog" aria-modal="true">
    <button id="highlight-close" class="modal-close" aria-label="Close project dialog">✕</button>
    <div class="modal-head">
      <strong id="modal-title">Project</strong>
      <p id="modal-summary" class="modal-summary muted"></p>
    </div>
    <div class="modal-meta">
      <div>
        <h4>Features</h4>
        <ul id="modal-features" class="modal-list"></ul>
      </div>
      <div>
        <h4>Skills used</h4>
        <div id="modal-skills" class="modal-tags"></div>
      </div>
    </div>
    <div class="modal-actions">
      <a id="modal-internal" href="#" class="btn">Full project page</a>
      <a id="modal-repo" href="#" target="_blank" rel="noreferrer" class="project-btn">
        <i class="si si-github"></i> Source Code
      </a>
    </div>
  </div>`;
  document.body.appendChild(modalBackdrop);

  const modalTitle = modalBackdrop.querySelector("#modal-title");
  const modalSummary = modalBackdrop.querySelector("#modal-summary");
  const modalFeatures = modalBackdrop.querySelector("#modal-features");
  const modalSkills = modalBackdrop.querySelector("#modal-skills");
  const modalInternal = modalBackdrop.querySelector("#modal-internal");
  const modalRepo = modalBackdrop.querySelector("#modal-repo");

  const highlightBackdrop = document.createElement("div");
  highlightBackdrop.className = "modal-backdrop";
  highlightBackdrop.innerHTML = `
  <div class="modal highlight-modal" role="dialog" aria-modal="true">
    <button id="highlight-close" class="modal-close" aria-label="Close highlight dialog">✕</button>
    <div class="modal-head">
      <strong id="highlight-title">Highlight</strong>
    </div>

    <div>
      <h4>Details</h4>
      <ul id="highlight-list" class="modal-list"></ul>
    </div>
  </div>`;
  document.body.appendChild(highlightBackdrop);

  const highlightTitle = highlightBackdrop.querySelector("#highlight-title");
  const highlightList = highlightBackdrop.querySelector("#highlight-list");


  const populateList = (listEl, items) => {
    listEl.innerHTML = "";
    if (!items || !items.length) {
      const li = document.createElement("li");
      li.textContent = "Details coming soon.";
      li.className = "muted";
      listEl.appendChild(li);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      listEl.appendChild(li);
    });
  };

  const populateSkills = (wrapper, skills) => {
    wrapper.innerHTML = "";
    if (!skills || !skills.length) {
      const span = document.createElement("span");
      span.className = "muted";
      span.textContent = "Skills list coming soon.";
      wrapper.appendChild(span);
      return;
    }
    skills.forEach((skill) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = skill;
      wrapper.appendChild(tag);
    });
  };

  function openProjectModal(projectId, cardEl) {
    const detail = PROJECT_DETAILS[projectId];
    if (!detail) return;

    modalTitle.textContent = detail.title || cardEl.querySelector("h3")?.textContent || "Project";
    modalSummary.textContent =
      detail.summary || cardEl.querySelector("p")?.textContent || "More info coming soon.";
    populateList(modalFeatures, detail.features);
    populateSkills(modalSkills, detail.skills);

    if (detail.internal) {
      modalInternal.href = detail.internal;
      modalInternal.style.display = "inline-flex";
    } else {
      modalInternal.style.display = "none";
    }

    const repoLink = detail.repo || cardEl.dataset.repo || "#";
    if (repoLink === "#") {
      modalRepo.style.display = "none";
    } else {
      modalRepo.style.display = "inline-flex";
      modalRepo.href = repoLink;
    }

    modalBackdrop.classList.add("open");
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (card && card.dataset.projectId) {
      e.preventDefault();
      openProjectModal(card.dataset.projectId, card);
    }
    if (e.target.id === "modal-close" || e.target === modalBackdrop) {
      modalBackdrop.classList.remove("open");
    }
  });


  function openHighlightModal(id) {
    const detail = HIGHLIGHT_DETAILS[id];
    if (!detail) return;

    highlightTitle.textContent = detail.title;
    highlightList.innerHTML = "";

    detail.details.forEach((d) => {
      const li = document.createElement("li");
      li.textContent = d;
      highlightList.appendChild(li);
    });

    highlightBackdrop.classList.add("open");
  }

document.addEventListener("click", (e) => {
  const highlight = e.target.closest(".highlight-card");
  if (highlight && highlight.dataset.highlightId) {
    e.preventDefault();
    openHighlightModal(highlight.dataset.highlightId);
  }

  if (e.target.id === "highlight-close" || e.target === highlightBackdrop) {
    highlightBackdrop.classList.remove("open");
  }
});

  /* ----- CV embed fallback handling (object element) ----- */
  // nothing special needed; anchor download handles it

  /* ----- small accessibility: escape closes modal ----- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modalBackdrop.classList.remove("open");
  });

  initIntroOverlay();
  /* ----- Profile tilt interaction (home page only) ----- */
  function initProfileTilt() {
    const tiltContainer = document.querySelector(".profile-tilt");
    const profileImg = tiltContainer && tiltContainer.querySelector(".profile-img");
    if (!tiltContainer || !profileImg) return;

    tiltContainer.addEventListener("mousemove", (e) => {
      const rect = tiltContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 20;
      const rotateX = (y / rect.height - 0.5) * -20;
      profileImg.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
      `;
    });

    tiltContainer.addEventListener("mouseleave", () => {
      profileImg.style.transform = `
        rotateX(0deg)
        rotateY(0deg)
        scale(1)
      `;
    });
  }

  /* ----- Project sliders (project detail pages) ----- */
  function initProjectSliders() {
    document.querySelectorAll(".project-slider").forEach((slider) => {
      const slides = Array.from(slider.querySelectorAll(".project-slide"));
      const prevBtn = slider.querySelector(".slider-prev");
      const nextBtn = slider.querySelector(".slider-next");
      let index = 0;

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

      let timer = setInterval(next, 3000);
      const resetTimer = () => {
        clearInterval(timer);
        timer = setInterval(next, 3000);
      };

      showSlide(index);
    });
  }

  initProfileTilt();
  initProjectSliders();
  initCopyChips();

  function initIntroOverlay() {
    const body = document.body;
    if (!body) return;

    const overlay = document.createElement("div");
    overlay.className = "intro-overlay";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.innerHTML = `
      <div class="intro-spinner" aria-hidden="true"></div>
      <div class="intro-progress" aria-hidden="true"></div>
      <div class="intro-text">Booting neon systems...</div>
    `;

    body.appendChild(overlay);
    body.classList.add("intro-locked");

    requestAnimationFrame(() => overlay.classList.add("is-active"));

    const displayDuration = 1100;

    setTimeout(() => {
      overlay.classList.add("is-fading");
    }, displayDuration);

    setTimeout(() => {
      overlay.remove();
      body.classList.remove("intro-locked");
    }, displayDuration + 600);
  }

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
})();


const HIGHLIGHT_DETAILS = {
  systems: {
    title: "Systems Design",
    details: [
      "Designing partitioned, replayable data pipelines",
      "Ensuring correctness-first compute flows",
      "Low-latency API architecture (~120ms P95)",
      "Backpressure control & event ordering guarantees",
    ],
  },
  observability: {
    title: "Observability",
    details: [
      "Prometheus + Grafana dashboards",
      "p95 latency tracking and tuning",
      "Runbook-driven on-call operations",
      "Alerting + SLO-based monitoring",
    ],
  },
  onchain: {
    title: "On-chain Engineering",
    details: [
      "Uniswap V4 log decoding pipeline",
      "Multi-chain RPC listener orchestration",
      "Handling node-level rate limits & retries",
      "Address/Pool tracking with dedup logic",
    ],
  },
};
