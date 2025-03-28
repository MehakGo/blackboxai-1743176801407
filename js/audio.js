// Audio Manager using Howler.js
class AudioManager {
    constructor() {
        // Pre-load and cache sounds
        this.audioCache = new Map();
        this.maxInstances = 4; // Limit concurrent audio instances
        
        this.sounds = {
            background: {
                src: ['https://cdn.freesound.org/previews/648/648346_11943129-lq.mp3'],
                options: {
                    loop: true,
                    volume: 0.3,
                    html5: true,
                    preload: true,
                    pool: 1
                }
            },
            hover: {
                src: ['https://cdn.freesound.org/previews/242/242501_4284968-lq.mp3'],
                options: {
                    volume: 0.5,
                    html5: true,
                    preload: true,
                    pool: 2
                }
            },
            click: {
                src: ['https://cdn.freesound.org/previews/242/242503_4284968-lq.mp3'],
                options: {
                    volume: 0.5,
                    html5: true,
                    preload: true,
                    pool: 2
                }
            },
            scroll: {
                src: ['https://cdn.freesound.org/previews/242/242502_4284968-lq.mp3'],
                options: {
                    volume: 0.3,
                    html5: true,
                    preload: true,
                    pool: 2
                }
            },
            glitch: {
                src: ['https://cdn.freesound.org/previews/350/350872_4284968-lq.mp3'],
                options: {
                    volume: 0.4,
                    html5: true,
                    preload: true,
                    pool: 2
                }
            },
            success: {
                src: ['https://cdn.freesound.org/previews/242/242505_4284968-lq.mp3'],
                options: {
                    volume: 0.5,
                    html5: true,
                    preload: true,
                    pool: 1
                }
            }
        };

        this.currentSection = 0;
        this.init();
    }

    init() {
        // Initialize audio cache
        Object.entries(this.sounds).forEach(([key, sound]) => {
            this.audioCache.set(key, new Howl({
                src: [sound.src],
                ...sound.options,
                onloaderror: (id, error) => {
                    console.warn(`Failed to load sound ${key}:`, error);
                }
            }));
        });

        // Start background music on user interaction
        const startAudio = () => {
            const bgSound = this.audioCache.get('background');
            if (bgSound && !bgSound.playing()) {
                bgSound.play();
                this.initializeVolumeTransitions();
            }
            document.removeEventListener('click', startAudio);
        };
        document.addEventListener('click', startAudio);

        // Add hover sound to buttons and links with throttling
        const interactiveElements = document.querySelectorAll('button, .social-icon, .cta-button');
        const throttle = (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        const playHoverSound = throttle(() => {
            const hoverSound = this.audioCache.get('hover');
            if (hoverSound && !hoverSound.playing()) {
                hoverSound.play();
            }
        }, 100);

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', playHoverSound);
            element.addEventListener('click', () => {
                const clickSound = this.audioCache.get('click');
                if (clickSound) clickSound.play();
            });
        });

        // Add scroll sound with throttling
        let lastScrollTime = 0;
        const scrollThrottle = 1000; // Minimum time between scroll sounds

        window.addEventListener('scroll', () => {
            const now = Date.now();
            if (now - lastScrollTime > scrollThrottle) {
                const scrollSound = this.audioCache.get('scroll');
                if (scrollSound) scrollSound.play();
                lastScrollTime = now;
                this.handleSectionChange();
            }
        }, { passive: true });

        // Add glitch sound to glitch text with rate limiting
        const glitchText = document.querySelector('.glitch-text');
        if (glitchText) {
            let lastGlitchTime = 0;
            const glitchInterval = setInterval(() => {
                if (this.isElementInViewport(glitchText)) {
                    const now = Date.now();
                    if (now - lastGlitchTime > 3000) {
                        const glitchSound = this.audioCache.get('glitch');
                        if (glitchSound) glitchSound.play();
                        lastGlitchTime = now;
                    }
                }
            }, 3000);
        }

        // Add success sound to form submission
        const form = document.getElementById('waitlist-form');
        if (form) {
            form.addEventListener('submit', () => {
                const successSound = this.audioCache.get('success');
                if (successSound) successSound.play();
            });
        }
    }

    initializeVolumeTransitions() {
        // Create different volume levels for each section
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                onEnter: () => {
                    this.currentSection = index;
                    this.adjustBackgroundMusic();
                },
                onEnterBack: () => {
                    this.currentSection = index;
                    this.adjustBackgroundMusic();
                }
            });
        });
    }

    adjustBackgroundMusic() {
        const bgSound = this.audioCache.get('background');
        if (!bgSound) return;

        // Adjust volume and effects based on current section
        const baseVolume = 0.3;
        
        gsap.to(bgSound, {
            volume: baseVolume * (1 - (this.currentSection * 0.1)),
            duration: 1
        });

        // Add filter effects for different sections
        const sound = bgSound._sounds[0];
        if (!sound) return;

        switch(this.currentSection) {
            case 0: // Landing
                sound.playbackRate = 1;
                break;
            case 1: // Story
                sound.playbackRate = 0.95;
                break;
            case 2: // Features
                sound.playbackRate = 1.05;
                break;
            case 3: // Suspense
                sound.playbackRate = 0.9;
                break;
            case 4: // Impact
                sound.playbackRate = 1.1;
                break;
            case 5: // CTA
                sound.playbackRate = 1;
                break;
        }
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Method to mute/unmute all sounds
    toggleMute() {
        Howler.mute(!Howler.muted);
    }

    // Clean up method
    destroy() {
        this.audioCache.forEach(sound => sound.unload());
        this.audioCache.clear();
    }
}

// Initialize audio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
});