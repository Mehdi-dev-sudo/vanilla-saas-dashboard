/**
 * TransactionsPage — Transaction listing with filtering, export, and detail view.
 * @module TransactionsPage
 */
const TransactionsPage = (function () {
  let currentPage = 1;
  let currentSearch = '';
  let currentStatus = 'all';
  let currentMethod = 'all';
  let sortBy = 'date';
  let sortDir = 'desc';
  const perPage = 5;

  function render() {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Transactions</h1>
          <p class="page-header__subtitle">View and manage all payment transactions</p>
        </div>
        <div class="page-header__actions">
          <button class="btn btn--secondary" id="exportCsvBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div class="card">
        <div class="users-toolbar">
          <div class="users-toolbar__left">
            <div class="search-input">
              <svg class="search-input__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="search-input__field" id="transactionSearch" placeholder="Search transactions..." aria-label="Search transactions">
            </div>
            <select class="form-select" id="transactionStatusFilter" aria-label="Filter by status">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select class="form-select" id="transactionMethodFilter" aria-label="Filter by method">
              <option value="all">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Wire Transfer">Wire Transfer</option>
              <option value="ACH">ACH</option>
            </select>
          </div>
          <div class="users-toolbar__right">
            <span class="pagination__info" id="transactionTotalInfo">0 transactions</span>
          </div>
        </div>
        <div class="card__body card__body--no-padding">
          <div class="table-wrapper">
            <table class="table" id="transactionTable">
              <thead>
                <tr>
                  <th data-sort="invoice">Invoice <span class="sort-icon"></span></th>
                  <th data-sort="customer">Customer <span class="sort-icon"></span></th>
                  <th data-sort="amount">Amount <span class="sort-icon"></span></th>
                  <th data-sort="status">Status <span class="sort-icon"></span></th>
                  <th data-sort="date">Date <span class="sort-icon"></span></th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody id="transactionsTableBody"></tbody>
            </table>
          </div>
        </div>
        <div class="pagination" id="transactionsPagination"></div>
      </div>
    `;
  }

  function init() {
    currentPage = 1;
    currentSearch = '';
    currentStatus = 'all';
    currentMethod = 'all';
    sortBy = 'date';
    sortDir = 'desc';

    renderTransactions();

    var searchInput = document.getElementById('transactionSearch');
    if (searchInput) searchInput.addEventListener('input', Utils.debounce(function () {
      currentSearch = this.value;
      currentPage = 1;
      var tbody = document.getElementById('transactionsTableBody');
      if (tbody) tbody.innerHTML = SkeletonLoader.getTableSkeleton(5);
      renderTransactions();
    }, 300));

    var statusFilter = document.getElementById('transactionStatusFilter');
    if (statusFilter) statusFilter.addEventListener('change', function () {
      currentStatus = this.value;
      currentPage = 1;
      var tbody = document.getElementById('transactionsTableBody');
      if (tbody) tbody.innerHTML = SkeletonLoader.getTableSkeleton(5);
      renderTransactions();
    });

    var methodFilter = document.getElementById('transactionMethodFilter');
    if (methodFilter) methodFilter.addEventListener('change', function () {
      currentMethod = this.value;
      currentPage = 1;
      var tbody = document.getElementById('transactionsTableBody');
      if (tbody) tbody.innerHTML = SkeletonLoader.getTableSkeleton(5);
      renderTransactions();
    });

    document.querySelectorAll('#transactionTable th[data-sort]').forEach(th => {
      th.addEventListener('click', function () {
        const key = this.dataset.sort;
        if (sortBy === key) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortBy = key;
          sortDir = 'asc';
        }
        renderTransactions();
      });
    });

    var exportBtn = document.getElementById('exportCsvBtn');
    if (exportBtn) exportBtn.addEventListener('click', function () {
      const allTransactions = AppStore.getState('transactions');
      AppStore.exportTransactionsCSV(allTransactions);
      if (typeof ToastSystem !== 'undefined') ToastSystem.success('CSV file exported successfully');
    });

    return function cleanup() {};
  }

  function renderTransactions() {
    const result = AppStore.getFilteredTransactions(currentSearch, currentStatus, sortBy, sortDir, currentPage, perPage, currentMethod);
    const tbody = document.getElementById('transactionsTableBody');
    const totalInfo = document.getElementById('transactionTotalInfo');
    const pagination = document.getElementById('transactionsPagination');

    if (result.items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-state__icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div><p class="empty-state__text">No transactions found</p><p class="empty-state__hint">Try adjusting your search or filter criteria</p></div></td></tr>';
    } else {
      tbody.innerHTML = result.items.map(t =>
        '<tr data-context="transaction" data-id="' + t.id + '" data-invoice="' + t.invoice + '">' +
          '<td><strong class="copyable" data-copy="' + Utils.escapeHtml(t.invoice) + '" style="cursor:pointer" onclick="copyToClipboard(decodeURIComponent(\'' + encodeURIComponent(t.invoice) + '\'))" data-tooltip="Copy invoice">' + Utils.escapeHtml(t.invoice) + '</strong></td>' +
          '<td>' + Utils.escapeHtml(t.customer) + '</td>' +
          '<td><strong>' + Utils.formatCurrency(t.amount) + '</strong></td>' +
          '<td><span class="status-badge status-badge--' + Utils.escapeHtml(t.status) + '">' + Utils.escapeHtml(t.status.charAt(0).toUpperCase() + t.status.slice(1)) + '</span></td>' +
          '<td>' + Utils.formatDate(t.date) + '</td>' +
          '<td>' + Utils.escapeHtml(t.method) + '</td>' +
        '</tr>'
      ).join('');
    }

    totalInfo.textContent = result.total + ' transaction' + (result.total !== 1 ? 's' : '');
    if (currentSearch && result.total > 0) {
      totalInfo.textContent = result.total + ' result' + (result.total !== 1 ? 's' : '') + ' for "' + Utils.escapeHtml(currentSearch) + '"';
    }

    document.querySelectorAll('#transactionTable th[data-sort]').forEach(th => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === sortBy) {
        th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });

    renderPagination(pagination, result);
  }

  function renderPagination(container, result) {
    if (result.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    html += '<button class="pagination__btn" id="prevTxPage" ' + (result.page <= 1 ? 'disabled' : '') + '>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>' +
    '</button><span class="pagination__info">Page ' + result.page + ' of ' + result.totalPages + '</span>';

    for (let i = 1; i <= result.totalPages; i++) {
      html += '<button class="pagination__btn' + (i === result.page ? ' active' : '') + '" data-tx-page="' + i + '">' + i + '</button>';
    }

    html += '<button class="pagination__btn" id="nextTxPage" ' + (result.page >= result.totalPages ? 'disabled' : '') + '>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
    '</button>';

    container.innerHTML = html;

    container.querySelectorAll('[data-tx-page]').forEach(btn => {
      btn.addEventListener('click', function () {
        currentPage = parseInt(this.dataset.txPage);
        renderTransactions();
      });
    });

    var prevTxPage = document.getElementById('prevTxPage');
    if (prevTxPage) prevTxPage.addEventListener('click', function () {
      if (currentPage > 1) { currentPage--; renderTransactions(); }
    });

    var nextTxPage = document.getElementById('nextTxPage');
    if (nextTxPage) nextTxPage.addEventListener('click', function () {
      if (currentPage < result.totalPages) { currentPage++; renderTransactions(); }
    });
  }

  return { render, init };
})();
