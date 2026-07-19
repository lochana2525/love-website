/* ============================================================
   CHOOTI MNIKA ❤️ — PREMIUM ROMANTIC WEBSITE
   All Interactive Magic, Animations & Logic
   ============================================================ */

'use strict';

/* ============================================================
   ★ CONFIGURATION — Edit these values as needed
   ============================================================ */
const CONFIG = {
    /**
     * Your relationship start date.
     * Format: new Date(YEAR, MONTH_INDEX, DAY)
     * Month index: January=0, February=1, ..., December=11
     * Example: new Date(2024, 0, 1) = January 1st, 2024
     */
    LOVE_START_DATE: new Date(2024, 2, 27),

    /** Milliseconds between quote auto-rotations */
    QUOTE_INTERVAL: 5500,

    /** Typewriter speed in ms per character (lower = faster) */
    TYPEWRITER_SPEED: 38,

    /** Floating hearts spawned at startup */
    HEART_SPAWN_COUNT: 22,

    /** Confetti pieces on "Forgive" click */
    CONFETTI_COUNT: 160,
};

/* ============================================================
   PHOTO DATA (must match images/ folder filenames)
   ============================================================ */
const PHOTOS = [
    { src: 'images/photo1.jpg', caption: 'Forever Love ❤️' },
    { src: 'images/photo2.jpg', caption: 'Pure Love ❤️' },
    { src: 'images/photo3.jpg', caption: 'My Everything ❤️' },
    { src: 'images/photo4.jpg', caption: 'Forever Smiles ❤️' },
    { src: 'images/photo5.jpg', caption: 'Our Adventure ❤️' },
    { src: 'images/photo6.jpg', caption: 'The Day Everything Changed ❤️' },
];

/* ============================================================
   LOVE QUOTES
   ============================================================ */
const QUOTES = [
    'You are my forever.',
    'My heart belongs to you.',
    'Every heartbeat whispers your name.',
    'You are my greatest blessing.',
    'In your arms is where I belong.',
    'You are the reason I smile every day.',
];

/* ============================================================
   APOLOGY LETTER — Typewriter content
   ============================================================ */
const STORY_TEXT =
    `Chooti Mnika,

I am truly, deeply sorry.

I know I made mistakes. I know my words and actions hurt you, and that is something I carry with me every single day. You didn't deserve any of it.

You are the most precious, irreplaceable person in my entire world. Hurting you was never — and could never be — my intention. But I know that intentions alone don't erase the pain I caused, and for that, I am so deeply sorry.

Every smile of yours is my happiness. Every laugh of yours is my favorite sound in the entire universe. Every moment I have spent with you is a treasure I hold closer to my heart than anything else in this world.

Please forgive me.

I promise to love you with everything I have — every breath, every heartbeat. I promise to respect you, to protect you, to choose you every single day without hesitation. I promise to be the person you deserve, someone who lifts you up and never brings you tears.

You are my today, my tomorrow, and every beautiful day after that.

I love you more than words could ever describe.

Forever and always, ❤️`;

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);
const rnd = (min, max) => Math.random() * (max - min) + min;

/* ============================================================
   LOADING SCREEN
   ============================================================ */
function initLoading() {
    // Hide loading screen after bar animation completes (~2.8s) + small buffer
    setTimeout(() => {
        const screen = $('loadingScreen');
        screen.classList.add('gone');
        // After transition, start heart & particle engines
        setTimeout(() => {
            screen.style.display = 'none';
            spawnFloatingHearts();
            initParticles();
        }, 900);
    }, 3200);
}

/* ============================================================
   CURSOR GLOW — smooth mouse follower
   ============================================================ */
function initCursor() {
    const glow = $('cursorGlow');
    if (!glow) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });

    // Lerp-follow
    (function tick() {
        cx += (mx - cx) * 0.13;
        cy += (my - cy) * 0.13;
        glow.style.left = cx + 'px';
        glow.style.top = cy + 'px';
        requestAnimationFrame(tick);
    })();

    // Expand on hover targets
    const targets = $$('a, button, .masonry-item, .love-card, .q-dot, .big-heart');
    targets.forEach(el => {
        el.addEventListener('mouseenter', () => { glow.style.width = '58px'; glow.style.height = '58px'; });
        el.addEventListener('mouseleave', () => { glow.style.width = '28px'; glow.style.height = '28px'; });
    });
}

/* ============================================================
   PARTICLE CANVAS — sparkles & floating glitter
   ============================================================ */
function initParticles() {
    const canvas = $('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const COLORS = [
        'rgba(255,79,129,.65)', 'rgba(142,68,173,.65)',
        'rgba(183,110,121,.55)', 'rgba(255,122,171,.55)',
        'rgba(255,255,255,.45)',
    ];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function newParticle() {
        return {
            x: rnd(0, W), y: rnd(0, H),
            r: rnd(1, 3.5),
            color: COLORS[Math.floor(rnd(0, COLORS.length))],
            vx: rnd(-.4, .4),
            vy: rnd(-.8, -.18),
            life: 1,
            decay: rnd(.001, .0035),
            isStar: Math.random() > .7,
        };
    }

    for (let i = 0; i < 90; i++) particles.push(newParticle());

    function drawStar(x, y, r, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x, y);
        ctx.fillStyle = color;
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(r * .35, r * .35);
            ctx.lineTo(0, r * 1.1);
            ctx.lineTo(-r * .35, r * .35);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }

    (function render() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life -= p.decay;
            if (p.life <= 0 || p.y < -10) {
                particles[i] = newParticle();
                particles[i].y = H + 5;
                return;
            }
            if (p.isStar) {
                drawStar(p.x, p.y, p.r * 2, p.color, p.life);
            } else {
                ctx.globalAlpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        });
        requestAnimationFrame(render);
    })();
}

/* ============================================================
   FLOATING HEARTS — ambient floating emoji hearts
   ============================================================ */
const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💝', '💞', '🌸', '✨'];

function spawnFloatingHearts() {
    const overlay = $('heartsOverlay');
    if (!overlay) return;

    function spawnOne() {
        const el = document.createElement('div');
        el.className = 'floating-heart';
        const dur = rnd(7, 13).toFixed(1);
        const dly = rnd(0, 2).toFixed(1);
        el.textContent = HEART_EMOJIS[Math.floor(rnd(0, HEART_EMOJIS.length))];
        el.style.cssText = `
            left:${rnd(0, 100)}%;
            --size:${rnd(13, 26)}px;
            --dur:${dur}s;
            --dly:${dly}s;
        `;
        overlay.appendChild(el);
        setTimeout(() => { el.remove(); spawnOne(); }, (parseFloat(dur) + parseFloat(dly)) * 1000 + 400);
    }

    for (let i = 0; i < CONFIG.HEART_SPAWN_COUNT; i++) {
        setTimeout(spawnOne, rnd(0, 4000));
    }
}

/* ============================================================
   NAVBAR — scroll glass + mobile toggle
   ============================================================ */
function initNavbar() {
    const nav = $('navbar');
    const ham = $('navHamburger');
    const links = $('navLinks');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 48);
    }, { passive: true });

    ham?.addEventListener('click', () => links?.classList.toggle('open'));

    $$('.nav-link').forEach(l => {
        l.addEventListener('click', () => links?.classList.remove('open'));
    });
}

/* ============================================================
   SMOOTH SCROLL — hero CTA button
   ============================================================ */
function initHeroCTA() {
    $('openHeartBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        $('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

/* ============================================================
   HERO PARALLAX — background moves slower than scroll
   ============================================================ */
function initParallax() {
    const bg = document.querySelector('.hero-bg');
    if (!bg) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            bg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.28}px)`;
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
}

/* ============================================================
   TYPEWRITER — story apology letter
   ============================================================ */
function initTypewriter() {
    const el = $('storyText');
    if (!el) return;
    let triggered = false;

    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !triggered) {
            triggered = true;
            runTypewriter(el, STORY_TEXT, CONFIG.TYPEWRITER_SPEED);
        }
    }, { threshold: 0.25 });
    obs.observe(el);
}

function runTypewriter(el, text, speed) {
    // Cursor
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    el.appendChild(cursor);

    const textNode = document.createTextNode('');
    el.insertBefore(textNode, cursor);

    let i = 0;
    function tick() {
        if (i < text.length) {
            textNode.textContent += text[i++];
            cursor.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            setTimeout(tick, speed);
        } else {
            setTimeout(() => cursor.remove(), 2200);
        }
    }
    tick();
}

/* ============================================================
   GALLERY — stagger fade-in on scroll
   ============================================================ */
function initGallery() {
    const items = $$('.masonry-item');
    items.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(32px)';
        item.style.transition = `opacity .65s ease ${i * .14}s, transform .65s ease ${i * .14}s`;
    });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.12 });

    items.forEach(item => obs.observe(item));
}

/* ============================================================
   LIGHTBOX — full-screen image viewer
   ============================================================ */
let lbIndex = 0;

function initLightbox() {
    // Open on masonry click
    $$('.masonry-item').forEach(item => {
        item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
    });

    $('lbClose')?.addEventListener('click', closeLightbox);
    $('lightboxOverlay')?.addEventListener('click', closeLightbox);
    $('lbPrev')?.addEventListener('click', () => navigateLightbox(-1));
    $('lbNext')?.addEventListener('click', () => navigateLightbox(+1));

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!$('lightbox')?.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(+1);
    });

    // Touch swipe support
    let touchX = 0;
    $('lightbox')?.addEventListener('touchstart', e => touchX = e.touches[0].clientX, { passive: true });
    $('lightbox')?.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) navigateLightbox(dx < 0 ? 1 : -1);
    });
}

function openLightbox(index) {
    lbIndex = index;
    setLightboxPhoto();
    $('lightbox')?.classList.add('active');
    $('lightboxOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    $('lightbox')?.classList.remove('active');
    $('lightboxOverlay')?.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    lbIndex = (lbIndex + dir + PHOTOS.length) % PHOTOS.length;
    setLightboxPhoto();
}

function setLightboxPhoto() {
    const img = $('lbImg');
    const cap = $('lbCaption');
    const photo = PHOTOS[lbIndex];
    if (!img || !photo) return;
    img.style.opacity = '0';
    setTimeout(() => {
        img.src = photo.src;
        img.alt = photo.caption;
        img.style.opacity = '1';
        img.style.transition = 'opacity .3s';
        if (cap) cap.textContent = photo.caption;
    }, 180);
}

/* ============================================================
   SCROLL REVEAL — generic IntersectionObserver
   ============================================================ */
function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('in-view');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.scroll-reveal').forEach(el => obs.observe(el));
}

/* ============================================================
   CARD TILT — 3D tilt on love cards and timeline cards
   ============================================================ */
function initTilt() {
    const cards = $$('.love-card, .tl-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            card.style.transition = 'transform .08s linear';
            card.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform .5s ease';
            card.style.transform = '';
        });
    });
}

/* ============================================================
   LOVE COUNTER — live relationship duration display
   ============================================================ */
function initCounter() {
    const ids = ['cYears', 'cMonths', 'cDays', 'cHours', 'cMinutes', 'cSeconds'];
    const prev = {};

    function update() {
        const now = new Date();
        const diff = now - CONFIG.LOVE_START_DATE;
        if (diff < 0) { ids.forEach(id => setVal(id, '00', prev)); return; }

        const totalSec = Math.floor(diff / 1000);
        const sec = totalSec % 60;
        const min = Math.floor(totalSec / 60) % 60;
        const hr = Math.floor(totalSec / 3600) % 24;

        // For days/months/years use calendar-aware calculation
        const start = CONFIG.LOVE_START_DATE;
        let years = now.getFullYear() - start.getFullYear();
        let months = now.getMonth() - start.getMonth();
        let days = now.getDate() - start.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) { years--; months += 12; }

        setVal('cYears', pad(years), prev);
        setVal('cMonths', pad(months), prev);
        setVal('cDays', pad(days), prev);
        setVal('cHours', pad(hr), prev);
        setVal('cMinutes', pad(min), prev);
        setVal('cSeconds', pad(sec), prev);
    }

    function setVal(id, val, cache) {
        const el = $(id);
        if (!el) return;
        if (cache[id] !== val) {
            cache[id] = val;
            el.textContent = val;
            el.classList.remove('pop');
            void el.offsetWidth; // reflow
            el.classList.add('pop');
            setTimeout(() => el.classList.remove('pop'), 220);
        }
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    update();
    setInterval(update, 1000);
}

/* ============================================================
   COUNTER BG HEARTS — decorative hearts in counter section
   ============================================================ */
function initCounterBgHearts() {
    const wrap = $('counterBgHearts');
    if (!wrap) return;
    const emojis = ['❤️', '💕', '💖'];
    for (let i = 0; i < 18; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position:absolute;
            left:${rnd(0, 100)}%; top:${rnd(0, 100)}%;
            font-size:${rnd(10, 22)}px;
            opacity:.08;
            animation:float ${rnd(3, 6).toFixed(1)}s ease-in-out infinite;
            animation-delay:${rnd(0, 4).toFixed(1)}s;
            pointer-events:none;
        `;
        el.textContent = emojis[Math.floor(rnd(0, emojis.length))];
        wrap.appendChild(el);
    }
}

/* ============================================================
   LOVE QUOTES — auto-rotating with dot indicators
   ============================================================ */
function initQuotes() {
    const el = $('quoteText');
    const dots = $$('.q-dot');
    let idx = 0;

    function show(i) {
        el?.classList.add('fade-out');
        setTimeout(() => {
            if (el) el.textContent = QUOTES[i];
            el?.classList.remove('fade-out');
            dots.forEach((d, di) => d.classList.toggle('active', di === i));
        }, 520);
    }

    // Manual dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            idx = parseInt(dot.dataset.idx);
            show(idx);
        });
    });

    // Auto-rotate
    setInterval(() => { idx = (idx + 1) % QUOTES.length; show(idx); }, CONFIG.QUOTE_INTERVAL);
}

/* ============================================================
   FORGIVE ME — confetti, heart explosion, popup
   ============================================================ */
function initForgiveMe() {
    $('forgiveBtn')?.addEventListener('click', onForgiven);
    $('bigHeart')?.addEventListener('click', triggerHeartBurst);
    $('popupClose')?.addEventListener('click', closePopup);
    $('popupOverlay')?.addEventListener('click', closePopup);
}

function onForgiven() {
    triggerHeartBurst();
    spawnConfetti();
    setTimeout(openPopup, 700);
}

function openPopup() {
    $('forgivePopup')?.classList.add('active');
    $('popupOverlay')?.classList.add('active');
}
function closePopup() {
    $('forgivePopup')?.classList.remove('active');
    $('popupOverlay')?.classList.remove('active');
}

function triggerHeartBurst() {
    const container = $('confettiContainer');
    if (!container) return;
    const btn = $('forgiveBtn');
    const rect = btn ? btn.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;

    for (let i = 0; i < 36; i++) {
        const el = document.createElement('div');
        el.className = 'explode-heart';
        const angle = (i / 36) * Math.PI * 2;
        const dist = rnd(80, 260);
        el.style.cssText = `
            --sx:0px; --sy:0px;
            --ex:${Math.cos(angle) * dist}px;
            --ey:${Math.sin(angle) * dist}px;
            --ox:${ox}px; --oy:${oy}px;
            --fs:${rnd(14, 28)}px;
            animation-delay:${rnd(0, .25).toFixed(2)}s;
            animation-duration:${rnd(.7, 1.1).toFixed(2)}s;
        `;
        el.textContent = HEART_EMOJIS[Math.floor(rnd(0, HEART_EMOJIS.length))];
        container.appendChild(el);
        setTimeout(() => el.remove(), 1600);
    }
}

function spawnConfetti() {
    const container = $('confettiContainer');
    if (!container) return;

    const COLORS = [
        '#FF4F81', '#8E44AD', '#FF7AAB', '#B76E79',
        '#FFB3C9', '#D63565', '#A569C1', '#fff',
        '#FF69B4', '#DA70D6', '#FFC0CB', '#EE82EE',
    ];

    for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const color = COLORS[Math.floor(rnd(0, COLORS.length))];
        const size = rnd(6, 14);
        const dur = rnd(2, 4.5).toFixed(1);
        const dly = rnd(0, 1.8).toFixed(2);
        const rot0 = rnd(0, 360).toFixed(0);
        const rot1 = rnd(400, 900).toFixed(0);
        el.style.cssText = `
            left:${rnd(0, 100)}%;
            width:${size}px; height:${size}px;
            background:${color};
            border-radius:${Math.random() > .5 ? '50%' : '3px'};
            --dur:${dur}s; --dly:${dly}s;
            --rot0:${rot0}deg; --rot1:${rot1}deg;
        `;
        container.appendChild(el);
        setTimeout(() => el.remove(), (parseFloat(dur) + parseFloat(dly)) * 1000 + 600);
    }
}



/* ============================================================
   FINAL SECTION — heart rain when visible
   ============================================================ */
function initFinalHearts() {
    const rain = $('finalHeartsRain');
    const section = $('final');
    if (!rain || !section) return;

    let started = false;
    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            startHeartRain(rain);
        }
    }, { threshold: 0.2 });
    obs.observe(section);
}

function startHeartRain(container) {
    function addHeart() {
        const el = document.createElement('div');
        const dur = rnd(6, 12).toFixed(1);
        el.style.cssText = `
            position:absolute;
            left:${rnd(0, 100)}%; top:-60px;
            font-size:${rnd(14, 28)}px;
            opacity:.7;
            animation:floatUp ${dur}s ease-in 0s 1 forwards;
        `;
        el.textContent = HEART_EMOJIS[Math.floor(rnd(0, HEART_EMOJIS.length))];
        container.appendChild(el);
        setTimeout(() => el.remove(), parseFloat(dur) * 1000 + 500);
    }

    // Initial burst
    for (let i = 0; i < 24; i++) setTimeout(addHeart, i * 160);
    // Ongoing stream
    setInterval(addHeart, 500);
}

/* ============================================================
   BUTTON RIPPLE — click ripple on glow buttons
   ============================================================ */
function initRipple() {
    // Inject ripple keyframe once
    const style = document.createElement('style');
    style.textContent = '@keyframes rippleGrow{to{width:380px;height:380px;opacity:0;}}';
    document.head.appendChild(style);

    $$('.glow-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const r = btn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position:absolute; border-radius:50%;
                left:${e.clientX - r.left}px; top:${e.clientY - r.top}px;
                width:0; height:0;
                background:rgba(255,255,255,.3);
                transform:translate(-50%,-50%);
                animation:rippleGrow .65s ease forwards;
                pointer-events:none;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });
}

/* ============================================================
   PAGE FADE-IN on load
   ============================================================ */
function initPageFade() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .6s ease';
    window.addEventListener('load', () => {
        requestAnimationFrame(() => { document.body.style.opacity = '1'; });
    });
}

/* ============================================================
   COUNTER CARD POP CSS injection
   ============================================================ */
function injectCounterPop() {
    const s = document.createElement('style');
    s.textContent = '.counter-val.pop{transform:scale(1.2)!important;transition:transform .2s ease!important;}';
    document.head.appendChild(s);
}

/* ============================================================
   INIT ALL
   ============================================================ */
function init() {
    initPageFade();
    initLoading();
    initCursor();
    initNavbar();
    initHeroCTA();
    initParallax();
    initTypewriter();
    initGallery();
    initLightbox();
    initScrollReveal();
    initTilt();
    injectCounterPop();
    initCounter();
    initCounterBgHearts();
    initQuotes();
    initForgiveMe();

    initFinalHearts();
    initRipple();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
