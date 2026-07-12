const strapi = require('@strapi/strapi');

async function seed() {
  const app = await strapi().load();
  const entityService = app.entityService;
  let count = 0;

  function idempotent(api, checkFn, createFn) {
    return checkFn().then(existing => {
      if (existing) {
        console.log(`[skip] ${api} already exists`);
        return existing;
      }
      return createFn().then(result => {
        console.log(`[ok] ${api} created (id: ${result.id})`);
        count++;
        return result;
      });
    });
  }

  function p(text) {
    return [{ type: 'paragraph', children: [{ type: 'text', text: text.trim() }] }];
  }

  function multiP(...texts) {
    return texts.map(t => ({ type: 'paragraph', children: [{ type: 'text', text: t.trim() }] }));
  }

  function heading(level, text) {
    return { type: 'heading', level, children: [{ type: 'text', text: text.trim() }] };
  }

  function code(language, text) {
    return { type: 'code', children: [{ type: 'text', text: text.trim() }], language };
  }

  // ============================================================
  // 1. AUTHOR
  // ============================================================
  const author = await idempotent(
    'api::author.author',
    () => entityService.findMany('api::author.author', { filters: { slug: 'hirak' } }).then(r => r[0] || null),
    () => entityService.create('api::author.author', { data: {
      name: 'Hirak',
      slug: 'hirak',
      bio: p('Full-stack developer with a passion for building elegant, performant applications. I write about software engineering, system design, and developer productivity.'),
      github_url: 'https://github.com/hirak',
      linkedin_url: 'https://linkedin.com/in/hirak',
      twitter_url: 'https://twitter.com/hirak',
      website_url: 'https://portfolio.hirak.tech',
      email: 'hello@hirak.tech',
    }})
  );

  // ============================================================
  // 2. CATEGORIES
  // ============================================================
  const catNames = [
    { name: 'Engineering', slug: 'engineering', description: 'Software architecture, system design, and backend engineering.' },
    { name: 'Frontend', slug: 'frontend', description: 'UI development, React, Next.js, and design systems.' },
    { name: 'DevOps', slug: 'devops', description: 'CI/CD, infrastructure, Docker, and cloud deployment.' },
  ];
  const categories = {};
  for (const c of catNames) {
    categories[c.slug] = await idempotent(
      `api::category.category (${c.slug})`,
      () => entityService.findMany('api::category.category', { filters: { slug: c.slug } }).then(r => r[0] || null),
      () => entityService.create('api::category.category', { data: c })
    );
  }

  // ============================================================
  // 3. TAGS
  // ============================================================
  const tagNames = [
    { name: 'React', slug: 'react' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Docker', slug: 'docker' },
    { name: 'AWS', slug: 'aws' },
  ];
  const tags = {};
  for (const t of tagNames) {
    tags[t.slug] = await idempotent(
      `api::tag.tag (${t.slug})`,
      () => entityService.findMany('api::tag.tag', { filters: { slug: t.slug } }).then(r => r[0] || null),
      () => entityService.create('api::tag.tag', { data: t })
    );
  }

  // ============================================================
  // 4. SKILL CATEGORIES & SKILLS
  // ============================================================
  const skillCategoryData = [
    { name: 'Frontend', skills: [
      { name: 'React', category: 'frontend', proficiency: 95 },
      { name: 'TypeScript', category: 'frontend', proficiency: 90 },
      { name: 'Next.js', category: 'frontend', proficiency: 92 },
      { name: 'Tailwind CSS', category: 'frontend', proficiency: 88 },
    ]},
    { name: 'Backend', skills: [
      { name: 'Node.js', category: 'backend', proficiency: 90 },
      { name: 'PostgreSQL', category: 'backend', proficiency: 85 },
      { name: 'Python', category: 'backend', proficiency: 80 },
    ]},
    { name: 'DevOps & Tools', skills: [
      { name: 'Docker', category: 'devops', proficiency: 85 },
      { name: 'AWS', category: 'devops', proficiency: 80 },
      { name: 'Git', category: 'tool', proficiency: 95 },
      { name: 'GitHub Actions', category: 'devops', proficiency: 88 },
    ]},
  ];

  const skillCategories = [];
  for (let sci = 0; sci < skillCategoryData.length; sci++) {
    const sc = skillCategoryData[sci];
    const skills = [];
    for (const s of sc.skills) {
      const sk = await idempotent(
        `api::skill.skill (${s.name})`,
        () => entityService.findMany('api::skill.skill', { filters: { name: s.name } }).then(r => r[0] || null),
        () => entityService.create('api::skill.skill', { data: s })
      );
      skills.push(sk);
    }

    const existingSC = await entityService.findMany('api::skill-category.skill-category', { filters: { name: sc.name } }).then(r => r[0] || null);
    let skillCategory;
    if (existingSC) {
      skillCategory = existingSC;
      console.log(`[skip] api::skill-category (${sc.name}) already exists`);
    } else {
      skillCategory = await entityService.create('api::skill-category.skill-category', {
        data: { name: sc.name, skills: { connect: skills.map(s => ({ id: s.id })) } }
      });
      console.log(`[ok] skill-category (${sc.name}) created (id: ${skillCategory.id})`);
      count++;
    }
    skillCategories.push(skillCategory);
  }

  // ============================================================
  // 5. EXPERIENCES
  // ============================================================
  const experienceData = [
    {
      company: 'TechCorp Inc', role: 'Senior Full-Stack Developer',
      start_date: '2023-01-01', current: true,
      description: multiP(
        'Led the migration from a monolithic architecture to microservices, improving deployment frequency by 3x.',
        'Architected a real-time data pipeline processing 10M+ events daily using Node.js, Kafka, and PostgreSQL.',
        'Mentored a team of 4 junior developers and established code review standards.',
      ),
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Kafka'],
      order: 1,
    },
    {
      company: 'StartupXYZ', role: 'Full-Stack Developer',
      start_date: '2021-03-01', end_date: '2022-12-31', current: false,
      description: multiP(
        'Built the customer-facing dashboard from scratch using Next.js and TypeScript, serving 50K+ users.',
        'Designed and implemented the REST API layer using Node.js with comprehensive test coverage (>90%).',
        'Set up CI/CD pipelines with GitHub Actions and Docker, reducing release cycle from 2 weeks to daily.',
      ),
      skills: ['Next.js', 'TypeScript', 'Node.js', 'Docker', 'GitHub Actions'],
      order: 2,
    },
    {
      company: 'AgencyCo', role: 'Frontend Developer',
      start_date: '2019-06-01', end_date: '2021-02-28', current: false,
      description: multiP(
        'Developed 15+ responsive web applications for clients across fintech, e-commerce, and healthcare sectors.',
        'Introduced TypeScript and automated testing to the team, reducing production bugs by 40%.',
        'Led the adoption of design systems, improving UI consistency and reducing design-to-development handoff time.',
      ),
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      order: 3,
    },
  ];

  const experiences = [];
  for (const e of experienceData) {
    const exp = await idempotent(
      `api::experience.experience (${e.company})`,
      () => entityService.findMany('api::experience.experience', { filters: { company: e.company } }).then(r => r[0] || null),
      () => entityService.create('api::experience.experience', { data: e })
    );
    experiences.push(exp);
  }

  // ============================================================
  // 6. PROJECTS
  // ============================================================
  const projectData = [
    {
      title: 'CloudPulse - Infrastructure Monitoring',
      slug: 'cloudpulse-infra-monitoring',
      description: 'A real-time infrastructure monitoring dashboard with intelligent alerting and predictive analytics.',
      client: 'Internal',
      role: 'Full-Stack Developer',
      timeline: '6 months',
      team: '3 developers',
      tech_stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSocket', 'Docker', 'AWS', 'Prometheus'],
      live_url: 'https://cloudpulse.example.com',
      repo_url: 'https://github.com/hirak/cloudpulse',
      metrics: [
        { label: 'Uptime', value: '99.9', suffix: '%' },
        { label: 'Latency', value: '12', suffix: 'ms' },
        { label: 'Events/sec', value: '50', suffix: 'K' },
        { label: 'Dashboards', value: '200', suffix: '+' },
      ],
      problem: multiP(
        'Engineering teams at mid-size companies struggle with fragmented monitoring tools, leading to alert fatigue and slow incident response. Existing solutions were either too complex to set up or too limited in scope.',
      ),
      research: multiP(
        'We interviewed 15 engineering teams across 8 companies. Key findings: 80% used 3+ monitoring tools, average incident resolution time was 45 minutes, and teams wanted a single pane of glass with smart alerting that learns from past incidents.',
      ),
      process: multiP(
        'We followed a 4-phase approach: Discovery (2 weeks of user research), Design (3 weeks of prototyping and usability testing), Build (12 weeks of iterative development with 2-week sprints), and Launch (2 weeks of beta testing with 5 early-adopter teams).',
      ),
      design_decisions: multiP(
        'Dark theme with high contrast to reduce eye strain during long monitoring shifts. Collapsible sidebar for maximized data view on large screens. Real-time updates via WebSocket with visual feedback for state changes. Dashboard builder using drag-and-drop grid layout.',
      ),
      technical_decisions: multiP(
        'Chose React with shadcn/ui for rapid UI development with accessibility built-in. WebSocket for real-time updates to avoid polling overhead. PostgreSQL with TimescaleDB extension for time-series metrics. Containerized with Docker Compose for easy self-hosting. AWS S3 for storing historical metric snapshots.',
      ),
      results: multiP(
        'After 3 months in production, CloudPulse is used by 12 teams. Average incident resolution time dropped from 45 min to 18 min. Alert noise reduced by 60% through intelligent grouping. Team satisfaction score: 4.7/5.',
      ),
      publishedAt: new Date('2025-06-15').toISOString(),
    },
    {
      title: 'ShopFlow - E-commerce Platform',
      slug: 'shopflow-ecommerce',
      description: 'A headless e-commerce platform with real-time inventory, multi-tenant support, and AI-powered recommendations.',
      client: 'StartupXYZ',
      role: 'Lead Developer',
      timeline: '8 months',
      team: '5 developers',
      tech_stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'Docker', 'AWS'],
      live_url: 'https://shopflow.example.com',
      repo_url: 'https://github.com/hirak/shopflow',
      metrics: [
        { label: 'Products', value: '10', suffix: 'K+' },
        { label: 'Orders/day', value: '5', suffix: 'K' },
        { label: 'Page Load', value: '1.2', suffix: 's' },
        { label: 'Uptime', value: '99.99', suffix: '%' },
      ],
      problem: multiP(
        'Traditional e-commerce platforms are monolithic and expensive. Small-to-medium businesses needed a modern, API-first solution that could be customized and scaled without vendor lock-in.',
      ),
      research: multiP(
        'Analyzed the top 5 e-commerce platforms (Shopify, WooCommerce, Magento, BigCommerce, Medusa). Identified gaps in multi-tenant architecture, real-time inventory sync, and developer experience. Surveyed 30+ store owners.',
      ),
      process: multiP(
        'Iterative development with weekly demos to the client. Started with a core checkout flow MVP in 6 weeks, then added inventory management, Stripe integration, admin dashboard, and AI recommendations in subsequent sprints.',
      ),
      design_decisions: multiP(
        'Mobile-first design with 3-tap checkout. Modular component architecture for storefront customization. White-label admin dashboard using the same UI library as the storefront.',
      ),
      technical_decisions: multiP(
        'Next.js App Router for SSR and optimal SEO. PostgreSQL with row-level security for multi-tenant isolation. Redis for cart sessions and rate limiting. Stripe Elements for PCI-compliant payments. AWS ECS for containerized deployment with auto-scaling.',
      ),
      results: multiP(
        'Launched with 25 stores in the first month. Average 5K orders per day with zero downtime. Page load under 1.2s on 3G connections. Client reported 40% increase in conversion rate compared to previous platform.',
      ),
      publishedAt: new Date('2025-04-01').toISOString(),
    },
    {
      title: 'DocuVerse - Collaborative Docs',
      slug: 'docuverse-collaborative-docs',
      description: 'A Notion-like collaborative documentation tool with real-time editing, version history, and rich embeds.',
      client: 'Personal Project',
      role: 'Full-Stack Developer',
      timeline: '4 months',
      team: 'Solo',
      tech_stack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'WebSocket', 'TipTap', 'Docker'],
      live_url: 'https://docuverse.example.com',
      repo_url: 'https://github.com/hirak/docuverse',
      problem: multiP(
        'Existing collaborative editors are either feature-bloated (Notion) or too minimal (Google Docs). Developers needed a self-hostable solution with rich text, code blocks, and real-time collaboration.',
      ),
      research: multiP(
        'Studied CRDT and OT algorithms for conflict resolution. Benchmarked TipTap, Slate.js, and Quill for rich text. Modeled the data layer after Notion\'s block-based architecture.',
      ),
      process: multiP(
        'Started with a prototype using TipTap + WebSocket for real-time sync. Built the block editor with 15+ block types (text, code, image, table, callout, etc.). Added version history with diff visualization. Implemented comments and @mentions.',
      ),
      results: multiP(
        'Open-sourced on GitHub with 500+ stars in the first month. Docker image with one-command setup. Used by 3 small teams for internal documentation.',
      ),
      publishedAt: new Date('2025-02-20').toISOString(),
    },
    {
      title: 'API Gateway Microservice',
      slug: 'api-gateway-microservice',
      description: 'A high-performance API gateway with rate limiting, authentication, request transformation, and observability.',
      client: 'TechCorp Inc',
      role: 'Backend Developer',
      timeline: '3 months',
      team: '2 developers',
      tech_stack: ['Node.js', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker', 'Prometheus', 'Grafana'],
      repo_url: 'https://github.com/hirak/api-gateway',
      metrics: [
        { label: 'Requests/sec', value: '100', suffix: 'K' },
        { label: 'Latency p99', value: '5', suffix: 'ms' },
        { label: 'Routes', value: '50', suffix: '+' },
      ],
      problem: multiP(
        'As TechCorp migrated from monolith to microservices, we needed a unified entry point for authentication, rate limiting, request routing, and monitoring across 20+ services.',
      ),
      technical_decisions: multiP(
        'Built on Node.js with the Fastify framework for maximum throughput. Used Redis for distributed rate limiting with a sliding window algorithm. JWT authentication with automatic token refresh. Request/response logging to Elasticsearch via a sidecar pattern. Prometheus metrics for real-time monitoring dashboards.',
      ),
      results: multiP(
        'Handles 100K requests/second at p99 latency of 5ms. Reduced service-to-service auth overhead by 80%. Real-time dashboards gave the ops team visibility they never had before.',
      ),
      publishedAt: new Date('2024-11-10').toISOString(),
    },
  ];

  const projects = [];
  for (const p of projectData) {
    const prj = await idempotent(
      `api::project.project (${p.slug})`,
      () => entityService.findMany('api::project.project', { filters: { slug: p.slug } }).then(r => r[0] || null),
      () => entityService.create('api::project.project', { data: p })
    );
    projects.push(prj);
  }

  // ============================================================
  // 7. ARTICLES
  // ============================================================
  const articleData = [
    {
      title: 'Building a Real-Time Dashboard with Next.js and WebSockets',
      slug: 'building-realtime-dashboard-nextjs-websockets',
      description: 'Learn how to build a real-time analytics dashboard using Next.js 15, WebSockets, and TimescaleDB.',
      content: [
        heading(2, 'Introduction'),
        p('Real-time dashboards are everywhere — from monitoring tools to live analytics. In this guide, I\'ll walk you through building a performant real-time dashboard using Next.js 15, WebSocket connections, and TimescaleDB for time-series data.'),
        heading(2, 'Architecture Overview'),
        p('The system has three layers: the data ingestion pipeline (Node.js + WebSocket server), the storage layer (PostgreSQL with TimescaleDB extension), and the presentation layer (Next.js App Router with server components).'),
        heading(2, 'Setting Up the WebSocket Server'),
        code('typescript', `
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const event = JSON.parse(data.toString());
    handleMetricEvent(event);
  });
});
`),
        heading(2, 'Consuming Real-Time Data in Next.js'),
        p('The tricky part is mixing server components with real-time data. Server components render once at build/request time, so we need a client-side WebSocket hook for live updates.'),
        code('typescript', `
'use client';
import { useEffect, useState } from 'react';

export function useMetricStream(channel: string) {
  const [data, setData] = useState<Metric[]>([]);
  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com');
    ws.onmessage = (event) => {
      const metric = JSON.parse(event.data);
      setData(prev => [metric, ...prev].slice(0, 100));
    };
    return () => ws.close();
  }, [channel]);
  return data;
}
`),
        heading(2, 'Performance Optimizations'),
        p('With thousands of events per second, the browser can become a bottleneck. We used virtualized lists, data aggregation at the server level, and throttled re-renders with requestAnimationFrame to keep the UI snappy.'),
        heading(2, 'Conclusion'),
        p('Building a real-time dashboard is a rewarding challenge that touches on full-stack engineering skills. The combination of Next.js for the shell, WebSockets for live data, and TimescaleDB for time-series storage creates a robust foundation.'),
      ],
      category: categories.engineering.id,
      tags: { connect: [tags.nextjs.id, tags.typescript.id, tags.nodejs.id, tags.docker.id] },
      featured: true,
      reading_time: 8,
      seo_title: 'Building a Real-Time Dashboard with Next.js & WebSockets',
      seo_description: 'Step-by-step guide to building a real-time analytics dashboard with Next.js 15, WebSocket connections, and TimescaleDB.',
      publishedAt: new Date('2025-06-01').toISOString(),
    },
    {
      title: 'The Complete Guide to Docker for JavaScript Developers',
      slug: 'complete-guide-docker-javascript-developers',
      description: 'Everything you need to know about Docker — from containers to docker-compose and production deployments.',
      content: [
        heading(2, 'Why Docker?'),
        p('"It works on my machine" — we\'ve all heard it. Docker solves this by packaging your application with all its dependencies into a standardized unit called a container.'),
        heading(2, 'Dockerfile Basics'),
        p('A Dockerfile is a recipe for building a container image. Here\'s a production-ready Dockerfile for a Node.js application:'),
        code('dockerfile', `
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && \\
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
`),
        heading(2, 'Multi-Stage Builds'),
        p('Notice the two stages: builder compiles the app, runner only contains what\'s needed for production. This keeps images small — our production image is only 180MB vs 800MB for a single-stage build.'),
        heading(2, 'Docker Compose for Development'),
        p('docker-compose.yml ties multiple services together. For a typical web app:'),
        code('yaml', `
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: myapp
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - '3000:3000'
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://myapp:\${DB_PASSWORD}@postgres:5432/myapp

volumes:
  pgdata:
`),
        heading(2, 'Production Best Practices'),
        p('In production: use .dockerignore to exclude unnecessary files, pin image versions, never run as root (we use USER nextjs), use healthchecks, and set resource limits in your compose file.'),
        heading(2, 'Conclusion'),
        p('Docker is an essential skill for modern JavaScript developers. Start with a simple Dockerfile, add docker-compose for local development, and incrementally adopt production best practices.'),
      ],
      category: categories.devops.id,
      tags: { connect: [tags.docker.id, tags.nodejs.id, tags.aws.id] },
      featured: true,
      reading_time: 10,
      seo_title: 'The Complete Guide to Docker for JavaScript Developers',
      seo_description: 'Master Docker for JavaScript development. Covers Dockerfiles, multi-stage builds, docker-compose, and production best practices.',
      publishedAt: new Date('2025-05-15').toISOString(),
    },
    {
      title: 'TypeScript Patterns for Scalable React Applications',
      slug: 'typescript-patterns-scalable-react',
      description: 'Production-proven TypeScript patterns for type-safe API clients, discriminated unions, and generic React hooks.',
      content: [
        heading(2, 'Why TypeScript Patterns Matter'),
        p('TypeScript catches bugs at compile time, but only if you use it well. Poorly typed code is just JavaScript with extra annotations. Here are patterns I\'ve refined over years of React development.'),
        heading(2, 'Discriminated Unions for Async State'),
        p('Instead of boolean flags, model async state as a discriminated union:'),
        code('typescript', `
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function useAsync<T>(fetchFn: () => Promise<T>): AsyncState<T> {
  // TypeScript ensures you handle every state
}
`),
        heading(2, 'Generic API Client'),
        p('Type your API responses once and get end-to-end type safety:'),
        code('typescript', `
interface ApiResponse<T> { data: T; meta?: { total: number } }

async function get<T>(path: string): Promise<ApiResponse<T>> {
  const res = await fetch(path);
  return res.json();
}

// Usage: fully typed without casting
const { data } = await get<User[]>(`/users`);
data.forEach(user => console.log(user.email)); // string
`),
        heading(2, 'Component Prop Patterns'),
        p('Use discriminated props for variants instead of optional props:'),
        code('typescript', `
type ButtonProps = {
  children: React.ReactNode;
} & (
  | { variant: 'link'; href: string }
  | { variant: 'button'; onClick: () => void }
);

// TypeScript enforces: if variant is 'link', href is required
`),
        heading(2, 'Conclusion'),
        p('These patterns have saved me countless hours debugging runtime errors. The key is leveraging TypeScript\'s type system to encode business logic at the type level, making invalid states unrepresentable.'),
      ],
      category: categories.frontend.id,
      tags: { connect: [tags.react.id, tags.typescript.id, tags.nextjs.id] },
      featured: false,
      reading_time: 7,
      seo_title: 'TypeScript Patterns for Scalable React Applications',
      seo_description: 'Production-proven TypeScript patterns: discriminated unions, generic API clients, and type-safe React hooks for scalable applications.',
      publishedAt: new Date('2025-04-20').toISOString(),
    },
    {
      title: 'From Monolith to Microservices: A Migration Playbook',
      slug: 'monolith-to-microservices-migration-playbook',
      description: 'A practical guide to decomposing a monolithic application into microservices without losing your sanity.',
      content: [
        heading(2, 'The Decision'),
        p('Not every monolith needs to be broken up. Microservices add operational complexity. But when your monolith is 500K lines, has a 45-minute deploy time, and teams keep stepping on each other\'s toes, it\'s time to consider migration.'),
        heading(2, 'The Strangler Fig Pattern'),
        p('Don\'t rewrite everything at once. The strangler fig pattern lets you gradually extract functionality: identify a bounded context, extract it into a service, route traffic to it, and remove the old code. Repeat.'),
        heading(2, 'Phase 1: Bounded Contexts'),
        p('Use domain-driven design to identify natural boundaries. In our case, we found 6 clear contexts: Auth, Users, Orders, Payments, Notifications, and Reporting.'),
        heading(2, 'Phase 2: Infrastructure'),
        p('Before extracting services, set up the shared infrastructure: API gateway (rate limiting + auth), message broker (Kafka for async communication), service discovery (Consul), and centralized logging (ELK stack).'),
        heading(2, 'Phase 3: The First Extraction'),
        p('Start with the simplest, most independent service. We chose Notifications — it had few dependencies and low risk. Successful extraction in 3 weeks gave the team confidence.'),
        heading(2, 'Lessons Learned'),
        p('Key takeaways: 1) Invest in monitoring first (you\'ll need it), 2) Keep the monolith working during migration (dual-write pattern), 3) Don\'t extract services that aren\'t independent, 4) Migration takes 3-4x longer than you expect.'),
      ],
      category: categories.engineering.id,
      tags: { connect: [tags.nodejs.id, tags.aws.id, tags.docker.id] },
      featured: false,
      reading_time: 12,
      seo_title: 'From Monolith to Microservices: A Migration Playbook',
      seo_description: 'Practical guide to decomposing a monolith into microservices using the strangler fig pattern, DDD bounded contexts, and Kafka.',
      publishedAt: new Date('2025-03-10').toISOString(),
    },
    {
      title: 'Getting Started with AWS for Web Developers',
      slug: 'getting-started-aws-web-developers',
      description: 'A practical introduction to AWS services every web developer should know: EC2, S3, RDS, and CloudFront.',
      content: [
        heading(2, 'AWS is Not Scary'),
        p('AWS has 200+ services, but as a web developer, you only need to know a handful: EC2 (servers), S3 (file storage), RDS (databases), and CloudFront (CDN).'),
        heading(2, 'EC2: Virtual Servers'),
        p('Think of EC2 as a remote computer. Launch a t3.micro instance (free tier), SSH in, and you have a Linux machine. Use security groups to control inbound/outbound traffic.'),
        heading(2, 'S3: File Storage'),
        p('S3 is an infinitely scalable file store. Upload files, serve them publicly (with CDN in front), or use it for backups. Key concept: buckets with globally unique names.'),
        heading(2, 'RDS: Managed Databases'),
        p('RDS manages PostgreSQL, MySQL, or Aurora for you. Automated backups, multi-AZ failover, and read replicas. One click compared to managing Postgres yourself on EC2.'),
        heading(2, 'Putting It Together'),
        p('A typical web app: EC2 for your Next.js/Node server, RDS for PostgreSQL, S3 for user uploads and backups, CloudFront as CDN, and Route 53 for DNS. All managed by IAM for permissions.'),
      ],
      category: categories.devops.id,
      tags: { connect: [tags.aws.id, tags.docker.id, tags.nodejs.id] },
      featured: false,
      reading_time: 9,
      seo_title: 'Getting Started with AWS for Web Developers',
      seo_description: 'Practical guide to AWS for web developers: EC2, S3, RDS, and CloudFront explained with real-world examples.',
      publishedAt: new Date('2025-02-05').toISOString(),
    },
  ];

  const articles = [];
  for (const a of articleData) {
    const art = await idempotent(
      `api::article.article (${a.slug})`,
      () => entityService.findMany('api::article.article', { filters: { slug: a.slug } }).then(r => r[0] || null),
      () => entityService.create('api::article.article', {
        data: { ...a, author: author.id }
      })
    );
    articles.push(art);
  }

  // ============================================================
  // 8. DOC COLLECTION + DOC ARTICLES
  // ============================================================
  const docColl = await idempotent(
    'api::doc-collection.doc-collection',
    () => entityService.findMany('api::doc-collection.doc-collection', { filters: { slug: 'developer-guide' } }).then(r => r[0] || null),
    () => entityService.create('api::doc-collection.doc-collection', {
      data: { name: 'Developer Guide', slug: 'developer-guide', description: 'Technical documentation for the portfolio platform', order: 1 }
    })
  );

  // Create doc pages as articles. Need to create parent first, then children with doc_parent set.
  const docPage1 = await idempotent(
    'api::article.article (doc-getting-started)',
    () => entityService.findMany('api::article.article', { filters: { slug: 'getting-started' } }).then(r => r[0] || null),
    () => entityService.create('api::article.article', { data: {
      title: 'Getting Started', slug: 'getting-started',
      description: 'Set up your development environment and start contributing.',
      content: [
        heading(2, 'Prerequisites'),
        p('Before you begin, make sure you have the following installed on your machine: Node.js 18+, pnpm 9+, Docker Desktop, and Git.'),
        heading(2, 'Clone and Install'),
        code('bash', 'git clone https://github.com/hirak/portfolio.git\ncd portfolio\npnpm install'),
        heading(2, 'Environment Variables'),
        p('Copy the example environment files and customize them for your setup. You\'ll need to set database credentials, API tokens, and AWS configuration if using S3.'),
        heading(2, 'Start Development'),
        code('bash', 'docker compose up -d\npnpm dev'),
        heading(2, 'Access the Apps'),
        p('Once running, access the Next.js frontend at http://localhost:3000 and the Strapi admin panel at http://localhost:1337/admin. Default admin credentials are set in the environment variables.'),
      ],
      doc_collection: docColl.id,
      nav_order: 1,
      author: author.id,
      publishedAt: new Date().toISOString(),
    }})
  );

  const docPage2 = await idempotent(
    'api::article.article (doc-architecture)',
    () => entityService.findMany('api::article.article', { filters: { slug: 'architecture-overview' } }).then(r => r[0] || null),
    () => entityService.create('api::article.article', { data: {
      title: 'Architecture Overview', slug: 'architecture-overview',
      description: 'Understanding the system architecture, data flow, and technology choices.',
      content: [
        heading(2, 'High-Level Architecture'),
        p('The portfolio is a pnpm monorepo with two applications: a Strapi v5 headless CMS and a Next.js 15 frontend, deployed on a single AWS EC2 instance with Docker Compose.'),
        heading(2, 'Component Diagram'),
        code('text', 'User\n  |\n  v\nNginx (Reverse Proxy + TLS)\n  |\n  +---> Next.js (:3000) ---> Strapi (:1337) ---> PostgreSQL (:5432)\n  |\n  +---> S3 (media storage + backups)'),
        heading(2, 'Technology Stack'),
        p('Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, Radix UI primitives. Backend/CMS: Strapi v5, PostgreSQL 16, AWS S3 for media. Infrastructure: Nginx reverse proxy, Let\'s Encrypt TLS, docker-compose, GitHub Actions CI/CD.'),
        heading(2, 'Data Flow'),
        p('1. Content editors create/manage content in Strapi admin. 2. Next.js server components fetch data from Strapi REST API at request time (ISR with 60s revalidation). 3. Media files are uploaded to S3 and served via CloudFront CDN. 4. On-demand revalidation via Strapi webhook triggering Next.js API route.'),
      ],
      doc_collection: docColl.id,
      nav_order: 2,
      author: author.id,
      publishedAt: new Date().toISOString(),
    }})
  );

  const docPage3 = await idempotent(
    'api::article.article (doc-api-ref)',
    () => entityService.findMany('api::article.article', { filters: { slug: 'api-reference' } }).then(r => r[0] || null),
    () => entityService.create('api::article.article', { data: {
      title: 'API Reference', slug: 'api-reference',
      description: 'Complete reference for all Strapi API endpoints used by the portfolio.',
      content: [
        heading(2, 'REST API Endpoints'),
        heading(3, 'Articles'),
        code('text', 'GET /api/articles - List articles (pagination, filters, sort)\nGET /api/articles?filters[slug][$eq]=:slug - Get single article\nGET /api/articles?filters[featured][$eq]=true - Featured articles\nGET /api/articles?filters[category][slug][$eq]=:cat - By category\nGET /api/articles?filters[tags][slug][$eq]=:tag - By tag'),
        heading(3, 'Projects'),
        code('text', 'GET /api/projects - List all projects\nGET /api/projects?filters[slug][$eq]=:slug - Single project'),
        heading(3, 'Categories & Tags'),
        code('text', 'GET /api/categories - List categories\nGET /api/tags - List all tags'),
        heading(3, 'Documentation'),
        code('text', 'GET /api/doc-collections?populate=* - Collections with articles\nGET /api/articles?filters[doc_collection][id][$notNull]=true&filters[slug][$eq]=:slug - Doc page'),
        heading(2, 'Authentication'),
        p('Public endpoints use a read-only API token passed as Bearer token in the Authorization header. Admin operations require JWT authentication through the Strapi admin panel.'),
        heading(2, 'Response Format'),
        p('All responses use the Strapi v4-compatible format: { data: { id, attributes: {...} }, meta: { pagination: {...} } }. This is achieved via a custom response transformation middleware in the CMS.'),
      ],
      doc_collection: docColl.id,
      nav_order: 3,
      author: author.id,
      publishedAt: new Date().toISOString(),
    }})
  );

  const docPage4 = await idempotent(
    'api::article.article (doc-deployment)',
    () => entityService.findMany('api::article.article', { filters: { slug: 'deployment-guide' } }).then(r => r[0] || null),
    () => entityService.create('api::article.article', { data: {
      title: 'Deployment Guide', slug: 'deployment-guide',
      description: 'How to deploy the portfolio to AWS EC2 with Docker and GitHub Actions.',
      content: [
        heading(2, 'Prerequisites'),
        p('An AWS EC2 instance running Ubuntu 22.04, an S3 bucket for media/backups, DNS records pointing to the EC2 IP, and GitHub secrets configured for CI/CD.'),
        heading(2, 'Initial Server Setup'),
        code('bash', '# Install Docker\ncurl -fsSL https://get.docker.com | sh\nsudo usermod -aG docker ubuntu\n\n# Install Nginx\nsudo apt update && sudo apt install nginx certbot python3-certbot-nginx\n\n# Clone the repository\ngit clone https://github.com/hirak/portfolio.git /data/portfolio'),
        heading(2, 'Nginx Configuration'),
        p('Copy the nginx config from infrastructure/nginx/portfolio.conf to /etc/nginx/conf.d/. Run certbot to obtain TLS certificates for all three domains (portfolio, cms, api subdomains).'),
        heading(2, 'Deploy via GitHub Actions'),
        p('Push to main triggers the deploy workflow: SSH into EC2, pull latest code, rebuild containers with docker compose, and run health checks. The entire deploy takes ~2 minutes with zero downtime.'),
        heading(2, 'Monitoring'),
        p('Use the monitor.sh script for health checks. Daily PostgreSQL backups to S3 via systemd timer. Nginx access logs for traffic analysis.'),
      ],
      doc_collection: docColl.id,
      nav_order: 4,
      author: author.id,
      publishedAt: new Date().toISOString(),
    }})
  );

  const docPage5 = await idempotent(
    'api::article.article (doc-faq)',
    () => entityService.findMany('api::article.article', { filters: { slug: 'frequently-asked-questions' } }).then(r => r[0] || null),
    () => entityService.create('api::article.article', { data: {
      title: 'FAQ', slug: 'frequently-asked-questions',
      description: 'Common questions about the portfolio platform.',
      content: [
        heading(2, 'How do I add a new blog post?'),
        p('Log in to the Strapi admin panel, navigate to the Articles collection, and click "Create new entry." Fill in the title, slug, description, content (using the rich text editor), and assign a category and tags. Set "publishedAt" to make it visible.'),
        heading(2, 'How do I add a new project?'),
        p('In the Strapi admin, go to Projects. Create a new entry with title, slug, description, tech stack (JSON array), and the problem/research/process/results sections. Media files go to the S3 bucket automatically.'),
        heading(2, 'How do I update the homepage?'),
        p('The homepage is a single type in Strapi. Edit it directly — update the hero section, about section, featured projects, etc. Changes appear on the frontend within 60 seconds (or instantly with webhook revalidation).'),
        heading(2, 'How does image handling work?'),
        p('Images uploaded through Strapi are stored in AWS S3 and served via the S3 URL. The Next.js frontend is configured to allow images from the S3 bucket domain.'),
        heading(2, 'Can I self-host this without AWS?'),
        p('Yes! Update the upload provider in config/plugins.js to use local storage instead of S3. The Docker Compose setup works on any Linux server with Docker installed.'),
      ],
      doc_collection: docColl.id,
      nav_order: 5,
      author: author.id,
      publishedAt: new Date().toISOString(),
    }})
  );

  // Update children relations for hierarchy (Getting Started has Architecture and API Reference as children in a flat structure)
  // For now, all docs are top-level (no doc_parent) in a single collection

  // ============================================================
  // 9. HOMEPAGE (single type)
  // ============================================================
  const existingHomepage = await entityService.findMany('api::homepage.homepage').then(r => r[0] || null);
  if (existingHomepage) {
    console.log('[skip] homepage already exists');
    await entityService.update('api::homepage.homepage', existingHomepage.id, { data: {
      hero: {
        name: 'Hirak',
        title: 'Full-Stack Developer & Engineer',
        positioningStatement: 'I build performant web applications, design scalable systems, and write about software engineering. Currently building CloudPulse, an infrastructure monitoring platform.',
        availability_status: 'open',
        social_links: [
          { platform: 'github', url: 'https://github.com/hirak' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/hirak' },
          { platform: 'twitter', url: 'https://twitter.com/hirak' },
        ],
        cta_buttons: [
          { text: 'View My Work', url: '/projects', variant: 'primary' },
          { text: 'Read Blog', url: '/blog', variant: 'secondary' },
          { text: 'Get in Touch', url: '/contact', variant: 'outline' },
        ],
      },
      about: {
        title: 'About Me',
        content: multiP(
          'I\'m a full-stack developer with 6+ years of experience building web applications that scale. My journey started with curiosity about how websites work, and evolved into a career crafting architectures, APIs, and user interfaces.',
          'I specialize in the JavaScript/TypeScript ecosystem — React, Next.js, and Node.js — but I\'m equally comfortable with infrastructure (Docker, AWS, CI/CD) and databases (PostgreSQL, Redis). I believe the best engineers understand the full stack, not just their favorite layer.',
          'When I\'m not coding, you\'ll find me writing technical articles, contributing to open source, or exploring the latest in system design. I\'m passionate about developer experience and building tools that make other developers more productive.',
          'Currently available for consulting and full-time opportunities. Based in San Francisco, CA.',
        ),
      },
      featuredProjects: {
        title: 'Featured Projects',
        projects: { connect: projects.slice(0, 3).map(p => ({ id: p.id })) },
      },
      skills: { title: 'Skills & Technologies' },
      experience: { title: 'Experience' },
      latestArticles: { title: 'Latest Articles', count: 3 },
      contactCta: {
        title: 'Let\'s Work Together',
        description: 'Have a project in mind or just want to chat? I\'m always open to discussing new opportunities, collaborations, or interesting ideas.',
        button_label: 'Get in Touch',
        button_url: '/contact',
      },
      seo: {
        meta_title: 'Hirak - Full-Stack Developer Portfolio',
        meta_description: 'Full-stack developer building performant web applications and scalable systems. Check out my projects, blog, and technical documentation.',
        no_index: false,
      },
    }});
    console.log('[ok] homepage updated');
  } else {
    await entityService.create('api::homepage.homepage', { data: {
      hero: {
        name: 'Hirak',
        title: 'Full-Stack Developer & Engineer',
        positioningStatement: 'I build performant web applications, design scalable systems, and write about software engineering. Currently building CloudPulse, an infrastructure monitoring platform.',
        availability_status: 'open',
        social_links: [
          { platform: 'github', url: 'https://github.com/hirak' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/hirak' },
          { platform: 'twitter', url: 'https://twitter.com/hirak' },
        ],
        cta_buttons: [
          { text: 'View My Work', url: '/projects', variant: 'primary' },
          { text: 'Read Blog', url: '/blog', variant: 'secondary' },
          { text: 'Get in Touch', url: '/contact', variant: 'outline' },
        ],
      },
      about: {
        title: 'About Me',
        content: multiP(
          'I\'m a full-stack developer with 6+ years of experience building web applications that scale. My journey started with curiosity about how websites work, and evolved into a career crafting architectures, APIs, and user interfaces.',
          'I specialize in the JavaScript/TypeScript ecosystem — React, Next.js, and Node.js — but I\'m equally comfortable with infrastructure (Docker, AWS, CI/CD) and databases (PostgreSQL, Redis). I believe the best engineers understand the full stack, not just their favorite layer.',
          'When I\'m not coding, you\'ll find me writing technical articles, contributing to open source, or exploring the latest in system design. I\'m passionate about developer experience and building tools that make other developers more productive.',
          'Currently available for consulting and full-time opportunities. Based in San Francisco, CA.',
        ),
      },
      featuredProjects: {
        title: 'Featured Projects',
        projects: { connect: projects.slice(0, 3).map(p => ({ id: p.id })) },
      },
      skills: { title: 'Skills & Technologies' },
      experience: { title: 'Experience' },
      latestArticles: { title: 'Latest Articles', count: 3 },
      contactCta: {
        title: 'Let\'s Work Together',
        description: 'Have a project in mind or just want to chat? I\'m always open to discussing new opportunities, collaborations, or interesting ideas.',
        button_label: 'Get in Touch',
        button_url: '/contact',
      },
      seo: {
        meta_title: 'Hirak - Full-Stack Developer Portfolio',
        meta_description: 'Full-stack developer building performant web applications and scalable systems. Check out my projects, blog, and technical documentation.',
        no_index: false,
      },
    }});
    console.log('[ok] homepage created');
    count++;
  }

  // ============================================================
  // 10. SITE SETTING (single type)
  // ============================================================
  const existingSettings = await entityService.findMany('api::site-setting.site-setting').then(r => r[0] || null);
  if (existingSettings) {
    console.log('[skip] site-setting already exists');
    await entityService.update('api::site-setting.site-setting', existingSettings.id, { data: {
      site_name: 'Hirak Portfolio',
      site_description: 'Full-stack developer portfolio showcasing projects, technical writing, and documentation.',
      social_links: [
        { platform: 'github', url: 'https://github.com/hirak' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/hirak' },
        { platform: 'twitter', url: 'https://twitter.com/hirak' },
      ],
    }});
  } else {
    await entityService.create('api::site-setting.site-setting', { data: {
      site_name: 'Hirak Portfolio',
      site_description: 'Full-stack developer portfolio showcasing projects, technical writing, and documentation.',
      social_links: [
        { platform: 'github', url: 'https://github.com/hirak' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/hirak' },
        { platform: 'twitter', url: 'https://twitter.com/hirak' },
      ],
    }});
    console.log('[ok] site-setting created');
    count++;
  }

  // ============================================================
  // 11. NAVIGATION (single type)
  // ============================================================
  const existingNav = await entityService.findMany('api::navigation.navigation').then(r => r[0] || null);
  const navItems = [
    { title: 'Home', url: '/', order: 0 },
    { title: 'Projects', url: '/projects', order: 1 },
    { title: 'Blog', url: '/blog', order: 2 },
    { title: 'Docs', url: '/docs', order: 3 },
  ];
  if (existingNav) {
    console.log('[skip] navigation already exists');
    await entityService.update('api::navigation.navigation', existingNav.id, { data: { items: navItems } });
  } else {
    await entityService.create('api::navigation.navigation', { data: { items: navItems } });
    console.log('[ok] navigation created');
    count++;
  }

  return count;
}

seed()
  .then((count) => {
    console.log(`\nSeed complete! ${count} new items created.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
