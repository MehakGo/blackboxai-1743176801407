// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom cursor
const cursor = document.querySelector('.custom-cursor');
const cursorTrail = document.querySelector('.cursor-trail');

document.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    cursorTrail.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
});

// Loader
let progress = 0;
const progressBar = document.querySelector('.progress-bar');
const loaderOverlay = document.querySelector('.loader-overlay');

function updateProgress() {
    progress += Math.random() * 30;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;
    
    if (progress === 100) {
        setTimeout(() => {
            gsap.to(loaderOverlay, {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    loaderOverlay.style.display = 'none';
                    initializeAnimations();
                }
            });
        }, 500);
    } else {
        setTimeout(updateProgress, 200);
    }
}

// Initialize animations after loading
function initializeAnimations() {
    // Animate main title
    gsap.from('.main-title', {
        duration: 2,
        opacity: 0,
        y: 100,
        ease: 'power4.out'
    });

    // Animate tagline
    gsap.from('.tagline', {
        duration: 2,
        opacity: 0,
        y: 50,
        ease: 'power4.out',
        delay: 0.5
    });

    // Animate CTA button
    gsap.from('.cta-button', {
        duration: 1.5,
        opacity: 0,
        y: 30,
        ease: 'power4.out',
        delay: 1
    });

    // Timeline animations
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 100,
            duration: 1,
            delay: i * 0.2
        });
    });

    // Feature cards animations
    gsap.utils.toArray('.feature-cards > *').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top center+=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            delay: i * 0.2
        });
    });
}

// Countdown timer
function updateCountdown() {
    const launchDate = new Date('2024-01-01').getTime();
    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelector('.days').textContent = String(days).padStart(2, '0');
    document.querySelector('.hours').textContent = String(hours).padStart(2, '0');
    document.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
    document.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
}

// Start the loader
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    setInterval(updateCountdown, 1000);
});

// Handle form submission
document.getElementById('waitlist-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    // Here you would typically send this to a backend
    alert('Thanks for joining the waitlist! We\'ll keep you updated.');
    e.target.reset();
});