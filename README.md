# Vanilla SaaS Dashboard

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://mehdi-dev-sudo.github.io/vanilla-saas-dashboard/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-34%20passing-success.svg)](__tests__/)

A production-grade analytics dashboard built with **vanilla TypeScript** — no frameworks, no runtime libraries. Features real API data, PWA support, Canvas charts, command palette, comprehensive testing, and an esbuild-powered build pipeline.

---

> **Live Demo:** [https://mehdi-dev-sudo.github.io/vanilla-saas-dashboard/](https://mehdi-dev-sudo.github.io/vanilla-saas-dashboard/)

---

## Performance

- **Zero production dependencies** — no frameworks, no runtime libraries, no bloat
- **esbuild build pipeline** — sub-second incremental builds, TypeScript type-stripping compilation
- **Debounced resize/search** — 250ms / 300ms debounce prevents layout thrashing
- **requestAnimationFrame** — all animations, FPS counter, and chart rendering use rAF
- **Canvas HiDPI** — Retina-aware charts via `devicePixelRatio` scaling
- **Page Visibility API** — background intervals are paused when tab is hidden
- **Memory-safe** — animation frame IDs tracked and cleaned; error log capped at 20 entries
- **Service Worker** — cache-first with old-cache fallback, network-first for HTML, offline fallback

---

## Features

| # | Feature | Status |
|---|---------|--------|
| 1 | **Command Palette** — VS Code-style (Ctrl+K) with fuzzy search, `>` action commands, and keyword search | ✅ |
| 2 | **Real HTTP API Layer** — Fetch from `dummyjson.com` with caching, retry, timeout, offline fallback | ✅ |
| 3 | **Real-Time Charts** — Revenue and user growth charts update every 5 seconds with smooth animation | ✅ |
| 4 | **Developer Console** — Ctrl+Shift+D shows FPS, memory, DOM nodes, storage, route, theme, API status | ✅ |
| 5 | **PWA Support** — Service worker caching, installable via manifest, apple-mobile-web-app meta | ✅ |
| 6 | **Undo/Redo** — Ctrl+Z / Ctrl+Shift+Z for all user CRUD operations | ✅ |
| 7 | **Full Keyboard Navigation** — Arrow keys, Tab, Enter, Escape, Goto shortcuts (G+D, G+U, G+T, G+S) | ✅ |
| 8 | **Fake Authentication** — Login page, session storage, Remember Me, protected routes | ✅ |
| 9 | **Enhanced Settings** — 18 options: theme, language, density, accent color, animations, reduced motion, date format, currency, default page, sidebar behavior, notifications | ✅ |
| 10 | **Widget Dashboard** — Drag-to-reorder, show/hide widgets, persisted layout | ✅ |
| 11 | **Activity Log** — Tracks all user actions with timestamps (100-entry ring buffer) | ✅ |
| 12 | **On-Device Persistence** — All state, activity, settings, and preferences saved to localStorage | ✅ |
| 13 | **Empty States** — Contextual empty state with illustration and call-to-action buttons | ✅ |
| 14 | **Error Pages** — 404, 500, Network Error with navigation actions | ✅ |
| 15 | **Loading Skeletons** — Pulse-animated placeholders for cards, tables, charts | ✅ |
| 16 | **Multi-Select** — Checkbox selection with batch delete and export | ✅ |
| 17 | **Toast Notifications** — Auto-dismiss with progress bar, 4 types, stacked positioning | ✅ |
| 18 | **Chart Download** — Export charts as PNG images | ✅ |
| 19 | **Live Clock & Online Counter** — Real-time header indicators with pulse animation | ✅ |
| 20 | **Notification Panel** — Dropdown notification center with mock alerts | ✅ |
| 21 | **Page Transitions** — Smooth fade-in animation on route changes | ✅ |
| 22 | **Copy to Clipboard** — Click invoice numbers to copy | ✅ |
| 23 | **Print Styles** — Optimized print layout for reports | ✅ |
| 24 | **Search Count** — Result count with query display in tables | ✅ |
| 25 | **Custom Context Menu** — Right-click on table rows (Edit, Delete, Copy, Duplicate) | ✅ |
| 26 | **Keyboard Shortcuts Help** — Ctrl+/ reference modal | ✅ |
| 27 | **i18n / RTL** — Internationalization system with EN/FA, locale-aware dates, numbers, currency | ✅ |
| 28 | **Real Export** — Downloadable reports (dashboard .txt, analytics .csv, settings .json) with import | ✅ |
| 29 | **TypeScript + esbuild** — Full TypeScript migration, global type declarations, sub-second esbuild builds | ✅ |
| 30 | **UI/UX Overhaul** — Spring animations, refined shadows, press effects, shimmer skeletons, polished hover states | ✅ |

---

## Architecture

```
vanilla-saas-dashboard/
├── index.html                    # Single HTML entry → references dist/
├── manifest.json                 # PWA manifest for installable app
├── sw.js                         # Service worker for offline caching
├── package.json                  # Project metadata + test + build configuration
├── jest.config.js                # Jest test runner configuration
├── tsconfig.json                 # TypeScript configuration
├── build.mjs                     # esbuild build script (node build.mjs)
├── __tests__/                    # 34 Jest tests for utilities and data layer
├── css/
│   └── main.css                  # 1400+ line design system (ITCSS + BEM)
├── js/                           # TypeScript source files
│   ├── types/
│   │   └── globals.d.ts          # Global type declarations for all modules
│   ├── i18n/
│   │   ├── i18n.ts               # Translation engine with locale switching
│   │   └── translations.ts       # EN + FA dictionaries (~340 keys each)
│   ├── app.ts                    # Application bootstrap & module integration
│   ├── core/
│   │   ├── router.ts             # Hash-based SPA router with auth guards
│   │   ├── utils.ts              # Formatters, animators, debounce, SafeStorage
│   │   ├── export.ts             # Export manager (CSV, JSON, .txt report)
│   │   └── pluginSystem.ts       # Plugin registration & hook system
│   ├── data/
│   │   ├── api.ts                # HTTP client: fetch, retry, cache, offline fallback
│   │   ├── data.ts               # State management with localStorage persistence
│   │   ├── history.ts            # Undo/redo stack with snapshot system
│   │   └── activity.ts           # User action logging (100-entry ring buffer)
│   ├── components/
│   │   ├── charts.ts             # Canvas 2D chart engine (line, bar, donut)
│   │   ├── commandPalette.ts     # Fuzzy-search command palette (Ctrl+K)
│   │   ├── devConsole.ts         # Developer console (Ctrl+Shift+D)
│   │   ├── modal.ts              # Modal dialog system (confirm, form)
│   │   ├── toast.ts              # Notification system (4 types)
│   │   ├── sidebar.ts            # Collapsible sidebar + mobile drawer
│   │   ├── theme.ts              # Dark/light mode with system detection
│   │   ├── auth.ts               # Authentication & session management
│   │   ├── contextMenu.ts        # Right-click contextual menu
│   │   ├── skeleton.ts           # Loading skeleton generators
│   │   ├── animations.ts         # Spring physics, FLIP, View Transition polyfill
│   │   └── virtualScroll.ts      # Virtual scrolling for large lists
│   ├── pages/
│   │   ├── dashboard.ts          # Widget dashboard with drag-reorder + real-time charts
│   │   ├── analytics.ts          # Analytics page with multi-chart views
│   │   ├── users.ts              # User CRUD with multi-select & batch ops
│   │   ├── transactions.ts       # Transaction table with filtering & pagination
│   │   ├── settings.ts           # Settings with 18 customizable options
│   │   ├── support.ts            # FAQ accordion & contact form
│   │   └── error.ts              # 404/500/Network error pages
│   └── plugins/
│       └── perfMonitor.ts        # FPS, memory, DOM node monitoring
├── dist/                         # esbuild build output (gitignored)
│   ├── index.html                # Copied from root
│   ├── css/main.css              # Copied from css/
│   ├── sw.js                     # Copied from root
│   └── js/                       # Compiled .js files (one per source .ts)
├── plugins/
│   └── README.md                 # Plugin development guide
├── .github/                      # Issue templates, PR template, community health
├── CHANGELOG.md, CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md
└── LICENSE (MIT)
```

### Data Flow

```
User Action → Component → AppStore.updateState()
                             ├── localStorage write
                             ├── Notify subscribers (UI re-render)
                             └── History.pushState() snapshot
```

### API Layer

```
ApiClient.fetch(url)
  ├── Check localStorage cache (5 min TTL)
  │     └── Cache hit → return cached
  ├── fetch() with AbortController (10s timeout)
  │     ├── Success → cache response → return data
  │     ├── Failure → retry (max 2, exponential backoff)
  │     │     └── All retries failed → fallback to mock data
  │     └── Offline → return mock data immediately
  └── Emit online/offline status events
```

---

## Design Decisions

### State Management
- Singleton store with subscriber/notifier pattern
- localStorage for persistence (JSON serialization)
- Undo/redo via full state snapshots (max 50)
- Separate activity log (100-entry ring buffer)

### CSS Architecture
- **ITCSS** — global settings → elements → objects → components → overrides
- **BEM** naming — predictable, maintainable class names
- **Custom Properties** — 100+ design tokens for full theming
- **No preprocessors** — native CSS Variables + calc() + min()/max()

### Chart Engine
- Canvas 2D API — no external charting libraries
- HiDPI/Retina support via `devicePixelRatio` scaling
- Animated drawing with cubic bezier easing
- Smooth curve interpolation using quadratic bezier
- Real-time updates via `requestAnimationFrame` + `Math.sin()` oscillation

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open Command Palette |
| `Ctrl+/` | Keyboard Shortcuts Help |
| `Ctrl+Z` | Undo last action |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo last action |
| `Ctrl+S` | Quick save |
| `Ctrl+Shift+D` | Developer Console |
| `Escape` | Close modals, command palette, context menu |
| `Arrow Up/Down` | Navigate command palette results |
| `Enter` | Select command palette item / Edit selected table row |
| `Tab` | Auto-complete command palette |
| `G` then `D` | Go to Dashboard |
| `G` then `U` | Go to Users |
| `G` then `T` | Go to Transactions |
| `G` then `S` | Go to Settings |

### Command Palette Actions

| Action | Shortcut Keywords |
|--------|-------------------|
| Go to Dashboard | `gd`, `dashboard`, `home` |
| Go to Users | `gu`, `users`, `people` |
| Go to Transactions | `gt`, `tx`, `transactions`, `payments` |
| Go to Settings | `gs`, `settings`, `preferences` |
| Create User | `new user`, `create`, `add user` |
| Delete User | `delete user`, `remove user` |
| Export CSV | `export`, `csv`, `download` |
| Reload Data | `reload`, `refresh`, `reset` |
| Toggle Theme | `theme`, `dark`, `light`, `mode` |
| Keyboard Shortcuts | `keys`, `shortcuts`, `help` |
| Logout | `logout`, `sign out`, `exit` |

---

## Accessibility

- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<header>`, `<aside>`)
- ARIA attributes on all interactive elements (`aria-checked`, `aria-modal`, `aria-live`)
- Full keyboard navigation — every feature accessible without a mouse
- Focus management: focus trapping in modals, focus restoration on close
- Screen reader support via `aria-live` regions for dynamic content
- WCAG AA color contrast in both light and dark themes
- `:focus-visible` for keyboard-only focus indicators
- `prefers-reduced-motion` support to disable animations
- Configurable Reduced Motion setting in preferences
- Print stylesheet for report-friendly output

---

## Performance Optimizations

| Technique | Location |
|-----------|----------|
| Debounced resize handler | `ChartEngine.resize` — 250ms debounce |
| Debounced search input | `UsersPage` — 300ms debounce |
| `requestAnimationFrame` animations | Charts, stat counters, FPS monitor |
| Canvas HiDPI scaling | `ChartEngine.setupCanvas` |
| Virtual scroll for large datasets | `VirtualScroll.createTable` |
| Skeleton loading during transitions | Router page loader |
| CSS containment | `content-visibility: auto;` on scrollable areas |
| localStorage batching | Single save call per mutation via `SafeStorage` |
| Animation frame cleanup | All RAF IDs tracked and cancelled on unmount |
| Lazy module initialization | Components self-register on first use |
| esbuild build pipeline | Sub-second incremental builds, TypeScript type-stripping |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Mehdi-dev-sudo/vanilla-saas-dashboard.git

# Install dependencies (TypeScript, esbuild, Jest)
cd vanilla-saas-dashboard
npm install

# Build the project (compiles TypeScript → dist/)
npm run build

# Open in browser
start dist/index.html

# Development — watch mode with auto-rebuild
npm run watch

# Run tests
npm test

# Type-check (optional — strict mode w/ 200+ known issues)
npm run typecheck
```

**Demo Credentials:**
- Username: any value (e.g., `admin`)
- Password: any value (3+ characters)

---

## Screenshots

> *Screenshots coming soon. Open `index.html` in your browser to see the dashboard in action.*

<!--
![Dashboard Dark Mode](screenshots/dashboard-dark.png)
![Dashboard Light Mode](screenshots/dashboard-light.png)
![Command Palette](screenshots/command-palette.png)
![Developer Console](screenshots/dev-console.png)
-->

---

## Roadmap

| Quarter | Planned Features |
|---------|-----------------|
| ✅ | **Plugin System** — hot-loadable plugins from `plugins/` directory |
| ✅ | **Performance Monitor** — dedicated panel for FPS, memory, DOM tracking |
| ✅ | **FLIP Animations** — smooth list reordering with FLIP technique |
| ✅ | **View Transition API** — cross-document view transitions with fallback |
| ✅ | **Spring Animations** — spring-based physics for micro-interactions |
| ✅ | **TypeScript Migration** — 31 source files migrated, esbuild pipeline, global types |
| ✅ | **UI/UX Overhaul** — spring curves, elevated shadows, press effects, shimmer skeletons |
| Q1 2027 | **End-to-End Tests** — Playwright or Cypress for critical user flows |
| Q1 2027 | **Theme Builder** — Custom accent color picker with preview |
| Q1 2027 | **Strict TypeScript** — Resolve 200+ strict-mode type errors for full type safety |

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

Canvas `roundRect()` requires Chrome 99+, Firefox 112+, Safari 15.4+.

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) first.

Key contribution areas:
- **i18n**: Add translations for the language selector
- **Themes**: More accent color presets
- **Widgets**: New dashboard widget types
- **Plugins**: Build extensions using the plugin system
- **Performance**: Further optimizations for 10K+ row datasets

---

## License

This project is [MIT licensed](LICENSE). Use it for any purpose, personal or commercial.

---

## Author

**Mehdi Khorshidi far** — Crafted with care for product teams who appreciate clean, performant interfaces.
