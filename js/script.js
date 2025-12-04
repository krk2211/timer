// ==========================================
// COUNTDOWN TIMER
// ==========================================
function initCountdown() {
    const weddingDate = new Date('February 6, 2026 10:30:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-container').innerHTML = 
                '<div class="countdown-message">The Big Day is Here! 💍</div>';
        }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// ==========================================
// FLOATING PARTICLES
// ==========================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth > 768 ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 60 + 20;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// SMOOTH SCROLL & NAVIGATION
// ==========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active section highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Navbar background on scroll
        const navbar = document.querySelector('.nav-bar');
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ==========================================
// DYNAMIC IMAGE LOADING
// ==========================================
function loadImages() {
    // Define image extensions to try
    const imageExtensions = ['jpg', 'jpeg', 'png', 'heic', 'HEIC', 'JPG', 'JPEG', 'PNG'];
    const imageCount = 10; // We have 10 images
    const loadedImages = [];
    
    // Function to check if image exists
    async function checkImage(path) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    // Load images for photo showcase
    async function loadPhotoShowcase() {
        const photoGrid = document.getElementById('photoShowcase');
        if (!photoGrid) return;
        
        const speeds = [0.5, 0.7, 0.6, 0.8, 0.5, 0.7, 0.6, 0.8, 0.5, 0.7];
        
        for (let i = 1; i <= imageCount; i++) {
            for (const ext of imageExtensions) {
                const imagePath = `img/${i}.${ext}`;
                const exists = await checkImage(imagePath);
                
                if (exists) {
                    const photoCard = document.createElement('div');
                    photoCard.className = 'photo-card';
                    photoCard.setAttribute('data-speed', speeds[i - 1]);
                    photoCard.innerHTML = `
                        <div class="photo-wrapper">
                            <img src="${imagePath}" alt="Couple photo ${i}" loading="lazy">
                            <div class="photo-overlay"></div>
                        </div>
                    `;
                    photoGrid.appendChild(photoCard);
                    loadedImages.push(imagePath);
                    break;
                }
            }
        }
    }
    
    // Load images for gallery
    async function loadGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        for (let i = 1; i <= imageCount; i++) {
            for (const ext of imageExtensions) {
                const imagePath = `img/${i}.${ext}`;
                const exists = await checkImage(imagePath);
                
                if (exists) {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.setAttribute('data-category', 'couple');
                    galleryItem.innerHTML = `
                        <div class="gallery-image-wrapper">
                            <img src="${imagePath}" alt="Couple moment ${i}" loading="lazy">
                            <div class="gallery-overlay">
                                <div class="gallery-icon">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    `;
                    galleryGrid.appendChild(galleryItem);
                    break;
                }
            }
        }
    }
    
    // Load both sections
    Promise.all([loadPhotoShowcase(), loadGallery()]).then(() => {
        // Re-initialize scroll animations after images are loaded
        setTimeout(() => {
            initScrollAnimations();
        }, 100);
    });
}

// ==========================================
// PARALLAX EFFECT (IMPROVED)
// ==========================================
function initParallax() {
    const parallaxItems = document.querySelectorAll('.photo-card[data-speed]');
    let ticking = false;
    
    function updateParallax() {
        parallaxItems.forEach(item => {
            const speed = parseFloat(item.dataset.speed) || 0.5;
            const rect = item.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Only apply parallax if item is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                const yPos = -(scrolled - (rect.top + scrolled - windowHeight / 2)) * speed * 0.1;
                item.style.transform = `translateY(${yPos}px)`;
            }
        });
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe photo cards
    document.querySelectorAll('.photo-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe section titles
    document.querySelectorAll('.reveal-text').forEach(element => {
        observer.observe(element);
    });
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(item);
    });
    
    // Observe reveal items
    document.querySelectorAll('.reveal-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(item);
    });
}

// ==========================================
// YOUTUBE MUSIC PLAYER
// ==========================================
let youtubePlayer;
let isPlayerReady = false;

// YouTube IFrame API callback
window.onYouTubeIframeAPIReady = function() {
    youtubePlayer = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        videoId: '2xUQO-qj3pc', // YouTube video ID
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'fs': 0,
            'modestbranding': 1,
            'playsinline': 1,
            'rel': 0,
            'showinfo': 0,
            'iv_load_policy': 3,
            'start': 21  // Start at 21 seconds
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    isPlayerReady = true;
    console.log('YouTube player ready');
}

function onPlayerStateChange(event) {
    const musicBtn = document.getElementById('musicToggle');
    if (!musicBtn) return;
    
    // Update button state based on player state
    if (event.data === YT.PlayerState.PLAYING) {
        musicBtn.classList.add('playing');
        musicBtn.style.background = 'rgba(212, 175, 55, 0.3)';
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        musicBtn.classList.remove('playing');
        musicBtn.style.background = 'rgba(255, 254, 247, 0.2)';
    }
    
    // Loop the video when it ends (restart at 21 seconds)
    if (event.data === YT.PlayerState.ENDED) {
        youtubePlayer.seekTo(21);
        youtubePlayer.playVideo();
    }
}

// ==========================================
// MUSIC TOGGLE
// ==========================================
function initMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (!isPlayerReady || !youtubePlayer) {
                console.log('Player not ready yet, please wait...');
                return;
            }
            
            const playerState = youtubePlayer.getPlayerState();
            
            if (playerState === YT.PlayerState.PLAYING) {
                youtubePlayer.pauseVideo();
                musicToggle.classList.remove('playing');
                musicToggle.style.background = 'rgba(255, 254, 247, 0.2)';
            } else {
                youtubePlayer.playVideo();
                musicToggle.classList.add('playing');
                musicToggle.style.background = 'rgba(212, 175, 55, 0.3)';
            }
        });
    }
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// SMOOTH PAGE LOAD
// ==========================================
function initPageLoad() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    });
}

// ==========================================
// CURSOR EFFECT (Optional Enhancement)
// ==========================================
function initCursorEffect() {
    if (window.innerWidth > 1024) {
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.2s ease;
            display: none;
        `;
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.querySelectorAll('a, button, .photo-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(212, 175, 55, 0.2)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'transparent';
            });
        });
    }
}

// ==========================================
// RSVP FORM HANDLING
// ==========================================
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    const successMessage = document.getElementById('rsvpSuccess');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email') || 'Not provided',
                phone: formData.get('phone') || 'Not provided',
                guests: formData.get('guests'),
                events: formData.getAll('events'),
                message: formData.get('message') || 'No message'
            };
            
            // Validate at least one event is selected
            if (data.events.length === 0) {
                alert('Please select at least one event to attend.');
                return;
            }
            
            // Format events list
            const eventsList = data.events.map(event => {
                const eventNames = {
                    'haldi': 'Haldi Ceremony (Feb 5, 10:30 AM)',
                    'sangeet': 'Sangeet Night (Feb 5, 6:00 PM)',
                    'talikettu': 'Talikettu Ceremony (Feb 6, 6:00 AM)',
                    'wedding': 'Main Wedding (Feb 6, 10:30 AM)',
                    'reception-ernakulam': 'Reception - Ernakulam (Feb 8)',
                    'reception-thane': 'Reception - Thane (Feb 14)'
                };
                return `  - ${eventNames[event] || event}`;
            }).join('\n');
            
            // Create email body with structured format for easy parsing
            const emailBody = `WEDDING RSVP SUBMISSION
========================================

GUEST INFORMATION:
------------------
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Number of Guests: ${data.guests}

EVENTS ATTENDING:
-----------------
${eventsList}

SPECIAL MESSAGE:
----------------
${data.message}

========================================
Submitted on: ${new Date().toLocaleString()}
========================================`;
            
            // Create mailto link
            const mailtoLink = `mailto:krk2211@icloud.com?subject=Wedding RSVP - ${encodeURIComponent(data.name)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open mail client
            window.location.href = mailtoLink;
            
            // Show success message with animation
            setTimeout(() => {
                form.style.opacity = '0';
                form.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        successMessage.style.transition = 'all 0.6s ease';
                        successMessage.style.opacity = '1';
                        successMessage.style.transform = 'translateY(0)';
                        
                        // Trigger confetti
                        createConfetti();
                    }, 50);
                }, 300);
            }, 500);
        });
    }
}

// ==========================================
// CONFETTI ANIMATION
// ==========================================
function createConfetti() {
    const colors = ['#D4AF37', '#F4E8D8', '#E8DCC4', '#2C5F4F', '#F5E6E8'];
    const confettiCount = 100;
    const container = document.querySelector('.rsvp-card');
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        container.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;
        const xMovement = (Math.random() - 0.5) * 200;
        
        confetti.animate([
            { 
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: 1
            },
            { 
                transform: `translateY(${container.offsetHeight}px) translateX(${xMovement}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ==========================================
// INITIALIZE ALL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Load images first
    loadImages();
    
    // Initialize other features
    initCountdown();
    createParticles();
    initNavigation();
    initMusicToggle();
    initLazyLoading();
    initPageLoad();
    initCursorEffect();
    initRSVPForm();
    initScrollToTop();
    
    // Initialize parallax after a short delay to ensure images are loaded
    setTimeout(() => {
        initParallax();
    }, 500);
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});

// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate positions if needed
    }, 250);
});
