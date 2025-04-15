document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('main-header');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const body = document.body;
    const backToTopButton = document.getElementById('back-to-top');
    const heroBackground = document.querySelector('.hero-background'); // For effects

    const scrollThreshold = 50;
    const backToTopThreshold = 300;

    // Flag to trigger hero background animation once
    let heroAnimated = false;

    // --- Sticky Header & Back to Top Button ---
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Sticky Header Logic
        if (header) {
            if (currentScrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to Top Button Logic
        if (backToTopButton) {
            if (currentScrollY > backToTopThreshold) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }

        // --- Subtle Hero Background Parallax / Zoom ---
        if (heroBackground) {
            // Option 1: Parallax Effect (already implemented)
            if (currentScrollY < window.innerHeight * 1.5) {
                const speed = 0.35; // Adjusted speed
                const offset = currentScrollY * speed;
                heroBackground.style.transform = `translateY(${offset}px) scale(1.05)`; // Maintain slight initial zoom if parallaxing
            }

            // Option 2: Trigger subtle zoom/pan ONCE on load/first scroll (Add class)
            if (!heroAnimated && currentScrollY >= 0) { // Trigger immediately or on first scroll pixel
                heroBackground.classList.add('loaded');
                heroAnimated = true; // Prevent re-triggering
                // The actual animation is handled by CSS transition on the .loaded class
            }
        }


        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load

    // Trigger hero animation shortly after load if not scrolled yet
    setTimeout(() => {
        if (!heroAnimated && heroBackground) {
             heroBackground.classList.add('loaded');
             heroAnimated = true;
        }
    }, 300);


    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ("IntersectionObserver" in window && animatedElements.length > 0) {
        const observerOptions = {
            threshold: 0.15, // Trigger animation when 15% of the element is visible
            rootMargin: "0px 0px -50px 0px" // Trigger a bit earlier
        };

        const observerCallback = (entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Animate only once
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(element => {
            observer.observe(element);
        });

    } else if (animatedElements.length > 0) {
        // Fallback for older browsers
        console.warn("IntersectionObserver not supported. Showing all animated elements immediately.");
        animatedElements.forEach(element => {
            element.classList.add('is-visible'); // Show elements immediately
        });
    }

    // --- Update Footer Year ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Mobile Menu Toggle ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);

            // Prevent body scroll when mobile menu is open
            body.style.overflow = isActive ? 'hidden' : '';
            // Add class to body to potentially dim content if needed via CSS
            body.classList.toggle('mobile-menu-open', isActive);
        });

        // Close menu if a link *inside the nav* is clicked (for SPA or # links)
        navLinks.querySelectorAll('a:not(.btn)').forEach(link => {
            link.addEventListener('click', (e) => {
                if (navLinks.classList.contains('active')) {
                    const href = link.getAttribute('href');
                    const isHashLink = href && href.startsWith('#');
                    const isExternalLink = href && (link.hostname !== window.location.hostname || !href.startsWith('/'));

                    // Only close immediately for internal/hash links
                    // External links will navigate away anyway
                    if (isHashLink || !isExternalLink) {
                       setTimeout(() => {
                            navLinks.classList.remove('active');
                            menuToggle.classList.remove('active');
                            menuToggle.setAttribute('aria-expanded', 'false');
                            body.style.overflow = '';
                            body.classList.remove('mobile-menu-open');
                        }, 150); // Small delay allows link action to start
                    }
                }
            });
        });

        // Close menu when clicking outside the nav area on mobile
        document.addEventListener('click', (event) => {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
                body.classList.remove('mobile-menu-open');
            }
        });
    }

    // --- Back to Top Button Click ---
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Smooth scroll for ALL anchor links starting with # ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1 && href !== '#') { // Avoid lone '#'
                try {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault(); // Prevent default jump

                        // Calculate offset considering the fixed header height
                        let headerOffset = 0;
                        if (header && window.getComputedStyle(header).position === 'fixed') {
                            headerOffset = header.offsetHeight;
                        }
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        // Add window.pageYOffset for absolute position, subtract header, add small buffer
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    } else {
                        console.warn("Smooth scroll target not found:", href);
                    }
                } catch (error) {
                    console.error("Invalid selector for smooth scroll:", href, error);
                }
            }
        });
    });

}); // End DOMContentLoaded