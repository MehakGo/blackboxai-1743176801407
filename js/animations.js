// GSAP Animations
class Animations {
    constructor() {
        this.initScrollTriggers();
        this.initHoverEffects();
        this.initParallaxEffects();
        this.initTextAnimations();
    }

    initScrollTriggers() {
        // Story section animations
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

        // Features section animations
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

        // Suspense section animations
        gsap.to('.glitch-text', {
            scrollTrigger: {
                trigger: '.glitch-text',
                start: 'top center',
                toggleActions: 'play none none reverse'
            },
            duration: 2,
            ease: 'power4.out',
            onStart: () => {
                this.startGlitchEffect();
            }
        });

        // Impact section animations
        gsap.utils.toArray('.impact-stats > *').forEach((stat, i) => {
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: 'top center+=100',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                scale: 0.5,
                duration: 1,
                delay: i * 0.2
            });
        });

        // Section transitions
        gsap.utils.toArray('.section').forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                onEnter: () => this.playSectionTransition(section, 'enter'),
                onLeave: () => this.playSectionTransition(section, 'leave'),
                onEnterBack: () => this.playSectionTransition(section, 'enterBack'),
                onLeaveBack: () => this.playSectionTransition(section, 'leaveBack')
            });
        });
    }

    initHoverEffects() {
        // CTA button hover effect
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('mouseenter', () => {
                gsap.to(ctaButton, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power2.out',
                    boxShadow: '0 0 20px var(--primary-color)'
                });
            });

            ctaButton.addEventListener('mouseleave', () => {
                gsap.to(ctaButton, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                    boxShadow: 'none'
                });
            });
        }

        // Social icons hover effect
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.2,
                    color: '#00f7ff',
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            });

            icon.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    color: '#ffffff',
                    duration: 0.3
                });
            });
        });
    }

    initParallaxEffects() {
        // Parallax effect for background elements
        gsap.utils.toArray('[data-speed]').forEach(element => {
            gsap.to(element, {
                y: (i, target) => (ScrollTrigger.maxScroll(window) - ScrollTrigger.maxScroll(target)) * target.dataset.speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    initTextAnimations() {
        // Split text animations for headings
        const headings = document.querySelectorAll('h1, h2');
        headings.forEach(heading => {
            const text = heading.textContent;
            heading.textContent = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                span.style.display = 'inline-block';
                heading.appendChild(span);
            });

            gsap.from(heading.children, {
                scrollTrigger: {
                    trigger: heading,
                    start: 'top center+=100',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                rotateX: -90,
                stagger: 0.05,
                duration: 1,
                ease: 'back.out'
            });
        });
    }

    startGlitchEffect() {
        const glitchText = document.querySelector('.glitch-text');
        if (!glitchText) return;

        const glitchTimeline = gsap.timeline({
            repeat: -1,
            repeatDelay: 3
        });

        glitchTimeline
            .to(glitchText, {
                skewX: 20,
                duration: 0.1
            })
            .to(glitchText, {
                skewX: 0,
                duration: 0.1
            })
            .to(glitchText, {
                opacity: 0.8,
                duration: 0.1
            })
            .to(glitchText, {
                opacity: 1,
                duration: 0.1
            })
            .to(glitchText, {
                x: -20,
                duration: 0.1
            })
            .to(glitchText, {
                x: 0,
                duration: 0.1
            })
            .add('glitch')
            .to(glitchText, {
                scaleY: 1.2,
                duration: 0.2,
                ease: 'power4.out'
            }, 'glitch')
            .to(glitchText, {
                scaleY: 1,
                duration: 0.2,
                ease: 'power4.in'
            });
    }

    playSectionTransition(section, direction) {
        const timeline = gsap.timeline();
        const content = section.querySelector('.content, .story-container, .features-container, .suspense-container, .impact-container, .cta-container');
        
        if (!content) return;

        switch(direction) {
            case 'enter':
                timeline
                    .from(content, {
                        opacity: 0,
                        y: 100,
                        duration: 1,
                        ease: 'power4.out'
                    })
                    .from(content.children, {
                        opacity: 0,
                        y: 50,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power2.out'
                    }, '-=0.5');
                break;
            
            case 'leave':
                timeline
                    .to(content, {
                        opacity: 0,
                        y: -100,
                        duration: 1,
                        ease: 'power4.in'
                    });
                break;
            
            case 'enterBack':
                timeline
                    .from(content, {
                        opacity: 0,
                        y: -100,
                        duration: 1,
                        ease: 'power4.out'
                    });
                break;
            
            case 'leaveBack':
                timeline
                    .to(content, {
                        opacity: 0,
                        y: 100,
                        duration: 1,
                        ease: 'power4.in'
                    });
                break;
        }
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Animations();
});