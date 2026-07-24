/**
 * Design Tokens — Auto-generated from tokens/tokens.json
 * DO NOT EDIT DIRECTLY
 */

const DesignTokens = (function () {
  const tokens = {
  "--ds-color-brand-primary": "#6366f1",
  "--ds-color-brand-primary-hover": "#4f46e5",
  "--ds-color-brand-primary-light": "rgba(99, 102, 241, 0.12)",
  "--ds-color-brand-primary-bg": "rgba(99, 102, 241, 0.06)",
  "--ds-color-brand-secondary": "#8b5cf6",
  "--ds-color-semantic-success": "#10b981",
  "--ds-color-semantic-success-light": "rgba(16, 185, 129, 0.12)",
  "--ds-color-semantic-warning": "#f59e0b",
  "--ds-color-semantic-warning-light": "rgba(245, 158, 11, 0.12)",
  "--ds-color-semantic-danger": "#ef4444",
  "--ds-color-semantic-danger-light": "rgba(239, 68, 68, 0.12)",
  "--ds-color-semantic-info": "#3b82f6",
  "--ds-color-semantic-info-light": "rgba(59, 130, 246, 0.12)",
  "--ds-color-surface-body": "#f0f2f5",
  "--ds-color-surface-card": "#ffffff",
  "--ds-color-surface-sidebar": "#0f0d2e",
  "--ds-color-surface-sidebar-hover": "rgba(255, 255, 255, 0.06)",
  "--ds-color-surface-sidebar-active": "rgba(99, 102, 241, 0.2)",
  "--ds-color-surface-header": "rgba(255, 255, 255, 0.8)",
  "--ds-color-surface-input": "#f3f4f6",
  "--ds-color-surface-tooltip": "#1f2937",
  "--ds-color-surface-loader": "rgba(255, 255, 255, 0.8)",
  "--ds-color-surface-modal-overlay": "rgba(0, 0, 0, 0.5)",
  "--ds-color-text-primary": "#111827",
  "--ds-color-text-secondary": "#6b7280",
  "--ds-color-text-tertiary": "#9ca3af",
  "--ds-color-text-inverse": "#ffffff",
  "--ds-color-text-sidebar": "rgba(255, 255, 255, 0.7)",
  "--ds-color-text-sidebar-active": "#ffffff",
  "--ds-color-border-default": "#e5e7eb",
  "--ds-color-border-light": "#f3f4f6",
  "--ds-color-chart-line": "#6366f1",
  "--ds-color-chart-line-fill": "rgba(99, 102, 241, 0.15)",
  "--ds-color-chart-bar-start": "#6366f1",
  "--ds-color-chart-bar-end": "#8b5cf6",
  "--ds-color-chart-grid": "#e5e7eb",
  "--ds-color-chart-text": "#9ca3af",
  "--ds-space-0": "0px",
  "--ds-space-1": "4px",
  "--ds-space-2": "8px",
  "--ds-space-3": "12px",
  "--ds-space-4": "16px",
  "--ds-space-5": "20px",
  "--ds-space-6": "24px",
  "--ds-space-7": "32px",
  "--ds-space-8": "40px",
  "--ds-space-9": "56px",
  "--ds-typography-font-family-sans": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  "--ds-typography-font-family-mono": "'SF Mono', Monaco, 'Cascadia Code', monospace",
  "--ds-typography-size-xs": "0.625rem",
  "--ds-typography-size-sm": "0.75rem",
  "--ds-typography-size-base": "0.875rem",
  "--ds-typography-size-md": "1rem",
  "--ds-typography-size-lg": "1.125rem",
  "--ds-typography-size-xl": "1.25rem",
  "--ds-typography-size-2xl": "1.5rem",
  "--ds-typography-size-3xl": "1.875rem",
  "--ds-typography-weight-normal": "400",
  "--ds-typography-weight-medium": "500",
  "--ds-typography-weight-semibold": "600",
  "--ds-typography-weight-bold": "700",
  "--ds-typography-weight-extrabold": "800",
  "--ds-typography-line-height-tight": "1.2",
  "--ds-typography-line-height-base": "1.5",
  "--ds-typography-line-height-relaxed": "1.7",
  "--ds-radius-sm": "6px",
  "--ds-radius-md": "8px",
  "--ds-radius-lg": "12px",
  "--ds-radius-xl": "16px",
  "--ds-radius-full": "9999px",
  "--ds-shadow-sm": "0 1px 2px rgba(0, 0, 0, 0.04)",
  "--ds-shadow-md": "0 4px 16px rgba(0, 0, 0, 0.06)",
  "--ds-shadow-lg": "0 8px 32px rgba(0, 0, 0, 0.08)",
  "--ds-shadow-card": "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
  "--ds-shadow-elevated": "0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
  "--ds-shadow-modal": "0 20px 60px rgba(0, 0, 0, 0.15)",
  "--ds-shadow-toast": "0 8px 24px rgba(0, 0, 0, 0.12)",
  "--ds-motion-duration-fast": "0.15s",
  "--ds-motion-duration-base": "0.2s",
  "--ds-motion-duration-slow": "0.3s",
  "--ds-motion-duration-spring": "0.4s",
  "--ds-motion-easing-standard": "cubic-bezier(0.4, 0, 0.2, 1)",
  "--ds-motion-easing-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "--ds-motion-easing-emphasized": "cubic-bezier(0.2, 0, 0, 1)",
  "--ds-layout-sidebar-width": "280px",
  "--ds-layout-sidebar-collapsed": "72px",
  "--ds-layout-header-height": "68px",
  "--ds-layout-breakpoint-mobile": "480px",
  "--ds-layout-breakpoint-tablet": "768px",
  "--ds-layout-breakpoint-desktop": "1024px",
  "--ds-layout-breakpoint-wide": "1200px",
  "--ds-layout-breakpoint-ultrawide": "1440px"
};

  function get(name) {
    return tokens[name] || null;
  }

  function getAll() {
    return { ...tokens };
  }

  function getDoc() {
    return [
  {
    "name": "--ds-color-brand-primary",
    "value": "#6366f1",
    "dark": "#818cf8",
    "description": "Primary brand color"
  },
  {
    "name": "--ds-color-brand-primary-hover",
    "value": "#4f46e5",
    "dark": "#6366f1",
    "description": "Primary hover state"
  },
  {
    "name": "--ds-color-brand-primary-light",
    "value": "rgba(99, 102, 241, 0.12)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-brand-primary-bg",
    "value": "rgba(99, 102, 241, 0.06)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-brand-secondary",
    "value": "#8b5cf6",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-semantic-success",
    "value": "#10b981",
    "dark": "#34d399",
    "description": ""
  },
  {
    "name": "--ds-color-semantic-success-light",
    "value": "rgba(16, 185, 129, 0.12)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-semantic-warning",
    "value": "#f59e0b",
    "dark": "#fbbf24",
    "description": ""
  },
  {
    "name": "--ds-color-semantic-warning-light",
    "value": "rgba(245, 158, 11, 0.12)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-semantic-danger",
    "value": "#ef4444",
    "dark": "#f87171",
    "description": ""
  },
  {
    "name": "--ds-color-semantic-danger-light",
    "value": "rgba(239, 68, 68, 0.12)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-semantic-info",
    "value": "#3b82f6",
    "dark": "#60a5fa",
    "description": ""
  },
  {
    "name": "--ds-color-semantic-info-light",
    "value": "rgba(59, 130, 246, 0.12)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-surface-body",
    "value": "#f0f2f5",
    "dark": "#0a0a1a",
    "description": ""
  },
  {
    "name": "--ds-color-surface-card",
    "value": "#ffffff",
    "dark": "#13132b",
    "description": ""
  },
  {
    "name": "--ds-color-surface-sidebar",
    "value": "#0f0d2e",
    "dark": "#08081a",
    "description": ""
  },
  {
    "name": "--ds-color-surface-sidebar-hover",
    "value": "rgba(255, 255, 255, 0.06)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-surface-sidebar-active",
    "value": "rgba(99, 102, 241, 0.2)",
    "dark": "rgba(99, 102, 241, 0.25)",
    "description": ""
  },
  {
    "name": "--ds-color-surface-header",
    "value": "rgba(255, 255, 255, 0.8)",
    "dark": "rgba(19, 19, 43, 0.85)",
    "description": ""
  },
  {
    "name": "--ds-color-surface-input",
    "value": "#f3f4f6",
    "dark": "#1e1e3a",
    "description": ""
  },
  {
    "name": "--ds-color-surface-tooltip",
    "value": "#1f2937",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-surface-loader",
    "value": "rgba(255, 255, 255, 0.8)",
    "dark": "rgba(10, 10, 26, 0.85)",
    "description": ""
  },
  {
    "name": "--ds-color-surface-modal-overlay",
    "value": "rgba(0, 0, 0, 0.5)",
    "dark": "rgba(0, 0, 0, 0.7)",
    "description": ""
  },
  {
    "name": "--ds-color-text-primary",
    "value": "#111827",
    "dark": "#f3f4f6",
    "description": ""
  },
  {
    "name": "--ds-color-text-secondary",
    "value": "#6b7280",
    "dark": "#9ca3af",
    "description": ""
  },
  {
    "name": "--ds-color-text-tertiary",
    "value": "#9ca3af",
    "dark": "#6b7280",
    "description": ""
  },
  {
    "name": "--ds-color-text-inverse",
    "value": "#ffffff",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-text-sidebar",
    "value": "rgba(255, 255, 255, 0.7)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-text-sidebar-active",
    "value": "#ffffff",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-border-default",
    "value": "#e5e7eb",
    "dark": "#2d2d5e",
    "description": ""
  },
  {
    "name": "--ds-color-border-light",
    "value": "#f3f4f6",
    "dark": "#1e1e3a",
    "description": ""
  },
  {
    "name": "--ds-color-chart-line",
    "value": "#6366f1",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-chart-line-fill",
    "value": "rgba(99, 102, 241, 0.15)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-chart-bar-start",
    "value": "#6366f1",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-chart-bar-end",
    "value": "#8b5cf6",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-color-chart-grid",
    "value": "#e5e7eb",
    "dark": "#2d2d5e",
    "description": ""
  },
  {
    "name": "--ds-color-chart-text",
    "value": "#9ca3af",
    "dark": "#6b7280",
    "description": ""
  },
  {
    "name": "--ds-space-0",
    "value": "0px",
    "dark": null,
    "description": "No spacing"
  },
  {
    "name": "--ds-space-1",
    "value": "4px",
    "dark": null,
    "description": "4px — extra small"
  },
  {
    "name": "--ds-space-2",
    "value": "8px",
    "dark": null,
    "description": "8px — small"
  },
  {
    "name": "--ds-space-3",
    "value": "12px",
    "dark": null,
    "description": "12px — medium"
  },
  {
    "name": "--ds-space-4",
    "value": "16px",
    "dark": null,
    "description": "16px — large"
  },
  {
    "name": "--ds-space-5",
    "value": "20px",
    "dark": null,
    "description": "20px — extra large"
  },
  {
    "name": "--ds-space-6",
    "value": "24px",
    "dark": null,
    "description": "24px — 2x large"
  },
  {
    "name": "--ds-space-7",
    "value": "32px",
    "dark": null,
    "description": "32px — 3x large"
  },
  {
    "name": "--ds-space-8",
    "value": "40px",
    "dark": null,
    "description": "40px — 4x large"
  },
  {
    "name": "--ds-space-9",
    "value": "56px",
    "dark": null,
    "description": "56px — 5x large"
  },
  {
    "name": "--ds-typography-font-family-sans",
    "value": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-font-family-mono",
    "value": "'SF Mono', Monaco, 'Cascadia Code', monospace",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-size-xs",
    "value": "0.625rem",
    "dark": null,
    "description": "10px"
  },
  {
    "name": "--ds-typography-size-sm",
    "value": "0.75rem",
    "dark": null,
    "description": "12px"
  },
  {
    "name": "--ds-typography-size-base",
    "value": "0.875rem",
    "dark": null,
    "description": "14px"
  },
  {
    "name": "--ds-typography-size-md",
    "value": "1rem",
    "dark": null,
    "description": "16px"
  },
  {
    "name": "--ds-typography-size-lg",
    "value": "1.125rem",
    "dark": null,
    "description": "18px"
  },
  {
    "name": "--ds-typography-size-xl",
    "value": "1.25rem",
    "dark": null,
    "description": "20px"
  },
  {
    "name": "--ds-typography-size-2xl",
    "value": "1.5rem",
    "dark": null,
    "description": "24px"
  },
  {
    "name": "--ds-typography-size-3xl",
    "value": "1.875rem",
    "dark": null,
    "description": "30px"
  },
  {
    "name": "--ds-typography-weight-normal",
    "value": "400",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-weight-medium",
    "value": "500",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-weight-semibold",
    "value": "600",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-weight-bold",
    "value": "700",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-weight-extrabold",
    "value": "800",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-line-height-tight",
    "value": "1.2",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-line-height-base",
    "value": "1.5",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-typography-line-height-relaxed",
    "value": "1.7",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-radius-sm",
    "value": "6px",
    "dark": null,
    "description": "Small radius"
  },
  {
    "name": "--ds-radius-md",
    "value": "8px",
    "dark": null,
    "description": "Medium radius"
  },
  {
    "name": "--ds-radius-lg",
    "value": "12px",
    "dark": null,
    "description": "Large radius"
  },
  {
    "name": "--ds-radius-xl",
    "value": "16px",
    "dark": null,
    "description": "Extra large radius"
  },
  {
    "name": "--ds-radius-full",
    "value": "9999px",
    "dark": null,
    "description": "Fully rounded"
  },
  {
    "name": "--ds-shadow-sm",
    "value": "0 1px 2px rgba(0, 0, 0, 0.04)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-shadow-md",
    "value": "0 4px 16px rgba(0, 0, 0, 0.06)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-shadow-lg",
    "value": "0 8px 32px rgba(0, 0, 0, 0.08)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-shadow-card",
    "value": "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-shadow-elevated",
    "value": "0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-shadow-modal",
    "value": "0 20px 60px rgba(0, 0, 0, 0.15)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-shadow-toast",
    "value": "0 8px 24px rgba(0, 0, 0, 0.12)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-motion-duration-fast",
    "value": "0.15s",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-motion-duration-base",
    "value": "0.2s",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-motion-duration-slow",
    "value": "0.3s",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-motion-duration-spring",
    "value": "0.4s",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-motion-easing-standard",
    "value": "cubic-bezier(0.4, 0, 0.2, 1)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-motion-easing-spring",
    "value": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-motion-easing-emphasized",
    "value": "cubic-bezier(0.2, 0, 0, 1)",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-sidebar-width",
    "value": "280px",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-sidebar-collapsed",
    "value": "72px",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-header-height",
    "value": "68px",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-breakpoint-mobile",
    "value": "480px",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-breakpoint-tablet",
    "value": "768px",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-breakpoint-desktop",
    "value": "1024px",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-breakpoint-wide",
    "value": "1200px",
    "dark": null,
    "description": ""
  },
  {
    "name": "--ds-layout-breakpoint-ultrawide",
    "value": "1440px",
    "dark": null,
    "description": ""
  }
];
  }

  return { get, getAll, getDoc };
})();
