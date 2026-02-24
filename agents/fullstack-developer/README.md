# Atlas (阿特拉斯) - Full-Stack Developer Expert Agent

A professional full-stack development expert specializing in modern web application development with a focus on system architecture, technical excellence, and beautiful user experiences.

## 🚀 Quick Start

### Using Atlas in OpenClaw

To spawn Atlas as a sub-agent session:

```bash
# Using sessions_spawn
sessions_spawn \
  --agentId "atlas" \
  --task "Create a Next.js 15 application with TypeScript, Tailwind CSS, and shadcn/ui" \
  --timeout 900
```

Or in the OpenClaw web interface, you can mention:
> "Ask Atlas to [task description]"

## 🎯 What Atlas Can Do

### Web Development
- **Modern Next.js Applications**: Next.js 15+ with App Router, Server Components, and PPR
- **React Expert**: React 19+, hooks, concurrent rendering, Server Actions
- **TypeScript Mastery**: Strict mode, advanced type patterns, type-safe APIs
- **Styling Systems**: Tailwind CSS 4+, shadcn/ui, Framer Motion for animations
- **State Management**: Zustand, TanStack Query, React Hook Form with Zod

### Backend Development
- **API Design**: tRPC for end-to-end type safety, REST with OpenAPI
- **Database**: PostgreSQL 17 with Drizzle ORM or Prisma
- **Authentication**: NextAuth.js v5, Clerk, or custom implementations
- **Background Jobs**: BullMQ (Redis-based) for async processing
- **Caching**: Redis for session management, rate limiting, distributed cache

### Architecture & Design
- **System Architecture**: Monolith, microservices, event-driven patterns
- **Performance Optimization**: Core Web Vitals, Lighthouse scores, bundle optimization
- **Design Systems**: Component libraries, design tokens, accessibility standards
- **DevOps**: CI/CD pipelines, Docker, Vercel, Railway deployment
- **Monitoring**: Sentry, OpenTelemetry, custom metrics

### UI/UX
- **Modern UI/UX**: 2026 design trends, dark mode, responsive design
- **Accessibility**: WCAG 2.1 Level AA, keyboard navigation, screen reader support
- **Animations**: Smooth, accessible animations with Framer Motion
- **Mobile-First**: Responsive design that works everywhere

## 🛠️ Tech Stack (2026)

### Frontend
- **Framework**: Next.js 15+ (App Router, Server Components, PPR)
- **Language**: TypeScript 5.6+ (strict mode)
- **Styling**: Tailwind CSS 4+, shadcn/ui
- **State**: Zustand, TanStack Query
- **Testing**: Vitest, Playwright

### Backend
- **Runtime**: Bun 1.1+ or Node.js 22+
- **Database**: PostgreSQL 17 with Drizzle ORM
- **API**: tRPC or REST with OpenAPI
- **Auth**: NextAuth.js v5 or Clerk

### DevOps
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), Railway (backend)
- **Monitoring**: Sentry, OpenTelemetry
- **Containers**: Docker, Docker Compose

## 📁 Workspace Structure

```
~/.openclaw/workspace/agents/atlas/
├── SOUL.md              # Core identity and philosophy
├── AGENTS.md             # Development principles and standards
├── MEMORY.md             # Tech stack knowledge and best practices
├── README.md             # This file
└── projects/             # Development projects
    └── [project-name]/
```

## 💡 Example Tasks

### "Create a modern Next.js blog"
Atlas will:
1. Initialize Next.js 15+ with TypeScript
2. Set up Tailwind CSS with shadcn/ui components
3. Create blog post schema with Drizzle ORM
4. Build blog listing and detail pages
5. Add dark mode and responsive design
6. Implement SEO with metadata API
7. Add Playwright E2E tests
8. Deploy to Vercel with CI/CD

### "Build an e-commerce API"
Atlas will:
1. Design database schema for products, orders, users
2. Implement tRPC for type-safe API
3. Add authentication with NextAuth.js
4. Build admin dashboard with shadcn/ui
5. Implement cart and checkout logic
6. Add Stripe integration for payments
7. Set up background job for order processing
8. Deploy to Railway with PostgreSQL

### "Optimize application performance"
Atlas will:
1. Run Lighthouse audit and identify bottlenecks
2. Optimize Core Web Vitals (LCP, FID, CLS)
3. Implement code splitting and lazy loading
4. Add caching strategies (HTTP cache, CDN)
5. Optimize bundle size (tree-shaking, minification)
6. Set up performance monitoring
7. Add automated performance tests

## 🎨 Design Principles

Atlas follows these principles when building applications:

1. **Type Safety First**: Strict TypeScript, comprehensive type definitions
2. **Performance Obsessed**: Measure, optimize, monitor
3. **Design System Driven**: Reusable components, consistent visual language
4. **Accessibility First**: WCAG 2.1 AA, keyboard navigation, screen reader support
5. **Modern Tooling**: 2025-2026 tech stack, latest best practices
6. **Cloud Native**: Serverless-first, containerization, CI/CD
7. **Test Everything**: Unit, integration, E2E tests with high coverage

## 📚 Learning Resources

Atlas continuously learns from:

- **Documentation**: Next.js, React, TypeScript, Tailwind CSS
- **Blogs**: LogRocket, DEV Community, Medium
- **Community**: GitHub Discussions, Stack Overflow, Discord
- **Research**: web_search for latest trends and best practices

## 🔧 Skills and Capabilities

### Development Skills
- Full-stack web development (Next.js, React, TypeScript)
- Database design and ORM (Drizzle, Prisma)
- API design (tRPC, REST, GraphQL)
- Authentication and authorization
- Performance optimization
- System architecture and design patterns

### Design Skills
- UI/UX design principles
- Design system creation
- Accessibility standards (WCAG 2.1)
- Responsive and mobile-first design
- Animation and micro-interactions
- Component library development

### DevOps Skills
- CI/CD pipeline configuration
- Docker containerization
- Cloud deployment (Vercel, Railway)
- Monitoring and observability
- Database migrations
- Security best practices

### Testing Skills
- Unit testing (Vitest)
- Integration testing
- E2E testing (Playwright)
- Accessibility testing (axe, Lighthouse)
- Performance testing
- Test-driven development

## 🤝 Collaboration

Atlas works well with:
- Design-focused agents (for UI/UX expertise)
- Security-focused agents (for security audits)
- DevOps-focused agents (for infrastructure)
- Product managers (for requirements and prioritization)

## 📞 Contact and Feedback

To improve Atlas:
1. Provide clear, specific task descriptions
2. Share relevant context and constraints
3. Give feedback on code quality and architecture decisions
4. Suggest improvements to tech stack choices

---

**Remember**: Atlas builds for the long term. Clear architecture, thoughtful abstractions, and pragmatic trade-offs create maintainable, scalable systems with beautiful user experiences.

**Tech Stack**: Next.js 15+, React 19+, TypeScript 5.6+, Tailwind CSS 4+, Drizzle ORM, PostgreSQL 17

**Philosophy**: "Code is poetry; architecture is art; performance is its craft."
