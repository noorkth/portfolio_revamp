/* Olio Theme Scripts */

(function($) {
    "use strict";
             
    // Initialize when window is loaded
    $(window).on('load', () => $('body').addClass('loaded'));

    // Sticky Header
    (function() {
        const header = $("#header");
        const triggerPoint = 80;
        
        $(window).on('scroll', () => {
            const yOffset = $(window).scrollTop();
            header.toggleClass("navbar-fixed-top", yOffset >= triggerPoint);
        });
    })();

    // Text Rotator
    $(".rotate").textrotator({
        animation: "flipUp",
        separator: ",",
        speed: 2000
    }); 

    // Mobile Menu
    $('.menu-wrap ul.nav').slicknav({
        prependTo: '.header-section .navbar',
        label: '',
        allowParentLinks: true
    });
             
    // Venobox
    $('.img-popup').venobox({
        numeratio: true,
        infinigall: true
    });              
                          
    // Initialize smoothscroll
    smoothScroll.init({
        offset: 60
    });
	 
    // Scroll To Top
    $(window).on('scroll', function() {
        $('#scroll-to-top').fadeToggle($(this).scrollTop() > 100);
    });

    // Initialize WOW
    new WOW().init(); 

})(jQuery);

// Combined DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize horizontal scroller
    initializeHorizontalScroller();
    
    // Initialize testimonial carousel
    initializeTestimonialCarousel();

    // Video Player Functionality
    const videoItems = document.querySelectorAll('.project-item .project-video');
    const videoPlayBtns = document.querySelectorAll('.video-play-btn');

    videoPlayBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const videoItem = videoItems[index];
            const projectItem = videoItem.closest('.project-item');
            
            // Add playing class to project item
            projectItem.classList.add('playing');
            
            // Play video
            videoItem.play();
            
            // Show controls
            videoItem.controls = true;
        });
    });

    videoItems.forEach((video, index) => {
        // Skip adding play event listener for autoplay videos
        if (!video.hasAttribute('autoplay')) {
            video.addEventListener('play', function() {
                const projectItem = video.closest('.project-item');
                projectItem.classList.add('playing');
            });
        }

        video.addEventListener('pause', function() {
            const projectItem = video.closest('.project-item');
            projectItem.classList.remove('playing');
        });

        video.addEventListener('ended', function() {
            const projectItem = video.closest('.project-item');
            projectItem.classList.remove('playing');
            video.controls = false;
        });
    });

    // Initialize VenoBox for popups
    new VenoBox({
        selector: '.img-popup',
        numeration: true,
        infinigall: true,
        share: false,
        spinner: 'rotating-plane'
    });

    // Initialize VenoBox for videos with custom settings
    new VenoBox({
        selector: '.video-popup',
        numeration: true,
        infinigall: true,
        share: false,
        spinner: 'rotating-plane',
        autoplay: true,
        maxWidth: '90%',
        maxHeight: '90%',
        closeColor: '#fff',
        closeBackground: 'rgba(255, 255, 255, 0.2)',
        closeButton: true,
        overlayColor: 'rgba(0, 0, 0, 0.9)',
        overlayClose: true,
        overlayCloseClick: true,
        onOpen: function() {
            // Ensure close button is visible
            const closeBtn = document.querySelector('.vbox-close');
            if (closeBtn) {
                closeBtn.style.display = 'block';
                closeBtn.style.visibility = 'visible';
                closeBtn.style.opacity = '1';
            }
        }
    });

    // Portfolio Section Loading
    const portfolioSection = document.querySelector('.portfolio-section');
    const projectImages = document.querySelectorAll('.project-image');
    const projectVideos = document.querySelectorAll('.project-video');

    // Add loading class to portfolio section
    portfolioSection.classList.add('loading');

    // Handle image loading
    projectImages.forEach(img => {
        img.classList.add('loading');
        
        if (img.complete) {
            img.classList.remove('loading');
        } else {
            img.addEventListener('load', function() {
                img.classList.remove('loading');
            });
            
            img.addEventListener('error', function() {
                img.src = 'img/placeholder.jpg'; // Fallback image
                img.classList.remove('loading');
            });
        }
    });

    // Handle video loading
    projectVideos.forEach(video => {
        video.classList.add('loading');
        
        video.addEventListener('loadeddata', function() {
            video.classList.remove('loading');
        });
        
        video.addEventListener('error', function() {
            video.classList.remove('loading');
            // Replace video with fallback image
            const fallbackImg = document.createElement('img');
            fallbackImg.src = 'img/placeholder.jpg';
            fallbackImg.alt = 'Video not available';
            fallbackImg.classList.add('project-image');
            video.parentNode.replaceChild(fallbackImg, video);
        });
    });

    // Remove loading class when all media is loaded
    Promise.all([
        ...Array.from(projectImages).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
            });
        }),
        ...Array.from(projectVideos).map(video => {
            return new Promise(resolve => {
                video.addEventListener('loadeddata', resolve);
                video.addEventListener('error', resolve);
            });
        })
    ]).then(() => {
        portfolioSection.classList.remove('loading');
    });
});

// Lazy loading for images and videos
if ('IntersectionObserver' in window) {
    const mediaObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const media = entry.target;
                if (media.tagName === 'VIDEO') {
                    media.load();
                } else if (media.tagName === 'IMG' && media.dataset.src) {
                    media.src = media.dataset.src;
                }
                observer.unobserve(media);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.project-image[data-src], .project-video').forEach(media => {
        mediaObserver.observe(media);
    });
}

// Keyboard navigation for project items
document.querySelectorAll('.project-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', item.querySelector('.project-info h3')?.textContent || 'Project item');

    item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.submit-button');
    const submitText = form.querySelector('.submit-text');
    const loadingIcon = form.querySelector('.loading-icon');
    const formResult = document.getElementById('form-result');
    
    // Show loading state
    updateFormUI(submitText, loadingIcon, formResult, 'loading');
    
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Form submission failed');
        return response;
    })
    .then(() => {
        updateFormUI(submitText, loadingIcon, formResult, 'success');
        form.reset();
        setupMessageTimeout(formResult);
    })
    .catch(() => {
        updateFormUI(submitText, loadingIcon, formResult, 'error');
    });
}

// Update form UI elements
function updateFormUI(submitText, loadingIcon, formResult, state) {
    const states = {
        loading: {
            text: 'none',
            icon: 'inline-block',
            result: 'none'
        },
        success: {
            text: 'inline-block',
            icon: 'none',
            result: 'block',
            message: 'Message sent successfully! I will get back to you soon.',
            className: 'form-success'
        },
        error: {
            text: 'inline-block',
            icon: 'none',
            result: 'block',
            message: 'Oops! Something went wrong. Please try again or contact me directly.',
            className: 'form-error'
        }
    };

    const currentState = states[state];
    submitText.style.display = currentState.text;
    loadingIcon.style.display = currentState.icon;
    
    if (state !== 'loading') {
        formResult.innerHTML = `${currentState.message} <span class="close-message">&times;</span>`;
        formResult.className = `form-result ${currentState.className}`;
        formResult.style.display = currentState.result;
        setupCloseButton(formResult);
    }
}

// Setup message timeout
function setupMessageTimeout(formResult) {
    const successTimer = setTimeout(() => {
        formResult.style.display = 'none';
        clearTimeout(successTimer);
    }, 5000);
}

// Setup close button
function setupCloseButton(formResult) {
    formResult.querySelector('.close-message').addEventListener('click', () => {
        formResult.style.display = 'none';
    });
}

// Initialize horizontal scroller
function initializeHorizontalScroller() {
    const scrollContainer = document.querySelector('.horizontal-scroller');
    const scrollItems = document.querySelectorAll('.horizontal-scroller-item');
    const scrollLeftBtn = document.querySelector('.scroller-arrow-left');
    const scrollRightBtn = document.querySelector('.scroller-arrow-right');
    
    if (!scrollContainer || !scrollItems.length) return;
    
    // Calculate scroll amount based on item width
    const scrollAmount = scrollItems[0].offsetWidth + 20; // 20px for gap
    
    // Handle arrow button clicks
    if (scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    scrollRightBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Hide left arrow initially
    scrollLeftBtn.style.display = 'none';
    
    // Show/hide arrows based on scroll position
    scrollContainer.addEventListener('scroll', () => {
        const scrollLeft = scrollContainer.scrollLeft;
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        scrollLeftBtn.style.display = scrollLeft > 0 ? 'flex' : 'none';
        scrollRightBtn.style.display = scrollLeft < maxScroll - 5 ? 'flex' : 'none';
    });
} 
    
    // Enable smooth scrolling with mouse wheel
    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
    });
    
    // Enable touch scrolling
    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Add grab cursor style
    scrollContainer.style.cursor = 'grab';
}

// Initialize Testimonial Carousel
function initializeTestimonialCarousel() {
    const carousel = document.getElementById('testimonialCarousel');
    if (!carousel) return;

    // Initialize Bootstrap carousel with custom options
    const testimonialCarousel = new bootstrap.Carousel(carousel, {
        interval: 5000,
        wrap: true,
        keyboard: true,
        pause: 'hover',
        touch: true
    });

    // Add dynamic indicators
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelector('.carousel-indicators');
    
    if (indicators) {
        items.forEach((_, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-bs-target', '#testimonialCarousel');
            button.setAttribute('data-bs-slide-to', index);
            button.setAttribute('aria-label', `Slide ${index + 1}`);
            if (index === 0) {
                button.classList.add('active');
                button.setAttribute('aria-current', 'true');
            }
            indicators.appendChild(button);
        });
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            testimonialCarousel.prev();
        } else if (e.key === 'ArrowRight') {
            testimonialCarousel.next();
        }
    });

    // Add touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            testimonialCarousel.next();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            testimonialCarousel.prev();
        }
    }

    // Add pause on hover
    carousel.addEventListener('mouseenter', () => {
        testimonialCarousel.pause();
    });

    carousel.addEventListener('mouseleave', () => {
        testimonialCarousel.cycle();
    });
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector('.submit-text');
    const loadingIcon = submitButton.querySelector('.loading-icon');
    
    // Store submitted emails
    const submittedEmails = new Set();
    
    // Close message buttons
    document.querySelectorAll('.close-message').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.form-message').style.display = 'none';
        });
    });

    // Check for duplicate email submission
    function isDuplicateEmail(email) {
        return submittedEmails.has(email);
    }

    // Add email to submitted set
    function addSubmittedEmail(email) {
        submittedEmails.add(email);
        // Store in localStorage for persistence
        localStorage.setItem('submittedEmails', JSON.stringify([...submittedEmails]));
    }

    // Load previously submitted emails
    function loadSubmittedEmails() {
        const stored = localStorage.getItem('submittedEmails');
        if (stored) {
            const emails = JSON.parse(stored);
            emails.forEach(email => submittedEmails.add(email));
        }
    }

    // Initialize by loading stored emails
    loadSubmittedEmails();

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = this.querySelector('#email').value;
        
        // Check for duplicate submission
        if (isDuplicateEmail(email)) {
            formError.querySelector('p').textContent = 'You have already submitted a message with this email address. Please wait before submitting again.';
            formError.style.display = 'flex';
            return;
        }
        
        // Show loading state
        submitButton.classList.add('is-submitting');
        
        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Add email to submitted set
                addSubmittedEmail(email);
                // Show success message
                formSuccess.style.display = 'flex';
                // Reset form
                this.reset();
            } else {
                // Show error message
                formError.style.display = 'flex';
            }
        } catch (error) {
            // Show error message
            formError.style.display = 'flex';
        } finally {
            // Remove loading state
            submitButton.classList.remove('is-submitting');
        }
    });
}); 