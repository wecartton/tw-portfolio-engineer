/* =============================================
   PORTFOLIO JS — Tasya Wulandari
   ============================================= */

// ── TYPING EFFECT ──
const texts = [
    "Software Engineer",
    "Applied AI Engineer",
    "Computer Vision Specialist",
    "Full Stack Developer",
    "NLP Practitioner"
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


// ── PROJECT FILTER ──
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            const category = card.dataset.category;
            if (filter === "all" || category === filter) {
                card.classList.remove("hidden");
            } else {
                card.classList.add("hidden");
            }
        });
    });
});


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

sections.forEach(sec => sectionObserver.observe(sec));