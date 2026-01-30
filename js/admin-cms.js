// ==========================================
// ADMIN CMS - DATA MANAGEMENT SYSTEM (API INTEGRATED)
// ==========================================

// Global state for admin (optional)
let currentAdmin = JSON.parse(localStorage.getItem('adminUser'));

// ==========================================
// HOME PAGE MANAGEMENT
// ==========================================

async function getHomePageContent() {
    const response = await api.getHomeContent();
    return response.success ? response.data : null;
}

async function updateHomePageContent(content) {
    const response = await api.updateHomePageContent(content);
    if (response.success) {
        showNotification('Home page updated successfully');
    } else {
        showNotification(response.message || 'Failed to update home page', 'error');
    }
    return response;
}

// ==========================================
// CAUSES MANAGEMENT
// ==========================================

async function getCauses() {
    const response = await api.getAdminCauses();
    return response.success ? response.data : [];
}

async function addCause(cause) {
    const response = await api.addCause(cause);
    if (response.success) {
        showNotification('Cause added successfully');
    } else {
        showNotification(response.message || 'Failed to add cause', 'error');
    }
    return response.data;
}

async function updateCause(causeId, updatedData) {
    const response = await api.updateCause(causeId, updatedData);
    if (response.success) {
        showNotification('Cause updated successfully');
    } else {
        showNotification(response.message || 'Failed to update cause', 'error');
    }
    return response.data;
}

async function deleteCause(causeId) {
    const response = await api.deleteCause(causeId);
    if (response.success) {
        showNotification('Cause deleted successfully');
    } else {
        showNotification(response.message || 'Failed to delete cause', 'error');
    }
    return response.success;
}

async function toggleCauseStatus(causeId) {
    const response = await api.toggleCause(causeId);
    if (response.success) {
        showNotification('Status updated');
    }
    return response.success;
}

// ==========================================
// POSTS/UPDATES MANAGEMENT
// ==========================================

async function getPosts() {
    const response = await api.getPosts();
    return response.success ? response.data : [];
}

async function addPost(post) {
    const response = await api.addPost(post);
    if (response.success) {
        showNotification('Post created successfully');
    }
    return response.data;
}

async function deletePost(postId) {
    const response = await api.deletePost(postId);
    if (response.success) {
        showNotification('Post deleted successfully');
    }
    return response.success;
}

// ==========================================
// DONATIONS MANAGEMENT
// ==========================================

async function getDonations(status = '') {
    const response = await api.getDonations(status);
    return response.success ? response.data.donations : [];
}

async function getDonationStats() {
    const response = await api.getDonationStats();
    return response.success ? response.data : null;
}

async function updateDonationStatus(id, status) {
    const response = await api.updateDonationStatus(id, status);
    if (response.success) {
        showNotification('Donation status updated');
    }
    return response.success;
}

// ==========================================
// GALLERY MANAGEMENT
// ==========================================

async function getGalleryImages() {
    const response = await api.getGallery();
    return response.success ? response.data : [];
}

async function addGalleryImage(image, caption) {
    const response = await api.addGalleryImage(image, caption);
    if (response.success) {
        showNotification('Image added to gallery');
    }
    return response.success;
}

async function deleteGalleryImage(id) {
    const response = await api.deleteGalleryImage(id);
    if (response.success) {
        showNotification('Image deleted');
    }
    return response.success;
}

// ==========================================
// SITE SETTINGS
// ==========================================

async function getSiteSettings() {
    const response = await api.getSettings();
    return response.success ? response.data : null;
}

async function updateSiteSettings(settings) {
    const response = await api.updateSettings(settings);
    if (response.success) {
        showNotification('Settings updated successfully');
    } else {
        showNotification(response.message || 'Failed to update settings', 'error');
    }
    return response;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatDate(isoString) {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Check auth on load for admin pages
if (window.location.pathname.includes('/admin/') && !window.location.pathname.includes('login.html')) {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
    }
}
