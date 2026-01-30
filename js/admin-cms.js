// ==========================================
// ADMIN CMS - DATA MANAGEMENT SYSTEM
// ==========================================

// Initialize default data structure
function initializeDefaultData() {
    // Home Page Content
    if (!localStorage.getItem('homePageContent')) {
        const defaultHomeContent = {
            heroTitle: 'Transforming Lives, One Step at a Time',
            heroTagline: 'Together, we can bring hope, education, and nourishment to those who need it most',
            heroImage: 'images/hero-image.jpg',
            stats: {
                livesImpacted: 15000,
                eventsOrganized: 250,
                activeVolunteers: 500,
                communitiesServed: 45
            },
            introTitle: 'Building a Better Tomorrow',
            introText: 'Hope Foundation is a non-profit organization dedicated to empowering underprivileged communities through education, nutrition, and healthcare. Since our inception, we\'ve been committed to creating lasting change and breaking the cycle of poverty.'
        };
        localStorage.setItem('homePageContent', JSON.stringify(defaultHomeContent));
    }

    // Causes Data
    if (!localStorage.getItem('causesData')) {
        const defaultCauses = [
            {
                id: 1,
                title: 'Education for All',
                icon: 'fas fa-graduation-cap',
                shortDescription: 'Providing quality education, books, and learning materials to underprivileged children, ensuring they have the tools to build a brighter future.',
                fullDescription: 'Education is the foundation of a better future. We believe every child deserves access to quality education, regardless of their economic background.',
                image: 'images/education-cause.jpg',
                features: [
                    'Free tutoring and mentorship programs',
                    'Books, stationery, and learning materials',
                    'Scholarship opportunities for deserving students',
                    'Digital literacy and computer training',
                    'Career guidance and skill development'
                ],
                active: true
            },
            {
                id: 2,
                title: 'Food Security',
                icon: 'fas fa-utensils',
                shortDescription: 'Fighting hunger by distributing nutritious meals and essential food supplies to families struggling to make ends meet.',
                fullDescription: 'No one should go to bed hungry. Our food security programs ensure that families have access to nutritious meals and essential food supplies.',
                image: 'images/food-cause.jpg',
                features: [
                    'Daily meal distribution programs',
                    'Monthly food ration kits for families',
                    'Community kitchens serving hot meals',
                    'Nutrition education and awareness',
                    'Emergency food relief during crises'
                ],
                active: true
            },
            {
                id: 3,
                title: 'Healthcare Access',
                icon: 'fas fa-heartbeat',
                shortDescription: 'Organizing medical camps and providing essential healthcare services to communities with limited access to medical facilities.',
                fullDescription: 'Quality healthcare is a fundamental right. We organize medical camps and provide essential healthcare services to communities with limited access to medical facilities.',
                image: 'images/healthcare-cause.jpg',
                features: [
                    'Free medical camps and health checkups',
                    'Medicine distribution programs',
                    'Vaccination drives for children',
                    'Health awareness and hygiene education',
                    'Emergency medical assistance'
                ],
                active: true
            }
        ];
        localStorage.setItem('causesData', JSON.stringify(defaultCauses));
    }

    // Site Settings
    if (!localStorage.getItem('siteSettings')) {
        const defaultSettings = {
            siteName: 'Hope Foundation',
            tagline: 'Transforming Lives Together',
            telegramBotToken: '',
            telegramChatId: '',
            contactEmail: 'info@hopefoundation.org',
            contactPhone: '+1 (555) 123-4567',
            contactAddress: '123 Hope Street, City, State'
        };
        localStorage.setItem('siteSettings', JSON.stringify(defaultSettings));
    }

    // Posts/Updates
    if (!localStorage.getItem('postsData')) {
        localStorage.setItem('postsData', JSON.stringify([]));
    }

    // Donations Log
    if (!localStorage.getItem('donationsLog')) {
        localStorage.setItem('donationsLog', JSON.stringify([]));
    }
}

// Initialize on load
initializeDefaultData();

// ==========================================
// HOME PAGE MANAGEMENT
// ==========================================

function getHomePageContent() {
    return JSON.parse(localStorage.getItem('homePageContent'));
}

function updateHomePageContent(content) {
    localStorage.setItem('homePageContent', JSON.stringify(content));
}

// ==========================================
// CAUSES MANAGEMENT
// ==========================================

function getCauses() {
    return JSON.parse(localStorage.getItem('causesData'));
}

function saveCauses(causes) {
    localStorage.setItem('causesData', JSON.stringify(causes));
}

function addCause(cause) {
    const causes = getCauses();
    cause.id = Date.now();
    cause.active = true;
    causes.push(cause);
    saveCauses(causes);
    return cause;
}

function updateCause(causeId, updatedData) {
    const causes = getCauses();
    const index = causes.findIndex(c => c.id === causeId);
    if (index !== -1) {
        causes[index] = { ...causes[index], ...updatedData };
        saveCauses(causes);
        return causes[index];
    }
    return null;
}

function deleteCause(causeId) {
    let causes = getCauses();
    causes = causes.filter(c => c.id !== causeId);
    saveCauses(causes);
}

function toggleCauseStatus(causeId) {
    const causes = getCauses();
    const cause = causes.find(c => c.id === causeId);
    if (cause) {
        cause.active = !cause.active;
        saveCauses(causes);
    }
}

// ==========================================
// POSTS/UPDATES MANAGEMENT
// ==========================================

function getPosts() {
    return JSON.parse(localStorage.getItem('postsData'));
}

function savePosts(posts) {
    localStorage.setItem('postsData', JSON.stringify(posts));
}

function addPost(post) {
    const posts = getPosts();
    post.id = Date.now();
    post.date = new Date().toISOString();
    posts.unshift(post);
    savePosts(posts);
    return post;
}

function deletePost(postId) {
    let posts = getPosts();
    posts = posts.filter(p => p.id !== postId);
    savePosts(posts);
}

// ==========================================
// DONATIONS MANAGEMENT
// ==========================================

function getDonations() {
    return JSON.parse(localStorage.getItem('donationsLog'));
}

function addDonation(donation) {
    const donations = getDonations();
    donation.id = Date.now();
    donation.timestamp = new Date().toISOString();
    donations.unshift(donation);
    localStorage.setItem('donationsLog', JSON.stringify(donations));
}

// ==========================================
// SITE SETTINGS
// ==========================================

function getSiteSettings() {
    return JSON.parse(localStorage.getItem('siteSettings'));
}

function updateSiteSettings(settings) {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatDate(isoString) {
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

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getHomePageContent,
        updateHomePageContent,
        getCauses,
        saveCauses,
        addCause,
        updateCause,
        deleteCause,
        toggleCauseStatus,
        getPosts,
        addPost,
        deletePost,
        getDonations,
        addDonation,
        getSiteSettings,
        updateSiteSettings,
        formatDate,
        showNotification
    };
}
