document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const userNameDisplay = document.getElementById('userNameDisplay');
  const logoutBtn = document.getElementById('logoutBtn');
  const tasksGrid = document.getElementById('tasksGrid');
  const taskCounter = document.getElementById('taskCounter');
  const dashboardAlert = document.getElementById('dashboardAlert');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Task Modal Elements
  const taskModal = document.getElementById('taskModal');
  const taskForm = document.getElementById('taskForm');
  const modalTitle = document.getElementById('modalTitle');
  const taskIdField = document.getElementById('taskIdField');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescInput = document.getElementById('taskDesc');
  const statusGroup = document.getElementById('statusGroup');
  const taskStatusSelect = document.getElementById('taskStatus');
  const saveTaskBtn = document.getElementById('saveTaskBtn');
  const openCreateModalBtn = document.getElementById('openCreateModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelModalBtn = document.getElementById('cancelModalBtn');

  // Delete Modal Elements
  const deleteModal = document.getElementById('deleteModal');
  const deleteTaskIdField = document.getElementById('deleteTaskIdField');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // Application State
  let currentFilter = 'ALL';

  // 1. Initial configuration check
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    window.location.replace('/pages/login.html');
    return;
  }

  // Display user's name
  userNameDisplay.textContent = user.username || 'User';

  // 2. Alert management helpers
  const showAlert = (message, type = 'danger') => {
    dashboardAlert.textContent = message;
    dashboardAlert.className = `alert alert-${type}`;
    // Clear alert automatically after 5 seconds
    setTimeout(() => {
      clearAlert();
    }, 5000);
  };

  const clearAlert = () => {
    dashboardAlert.className = 'alert alert-hidden';
    dashboardAlert.textContent = '';
  };

  // 3. Date formatter utility
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 4. Task render engine
  const fetchAndRenderTasks = async () => {
    tasksGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; border: none;">
        <div style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(165,180,252,0.1); border-left-color: #6366f1; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 15px; color: var(--text-secondary);">Loading your tasks...</p>
      </div>
    `;

    try {
      const endpoint = currentFilter === 'ALL' ? '/tasks' : `/tasks?status=${currentFilter}`;
      const response = await ApiClient.get(endpoint);
      const tasks = response.data || [];

      taskCounter.textContent = tasks.length;
      tasksGrid.innerHTML = '';

      if (tasks.length === 0) {
        renderEmptyState();
        return;
      }

      tasks.forEach(task => {
        const card = createTaskCard(task);
        tasksGrid.appendChild(card);
      });

    } catch (error) {
      tasksGrid.innerHTML = '';
      showAlert(error.message || 'Failed to fetch tasks list');
    }
  };

  // Render dashboard empty state layout
  const renderEmptyState = () => {
    tasksGrid.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); margin-bottom: 16px;">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M16 12H8"/>
        </svg>
        <div class="empty-state-title">No tasks found</div>
        <p class="empty-state-subtitle">
          ${currentFilter === 'ALL' 
            ? "You don't have any tasks registered yet. Click 'New Task' to get started." 
            : `You have no tasks matching the '${currentFilter}' status filter.`}
        </p>
        ${currentFilter === 'ALL' ? `
          <button id="emptyStateCreateBtn" class="btn btn-primary btn-sm">
            Create First Task
          </button>
        ` : ''}
      </div>
    `;

    const emptyStateCreateBtn = document.getElementById('emptyStateCreateBtn');
    if (emptyStateCreateBtn) {
      emptyStateCreateBtn.addEventListener('click', openCreateModal);
    }
  };

  // HTML template for single Task Card
  const createTaskCard = (task) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.id = task.id;

    // Status styling maps
    const statusMap = {
      'TODO': { label: 'To Do', class: 'badge-todo' },
      'IN_PROGRESS': { label: 'In Progress', class: 'badge-in_progress' },
      'DONE': { label: 'Completed', class: 'badge-done' }
    };

    const statusInfo = statusMap[task.status] || { label: task.status, class: '' };

    card.innerHTML = `
      <div>
        <div class="task-card-header">
          <h4 class="task-title">${escapeHTML(task.title)}</h4>
          <span class="badge ${statusInfo.class}">${statusInfo.label}</span>
        </div>
        <p class="task-desc">${escapeHTML(task.description || 'No description provided')}</p>
      </div>
      <div class="task-card-footer">
        <div>Created: ${formatDate(task.createdAt)}</div>
        <div class="task-actions">
          <button class="task-btn task-btn-edit" title="Edit Task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="task-btn task-btn-delete" title="Delete Task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Hook listeners inside card buttons
    card.querySelector('.task-btn-edit').addEventListener('click', () => openEditModal(task));
    card.querySelector('.task-btn-delete').addEventListener('click', () => openDeleteModal(task.id));

    return card;
  };

  // Helper utility to sanitize dynamic strings to prevent XSS
  const escapeHTML = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // 5. Modal actions
  const openCreateModal = () => {
    clearAlert();
    modalTitle.textContent = 'Create New Task';
    taskIdField.value = '';
    taskTitleInput.value = '';
    taskDescInput.value = '';
    
    // Default creating value is TODO, so status dropdown is omitted
    statusGroup.style.display = 'none';
    taskStatusSelect.value = 'TODO';
    
    saveTaskBtn.textContent = 'Create Task';
    taskModal.classList.add('active');
  };

  const openEditModal = async (task) => {
    clearAlert();
    modalTitle.textContent = 'Edit Task';
    taskIdField.value = task.id;
    taskTitleInput.value = task.title;
    taskDescInput.value = task.description || '';
    
    // Expose status selector
    statusGroup.style.display = 'block';
    taskStatusSelect.value = task.status;
    
    saveTaskBtn.textContent = 'Save Changes';
    taskModal.classList.add('active');
  };

  const closeModal = () => {
    taskModal.classList.remove('active');
  };

  const openDeleteModal = (id) => {
    clearAlert();
    deleteTaskIdField.value = id;
    deleteModal.classList.add('active');
  };

  const closeDeleteModal = () => {
    deleteModal.classList.remove('active');
  };

  // 6. Submit handling
  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = taskIdField.value;
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    const status = taskStatusSelect.value;

    if (!title) {
      showAlert('Task title is required');
      return;
    }

    try {
      if (id) {
        // Edit flow
        await ApiClient.put(`/tasks/${id}`, { title, description, status });
        showAlert('Task updated successfully', 'success');
      } else {
        // Create flow
        await ApiClient.post('/tasks', { title, description, status });
        showAlert('Task created successfully', 'success');
      }

      closeModal();
      fetchAndRenderTasks();
    } catch (error) {
      showAlert(error.message || 'Operation failed');
    }
  });

  // Confirm task deletion trigger
  confirmDeleteBtn.addEventListener('click', async () => {
    const id = deleteTaskIdField.value;
    if (!id) return;

    try {
      await ApiClient.delete(`/tasks/${id}`);
      showAlert('Task deleted successfully', 'success');
      closeDeleteModal();
      fetchAndRenderTasks();
    } catch (error) {
      showAlert(error.message || 'Delete operation failed');
      closeDeleteModal();
    }
  });

  // 7. Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      fetchAndRenderTasks();
    });
  });

  // 8. Authentication closure
  logoutBtn.addEventListener('click', async () => {
    try {
      await ApiClient.post('/auth/logout');
    } catch (err) {
      // Continue client teardown anyway
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/pages/login.html');
  });

  // 9. Attach modal trigger events
  openCreateModalBtn.addEventListener('click', openCreateModal);
  closeModalBtn.addEventListener('click', closeModal);
  cancelModalBtn.addEventListener('click', closeModal);
  closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  // Close modals when clicking outside contents
  window.addEventListener('click', (e) => {
    if (e.target === taskModal) closeModal();
    if (e.target === deleteModal) closeDeleteModal();
  });

  // 10. Run initial fetch
  fetchAndRenderTasks();
});
