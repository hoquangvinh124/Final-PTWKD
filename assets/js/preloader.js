// Video Preloader Script
class VideoPreloader {
    constructor() {
        this.preloader = null;
        this.video = null;
        this.skipBtn = null;
        this.isPageLoaded = false;
        this.sessionKey = 'preloader_shown';
        this.init();
    }

    init() {
        // Kiểm tra ngay lập tức trước khi DOM render
        this.preloader = document.getElementById('videoPreloader');
        
        // Kiểm tra xem preloader đã hiển thị trong session này chưa
        if (sessionStorage.getItem(this.sessionKey)) {
            // Đã hiển thị rồi, ẩn ngay bằng CSS để không bị nháy
            if (this.preloader) {
                this.preloader.classList.add('preloader-hidden');
            }
            return;
        }

        // Lần đầu tiên trong session, hiển thị preloader
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }

        // Hide preloader when page fully loads
        window.addEventListener('load', () => {
            this.isPageLoaded = true;
            setTimeout(() => {
                this.hidePreloader();
                // Đánh dấu đã hiển thị preloader trong session này
                sessionStorage.setItem(this.sessionKey, 'true');
            }, 300);
        });
    }

    setup() {
        this.preloader = document.getElementById('videoPreloader');
        this.video = document.getElementById('preloaderVideo');
        this.skipBtn = document.getElementById('skipPreloader');

        if (!this.preloader || !this.video) {
            console.warn('Preloader elements not found');
            return;
        }

        // Prevent body scroll
        document.body.classList.add('preloader-active');

        // Setup event listeners
        this.setupEventListeners();

        // Auto-play video
        this.playVideo();
    }

    setupEventListeners() {
        // Skip button click
        if (this.skipBtn) {
            this.skipBtn.addEventListener('click', () => {
                this.hidePreloader();
                sessionStorage.setItem(this.sessionKey, 'true');
            });
        }

        // Optional: Skip with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.preloader && !this.preloader.classList.contains('fade-out')) {
                this.hidePreloader();
                sessionStorage.setItem(this.sessionKey, 'true');
            }
        });

        // Error handling
        this.video.addEventListener('error', (e) => {
            console.error('Video preloader error:', e);
            this.hidePreloader();
            sessionStorage.setItem(this.sessionKey, 'true');
        });

        // Video can play
        this.video.addEventListener('canplay', () => {
            console.log('Video preloader ready to play');
        });
    }

    playVideo() {
        // Try to play the video
        const playPromise = this.video.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Video preloader playing');
                })
                .catch(error => {
                    console.error('Autoplay prevented:', error);
                    // If autoplay is blocked, show skip button prominently
                    if (this.skipBtn) {
                        this.skipBtn.style.display = 'block';
                        this.skipBtn.textContent = 'Click to Continue';
                        this.skipBtn.style.fontSize = '18px';
                    }
                });
        }
    }

    hidePreloader() {
        if (!this.preloader) return;

        // Pause video
        if (this.video) {
            this.video.pause();
        }

        // Fade out
        this.preloader.classList.add('fade-out');

        // Remove from DOM and re-enable scroll after transition
        setTimeout(() => {
            if (this.preloader && this.preloader.parentNode) {
                this.preloader.parentNode.removeChild(this.preloader);
            }
            document.body.classList.remove('preloader-active');
        }, 500);
    }
}

// Initialize preloader
new VideoPreloader();
