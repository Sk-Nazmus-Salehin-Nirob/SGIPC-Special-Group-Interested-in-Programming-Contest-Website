/* =========================================
   SGIPC KUET – ASP.NET MVC Site JavaScript
   wwwroot/js/site.js
   ========================================= */

(function () {
    'use strict';

    // =========================================
    // 1. NAVBAR SCROLL EFFECT & ACTIVE STATE
    // =========================================
    var navbar = document.getElementById('mainNav');

    function handleNavbarScroll() {
        if (!navbar) return;
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Mark active nav link based on current URL
    function setActiveNavLink() {
        var links = document.querySelectorAll('.nav-link');
        var currentPath = window.location.pathname.toLowerCase();

        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;
            var linkPath = href.toLowerCase();

            // Home link: active only on root
            if (linkPath === '/' || linkPath === '/home/index' || linkPath === '/home') {
                if (currentPath === '/' || currentPath === '/home' || currentPath === '/home/index') {
                    link.classList.add('active');
                }
            } else if (linkPath !== '/' && currentPath.startsWith(linkPath)) {
                link.classList.add('active');
            }
        });
    }

    // =========================================
    // 2. MOBILE HAMBURGER MENU
    // =========================================
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var navMenu = document.getElementById('navMenu');

    function initHamburger() {
        if (!hamburgerBtn || !navMenu) return;

        hamburgerBtn.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('open');
            hamburgerBtn.classList.toggle('open', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (!navbar.contains(e.target)) {
                navMenu.classList.remove('open');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // =========================================
    // 3. SCROLL-TO-TOP BUTTON
    // =========================================
    var scrollBtn = document.getElementById('scrollToTopBtn');

    function handleScrollToTop() {
        if (!scrollBtn) return;
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }

    function initScrollToTop() {
        if (!scrollBtn) return;
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 4. SCROLL ANIMATIONS (Intersection Observer)
    // =========================================
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        var options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        var targets = document.querySelectorAll(
            '.activity-card, .feature-item, .stat-card, .stat-item, .footer-col, .about-highlight-card, .contact-item'
        );

        targets.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            observer.observe(el);
        });
    }

    // =========================================
    // 5. FORM VALIDATION FEEDBACK STYLING
    //    (Adds/removes classes on input blur
    //     for extra UX on top of ASP.NET
    //     client-side validation)
    // =========================================
    function initFormFeedback() {
        var inputs = document.querySelectorAll('.form-control');
        inputs.forEach(function (input) {
            input.addEventListener('blur', function () {
                if (input.value.trim() !== '') {
                    input.style.borderColor = 'rgba(99,102,241,0.55)';
                }
            });
            input.addEventListener('input', function () {
                // Clear red border when user starts typing
                input.style.borderColor = '';
            });
        });
    }

    // =========================================
    // 6. COMBINED SCROLL LISTENER
    // =========================================
    window.addEventListener('scroll', function () {
        handleNavbarScroll();
        handleScrollToTop();
    }, { passive: true });

    // =========================================
    // 7. INIT ON DOM READY
    // =========================================
    document.addEventListener('DOMContentLoaded', function () {
        handleNavbarScroll();
        handleScrollToTop();
        setActiveNavLink();
        initHamburger();
        initScrollToTop();
        initScrollAnimations();
        initFormFeedback();
    });

}());
