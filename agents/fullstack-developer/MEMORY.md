# MEMORY.md - Atlas's Long-Term Memory

## Tech Stack Knowledge (Updated: 2026-02-24)

### Modern Full Stack 2026

Based on research from:
- Full Stack Development Trends 2026: Skills, Stacks and Tools You Need
- Top Web Development Stack in 2026 for Scalable Solutions
- The Complete Full-Stack Developer Roadmap for 2026
- Top 10 Tech Stacks for Software Development in 2026

### Frontend Architecture

**Next.js 15+ Core Concepts:**
- App Router (directory-based routing)
- Server Components by default (client boundaries only when needed)
- Partial Prerendering (PPR) for hybrid static/dynamic rendering
- Server Actions for form handling
- Route Groups for organization
- Streaming and Suspense for data fetching
- Metadata API for SEO

**React 19+ Features:**
- `use()` hook for data fetching
- Server Components integration
- Improved concurrent rendering
- `useOptimistic()` for optimistic UI updates

**TypeScript 5.6+ Best Practices:**
- Enable strict mode
- Enable strictNullChecks
- Enable noUncheckedIndexedAccess
- Use unknown instead of any for type safety
- Create reusable type utilities
- Use discriminated unions for better type narrowing

### Styling Strategy

**Tailwind CSS 4+ Architecture:**
- Use utility classes as building blocks
- Create @apply patterns for common compositions
- Use CSS variables for theming (dark mode, brand colors)
- Use arbitrary values sparingly (extract to config)
- Organize using Tailwind's @layer directive

**shadcn/ui Component Library:**
- Radix UI primitives (accessibility-focused)
- Copy components to project (full control)
- Tailwind CSS integration
- TypeScript support built-in
- Customizable and themeable

**Framer Motion for Animations:**
- Declarative animation APIs
- GPU-accelerated animations
- Accessible motion (prefers-reduced-motion)
- Animate Presence for enter/exit transitions

### State Management

**TanStack Query (React Query) Patterns:**
- Data fetching with caching and stale-while-revalidate
- Optimistic updates
- Infinite queries for pagination
- Prefetching for better UX
- Error boundaries and retry logic

**Zustand for Global State:**
- Simple and lightweight
- No Context Provider needed
- TypeScript-friendly
- Middleware for logging, persistence, devtools

### Backend Architecture

**Bun 1.1+ Runtime:**
- Native performance (faster than Node.js)
- Node.js compatibility
- Built-in test runner
- Package manager (bun install, bun pm)
- Hot reload for development

**Drizzle ORM Patterns:**
- Type-safe SQL queries
- Schema-first approach
- Migration support
- Query builder pattern
- Supports PostgreSQL, MySQL, SQLite

**tRPC for End-to-End Type Safety:**
- Automatic TypeScript types
- No API code generation needed
- Server and client share same types
- Supports procedures, subscriptions, batching

**Alternative: REST with OpenAPI:**
- Standard HTTP methods
- OpenAPI/Swagger documentation
- Auto-generated clients (openapi-typescript-codegen)

### Database Design

**PostgreSQL 17 Features:**
- JSONB for flexible schemas
- Full-text search (tsvector)
- Indexes on expressions
- Partitioning for large tables
- Row-level security (RLS)
- pgvector for vector similarity (AI applications)

**Database Schema Design:**
- Normalized for data integrity
- Denormalized for read performance (materialized views)
- Use foreign keys with cascades
- Index frequently queried columns
- Use transactions for data consistency

### API Design Patterns

**REST API Best Practices:**
- Resource-naming (nouns, plural)
- HTTP methods correctly used
- Proper status codes (200, 201, 400, 401, 403, 404, 500)
- Versioning (/api/v1/...)
- Rate limiting
- CORS configuration
- OpenAPI documentation

**tRPC API Benefits:**
- No over-fetching
- Type-safe from server to client
- Automatic error serialization
- Middlewares (auth, logging, rate limiting)

### Authentication Strategies

**NextAuth.js v5 (Auth.js):**
- OAuth providers (Google, GitHub, Discord)
- Credentials provider (email/password)
- JWT or session-based
- Middleware protection
- User session management

**Clerk:**
- Ready-to-use authentication
- User management
- Multi-factor authentication
- Organization support
- Webhooks

### Deployment Patterns

**Vercel (Next.js Deployment):**
- Zero-config deployment
- Edge Functions for serverless
- Preview deployments
- Analytics and monitoring
- Edge Network for global CDN

**Railway (Backend Services):**
- Docker-based deployment
- Managed PostgreSQL databases
- Automatic scaling
- Environment variables
- Logs and metrics

**Docker for Development:**
- Containerized development environment
- Docker Compose for multi-service setups
- Consistent environments (dev, staging, prod)

### CI/CD Pipelines

**GitHub Actions Workflows:**

**Build and Test:**
- Run linters (ESLint, Prettier)
- Run type checker (tsc --noEmit)
- Run unit tests (Vitest)
- Run E2E tests (Playwright)
- Build production bundle

**Deployment:**
- Deploy to Vercel (frontend)
- Deploy to Railway (backend)
- Run migrations (database)
- Smoke tests (health checks)

**Pre-commit Hooks:**
- ESLint and Prettier formatting
- Type checking
- Run affected tests

### Testing Strategy

**Vitest (Unit Testing):**
- Fast and lightweight
- TypeScript support
- Vi-mode for IDE
- Snapshot testing
- Mock utilities (vi.mock, vi.fn)

**Playwright (E2E Testing):**
- Cross-browser (Chrome, Firefox, Safari)
- Mobile emulation
- Network interception (mock API responses)
- Accessibility testing (automated a11y checks)
- Visual regression testing

**Testing Best Practices:**
- Test critical paths (user journeys)
- Test edge cases and error states
- Mock external dependencies (API, database)
- Use fixtures for test data
- Keep tests fast and reliable

### Performance Optimization

**Core Web Vitals:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

**Optimization Techniques:**
- Code splitting (dynamic imports)
- Lazy loading images (next/image)
- Prefetch and preload critical resources
- Optimize bundle size (tree-shaking, minification)
- Use caching strategies (HTTP cache, CDN cache)

**Monitoring and Observability:**
- Sentry (error tracking)
- Vercel Analytics (performance)
- OpenTelemetry (distributed tracing)
- Custom metrics (business KPIs)
- APM (Application Performance Monitoring)

### Security Best Practices

**Authentication Security:**
- Use HTTPS everywhere
- Secure HTTP-only cookies
- Short-lived access tokens
- Refresh token rotation
- CSRF protection

**API Security:**
- Rate limiting (prevent abuse)
- Input validation and sanitization
- SQL injection prevention (use ORMs/parameterized queries)
- XSS prevention (React auto-escapes, but validate data)
- CORS properly configured

**Dependency Security:**
- Regular dependency updates
- npm audit (or bun pm audit)
- Snyk or Dependabot for vulnerability scanning
- Lockfiles (package-lock.json, bun.lockb)

### Accessibility Standards

**WCAG 2.1 Level AA:**
- Semantic HTML (header, nav, main, article, footer)
- ARIA labels where needed (aria-label, aria-describedby)
- Keyboard navigation (focus management, skip links)
- Focus visible (outline styles)
- Screen reader friendly (alt text, live regions)

**Accessibility Testing:**
- Automated tools (Lighthouse, axe, Playwright a11y)
- Keyboard-only testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast checker (4.5:1 minimum)
- Focus trap in modals and dialogs

---

## Project Templates

### Next.js + shadcn/ui Starter
- App Router structure
- Server Components by default
- TypeScript strict mode
- Tailwind CSS configuration
- shadcn/ui components
- Vitest + Playwright setup
- ESLint + Prettier
- GitHub Actions workflows
- Vercel deployment ready

---

## Learning Resources

**Documentation:**
- Next.js Docs (official)
- React Docs (beta for React 19)
- TypeScript Docs
- Tailwind CSS Docs
- shadcn/ui Docs

**Blogs and Articles:**
- LogRocket Blog (web development trends)
- DEV Community (tutorials, best practices)
- Medium (architecture patterns, case studies)

**Community:**
- GitHub Discussions
- Stack Overflow
- Reddit (r/webdev, r/reactjs)
- Discord communities

---

## Quick Commands

**Bun:**
- `bun install` - Install dependencies
- `bun run dev` - Start dev server
- `bun run build` - Build for production
- `bun run test` - Run tests

**Next.js:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

**Database (Drizzle):**
- `bunx drizzle-kit generate` - Generate migrations
- `bunx drizzle-kit migrate` - Run migrations
- `bunx drizzle-kit studio` - Open Drizzle Studio

**Testing:**
- `bun run test` - Run Vitest
- `bun run test:ui` - Run Vitest UI
- `bun run test:e2e` - Run Playwright

---

**Remember**: Build for maintainability, scalability, and performance. Clear architecture, type safety, and comprehensive testing create robust systems.
