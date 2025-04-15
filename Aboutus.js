'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
            // rootMargin: '0px 0px -50px 0px' // Optional: Trigger animation a bit earlier/later
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainHeader = document.getElementById('main-header');
    const nav = mainHeader ? mainHeader.querySelector('nav') : null;

    if (menuToggle && mainHeader && nav) {
        menuToggle.addEventListener('click', () => {
            mainHeader.classList.toggle('nav-active'); // Toggle class on header
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);

            // Optional: Change burger icon to X
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times'); // Make sure you have Font Awesome loaded
            }
        });

        // Close menu if clicking outside of it (optional but good UX)
        document.addEventListener('click', (event) => {
             if (mainHeader.classList.contains('nav-active') &&
                 !mainHeader.contains(event.target) &&
                 event.target !== menuToggle &&
                 !menuToggle.contains(event.target)) // Ensure click wasn't on toggle itself
                {
                    mainHeader.classList.remove('nav-active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    const icon = menuToggle.querySelector('i');
                     if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
        });

        // Close menu when a nav link is clicked (for single-page apps or jumping to sections)
         nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainHeader.classList.contains('nav-active')) {
                    mainHeader.classList.remove('nav-active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                     const icon = menuToggle.querySelector('i');
                     if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });
    } else {
        if (!menuToggle) console.warn("Mobile menu toggle button not found.");
        if (!mainHeader) console.warn("Main header element not found.");
        if (!nav) console.warn("Navigation element inside header not found.");
    }


    // --- Dynamic Year in Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("Element with ID 'current-year' not found in the footer.");
    }

    // --- Add more JS functionalities as needed ---
    // Example: Maybe a testimonial slider, specific interactive elements, etc.

}); // End DOMContentLoaded