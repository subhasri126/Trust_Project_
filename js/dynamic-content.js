// ==========================================
// DYNAMIC CONTENT LOADER FOR PUBLIC PAGES
// ==========================================

// Load dynamic home page content
function loadDynamicHomePage() {
    const homeContent = JSON.parse(localStorage.getItem('homePageContent'));

    if (!homeContent) return;

    // Update hero section
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroImage = document.querySelector('.hero-image');

    if (heroTitle) heroTitle.textContent = homeContent.heroTitle;
    if (heroSubtitle) heroSubtitle.textContent = homeContent.heroTagline;
    if (heroImage) heroImage.src = homeContent.heroImage;

    // Update statistics
    const stats = homeContent.stats;
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length >= 4) {
        statNumbers[0].setAttribute('data-target', stats.livesImpacted);
        statNumbers[1].setAttribute('data-target', stats.eventsOrganized);
        statNumbers[2].setAttribute('data-target', stats.activeVolunteers);
        statNumbers[3].setAttribute('data-target', stats.communitiesServed);
    }

    // Update introduction section
    const introTitle = document.querySelector('.intro-text .section-title');
    const introDescription = document.querySelector('.intro-description');

    if (introTitle) introTitle.textContent = homeContent.introTitle;
    if (introDescription) introDescription.textContent = homeContent.introText;
}

// Load dynamic causes on home page
function loadDynamicCausesPreview() {
    const causes = JSON.parse(localStorage.getItem('causesData')) || [];
    const activeCauses = causes.filter(c => c.active).slice(0, 3);

    const causesGrid = document.querySelector('.causes-grid');
    if (!causesGrid || activeCauses.length === 0) return;

    causesGrid.innerHTML = activeCauses.map((cause, index) => `
        <div class="cause-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="cause-icon">
                <i class="${cause.icon}"></i>
            </div>
            <h3>${cause.title}</h3>
            <p>${cause.shortDescription}</p>
            <a href="causes.html" class="cause-link">
                Explore More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `).join('');
}

// Load full causes page
function loadDynamicCausesPage() {
    const causes = JSON.parse(localStorage.getItem('causesData')) || [];
    const activeCauses = causes.filter(c => c.active);

    const causesSection = document.querySelector('.causes-detail-section .container');
    if (!causesSection || activeCauses.length === 0) return;

    causesSection.innerHTML = activeCauses.map((cause, index) => {
        const isEven = index % 2 === 0;
        const imageHTML = cause.image ? `
            <div class="cause-detail-image">
                <img src="${cause.image}" alt="${cause.title}">
            </div>
        ` : '';

        const textHTML = `
            <div class="cause-detail-text">
                <h2>${cause.title}</h2>
                <p>${cause.fullDescription}</p>
                ${cause.features && cause.features.length > 0 ? `
                    <p>Our ${cause.title.toLowerCase()} programs include:</p>
                    <ul class="cause-features">
                        ${cause.features.map(feature => `
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
}

// Initialize dynamic content based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    // Home page
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        loadDynamicHomePage();
        loadDynamicCausesPreview();
    }

    // Causes page
    if (currentPath.includes('causes.html')) {
        loadDynamicCausesPage();
    }
});
