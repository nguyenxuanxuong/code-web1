document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Scroll & Mobile Menu ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let lastScrollTop = 0;

    // Show/Hide Navbar on Scroll
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            // Scroll Down
            navbar.style.top = '-80px'; // Hide navbar
        } else {
            // Scroll Up or near top
            navbar.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // Hamburger Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close Menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = ''; // Restore scroll
            }
            // Optional: Smooth scroll handled by CSS, but JS can ensure closure
        });
    });

    // Close menu if clicked outside
     document.addEventListener('click', (event) => {
        if (!navbar.contains(event.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]'); // Select sections with IDs

     function setActiveLink() {
        let index = sections.length;

        while (--index && window.scrollY + navbar.offsetHeight < sections[index].offsetTop) {} // Find the current section

        navLinks.forEach((link) => link.classList.remove('active')); // Remove active class from all

        // Add active class to the corresponding nav link
        // Check if the link exists before trying to add the class
         const activeLink = document.querySelector(`.nav-menu a[href="#${sections[index].id}"]`);
        if (activeLink) {
             activeLink.classList.add('active');
        }
     }

    // Initial check and on scroll
    setActiveLink();
    window.addEventListener('scroll', setActiveLink);


    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
             // Optional: Remove class if scrolling back up
             // else {
             //    entry.target.classList.remove('active');
            // }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        // rootMargin: '-50px 0px -50px 0px' // Adjust trigger point if needed
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- (Optional) Typing Effect (Advanced JS version if needed) ---
    // The CSS version is simpler and often sufficient.
    // If you want more control (e.g., multiple strings, backspacing), use a library or custom JS.
    // Example (Conceptual - needs refinement for specific element):
    /*
    const typingElement = document.querySelector('.typing-effect span'); // Adjust selector
    const textToType = "Sinh viên IT đam mê công nghệ & AI...";
    let charIndex = 0;

    function type() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100); // Adjust typing speed
        } else {
           // Optionally reset or loop
           // setTimeout(() => { typingElement.textContent = ''; charIndex = 0; type(); }, 2000);
        }
    }
    // type(); // Start the typing effect
    */

    // --- Add Font Awesome dynamically if needed (or use the kit link in HTML) ---
    // const fontAwesomeLink = document.createElement('link');
    // fontAwesomeLink.rel = 'stylesheet';
    // fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'; // Example CDN link
    // document.head.appendChild(fontAwesomeLink);


}); // End DOMContentLoaded