const AppStore = (function () {
  let state = loadState();

  const subscribers = {};

  function defaultState() {
    return {
      theme: 'light',
      users: [
        { id: 'u1', name: 'Sarah Lee', email: 'sarah@example.com', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-03-12', revenue: 2400 },
        { id: 'u2', name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-05-20', revenue: 1200 },
        { id: 'u3', name: 'Emily Chen', email: 'emily@example.com', role: 'Viewer', status: 'inactive', plan: 'Free', joined: '2025-07-08', revenue: 0 },
        { id: 'u4', name: 'David Kim', email: 'david@example.com', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-02-01', revenue: 3600 },
        { id: 'u5', name: 'Anna Brown', email: 'anna@example.com', role: 'Editor', status: 'suspended', plan: 'Pro', joined: '2025-09-15', revenue: 800 },
        { id: 'u6', name: 'James Wilson', email: 'james@example.com', role: 'Editor', status: 'active', plan: 'Pro', joined: '2025-04-10', revenue: 1500 },
        { id: 'u7', name: 'Lisa Anderson', email: 'lisa@example.com', role: 'Viewer', status: 'active', plan: 'Free', joined: '2025-11-22', revenue: 0 },
        { id: 'u8', name: 'Robert Taylor', email: 'robert@example.com', role: 'Admin', status: 'active', plan: 'Enterprise', joined: '2025-01-05', revenue: 4800 },
        { id: 'u9', name: 'Julia Martinez', email: 'julia@example.com', role: 'Editor', status: 'inactive', plan: 'Pro', joined: '2025-06-18', revenue: 600 },
        { id: 'u10', name: 'Tom Harris', email: 'tom@example.com', role: 'Viewer', status: 'active', plan: 'Free', joined: '2025-10-30', revenue: 0 }
      ],
      transactions: [
        { id: 't1', invoice: 'INV-001', customer: 'John Doe', email: 'john@example.com', amount: 1200, status: 'completed', date: '2026-01-15', method: 'Credit Card' },
        { id: 't2', invoice: 'INV-002', customer: 'Jane Smith', email: 'jane@example.com', amount: 850, status: 'completed', date: '2026-01-14', method: 'PayPal' },
        { id: 't3', invoice: 'INV-003', customer: 'Bob Johnson', email: 'bob@example.com', amount: 2100, status: 'pending', date: '2026-01-13', method: 'Bank Transfer' },
        { id: 't4', invoice: 'INV-004', customer: 'Alice Brown', email: 'alice@example.com', amount: 450, status: 'completed', date: '2026-01-12', method: 'Credit Card' },
        { id: 't5', invoice: 'INV-005', customer: 'Charlie Wilson', email: 'charlie@example.com', amount: 1650, status: 'failed', date: '2026-01-11', method: 'PayPal' },
        { id: 't6', invoice: 'INV-006', customer: 'Diana Prince', email: 'diana@example.com', amount: 3200, status: 'completed', date: '2026-01-10', method: 'Bank Transfer' },
        { id: 't7', invoice: 'INV-007', customer: 'Edward Norton', email: 'edward@example.com', amount: 780, status: 'pending', date: '2026-01-09', method: 'Credit Card' },
        { id: 't8', invoice: 'INV-008', customer: 'Fiona Apple', email: 'fiona@example.com', amount: 5400, status: 'completed', date: '2026-01-08', method: 'Wire Transfer' },
        { id: 't9', invoice: 'INV-009', customer: 'George Lucas', email: 'george@example.com', amount: 920, status: 'failed', date: '2026-01-07', method: 'PayPal' },
        { id: 't10', invoice: 'INV-010', customer: 'Helen Mirren', email: 'helen@example.com', amount: 1500, status: 'completed', date: '2026-01-06', method: 'Credit Card' }
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
    user.id = Utils.generateId();
    state.users.push(user);
    saveState();
    notify('users');
    return user;
  }

  function updateUser(id, updates) {
    const idx = state.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    state.users[idx] = { ...state.users[idx], ...updates };
    saveState();
    notify('users');
    return state.users[idx];
  }

  function deleteUser(id) {
    state.users = state.users.filter(u => u.id !== id);
    saveState();
    notify('users');
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
  function getFilteredTransactions(search, status, sortBy, sortDir, page, perPage) {
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
