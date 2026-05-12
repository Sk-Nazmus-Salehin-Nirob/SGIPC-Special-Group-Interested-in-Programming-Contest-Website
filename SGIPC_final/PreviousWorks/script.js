/* =========================================
   SGIPC KUET - Interactive Features
   ========================================= */

// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const primaryBtn = document.querySelector('.btn-primary');
const secondaryBtn = document.querySelector('.btn-secondary');

// =========================================
// 1. MOBILE MENU TOGGLE
// =========================================
function createMobileMenu() {
    const navbar = document.querySelector('.navbar');
    const navContent = document.querySelector('.navbar-content');
    
    // Create hamburger menu button
    const hamburger = document.createElement('div');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    
    navbar.style.position = 'fixed';
    navContent.appendChild(hamburger);
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// =========================================
// 2. ACTIVE NAV LINK HIGHLIGHTING
// =========================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// =========================================
// 3. SCROLL ANIMATIONS
// =========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and elements
    const animateElements = document.querySelectorAll(
        '.activity-card, .feature-item, .stat, .footer-col'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// Add CSS for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            animation: slideUp 0.6s ease-out forwards !important;
        }
        
        .nav-link.active {
            color: var(--accent);
            border-bottom: 2px solid var(--accent);
            padding-bottom: 4px;
        }
        
        /* Mobile Menu Styles */
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            gap: 6px;
        }
        
        .hamburger span {
            width: 25px;
            height: 3px;
            background: var(--text-primary);
            border-radius: 2px;
            transition: var(--transition);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(10px, 10px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(8px, -8px);
        }
        
        @media (max-width: 768px) {
            .hamburger {
                display: flex;
            }
            
            .nav-menu {
                position: absolute;
                top: 70px;
                left: 0;
                right: 0;
                flex-direction: column;
                background: rgba(15, 23, 42, 0.95);
                gap: 0;
                max-height: 0;
                overflow: hidden;
                transition: var(--transition);
            }
            
            .nav-menu.active {
                max-height: 300px;
                padding: 20px 0;
            }
            
            .nav-menu li {
                padding: 10px 20px;
                border-bottom: 1px solid rgba(99, 102, 241, 0.1);
            }
        }
    `;
    document.head.appendChild(style);
}

// =========================================
// 4. BUTTON CLICK HANDLERS
// =========================================
function initButtonHandlers() {
    if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
            console.log('Get Started clicked');
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', () => {
            console.log('Join Community clicked');
            showJoinModal();
        });
    }
}

// =========================================
// 5. JOIN MODAL
// =========================================
function showJoinModal() {
    const existingModal = document.getElementById('joinModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'joinModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Join SGIPC KUET</h2>
            <form id="joinForm">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="level">Experience Level</label>
                    <select id="level" name="level" required>
                        <option value="">Select level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Join Now</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .modal {
            display: flex;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: var(--card-bg);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 12px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .close-btn {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 28px;
            cursor: pointer;
            color: var(--text-secondary);
            transition: var(--transition);
        }
        
        .close-btn:hover {
            color: var(--accent);
        }
        
        .modal-content h2 {
            margin-bottom: 20px;
            color: var(--text-primary);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 6px;
            background: rgba(99, 102, 241, 0.1);
            color: var(--text-primary);
            font-family: inherit;
            transition: var(--transition);
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--primary-color);
            background: rgba(99, 102, 241, 0.2);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        
        .form-group button {
            width: 100%;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(modalStyle);
    
    // Handle form submission
    const form = document.getElementById('joinForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const level = document.getElementById('level').value;
        
        console.log('Join request:', { name, email, level });
        alert(`Welcome ${name}! We'll contact you at ${email} soon.`);
        modal.remove();
    });
    
    // Close modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// =========================================
// 6. SCROLL TO TOP BUTTON
// =========================================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 12px 16px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        opacity: 0;
        transition: var(--transition);
        z-index: 999;
        display: none;
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.display = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.background = 'var(--secondary-color)';
        scrollBtn.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.background = 'var(--primary-color)';
        scrollBtn.style.transform = 'scale(1)';
    });
}

// =========================================
// 7. NAVBAR SCROLL EFFECT
// =========================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        }
    });
}

// =========================================
// 8. INITIALIZE ALL FEATURES
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('SGIPC KUET - Initializing interactive features...');
    
    addAnimationStyles();
    createMobileMenu();
    updateActiveNavLink();
    initScrollAnimations();
    initButtonHandlers();
    initScrollToTop();
    initNavbarScroll();
    
    console.log('✓ All features initialized successfully!');
});
