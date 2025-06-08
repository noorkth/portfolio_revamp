// Utility functions
const debounce = (func, wait = 20, immediate = false) => {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

const throttle = (func, limit = 100) => {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initSmoothScrolling();
    initAnimations();
    initCurrentYear();
    initSkillBars();
    initContactForm();
    initTypeWriter();
    initScrollReveal();
    initServiceWorker();
    initTestimonialsCarousel();
});
// Service Worker Registration
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('ServiceWorker registration successful');
            }).catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
        });
    }
}
// Dark Mode Functionality
function initDarkMode() {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'dark-mode-toggle';
    toggleContainer.innerHTML = `
        <label class="switch">
            <input type="checkbox" id="darkModeSwitch">
            <span class="slider round"></span>
        </label>
    `;
    document.body.appendChild(toggleContainer);

    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check localStorage or system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeSwitch.checked = true;
    }
    
    // Event listeners
    darkModeSwitch.addEventListener('change', function() {
        const isDark = this.checked;
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Add animation class
        document.body.classList.add('animate__animated', 'animate__faster');
        setTimeout(() => {
            document.body.classList.remove('animate__animated', 'animate__faster');
        }, 300);
    });
    
    // Watch for system preference changes
    prefersDarkScheme.addListener(e => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-mode', e.matches);
            darkModeSwitch.checked = e.matches;
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + 
                                 window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL without jumping
            if (targetId !== '#home') {
                history.pushState(null, null, targetId);
            } else {
                history.pushState(null, null, ' ');
            }
        });
    });

    // Highlight current section on scroll
    window.addEventListener('scroll', throttle(highlightCurrentSection));
    highlightCurrentSection(); // Run once on load
}

function highlightCurrentSection() {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    let currentSection = 'home';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = sectionId;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Animations
function initAnimations() {
    const animateOnScroll = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-section');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('section:not(.hero)').forEach((section, index) => {
            observer.observe(section);
        });
    };

    animateOnScroll();
    window.addEventListener('resize', debounce(animateOnScroll));
}

// Current Year in Footer
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Animate skill bars on scroll
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.submit-btn');
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                const response = await fetch('https://formspree.io/f/xovwaadd', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showSuccessMessage();
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was a problem submitting your form. Please try again later.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
    });

    function validateForm() {
        let isValid = true;
        clearErrors();
        
        // Name validation
        const fullName = document.getElementById('fullName');
        if (!fullName.value.trim()) {
            showError(fullName, 'Name is required');
            isValid = false;
        } else if (fullName.value.trim().length < 3) {
            showError(fullName, 'Name must be at least 3 characters');
            isValid = false;
        }
        
        // Email validation
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }
        
        // Message validation
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters');
            isValid = false;
        }
        
        return isValid;
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        input.style.borderColor = '#e74c3c';
        errorMessage.textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.style.borderColor = '';
        });
    }

    function showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        const contactForm = document.getElementById('contactForm');
        
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
            contactForm.style.display = 'block';
        }, 3000);
    }
}

// Typewriter Effect
function initTypeWriter() {
    const phrases = ["IT Professional", "Videographer", "Drone Pilot", "PC Repair Technician"];
    let currentPhrase = 0;
    let currentLetter = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    const element = document.querySelector('.hero p');
    
    if (!element) return;
    
    function type() {
        const text = phrases[currentPhrase];
        
        if (isDeleting) {
            element.textContent = text.substring(0, currentLetter - 1);
            currentLetter--;
            typingSpeed = 50;
        } else {
            element.textContent = text.substring(0, currentLetter + 1);
            currentLetter++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && currentLetter === text.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of phrase
        } else if (isDeleting && currentLetter === 0) {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing next phrase
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start the typewriter effect after a delay
    setTimeout(type, 1000);
}

// Scroll Reveal Animation
function initScrollReveal() {
    const sections = document.querySelectorAll('section:not(.hero)');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Handle page restoration from bfcache
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Add error handling for YouTube iframes
function handleIframeErrors() {
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.onerror = () => {
            iframe.parentNode.innerHTML = `
                <div class="video-error">
                    <p>Video failed to load. Please check your connection or 
                    <a href="${iframe.src.replace('autoplay=1', 'autoplay=0')}" target="_blank">view on YouTube</a>.</p>
                </div>
            `;
        };
    });
}

// Add web vitals monitoring
function trackWebVitals() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/web-vitals/dist/web-vitals.iife.js';
    script.onload = function() {
        webVitals.getCLS(console.log);
        webVitals.getFID(console.log);
        webVitals.getLCP(console.log);
    };
    document.head.appendChild(script);
}

// Only load web vitals in production
if (window.location.hostname !== 'localhost') {
    trackWebVitals();
}

// Analytics tracker

function googleTracker(category, label, type) {
    if (typeof gtag === 'function') {
        gtag('event', type ? type : 'click', {
            'event_category': category,
            'event_label': label
        });
    } else {
        console.warn('gtag is not defined. Event not tracked:', { category, label, type });
    }
}

// Testimonials

function initTestimonialsCarousel() {
    const carouselEl = document.getElementById('testimonialCarousel');
    if (carouselEl && typeof bootstrap !== 'undefined') {
        new bootstrap.Carousel(carouselEl, {
            interval: 6000,
            ride: 'carousel',
            pause: 'hover',
            wrap: true
        });
    }

    // Optional: Google Analytics tracking on slide change
    const items = carouselEl.querySelectorAll('.carousel-item');
    items.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            googleTracker('testimonial', `Hovered testimonial ${index + 1}`);
        });
    });
}


