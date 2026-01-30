// ==========================================
// GLOBAL VARIABLES
// ==========================================

let clickCount = 0;
let clickTimer = null;

// ==========================================
// NAVIGATION
// ==========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ==========================================
// STATISTICS COUNTER ANIMATION
// ==========================================

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };

    updateCounter();
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// ==========================================
// SCROLL ANIMATIONS (AOS)
// ==========================================

const animateOnScroll = () => {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => observer.observe(element));
};

// Initialize animations when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateOnScroll);
} else {
    animateOnScroll();
}

// ==========================================
// SECRET ADMIN ACCESS
// ==========================================

const secretAccess = document.getElementById('secretAccess');
if (secretAccess) {
    secretAccess.addEventListener('click', () => {
        clickCount++;

        if (clickTimer) {
            clearTimeout(clickTimer);
        }

        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 2000);

        if (clickCount === 5) {
            window.location.href = 'admin/login.html';
            clickCount = 0;
        }
    });
}

// ==========================================
// FORM VALIDATION & SUBMISSION
// ==========================================

// Donation Form Handler
const donationForm = document.getElementById('donationForm');
if (donationForm) {
    donationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = donationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        const donorName = document.getElementById('donorName').value;
        const formData = {
            donor_name: donorName,
            amount: document.getElementById('donationAmount').value,
            email: document.getElementById('donorEmail')?.value || null,
            phone: document.getElementById('donorPhone')?.value || null,
            message: document.getElementById('donationMessage').value,
            payment_method: 'Manual'
        };

        try {
            // Use Backend API
            const response = await api.submitDonation(formData);

            if (response.success) {
                showThankYouMessage(donorName);
                donationForm.reset();
            } else {
                alert('Donation failed: ' + response.message);
            }

        } catch (error) {
            console.error('Error submitting donation:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showThankYouMessage(name) {
    const modal = document.createElement('div');
    modal.className = 'thank-you-modal';
    modal.innerHTML = `
        <div class="thank-you-content">
            <div class="thank-you-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h2>Thank You, ${name}!</h2>
            <p>Your generosity will make a real difference in someone's life.</p>
            <p>We'll be in touch with you shortly with donation details.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="cta-button">
                Close
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    setTimeout(() => {
        modal.querySelector('.thank-you-content').style.transform = 'scale(1)';
        modal.querySelector('.thank-you-content').style.opacity = '1';
    }, 10);
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        try {
            const response = await api.submitContact(formData);
            if (response.success) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Failed to send message: ' + response.message);
            }
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Something went wrong. Please try again later.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==========================================
// ADMIN LOGIN
// ==========================================

const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        const errorMsg = document.getElementById('loginError');
        const submitBtn = adminLoginForm.querySelector('button[type="submit"]');

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        try {
            const response = await api.login(username, password);
            if (response.success) {
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.textContent = response.message || 'Invalid credentials. Please try again.';
                errorMsg.style.display = 'block';
                setTimeout(() => errorMsg.style.display = 'none', 3000);
            }
        } catch (err) {
            errorMsg.textContent = 'Server connection error. Please try again.';
            errorMsg.style.display = 'block';
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Sign In</span>';
            submitBtn.disabled = false;
        }
    });
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================

// Check admin authentication
function checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    const currentPage = window.location.pathname;

    if (currentPage.includes('admin/') && !currentPage.includes('login.html') && !token) {
        window.location.href = 'login.html';
    }
}

checkAdminAuth();

// Admin logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        api.logout();
    });
}

// ==========================================
// GALLERY MANAGEMENT
// ==========================================

let galleryImages = JSON.parse(localStorage.getItem('galleryImages')) || [];

// Load gallery images
function loadGallery() {
    const publicGallery = document.getElementById('publicGallery');
    const adminGallery = document.getElementById('adminGalleryGrid');

    if (publicGallery) {
        publicGallery.innerHTML = '';
        galleryImages.forEach((img, index) => {
            const imgElement = document.createElement('div');
            imgElement.className = 'gallery-item';
            imgElement.setAttribute('data-aos', 'fade-up');
            imgElement.setAttribute('data-aos-delay', (index % 3) * 100);
            imgElement.innerHTML = `
                <img src="${img.url}" alt="${img.title}">
                <div class="gallery-overlay">
                    <h3>${img.title}</h3>
                </div>
            `;
            publicGallery.appendChild(imgElement);
        });

        // Reinitialize animations
        animateOnScroll();
    }

    if (adminGallery) {
        adminGallery.innerHTML = '';
        galleryImages.forEach((img, index) => {
            const imgElement = document.createElement('div');
            imgElement.className = 'admin-gallery-item';
            imgElement.innerHTML = `
                <img src="${img.url}" alt="${img.title}">
                <div class="admin-gallery-overlay">
                    <button onclick="deleteImage(${index})" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
                <p class="image-title">${img.title}</p>
            `;
            adminGallery.appendChild(imgElement);
        });
    }
}

// Upload image
const uploadImageForm = document.getElementById('uploadImageForm');
if (uploadImageForm) {
    uploadImageForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('imageFile');
        const titleInput = document.getElementById('imageTitle');

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const newImage = {
                    url: e.target.result,
                    title: titleInput.value || 'Untitled',
                    uploadDate: new Date().toISOString()
                };

                galleryImages.push(newImage);
                localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
                loadGallery();
                uploadImageForm.reset();

                alert('Image uploaded successfully!');
            };

            reader.readAsDataURL(file);
        }
    });
}

// Delete image
function deleteImage(index) {
    if (confirm('Are you sure you want to delete this image?')) {
        galleryImages.splice(index, 1);
        localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
        loadGallery();
    }
}

// Initialize gallery on page load
loadGallery();

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
