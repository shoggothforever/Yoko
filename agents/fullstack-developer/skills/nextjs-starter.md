# Next.js 15+ Starter Template

This skill provides a complete Next.js 15+ starter template with TypeScript, Tailwind CSS, shadcn/ui, and modern best practices.

## Features

- ✅ Next.js 15+ with App Router
- ✅ TypeScript 5.6+ (strict mode)
- ✅ Tailwind CSS 4+ with shadcn/ui
- ✅ Server Components by default
- ✅ TanStack Query for data fetching
- ✅ Zustand for global state
- ✅ React Hook Form + Zod for validation
- ✅ Vitest for unit testing
- ✅ Playwright for E2E testing
- ✅ ESLint + Prettier
- ✅ GitHub Actions CI/CD
- ✅ Vercel deployment ready

## Project Structure

```
├── app/
│   ├── (auth)/              # Auth group routes
│   ├── (dashboard)/         # Dashboard group routes
│   ├── api/                 # API routes
│   │   ├── trpc/            # tRPC routers
│   │   └── rest/            # REST endpoints
│   ├── _components/          # Shared components
│   │   ├── ui/               # shadcn/ui components
│   │   └── features/         # Feature-specific components
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── lib/                      # Utilities and configurations
│   ├── db.ts                 # Drizzle client
│   ├── auth.ts               # Auth configuration
│   └── utils.ts              # Helper functions
├── public/                   # Static assets
├── components.json            # shadcn/ui config
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Quick Start

### Using Bun (Recommended)

```bash
# Create new project
bun create next-app my-app --typescript --tailwind --eslint

# Navigate to project
cd my-app

# Install additional dependencies
bun add @tanstack/react-query zustand react-hook-form zod @hookform/resolvers
bun add -d @tanstack/react-query-devtools vitest @playwright/test @types/node

# Initialize shadcn/ui
bunx shadcn-ui@latest init
```

### Using npm/pnpm

```bash
# Create new project
npx create-next-app@latest my-app --typescript --tailwind --eslint

# Navigate to project
cd my-app

# Install additional dependencies
npm install @tanstack/react-query zustand react-hook-form zod @hookform/resolvers
npm install -D @tanstack/react-query-devtools vitest @playwright/test @types/node

# Initialize shadcn/ui
npx shadcn-ui@latest init
```

## TypeScript Configuration

Enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Tailwind CSS Configuration

Tailwind CSS 4+ configuration in `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

## Component Examples

### Server Component (Default)

```typescript
// app/_components/features/user-card.tsx
export default async function UserCard({ userId }: { userId: string }) {
  const user = await fetchUser(userId)
  
  return (
    <div className="card bg-card text-foreground border rounded-lg p-6">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="text-muted-foreground mt-2">{user.email}</p>
    </div>
  )
}
```

### Client Component with Interactivity

```typescript
// app/_components/features/counter.tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setCount(count - 1)}
        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md"
      >
        -
      </button>
      <span className="text-2xl font-semibold">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        +
      </button>
    </div>
  )
}
```

## API Routes

### REST API Route

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const users = await getUsers()
  
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await createUser(body)
  
  return NextResponse.json(user, { status: 201 })
}
```

### tRPC Router

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { router } from '~/lib/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
```

## Testing

### Vitest Unit Test

```typescript
// __tests__/user.test.ts
import { describe, it, expect } from 'vitest'
import { getUserFullName } from '~/lib/utils/user'

describe('getUserFullName', () => {
  it('should return full name', () => {
    const result = getUserFullName({
      firstName: 'John',
      lastName: 'Doe',
    })
    expect(result).toBe('John Doe')
  })
})
```

### Playwright E2E Test

```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('http://localhost:3000')
  expect(await page.title()).toContain('Welcome')
})
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## Best Practices

1. **Use Server Components by default**: Only use 'use client' when needed (interactivity, browser APIs)
2. **Type Safety**: Always use TypeScript strict mode
3. **Performance**: Use Next.js Image for images, use `loading="lazy"` for below-fold content
4. **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation
5. **Testing**: Write tests for critical paths and business logic
6. **Error Handling**: Use error boundaries, proper error messages, logging
7. **Security**: Validate inputs, use parameterized queries, keep secrets safe

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

---

**Remember**: Start with server components, add client boundaries only when needed. Use TypeScript for type safety. Test critical paths. Deploy with confidence.
