/**
 * DashboardPage — Main dashboard with stats, charts, transactions, and widgets.
 * @module DashboardPage
 */
const DashboardPage = (function () {
  var widgetOrder = [];
  var hiddenWidgets = [];

  function render() {
    var settings = AppStore.getState('settings');
    var savedOrder = loadWidgetOrder();

    var widgets = [
      { id: 'stats', title: __('dashboard.widget.keyMetrics'), render: renderStatsSection, default: true },
      { id: 'charts', title: __('dashboard.widget.charts'), render: renderChartsSection, default: true },
      { id: 'transactions', title: __('dashboard.widget.recentTransactions'), render: renderTransactionsSection, default: true },
      { id: 'traffic', title: __('dashboard.widget.trafficSources'), render: renderTrafficSection, default: true },
      { id: 'shortcuts', title: __('dashboard.widget.quickActions'), render: renderQuickActions, default: settings.showQuickActions !== false },
      { id: 'activity', title: __('dashboard.widget.recentActivity'), render: renderActivitySection, default: settings.showActivityLog !== false },
      { id: 'recentUsers', title: __('dashboard.widget.recentUsers'), render: renderRecentUsers, default: true }
    ];

    widgetOrder = savedOrder.length === widgets.length ? savedOrder : widgets.map(function (w) { return w.id; });
    hiddenWidgets = getHiddenWidgets();

    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">${__('dashboard.title')}</h1>
          <p class="page-header__subtitle">${__('dashboard.subtitle', { name: AuthManager.isLoggedIn ? AuthManager.getUser().name : '' })}</p>
        </div>
        <div class="page-header__actions">
          <button class="btn btn--ghost btn--sm" id="widgetConfigBtn" title="Configure widgets">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            ${__('dashboard.widgets.button')}
          </button>
          <button class="btn btn--secondary btn--sm" id="exportDashboardBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            ${__('dashboard.export.button')}
          </button>
        </div>
      </div>

      <div class="widget-config" id="widgetConfig" style="display:none">
        <div class="widget-config__header">
          <span class="widget-config__title">Configure Widgets</span>
          <button class="modal__close" id="widgetConfigClose"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div class="widget-config__list">
          ${widgets.map(function (w) {
            var isHidden = hiddenWidgets.indexOf(w.id) !== -1;
            return '<label class="widget-config__item"><input type="checkbox" ' + (!isHidden ? 'checked' : '') + ' data-widget="' + w.id + '"><span>' + w.title + '</span></label>';
          }).join('')}
        </div>
      </div>

      <div class="dashboard-widgets" id="dashboardWidgets">
        ${widgetOrder.map(function (id) {
          var widget = widgets.find(function (w) { return w.id === id; });
          if (!widget || hiddenWidgets.indexOf(id) !== -1) return '';
          return '<div class="widget" data-widget-id="' + id + '">' + widget.render() + '</div>';
        }).join('')}
      </div>
    `;
  }

  function renderStatsSection() {
    var stats = AppStore.getDashboardStats();
    return `
      <div class="stats" id="statsContainer">
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
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
    `;
  }

  function renderChartsSection() {
    return `
      <div class="charts-grid" style="margin-top:0">
        <div class="card chart-card">
          <div class="card__header">
            <div>
              <h3 class="card__title">Revenue Overview</h3>
              <span class="card__subtitle">Monthly revenue for the past 12 months</span>
            </div>
            <button class="btn btn--ghost btn--sm" onclick="ChartEngine.downloadChart('dashRevenueChart','revenue_overview.png')" data-tooltip="Download chart">Download</button>
          </div>
          <div class="card__body">
            <canvas id="dashRevenueChart" height="280"></canvas>
          </div>
        </div>
        <div class="card chart-card">
          <div class="card__header">
            <div>
              <h3 class="card__title">User Growth</h3>
              <span class="card__subtitle">New users acquired per month</span>
            </div>
            <button class="btn btn--ghost btn--sm" onclick="ChartEngine.downloadChart('dashUserChart','user_growth.png')" data-tooltip="Download chart">Download</button>
          </div>
          <div class="card__body">
            <canvas id="dashUserChart" height="280"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  function renderTransactionsSection() {
    var transactions = AppStore.getState('transactions').slice(0, 5);
    return `
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
              <thead><tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                ${transactions.length === 0 ? '<tr><td colspan="5"><div class="empty-state" style="padding:var(--space-3xl)"><div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><p class="empty-state__text">No transactions yet</p></div></td></tr>' :
                  transactions.map(function (t) {
                  return '<tr data-context="transaction" data-id="' + t.id + '" data-invoice="' + t.invoice + '">' +
                    '<td><strong>' + t.invoice + '</strong></td>' +
                    '<td>' + Utils.escapeHtml(t.customer) + '</td>' +
                    '<td><strong>' + Utils.formatCurrency(t.amount) + '</strong></td>' +
                    '<td><span class="status-badge status-badge--' + t.status + '">' + Utils.escapeHtml(t.status.charAt(0).toUpperCase() + t.status.slice(1)) + '</span></td>' +
                    '<td>' + Utils.formatShortDate(t.date) + '</td>' +
                  '</tr>';
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderTrafficSection() {
    return `
      <div class="card">
        <div class="card__header">
          <div>
            <h3 class="card__title">Traffic Sources</h3>
            <span class="card__subtitle">Where your visitors come from</span>
          </div>
        </div>
        <div class="card__body card__body--center">
          <canvas id="dashTrafficChart" width="180" height="180"></canvas>
          <div class="traffic-legend" id="dashTrafficLegend"></div>
        </div>
      </div>
    `;
  }

  function renderQuickActions() {
    return `
      <div class="card quick-actions-card">
        <div class="card__header"><h3 class="card__title">Quick Actions</h3><span class="card__subtitle">Common tasks</span></div>
        <div class="card__body">
          <div class="quick-actions">
            <button class="quick-action" onclick="Router.navigate('users');setTimeout(function(){document.getElementById('addUserBtn')&&document.getElementById('addUserBtn').click()},200)">
              <span class="quick-action__icon quick-action__icon--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </span>
              <span class="quick-action__label">Add User</span>
            </button>
            <button class="quick-action" onclick="AppStore.exportTransactionsCSV(AppStore.getState('transactions'));ToastSystem.success('CSV exported')">
              <span class="quick-action__icon quick-action__icon--success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </span>
              <span class="quick-action__label">Export CSV</span>
            </button>
            <button class="quick-action" onclick="ThemeManager.toggle();ToastSystem.info('Theme:'+ThemeManager.getCurrent())">
              <span class="quick-action__icon quick-action__icon--warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/></svg>
              </span>
              <span class="quick-action__label">Toggle Theme</span>
            </button>
            <button class="quick-action" onclick="CommandPalette.open()">
              <span class="quick-action__icon quick-action__icon--info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <span class="quick-action__label">Quick Search</span>
            </button>
            <button class="quick-action" onclick="Router.navigate('settings')">
              <span class="quick-action__icon quick-action__icon--primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06"/></svg>
              </span>
              <span class="quick-action__label">Settings</span>
            </button>
            <button class="quick-action" onclick="HistoryManager.undo()">
              <span class="quick-action__icon quick-action__icon--danger">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </span>
              <span class="quick-action__label">Undo</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderActivitySection() {
    var activities = ActivityLog.getRecent(5);
    var iconMap = { user: 'user-plus', delete: 'trash-2', edit: 'edit-3', export: 'download', theme: 'sun', create: 'user-plus', undo: 'rotate-ccw', redo: 'rotate-cw', auth: 'log-in', info: 'info' };
    return `
      <div class="card">
        <div class="card__header">
          <div>
            <h3 class="card__title">Recent Activity</h3>
            <span class="card__subtitle">Latest actions and events</span>
          </div>
          <button class="card__link" onclick="ActivityLog.clear();DashboardPage.refresh()">Clear</button>
        </div>
        <div class="card__body">
          <div class="activity-feed">
            ${activities.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--text-tertiary);font-size:var(--font-sm)">No recent activity</div>' :
              activities.map(function (a) {
                return '<div class="activity-item">' +
                  '<div class="activity-item__icon activity-item__icon--' + a.type + '">' +
                    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' +
                  '</div>' +
                  '<div class="activity-item__content">' +
                    '<div class="activity-item__text"><strong>' + a.action + '</strong> ' + a.detail + '</div>' +
                    '<div class="activity-item__time">' + ActivityLog.formatDate(a.timestamp) + '</div>' +
                  '</div>' +
                '</div>';
              }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderRecentUsers() {
    var users = AppStore.getState('users').slice(0, 5);
    return `
      <div class="card">
        <div class="card__header">
          <div>
            <h3 class="card__title">Recent Users</h3>
            <span class="card__subtitle">Latest team members</span>
          </div>
          <a class="card__link" onclick="Router.navigate('users')">View All</a>
        </div>
        <div class="card__body" style="padding-top:var(--space-sm)">
          ${users.length === 0 ? '<div class="empty-state" style="padding:var(--space-3xl)"><div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><p class="empty-state__text">No users yet</p></div>' :
            users.map(function (u) {
            var initials = u.name.split(' ').map(function (n) { return n[0]; }).join('').slice(0, 2);
            var avatarColor = Utils.stringToColor ? Utils.stringToColor(u.name) : '#6366f1';
            return '<div class="activity-item">' +
              '<div class="user-avatar-sm" style="width:36px;height:36px;font-size:12px;margin-top:2px;background:' + avatarColor + '">' + initials + '</div>' +
              '<div class="activity-item__content">' +
                '<div class="activity-item__text"><strong>' + Utils.escapeHtml(u.name) + '</strong></div>' +
                '<div class="activity-item__time">' + Utils.escapeHtml(u.role + ' - ' + u.plan + ' Plan') + '</div>' +
              '</div>' +
              '<span class="status-badge status-badge--' + u.status + '">' + Utils.escapeHtml(u.status.charAt(0).toUpperCase() + u.status.slice(1)) + '</span>' +
            '</div>';
          }).join('')}
        </div>
      </div>
    `;
  }

  function init() {
    var stats = AppStore.getDashboardStats();
    animateStats(stats);
    requestAnimationFrame(function () { drawCharts(); });
    startRealtimeUpdates();
    setupWidgetConfig();
    setupDragReorder();

    document.getElementById('exportDashboardBtn').addEventListener('click', function () {
      ExportManager.exportDashboard();
      ToastSystem.success(__('toast.dashboard.exported'));
    });

    return function cleanup() { cancelAnimationFrames(); stopRealtimeUpdates(); };
  }

  function animateStats(stats) {
    Utils.animateValue(document.getElementById('statRevenue'), 0, stats.revenue.value, 1200);
    Utils.animateValue(document.getElementById('statUsers'), 0, stats.users.value, 1200);
    Utils.animateValue(document.getElementById('statSubscribers'), 0, stats.subscribers.value, 1200);
    Utils.animatePercent(document.getElementById('statChurn'), 0, stats.churn.value, 1200);
  }

  var realtimeInterval = null;

  function generateRealtimeData() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var base = Date.now() / 10000;
    return months.map(function (m, i) {
      var sinShift = Math.sin(i * 0.8 + base);
      return { month: m, value: Math.max(5000, 18000 + i * 1400 + Math.round(sinShift * 3000 + 1000)) };
    });
  }

  function generateRealtimeUserData() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var base = Date.now() / 12000;
    return months.map(function (m, i) {
      return { month: m, value: Math.max(50, 110 + i * 18 + Math.round(Math.sin(i * 1.3 + base) * 30 + 15)) };
    });
  }

  function startRealtimeUpdates() {
    if (realtimeInterval) clearInterval(realtimeInterval);
    realtimeInterval = setInterval(function () {
      var revChart = document.getElementById('dashRevenueChart');
      var userChart = document.getElementById('dashUserChart');
      if (!revChart || !userChart) return;
      var revenueData = generateRealtimeData();
      var userData = generateRealtimeUserData();
      ChartEngine.drawLineChart('dashRevenueChart', revenueData, { height: 280, prefix: '$', divisor: 1000, suffix: 'k', animate: true });
      ChartEngine.drawBarChart('dashUserChart', userData, { height: 280, animate: true });
    }, 5000);
  }

  function stopRealtimeUpdates() {
    if (realtimeInterval) { clearInterval(realtimeInterval); realtimeInterval = null; }
  }

  function drawCharts() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var base = Date.now() / 10000;
    var revenueData = months.map(function (m, i) {
      var sinShift = Math.sin(i * 0.8 + base);
      return { month: m, value: Math.max(5000, 18000 + i * 1400 + Math.round(sinShift * 3000 + 1000)) };
    });
    var userData = months.map(function (m, i) {
      return { month: m, value: Math.max(50, 110 + i * 18 + Math.round(Math.sin(i * 1.3 + base) * 30 + 15)) };
    });
    var trafficData = [
      { label: 'Organic', value: 42, color: '#6366f1' },
      { label: 'Social', value: 26, color: '#10b981' },
      { label: 'Direct', value: 18, color: '#f59e0b' },
      { label: 'Referral', value: 10, color: '#8b5cf6' },
      { label: 'Email', value: 4, color: '#ef4444' }
    ];

    if (document.getElementById('dashRevenueChart')) ChartEngine.drawLineChart('dashRevenueChart', revenueData, { height: 280, prefix: '$', divisor: 1000, suffix: 'k' });
    if (document.getElementById('dashUserChart')) ChartEngine.drawBarChart('dashUserChart', userData, { height: 280 });
    if (document.getElementById('dashTrafficChart')) {
      ChartEngine.drawDonutChart('dashTrafficChart', trafficData, {
        size: 180,
        renderLegend: function (data) {
          var el = document.getElementById('dashTrafficLegend');
          if (el) el.innerHTML = data.map(function (d) { return '<div class="legend-item"><span class="legend-item__dot" style="background:' + d.color + '"></span>' + d.label + '<span class="legend-item__value">' + d.value + '%</span></div>'; }).join('');
        }
      });
    }
  }

  function setupWidgetConfig() {
    var configBtn = document.getElementById('widgetConfigBtn');
    var config = document.getElementById('widgetConfig');
    var closeBtn = document.getElementById('widgetConfigClose');
    if (!configBtn || !config || !closeBtn) return;

    configBtn.addEventListener('click', function () { config.style.display = config.style.display === 'none' ? 'block' : 'none'; });
    closeBtn.addEventListener('click', function () { config.style.display = 'none'; });

    config.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var id = this.dataset.widget;
        var hide = !this.checked;
        if (hide) { if (hiddenWidgets.indexOf(id) === -1) hiddenWidgets.push(id); }
        else { hiddenWidgets = hiddenWidgets.filter(function (h) { return h !== id; }); }
        saveHiddenWidgets();
        var widget = document.querySelector('[data-widget-id="' + id + '"]');
        if (widget) {
          widget.style.display = hide ? 'none' : '';
          if (!hide && (id === 'charts' || id === 'traffic')) {
            requestAnimationFrame(function () { drawCharts(); });
          }
        }
      });
    });
  }

  function setupDragReorder() {
    var container = document.getElementById('dashboardWidgets');
    if (!container) return;
    var items = container.querySelectorAll('.widget');
    items.forEach(function (item) {
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', this.dataset.widgetId);
        this.classList.add('dragging');
      });
      item.addEventListener('dragend', function () { this.classList.remove('dragging'); });
      item.addEventListener('dragover', function (e) { e.preventDefault(); });
      item.addEventListener('drop', function (e) {
        e.preventDefault();
        var id = e.dataTransfer.getData('text/plain');
        var fromIdx = widgetOrder.indexOf(id);
        var toIdx = widgetOrder.indexOf(this.dataset.widgetId);
        if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
          widgetOrder.splice(fromIdx, 1);
          widgetOrder.splice(toIdx, 0, id);
          saveWidgetOrder();
          refresh();
        }
      });
    });
  }

  function loadWidgetOrder() {
    return SafeStorage.getObject('saas_widget_order') || [];
  }

  function saveWidgetOrder() {
    SafeStorage.setObject('saas_widget_order', widgetOrder);
  }

  function getHiddenWidgets() {
    return SafeStorage.getObject('saas_hidden_widgets') || [];
  }

  function saveHiddenWidgets() {
    SafeStorage.setObject('saas_hidden_widgets', hiddenWidgets);
  }

  var animFrameIds = [];
  function cancelAnimationFrames() {
    animFrameIds.forEach(function (id) { cancelAnimationFrame(id); });
    animFrameIds = [];
  }

  function refresh() {
    var contentEl = document.getElementById('appContent');
    if (!contentEl) return;
    var statsSection = contentEl.querySelector('.stats');
    if (statsSection) {
      statsSection.outerHTML = renderStatsSection();
    }
    reinitCharts();
  }

  function reinitCharts() {
    if (document.getElementById('dashRevenueChart')) drawCharts();
  }

  return { render: render, init: init, refresh: refresh, reinitCharts: reinitCharts, startRealtimeUpdates: startRealtimeUpdates, stopRealtimeUpdates: stopRealtimeUpdates };
})();
