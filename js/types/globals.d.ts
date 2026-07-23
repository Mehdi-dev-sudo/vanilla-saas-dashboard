export {};

declare global {
  interface DashboardStats {
    totalRevenue: number;
    pendingRevenue: number;
    refundedRevenue: number;
    totalTransactions: number;
    activeUsers: number;
    totalUsers: number;
    conversionRate: number;
  }

  interface Transaction {
    id: string;
    user: string;
    email: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    date: string;
    description?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive' | 'suspended';
    joined: string;
    lastActive: string;
    avatar?: string;
    plan?: string;
  }

  interface ActivityEntry {
    id: string;
    timestamp: number;
    action: string;
    detail: string;
    type: string;
  }

  interface Notification {
    id: string;
    text: string;
    time: string;
    type: string;
    read: boolean;
  }

  interface AppSettings {
    theme: 'light' | 'dark' | 'system';
    locale: string;
    timezone: string;
    sidebarCollapsed: boolean;
    animationsEnabled: boolean;
    showActivityLog: boolean;
    showQuickActions: boolean;
    compactView: boolean;
  }

  interface AppState {
    users: User[];
    transactions: Transaction[];
    settings: AppSettings;
    notifications: Notification[];
    activity: ActivityEntry[];
    [key: string]: unknown;
  }

  interface WidgetConfig {
    id: string;
    title: string;
    render: () => string;
    default: boolean;
  }

  interface RouteHandler {
    render: () => string;
    init?: () => (() => void) | void;
    refresh?: () => void;
    reinitCharts?: () => void;
  }

  interface ToastOptions {
    duration?: number;
  }

  interface Window {
    __clockInterval: ReturnType<typeof setInterval>;
    __onlineInterval: ReturnType<typeof setInterval>;
    __updatedInterval: ReturnType<typeof setInterval>;
    showSaveIndicator: (show: boolean) => void;
    copyToClipboard: (text: string) => void;
    showKeyboardHelp?: () => void;
    __: (key: string, ...args: unknown[]) => string;
    __t: (key: string, ...args: unknown[]) => string;
  }

  var ToastSystem: {
    show: (message: string, type?: string, duration?: number) => HTMLElement | null;
    success: (message: string, duration?: number) => HTMLElement | null;
    error: (message: string, duration?: number) => HTMLElement | null;
    warning: (message: string, duration?: number) => HTMLElement | null;
    info: (message: string, duration?: number) => HTMLElement | null;
    dismiss: (el: HTMLElement) => void;
  };
  var Utils: {
    formatCurrency: (amount: number) => string;
    formatNumber: (num: number) => string;
    formatPercent: (value: number) => string;
    formatDate: (dateStr: string) => string;
    formatShortDate: (dateStr: string) => string;
    timeAgo: (dateStr: string) => string;
    debounce: (fn: Function, delay: number) => Function;
    escapeHtml: (str: string) => string;
    stringToColor: (str: string) => string;
    generateId: () => string;
    animateValue: (el: HTMLElement | null, start: number, end: number, duration: number) => void;
    animatePercent: (el: HTMLElement | null, start: number, end: number, duration: number, suffix?: string) => void;
    copyToClipboard: (text: string) => void;
  };
  var SafeStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    getObject: (key: string) => any;
    setObject: (key: string, obj: any) => void;
  };
}
