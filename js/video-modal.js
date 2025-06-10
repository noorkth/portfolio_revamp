// Video Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create modal elements
    const modalHTML = `
        <div class="video-modal" id="videoModal">
            <div class="video-modal-content">
                <button class="video-modal-close" aria-label="Close video">&times;</button>
                <video id="modalVideo" controls>
                    <source src="" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = modal.querySelector('.video-modal-close');
    const videoItems = document.querySelectorAll('.video-item');

    console.log('Modal elements:', { modal, modalVideo, closeBtn });
    console.log('Video items:', videoItems);

    // Function to open modal with video
    function openVideoModal(videoSrc) {
        console.log('Opening modal with video:', videoSrc);
        if (modalVideo) {
            modalVideo.src = videoSrc;
            modal.classList.add('active');
            modalVideo.play();
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modal video element not found');
        }
    }

    // Function to close modal
    function closeVideoModal() {
        console.log('Closing modal');
        if (modalVideo) {
            modal.classList.remove('active');
            modalVideo.pause();
            modalVideo.src = '';
            document.body.style.overflow = '';
        }
    }

    // Add click event to video items
    videoItems.forEach(item => {
        const videoSrc = item.getAttribute('data-video');
        const playButton = item.querySelector('.project-link');
        
        console.log('Setting up video item:', { item, videoSrc, playButton });
        
        if (videoSrc && playButton) {
            playButton.addEventListener('click', (e) => {
                console.log('Play button clicked');
                e.preventDefault();
                e.stopPropagation();
                openVideoModal(videoSrc);
            });
        }
    });

    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}); 