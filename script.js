/**
 * UsiBlocate Cluj-Napoca - Main JavaScript
 * Handles animations, interactions, and UI functionality
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const stickyCta = document.getElementById('stickyCta');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Configuration
    const config = {
        scrollThreshold: 100,
        animationOffset: 100,
        counterDuration: 2000,
        counterStep: 30
    };

    /**
     * Initialize all functionality
     */
    function init() {
        setupScrollEffects();
        setupMobileNavigation();
        setupSmoothScrolling();
        setupScrollAnimations();
        setupCounterAnimation();
        setupHoverEffects();
    }

    /**
     * Handle scroll-based effects (header, sticky CTA)
     */
    function setupScrollEffects() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateOnScroll() {
            const currentScrollY = window.scrollY;

            // Header scroll effect
            if (currentScrollY > config.scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Sticky CTA visibility (mobile)
            if (stickyCta) {
                if (currentScrollY > 500) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateOnScroll();
    }

    /**
     * Mobile navigation toggle
     */
    function setupMobileNavigation() {
        if (!navToggle || !navMenu) return;

        // Create overlay element for mobile menu
        let overlay = document.querySelector('.nav-menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-menu-overlay';
            document.body.appendChild(overlay);
        }

        function openMenu() {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            navToggle.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.setAttribute('aria-expanded', 'false');
        }

        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMenu);

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle resize - close menu if window becomes larger
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /**
     * Smooth scrolling for anchor links
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    /**
     * Scroll-triggered animations using Intersection Observer
     */
    function setupScrollAnimations() {
        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for multiple elements
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Counter animation for statistics
     */
    function setupCounterAnimation() {
        if (!statNumbers.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    /**
     * Animate a single counter element
     */
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'), 10);
        const duration = config.counterDuration;
        const step = config.counterStep;
        const increment = target / (duration / step);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, step);
    }

    /**
     * Setup hover effects and micro-interactions
     */
    function setupHoverEffects() {
        // Service cards hover effect
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Button ripple effect
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    width: 100px;
                    height: 100px;
                    left: ${x - 50}px;
                    top: ${y - 50}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation keyframes
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Parallax effect for hero section (optional - subtle)
     */
    function setupParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
                }
            }
        }, { passive: true });
    }

    /**
     * Active navigation link based on scroll position
     */
    function setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        
        function highlightNavigation() {
            const scrollY = window.scrollY;
            const headerHeight = header.offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', throttle(highlightNavigation, 100), { passive: true });
    }

    /**
     * Throttle utility function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce utility function
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * Preload critical images
     */
    function preloadImages() {
        const criticalImages = [
            // Add any critical image URLs here
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    /**
     * Handle page visibility changes
     */
    function setupVisibilityHandling() {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Pause animations when page is not visible
                document.body.classList.add('page-hidden');
            } else {
                document.body.classList.remove('page-hidden');
            }
        });
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Additional initialization after window load
    window.addEventListener('load', function() {
        setupParallax();
        setupActiveNavigation();
        preloadImages();
        setupVisibilityHandling();
        
        // Remove loading state
        document.body.classList.add('loaded');
    });

    // Handle resize events
    window.addEventListener('resize', debounce(function() {
        // Recalculate any dimension-dependent values
        // Mobile menu close is now handled in setupMobileNavigation
    }, 250));

})();
