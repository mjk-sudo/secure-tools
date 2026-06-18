/**
 * MOTION.JS — Advanced Motion & Interaction Layer
 * Layered on top of common.js — does NOT replace anything.
 */

(function() {
    'use strict';

    /* ═══════════════════════════════════════
       1. PRELOADER
       ═══════════════════════════════════════ */
    function initPreloader() {
        const p = document.getElementById('preloader');
        if (!p) return;
        window.addEventListener('load', () => {
            setTimeout(() => p.classList.add('done'), 900);
            setTimeout(() => { if (p.parentNode) p.style.display = 'none'; }, 1500);
        });
    }

    /* ═══════════════════════════════════════
       2. LENIS SMOOTH SCROLL
       ═══════════════════════════════════════ */
    let lenis = null;
    function initLenis() {
        if (typeof Lenis === 'undefined') return;
        lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
    }

    /* ═══════════════════════════════════════
       3. FULLSCREEN OVERLAY MENU (mobile)
       ═══════════════════════════════════════ */
    function initOverlayMenu() {
        const header = document.querySelector('.header');
        if (!header) return;

        // Create toggle button
        let toggle = header.querySelector('.menu-toggle');
        if (!toggle) {
            toggle = document.createElement('button');
            toggle.className = 'menu-toggle';
            toggle.setAttribute('aria-label', 'Menu');
            toggle.innerHTML = '<span></span><span></span><span></span>';
            header.appendChild(toggle);
        }

        // Create overlay
        let overlay = document.getElementById('overlay-menu');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'overlay-menu';
            overlay.id = 'overlay-menu';
            const nav = document.createElement('nav');
            const links = header.querySelectorAll('.menu a');
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.textContent;
                if (link.classList.contains('active')) a.classList.add('active');
                nav.appendChild(a);
            });
            overlay.appendChild(nav);
            document.body.appendChild(overlay);
        }

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            overlay.classList.toggle('open');
            document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        overlay.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ═══════════════════════════════════════
       4. PAGE TRANSITIONS
       ═══════════════════════════════════════ */
    function initPageTransitions() {
        let transEl = document.getElementById('page-transition');
        if (!transEl) {
            transEl = document.createElement('div');
            transEl.className = 'page-transition';
            transEl.id = 'page-transition';
            document.body.appendChild(transEl);
        }

        // Intercept internal link clicks
        document.addEventListener('click', e => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('javascript') || link.target === '_blank') return;
            // Only intercept local .html links
            if (!href.endsWith('.html')) return;

            e.preventDefault();
            transEl.classList.add('entering');
            setTimeout(() => { window.location.href = href; }, 450);
        });

        // Fade in on page load
        document.documentElement.style.opacity = '0';
        const fadeIn = () => {
            requestAnimationFrame(() => {
                document.documentElement.style.transition = 'opacity .4s ease';
                document.documentElement.style.opacity = '1';
            });
        };
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', fadeIn);
        } else {
            fadeIn();
        }
    }

    /* ═══════════════════════════════════════
       5. PARTICLE NETWORK CANVAS
       ═══════════════════════════════════════ */
    function initParticleCanvas() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, particles = [], mouse = { x: -999, y: -999 };
        const PARTICLE_COUNT = 60;
        const CONNECT_DIST = 120;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - .5) * .4,
                    vy: (Math.random() - .5) * .4,
                    r: Math.random() * 2 + 1
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99,102,241,.5)';
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(99,102,241,${.15 * (1 - dist / CONNECT_DIST)})`;
                        ctx.lineWidth = .6;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mDist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(34,211,238,${.25 * (1 - mDist / 160)})`;
                    ctx.lineWidth = .8;
                    ctx.stroke();
                }
            }

            requestAnimationFrame(draw);
        }

        resize();
        createParticles();
        draw();

        window.addEventListener('resize', () => { resize(); createParticles(); });
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    }

    /* ═══════════════════════════════════════
       6. MAGNETIC CURSOR EFFECT
       ═══════════════════════════════════════ */
    function initMagnetic() {
        const els = document.querySelectorAll('.magnetic');
        if (!els.length) return;

        els.forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * .2;
                const dy = (e.clientY - cy) * .2;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0,0)';
            });
        });
    }

    /* ═══════════════════════════════════════
       7. PARALLAX ON SCROLL
       ═══════════════════════════════════════ */
    function initParallax() {
        const els = document.querySelectorAll('[data-parallax]');
        if (!els.length) return;

        function update() {
            const scrollY = window.scrollY;
            els.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || .1;
                const rect = el.getBoundingClientRect();
                const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
                el.style.transform = `translateY(${-offset}px)`;
            });
        }

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ═══════════════════════════════════════
       8. ENHANCED SCROLL REVEALS (mask + kinetic)
       ═══════════════════════════════════════ */
    function initMaskReveals() {
        const masks = document.querySelectorAll('.mask-reveal');
        if (!masks.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        masks.forEach(el => observer.observe(el));
    }

    /* ═══════════════════════════════════════
       9. PROCESS TRACKER INTERACTIVITY
       ═══════════════════════════════════════ */
    function initProcessTracker() {
        const steps = document.querySelectorAll('.process-step');
        if (!steps.length) return;

        steps.forEach(step => {
            step.addEventListener('click', () => {
                steps.forEach(s => s.classList.remove('active'));
                step.classList.add('active');
            });
        });

        // Activate first by default
        if (steps.length > 0) steps[0].classList.add('active');
    }

    /* ═══════════════════════════════════════
       10. BENTO CARD TILT EFFECT
       ═══════════════════════════════════════ */
    function initBentoTilt() {
        const cards = document.querySelectorAll('.bento-item');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - .5;
                const y = (e.clientY - rect.top) / rect.height - .5;
                card.style.transform = `translateY(-4px) scale(1.01) perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ═══════════════════════════════════════
       INIT ALL — runs after DOMContentLoaded
       ═══════════════════════════════════════ */
    function initMotion() {
        initPreloader();
        initLenis();
        initOverlayMenu();
        initParticleCanvas();
        initMagnetic();
        initParallax();
        initMaskReveals();
        initProcessTracker();
        initBentoTilt();
    }

    // Page transitions must init immediately (before DOMContentLoaded)
    initPageTransitions();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMotion);
    } else {
        initMotion();
    }

})();
