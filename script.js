// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initCarousels();
    initContactForm();
    initLoadingScreen();
    initMediaTypeDetection();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 14, 26, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 14, 26, 0.95)';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Enhanced carousel functionality with media type support
function initCarousels() {
    const carousels = document.querySelectorAll('.media-carousel');
    
    carousels.forEach(carousel => {
        const carouselId = carousel.getAttribute('data-carousel');
        let currentSlide = 0;
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.dot');
        const totalSlides = slides.length;
        let autoPlayInterval;

        // Auto-play function with pause on hover
        function autoPlay() {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % totalSlides;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            
            // Pause videos when switching slides
            pauseAllVideos(carousel);
        }

        // Start auto-play
        function startAutoPlay() {
            autoPlayInterval = setInterval(autoPlay, 4000);
        }

        // Stop auto-play
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Initialize auto-play
        startAutoPlay();

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Store carousel data for global functions
        carousel.carouselData = {
            currentSlide,
            totalSlides,
            slides,
            dots,
            autoPlayInterval
        };
    });
}

// Global carousel functions (called from HTML)
function changeSlide(carouselId, direction) {
    const carousel = document.querySelector(`[data-carousel="${carouselId}"]`);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    const totalSlides = slides.length;
    
    let currentIndex = 0;
    slides.forEach((slide, index) => {
        if (slide.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Remove active class from current slide
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    
    // Calculate new index
    let newIndex = currentIndex + direction;
    if (newIndex >= totalSlides) {
        newIndex = 0;
    } else if (newIndex < 0) {
        newIndex = totalSlides - 1;
    }
    
    // Add active class to new slide
    slides[newIndex].classList.add('active');
    dots[newIndex].classList.add('active');
    
    // Pause all videos in this carousel
    pauseAllVideos(carousel);
}

function currentSlide(carouselId, slideNumber) {
    const carousel = document.querySelector(`[data-carousel="${carouselId}"]`);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.dot');
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    // Add active class to selected slide and dot
    slides[slideNumber - 1].classList.add('active');
    dots[slideNumber - 1].classList.add('active');
    
    // Pause all videos in this carousel
    pauseAllVideos(carousel);
}

// Function to pause all videos in a carousel
function pauseAllVideos(carousel) {
    const videos = carousel.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
    });
}

// Function to play video in active slide
function playActiveVideo(carousel) {
    const activeSlide = carousel.querySelector('.carousel-slide.active');
    if (activeSlide) {
        const video = activeSlide.querySelector('video');
        if (video) {
            video.play().catch(e => {
                console.log('Video autoplay prevented:', e);
            });
        }
    }
}

// Media type detection and badge styling
function initMediaTypeDetection() {
    const carousels = document.querySelectorAll('.media-carousel');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        slides.forEach(slide => {
            const badge = slide.querySelector('.media-type-badge');
            const img = slide.querySelector('img');
            const video = slide.querySelector('video');
            
            if (img) {
                const src = img.src || img.getAttribute('src');
                if (src.includes('giphy.com') || src.includes('.gif')) {
                    badge.textContent = 'GIF';
                    badge.setAttribute('data-type', 'gif');
                } else {
                    badge.textContent = 'IMG';
                    badge.setAttribute('data-type', 'img');
                }
            } else if (video) {
                badge.textContent = 'VIDEO';
                badge.setAttribute('data-type', 'video');
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const subject = form.querySelector('input[placeholder="Subject"]').value;
            const message = form.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully!', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Loading screen
function initLoadingScreen() {
    // Create loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingScreen);
    
    // Remove loading screen when page is loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(loadingScreen)) {
                    document.body.removeChild(loadingScreen);
                }
            }, 500);
        }, 1000);
    });
}

// Parallax effect for floating elements
function initParallax() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize parallax effect
initParallax();

// Smooth reveal animation for stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent);
                let currentNumber = 0;
                const increment = finalNumber / 50;
                
                const counter = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        target.textContent = finalNumber + '+';
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentNumber) + '+';
                    }
                }, 50);
                
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Initialize stats animation
animateStats();

// Add hover effects to project cards
function initProjectHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize project hover effects
initProjectHoverEffects();

// Add click effect to buttons
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (this.contains(ripple)) {
                    ripple.remove();
                }
            }, 600);
        });
    });
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize button effects
initButtonEffects();

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
initScrollProgress();

// Enhanced video handling
function initVideoHandling() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Add loading state
        video.addEventListener('loadstart', function() {
            this.style.opacity = '0.7';
        });
        
        video.addEventListener('canplay', function() {
            this.style.opacity = '1';
        });
        
        // Handle video errors
        video.addEventListener('error', function() {
            console.log('Video failed to load:', this.src);
            // You could show a fallback image here
        });
        
        // Ensure videos are muted for autoplay
        video.muted = true;
        video.playsInline = true;
    });
}

// Initialize video handling
initVideoHandling();

// Keyboard navigation for carousels
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeCarousel = document.querySelector('.media-carousel:hover');
            if (activeCarousel) {
                const carouselId = activeCarousel.getAttribute('data-carousel');
                if (carouselId) {
                    e.preventDefault();
                    const direction = e.key === 'ArrowLeft' ? -1 : 1;
                    changeSlide(carouselId, direction);
                }
            }
        }
    });
}

// Initialize keyboard navigation
initKeyboardNavigation();

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                
                img.onload = function() {
                    this.style.opacity = '1';
                };
                
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Enhanced Video Controls
function initVideoControls() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const playBtn = container.querySelector('.video-play-btn');
        const progressBar = container.querySelector('.video-progress');
        const progressFilled = container.querySelector('.video-progress-filled');
        const currentTimeSpan = container.querySelector('.current-time');
        const durationSpan = container.querySelector('.duration');
        const volumeBtn = container.querySelector('.video-volume-btn');
        const fullscreenBtn = container.querySelector('.video-fullscreen-btn');
        
        if (!video) return;
        
        // Initialize video
        video.addEventListener('loadedmetadata', function() {
            durationSpan.textContent = formatTime(video.duration);
            video.muted = true; // Start muted for autoplay
        });
        
        // Update progress bar
        video.addEventListener('timeupdate', function() {
            const progress = (video.currentTime / video.duration) * 100;
            progressFilled.style.width = progress + '%';
            currentTimeSpan.textContent = formatTime(video.currentTime);
        });
        
        // Progress bar click
        progressBar.addEventListener('click', function(e) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            video.currentTime = percentage * video.duration;
        });
        
        // Volume control
        volumeBtn.addEventListener('click', function() {
            video.muted = !video.muted;
            const icon = volumeBtn.querySelector('i');
            icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        });
        
        // Fullscreen control
        fullscreenBtn.addEventListener('click', function() {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });
        
        // Keyboard controls
        video.addEventListener('keydown', function(e) {
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    togglePlay(playBtn);
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    toggleMute(volumeBtn);
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    toggleFullscreen(fullscreenBtn);
                    break;
            }
        });
        
        // Make video focusable
        video.setAttribute('tabindex', '0');
        
        // Store references for global functions
        container.videoRefs = {
            video,
            playBtn,
            progressBar,
            progressFilled,
            currentTimeSpan,
            durationSpan,
            volumeBtn,
            fullscreenBtn
        };
    });
}

// Global video control functions
function togglePlay(button) {
    const container = button.closest('.video-container');
    const video = container.querySelector('video');
    const icon = button.querySelector('i');
    
    if (video.paused) {
        video.play();
        icon.className = 'fas fa-pause';
    } else {
        video.pause();
        icon.className = 'fas fa-play';
    }
}

function toggleMute(button) {
    const container = button.closest('.video-container');
    const video = container.querySelector('video');
    const icon = button.querySelector('i');
    
    video.muted = !video.muted;
    icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
}

function toggleFullscreen(button) {
    const container = button.closest('.video-container');
    const video = container.querySelector('video');
    const icon = button.querySelector('i');
    
    if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
        icon.className = 'fas fa-compress';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        icon.className = 'fas fa-expand';
    }
}

// Format time helper function
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Enhanced video error handling
function initVideoErrorHandling() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        video.addEventListener('error', function(e) {
            console.error('Video error:', e);
            const container = this.closest('.video-container');
            if (container) {
                container.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: white;
                        text-align: center;
                        padding: 20px;
                    ">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px; color: #ef4444;"></i>
                        <h3 style="margin-bottom: 10px;">视频加载失败</h3>
                        <p style="color: #94a3b8; margin-bottom: 20px;">无法播放此视频文件</p>
                        <button onclick="location.reload()" style="
                            background: #3b82f6;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                        ">重新加载</button>
                    </div>
                `;
            }
        });
        
        video.addEventListener('loadstart', function() {
            const container = this.closest('.video-container');
            if (container) {
                container.classList.add('loading');
            }
        });
        
        video.addEventListener('canplay', function() {
            const container = this.closest('.video-container');
            if (container) {
                container.classList.remove('loading');
            }
        });
    });
}

// Initialize video controls and error handling
initVideoControls();
initVideoErrorHandling();
