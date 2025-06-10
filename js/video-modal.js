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

    // Get modal elements
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = document.querySelector('.video-modal-close');

    console.log('Modal elements:', { modal, modalVideo, closeBtn });

    // Function to open modal with video
    window.openVideoModal = function(videoSrc) {
        console.log('Opening modal with video:', videoSrc);
        if (modal && modalVideo) {
            modalVideo.src = videoSrc;
            modal.classList.add('active');
            modalVideo.play();
            document.body.style.overflow = 'hidden';
        }
    };

    // Function to close modal
    function closeVideoModal() {
        console.log('Closing modal');
        if (modal && modalVideo) {
            modal.classList.remove('active');
            modalVideo.pause();
            modalVideo.src = '';
            document.body.style.overflow = '';
        }
    }

    // Add click event listeners to video buttons
    document.querySelectorAll('.watch-video-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const videoItem = this.closest('.video-item');
            if (videoItem) {
                const videoSrc = videoItem.getAttribute('data-video');
                if (videoSrc) {
                    openVideoModal(videoSrc);
                }
            }
        });
    });

    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeVideoModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });
}); 