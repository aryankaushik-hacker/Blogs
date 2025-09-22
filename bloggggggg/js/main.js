// Main JavaScript for MoneyMaker Blog
(function() {
    'use strict';

    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const scrollToTop = document.getElementById('scrollToTop');
    const contactForm = document.getElementById('contactForm');

    // Theme Management
    class ThemeManager {
        constructor() {
            this.currentTheme = localStorage.getItem('theme') || 'light';
            this.init();
        }

        init() {
            this.applyTheme();
            this.bindEvents();
        }

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            this.updateToggleIcon();
        }

        toggleTheme() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', this.currentTheme);
            this.applyTheme();
        }

        updateToggleIcon() {
            if (themeToggle) {
                themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        }

        bindEvents() {
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }
        }
    }

    // Mobile Navigation
    class MobileNav {
        constructor() {
            this.isOpen = false;
            this.init();
        }

        init() {
            this.bindEvents();
        }

        toggle() {
            this.isOpen = !this.isOpen;
            navMenu.classList.toggle('active', this.isOpen);
            hamburger.classList.toggle('active', this.isOpen);
            document.body.style.overflow = this.isOpen ? 'hidden' : '';
        }

        close() {
            this.isOpen = false;
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }

        bindEvents() {
            if (hamburger) {
                hamburger.addEventListener('click', () => this.toggle());
            }

            // Close menu when clicking on nav links
            if (navMenu) {
                navMenu.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => this.close());
                });
            }

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    this.close();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    // Scroll to Top
    class ScrollToTop {
        constructor() {
            this.showThreshold = 300;
            this.init();
        }

        init() {
            this.bindEvents();
            this.toggleVisibility();
        }

        bindEvents() {
            if (scrollToTop) {
                scrollToTop.addEventListener('click', () => this.scrollToTop());
            }

            window.addEventListener('scroll', () => this.toggleVisibility());
        }

        toggleVisibility() {
            if (scrollToTop) {
                const shouldShow = window.scrollY > this.showThreshold;
                scrollToTop.classList.toggle('visible', shouldShow);
            }
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Contact Form
    class ContactForm {
        constructor() {
            this.isSubmitting = false;
            this.init();
        }

        init() {
            if (contactForm) {
                this.bindEvents();
            }
        }

        bindEvents() {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        async handleSubmit(e) {
            e.preventDefault();

            if (this.isSubmitting) return;

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            // Basic validation
            if (!this.validateForm(data)) return;

            this.isSubmitting = true;
            this.setLoadingState(true);

            try {
                // Simulate form submission (replace with actual endpoint)
                await this.simulateSubmission(data);
                this.showSuccessMessage();
                contactForm.reset();
            } catch (error) {
                this.showErrorMessage('Something went wrong. Please try again.');
            } finally {
                this.isSubmitting = false;
                this.setLoadingState(false);
            }
        }

        validateForm(data) {
            const { name, email, message } = data;

            if (!name.trim()) {
                this.showErrorMessage('Please enter your name.');
                return false;
            }

            if (!email.trim()) {
                this.showErrorMessage('Please enter your email.');
                return false;
            }

            if (!this.isValidEmail(email)) {
                this.showErrorMessage('Please enter a valid email address.');
                return false;
            }

            if (!message.trim()) {
                this.showErrorMessage('Please enter your message.');
                return false;
            }

            return true;
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        setLoadingState(loading) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = loading;
                submitButton.textContent = loading ? 'Sending...' : 'Send Message';
                contactForm.classList.toggle('loading', loading);
            }
        }

        showSuccessMessage() {
            this.showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
        }

        showErrorMessage(message) {
            this.showMessage(message, 'error');
        }

        showMessage(message, type) {
            // Remove existing messages
            const existingMessage = contactForm.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Create message element
            const messageEl = document.createElement('div');
            messageEl.className = `form-message ${type}`;
            messageEl.textContent = message;

            // Insert message
            contactForm.insertBefore(messageEl, contactForm.firstChild);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 5000);
        }

        simulateSubmission(data) {
            return new Promise((resolve) => {
                // Simulate network delay
                setTimeout(() => {
                    console.log('Form submitted:', data);
                    resolve();
                }, 1000);
            });
        }
    }

    // Smooth Scrolling for Anchor Links
    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    }

    // Animation on Scroll
    class ScrollAnimations {
        constructor() {
            this.observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver(
                    (entries) => this.handleIntersection(entries),
                    this.observerOptions
                );

                // Observe elements for animation
                document.querySelectorAll('.feature-card, .method-card, .blog-article, .contact-form').forEach(el => {
                    this.observer.observe(el);
                });
            }
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // Performance Optimization
    class PerformanceOptimizer {
        constructor() {
            this.init();
        }

        init() {
            this.lazyLoadImages();
            this.prefetchCriticalResources();
        }

        lazyLoadImages() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }

        prefetchCriticalResources() {
            // Prefetch important pages
            const criticalPages = ['blog.html', 'contact.html'];
            criticalPages.forEach(page => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            });
        }
    }

    // Initialize all modules when DOM is ready
    function initializeApp() {
        new ThemeManager();
        new MobileNav();
        new ScrollToTop();
        new ContactForm();
        new SmoothScroll();
        new ScrollAnimations();
        new PerformanceOptimizer();

        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause non-essential animations/processes
            document.body.classList.add('page-hidden');
        } else {
            // Resume animations/processes
            document.body.classList.remove('page-hidden');
        }
    });

    // Error handling
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // In production, you might want to send this to an error tracking service
    });

    // Export for potential external use
    window.MoneyMakerBlog = {
        ThemeManager,
        MobileNav,
        ScrollToTop,
        ContactForm
    };

})();
