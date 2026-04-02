(function () {
  'use strict';

  var iconSet = {
    tool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3 18l3 3 5.3-5.3a5 5 0 0 0 6.4-6.4l-3 3-2-2 3-3z" fill="currentColor"/></svg>',
    data: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6c0-2 4-4 8-4s8 2 8 4-4 4-8 4-8-2-8-4zm0 6c0 2 4 4 8 4s8-2 8-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 11-14h-7l0-6z" fill="currentColor"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.9a5 5 0 0 0 7.07 7.07L13 20" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2L12 2z" fill="currentColor"/></svg>',
    chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V6m5 14V10m5 10V4m5 16V8" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
  };

  var portfolioData = {
    profile: {
      name: 'Yash Sharma',
      title: 'Backend & Platform Engineer',
      statement: 'I build high-throughput APIs, ETL pipelines, and multi-chain listeners with measurable latency and reliability gains.',
      location: 'India · Remote-ready',
      image: 'img/yash.jpg',
      badges: ['Low-latency systems', 'Web3 infrastructure', 'Observability-first'],
      ctas: [
        { label: 'View Case Studies', href: '#featured', type: 'primary' },
        { label: 'Contact Me', href: '#contact', type: 'secondary' },
        { label: 'Download CV', href: 'cv/YashSharma_CV.pdf', type: 'ghost' }
      ],
      metrics: [
        {
          title: '~120ms P95 API latency',
          note: 'Achieved on production endpoints with Redis + Prometheus instrumentation.'
        },
        {
          title: '50% listener latency reduction',
          note: 'Optimized multi-chain listeners and pipeline orchestration for DexCheck.io.'
        },
        {
          title: 'Real-time CRM + Firebase',
          note: 'Delivered internal collaboration and workflow alerts for Stackera clients.'
        }
      ]
    },
    about: {
      heading: 'Systems that stay fast under pressure',
      summary: 'I design and operate backend systems that are observable, scalable, and predictable. My work spans event pipelines, analytics, and real-time workflows — with a constant focus on latency, correctness, and debuggability.',
      focus: [
        'High-throughput APIs and data pipelines',
        'Multi-chain listeners and Web3 integrations',
        'Operational tooling, telemetry, and reliability'
      ]
    },
    skills: [
      {
        category: 'Languages',
        items: [
          { name: 'Python', tooltip: 'Primary backend language for APIs, tooling, and ETL.', level: 92 },
          { name: 'TypeScript', tooltip: 'Typed interfaces for product UI and tooling.', level: 78 },
          { name: 'JavaScript', tooltip: 'Front-end and automation scripting.', level: 80 },
          { name: 'SQL', tooltip: 'Query tuning and data modeling.', level: 84 }
        ]
      },
      {
        category: 'Frameworks',
        items: [
          { name: 'FastAPI', tooltip: 'Low-latency Python APIs with async orchestration.', level: 86 },
          { name: 'Flask', tooltip: 'Lightweight services and internal tools.', level: 75 },
          { name: 'Express.js', tooltip: 'Rapid Node.js API prototyping.', level: 68 }
        ]
      },
      {
        category: 'Frontend',
        items: [
          { name: 'React', tooltip: 'Component-driven UI builds.', level: 70 },
          { name: 'Next.js', tooltip: 'Performance-first React deployment.', level: 64 },
          { name: 'HTML5', tooltip: 'Semantic, accessible markup.', level: 88 },
          { name: 'CSS3', tooltip: 'Design systems and micro-interactions.', level: 80 }
        ]
      },
      {
        category: 'Backend',
        items: [
          { name: 'Kafka', tooltip: 'Event streaming and pipeline orchestration.', level: 78 },
          { name: 'Redis', tooltip: 'Caching and low-latency state.', level: 84 },
          { name: 'REST APIs', tooltip: 'Designing stable and observable endpoints.', level: 88 },
          { name: 'WebSockets', tooltip: 'Real-time communication layers.', level: 72 }
        ]
      },
      {
        category: 'Databases',
        items: [
          { name: 'PostgreSQL', tooltip: 'Schema design, indexing, partitioning.', level: 86 },
          { name: 'MySQL', tooltip: 'Relational data services.', level: 70 },
          { name: 'MongoDB', tooltip: 'Flexible document storage.', level: 60 }
        ]
      },
      {
        category: 'Tools',
        items: [
          { name: 'Docker', tooltip: 'Containerization for reproducible deployments.', level: 82 },
          { name: 'Git', tooltip: 'Version control and delivery workflows.', level: 88 },
          { name: 'Prometheus', tooltip: 'Metrics + alerting pipelines.', level: 74 },
          { name: 'Grafana', tooltip: 'Visualization and observability dashboards.', level: 70 }
        ]
      },
      {
        category: 'DevOps / Cloud',
        items: [
          { name: 'AWS', tooltip: 'Compute, storage, and infra automation.', level: 68 },
          { name: 'Linux', tooltip: 'Server and scripting fundamentals.', level: 84 },
          { name: 'CI/CD', tooltip: 'Automated build and release pipelines.', level: 72 },
          { name: 'Firebase', tooltip: 'Notifications and real-time messaging.', level: 66 }
        ]
      }
    ],
    experience: [
      {
        role: 'Software Engineer I',
        company: 'Stackera — Client Projects',
        range: 'Jul 2023 — Present',
        summary: 'Owned backend architecture across multiple client engagements in real-time CRM and Web3 platforms.',
        projects: [
          {
            title: 'Client Project — CRM Platform',
            date: 'Jan 2026 — Present',
            bullets: [
              'Built internal real-time chat workflows for manager and agent coordination.',
              'Implemented Firebase notifications for workflow events and operational updates.',
              'Delivered CRM features for staff management, time tracking, and performance monitoring.'
            ],
            tech: ['FastAPI', 'Firebase', 'PostgreSQL', 'Redis'],
            metrics: ['Realtime alerts in <2s', 'Improved ops visibility for 3 teams']
          },
          {
            title: 'Client Project — Crypto Betting Platform',
            date: 'Nov 2025 — Present',
            bullets: [
              'Owned backend architecture for real-time betting games (Dice, Plinko).',
              'Designed FastAPI services and PostgreSQL schemas for users, bets, and provably-fair mechanics.',
              'Built transaction-safe workflows for bets and payouts with reliability focus.'
            ],
            tech: ['FastAPI', 'PostgreSQL', 'Redis', 'WebSockets'],
            metrics: ['High-frequency game loop stability', 'Provably-fair integrity pipeline']
          },
          {
            title: 'Client Project — DexCheck.io',
            date: 'Jul 2023 — Oct 2025',
            bullets: [
              'Owned multi-chain listeners (ETH, BSC, Base) cutting latency by 50%.',
              'Shipped Redis + Prometheus instrumentation achieving ~120ms P95 API latency.',
              'Built Kafka-based ETL pipelines with partitioned PostgreSQL and RPC integrations.'
            ],
            tech: ['Web3.py', 'Kafka', 'PostgreSQL', 'Prometheus'],
            metrics: ['50% latency reduction', '~120ms P95 API response']
          }
        ],
        tags: ['Web3', 'FastAPI', 'PostgreSQL', 'Kafka', 'Prometheus', 'Redis', 'Firebase']
      },
      {
        role: 'Software Development Intern',
        company: 'Stackera',
        range: 'Apr 2023 — Jun 2023',
        summary: 'Early backend contributions for DeFi workflows and data prototypes.',
        projects: [
          {
            title: 'Platform Services',
            date: 'Apr 2023 — Jun 2023',
            bullets: [
              'Built Python/Flask services improving prototype processing time by 20%.',
              'Delivered early backend features for DeFi-related workflows.'
            ],
            tech: ['Python', 'Flask', 'PostgreSQL'],
            metrics: ['20% faster processing']
          }
        ],
        tags: ['Python', 'Flask', 'PostgreSQL', 'JWT', 'HTML', 'CSS']
      }
    ],
    featuredProjects: [
      {
        title: 'PyDeadCode',
        summary: 'Static analysis tool that pinpoints dead code and generates an HTML report for safer refactors.',
        stack: ['Python', 'AST', 'Static Analysis'],
        impact: 'Accelerated cleanup workflows with clear dependency maps and exportable reports.',
        links: [
          { label: 'Case Study', href: 'projects/deadcode.html' },
          { label: 'Source', href: 'https://github.com/Yash-s0/py-deadcode-finder' }
        ]
      },
      {
        title: 'PyDuplicate',
        summary: 'Duplicate code detector built for large Python repos with a focused CLI experience.',
        stack: ['Python', 'CLI', 'Refactoring'],
        impact: 'Reduced review time by highlighting duplication hotspots early.',
        links: [
          { label: 'Case Study', href: 'projects/duplicate.html' },
          { label: 'Source', href: 'https://github.com/Yash-s0/py-duplicate-finder' }
        ]
      },
      {
        title: 'Binance Listener Suite',
        summary: 'Collection of services to stream and process Binance data with reliability guarantees.',
        stack: ['Python', 'Kafka', 'PostgreSQL'],
        impact: 'Improved ingestion reliability and streaming throughput for analytics use cases.',
        links: [
          { label: 'Case Study', href: 'projects/binance.html' },
          { label: 'Source', href: 'https://github.com/Yash-s0/binance' }
        ]
      }
    ],
    projects: [
      {
        title: 'URL Shortener Platform',
        summary: 'Full-stack URL shortener with analytics and admin tooling.',
        stack: ['FastAPI', 'PostgreSQL', 'React'],
        impact: 'Reliable redirect tracking and dashboard reporting.',
        icon: 'link',
        links: { demo: null, github: 'https://github.com/Yash-s0/url_shortner' }
      },
      {
        title: 'Contacts API',
        summary: 'RESTful contacts service with structured validation and pagination.',
        stack: ['Python', 'Flask', 'REST'],
        impact: 'Reusable service foundation for CRM-related prototypes.',
        icon: 'shield',
        links: { demo: null, github: 'https://github.com/Yash-s0/contacts_api' }
      },
      {
        title: 'Rock Paper Scissors',
        summary: 'Browser game with polished UX and scoreboard tracking.',
        stack: ['JavaScript', 'HTML', 'CSS'],
        impact: 'Clean UI experiment for interaction design.',
        icon: 'spark',
        links: { demo: 'https://yash-s0.github.io/rps_web', github: 'https://github.com/Yash-s0/rps_web' }
      },
      {
        title: 'Etch-a-Sketch',
        summary: 'Creative sketchpad with responsive controls and export options.',
        stack: ['JavaScript', 'Canvas', 'UI'],
        impact: 'Interactive toy project to explore drawing UX.',
        icon: 'tool',
        links: { demo: 'https://yash-s0.github.io/etch-a-sketch', github: 'https://github.com/Yash-s0/etch-a-sketch' }
      }
    ],
    highlights: [
      {
        title: 'Production Backend',
        count: 3,
        suffix: '+ Years',
        note: 'End-to-end ownership across API, data, and infra.',
        icon: 'bolt'
      },
      {
        title: 'Latency-First Engineering',
        count: 120,
        suffix: 'ms P95',
        note: 'Measured at scale on Web3 analytics endpoints.',
        icon: 'chart'
      },
      {
        title: 'Open Source Tools',
        count: 5,
        suffix: '+ Releases',
        note: 'Focused on reliability and developer experience.',
        icon: 'tool'
      }
    ],
    services: [
      {
        title: 'Full-Stack Product Builds',
        summary: 'From API architecture to UI delivery with modern tooling.'
      },
      {
        title: 'Backend & API Engineering',
        summary: 'Scalable, observable services built for low-latency performance.'
      },
      {
        title: 'Data Pipelines & ETL',
        summary: 'Event-driven pipelines and analytics-ready data models.'
      },
      {
        title: 'Automation & Internal Tools',
        summary: 'Operational tooling that saves teams hours every week.'
      },
      {
        title: 'Dashboards & Reporting',
        summary: 'Executive-ready dashboards with real-time metrics.'
      }
    ],
    testimonials: [
      {
        quote: '“Add future client testimonials here. This component is ready for real quotes.”',
        name: 'Future Client',
        role: 'CTO, Example Co.'
      }
    ],
    contact: {
      email: 'yash.ssharma@outlook.com',
      github: 'https://github.com/Yash-s0',
      linkedin: 'https://linkedin.com/in/yash-ssharma',
      location: 'India · Remote / Global'
    }
  };

  function splitWords(text) {
    return text.split(' ').map(function (word, index) {
      return '<span class="hero-word" style="--word-delay:' + (index * 90) + 'ms">' + word + '</span>';
    }).join(' ');
  }

  function renderHero() {
    var hero = document.getElementById('hero-content');
    if (!hero) return;

    hero.innerHTML = [
      '<div class="hero-grid">',
      '  <div class="hero-text reveal">',
      '    <div class="hero-eyebrow">Premium Backend Engineering</div>',
      '    <h1 class="hero-title">' + splitWords(portfolioData.profile.name) + '<br><span>' + splitWords(portfolioData.profile.title) + '</span></h1>',
      '    <p class="hero-subtitle">' + portfolioData.profile.statement + '</p>',
      '    <div class="hero-cta">',
      portfolioData.profile.ctas.map(function (cta) {
        var className = cta.type === 'primary' ? 'btn btn-primary' : (cta.type === 'secondary' ? 'btn btn-secondary' : 'btn btn-ghost');
        return '<a class="' + className + '" href="' + cta.href + '">' + cta.label + '</a>';
      }).join(''),
      '    </div>',
      '    <div class="hero-metrics">',
      portfolioData.profile.metrics.map(function (metric) {
        return '<div class="metric-card"><h4>' + metric.title + '</h4><p>' + metric.note + '</p></div>';
      }).join(''),
      '    </div>',
      '  </div>',
      '  <div class="hero-portrait reveal" data-parallax="0.12">',
      '    <img src="' + portfolioData.profile.image + '" alt="' + portfolioData.profile.name + '">',
      '    <div class="hero-badges">',
      portfolioData.profile.badges.map(function (badge) {
        return '<span class="badge">' + badge + '</span>';
      }).join(''),
      '    </div>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderAbout() {
    var about = document.getElementById('about-content');
    if (!about) return;

    about.innerHTML = [
      '<div class="section-header reveal">',
      '  <div class="eyebrow">About</div>',
      '  <h2 class="section-title">' + portfolioData.about.heading + '</h2>',
      '  <p class="section-subtitle">' + portfolioData.about.summary + '</p>',
      '</div>',
      '<div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">',
      portfolioData.about.focus.map(function (item) {
        return '<div class="card reveal"><h3>' + item + '</h3><p>Outcome-driven delivery with measurable impact.</p></div>';
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderSkills() {
    var skills = document.getElementById('skills-content');
    if (!skills) return;

    skills.innerHTML = [
      '<div class="section-header reveal">',
      '  <div class="eyebrow">Toolkit</div>',
      '  <h2 class="section-title">Skills & Tech Stack</h2>',
      '  <p class="section-subtitle">Grouped by discipline for fast scanning and targeted collaboration.</p>',
      '</div>',
      '<div class="skills-grid">',
      portfolioData.skills.map(function (group) {
        return [
          '<div class="card reveal">',
          '  <h3>' + group.category + '</h3>',
          '  <div class="skill-list">',
          group.items.map(function (item) {
            return [
              '<div class="skill-row">',
              '  <div class="skill-tag" data-tooltip="' + item.tooltip + '">',
              '    <span>' + item.name + '</span>',
              '    <span class="skill-level">' + item.level + '%</span>',
              '  </div>',
              '  <div class="skill-bar"><span style="width:' + item.level + '%"></span></div>',
              '</div>'
            ].join('');
          }).join(''),
          '  </div>',
          '</div>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderExperience() {
    var exp = document.getElementById('experience-content');
    if (!exp) return;

    exp.innerHTML = [
      '<div class="section-header reveal">',
      '  <div class="eyebrow">Journey</div>',
      '  <h2 class="section-title">Experience Timeline</h2>',
      '  <p class="section-subtitle">Impact-focused roles spanning backend, data, and Web3 systems.</p>',
      '</div>',
      '<div class="timeline">',
      portfolioData.experience.map(function (role) {
        return [
          '<div class="timeline-item">',
          '  <span class="timeline-dot"></span>',
          '  <div class="timeline-card reveal">',
          '    <div class="timeline-meta"><span>' + role.role + ' · ' + role.company + '</span><span>' + role.range + '</span></div>',
          '    <p>' + role.summary + '</p>',
          role.projects.map(function (proj) {
            return [
              '<div class="project-block">',
              '  <div class="project-block-header">',
              '    <h4>' + proj.title + '</h4>',
              '    <div class="meta">' + proj.date + '</div>',
              '  </div>',
              '  <ul>',
              proj.bullets.map(function (bullet) {
                return '<li>' + bullet + '</li>';
              }).join(''),
              '  </ul>',
              '  <div class="project-tech">',
              proj.tech.map(function (tech) {
                return '<span class="skill-chip">' + tech + '</span>';
              }).join(''),
              '  </div>',
              '  <div class="project-metrics">',
              proj.metrics.map(function (metric) {
                return '<span class="metric-pill">' + metric + '</span>';
              }).join(''),
              '  </div>',
              '</div>'
            ].join('');
          }).join(''),
          '    <div style="margin-top:1rem;">',
          role.tags.map(function (tag) {
            return '<span class="skill-chip">' + tag + '</span>';
          }).join(''),
          '    </div>',
          '  </div>',
          '</div>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderProjects() {
    var featured = document.getElementById('featured-content');
    var projects = document.getElementById('projects-content');
    if (featured) {
      featured.innerHTML = [
        '<div class="section-header reveal">',
        '  <div class="eyebrow">Flagship</div>',
        '  <h2 class="section-title">Featured Case Studies</h2>',
        '  <p class="section-subtitle">Deep dives into complex backend systems and tooling.</p>',
        '</div>',
        '<div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">',
        portfolioData.featuredProjects.map(function (project) {
          return [
            '<article class="project-card reveal">',
            '  <h3>' + project.title + '</h3>',
            '  <p>' + project.summary + '</p>',
            '  <div class="meta">' + project.stack.map(function (s) { return '<span class="skill-chip">' + s + '</span>'; }).join('') + '</div>',
            '  <p><strong>Impact:</strong> ' + project.impact + '</p>',
            '  <div class="project-links">',
            project.links.map(function (link) {
              return '<a class="btn btn-secondary" href="' + link.href + '" target="_blank" rel="noopener noreferrer">' + link.label + '</a>';
            }).join(''),
            '  </div>',
            '</article>'
          ].join('');
        }).join(''),
        '</div>'
      ].join('');
    }

    if (projects) {
      projects.innerHTML = [
        '<div class="section-header reveal">',
        '  <div class="eyebrow">Additional</div>',
        '  <h2 class="section-title">Additional Projects</h2>',
        '  <p class="section-subtitle">Smaller explorations and supporting builds.</p>',
        '</div>',
        '<div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">',
        portfolioData.projects.map(function (project) {
          var demo = project.links && project.links.demo;
          var github = project.links && project.links.github;
          return [
            '<article class="project-card reveal">',
            '  <div class="project-icon">' + (iconSet[project.icon] || iconSet.tool) + '</div>',
            '  <h3>' + project.title + '</h3>',
            '  <p>' + project.summary + '</p>',
            '  <div class="meta">' + project.stack.map(function (s) { return '<span class="skill-chip">' + s + '</span>'; }).join('') + '</div>',
            '  <p><strong>Impact:</strong> ' + project.impact + '</p>',
            '  <div class="project-links">',
            demo ? '<a class="btn btn-secondary" href="' + demo + '" target="_blank" rel="noopener noreferrer">Live Demo</a>' : '',
            github ? '<a class="btn btn-ghost" href="' + github + '" target="_blank" rel="noopener noreferrer">GitHub</a>' : '',
            '  </div>',
            '</article>'
          ].join('');
        }).join(''),
        '</div>'
      ].join('');
    }
  }

  function renderHighlights() {
    var highlights = document.getElementById('highlights-content');
    if (!highlights) return;

    highlights.innerHTML = [
      '<div class="section-header reveal">',
      '  <div class="eyebrow">Highlights</div>',
      '  <h2 class="section-title">Achievements & Milestones</h2>',
      '  <p class="section-subtitle">A quick snapshot of measurable outcomes and capability signals.</p>',
      '</div>',
      '<div class="stat-grid">',
      portfolioData.highlights.map(function (item) {
        return [
          '<div class="stat-card reveal">',
          '  <div class="stat-icon">' + (iconSet[item.icon] || iconSet.spark) + '</div>',
          '  <h3>' + item.title + '</h3>',
          '  <p class="stat-value"><span class="count-up" data-count="' + item.count + '" data-suffix="' + item.suffix + '">0</span></p>',
          '  <p>' + item.note + '</p>',
          '</div>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderServices() {
    var services = document.getElementById('services-content');
    if (!services) return;

    services.innerHTML = [
      '<div class="section-header reveal">',
      '  <div class="eyebrow">Services</div>',
      '  <h2 class="section-title">What I Can Build</h2>',
      '  <p class="section-subtitle">End-to-end delivery across backend, data, and product experiences.</p>',
      '</div>',
      '<div class="services-grid">',
      portfolioData.services.map(function (service) {
        return '<div class="card reveal"><h3>' + service.title + '</h3><p>' + service.summary + '</p></div>';
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderTestimonials() {
    var testimonials = document.getElementById('testimonials-content');
    if (!testimonials) return;

    testimonials.innerHTML = [
      '<div class="section-header reveal">',
      '  <div class="eyebrow">Social Proof</div>',
      '  <h2 class="section-title">Testimonials</h2>',
      '  <p class="section-subtitle">Add client stories to reinforce outcomes and credibility.</p>',
      '</div>',
      '<div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));">',
      portfolioData.testimonials.map(function (item) {
        return '<div class="testimonial-card reveal"><p>' + item.quote + '</p><p><strong>' + item.name + '</strong><br><span class="meta">' + item.role + '</span></p></div>';
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderContact() {
    var contact = document.getElementById('contact-content');
    if (!contact) return;

    contact.innerHTML = [
      '<div class="section-header reveal">',
      '  <div class="eyebrow">Contact</div>',
      '  <h2 class="section-title">Let\'s Build Something Precise</h2>',
      '  <p class="section-subtitle">Reach out for collaboration, freelance opportunities, or full-time roles.</p>',
      '</div>',
      '<div class="contact-grid">',
      '  <div class="contact-card reveal">',
      '    <h3>Direct</h3>',
      '    <p>Email: <a href="mailto:' + portfolioData.contact.email + '">' + portfolioData.contact.email + '</a></p>',
      '    <p>GitHub: <a href="' + portfolioData.contact.github + '" target="_blank" rel="noopener noreferrer">' + portfolioData.contact.github.replace('https://', '') + '</a></p>',
      '    <p>LinkedIn: <a href="' + portfolioData.contact.linkedin + '" target="_blank" rel="noopener noreferrer">' + portfolioData.contact.linkedin.replace('https://', '') + '</a></p>',
      '    <button class="btn btn-secondary copy-btn" data-email="' + portfolioData.contact.email + '">Copy Email</button>',
      '    <span class="copy-status" role="status" aria-live="polite"></span>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function renderFooter() {
    var footer = document.getElementById('footer-content');
    if (!footer) return;

    footer.innerHTML = [
      '<div class="footer-row">',
      '  <div>',
      '    <strong>' + portfolioData.profile.name + '</strong><br>',
      '    <span class="meta">' + portfolioData.profile.title + '</span>',
      '  </div>',
      '  <div class="footer-links">',
      '    <a href="' + portfolioData.contact.github + '" target="_blank" rel="noopener noreferrer">GitHub</a>',
      '    <a href="' + portfolioData.contact.linkedin + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>',
      '    <a href="mailto:' + portfolioData.contact.email + '">Email</a>',
      '  </div>',
      '</div>',
      '<p style="margin-top:1.5rem;color:var(--muted);">© 2026 ' + portfolioData.profile.name + '. All rights reserved.</p>'
    ].join('');
  }

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var mobile = document.getElementById('mobileNav');
    if (toggle && mobile) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        mobile.classList.toggle('show');
        mobile.setAttribute('aria-hidden', String(expanded));
      });
    }

    var links = document.querySelectorAll('.nav-link');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (mobile) {
          mobile.classList.remove('show');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
          mobile.setAttribute('aria-hidden', 'true');
        }
      });
    });

    var sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.45 });

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  function initReveal() {
    var revealElements = document.querySelectorAll('.reveal');
    var staggerElements = document.querySelectorAll('.card-grid, .skills-grid, .services-grid, .stat-grid');

    staggerElements.forEach(function (grid) {
      var children = grid.querySelectorAll('.card, .project-card, .stat-card, .testimonial-card, .contact-card');
      children.forEach(function (child, index) {
        child.classList.add('stagger-item');
        child.style.setProperty('--delay', (index * 90) + 'ms');
      });
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.2 });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stagger-item').forEach(function (el) {
      staggerObserver.observe(el);
    });
  }

  function initParallax() {
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY || window.pageYOffset;
      parallaxEls.forEach(function (el) {
        var rate = parseFloat(el.getAttribute('data-parallax')) || 0;
        el.style.transform = 'translateY(' + (scrollY * rate) + 'px)';
      });
    }, { passive: true });
  }

  function initCopyEmail() {
    var btn = document.querySelector('.copy-btn');
    var status = document.querySelector('.copy-status');
    if (!btn || !status) return;

    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email');
      if (!email) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          status.textContent = 'Copied.';
          status.classList.add('show');
          setTimeout(function () { status.textContent = ''; status.classList.remove('show'); }, 1600);
        });
      } else {
        status.textContent = 'Copy not supported.';
        status.classList.add('show');
        setTimeout(function () { status.textContent = ''; status.classList.remove('show'); }, 1600);
      }
    });
  }

  function initCounters() {
    var counters = document.querySelectorAll('.count-up');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var start = 0;
        var duration = 1400;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var value = Math.floor(progress * target);
          el.textContent = value + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
            obs.unobserve(el);
          }
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function init() {
    renderHero();
    renderAbout();
    renderSkills();
    renderExperience();
    renderProjects();
    renderHighlights();
    renderServices();
    renderTestimonials();
    renderContact();
    renderFooter();
    initNav();
    initReveal();
    initParallax();
    initCopyEmail();
    initCounters();
  }

  init();
})();
