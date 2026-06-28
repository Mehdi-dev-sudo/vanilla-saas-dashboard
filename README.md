# SaaS Dashboard

A production-grade SaaS analytics dashboard built with **zero frameworks** — just vanilla HTML, CSS, and JavaScript. Features a VS Code-inspired command palette, undo/redo system, fake authentication, widget-based dashboard, dark/light theme, Canvas-based charts, and full keyboard navigation.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](package.json)

> **Built by [Mehdi](https://github.com/mehdi)** — Crafted with passion for product teams.

---

## Features

| # | Feature | Status |
|---|---------|--------|
| 1 | **Command Palette** — VS Code-style (Ctrl+K) with fuzzy search, categories, recent history | ✅ |
| 2 | **Undo/Redo** — Ctrl+Z / Ctrl+Shift+Z for user CRUD operations | ✅ |
| 3 | **Full Keyboard Navigation** — Arrow keys, Tab, Enter, Escape, Ctrl+S | ✅ |
| 4 | **Fake Authentication** — Login page, session storage, Remember Me, protected routes | ✅ |
| 5 | **Enhanced Settings** — Theme, Language, Density, Accent Color, Animations toggle | ✅ |
| 6 | **Widget Dashboard** — Drag-to-reorder, show/hide widgets, persisted layout | ✅ |
| 7 | **Activity Log** — Tracks all user actions with timestamps (100 entries) | ✅ |
| 8 | **Loading Skeletons** — Pulse-animated placeholders for cards, tables, charts | ✅ |
| 9 | **Empty States** — Contextual empty state with call-to-action buttons | ✅ |
| 10 | **Error Pages** — 404, 500, Network Error with navigation actions | ✅ |
| 11 | **Command History** — Recent 10 commands saved in localStorage | ✅ |
| 12 | **Custom Context Menu** — Right-click on table rows (Edit, Delete, Copy, Duplicate) | ✅ |
| 13 | **Multi-Select** — Checkbox selection with batch delete and export | ✅ |
| 14 | **Dashboard Shortcuts** — Quick actions, recent users, activity feed on dashboard | ✅ |
| 15 | **Live Clock** — Real-time clock in header with auto-update | ✅ |
| 16 | **Online Counter** — Live active user indicator with pulse animation | ✅ |
| 17 | **Breadcrumbs** — Navigation breadcrumbs on sub-pages | ✅ |
| 18 | **Notification Panel** — Dropdown notification center with mock alerts | ✅ |
| 19 | **Chart Download** — Export charts as PNG images | ✅ |
| 20 | **Keyboard Help** — Ctrl+/ shortcut reference modal | ✅ |
| 21 | **Toast Progress** — Auto-dismiss toasts with countdown bar | ✅ |
| 22 | **Page Transitions** — Smooth fade-in animation on route changes | ✅ |
| 23 | **Tooltip System** — CSS-only tooltips via data-tooltip attribute | ✅ |
| 24 | **Search Count** — Result count with query display in tables | ✅ |
| 25 | **Copy to Clipboard** — Click invoice numbers to copy | ✅ |
| 26 | **Print Styles** — Optimized print layout for reports | ✅ |
| 27 | **Accessibility** — Focus-visible, aria labels, reduced motion | ✅ |
| 28 | **Performance** — Virtual scroll, debounced resize, skeleton loading | ✅ |

---

## Project Architecture

```
saas-dashboard/
├── index.html                    # Single HTML entry with semantic markup
├── css/
│   └── main.css                  # 1200+ line design system (ITCSS + BEM)
├── js/
│   ├── app.js                    # Application bootstrap & module integration
│   ├── core/
│   │   ├── router.js             # Hash-based SPA router with auth guards
│   │   └── utils.js              # Formatters, animators, debounce, HTML escape
│   ├── data/
│   │   ├── data.js               # State management with localStorage persistence
│   │   ├── history.js            # Undo/redo stack with snapshot system
│   │   └── activity.js           # User action logging (100-entry ring buffer)
│   ├── components/
│   │   ├── charts.js             # Canvas 2D chart engine (line, bar, donut)
│   │   ├── commandPalette.js     # Fuzzy-search command palette (Ctrl+K)
│   │   ├── modal.js              # Modal dialog system (confirm, form)
│   │   ├── toast.js              # Notification system (4 types)
│   │   ├── sidebar.js            # Collapsible sidebar + mobile drawer
│   │   ├── theme.js              # Dark/light mode with system detection
│   │   ├── auth.js               # Fake authentication & session management
│   │   ├── contextMenu.js        # Right-click contextual menu
│   │   ├── skeleton.js           # Loading skeleton generators
│   │   └── virtualScroll.js      # Virtual scrolling for large lists
│   └── pages/
│       ├── dashboard.js          # Widget dashboard with drag-reorder
│       ├── analytics.js          # Analytics page with multi-chart views
│       ├── users.js              # User CRUD with multi-select & batch ops
│       ├── transactions.js       # Transaction table with sorting & export
│       ├── settings.js           # Settings with 12 customizable options
│       ├── support.js            # FAQ accordion & contact form
│       └── error.js              # 404/500/Network error pages
├── .github/                      # Community templates
├── CHANGELOG.md                  # Version history
├── CONTRIBUTING.md               # Contribution guidelines
├── SECURITY.md                   # Security policy
├── CODE_OF_CONDUCT.md            # Community standards
├── .editorconfig                 # Editor configuration
├── .gitattributes                # Git attributes
└── .gitignore                    # Git ignore rules
```

---

## Design Decisions

### Why Vanilla JS?
- **Zero build step** — open `index.html` in any browser and it works
- **No framework lock-in** — pure JavaScript patterns that transfer anywhere
- **Maximum performance** — no virtual DOM overhead, no bundle size
- **Educational value** — demonstrates core web platform APIs (Canvas, localStorage, Drag & Drop)

### State Management
- Singleton store pattern with observer/subscriber system
- localStorage persistence with JSON serialization
- Undo/redo via full state snapshots (max 50, kept in memory)
- Separate activity log with 100-entry ring buffer in localStorage

### CSS Architecture
- **ITCSS** (Inverted Triangle CSS) — from global settings to overrides
- **BEM** naming — predictable, maintainable class names
- **Custom Properties** — 100+ design tokens, full theming support
- **No preprocessors** — native CSS Variables + calc() + min()/max()

### Chart Engine
- Canvas 2D API — no libraries, maximum control
- HiDPI/Retina support via devicePixelRatio scaling
- Animated drawing with cubic bezier easing
- Smooth curve interpolation using quadratic bezier

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open Command Palette |
| `Ctrl+/` | Keyboard Shortcuts Help |
| `Ctrl+Z` | Undo last action |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo last action |
| `Ctrl+S` | Quick save |
| `Escape` | Close modals, command palette, context menu |
| `Arrow Up/Down` | Navigate command palette results |
| `Enter` | Select command palette item / Edit selected table row |
| `Tab` | Auto-complete command palette |
| `G` then `D` | Go to Dashboard |
| `G` then `U` | Go to Users |
| `G` then `T` | Go to Transactions |
| `G` then `S` | Go to Settings |

---

## Accessibility

- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<header>`, `<aside>`)
- ARIA attributes on all interactive elements
- Role-based element identification (`role="switch"`, `aria-checked`, `aria-modal`)
- Keyboard navigable: all features accessible without mouse
- Focus management: command palette traps focus, Escape returns it
- Screen reader: `aria-live` regions for dynamic content
- Color contrast: all combinations meet WCAG AA standards in both themes
- `:focus-visible` for keyboard-only focus indicators
- `prefers-reduced-motion` support to disable animations
- Print stylesheet for report-friendly output

---

## Performance Optimizations

| Technique | Location |
|-----------|----------|
| Debounced resize handler | `ChartEngine.resize` — 250ms debounce |
| Debounced search input | `UsersPage` — 300ms debounce |
| RequestAnimationFrame animations | Charts, stat counters |
| Canvas HiDPI scaling | `ChartEngine.setupCanvas` |
| Virtual scroll for large datasets | `VirtualScroll.createTable` |
| Skeleton loading during transitions | Router page loader |
| CSS containment | `content: auto;` on scrollable areas |
| localStorage batching | Single save call per mutation |
| Animation frame cleanup | All RAF IDs tracked and cancelled on unmount |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/saas-dashboard.git

# Open in browser (no build step required)
cd saas-dashboard
open index.html
```

**Demo Credentials:**
- Username: any value (e.g., `admin`)
- Password: any value (3+ characters)

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

## Git History

The project was built incrementally with **55+ meaningful commits** following conventional commit messages:

```
feat:     New features (command palette, charts, auth, etc.)
fix:      Bug fixes and edge case handling
docs:     Documentation and README updates
refactor: Code improvements without behavior change
style:    CSS and visual refinements
chore:    Build and configuration changes
```

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) first.

Key contribution areas:
- **i18n**: Add translations for the language selector
- **Themes**: More accent color presets
- **Widgets**: New dashboard widget types
- **Performance**: Further optimizations for 10K+ row datasets

---

## License

This project is [MIT licensed](LICENSE). Use it for any purpose, personal or commercial.

---

## Author

**Mehdi** — Crafted with care for product teams who appreciate clean, performant interfaces.
