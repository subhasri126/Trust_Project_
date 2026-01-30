/**
 * BACKEND API INTERFACE
 * Handles all communications with the Express/SQL backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    // --- Auth ---
    login: async (username, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('adminToken', data.data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.data.admin));
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    },

    getAuthHeaders: () => {
        const token = localStorage.getItem('adminToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },

    // --- Home Content ---
    getHomeContent: async () => {
        const res = await fetch(`${API_BASE_URL}/home`);
        return await res.json();
    },

    updateHomeContent: async (content) => {
        const res = await fetch(`${API_BASE_URL}/home`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...api.getAuthHeaders()
            },
            body: JSON.stringify(content)
        });
        return await res.json();
    },

    // --- Causes ---
    getCauses: async () => {
        const res = await fetch(`${API_BASE_URL}/causes`);
        return await res.json();
    },

    getAdminCauses: async () => {
        const res = await fetch(`${API_BASE_URL}/causes/admin/list`, {
            headers: api.getAuthHeaders()
        });
        return await res.json();
    },

    addCause: async (cause) => {
        const res = await fetch(`${API_BASE_URL}/causes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...api.getAuthHeaders()
            },
            body: JSON.stringify(cause)
        });
        return await res.json();
    },

    updateCause: async (id, cause) => {
        const res = await fetch(`${API_BASE_URL}/causes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...api.getAuthHeaders()
            },
            body: JSON.stringify(cause)
        });
        return await res.json();
    },

    deleteCause: async (id) => {
        const res = await fetch(`${API_BASE_URL}/causes/${id}`, {
            method: 'DELETE',
            headers: api.getAuthHeaders()
        });
        return await res.json();
    },

    toggleCause: async (id) => {
        const res = await fetch(`${API_BASE_URL}/causes/${id}/toggle`, {
            method: 'PATCH',
            headers: api.getAuthHeaders()
        });
        return await res.json();
    },

    // --- Gallery ---
    getGallery: async () => {
        const res = await fetch(`${API_BASE_URL}/gallery`);
        return await res.json();
    },

    addGalleryImage: async (image, caption) => {
        const res = await fetch(`${API_BASE_URL}/gallery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...api.getAuthHeaders()
            },
            body: JSON.stringify({ image, caption })
        });
        return await res.json();
    },

    deleteGalleryImage: async (id) => {
        const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
            method: 'DELETE',
            headers: api.getAuthHeaders()
        });
        return await res.json();
    },

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`${API_BASE_URL}/gallery/upload`, {
            method: 'POST',
            headers: api.getAuthHeaders(),
            body: formData
        });
        return await res.json();
    },

    // --- Posts ---
    getPosts: async () => {
        const res = await fetch(`${API_BASE_URL}/posts`);
        return await res.json();
    },

    addPost: async (post) => {
        const res = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...api.getAuthHeaders()
            },
            body: JSON.stringify(post)
        });
        return await res.json();
    },

    deletePost: async (id) => {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: api.getAuthHeaders()
        });
        return await res.json();
    },

    // --- Donations ---
    submitDonation: async (donation) => {
        const res = await fetch(`${API_BASE_URL}/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donation)
        });
        return await res.json();
    },

    getDonations: async (status = '') => {
        const res = await fetch(`${API_BASE_URL}/donations?status=${status}`, {
            headers: api.getAuthHeaders()
        });
        return await res.json();
    },

    getDonationStats: async () => {
        const res = await fetch(`${API_BASE_URL}/donations/stats`, {
            headers: api.getAuthHeaders()
        });
        return await res.json();
    },

    updateDonationStatus: async (id, status) => {
        const res = await fetch(`${API_BASE_URL}/donations/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...api.getAuthHeaders()
            },
            body: JSON.stringify({ status })
        });
        return await res.json();
    },

    // --- Settings ---
    getSettings: async () => {
        const res = await fetch(`${API_BASE_URL}/settings`);
        return await res.json();
    },

    updateSettings: async (settings) => {
        const res = await fetch(`${API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...api.getAuthHeaders()
            },
            body: JSON.stringify(settings)
        });
        return await res.json();
    },

    // --- Contacts ---
    submitContact: async (formData) => {
        const res = await fetch(`${API_BASE_URL}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        return await res.json();
    },

    getContacts: async () => {
        const res = await fetch(`${API_BASE_URL}/contacts`, {
            headers: api.getAuthHeaders()
        });
        return await res.json();
    }
};

window.api = api;
