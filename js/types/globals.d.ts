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
    __: (key: string, ...args: unknown[]) => string;
    __t: (key: string, ...args: unknown[]) => string;
  }
}
