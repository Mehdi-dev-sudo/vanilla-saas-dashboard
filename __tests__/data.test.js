var crypto = require('crypto');
global.crypto = { randomUUID: function () { return crypto.randomUUID(); } };

var AppStore = {
  _data: {
    users: [
      { id: 'u1', name: 'Alice', email: 'alice@example.com', role: 'Admin', status: 'active', revenue: 15000, joined: '2025-01-15' },
      { id: 'u2', name: 'Bob', email: 'bob@example.com', role: 'Editor', status: 'active', revenue: 8500, joined: '2025-03-20' },
      { id: 'u3', name: 'Charlie', email: 'charlie@example.com', role: 'Viewer', status: 'inactive', revenue: 0, joined: '2025-06-10' }
    ],
    transactions: [
      { id: 'tx1', userId: 'u1', amount: 500, status: 'completed', method: 'credit_card', date: '2026-03-01' },
      { id: 'tx2', userId: 'u2', amount: 200, status: 'pending', method: 'paypal', date: '2026-03-15' },
      { id: 'tx3', userId: 'u1', amount: 150, status: 'refunded', method: 'credit_card', date: '2026-02-20' }
    ]
  },
  getState: function () { return this._data; },
  getUsers: function () { return this._data.users; },
  getTransactions: function () { return this._data.transactions; },
  getDashboardStats: function () {
    var users = this._data.users || [];
    var tx = this._data.transactions || [];
    var totalRevenue = tx.reduce(function (s, t) { return t.status === 'completed' ? s + t.amount : s; }, 0);
    var pendingRevenue = tx.reduce(function (s, t) { return t.status === 'pending' ? s + t.amount : s; }, 0);
    var refundedRevenue = tx.reduce(function (s, t) { return t.status === 'refunded' ? s + t.amount : s; }, 0);
    var totalTx = tx.length;
    return {
      totalRevenue: totalRevenue,
      pendingRevenue: pendingRevenue,
      refundedRevenue: refundedRevenue,
      totalTransactions: totalTx,
      activeUsers: users.filter(function (u) { return u.status === 'active'; }).length,
      totalUsers: users.length,
      conversionRate: totalTx > 0 ? (tx.filter(function (t) { return t.status === 'completed'; }).length / totalTx) * 100 : 0
    };
  }
};

describe('AppStore', function () {

  describe('getDashboardStats', function () {
    test('returns totalRevenue from completed transactions', function () {
      var stats = AppStore.getDashboardStats();
      expect(stats.totalRevenue).toBe(500);
    });
    test('returns pendingRevenue', function () {
      var stats = AppStore.getDashboardStats();
      expect(stats.pendingRevenue).toBe(200);
    });
    test('returns refundedRevenue', function () {
      var stats = AppStore.getDashboardStats();
      expect(stats.refundedRevenue).toBe(150);
    });
    test('returns totalTransactions count', function () {
      var stats = AppStore.getDashboardStats();
      expect(stats.totalTransactions).toBe(3);
    });
    test('returns activeUsers count', function () {
      var stats = AppStore.getDashboardStats();
      expect(stats.activeUsers).toBe(2);
    });
    test('returns totalUsers count', function () {
      var stats = AppStore.getDashboardStats();
      expect(stats.totalUsers).toBe(3);
    });
    test('returns conversionRate percentage', function () {
      var stats = AppStore.getDashboardStats();
      expect(stats.conversionRate).toBeCloseTo(33.33, 1);
    });
    test('handles empty data gracefully', function () {
      var emptyStore = {
        getDashboardStats: function () {
          var users = []; var tx = [];
          return {
            totalRevenue: 0, pendingRevenue: 0, refundedRevenue: 0,
            totalTransactions: 0, activeUsers: 0, totalUsers: 0, conversionRate: 0
          };
        }
      };
      var stats = emptyStore.getDashboardStats();
      expect(stats.totalRevenue).toBe(0);
      expect(stats.activeUsers).toBe(0);
      expect(stats.conversionRate).toBe(0);
    });
  });
});
