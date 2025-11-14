/**
 * Task Manager Frontend
 * Demonstrates API integration with the Node.js backend
 */

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/tasks';

// DOM Elements
const tasksContainer = document.getElementById('tasksContainer');
const taskForm = document.getElementById('taskForm');
const editForm = document.getElementById('editForm');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const emptyState = document.getElementById('emptyState');
const taskCount = document.getElementById('taskCount');
const refreshBtn = document.getElementById('refreshBtn');
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const cancelEditBtn = document.getElementById('cancelEdit');

// State
let currentFilters = {
    status: '',
    priority: '',
    sortBy: '',
    order: 'asc'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Create task form
    taskForm.addEventListener('submit', handleCreateTask);
    
    // Edit task form
    editForm.addEventListener('submit', handleUpdateTask);
    
    // Refresh button
    refreshBtn.addEventListener('click', loadTasks);
    
    // Filter buttons
    applyFiltersBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Modal controls
    closeModal.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
}

/**
 * Load tasks from API
 */
async function loadTasks() {
    showLoading();
    hideError();
    
    try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (currentFilters.status) queryParams.append('status', currentFilters.status);
        if (currentFilters.priority) queryParams.append('priority', currentFilters.priority);
        if (currentFilters.sortBy) {
            queryParams.append('sortBy', currentFilters.sortBy);
            queryParams.append('order', currentFilters.order);
        }
        
        const url = `${API_BASE_URL}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayTasks(result.data);
            taskCount.textContent = result.count;
        } else {
            throw new Error('Failed to load tasks');
        }
    } catch (error) {
        showError(`Error loading tasks: ${error.message}. Make sure the backend server is running on port 3000.`);
        displayTasks([]);
    } finally {
        hideLoading();
    }
}

/**
 * Display tasks in the UI
 */
function displayTasks(tasks) {
    tasksContainer.innerHTML = '';
    
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksContainer.appendChild(taskCard);
    });
}

/**
 * Create a task card element
 */
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority} ${task.status === 'completed' ? 'completed' : ''}`;
    
    const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }) : 'No due date';
    
    const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="task-header">
            <h3 class="task-title">${escapeHtml(task.title)}</h3>
        </div>
        <p class="task-description">${escapeHtml(task.description || 'No description')}</p>
        <div class="task-meta">
            <span class="badge badge-status ${task.status}">${task.status}</span>
            <span class="badge badge-priority ${task.priority}">${task.priority} priority</span>
        </div>
        <div class="task-date">
            <strong>Due:</strong> ${formattedDate}<br>
            <strong>Created:</strong> ${createdDate}
        </div>
        <div class="task-actions">
            <button class="btn btn-primary" onclick="openEditModal(${task.id})">Edit</button>
            <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    
    return card;
}

/**
 * Handle create task form submission
 */
async function handleCreateTask(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        status: document.getElementById('status').value,
        priority: document.getElementById('priority').value,
        dueDate: document.getElementById('dueDate').value || null
    };
    
    if (!formData.title) {
        showError('Title is required');
        return;
    }
    
    try {
        showLoading();
        hideError();
        
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create task');
        }
        
        const result = await response.json();
        
        if (result.success) {
            // Reset form
            taskForm.reset();
            // Reload tasks
            loadTasks();
            showSuccess('Task created successfully!');
        }
    } catch (error) {
        showError(`Error creating task: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Open edit modal with task data
 */
async function openEditModal(taskId) {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/${taskId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load task');
        }
        
        const result = await response.json();
        
        if (result.success) {
            const task = result.data;
            
            // Populate form
            document.getElementById('editId').value = task.id;
            document.getElementById('editTitle').value = task.title;
            document.getElementById('editDescription').value = task.description || '';
            document.getElementById('editStatus').value = task.status;
            document.getElementById('editPriority').value = task.priority;
            document.getElementById('editDueDate').value = task.dueDate || '';
            
            // Show modal
            editModal.style.display = 'block';
        }
    } catch (error) {
        showError(`Error loading task: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Close edit modal
 */
function closeEditModal() {
    editModal.style.display = 'none';
    editForm.reset();
}

/**
 * Handle update task form submission
 */
async function handleUpdateTask(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('editId').value;
    const formData = {
        title: document.getElementById('editTitle').value.trim(),
        description: document.getElementById('editDescription').value.trim(),
        status: document.getElementById('editStatus').value,
        priority: document.getElementById('editPriority').value,
        dueDate: document.getElementById('editDueDate').value || null
    };
    
    if (!formData.title) {
        showError('Title is required');
        return;
    }
    
    try {
        showLoading();
        hideError();
        
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update task');
        }
        
        const result = await response.json();
        
        if (result.success) {
            closeEditModal();
            loadTasks();
            showSuccess('Task updated successfully!');
        }
    } catch (error) {
        showError(`Error updating task: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Delete a task
 */
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        showLoading();
        hideError();
        
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        const result = await response.json();
        
        if (result.success) {
            loadTasks();
            showSuccess('Task deleted successfully!');
        }
    } catch (error) {
        showError(`Error deleting task: ${error.message}`);
    } finally {
        hideLoading();
    }
}

/**
 * Apply filters
 */
function applyFilters() {
    currentFilters.status = document.getElementById('statusFilter').value;
    currentFilters.priority = document.getElementById('priorityFilter').value;
    currentFilters.sortBy = document.getElementById('sortBy').value;
    currentFilters.order = document.getElementById('sortOrder').value;
    
    loadTasks();
}

/**
 * Clear filters
 */
function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('priorityFilter').value = '';
    document.getElementById('sortBy').value = '';
    document.getElementById('sortOrder').value = 'asc';
    
    currentFilters = {
        status: '',
        priority: '',
        sortBy: '',
        order: 'asc'
    };
    
    loadTasks();
}

/**
 * Utility: Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show loading state
 */
function showLoading() {
    loading.style.display = 'block';
    tasksContainer.style.display = 'none';
}

/**
 * Hide loading state
 */
function hideLoading() {
    loading.style.display = 'none';
    tasksContainer.style.display = 'grid';
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * Show success message (simple alert for now)
 */
function showSuccess(message) {
    // You can replace this with a toast notification library
    alert(message);
}

// Make functions available globally for onclick handlers
window.openEditModal = openEditModal;
window.deleteTask = deleteTask;

