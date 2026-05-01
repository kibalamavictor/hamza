// Mobile Navigation Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-bar .nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-bar .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Login Modal Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Handle Login Form Submission
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate login process (in real app, this would be an API call)
    simulateLogin(email, password, remember);
}

// Simulate Login Process
function simulateLogin(email, password, remember) {
    // Show loading state
    const submitBtn = document.querySelector('.login-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Demo credentials for testing
        const validCredentials = [
            { email: 'admin@healingheartsug.org', password: 'admin123', role: 'admin' },
            { email: 'volunteer@healingheartsug.org', password: 'volunteer123', role: 'volunteer' },
            { email: 'donor@healingheartsug.org', password: 'donor123', role: 'donor' }
        ];
        
        const user = validCredentials.find(cred => cred.email === email && cred.password === password);
        
        if (user) {
            // Login successful
            if (remember) {
                localStorage.setItem('rememberUser', email);
            } else {
                localStorage.removeItem('rememberUser');
            }
            
            // Store user session
            sessionStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                role: user.role,
                loginTime: new Date().toISOString()
            }));
            
            showNotification(`Welcome back! Logged in as ${user.role}`, 'success');
            
            // Update UI to show logged in state
            updateLoginUI(user);
            
            // Close modal
            closeLoginModal();
            
            // Redirect based on role (in real app)
            setTimeout(() => {
                if (user.role === 'admin') {
                    showNotification('Admin dashboard would open here', 'info');
                } else if (user.role === 'volunteer') {
                    showNotification('Volunteer portal would open here', 'info');
                } else {
                    showNotification('Donor dashboard would open here', 'info');
                }
            }, 1000);
            
        } else {
            // Login failed
            showNotification('Invalid email or password. Try admin@healingheartsug.org / admin123', 'error');
        }
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset form
        document.getElementById('loginForm').reset();
    }, 1500);
}

// Update Login UI
function updateLoginUI(user) {
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.textContent = user.email;
    loginBtn.onclick = () => {
        showNotification(`Logged in as ${user.role}. Click to logout.`, 'info');
    };
    
    // Add logout functionality
    loginBtn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        logout();
    });
}

// Logout Function
function logout() {
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.textContent = 'Login';
    loginBtn.onclick = openLoginModal;
    
    showNotification('Logged out successfully', 'success');
}

// Check for remembered user on page load
function checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberUser');
    if (rememberedEmail) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = rememberedEmail;
        }
    }
}

// Check for existing session
function checkExistingSession() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        updateLoginUI(user);
    }
}

// Show Notification Function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style based on type
    const colors = {
        success: 'linear-gradient(135deg, #28a745, #218838)',
        error: 'linear-gradient(135deg, #dc3545, #c82333)',
        info: 'linear-gradient(135deg, #17a2b8, #138496)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize login system on page load
document.addEventListener('DOMContentLoaded', () => {
    checkRememberedUser();
    checkExistingSession();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLoginModal();
    }
});

// Donation Modal Functions
function openDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add pulse animation to donate button
    const donateBtn = document.querySelector('.btn-donate');
    donateBtn.classList.remove('pulse');
    
    // Initialize donation modal
    initializeDonationModal();
}

function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function initializeDonationModal() {
    // Add event listeners to amount buttons
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');
    const impactDescription = document.getElementById('impactDescription');
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class from all buttons
            amountBtns.forEach(b => b.classList.remove('selected'));
            
            // Add selected class to clicked button
            btn.classList.add('selected');
            
            // Update impact description
            const impact = btn.dataset.impact;
            const amount = btn.dataset.amount;
            impactDescription.textContent = `Your UGX ${amount * 1000} donation will ${impact}`;
            
            // Clear custom amount
            customAmount.value = '';
        });
    });
    
    // Custom amount input
    customAmount.addEventListener('input', () => {
        // Remove selected class from all preset buttons
        amountBtns.forEach(b => b.classList.remove('selected'));
        
        const amount = customAmount.value;
        if (amount && amount >= 1000) {
            impactDescription.textContent = `Your UGX ${parseInt(amount).toLocaleString()} donation will help provide essential support to children in need.`;
        } else {
            impactDescription.textContent = 'Please enter a valid amount (minimum UGX 1,000)';
        }
    });
    
    // Method buttons
    const methodBtns = document.querySelectorAll('.method-btn');
    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            methodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function processDonation() {
    const selectedAmount = document.querySelector('.amount-btn.selected');
    const customAmount = document.getElementById('customAmount').value;
    const selectedMethod = document.querySelector('.method-btn.active');
    
    let amount = 0;
    let impact = '';
    
    if (selectedAmount) {
        amount = selectedAmount.dataset.amount * 1000;
        impact = selectedAmount.dataset.impact;
    } else if (customAmount && customAmount >= 1000) {
        amount = parseInt(customAmount);
        impact = 'provide essential support to children in need';
    } else {
        showNotification('Please select or enter a valid donation amount', 'error');
        return;
    }
    
    const method = selectedMethod ? selectedMethod.dataset.method : 'bank';
    
    // Show processing state
    const submitBtn = document.querySelector('.donate-submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate processing
    setTimeout(() => {
        // Show success message
        showNotification(`Thank you for your UGX ${amount.toLocaleString()} donation! ${method === 'bank' ? 'Bank details have been provided.' : 'Redirecting to payment...'}`, 'success');
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        closeDonateModal();
        
        // Show bank details if bank method selected
        if (method === 'bank') {
            showBankDetails();
        }
        
        // Update impact counter
        updateImpactCounter();
        
        // Reset form
        resetDonationForm();
    }, 2000);
}

function showBankDetails() {
    const bankDetails = `Bank: Equity Bank
Account Number: 1042101916385
Account Name: Healinghearts charity organisation
Amount: Please reference your donation`;
    
    // Create modal with bank details
    const modal = document.createElement('div');
    modal.className = 'bank-details-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Bank Transfer Details</h2>
                <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="bank-info">
                <pre>${bankDetails}</pre>
                <button class="copy-btn" onclick="copyBankDetails()">Copy Details</button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
}

function copyBankDetails() {
    const bankDetails = `Bank: Equity Bank
Account Number: 1042101916385
Account Name: Healinghearts charity organisation`;
    
    navigator.clipboard.writeText(bankDetails).then(() => {
        showNotification('Bank details copied to clipboard!', 'success');
    });
}

function updateImpactCounter() {
    // Update the impact statement with new count
    const impactStatement = document.querySelector('.impact-statement p');
    if (impactStatement) {
        const currentCount = 234;
        const newCount = currentCount + 1;
        impactStatement.innerHTML = `🌟 <strong>${newCount} children</strong> helped this month. Join our mission!`;
    }
}

function resetDonationForm() {
    // Reset all selections
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('customAmount').value = '';
    document.getElementById('impactDescription').textContent = 'Select an amount to see your impact';
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.method-btn[data-method="bank"]').classList.add('active');
}

// Add pulse animation to donate button on page load
document.addEventListener('DOMContentLoaded', () => {
    const donateBtn = document.querySelector('.btn-donate');
    if (donateBtn) {
        setTimeout(() => {
            donateBtn.classList.add('pulse');
        }, 2000);
    }
});

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Search Functionality
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        showNotification('Please enter a search term', 'error');
        return;
    }
    
    // Search data - content that can be searched
    const searchableContent = [
        { title: 'Home', url: 'index.html#home', keywords: ['home', 'welcome', 'healing hearts', 'charity'] },
        { title: 'Our Story', url: 'index.html#story', keywords: ['story', 'about', 'mission', 'history'] },
        { title: 'What We Do', url: 'index.html#what-we-do', keywords: ['services', 'programs', 'activities', 'what we do'] },
        { title: 'Impact Dashboard', url: 'impact.html', keywords: ['impact', 'statistics', 'dashboard', 'results'] },
        { title: 'Gallery', url: 'index.html#gallery', keywords: ['gallery', 'photos', 'images', 'pictures'] },
        { title: 'Our Team', url: 'index.html#team', keywords: ['team', 'staff', 'volunteers', 'people'] },
        { title: 'Contact', url: 'index.html#contact', keywords: ['contact', 'phone', 'email', 'location'] },
        { title: 'Donate', url: 'donate.html', keywords: ['donate', 'donation', 'give', 'support'] },
        { title: 'Sponsor a Child', url: 'sponsor.html', keywords: ['sponsor', 'child', 'adoption', 'support child'] }
    ];
    
    // Find matches
    const matches = searchableContent.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.keywords.some(keyword => keyword.includes(searchTerm))
    );
    
    if (matches.length > 0) {
        // Show results notification
        const resultText = matches.length === 1 
            ? `Found: ${matches[0].title}` 
            : `Found ${matches.length} results for "${searchTerm}"`;
        
        showNotification(resultText, 'success');
        
        // Navigate to first match after delay
        setTimeout(() => {
            window.location.href = matches[0].url;
        }, 1500);
    } else {
        showNotification(`No results found for "${searchTerm}"`, 'error');
    }
}

// Search on Enter key
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Testimonials Carousel
let currentTestimonial = 0;
let testimonialsInterval;

function initTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    if (testimonials.length === 0) return;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentTestimonial = index;
    }

    window.changeTestimonial = function(direction) {
        const totalTestimonials = testimonials.length;
        currentTestimonial = (currentTestimonial + direction + totalTestimonials) % totalTestimonials;
        showTestimonial(currentTestimonial);
    };

    window.goToTestimonial = function(index) {
        showTestimonial(index);
    };

    // Clear existing interval if any
    if (testimonialsInterval) {
        clearInterval(testimonialsInterval);
    }

    // Auto-rotate testimonials
    testimonialsInterval = setInterval(() => {
        changeTestimonial(1);
    }, 5000);

    // Initialize first testimonial
    showTestimonial(0);
}

// Initialize testimonials when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTestimonialsCarousel();
});

// Back to Top Button
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.onclick = scrollToTop;
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', () => {
    createBackToTopButton();
});

// Add smooth scrolling to all navigation links
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

// Sticky Navigation with background change
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in classes
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2, .fade-in-delay-3');
    animatedElements.forEach(el => observer.observe(el));
});

// Counter Animation for Impact Stats
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }, 20);
}

// Initialize counter animations when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                animateCounter(stat, number);
            });
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

// Observe impact stats section
const impactStats = document.querySelector('.impact-stats');
if (impactStats) {
    statsObserver.observe(impactStats);
}

// Gallery Lightbox Effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const caption = this.querySelector('.gallery-caption').textContent;
        
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${img.src}" alt="${caption}">
                <p>${caption}</p>
                <button class="lightbox-close">&times;</button>
            </div>
        `;
        
        // Add lightbox styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            cursor: pointer;
        `;
        
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        lightboxContent.style.cssText = `
            text-align: center;
            max-width: 90%;
            max-height: 90%;
        `;
        
        lightboxContent.querySelector('img').style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            border-radius: 10px;
        `;
        
        lightboxContent.querySelector('p').style.cssText = `
            color: white;
            margin-top: 1rem;
            font-size: 1.1rem;
        `;
        
        lightboxContent.querySelector('.lightbox-close').style.cssText = `
            position: absolute;
            top: 20px;
            right: 40px;
            font-size: 40px;
            color: white;
            background: none;
            border: none;
            cursor: pointer;
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close lightbox on click
        lightbox.addEventListener('click', () => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        });
        
        // Close lightbox on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(lightbox);
                document.body.style.overflow = '';
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    });
});

// Form Validation (for future contact form)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add hover effects to cards
document.querySelectorAll('.service-card, .mission-card, .involve-card, .team-member').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Active navigation highlight
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active link styling
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #c41e3a !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Button ripple effect
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(loadingStyle);

// Console welcome message
console.log('%c🌍 Healinghearts charity organisation', 'font-size: 20px; font-weight: bold; color: #c41e3a;');
console.log('%cRestoring Hope. Changing Lives.', 'font-size: 14px; color: #1e3a8a;');
console.log('%cThank you for supporting our mission! 🤲', 'font-size: 12px; color: #ff8c42;');
