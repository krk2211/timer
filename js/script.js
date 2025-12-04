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
        
        // Animate number changes
        animateValue('days', String(days).padStart(3, '0'));
        animateValue('hours', String(hours).padStart(2, '0'));
        animateValue('minutes', String(minutes).padStart(2, '0'));
        animateValue('seconds', String(seconds).padStart(2, '0'));
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-container').innerHTML = 
                '<div class="countdown-message" style="font-family: var(--font-serif); font-size: 2rem; color: var(--gold);">The Big Day is Here! 💍</div>';
        }
    }
    
    function animateValue(id, newValue) {
        const el = document.getElementById(id);
        if (el && el.textContent !== newValue) {
            el.style.transform = 'scale(1.1)';
            el.textContent = newValue;
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 100);
        }
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// ==========================================
// FLOATING PARTICLES - ENHANCED
// ==========================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = window.innerWidth > 768 ? 35 : 18;
    const colors = ['gold', 'rose', 'gold', 'gold', 'rose']; // More gold particles
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', colors[i % colors.length]);
        
        const size = Math.random() * 40 + 10;
        const startX = Math.random() * 100;
        const duration = Math.random() * 25 + 20;
        const delay = Math.random() * 15;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}%`;
        particle.style.animation = `particleFloat ${duration}s linear ${delay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
}

// ==========================================
// CUSTOM CURSOR
// ==========================================
function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    // Smooth follow for outline
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .gallery-item, .event-card, .travel-card, .countdown-box, .nav-link');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
    
    // Click effect
    document.addEventListener('mousedown', () => cursorOutline.classList.add('click'));
    document.addEventListener('mouseup', () => cursorOutline.classList.remove('click'));
}

// ==========================================
// MOBILE MENU
// ==========================================
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navContent = document.querySelector('.nav-content');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navContent) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navContent.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navContent.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navContent.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navContent.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
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
// DYNAMIC IMAGE LOADING (Gallery Only)
// ==========================================
function loadImages() {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'heic', 'HEIC', 'JPG', 'JPEG', 'PNG', 'webp', 'WEBP'];
    const imageCount = 10;
    
    async function checkImage(path) {
        try {
            const response = await fetch(path, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    // Load images for gallery only (removed duplicate photo showcase)
    async function loadGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        // Add loading state
        galleryGrid.innerHTML = '<div class="gallery-loading">Loading memories...</div>';
        
        const loadedImages = [];
        
        for (let i = 1; i <= imageCount; i++) {
            for (const ext of imageExtensions) {
                const imagePath = `img/${i}.${ext}`;
                const exists = await checkImage(imagePath);
                
                if (exists) {
                    loadedImages.push(imagePath);
                    break;
                }
            }
        }
        
        // Clear loading state
        galleryGrid.innerHTML = '';
        
        // Create gallery items with staggered animation
        loadedImages.forEach((imagePath, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.style.transitionDelay = `${index * 0.1}s`;
            galleryItem.innerHTML = `
                <div class="gallery-image-wrapper">
                    <img src="${imagePath}" alt="Our moment ${index + 1}" loading="lazy">
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
            
            // Add click to open lightbox (optional enhancement)
            galleryItem.addEventListener('click', () => {
                openLightbox(imagePath);
            });
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // Re-initialize scroll animations
        setTimeout(() => {
            initScrollAnimations();
        }, 100);
    }
    
    loadGallery();
}

// ==========================================
// LIGHTBOX
// ==========================================
function openLightbox(imageSrc) {
    // Check if lightbox already exists
    let lightbox = document.getElementById('lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
            padding: 20px;
        `;
        lightbox.innerHTML = `
            <img src="" alt="Full size" style="
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            ">
            <button style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        `;
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', closeLightbox);
    }
    
    const img = lightbox.querySelector('img');
    img.src = imageSrc;
    
    document.body.style.overflow = 'hidden';
    lightbox.style.display = 'flex';
    
    requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
    });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
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
                    'reception-ernakulam': 'Reception - Ernakulam (Feb 8, 6:30 PM)',
                    'reception-thane': 'Reception - Thane (Feb 14)',
                    'reception-qatar': 'Reception - Qatar (Feb 19)'
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
// CALENDAR ICS DOWNLOAD
// ==========================================
function initCalendarDownload() {
    const downloadBtn = document.getElementById('downloadCalendar');
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', generateICS);
}

function generateICS() {
    const events = [
        {
            title: 'Kavya & Kiran - Haldi Ceremony',
            start: '20260205T103000',
            end: '20260205T140000',
            location: 'The Habitat Suites, Guruvayur',
            description: 'Haldi Ceremony - Dress Code: Yellow'
        },
        {
            title: 'Kavya & Kiran - Sangeet Night',
            start: '20260205T180000',
            end: '20260205T230000',
            location: 'The Habitat Suites, Guruvayur',
            description: 'Sangeet Night - Dress Code: Shimmery or Glittery'
        },
        {
            title: 'Kavya & Kiran - Talikettu Ceremony',
            start: '20260206T060000',
            end: '20260206T090000',
            location: 'Guruvayur Shri Krishna Temple',
            description: 'Talikettu Ceremony - Dress Code: Comfortable attire'
        },
        {
            title: 'Kavya & Kiran - Main Wedding Ceremony',
            start: '20260206T103000',
            end: '20260206T150000',
            location: 'Krishna Inn, Guruvayur',
            description: 'Main Wedding Ceremony - Dress Code: Traditional outfits'
        },
        {
            title: 'Kavya & Kiran - Reception (Ernakulam)',
            start: '20260208T183000',
            end: '20260208T230000',
            location: 'Njattumkalayil Hilltop, Ernakulam',
            description: 'Wedding Reception at Ernakulam'
        },
        {
            title: 'Kavya & Kiran - Reception (Thane)',
            start: '20260214T180000',
            end: '20260214T230000',
            location: 'Mahaveer Premium Banquet, Thane',
            description: 'Wedding Reception - Valentines Day Special'
        },
        {
            title: 'Kavya & Kiran - Reception (Qatar)',
            start: '20260219T180000',
            end: '20260219T230000',
            location: 'Al Waha Club, Qatar',
            description: 'Wedding Reception in Qatar'
        }
    ];
    
    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Kavya & Kiran Wedding//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Kavya & Kiran Wedding Events'
    ];
    
    events.forEach((event, index) => {
        const uid = `kavya-kiran-wedding-${index + 1}@wedding2026.com`;
        const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        
        icsContent.push(
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${now}`,
            `DTSTART:${event.start}`,
            `DTEND:${event.end}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description}`,
            `LOCATION:${event.location}`,
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'TRIGGER:-P1D',
            'ACTION:DISPLAY',
            `DESCRIPTION:Reminder: ${event.title} tomorrow!`,
            'END:VALARM',
            'END:VEVENT'
        );
    });
    
    icsContent.push('END:VCALENDAR');
    
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Kavya-Kiran-Wedding-Events.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    // Show success feedback
    const btn = document.getElementById('downloadCalendar');
    const originalText = btn.querySelector('span').textContent;
    btn.querySelector('span').textContent = 'Downloaded!';
    btn.style.background = 'linear-gradient(135deg, #2C5F4F 0%, #1A3A32 100%)';
    btn.style.borderColor = '#2C5F4F';
    btn.style.color = 'white';
    
    setTimeout(() => {
        btn.querySelector('span').textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
    }, 2000);
}

// ==========================================
// INITIALIZE ALL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Show page immediately
    document.body.classList.add('loaded');

    // Initialize core features
    initCountdown();
    initMobileMenu();
    initNavigation();
    initMusicToggle();
    initScrollToTop();
    initRSVPForm();
    initCalendarDownload();
    
    // Initialize visual effects (deferred for performance)
    requestAnimationFrame(() => {
        createParticles();
        initScrollAnimations();
    });
    
    // Load images
    loadImages();
    
    // Initialize custom cursor on desktop
    if (window.innerWidth > 1024 && window.matchMedia('(hover: hover)').matches) {
        initCustomCursor();
    }
    
    // Add intersection observer for section subtitles
    const subtitles = document.querySelectorAll('.section-subtitle');
    const subtitleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });
    subtitles.forEach(el => subtitleObserver.observe(el));
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
