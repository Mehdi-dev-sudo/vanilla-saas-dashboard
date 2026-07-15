# Changelog

## [1.1.0] - 2026-07-15

### Added
- Internationalization system (i18n) with English and Persian (FA) translations
- RTL support with locale-aware `Intl` formatting (date, number, currency)
- Real export system: dashboard report (.txt), analytics CSV, settings backup/import (.json)
- Loading skeleton placeholders on search/filter changes in Users and Transactions
- Dashboard empty states for Recent Transactions and Recent Users widgets
- Keyboard accessibility for FAQ accordion (Enter/Space, ARIA attributes)
- Context menu keyboard navigation (Arrow keys, Enter, Escape, auto-focus)

### Fixed
- **CRITICAL**: Ripple animation crash on clicks at viewport x=0 (falsy `clientX`)
- **CRITICAL**: Chart `-Infinity` from empty data arrays in analytics `reinitCharts`
- Settings selectors not saving (IIFE `this.value` referenced `window`)
- Navigation race condition (generation counter in rAF callback)
- XSS vector in transaction invoice `onclick` attribute
- Dashboard realtime interval running when page hidden
- Missing scripts in ServiceWorker cache (i18n, export) — bumped to v5
- `formatNumber`/`formatPercent` showing "NaN" for undefined input
- Empty search results showing "Page 1 of 1" with zero items
- `p.stock || 10` treating stock=0 as 10; invoice number truncation
- `escapeHtml` not escaping single quotes
- Canvas `height: 300px` CSS conflicting with JS-set height
- Sidebar `overflow: hidden` clipping tooltips
- `querySelectorAll('*')` called every second in DevConsole and PerfMonitor
- Chart canvas re-initialized every redraw (layout thrashing)
- `window.onerror` handler silently discarding previous handler
- Theme toggle missing null guard and aria-label update on switch
- Modal `role="dialog"` on wrong element; missing `aria-labelledby`
- Command palette missing `aria-activedescendant` and `role="listbox"`
- Multiple CSS bugs (sidebar scroll, table touch scroll, dev-console sizing)
- `var i` re-declared in i18n `__()` function
- Notification badge state desynchronization
- Accessibility improvements across FAQ, modal, context menu, theme toggle

### Added
- Initial release of Vanilla SaaS Dashboard
- Command palette with fuzzy search (Ctrl+K)
- Undo/redo system (Ctrl+Z / Ctrl+Shift+Z)
- Keyboard navigation throughout the app
- Fake authentication with login page and session management
- Enhanced settings panel (theme, language, density, accent color)
- Widget-based dashboard with drag-to-reorder
- Activity log with 100-entry ring buffer
- Canvas-based chart engine (line, bar, donut)
- Loading skeletons for pages and tables
- Custom context menu on table rows
- Multi-select with batch delete/export
- Virtual scroll for large datasets
- Dark/light theme with localStorage persistence
- User and transaction CRUD with search/filter/sort
- CSV export for transactions
- Live clock and online user counter
- Breadcrumb navigation
- Notification dropdown panel
- Chart download as PNG
- Keyboard shortcuts help modal (Ctrl+/)
- Page transition animations
- Tooltip system via data-tooltip attribute
- Empty state illustrations
- Toast notifications with progress bar
- Responsive mobile sidebar
- Focus-visible accessibility
- Print and reduced-motion styles
