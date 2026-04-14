/* =============================================
   PORTFOLIO JS — Tasya Wulandari
   ============================================= */

// ── TYPING EFFECT ──
const texts = [
    "Software Engineer",
    "Applied AI Engineer",
    "Full Stack Developer"
];

let count = 0;
let index = 0;
let isDeleting = false;

function typeEffect() {
    const current = texts[count];
    const el = document.getElementById("typing-text");
    if (!el) return;

    if (!isDeleting) {
        el.textContent = current.slice(0, ++index);
        if (index === current.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1800);
            return;
        }
        setTimeout(typeEffect, 70);
    } else {
        el.textContent = current.slice(0, --index);
        if (index === 0) {
            isDeleting = false;
            count = (count + 1) % texts.length;
        }
        setTimeout(typeEffect, 40);
    }
}
typeEffect();


// ── NAVBAR SCROLL ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 60) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


// ── HAMBURGER MENU ──
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});

// Close nav on link click
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});

// Close on outside click
document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("open");
    }
});


// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});


// ── REVEAL ON SCROLL ──
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add("visible");
            }, entry.target.dataset.delay || 0);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el, i) => {
    // Stagger siblings
    const siblings = el.parentElement?.querySelectorAll(".reveal");
    if (siblings) {
        const idx = Array.from(siblings).indexOf(el);
        el.dataset.delay = idx * 80;
    }
    revealObserver.observe(el);
});


// ── PROJECT CAROUSEL + FILTER ──
(function() {
    const track       = document.getElementById('carousel-track');
    const dotsWrap    = document.getElementById('carousel-dots');
    const prevBtn     = document.getElementById('carousel-prev');
    const nextBtn     = document.getElementById('carousel-next');
    const filterBtns  = document.querySelectorAll('.filter-btn');
    const allCards    = Array.from(document.querySelectorAll('.project-card'));

    let activeFilter  = 'all';
    let currentIndex  = 0;
    let visibleCards  = [];
    let autoTimer     = null;

    // Build dots
    function buildDots(count) {
        dotsWrap.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
            dot.addEventListener('click', () => { goTo(i); resetTimer(); });
            dotsWrap.appendChild(dot);
        }
    }

    function updateDots() {
        dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    // Apply filter — show/hide cards, rebuild carousel state
    function applyFilter(filter) {
        activeFilter = filter;
        currentIndex = 0;

        allCards.forEach(card => {
            const cat = card.dataset.category;
            if (filter === 'all' || cat === filter) {
                card.classList.remove('carousel-hidden');
            } else {
                card.classList.add('carousel-hidden');
            }
        });

        visibleCards = allCards.filter(c => !c.classList.contains('carousel-hidden'));
        buildDots(visibleCards.length);
        render();
    }

    // Move carousel to index
    function goTo(idx) {
        currentIndex = (idx + visibleCards.length) % visibleCards.length;
        render();
        updateDots();
    }

    /* BARU */
    function render() {
        if (!visibleCards.length) return;

        const cardW      = visibleCards[0].offsetWidth;
        const gap        = 24;
        const containerW = track.parentElement.offsetWidth;

        const offset = (containerW / 2) - (cardW / 2) - (currentIndex * (cardW + gap));
        track.style.transform = `translateX(${offset}px)`;

        visibleCards.forEach((card, i) => {
            card.classList.remove('carousel-active', 'carousel-prev-card', 'carousel-next-card');

            if (i === currentIndex) {
                card.classList.add('carousel-active');
                card.style.cursor = 'default';
                card.style.pointerEvents = 'auto';
            } else if (i === currentIndex - 1 || (currentIndex === 0 && i === visibleCards.length - 1)) {
                card.classList.add('carousel-prev-card');
                card.style.cursor = 'pointer';
                card.onclick = () => { goTo(i); resetTimer(); };
            } else if (i === currentIndex + 1 || (currentIndex === visibleCards.length - 1 && i === 0)) {
                card.classList.add('carousel-next-card');
                card.style.cursor = 'pointer';
                card.onclick = () => { goTo(i); resetTimer(); };
            } else {
                card.onclick = null;
                card.style.cursor = 'default';
            }
        });
    }

    // Auto-slide every 5s
    function startTimer() {
        autoTimer = setInterval(() => { goTo(currentIndex + 1); }, 5000);
    }

    function resetTimer() {
        clearInterval(autoTimer);
        startTimer();
    }

    // Prev / Next
    prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetTimer(); });
    nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetTimer(); });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
            resetTimer();
        });
    });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(currentIndex + (diff > 0 ? 1 : -1)); resetTimer(); }
    });

    // Recalculate on resize
    window.addEventListener('resize', () => render());

    // Init
    applyFilter('all');
    startTimer();

})();


// ── PARTICLE CANVAS ──
const canvas = document.getElementById("particle-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["rgba(56,189,248,", "rgba(139,92,246,", "rgba(236,72,153,", "rgba(34,211,238,"];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ")";
            ctx.fill();
        }
    }

    // Init
    for (let i = 0; i < 80; i++) particles.push(new Particle());

    // Connect nearby particles
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}


// ── CONTACT FORM ──
const form = document.getElementById("contact-form");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const btn = document.getElementById("submit-btn");
        const btnText = document.getElementById("btn-text");
        const btnIcon = document.getElementById("btn-icon");
        const successMsg = document.getElementById("form-success");

        // Simulate sending
        btn.disabled = true;
        btnText.textContent = "Sending...";
        btnIcon.textContent = "⟳";

        setTimeout(() => {
            btn.disabled = false;
            btnText.textContent = "Send Message";
            btnIcon.textContent = "→";
            form.reset();
            successMsg.style.display = "block";
            setTimeout(() => { successMsg.style.display = "none"; }, 4000);
        }, 1500);
    });
}


// ── PROJECT MODAL ──
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");

function openModal(card) {
    const title      = card.dataset.title;
    const cat        = card.dataset.cat;
    const catType    = card.dataset.catType;
    const role       = card.dataset.role;
    const desc       = card.dataset.desc;
    const insight    = card.dataset.insight;
    const stack      = card.dataset.stack;
    const highlights = card.dataset.highlights;
    const image      = card.dataset.image;

    document.getElementById("modal-title").textContent   = title;
    document.getElementById("modal-role").textContent    = role;
    document.getElementById("modal-desc").textContent    = desc;
    document.getElementById("modal-insight").textContent = insight;

    // Category badge
    const catEl = document.getElementById("modal-cat");
    catEl.textContent = cat;
    catEl.className = "modal-cat";
    if (catType === "ai") catEl.classList.add("ai-cat");
    else if (catType === "other") catEl.classList.add("other-cat");
    else catEl.classList.add("fullstack-cat");

    // IMAGE INJECTION
    const imgWrap = document.getElementById("modal-image-wrap");
    const imgEl   = document.getElementById("modal-image");

    if (image) {
        imgEl.src = image;
        imgWrap.style.display = "block";
    } else {
        imgWrap.style.display = "none";
    }

    // Highlights list
    const hlEl = document.getElementById("modal-highlights");
    const hlWrap = document.getElementById("modal-highlights-wrap");
    hlEl.innerHTML = "";
    if (highlights) {
        try {
            const items = JSON.parse(highlights);
            items.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                hlEl.appendChild(li);
            });
            hlWrap.style.display = "block";
        } catch(e) {
            hlWrap.style.display = "none";
        }
    } else {
        hlWrap.style.display = "none";
    }

    // Tech stack pills
    const stackEl = document.getElementById("modal-stack");
    stackEl.innerHTML = "";
    stack.split("·").forEach(s => {
        const span = document.createElement("span");
        span.textContent = s.trim();
        stackEl.appendChild(span);
    });

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

// Open on button click
document.querySelectorAll(".btn-view-detail").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(btn.closest(".project-card"));
    });
});

// Close on X button
if (modalClose) modalClose.addEventListener("click", closeModal);

// Close on overlay click (outside box)
if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}

// Close on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});


const sections = document.querySelectorAll("section[id], header[id]");
const navLinksAll = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinksAll.forEach(link => {
                link.classList.remove("active-nav");
                if (link.getAttribute("href") === "#" + entry.target.id) {
                    link.classList.add("active-nav");
                }
            });
        }
    });
}, { threshold: 0.4 });


// ── TECH ECOSYSTEM TABS ──
const techCatBtns = document.querySelectorAll(".tech-cat-btn");
const techDetails = document.querySelectorAll(".tech-detail");

techCatBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;

        techCatBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        techDetails.forEach(d => {
            d.classList.remove("active");
            if (d.dataset.cat === cat) d.classList.add("active");
        });
    });
});

// ── CUSTOM CURSOR TRAIL ──
(function() {
    const TRAIL_COUNT = 8;
    const dots = [];

    // Sembunyikan kursor default
    document.body.style.cursor = 'none';

    // Buat titik-titik trail
    for (let i = 0; i < TRAIL_COUNT; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s;
        `;
        document.body.appendChild(dot);
        dots.push({ el: dot, x: 0, y: 0 });
    }

    // Kursor utama (lebih besar)
    const mainDot = dots[0];
    const trailDots = dots.slice(1);

    // Ukuran & warna per dot
    const sizes  = [10, 7, 6, 5, 5, 4, 4, 3];
    const alphas = [0.9, 0.6, 0.5, 0.4, 0.35, 0.3, 0.25, 0.2];
    const colors = [
        '56,189,248',   // blue — kursor utama
        '139,92,246',   // purple
        '139,92,246',
        '236,72,153',   // pink
        '139,92,246',
        '56,189,248',
        '139,92,246',
        '236,72,153',
    ];

    dots.forEach((dot, i) => {
        const size = sizes[i] || 3;
        dot.el.style.width  = size + 'px';
        dot.el.style.height = size + 'px';
        dot.el.style.background = `rgba(${colors[i]},${alphas[i]})`;
        dot.el.style.boxShadow = i === 0
            ? `0 0 8px rgba(${colors[i]},0.8)`
            : 'none';
    });

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Update kursor utama langsung
        dots[0].x = mouseX;
        dots[0].y = mouseY;
        dots[0].el.style.left = mouseX + 'px';
        dots[0].el.style.top  = mouseY + 'px';
    });

    // Trail dots mengikuti dengan lag
    function animateTrail() {
        for (let i = 1; i < dots.length; i++) {
            const prev = dots[i - 1];
            dots[i].x += (prev.x - dots[i].x) * 0.35;
            dots[i].y += (prev.y - dots[i].y) * 0.35;
            dots[i].el.style.left = dots[i].x + 'px';
            dots[i].el.style.top  = dots[i].y + 'px';
        }
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Sembunyikan saat kursor keluar window
    document.addEventListener('mouseleave', () => {
        dots.forEach(d => d.el.style.opacity = '0');
    });
    document.addEventListener('mouseenter', () => {
        dots.forEach(d => d.el.style.opacity = '1');
    });

    // Efek hover pada elemen interaktif (membesar)
    document.querySelectorAll('a, button, .btn, .project-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dots[0].el.style.transform = 'translate(-50%,-50%) scale(2)';
            dots[0].el.style.cursor = 'none';
        });
        el.addEventListener('mouseleave', () => {
            dots[0].el.style.transform = 'translate(-50%,-50%) scale(1)';
        });
    });
})();

// ── SPACE BACKGROUND ANIMATION ──
(function() {
    const canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, stars = [], nebulas = [], shootingStars = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); init(); });

    // ── BINTANG STATIS ──
    class Star {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : -2;
            this.r = Math.random() * 1.2 + 0.2;
            this.alpha = Math.random() * 0.7 + 0.1;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
            this.color = Math.random() > 0.85
                ? `rgba(139,92,246,${this.alpha})`   // purple stars
                : Math.random() > 0.7
                    ? `rgba(56,189,248,${this.alpha})`  // blue stars
                    : `rgba(255,255,255,${this.alpha})`; // white stars
        }
        update() {
            this.alpha += this.twinkleSpeed * this.twinkleDir;
            if (this.alpha > 0.9 || this.alpha < 0.05) this.twinkleDir *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(/[\d.]+\)$/, this.alpha + ')');
            ctx.fill();
        }
    }

    // ── SHOOTING STAR ──
    class ShootingStar {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H * 0.5;
            this.len = Math.random() * 120 + 60;
            this.speed = Math.random() * 6 + 4;
            this.angle = Math.PI / 5 + (Math.random() - 0.5) * 0.3;
            this.alpha = 1;
            this.life = 0;
            this.maxLife = this.len / this.speed;
            this.active = false;
            this.delay = Math.random() * 400;
        }
        update() {
            if (this.delay > 0) { this.delay--; return; }
            this.active = true;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.life++;
            this.alpha = 1 - this.life / this.maxLife;
            if (this.life >= this.maxLife) this.reset();
        }
        draw() {
            if (!this.active || this.alpha <= 0) return;
            const tailX = this.x - Math.cos(this.angle) * this.len * this.alpha;
            const tailY = this.y - Math.sin(this.angle) * this.len * this.alpha;
            const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
            grad.addColorStop(0, 'rgba(255,255,255,0)');
            grad.addColorStop(1, `rgba(200,230,255,${this.alpha * 0.9})`);
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    // ── NEBULA BLOB ──
    class Nebula {
        constructor() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 180 + 80;
            const palettes = [
                [56,189,248],   // blue
                [139,92,246],   // purple
                [236,72,153],   // pink
                [34,211,238],   // cyan
            ];
            this.rgb = palettes[Math.floor(Math.random() * palettes.length)];
            this.alpha = Math.random() * 0.04 + 0.015;
            this.driftX = (Math.random() - 0.5) * 0.08;
            this.driftY = (Math.random() - 0.5) * 0.08;
        }
        update() {
            this.x += this.driftX;
            this.y += this.driftY;
            if (this.x < -this.r) this.x = W + this.r;
            if (this.x > W + this.r) this.x = -this.r;
            if (this.y < -this.r) this.y = H + this.r;
            if (this.y > H + this.r) this.y = -this.r;
        }
        draw() {
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
            grad.addColorStop(0, `rgba(${this.rgb.join(',')},${this.alpha})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    function init() {
        stars = Array.from({ length: 180 }, () => new Star());
        nebulas = Array.from({ length: 6 }, () => new Nebula());
        shootingStars = Array.from({ length: 4 }, () => new ShootingStar());
    }
    init();

    function animate() {
        ctx.clearRect(0, 0, W, H);

        nebulas.forEach(n => { n.update(); n.draw(); });
        stars.forEach(s => { s.update(); s.draw(); });
        shootingStars.forEach(s => { s.update(); s.draw(); });

        requestAnimationFrame(animate);
    }
    animate();
})();

// ── THEME TOGGLE ──
const toggleBtn = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");

function setIcon(theme) {
    if (theme === "light") {
        icon.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
        `;
    } else {
        icon.innerHTML = `
            <path d="M21 12.79A9 9 0 0 1 11.21 3 
            a7 7 0 1 0 9.79 9.79z"></path>
        `;
    }
}

function applyTheme(theme) {
    if (theme === "light") {
        document.documentElement.classList.add("light");
    } else {
        document.documentElement.classList.remove("light");
    }
    setIcon(theme);
}

toggleBtn.addEventListener("click", () => {
    const isLight = document.documentElement.classList.contains("light");
    const newTheme = isLight ? "dark" : "light";

    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
});

// init
(function () {
    const saved = localStorage.getItem("theme") || "dark";
    applyTheme(saved);
})();
