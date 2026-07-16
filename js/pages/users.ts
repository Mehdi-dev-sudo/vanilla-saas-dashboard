const UsersPage = (function () {
  let currentPage = 1;
  let currentSearch = '';
  let currentStatus = 'all';
  let currentRole = 'all';
  const perPage = 5;

  function render() {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-header__title">Users</h1>
          <p class="page-header__subtitle">Manage your team members and their permissions</p>
        </div>
        <div class="page-header__actions">
          <button class="btn btn--primary" id="addUserBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add User
          </button>
        </div>
      </div>

      <div class="card">
        <div class="users-toolbar">
          <div class="users-toolbar__left">
            <div class="search-input">
              <svg class="search-input__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" class="search-input__field" id="userSearch" placeholder="Search users..." aria-label="Search users">
            </div>
            <select class="form-select" id="userStatusFilter" aria-label="Filter by status">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select class="form-select" id="userRoleFilter" aria-label="Filter by role">
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div class="users-toolbar__right">
            <span class="pagination__info" id="userTotalInfo">0 users</span>
          </div>
        </div>
        <div class="card__body card__body--no-padding">
          <div class="table-wrapper">
            <div class="batch-actions" id="batchActions" style="display:none">
              <span id="selectedCount">0 selected</span>
              <button class="btn btn--sm btn--danger" id="batchDeleteBtn">Delete Selected</button>
              <button class="btn btn--sm btn--secondary" id="batchExportBtn">Export Selected</button>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th style="width:40px"><input type="checkbox" id="selectAllUsers" aria-label="Select all"></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="usersTableBody"></tbody>
            </table>
          </div>
        </div>
        <div class="pagination" id="usersPagination"></div>
      </div>
    `;
  }

  function init() {
    currentPage = 1;
    currentSearch = '';
    currentStatus = 'all';
    currentRole = 'all';

    renderUsers();

    const searchInput = document.getElementById('userSearch');
    searchInput.addEventListener('input', Utils.debounce(function () {
      currentSearch = this.value;
      currentPage = 1;
      document.getElementById('usersTableBody').innerHTML = SkeletonLoader.getTableSkeleton(5);
      renderUsers();
    }, 300));

    document.getElementById('userStatusFilter').addEventListener('change', function () {
      currentStatus = this.value;
      currentPage = 1;
      document.getElementById('usersTableBody').innerHTML = SkeletonLoader.getTableSkeleton(5);
      renderUsers();
    });

    document.getElementById('userRoleFilter').addEventListener('change', function () {
      currentRole = this.value;
      currentPage = 1;
      document.getElementById('usersTableBody').innerHTML = SkeletonLoader.getTableSkeleton(5);
      renderUsers();
    });

    document.getElementById('addUserBtn').addEventListener('click', showAddUserModal);
    setupMultiSelect();

    return function cleanup() {
      currentPage = 1; currentSearch = ''; currentStatus = 'all'; currentRole = 'all';
    };
  }

  function setupMultiSelect() {
    var selectAll = document.getElementById('selectAllUsers');
    var batchActions = document.getElementById('batchActions');
    var selectedCount = document.getElementById('selectedCount');

    selectAll.addEventListener('change', function () {
      document.querySelectorAll('.user-checkbox').forEach(function (cb) { cb.checked = selectAll.checked; });
      updateBatchVisibility();
    });

    document.getElementById('batchDeleteBtn').addEventListener('click', function () {
      var selected = getSelectedUsers();
      if (selected.length === 0) return;
      ModalSystem.confirm('Delete Users', 'Are you sure you want to delete ' + selected.length + ' selected user(s)?', 'Delete', 'Cancel', function () {
        selected.forEach(function (id) { AppStore.deleteUser(id); });
        ToastSystem.success(selected.length + ' user(s) deleted');
        renderUsers();
      });
    });

    document.getElementById('batchExportBtn').addEventListener('click', function () {
      var selected = getSelectedUsers();
      if (selected.length === 0) return;
      ToastSystem.success(selected.length + ' user(s) exported');
    });
  }

  function getSelectedUsers() {
    var ids = [];
    document.querySelectorAll('.user-checkbox:checked').forEach(function (cb) { ids.push(cb.dataset.id); });
    return ids;
  }

  function updateBatchVisibility() {
    var batchActions = document.getElementById('batchActions');
    var selectedCount = document.getElementById('selectedCount');
    var count = getSelectedUsers().length;
    if (count > 0) {
      batchActions.style.display = 'flex';
      selectedCount.textContent = count + ' selected';
    } else {
      batchActions.style.display = 'none';
    }
  }

  function renderUsers() {
    const result = AppStore.getFilteredUsers(currentSearch, currentStatus, currentRole, currentPage, perPage);
    const tbody = document.getElementById('usersTableBody');
    const totalInfo = document.getElementById('userTotalInfo');
    const pagination = document.getElementById('usersPagination');

    if (result.items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><div class="empty-state__icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><p class="empty-state__text">No users found</p><p class="empty-state__hint">Try adjusting your search or filter criteria</p></div></td></tr>';
    } else {
      tbody.innerHTML = result.items.map(u => {
        const initials = u.name.split(' ').map(n => n[0]).join('').slice(0, 2);
        var avatarColor = Utils.stringToColor ? Utils.stringToColor(u.name) : '#6366f1';
        return '<tr data-context="user" data-id="' + u.id + '" data-email="' + Utils.escapeHtml(u.email) + '">' +
          '<td><input type="checkbox" class="user-checkbox" data-id="' + u.id + '" aria-label="Select ' + Utils.escapeHtml(u.name) + '"></td>' +
          '<td><div class="flex items-center gap-sm"><span class="user-avatar-sm" style="background:' + avatarColor + '">' + initials + '</span> <strong>' + Utils.escapeHtml(u.name) + '</strong></div></td>' +
          '<td>' + Utils.escapeHtml(u.email) + '</td>' +
          '<td>' + u.role + '</td>' +
          '<td>' + u.plan + '</td>' +
          '<td><span class="status-badge status-badge--' + u.status + '">' + u.status.charAt(0).toUpperCase() + u.status.slice(1) + '</span></td>' +
          '<td><strong>' + Utils.formatCurrency(u.revenue) + '</strong></td>' +
          '<td>' +
            '<div class="flex gap-sm">' +
              '<button class="btn btn--sm btn--ghost edit-user-btn" data-id="' + u.id + '">Edit</button>' +
              '<button class="btn btn--sm btn--ghost delete-user-btn" data-id="' + u.id + '" style="color:var(--clr-danger)">Delete</button>' +
            '</div>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    totalInfo.textContent = result.total + ' user' + (result.total !== 1 ? 's' : '');
    if (currentSearch && result.total > 0) {
      totalInfo.textContent = result.total + ' result' + (result.total !== 1 ? 's' : '') + ' for "' + Utils.escapeHtml(currentSearch) + '"';
    }

    renderPagination(pagination, result);

    tbody.querySelectorAll('.edit-user-btn').forEach(btn => {
      btn.addEventListener('click', function () { showEditUserModal(this.dataset.id); });
    });
    tbody.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', function () { confirmDeleteUser(this.dataset.id); });
    });
    tbody.querySelectorAll('.user-checkbox').forEach(cb => {
      cb.addEventListener('change', function () { updateBatchVisibility(); });
    });
  }

  function renderPagination(container, result) {
    if (result.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    html += '<button class="pagination__btn" id="prevPage" ' + (result.page <= 1 ? 'disabled' : '') + '>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>' +
    '</button><span class="pagination__info">Page ' + result.page + ' of ' + result.totalPages + '</span>';

    for (let i = 1; i <= result.totalPages; i++) {
      html += '<button class="pagination__btn' + (i === result.page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }

    html += '<button class="pagination__btn" id="nextPage" ' + (result.page >= result.totalPages ? 'disabled' : '') + '>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
    '</button>';

    container.innerHTML = html;

    container.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', function () {
        currentPage = parseInt(this.dataset.page);
        renderUsers();
      });
    });

    document.getElementById('prevPage').addEventListener('click', function () {
      if (currentPage > 1) { currentPage--; renderUsers(); }
    });

    document.getElementById('nextPage').addEventListener('click', function () {
      if (currentPage < result.totalPages) { currentPage++; renderUsers(); }
    });
  }

  function showAddUserModal() {
    const html =
      '<div class="form-row">' +
        '<div class="form-group"><label class="form-label" for="uName">Full Name <span class="form-label__required">*</span></label><input type="text" class="form-input" id="uName" name="name" required></div>' +
        '<div class="form-group"><label class="form-label" for="uEmail">Email <span class="form-label__required">*</span></label><input type="email" class="form-input" id="uEmail" name="email" required></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label class="form-label" for="uRole">Role</label><select class="form-select" id="uRole" name="role"><option>Admin</option><option selected>Editor</option><option>Viewer</option></select></div>' +
        '<div class="form-group"><label class="form-label" for="uPlan">Plan</label><select class="form-select" id="uPlan" name="plan"><option>Free</option><option selected>Pro</option><option>Enterprise</option></select></div>' +
      '</div>';

    ModalSystem.form('Add New User', html, 'Add User', function (data) {
      var errors = [];
      var nameInput = document.getElementById('uName');
      var emailInput = document.getElementById('uEmail');

      nameInput.classList.remove('form-input--error');
      emailInput.classList.remove('form-input--error');

      if (!data.name || data.name.trim() === '') { errors.push('Name is required'); if (nameInput) nameInput.classList.add('form-input--error'); }
      if (!data.email || data.email.trim() === '') { errors.push('Email is required'); if (emailInput) emailInput.classList.add('form-input--error'); }
      if (data.email && !data.email.includes('@')) { errors.push('Invalid email format'); if (emailInput) emailInput.classList.add('form-input--error'); }

      if (errors.length > 0) {
        errors.forEach(function (e) { ToastSystem.error(e); });
        return;
      }

      AppStore.addUser({
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role || 'Editor',
        plan: data.plan || 'Pro',
        status: 'active',
        joined: new Date().toISOString().slice(0, 10),
        revenue: 0
      });

      ToastSystem.success('User "' + Utils.escapeHtml(data.name.trim()) + '" added successfully');
      renderUsers();
    });
  }

  function showEditUserModal(id) {
    const user = AppStore.getUser(id);
    if (!user) return;

    const html =
      '<input type="hidden" name="id" value="' + id + '">' +
      '<div class="form-row">' +
        '<div class="form-group"><label class="form-label" for="uEditName">Full Name</label><input type="text" class="form-input" id="uEditName" name="name" value="' + Utils.escapeHtml(user.name) + '" required></div>' +
        '<div class="form-group"><label class="form-label" for="uEditEmail">Email</label><input type="email" class="form-input" id="uEditEmail" name="email" value="' + Utils.escapeHtml(user.email) + '" required></div>' +
      '</div>' +
      '<div class="form-row">' +
        '<div class="form-group"><label class="form-label" for="uEditRole">Role</label><select class="form-select" id="uEditRole" name="role">' +
          '<option' + (user.role === 'Admin' ? ' selected' : '') + '>Admin</option>' +
          '<option' + (user.role === 'Editor' ? ' selected' : '') + '>Editor</option>' +
          '<option' + (user.role === 'Viewer' ? ' selected' : '') + '>Viewer</option>' +
        '</select></div>' +
        '<div class="form-group"><label class="form-label" for="uEditStatus">Status</label><select class="form-select" id="uEditStatus" name="status">' +
          '<option value="active"' + (user.status === 'active' ? ' selected' : '') + '>Active</option>' +
          '<option value="inactive"' + (user.status === 'inactive' ? ' selected' : '') + '>Inactive</option>' +
          '<option value="suspended"' + (user.status === 'suspended' ? ' selected' : '') + '>Suspended</option>' +
        '</select></div>' +
      '</div>';

    ModalSystem.form('Edit User', html, 'Save Changes', function (data) {
      var name = (data.name || '').trim();
      var email = (data.email || '').trim();
      if (!name) { ToastSystem.error('Name is required'); return; }
      if (!email || !email.includes('@')) { ToastSystem.error('Valid email is required'); return; }
      AppStore.updateUser(id, {
        name: name,
        email: email,
        role: data.role || 'Viewer',
        status: data.status || 'active'
      });
      ToastSystem.success('User "' + Utils.escapeHtml(name) + '" updated successfully');
      renderUsers();
    });
  }

  function confirmDeleteUser(id) {
    const user = AppStore.getUser(id);
    if (!user) return;

    ModalSystem.confirm(
      'Delete User',
      'Are you sure you want to delete <strong>' + Utils.escapeHtml(user.name) + '</strong>? This action cannot be undone.',
      'Delete',
      'Cancel',
      function () {
        AppStore.deleteUser(id);
        ToastSystem.success('User deleted successfully');
        renderUsers();
      }
    );
  }

  return { render, init };
})();
