// ==========================================
// DYNAMIC CONTENT LOADER FOR PUBLIC PAGES
// ==========================================

// Load dynamic home page content from API
async function loadDynamicHomePage() {
    try {
        const response = await api.getHomeContent();
        if (!response.success) return;

        const homeContent = response.data;

        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroImage = document.querySelector('.hero-image');

        if (heroTitle) heroTitle.textContent = homeContent.hero_title;
        if (heroSubtitle) heroSubtitle.textContent = homeContent.hero_tagline;
        if (heroImage) heroImage.src = homeContent.hero_image;

        // Update statistics
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            statNumbers[0].setAttribute('data-target', homeContent.people_helped);
            statNumbers[1].setAttribute('data-target', homeContent.events_done);
            statNumbers[2].setAttribute('data-target', homeContent.volunteers);
            statNumbers[3].setAttribute('data-target', homeContent.communities_served);
        }

        // Update introduction section
        const introTitle = document.querySelector('.intro-text .section-title');
        const introDescription = document.querySelectorAll('.intro-description');

        if (introTitle) introTitle.textContent = homeContent.intro_title;
        if (introDescription.length > 0) {
            introDescription[0].textContent = homeContent.intro_text;
        }
    } catch (err) {
        console.error('Failed to load home content from API:', err);
    }
}

// Load dynamic causes on home page
async function loadDynamicCausesPreview() {
    try {
        const response = await api.getCauses();
        if (!response.success) return;

        const causes = response.data.slice(0, 3);
        const causesGrid = document.querySelector('.causes-grid');

        if (!causesGrid || causes.length === 0) return;

        causesGrid.innerHTML = causes.map((cause, index) => `
            <div class="cause-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="cause-icon">
                    <i class="${cause.icon || 'fas fa-heart'}"></i>
                </div>
                <h3>${cause.title}</h3>
                <p>${cause.short_description}</p>
                <a href="causes.html" class="cause-link">
                    Explore More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load causes from API:', err);
    }
}

// Load full causes page
async function loadDynamicCausesPage() {
    try {
        const response = await api.getCauses();
        if (!response.success) return;

        const activeCauses = response.data;
        const causesSection = document.querySelector('.causes-detail-section .container');
        if (!causesSection || activeCauses.length === 0) return;

        causesSection.innerHTML = activeCauses.map((cause, index) => {
            const isEven = index % 2 === 0;
            const features = typeof cause.features === 'string' ? JSON.parse(cause.features) : cause.features;

            const imageHTML = cause.image ? `
                <div class="cause-detail-image">
                    <img src="${cause.image}" alt="${cause.title}">
                </div>
            ` : '';

            const textHTML = `
                <div class="cause-detail-text">
                    <h2>${cause.title}</h2>
                    <p>${cause.full_description}</p>
                    ${features && features.length > 0 ? `
                        <p>Our ${cause.title.toLowerCase()} programs include:</p>
                        <ul class="cause-features">
                            ${features.map(feature => `
                                <li><i class="fas fa-check-circle"></i> ${feature}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                    <button class="cta-button" onclick="window.location.href='donate.html'">
                        <span>Support ${cause.title}</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;

            return `
                <div class="cause-detail-card" data-aos="fade-up">
                    <div class="cause-detail-content">
                        ${isEven ? imageHTML + textHTML : textHTML + imageHTML}
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load causes from API:', err);
    }
}

// Load dynamic gallery
async function loadDynamicGallery() {
    try {
        const response = await api.getGallery();
        if (!response.success) return;

        const gallery = response.data;
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        galleryGrid.innerHTML = gallery.map(item => `
            <div class="gallery-item" data-aos="zoom-in">
                <img src="${item.image}" alt="${item.caption || 'Gallery Image'}" loading="lazy">
                <div class="gallery-overlay">
                    <p class="gallery-caption">${item.caption || ''}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Failed to load gallery from API:', err);
    }
}

// Initialize dynamic content based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // Home page
    if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath === '') {
        loadDynamicHomePage();
        loadDynamicCausesPreview();
    }

    // Causes page
    if (currentPath.includes('causes.html')) {
        loadDynamicCausesPage();
    }

    // Gallery page
    if (currentPath.includes('gallery.html')) {
        loadDynamicGallery();
    }
});
