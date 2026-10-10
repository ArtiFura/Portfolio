export interface Capability {
  id: string;
  number: string;
  category: string;
  categoryType: 'architecture' | 'systems' | 'interfaces' | 'ai' | 'platforms' | 'consulting' | 'cloud' | 'data' | 'security' | 'integration';
  title: string;
  description: string;
  tags: string[];
  deliverables: string[];
  timeline: string;
  idealFor: string;
  architectureDetails: string;
}

export interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  isTelemetryCard?: boolean;
  sla?: string;
  metrics: { label: string; value: string; detail: string }[];
  problem: string;
  solution: string;
  architecture: string[];
  results: string[];
}

export interface ClickOrigin {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface LifecyclePhase {
  number: string;
  phase: string;
  title: string;
  description: string;
  footerLabel: string;
  deliverables: string[];
  duration: string;
  keyArtifact: string;
  methodology?: string;
  governanceGates?: string[];
  squadFocus?: string;
}

export interface TechItem {
  name: string;
  category: 'Languages' | 'Frameworks' | 'Cloud & Infra' | 'Data & AI';
  role: string;
  provenance: string;
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'web-dev',
    number: '01',
    category: 'Web',
    categoryType: 'architecture',
    title: 'Web Development',
    description: 'Fast, responsive web applications built with modern frameworks and clean architecture.',
    tags: ['Next.js', 'React', 'TypeScript'],
    deliverables: [
      'Modern responsive web platforms',
      'Optimized page speed and Core Web Vitals',
      'Scalable frontend architecture',
      'Automated global CDN deployment'
    ],
    timeline: '4 - 8 Weeks',
    idealFor: 'SaaS products, marketing sites, and customer portals.',
    architectureDetails: 'Component-driven design, fast SSR/static rendering, and edge CDN delivery.'
  },
  {
    id: 'software-dev',
    number: '02',
    category: 'Software',
    categoryType: 'systems',
    title: 'Software Development',
    description: 'Custom backends, distributed systems, and robust APIs tailored for reliable operations.',
    tags: ['Node.js', 'Go', 'PostgreSQL'],
    deliverables: [
      'Microservices and event-driven backends',
      'Secure REST and GraphQL APIs',
      'Relational and distributed databases',
      'Automated background jobs and queues'
    ],
    timeline: '6 - 12 Weeks',
    idealFor: 'High-volume platforms, enterprise tools, and core backend systems.',
    architectureDetails: 'Modular services, strict typing, automated test coverage, and continuous deployment.'
  },
  {
    id: 'ui-ux',
    number: '03',
    category: 'Design',
    categoryType: 'interfaces',
    title: 'UI / UX Design',
    description: 'Clean, intuitive interfaces and design systems built for ease of use and clarity.',
    tags: ['Figma', 'Design Systems', 'Prototypes'],
    deliverables: [
      'Reusable design tokens and component kits',
      'Interactive Figma prototypes',
      'Desktop and mobile responsive layouts',
      'Design handoff specifications for engineers'
    ],
    timeline: '3 - 6 Weeks',
    idealFor: 'Web applications, mobile interfaces, and digital products.',
    architectureDetails: 'Harmonious typography, accessibility standards, and component libraries.'
  },
  {
    id: 'ai-automation',
    number: '04',
    category: 'AI',
    categoryType: 'ai',
    title: 'AI & Automation',
    description: 'Practical AI integration and workflow automations to reduce manual tasks.',
    tags: ['LLMs', 'Automation', 'Python'],
    deliverables: [
      'Custom LLM integrations and assistants',
      'Automated data extraction and workflows',
      'Document processing pipelines',
      'API monitoring and evaluation safeguards'
    ],
    timeline: '4 - 8 Weeks',
    idealFor: 'Teams looking to automate workflows and integrate AI capabilities.',
    architectureDetails: 'Validated prompts, structured schema outputs, and fallback mechanisms.'
  },
  {
    id: 'mobile-apps',
    number: '05',
    category: 'Mobile',
    categoryType: 'platforms',
    title: 'Mobile Applications',
    description: 'Native and cross-platform apps for iOS and Android with smooth offline performance.',
    tags: ['Flutter', 'React Native', 'iOS & Android'],
    deliverables: [
      'Cross-platform iOS and Android apps',
      'Offline-first local storage and sync',
      'Native push notifications and permissions',
      'App Store and Play Store release prep'
    ],
    timeline: '6 - 12 Weeks',
    idealFor: 'Field teams, consumer services, and companion mobile experiences.',
    architectureDetails: 'Shared codebase, native platform bindings, and local database synchronization.'
  },
  {
    id: 'digital-solutions',
    number: '06',
    category: 'Advisory',
    categoryType: 'consulting',
    title: 'Technical Advisory',
    description: 'Code audits, infrastructure reviews, and architecture planning to unblock growth.',
    tags: ['Code Audits', 'Cloud Strategy', 'Architecture'],
    deliverables: [
      'Comprehensive codebase and security audits',
      'Cloud cost and infrastructure review',
      'Developer workflow and CI/CD improvements',
      'Technical roadmap and architecture plan'
    ],
    timeline: '2 - 4 Weeks',
    idealFor: 'Growing teams scaling existing software or planning major rewrites.',
    architectureDetails: 'Profiling, dependency audits, and actionable remediation steps.'
  },
  {
    id: 'cloud-devops',
    number: '07',
    category: 'Cloud',
    categoryType: 'cloud',
    title: 'Cloud & Infrastructure',
    description: 'Reliable cloud deployments, container management, and automated CI/CD pipelines.',
    tags: ['AWS', 'Docker', 'CI/CD'],
    deliverables: [
      'Infrastructure as Code (Terraform / Docker)',
      'Automated deployment pipelines',
      'Cloud monitoring and alerting setup',
      'Disaster recovery and automated backups'
    ],
    timeline: '4 - 8 Weeks',
    idealFor: 'Teams migrating to cloud or modernizing deployment workflows.',
    architectureDetails: 'Isolated container environments, automated rollback, and zero-downtime deploys.'
  },
  {
    id: 'data-pipelines',
    number: '08',
    category: 'Data',
    categoryType: 'data',
    title: 'Data Pipelines',
    description: 'High-throughput event streaming, database sync, and real-time analytics storage.',
    tags: ['Kafka', 'PostgreSQL', 'Analytics'],
    deliverables: [
      'Real-time event streaming pipelines',
      'Analytical database setup and modeling',
      'Automated data extract and sync jobs',
      'Dashboards and telemetry aggregation'
    ],
    timeline: '6 - 10 Weeks',
    idealFor: 'Businesses handling high event volumes or complex data reporting.',
    architectureDetails: 'Reliable message queues, distributed queries, and resilient data replication.'
  },
  {
    id: 'cyber-security',
    number: '09',
    category: 'Security',
    categoryType: 'security',
    title: 'Security & Hardening',
    description: 'Security audits, automated testing, and compliance hardening for production systems.',
    tags: ['Auth', 'Encryption', 'Security'],
    deliverables: [
      'Role-based access control and OAuth / SSO',
      'Automated vulnerability scanning',
      'Data encryption in transit and at rest',
      'Security audit report and compliance checks'
    ],
    timeline: '3 - 6 Weeks',
    idealFor: 'Applications handling sensitive data, payments, or healthcare records.',
    architectureDetails: 'Principle of least privilege, token revocation, and secure secret storage.'
  },
  {
    id: 'api-integrations',
    number: '10',
    category: 'APIs',
    categoryType: 'integration',
    title: 'API & Integrations',
    description: 'REST and GraphQL APIs connecting internal systems and third-party tools.',
    tags: ['REST', 'GraphQL', 'Webhooks'],
    deliverables: [
      'Standardized REST and GraphQL APIs',
      'Reliable webhook dispatchers with retry logic',
      'Third-party software integrations',
      'Interactive API documentation and SDKs'
    ],
    timeline: '4 - 8 Weeks',
    idealFor: 'Businesses integrating payment gateways, CRMs, and internal services.',
    architectureDetails: 'Schema validation, rate limiting, and comprehensive error logging.'
  }
];


export const TECH_STACK: TechItem[] = [
  { name: 'TypeScript', category: 'Languages', role: 'Full-stack type safety and shared contract schemas', provenance: 'Primary language across web, node microservices, and client apps' },
  { name: 'React', category: 'Frameworks', role: 'Declarative UI rendering with functional component models', provenance: 'Foundation for client dashboards and web platforms' },
  { name: 'Next.js', category: 'Frameworks', role: 'Server-side rendering, streaming HTML, and edge routing', provenance: 'Standard architecture for public and customer portals' },
  { name: 'Node.js', category: 'Languages', role: 'Asynchronous event-driven runtime for microservices', provenance: 'High concurrency API gateways and real-time streaming' },
  { name: 'Python', category: 'Languages', role: 'Data science, numerical computation, and ML training pipelines', provenance: 'PyTorch models, embeddings, and mathematical simulation' },
  { name: 'Java', category: 'Languages', role: 'Enterprise transaction engines and distributed messaging', provenance: 'High-reliability enterprise core systems' },
  { name: 'Flutter', category: 'Frameworks', role: 'High-performance compiled mobile apps for iOS and Android', provenance: 'Logistics, field operations, and real-time mobile UX' },
  { name: 'React Native', category: 'Frameworks', role: 'Cross-platform mobile applications with native bridging', provenance: 'Consumer mobile applications and fast feature iteration' },
  { name: 'MongoDB', category: 'Data & AI', role: 'Flexible document store for polymorphic data schemas', provenance: 'High-velocity operational document storage' },
  { name: 'PostgreSQL', category: 'Data & AI', role: 'Relational ACID persistence with advanced indexing and pgvector', provenance: 'Primary source of truth for structured transactional data' },
  { name: 'Firebase', category: 'Cloud & Infra', role: 'Serverless authentication, Firestore sync, and mobile services', provenance: 'Rapid prototyping and real-time mobile client states' },
  { name: 'AWS', category: 'Cloud & Infra', role: 'Multi-region cloud infrastructure, ECS/EKS, Lambda, and S3', provenance: 'Primary enterprise deployment target' },
  { name: 'Docker', category: 'Cloud & Infra', role: 'Immutable container packaging and isolated runtimes', provenance: 'Consistent reproducible builds across dev and production' },
  { name: 'Git & GitHub', category: 'Cloud & Infra', role: 'Distributed version control and automated CI/CD actions', provenance: 'Automated test suites, security scanning, and deployment' },
  { name: 'OpenAI', category: 'Data & AI', role: 'State-of-the-art foundation models and reasoning engines', provenance: 'Enterprise agentic workflows and synthesis' },
  { name: 'Tailwind CSS', category: 'Frameworks', role: 'Utility-first styling with zero runtime stylesheet overhead', provenance: 'Clean, architectural design systems and rapid layout' },
  { name: 'GraphQL', category: 'Frameworks', role: 'Declarative client data fetching with typed schemas', provenance: 'Multi-client unified API layers' },
  { name: 'Redis', category: 'Data & AI', role: 'In-memory caching, distributed locks, and pub/sub channels', provenance: 'Sub-millisecond query caching and rate limiting' },
  { name: 'Supabase', category: 'Cloud & Infra', role: 'Open-source Postgres backend with instant real-time APIs', provenance: 'Rapid scalable database deployments' }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'aethel-ai',
    tag: 'Web & AI',
    title: 'Aethel AI Analytics',
    description: 'Financial intelligence and forecasting platform with real-time market data streaming and risk simulation.',
    tags: ['Next.js', 'Python', 'PyTorch', 'ClickHouse'],
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1XCGEEgKHN3s5Qi9TTuLeowcLXcGyvtfpNJ67yOJdnKAjmmD_Qn4B_oRliQqVgiCra3W68GIHlD0dfjOoEB0mNcNBZRfTItWbwtQIZPPUeQRBu5QYkDKKshGFR1N2JeSec1XhGVZapVy18R1t4-w1yt1WCwrgpDgE9pBDgIH0qu_6qVxG0kLxwAbMBm8s2F0i9TKtJrv44vkzMmk1mtSdZhqQh982d-3R6PNZ9-k49J6mIxW21k8x4Eug',
    metrics: [
      { label: 'Throughput', value: '12M pts/s', detail: 'Real-time ticker processing' },
      { label: 'Query Latency', value: '14ms', detail: 'P99 analytical query response' },
      { label: 'Simulation Speed', value: '+340%', detail: 'GPU-accelerated calculations' }
    ],
    problem: 'Analysts were slowed by legacy spreadsheets and fragmented databases, requiring hours to model market risk scenarios.',
    solution: 'Built a unified analytics platform combining Next.js with ClickHouse columnar storage and Python GPU workers for sub-second calculations.',
    architecture: [
      'WebSocket feeds streaming live market quotes to browser clients',
      'Columnar database partitioning billions of historical tick events',
      'Asynchronous GPU worker pool running risk simulations',
      'Typed API contracts between backend microservices'
    ],
    results: [
      'Reduced simulation runtimes from 45 minutes to 8 seconds',
      'Adopted across 4 quantitative trading desks',
      'Maintained 100% uptime during market trading hours'
    ]
  },
  {
    id: 'logiflow-dispatch',
    tag: 'Mobile & Routing',
    title: 'LogiFlow Dispatch',
    description: 'Logistics routing and fleet management mobile app with dynamic driver dispatch and offline synchronization.',
    tags: ['Flutter', 'Node.js', 'Maps API', 'Rust'],
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1Wt3bW1G4EXNleWIhr1V3LEpyeC6WuJrWjeJTqMNAW5Tw4sVCSdmvZwMin3He9oFWrlNSjTsGfv1OHSh7ms6Vez7gQxRwdm_v1uLzOawAoSOMR2Hjqmv6lUcc5GvZdRVU6ms_fIS9lrBUGtYx0cu2nJqjuUhFMbaNKRpbehY7anKs6kHSjJgr8km0_ulto1hDB-vPVbjoFJ49tKFmPz0ZSND8HsYa-070Yr6X6yp-yQXqsasPu4W2GymbQ',
    metrics: [
      { label: 'Route Mileage', value: '-22%', detail: 'Average fleet distance reduction' },
      { label: 'Sync Resilience', value: '100%', detail: 'Zero data loss during offline transit' },
      { label: 'Dispatch Latency', value: '450ms', detail: 'Automated vehicle allocation' }
    ],
    problem: 'Drivers experienced frequent crashes and lost route data in remote areas with poor mobile reception.',
    solution: 'Engineered an offline-first mobile app in Flutter with local encrypted SQLite storage and an on-device route solver.',
    architecture: [
      'Local-first SQLite storage with automatic background synchronization',
      'Embedded routing solver for fast route recalculations',
      'Optimized GPS polling to conserve battery during long shifts',
      'Node.js backend coordinating depot inventory and scheduling'
    ],
    results: [
      'Delivered 99.8% on-time completion across 14,000 monthly trips',
      'Saved an estimated $480,000 annually in fleet fuel costs',
      'Reduced new driver onboarding time by over 60%'
    ]
  },
  {
    id: 'kroma-engine',
    tag: 'Cloud Infrastructure',
    title: 'Kroma Cloud Engine',
    sla: '99.99% SLA',
    description: 'Distributed cloud infrastructure and asset pipeline built for high-throughput video and 3D rendering.',
    tags: ['AWS', 'Docker', 'Rust', 'WebSockets'],
    isTelemetryCard: true,
    metrics: [
      { label: 'Throughput', value: '48 GB/s', detail: 'Peak sustained asset transfer' },
      { label: 'Latency', value: '1.4ms', detail: 'Cross-node synchronization' },
      { label: 'Uptime', value: '99.99%', detail: 'Multi-region failover' }
    ],
    problem: 'Production studios suffered render queue bottlenecks and slow transfers when moving multi-gigabyte media assets.',
    solution: 'Designed a distributed cloud backbone using lightweight Rust daemons on auto-scaling AWS Kubernetes nodes.',
    architecture: [
      'Kubernetes cluster with automatic compute node provisioning',
      'Rust asset-chunking service with deduplicated file distribution',
      'Redis cluster for job queues and real-time state tracking',
      'Multi-region failover with automatic health checks'
    ],
    results: [
      'Eliminated 87% of redundant asset transfers via edge caching',
      'Maintained uninterrupted availability during major project deadlines',
      'Reduced cloud compute costs by 38% through spot instance scaling'
    ]
  }
];

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    number: '01',
    phase: 'Phase 01',
    title: 'Discover',
    description: 'We clarify the problem, user requirements, and technical constraints before writing any code.',
    footerLabel: 'Discovery & Scope',
    deliverables: [
      'Technical requirements and constraints review',
      'User flows and feature priorities',
      'Architecture assessment and technology choices',
      'Clear project timeline and milestones'
    ],
    duration: '1 - 2 Weeks',
    keyArtifact: 'Technical Architecture Specification',
    methodology: 'Collaborative scoping workshops and technical risk assessment.',
    squadFocus: 'Lead Architect + Strategist',
    governanceGates: [
      'Sign-off on technical specifications and scope',
      'Milestone calendar and budget lock',
      'Security and integration boundaries established'
    ]
  },
  {
    number: '02',
    phase: 'Phase 02',
    title: 'Design',
    description: 'We design intuitive interfaces, system architectures, and clear API specifications.',
    footerLabel: 'Design & Architecture',
    deliverables: [
      'Interactive wireframes and visual UI design',
      'Component library and design tokens',
      'Database schema and entity diagrams',
      'API contracts and system architecture specs'
    ],
    duration: '2 - 3 Weeks',
    keyArtifact: 'Interactive Prototype & Schemas',
    methodology: 'Design tokens mapped to code components with schema-first API contracts.',
    squadFocus: 'Product Designer + Systems Architect',
    governanceGates: [
      'Interactive prototype walkthrough and approval',
      'Database schema and API review',
      'Security threat model review'
    ]
  },
  {
    number: '03',
    phase: 'Phase 03',
    title: 'Build',
    description: 'We develop in focused sprints with continuous automated testing and regular progress demos.',
    footerLabel: 'Development & Testing',
    deliverables: [
      'Iterative development with bi-weekly demos',
      'Automated unit, integration, and end-to-end tests',
      'Continuous deployment preview environments',
      'Dependency and vulnerability checks'
    ],
    duration: '4 - 10 Weeks',
    keyArtifact: 'Tested Codebase & CI/CD Pipeline',
    methodology: 'Trunk-based development with preview deployments per pull request.',
    squadFocus: 'Full-Stack Developers + QA',
    governanceGates: [
      'Bi-weekly milestone demonstrations and approvals',
      'Passing automated test suites and code linting',
      'Load and performance testing'
    ]
  },
  {
    number: '04',
    phase: 'Phase 04',
    title: 'Deliver',
    description: 'We launch into production, set up monitoring, and provide reliable ongoing support.',
    footerLabel: 'Launch & Support',
    deliverables: [
      'Smooth production release and DNS configuration',
      'System monitoring, error logging, and alerts',
      'Developer documentation and handoff notes',
      'Post-launch warranty and SLA support'
    ],
    duration: 'Ongoing',
    keyArtifact: 'Live Production System & SLAs',
    methodology: 'Automated health checks, documented runbooks, and proactive monitoring.',
    squadFocus: 'DevOps + SRE + Engineering Team',
    governanceGates: [
      'Zero-downtime traffic cutover with live verification',
      'Handoff documentation and walkthrough',
      'Support SLA activation'
    ]
  }
];

export const TARGET_AUDIENCES = [
  { label: 'Businesses', description: 'Established companies upgrading legacy systems or building modern web and mobile platforms.' },
  { label: 'Startups', description: 'Fast-moving teams requiring scalable MVPs with clean architecture and zero technical debt.' },
  { label: 'Founders', description: 'Entrepreneurs turning early concepts into production-ready digital products.' },
  { label: 'Creators', description: 'Independents and agencies building custom web platforms, digital tools, and audience experiences.' },
  { label: 'Tech Teams', description: 'Engineering departments seeking specialized architecture guidance, code audits, or extra capacity.' },
  { label: 'Organizations', description: 'Institutions requiring secure, reliable software infrastructure and automated workflows.' }
];

export const TELEMETRY_NODES = [
  {
    id: 'ap-south-1',
    name: 'AP-SOUTH-1',
    location: 'Tamil Nadu & Mumbai, India',
    throughput: '48.2 GB/sec',
    latency: '1.42 ms',
    orchestration: 'AWS EKS Cluster',
    nodes: '140 Nodes',
    status: 'HEALTHY',
    egressPeak: '52.1 GB/sec'
  },
  {
    id: 'us-east-1',
    name: 'US-EAST-1',
    location: 'N. Virginia, United States',
    throughput: '74.6 GB/sec',
    latency: '2.18 ms',
    orchestration: 'AWS EKS Cluster',
    nodes: '210 Nodes',
    status: 'HEALTHY',
    egressPeak: '89.4 GB/sec'
  },
  {
    id: 'eu-central-1',
    name: 'EU-CENTRAL-1',
    location: 'Frankfurt, Germany',
    throughput: '39.8 GB/sec',
    latency: '1.85 ms',
    orchestration: 'AWS EKS Cluster',
    nodes: '115 Nodes',
    status: 'HEALTHY',
    egressPeak: '46.0 GB/sec'
  }
];
