// Video Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create modal elements
    const modalHTML = `
        <div class="video-modal" id="videoModal">
            <div class="video-modal-content">
                <button class="video-modal-close" aria-label="Close video">&times;</button>
                <div id="modalVideoContainer">
                    <video id="modalVideo" controls>
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <iframe id="modalYouTube" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get modal elements
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalYouTube = document.getElementById('modalYouTube');
    const closeBtn = document.querySelector('.video-modal-close');

    console.log('Modal elements:', { modal, modalVideo, modalYouTube, closeBtn });

    // Function to open modal with video
    window.openVideoModal = function(videoSrc) {
        if (modal) {
            // Check if it's a YouTube video
            if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
                // Extract video ID from YouTube URL
                const videoId = videoSrc.split('v=')[1] || videoSrc.split('be/')[1];
                if (videoId) {
                    modalVideo.style.display = 'none';
                    modalYouTube.style.display = 'block';
                    modalYouTube.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                }
            } else {
                // Handle local video
                modalVideo.style.display = 'block';
                modalYouTube.style.display = 'none';
                modalVideo.src = videoSrc;
                modalVideo.play();
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Function to close modal
    function closeVideoModal() {
        if (modal) {
            modal.classList.remove('active');
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.src = '';
            }
            if (modalYouTube) {
                modalYouTube.src = '';
            }
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