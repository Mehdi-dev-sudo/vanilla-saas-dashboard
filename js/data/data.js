const AppStore = (function () {
  let state = loadState();

  const subscribers = {};

  function defaultState() {
    return {
      theme: 'light',
      users: [
        { id: 'u1', name: 'Sarah Lee', email: 'sarah.lee@acmecorp.com', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-03-12', revenue: 2400 },
        { id: 'u2', name: 'Mike Johnson', email: 'mike.j@startup.io', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-05-20', revenue: 1200 },
        { id: 'u3', name: 'Emily Chen', email: 'emily.chen@devshop.com', role: 'Viewer', status: 'inactive', plan: 'Free', joined: '2025-07-08', revenue: 0 },
        { id: 'u4', name: 'David Kim', email: 'david.kim@fintech.co', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-02-01', revenue: 3600 },
        { id: 'u5', name: 'Anna Brown', email: 'anna.brown@creative.agency', role: 'Editor', status: 'suspended', plan: 'Pro', joined: '2025-09-15', revenue: 800 },
        { id: 'u6', name: 'James Wilson', email: 'jwilson@healthtech.com', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-04-10', revenue: 1500 },
        { id: 'u7', name: 'Lisa Anderson', email: 'lisa.a@edtech.org', role: 'Viewer', status: 'active', plan: 'Free', joined: '2025-11-22', revenue: 0 },
        { id: 'u8', name: 'Robert Taylor', email: 'rtaylor@enterprise.com', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-01-05', revenue: 4800 },
        { id: 'u9', name: 'Julia Martinez', email: 'julia.m@marketing.pro', role: 'Editor', status: 'inactive', plan: 'Pro', joined: '2025-06-18', revenue: 600 },
        { id: 'u10', name: 'Tom Harris', email: 'tom.h@saas.io', role: 'Viewer', status: 'active', plan: 'Free', joined: '2025-10-30', revenue: 0 },
        { id: 'u11', name: 'Priya Patel', email: 'priya.p@ecomstore.com', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-12-05', revenue: 2100 },
        { id: 'u12', name: 'Omar Hassan', email: 'omar@datadrive.ai', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2026-01-20', revenue: 5400 },
        { id: 'u13', name: 'Nina Kowalski', email: 'nina.k@designlab.com', role: 'Viewer', status: 'active', plan: 'Free', joined: '2026-02-14', revenue: 0 },
        { id: 'u14', name: 'Carlos Mendez', email: 'carlos@cloudshift.io', role: 'Editor', status: 'suspended', plan: 'Pro', joined: '2025-08-03', revenue: 450 },
        { id: 'u15', name: 'Yuki Tanaka', email: 'yuki@gamedev.jp', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-04-22', revenue: 6200 },
        { id: 'u16', name: 'Fatima Al-Rashid', email: 'fatima@consulting.me', role: 'Viewer', status: 'inactive', plan: 'Free', joined: '2025-07-19', revenue: 0 },
        { id: 'u17', name: 'Alex Petrov', email: 'alex.p@blockchain.io', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-11-11', revenue: 1800 },
        { id: 'u18', name: 'Maria Silva', email: 'maria@retailplus.com', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-06-30', revenue: 950 },
        { id: 'u19', name: 'Wei Zhang', email: 'wei@manufacturing.cn', role: 'Admin', status: 'suspended', plan: 'Enterprise', joined: '2025-02-28', revenue: 3900 },
        { id: 'u20', name: 'Grace Okonkwo', email: 'grace@logistics.ng', role: 'Viewer', status: 'active', plan: 'Free', joined: '2026-03-01', revenue: 0 },
        { id: 'u21', name: 'Liam O\'Brien', email: 'liam@foodtech.ie', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-10-15', revenue: 1650 },
        { id: 'u22', name: 'Sophie Martin', email: 'sophie@fashion.fr', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-01-20', revenue: 7800 },
        { id: 'u23', name: 'Raj Kapoor', email: 'raj@medtech.in', role: 'Viewer', status: 'active', plan: 'Free', joined: '2025-05-05', revenue: 0 },
        { id: 'u24', name: 'Elena Popescu', email: 'elena@travel.ro', role: 'Editor', status: 'inactive', plan: 'Pro', joined: '2025-09-28', revenue: 300 },
        { id: 'u25', name: 'Kenji Watanabe', email: 'kenji@automotive.jp', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-12-20', revenue: 2200 }
      ],
      transactions: [
        { id: 't1', invoice: 'INV-001', customer: 'Acme Corp', email: 'billing@acmecorp.com', amount: 12000, status: 'completed', date: '2026-03-28', method: 'Wire Transfer' },
        { id: 't2', invoice: 'INV-002', customer: 'Startup.io', email: 'finance@startup.io', amount: 8500, status: 'completed', date: '2026-03-27', method: 'ACH' },
        { id: 't3', invoice: 'INV-003', customer: 'DevShop Inc', email: 'ap@devshop.com', amount: 21000, status: 'pending', date: '2026-03-26', method: 'Bank Transfer' },
        { id: 't4', invoice: 'INV-004', customer: 'FinTech Co', email: 'payments@fintech.co', amount: 4500, status: 'completed', date: '2026-03-25', method: 'Credit Card' },
        { id: 't5', invoice: 'INV-005', customer: 'Creative Agency', email: 'invoices@creative.agency', amount: 16500, status: 'failed', date: '2026-03-24', method: 'PayPal' },
        { id: 't6', invoice: 'INV-006', customer: 'HealthTech Ltd', email: 'accounts@healthtech.com', amount: 32000, status: 'completed', date: '2026-03-23', method: 'Wire Transfer' },
        { id: 't7', invoice: 'INV-007', customer: 'EduTech Org', email: 'finance@edtech.org', amount: 7800, status: 'pending', date: '2026-03-22', method: 'Credit Card' },
        { id: 't8', invoice: 'INV-008', customer: 'Enterprise Inc', email: 'treasury@enterprise.com', amount: 54000, status: 'completed', date: '2026-03-21', method: 'Wire Transfer' },
        { id: 't9', invoice: 'INV-009', customer: 'Marketing Pro', email: 'billing@marketing.pro', amount: 9200, status: 'failed', date: '2026-03-20', method: 'PayPal' },
        { id: 't10', invoice: 'INV-010', customer: 'SaaS IO', email: 'ap@saas.io', amount: 15000, status: 'completed', date: '2026-03-19', method: 'ACH' },
        { id: 't11', invoice: 'INV-011', customer: 'EcomStore', email: 'finance@ecomstore.com', amount: 28000, status: 'completed', date: '2026-03-18', method: 'Credit Card' },
        { id: 't12', invoice: 'INV-012', customer: 'DataDrive AI', email: 'payments@datadrive.ai', amount: 42000, status: 'pending', date: '2026-03-17', method: 'Wire Transfer' },
        { id: 't13', invoice: 'INV-013', customer: 'DesignLab', email: 'invoices@designlab.com', amount: 3400, status: 'completed', date: '2026-03-16', method: 'PayPal' },
        { id: 't14', invoice: 'INV-014', customer: 'CloudShift', email: 'billing@cloudshift.io', amount: 19500, status: 'refunded', date: '2026-03-15', method: 'Credit Card' },
        { id: 't15', invoice: 'INV-015', customer: 'GameDev JP', email: 'finance@gamedev.jp', amount: 86000, status: 'completed', date: '2026-03-14', method: 'Wire Transfer' },
        { id: 't16', invoice: 'INV-016', customer: 'Consulting ME', email: 'ap@consulting.me', amount: 11000, status: 'completed', date: '2026-03-13', method: 'ACH' },
        { id: 't17', invoice: 'INV-017', customer: 'Blockchain IO', email: 'payments@blockchain.io', amount: 67000, status: 'pending', date: '2026-03-12', method: 'Wire Transfer' },
        { id: 't18', invoice: 'INV-018', customer: 'RetailPlus', email: 'treasury@retailplus.com', amount: 23000, status: 'completed', date: '2026-03-11', method: 'Credit Card' },
        { id: 't19', invoice: 'INV-019', customer: 'Manufacturing CN', email: 'finance@manufacturing.cn', amount: 95000, status: 'completed', date: '2026-03-10', method: 'Wire Transfer' },
        { id: 't20', invoice: 'INV-020', customer: 'Logistics NG', email: 'billing@logistics.ng', amount: 7200, status: 'failed', date: '2026-03-09', method: 'PayPal' },
        { id: 't21', invoice: 'INV-021', customer: 'FoodTech IE', email: 'ap@foodtech.ie', amount: 14200, status: 'completed', date: '2026-03-08', method: 'ACH' },
        { id: 't22', invoice: 'INV-022', customer: 'Fashion FR', email: 'finance@fashion.fr', amount: 51000, status: 'completed', date: '2026-03-07', method: 'Wire Transfer' },
        { id: 't23', invoice: 'INV-023', customer: 'MedTech IN', email: 'payments@medtech.in', amount: 3800, status: 'pending', date: '2026-03-06', method: 'Credit Card' },
        { id: 't24', invoice: 'INV-024', customer: 'Travel RO', email: 'invoices@travel.ro', amount: 16000, status: 'completed', date: '2026-03-05', method: 'PayPal' },
        { id: 't25', invoice: 'INV-025', customer: 'Automotive JP', email: 'billing@automotive.jp', amount: 78000, status: 'completed', date: '2026-03-04', method: 'Wire Transfer' }
      ],
      notifications: 5,
      settings: {
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        twoFactorAuth: false,
        autoSave: true,
        compactView: false,
        currency: 'USD',
        timezone: 'UTC'
      }
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem('saas_dashboard_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState(), ...parsed, settings: { ...defaultState().settings, ...(parsed.settings || {}) } };
      }
    } catch (e) { /* ignore */ }
    return defaultState();
  }

  function saveState() {
    try {
      localStorage.setItem('saas_dashboard_state', JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  function getState(key) {
    if (key) return state[key];
    return state;
  }

  function setState(key, value) {
    state[key] = value;
    saveState();
    notify(key);
  }

  function updateState(key, updates) {
    if (typeof state[key] === 'object' && state[key] !== null) {
      state[key] = { ...state[key], ...updates };
    } else {
      state[key] = updates;
    }
    saveState();
    notify(key);
  }

  function subscribe(key, callback) {
    if (!subscribers[key]) subscribers[key] = [];
    subscribers[key].push(callback);
    return function () {
      subscribers[key] = subscribers[key].filter(cb => cb !== callback);
    };
  }

  function notify(key) {
    if (subscribers[key]) {
      subscribers[key].forEach(cb => cb(state[key]));
    }
  }

  // User CRUD
  function addUser(user) {
    if (typeof HistoryManager !== 'undefined' && HistoryManager.pushSnapshot) HistoryManager.pushSnapshot();
    user.id = Utils.generateId();
    state.users.push(user);
    saveState();
    notify('users');
    if (typeof ActivityLog !== 'undefined') ActivityLog.add('create', 'User "' + user.name + '" created', 'user');
    return user;
  }

  function updateUser(id, updates) {
    const idx = state.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    if (typeof HistoryManager !== 'undefined' && HistoryManager.pushSnapshot) HistoryManager.pushSnapshot();
    const oldName = state.users[idx].name;
    state.users[idx] = { ...state.users[idx], ...updates };
    saveState();
    notify('users');
    if (typeof ActivityLog !== 'undefined') ActivityLog.add('edit', 'User "' + (updates.name || oldName) + '" updated', 'edit');
    return state.users[idx];
  }

  function deleteUser(id) {
    const user = state.users.find(u => u.id === id);
    if (!user) return;
    if (typeof HistoryManager !== 'undefined' && HistoryManager.pushSnapshot) HistoryManager.pushSnapshot();
    state.users = state.users.filter(u => u.id !== id);
    saveState();
    notify('users');
    if (typeof ActivityLog !== 'undefined') ActivityLog.add('delete', 'User "' + user.name + '" deleted', 'delete');
  }

  function getUser(id) {
    return state.users.find(u => u.id === id);
  }

  function getFilteredUsers(search, status, role, page, perPage) {
    let filtered = [...state.users];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
      );
    }
    if (status && status !== 'all') filtered = filtered.filter(u => u.status === status);
    if (role && role !== 'all') filtered = filtered.filter(u => u.role === role);

    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);

    return { items, total, totalPages, page };
  }

  // Transactions
  function getFilteredTransactions(search, status, sortBy, sortDir, page, perPage, method) {
    let filtered = [...state.transactions];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.customer.toLowerCase().includes(s) ||
        t.invoice.toLowerCase().includes(s) ||
        t.email.toLowerCase().includes(s)
      );
    }
    if (status && status !== 'all') filtered = filtered.filter(t => t.status === status);
    if (method && method !== 'all') filtered = filtered.filter(t => t.method === method);

    if (sortBy) {
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);

    return { items, total, totalPages, page };
  }

  // Stats
  function getDashboardStats() {
    const totalRevenue = state.transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
    const activeUsers = state.users.filter(u => u.status === 'active').length;
    const subscribers = state.users.filter(u => u.plan !== 'Free').length;
    const churned = state.users.filter(u => u.status === 'inactive' || u.status === 'suspended').length;
    const churnRate = state.users.length > 0 ? (churned / state.users.length) * 100 : 0;

    return {
      revenue: { value: totalRevenue, change: 12.5, isUp: true },
      users: { value: activeUsers, change: 8.2, isUp: true },
      subscribers: { value: subscribers, change: 3.1, isUp: true },
      churn: { value: churnRate, change: 0.8, isUp: false }
    };
  }

  function getAnalyticsStats() {
    const completed = state.transactions.filter(t => t.status === 'completed');
    const totalRevenue = completed.reduce((s, t) => s + t.amount, 0);
    const avgOrder = completed.length > 0 ? totalRevenue / completed.length : 0;
    const conversion = 3.2;
    const activeUsers = state.users.filter(u => u.status === 'active').length;
    const totalUsers = state.users.length;

    return { totalRevenue, avgOrder, conversion, activeUsers, totalUsers };
  }

  function incrementNotifications() {
    state.notifications++;
    saveState();
    notify('notifications');
  }

  function clearNotifications() {
    state.notifications = 0;
    saveState();
    notify('notifications');
  }

  function exportTransactionsCSV(transactions) {
    const headers = ['Invoice', 'Customer', 'Email', 'Amount', 'Status', 'Date', 'Method'];
    const rows = transactions.map(t => [
      t.invoice, t.customer, t.email, t.amount, t.status, t.date, t.method
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions_export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (typeof ActivityLog !== 'undefined') ActivityLog.add('export', 'Exported ' + transactions.length + ' transactions as CSV', 'export');
  }

  return {
    getState,
    setState,
    updateState,
    subscribe,
    getDashboardStats,
    getAnalyticsStats,
    getFilteredUsers,
    getFilteredTransactions,
    addUser,
    updateUser,
    deleteUser,
    getUser,
    exportTransactionsCSV,
    incrementNotifications,
    clearNotifications
  };
})();
