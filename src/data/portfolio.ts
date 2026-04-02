export const portfolio = {
  hero: {
    name: 'Yash Sharma',
    role: 'Backend & Distributed Systems Engineer',
    statement:
      'Backend & Web3 engineer focused on building low-latency APIs, event-driven systems, and scalable data infrastructure.',
    supporting:
      'I design and run production backend systems end-to-end, optimizing for performance, reliability, and scale.',
    location: 'New Delhi, India',
    stackLine: 'Python · FastAPI · Kafka · Redis · PostgreSQL · Web3.py',
    metrics: [
      { label: 'Listener latency', value: '50% ↓' },
      { label: 'P95 API latency', value: '120ms' },
      { label: 'Processing speed', value: '20% faster' }
    ],
    ctas: [
      { label: 'View Case Studies', href: '#featured', kind: 'primary' },
      { label: 'Get in Touch', href: '#contact', kind: 'secondary' },
      { label: 'Download CV', href: '/cv/YashSharma_CV.pdf', kind: 'secondary' }
    ]
  },
  aboutSteps: [
    {
      title: 'Low-latency backend systems',
      body: 'Designing FastAPI services, async workflows, and caching layers that stay fast under pressure.',
      supporting: 'API design, JWT auth, and resilient request handling tuned for sub-second p95s.',
      chips: ['FastAPI', 'Async IO', 'Redis', 'JWT', 'API Design'],
      systemNote: 'Latency budgets enforced with Prometheus + request tracing.',
      accent: 'Latency-first engineering'
    },
    {
      title: 'Event-driven data pipelines',
      body: 'Streaming and ETL pipelines that move high-volume signals into queryable analytics stores.',
      supporting: 'Kafka ingestion, partitioned PostgreSQL, and time-series query optimization.',
      chips: ['Kafka', 'ETL', 'PostgreSQL', 'TimescaleDB', 'QuestDB'],
      systemNote: 'Replay-safe ETL with backfill reliability.',
      accent: 'Data reliability at scale'
    },
    {
      title: 'Multi-chain Web3 listeners',
      body: 'Blockchain indexing across Ethereum, BSC, and Base with RPC tuning and batching.',
      supporting: 'Event decoding, JSON-RPC, DEX APIs, and on-chain data enrichment.',
      chips: ['Web3.py', 'Ethereum', 'BSC', 'Base', 'JSON-RPC'],
      systemNote: '50% latency reduction via batching + pipeline optimization.',
      accent: 'Chain-scale visibility'
    },
    {
      title: 'Observability & predictable operations',
      body: 'Monitoring, alerting, and performance regression tracking baked into every service.',
      supporting: 'Prometheus, logging, and dashboards for system clarity under load.',
      chips: ['Prometheus', 'Grafana', 'Logging', 'Alerts', 'Linux'],
      systemNote: 'Operational playbooks and on-call readiness.',
      accent: 'Predictable performance',
      education: 'BCA — Chaudhary Charan Singh University (2020–2023)'
    }
  ],
  skillsScenes: [
    {
      label: 'Backend Engineering',
      description: 'FastAPI services, Redis caching, and production-grade API patterns.',
      summary: 'Latency-focused service design with async IO and robust auth.',
      chips: ['FastAPI', 'Redis', 'PostgreSQL', 'JWT', 'Async IO'],
      systemNote: 'Auth + rate-limits tuned for consistent p95s.',
      metric: '120 ms p95 on core endpoints',
      visuals: [
        { icon: 'python', label: 'Python' },
        { icon: 'fastapi', label: 'FastAPI' },
        { icon: 'redis', label: 'Redis' },
        { icon: 'postgresql', label: 'PostgreSQL' },
        { icon: 'docker', label: 'Docker' }
      ]
    },
    {
      label: 'Data / ETL',
      description: 'Kafka pipelines, partitioned storage, and batch + streaming analytics.',
      summary: 'Durable ETL with replay safety and partition-aware storage.',
      chips: ['Kafka', 'ETL', 'TimescaleDB', 'QuestDB', 'Indexing'],
      systemNote: 'Partitioned PostgreSQL for analytics workloads.',
      metric: 'Backfill-safe pipelines at scale',
      visuals: [
        { icon: 'kafka', label: 'Kafka' },
        { icon: 'questdb', label: 'QuestDB' },
        { icon: 'postgresql', label: 'PostgreSQL' },
        { icon: 'linux', label: 'Linux' },
        { icon: 'git', label: 'Git' }
      ]
    },
    {
      label: 'APIs / Distributed Systems',
      description: 'Latency-aware APIs, idempotent workflows, and scalable request handling.',
      summary: 'Idempotent workflows with observability built in.',
      chips: ['REST', 'WebSockets', 'Microservices', 'Prometheus', 'JWT'],
      systemNote: 'Instrumented pipelines with alerting and tracing.',
      metric: 'Reliability-first API design',
      visuals: [
        { icon: 'fastapi', label: 'FastAPI' },
        { icon: 'redis', label: 'Redis' },
        { icon: 'github', label: 'GitHub' },
        { icon: 'linux', label: 'Linux' },
        { icon: 'docker', label: 'Docker' }
      ]
    },
    {
      label: 'Web3 / Listeners',
      description: 'Multi-chain listeners, RPC indexing, and real-time signal ingestion.',
      summary: 'Blockchain indexing with optimized RPC and event decoding.',
      chips: ['Web3.py', 'Ethereum', 'BSC', 'Base', 'DEX APIs'],
      systemNote: '50% latency reduction via batching.',
      metric: 'Multi-chain indexing across 3 networks',
      visuals: [
        { icon: 'eth', label: 'Ethereum' },
        { icon: 'bsc', label: 'BSC' },
        { icon: 'python', label: 'Python' },
        { icon: 'redis', label: 'Redis' },
        { icon: 'kafka', label: 'Kafka' }
      ]
    },
    {
      label: 'Tooling / Observability',
      description: 'Prometheus telemetry, Grafana dashboards, and reliability tooling.',
      summary: 'Operational visibility built into every service.',
      chips: ['Prometheus', 'Grafana', 'Logging', 'Git', 'Linux'],
      systemNote: 'Dashboards aligned to performance budgets.',
      metric: 'Production-ready monitoring',
      visuals: [
        { icon: 'elasticsearch', label: 'Elasticsearch' },
        { icon: 'linux', label: 'Linux' },
        { icon: 'git', label: 'Git' },
        { icon: 'dbeaver', label: 'DBeaver' },
        { icon: 'docker', label: 'Docker' }
      ]
    }
  ],
  techStack: [
    {
      category: 'Backend',
      items: ['Python', 'FastAPI', 'Flask', 'REST APIs', 'WebSockets', 'Async IO']
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'Redis', 'MongoDB', 'MySQL', 'SQLite', 'TimescaleDB', 'QuestDB']
    },
    {
      category: 'Streaming / Data',
      items: ['Kafka', 'ETL Pipelines', 'Data Modeling', 'Partitioning']
    },
    {
      category: 'Web3',
      items: ['Web3.py', 'Ethereum', 'BSC', 'Base', 'Smart Contract Events', 'JSON-RPC']
    },
    {
      category: 'DevOps',
      items: ['Docker', 'Docker Compose', 'Linux', 'AWS S3', 'Prometheus', 'Git', 'GitHub']
    }
  ],
  experienceScenes: [
    {
      role: 'Software Engineer I',
      company: 'Stackera',
      period: 'Jul 2023 — Present',
      focus: 'Backend and Web3 engineering across multiple products.',
      impact: 'End-to-end ownership of low-latency APIs, streaming pipelines, and observability.',
      stack: ['FastAPI', 'Kafka', 'PostgreSQL', 'Redis', 'Prometheus', 'Web3.py'],
      systems: ['CRM Platform', 'Crypto Betting Platform', 'DexCheck.io'],
      outcomes: ['50% listener latency reduction', '120 ms p95 APIs', 'Kafka ETL + partitioned analytics'],
      achievements: [
        'Architected backend services spanning Web3 analytics and internal platforms.',
        'Implemented caching + tracing for production-grade latency budgets.',
        'Built ingestion pipelines with replay safety and backfill reliability.'
      ]
    },
    {
      role: 'CRM Platform',
      company: 'Stackera',
      period: 'Jan 2026 — Present',
      focus: 'Internal tools for staff management, lead tracking, and real-time coordination.',
      impact: 'Operational visibility and team workflows across chat + notifications.',
      stack: ['FastAPI', 'PostgreSQL', 'Firebase', 'Redis'],
      systems: ['Staff management', 'Lead tracking', 'Real-time chat'],
      outcomes: ['Real-time chat workflows', 'Manager-agent coordination', 'Live notifications'],
      achievements: [
        'Built backend services for staff performance monitoring and lead tracking.',
        'Implemented Firebase notification systems for operational visibility.',
        'Shipped internal tooling with role-based access and audit-ready logging.'
      ]
    },
    {
      role: 'Crypto Betting Platform',
      company: 'Stackera',
      period: 'Nov 2025 — Present',
      focus: 'Transaction-safe betting workflows and provably fair games.',
      impact: 'Concurrency-safe bets, payouts, and session handling.',
      stack: ['FastAPI', 'PostgreSQL', 'Redis', 'Async IO'],
      systems: ['Sessions', 'Bets & payouts', 'Provably fair games'],
      outcomes: ['Idempotent payouts', 'Strong consistency under load', 'Secure session workflows'],
      achievements: [
        'Designed users, sessions, bets, and payout services in FastAPI.',
        'Implemented transaction-safe betting with idempotency guarantees.',
        'Optimized concurrency paths to ensure consistency under high load.'
      ]
    },
    {
      role: 'DexCheck.io — Web3 Analytics',
      company: 'Stackera',
      period: 'Jul 2023 — Oct 2025',
      focus: 'Multi-chain indexing, ETL pipelines, and low-latency APIs.',
      impact: 'Real-time analytics from Ethereum, BSC, and Base.',
      stack: ['Web3.py', 'Kafka', 'PostgreSQL', 'Redis', 'Prometheus'],
      systems: ['Multi-chain listeners', 'ETL pipelines', 'Analytics APIs'],
      outcomes: ['50% listener latency reduction', '120 ms p95 API latency', 'Replay-safe ETL'],
      achievements: [
        'Built multi-chain listeners with RPC tuning, batching, and event decoding.',
        'Developed FastAPI endpoints with Redis caching + Prometheus instrumentation.',
        'Delivered Kafka-based ETL feeding partitioned analytics databases.'
      ]
    },
    {
      role: 'Software Development Intern',
      company: 'Stackera',
      period: 'Apr 2023 — Jun 2023',
      focus: 'Backend services for early DeFi workflows.',
      impact: 'Performance wins through endpoint and query optimization.',
      stack: ['Python', 'Flask', 'PostgreSQL'],
      systems: ['Authentication', 'Persistence', 'Analytics dashboards'],
      outcomes: ['20% faster prototype processing', 'Early DeFi backend features'],
      achievements: [
        'Improved prototype processing time by 20% via query optimization.',
        'Built authentication, persistence, and analytics endpoints.',
        'Supported early DeFi workflows with reliable backend services.'
      ]
    }
  ],
  featuredProjects: [
    {
      slug: 'deadcode',
      name: 'PyDeadCode',
      problem: 'Large Python codebases accumulate risky dead code and unused imports.',
      solution: 'AST-driven analyzer with a self-contained HTML report.',
      stack: ['Python', 'AST', 'Static Analysis', 'HTML'],
      impact: 'Accelerated cleanup workflows with clear dependency insights.',
      visuals: [
        '/assets/assets/projects/deadcode/1.jpg',
        '/assets/assets/projects/deadcode/2.jpg',
        '/assets/assets/projects/deadcode/3.jpg'
      ],
      secondaryVisual: '/assets/assets/projects/deadcode/4.jpg',
      whatItDoes: 'Detects unused imports, functions, classes, and unreachable code.',
      ctas: [
        { label: 'Case Study', href: '/projects/deadcode' },
        { label: 'GitHub', href: 'https://github.com/Yash-s0/py-deadcode-finder' }
      ]
    },
    {
      slug: 'duplicate',
      name: 'PyDuplicate',
      problem: 'Duplicate logic slowed reviews and refactors in Python repos.',
      solution: 'CLI-first scanner that highlights duplication hotspots.',
      stack: ['Python', 'CLI', 'Refactoring'],
      impact: 'Reduced review time and surfaced refactor targets early.',
      visuals: [
        '/assets/assets/projects/duplicate/1.jpg',
        '/assets/assets/projects/duplicate/2.jpg',
        '/assets/assets/projects/duplicate/3.jpg'
      ],
      secondaryVisual: '/assets/assets/projects/duplicate/2.jpg',
      whatItDoes: 'Finds duplicated and near-duplicated code blocks with complexity scoring.',
      ctas: [
        { label: 'Case Study', href: '/projects/duplicate' },
        { label: 'GitHub', href: 'https://github.com/Yash-s0/py-duplicate-finder' }
      ]
    }
  ],
  additionalProjects: [
    {
      name: 'Binance Listener Suite',
      description: 'Kafka-backed listener suite with resilient retries and schema control.',
      stack: ['Python', 'Kafka', 'PostgreSQL'],
      thumbnail: '/assets/assets/projects/binance/1.jpg',
      links: {
        demo: null,
        github: 'https://github.com/Yash-s0/binance'
      }
    },
    {
      name: 'URL Shortener Platform',
      description: 'Full-stack URL shortener with analytics dashboard.',
      stack: ['FastAPI', 'PostgreSQL', 'React'],
      thumbnail: '/assets/assets/projects/url/1.jpg',
      links: {
        demo: null,
        github: 'https://github.com/Yash-s0/url_shortner'
      }
    },
    {
      name: 'Contacts API',
      description: 'RESTful contacts service with validation and pagination.',
      stack: ['Python', 'Flask', 'REST'],
      thumbnail: '/assets/assets/projects/contacts/1.jpg',
      links: {
        demo: null,
        github: 'https://github.com/Yash-s0/contacts_api'
      }
    },
    {
      name: 'Rock Paper Scissors',
      description: 'Browser game with score tracking and polished UI.',
      stack: ['JavaScript', 'HTML', 'CSS'],
      thumbnail: '/assets/assets/projects/rps/1.jpg',
      links: {
        demo: 'https://yash-s0.github.io/rps_web',
        github: 'https://github.com/Yash-s0/rps_web'
      }
    },
    {
      name: 'Etch-a-Sketch',
      description: 'Interactive sketchpad with responsive controls.',
      stack: ['JavaScript', 'Canvas', 'UI'],
      thumbnail: '/assets/assets/projects/etch/1.jpg',
      links: {
        demo: 'https://yash-s0.github.io/etch-a-sketch',
        github: 'https://github.com/Yash-s0/etch-a-sketch'
      }
    }
  ],
  achievements: [
    { label: 'Listener latency reduction', value: 50, suffix: '% Faster' },
    { label: 'FastAPI endpoint latency', value: 120, suffix: 'ms P95' },
    { label: 'Prototype processing speedup', value: 20, suffix: '% Faster' }
  ],
  contact: {
    email: 'yash.ssharma@outlook.com',
    phone: '+91-73033-25661',
    github: 'https://github.com/Yash-s0',
    linkedin: 'https://linkedin.com/in/yash-ssharma',
    cv: '/cv/YashSharma_CV.pdf'
  },
  projectsBySlug: {
    deadcode: {
      title: 'PyDeadCode',
      overview: 'Python static analyzer for dead code and unreachable segments in large repositories.',
      problem: 'Large codebases accumulate unused code, making refactors risky and slow.',
      approach: 'AST parsing with call graph mapping and automated HTML reports.',
      architecture: 'Parser + call graph builder + report generator pipeline.',
      stack: ['Python', 'AST', 'Jinja2', 'HTML', 'CSS'],
      challenges: 'Reducing false positives while maintaining speed on large repos.',
      outcomes: 'Actionable dead-code reports that enable safe refactors.',
      images: [
        '/assets/assets/projects/deadcode/1.jpg',
        '/assets/assets/projects/deadcode/2.jpg',
        '/assets/assets/projects/deadcode/3.jpg'
      ],
      links: [
        { label: 'GitHub', href: 'https://github.com/Yash-s0/py-deadcode-finder' }
      ]
    },
    duplicate: {
      title: 'PyDuplicate',
      overview: 'Duplicate and complexity analyzer for Python codebases.',
      problem: 'Duplicate logic and complexity hotspots slowed reviews and refactors.',
      approach: 'MinHash + LSH scans with complexity metrics and HTML reports.',
      architecture: 'Tokenizer + LSH matcher + report renderer.',
      stack: ['Python', 'CLI', 'Static Analysis'],
      challenges: 'Balancing signal-to-noise across large repos.',
      outcomes: 'Clear duplication clusters and targeted refactor visibility.',
      images: [
        '/assets/assets/projects/duplicate/1.jpg',
        '/assets/assets/projects/duplicate/2.jpg',
        '/assets/assets/projects/duplicate/3.jpg'
      ],
      links: [
        { label: 'GitHub', href: 'https://github.com/Yash-s0/py-duplicate-finder' }
      ]
    },
    binance: {
      title: 'Binance Listener Suite',
      overview: 'Real-time data ingestion toolkit for exchange feeds.',
      problem: 'Streaming data required reliable ingestion and storage.',
      approach: 'Kafka streaming with resilient consumers and schema control.',
      architecture: 'Listener services + Kafka + storage layer.',
      stack: ['Python', 'Kafka', 'PostgreSQL'],
      challenges: 'Handling bursts and maintaining data integrity.',
      outcomes: 'Improved ingestion reliability and throughput.',
      images: [
        '/assets/assets/projects/binance/1.jpg',
        '/assets/assets/projects/binance/2.jpg',
        '/assets/assets/projects/binance/3.jpg'
      ],
      links: [
        { label: 'GitHub', href: 'https://github.com/Yash-s0/binance' }
      ]
    }
  }
};
