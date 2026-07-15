const AnalyticsPage = (function () {

  function render() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((m, i) => ({ month: m, value: 18000 + i * 1400 + Math.round(Math.sin(i) * 2000) }));
    const userData = months.map((m, i) => ({ month: m, value: 110 + i * 18 + Math.round(Math.sin(i * 1.3) * 25) }));
    const refundData = months.map((m, i) => ({ month: m, value: Math.round(200 + Math.sin(i * 0.8) * 120 + i * 15) }));

    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Analytics</h1>
          <p class="page-header__subtitle">Detailed metrics and performance trends</p>
        </div>
        <div class="page-header__actions">
          <button class="btn btn--secondary" id="analyticsExportBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Export Report
          </button>
          <button class="btn btn--primary" id="analyticsRefreshBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
      </div>

      <div class="analytics-grid">
        <div class="analytics-stat">
          <div class="analytics-stat__value" id="analyticsRevenue">$0</div>
          <div class="analytics-stat__label">Total Revenue</div>
          <div class="analytics-stat__trend analytics-stat__trend--up">↑ 12.5%</div>
        </div>
        <div class="analytics-stat">
          <div class="analytics-stat__value" id="analyticsAvgOrder">$0</div>
          <div class="analytics-stat__label">Avg. Order Value</div>
          <div class="analytics-stat__trend analytics-stat__trend--up">↑ 4.2%</div>
        </div>
        <div class="analytics-stat">
          <div class="analytics-stat__value" id="analyticsConversion">0%</div>
          <div class="analytics-stat__label">Conversion Rate</div>
          <div class="analytics-stat__trend analytics-stat__trend--up">↑ 0.8%</div>
        </div>
      </div>

      <div class="charts-grid">
        <div class="card chart-card">
          <div class="card__header">
            <div>
              <h3 class="card__title">Revenue Trend</h3>
              <span class="card__subtitle">Monthly revenue over time</span>
            </div>
            <div class="card__actions">
              <div class="chart-tabs">
                <button class="chart-tab active" data-period="yearly">Yearly</button>
                <button class="chart-tab" data-period="quarterly">Quarterly</button>
              </div>
            </div>
          </div>
          <div class="card__body">
            <canvas id="analyticsRevenueChart" height="280"></canvas>
          </div>
        </div>
        <div class="card chart-card">
          <div class="card__header">
            <div>
              <h3 class="card__title">User Acquisition</h3>
              <span class="card__subtitle">New users per month</span>
            </div>
          </div>
          <div class="card__body">
            <canvas id="analyticsUserChart" height="280"></canvas>
          </div>
        </div>
      </div>

      <div class="card chart-card">
        <div class="card__header">
          <div>
            <h3 class="card__title">Refund & Dispute Rate</h3>
            <span class="card__subtitle">Monthly refund amounts</span>
          </div>
        </div>
        <div class="card__body">
          <canvas id="analyticsRefundChart" height="250"></canvas>
        </div>
      </div>
    `;
  }

  function init() {
    const data = AppStore.getAnalyticsStats();
    Utils.animateValue(document.getElementById('analyticsRevenue'), 0, data.totalRevenue, 1200);
    Utils.animateValue(document.getElementById('analyticsAvgOrder'), 0, data.avgOrder, 1200);
    Utils.animatePercent(document.getElementById('analyticsConversion'), 0, data.conversion, 1200);

    drawCharts();

    document.getElementById('analyticsExportBtn').addEventListener('click', function () {
      ExportManager.exportAnalytics();
      ToastSystem.success(__('toast.analytics.exported'));
    });

    document.getElementById('analyticsRefreshBtn').addEventListener('click', function () {
      ToastSystem.info('Data refreshed successfully');
    });

    document.querySelectorAll('.chart-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
      });
    });

    return function cleanup() {};
  }

  function drawCharts() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = months.map((m, i) => ({ month: m, value: 18000 + i * 1400 + Math.round(Math.sin(i) * 2000) }));
    const userData = months.map((m, i) => ({ month: m, value: 110 + i * 18 + Math.round(Math.sin(i * 1.3) * 25) }));
    const refundData = months.map((m, i) => ({ month: m, value: Math.round(200 + Math.sin(i * 0.8) * 120 + i * 15) }));

    ChartEngine.drawLineChart('analyticsRevenueChart', revenueData, { height: 280, prefix: '$', divisor: 1000, suffix: 'k' });
    ChartEngine.drawBarChart('analyticsUserChart', userData, { height: 280 });
    ChartEngine.drawLineChart('analyticsRefundChart', refundData, { height: 250, prefix: '$', divisor: 1, suffix: '' });
  }

  function reinitCharts() {
    if (document.getElementById('analyticsRevenueChart')) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      ChartEngine.drawLineChart('analyticsRevenueChart', months.map((m, i) => ({ month: m, value: 18000 + i * 1400 + Math.round(Math.sin(i) * 2000) })), { height: 280, prefix: '$', divisor: 1000, suffix: 'k' });
    }
    if (document.getElementById('analyticsUserChart')) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      ChartEngine.drawBarChart('analyticsUserChart', months.map((m, i) => ({ month: m, value: 110 + i * 18 + Math.round(Math.sin(i * 1.3) * 25) })), { height: 280 });
    }
    if (document.getElementById('analyticsRefundChart')) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      ChartEngine.drawLineChart('analyticsRefundChart', months.map((m, i) => ({ month: m, value: Math.round(200 + Math.sin(i * 0.8) * 120 + i * 15) })), { height: 250 });
    }
  }

  return { render, init, reinitCharts };
})();
