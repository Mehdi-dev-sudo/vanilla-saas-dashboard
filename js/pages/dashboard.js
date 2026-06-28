const DashboardPage = (function () {
  let chartInstances = [];

  function render() {
    const stats = AppStore.getDashboardStats();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((m, i) => ({ month: m, value: 18000 + i * 1400 + Math.round(Math.sin(i) * 2000) }));
    const userData = months.map((m, i) => ({ month: m, value: 110 + i * 18 + Math.round(Math.sin(i * 1.3) * 25) }));
    const trafficData = [
      { label: 'Organic', value: 42, color: '#6366f1' },
      { label: 'Social', value: 26, color: '#10b981' },
      { label: 'Direct', value: 18, color: '#f59e0b' },
      { label: 'Referral', value: 10, color: '#8b5cf6' },
      { label: 'Email', value: 4, color: '#ef4444' }
    ];
    const transactions = AppStore.getState('transactions').slice(0, 5);
    const activities = [
      { type: 'user', text: 'New user registered: <strong>Sarah Lee</strong>', time: new Date(Date.now() - 5 * 60000).toISOString() },
      { type: 'payment', text: 'Payment received: <strong>$2,400</strong> from TechCorp', time: new Date(Date.now() - 2 * 3600000).toISOString() },
      { type: 'subscription', text: 'New subscription: <strong>Premium Plan</strong> - David Kim', time: new Date(Date.now() - 5 * 3600000).toISOString() },
      { type: 'ticket', text: 'Support ticket closed: <strong>#TK-1024</strong>', time: new Date(Date.now() - 24 * 3600000).toISOString() },
      { type: 'deploy', text: 'Server deployment completed: <strong>v2.4.1</strong>', time: new Date(Date.now() - 36 * 3600000).toISOString() }
    ];

    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Dashboard</h1>
          <p class="page-header__subtitle">Welcome back, Ali! Here's what's happening today.</p>
        </div>
        <div class="page-header__actions">
          <button class="btn btn--secondary" id="exportDashboardBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Export
          </button>
          <button class="btn btn--primary" id="newReportBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Report
          </button>
        </div>
      </div>

      <div class="stats">
        <div class="stat-card stat-card--primary">
          <div class="stat-card__icon stat-card__icon--primary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__label">Total Revenue</span>
            <span class="stat-card__value" id="statRevenue">$0</span>
          </div>
          <div class="stat-card__change stat-card__change--up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span>12.5%</span>
          </div>
        </div>
        <div class="stat-card stat-card--success">
          <div class="stat-card__icon stat-card__icon--success">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__label">Active Users</span>
            <span class="stat-card__value" id="statUsers">0</span>
          </div>
          <div class="stat-card__change stat-card__change--up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span>8.2%</span>
          </div>
        </div>
        <div class="stat-card stat-card--warning">
          <div class="stat-card__icon stat-card__icon--warning">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__label">Subscribers</span>
            <span class="stat-card__value" id="statSubscribers">0</span>
          </div>
          <div class="stat-card__change stat-card__change--up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
            <span>3.1%</span>
          </div>
        </div>
        <div class="stat-card stat-card--danger">
          <div class="stat-card__icon stat-card__icon--danger">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__label">Churn Rate</span>
            <span class="stat-card__value" id="statChurn">0%</span>
          </div>
          <div class="stat-card__change stat-card__change--down">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            <span>0.8%</span>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="card chart-card">
          <div class="card__header">
            <div>
              <h3 class="card__title">Revenue Overview</h3>
              <span class="card__subtitle">Monthly revenue for the past 12 months</span>
            </div>
          </div>
          <div class="card__body">
            <canvas id="dashRevenueChart" height="300"></canvas>
          </div>
        </div>
        <div class="card chart-card">
          <div class="card__header">
            <div>
              <h3 class="card__title">User Growth</h3>
              <span class="card__subtitle">New users acquired per month</span>
            </div>
          </div>
          <div class="card__body">
            <canvas id="dashUserChart" height="300"></canvas>
          </div>
        </div>
      </div>

      <div class="bottom-section">
        <div class="card">
          <div class="card__header">
            <div>
              <h3 class="card__title">Recent Transactions</h3>
              <span class="card__subtitle">Latest payment activities</span>
            </div>
            <a class="card__link" onclick="Router.navigate('transactions')">View All</a>
          </div>
          <div class="card__body card__body--no-padding">
            <div class="table-wrapper">
              <table class="table">
                <thead>
                  <tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  ${transactions.map(t =>
                    `<tr>
                      <td><strong>${t.invoice}</strong></td>
                      <td>${Utils.escapeHtml(t.customer)}</td>
                      <td><strong>${Utils.formatCurrency(t.amount)}</strong></td>
                      <td><span class="status-badge status-badge--${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
                      <td>${Utils.formatShortDate(t.date)}</td>
                    </tr>`
                  ).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card__header">
            <div>
              <h3 class="card__title">Traffic Sources</h3>
              <span class="card__subtitle">Where your visitors come from</span>
            </div>
          </div>
          <div class="card__body card__body--center">
            <canvas id="dashTrafficChart" width="200" height="200"></canvas>
            <div class="traffic-legend" id="dashTrafficLegend"></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__header">
          <div>
            <h3 class="card__title">Recent Activity</h3>
            <span class="card__subtitle">Latest events and updates</span>
          </div>
        </div>
        <div class="card__body">
          <div class="activity-feed">
            ${activities.map(a => `
              <div class="activity-item">
                <div class="activity-item__icon activity-item__icon--${a.type}">
                  ${({user:'👤',payment:'💳',subscription:'⭐',ticket:'🎫',deploy:'🚀'})[a.type] || '📌'}
                </div>
                <div class="activity-item__content">
                  <div class="activity-item__text">${a.text}</div>
                  <div class="activity-item__time">${Utils.timeAgo(a.time)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function init() {
    const stats = AppStore.getDashboardStats();
    animateStats(stats);

    drawCharts();

    document.getElementById('exportDashboardBtn').addEventListener('click', function () {
      ToastSystem.success('Dashboard data exported successfully');
    });

    document.getElementById('newReportBtn').addEventListener('click', function () {
      ToastSystem.info('Report generation started. You will be notified when ready.');
    });

    return function cleanup() {
      chartInstances.forEach(id => cancelAnimationFrame(id));
      chartInstances = [];
    };
  }

  function animateStats(stats) {
    Utils.animateValue(document.getElementById('statRevenue'), 0, stats.revenue.value, 1200);
    Utils.animateValue(document.getElementById('statUsers'), 0, stats.users.value, 1200);
    Utils.animateValue(document.getElementById('statSubscribers'), 0, stats.subscribers.value, 1200);
    Utils.animatePercent(document.getElementById('statChurn'), 0, stats.churn.value, 1200);
  }

  function drawCharts() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((m, i) => ({ month: m, value: 18000 + i * 1400 + Math.round(Math.sin(i) * 2000) }));
    const userData = months.map((m, i) => ({ month: m, value: 110 + i * 18 + Math.round(Math.sin(i * 1.3) * 25) }));
    const trafficData = [
      { label: 'Organic', value: 42, color: '#6366f1' },
      { label: 'Social', value: 26, color: '#10b981' },
      { label: 'Direct', value: 18, color: '#f59e0b' },
      { label: 'Referral', value: 10, color: '#8b5cf6' },
      { label: 'Email', value: 4, color: '#ef4444' }
    ];

    ChartEngine.drawLineChart('dashRevenueChart', revenueData, { height: 300, prefix: '$', divisor: 1000, suffix: 'k' });
    ChartEngine.drawBarChart('dashUserChart', userData, { height: 300 });

    ChartEngine.drawDonutChart('dashTrafficChart', trafficData, {
      size: 200,
      renderLegend: function (data) {
        const el = document.getElementById('dashTrafficLegend');
        if (el) {
          el.innerHTML = data.map(d =>
            '<div class="legend-item">' +
              '<span class="legend-item__dot" style="background:' + d.color + '"></span>' +
              d.label +
              '<span class="legend-item__value">' + d.value + '%</span>' +
            '</div>'
          ).join('');
        }
      }
    });
  }

  function reinitCharts() {
    const canvas = document.getElementById('dashRevenueChart');
    if (canvas) ChartEngine.drawLineChart('dashRevenueChart', [], { height: 300, prefix: '$', divisor: 1000, suffix: 'k' });
    if (document.getElementById('dashUserChart')) ChartEngine.drawBarChart('dashUserChart', [], { height: 300 });
    if (document.getElementById('dashTrafficChart')) {
      const trafficData = [
        { label: 'Organic', value: 42, color: '#6366f1' },
        { label: 'Social', value: 26, color: '#10b981' },
        { label: 'Direct', value: 18, color: '#f59e0b' },
        { label: 'Referral', value: 10, color: '#8b5cf6' },
        { label: 'Email', value: 4, color: '#ef4444' }
      ];
      ChartEngine.drawDonutChart('dashTrafficChart', trafficData, { size: 200 });
    }
  }

  return { render, init, reinitCharts };
})();
