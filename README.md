# SaaS Dashboard

A modern, fully-responsive SaaS analytics dashboard built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just pure, well-architected frontend code.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/saas-dashboard/graphs/commit-activity)

## Features

- **Dashboard** — Real-time stats, revenue charts, user growth tracking, traffic sources
- **Analytics** — Detailed metrics, trends, and data visualization
- **User Management** — Full CRUD operations with search, filter, and pagination
- **Transactions** — Sortable table with status indicators and CSV export
- **Settings** — Theme toggle (light/dark), notification preferences, display options
- **Support** — FAQ accordion and contact form with validation
- **Responsive Design** — Works seamlessly from 360px to 4K displays
- **Dark/Light Theme** — Persisted preference with system detection
- **Keyboard Shortcuts** — Press `Ctrl+K` for quick search
- **Zero Dependencies** — Built with vanilla JS and Canvas API

## Project Structure

```
saas-dashboard/
├── index.html
├── css/
│   └── main.css              # Complete design system (500+ lines)
├── js/
│   ├── app.js                # Application entry point
│   ├── core/
│   │   ├── router.js         # Hash-based client-side router
│   │   └── utils.js          # Utility functions
│   ├── data/
│   │   └── data.js           # Mock data and state management
│   ├── components/
│   │   ├── charts.js         # Canvas chart engine (line, bar, donut)
│   │   ├── modal.js          # Modal dialog system
│   │   ├── toast.js          # Toast notification system
│   │   ├── sidebar.js        # Sidebar navigation
│   │   └── theme.js          # Dark/light theme manager
│   └── pages/
│       ├── dashboard.js      # Dashboard page
│       ├── analytics.js      # Analytics page
│       ├── users.js          # Users management page
│       ├── transactions.js   # Transactions page
│       ├── settings.js       # Settings page
│       └── support.js        # Support page
└── .github/
    ├── CONTRIBUTING.md
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/
        ├── bug_report.md
        └── feature_request.md
```

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/saas-dashboard.git
   ```

2. **Open in browser:**
   ```bash
   cd saas-dashboard
   open index.html
   ```
   Or simply double-click `index.html` in your file explorer.

That's it. No install, no build, no config.

## Design System

| Token | Light | Dark |
|-------|-------|------|
| Background | `#f0f2f5` | `#0a0a1a` |
| Card | `#ffffff` | `#13132b` |
| Sidebar | `#0f0d2e` | `#08081a` |
| Primary | `#6366f1` | `#6366f1` |
| Text | `#111827` | `#f3f4f6` |

All design tokens are managed via CSS custom properties, making theming and customization straightforward.

## Charts

All charts are rendered using the **Canvas API** — no charting libraries required:

- **Line Chart** — Smooth bezier curves with gradient fill and animated drawing
- **Bar Chart** — Gradient bars with rounded corners and animation
- **Donut Chart** — Segmented display with centered total

## Browser Support

- Chrome (90+)
- Firefox (90+)
- Safari (15+)
- Edge (90+)

## Contributing

Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
