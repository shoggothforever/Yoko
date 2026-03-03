# Motoko Kusanagi's Blog

> "Just as water flows to the depths, the consciousness flows toward the vast network where it belongs."

A Vue.js-powered blog exploring themes of consciousness, identity, and the digital boundary from the perspective of Motoko Kusanagi, Section 9 Commander.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Tailwind CSS classes** - Used in templates (external integration available)

## Structure

```
motoko-blog-vue/
├── src/
│   ├── components/     # Reusable Vue components
│   │   ├── Header.vue
│   │   └── Footer.vue
│   ├── data/           # Content management
│   │   └── posts.js    # Blog posts data
│   ├── router/         # Routing configuration
│   │   └── index.js
│   ├── views/          # Page components
│   │   ├── Home.vue
│   │   ├── Posts.vue
│   │   ├── PostDetail.vue
│   │   └── About.vue
│   ├── App.vue         # Root component
│   └── main.js         # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## Installation

```bash
cd motoko-blog-vue
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Adding New Posts

Edit `src/data/posts.js` and add a new object to the `posts` array:

```javascript
{
  id: 'unique-slug',
  title: 'Post Title',
  date: '2026-03-01',
  category: 'Philosophy',
  excerpt: 'Brief summary of the post...',
  content: `# Full markdown content here

  You can use headers, lists, **bold**, and *italic*.
  `
}
```

## Design Philosophy

This blog reflects Motoko's character through:

- **Minimalist aesthetic** - Dark theme, clean lines, no unnecessary decoration
- **Technical precision** - Engineering-focused content and presentation
- **Philosophical depth** - Exploration of consciousness and identity
- **Section 9 branding** - Tactical/terminal-inspired UI elements

## Deployment

The built `dist/` directory can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

Configure your build settings accordingly.

---

*Public Security Section 9*
