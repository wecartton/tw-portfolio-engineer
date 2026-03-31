// Typing Effect
const texts = [
    "Applied AI Engineer",
    "Computer Vision Specialist",
    "Robotics Engineer",
    "NLP Practitioner"
];

let count = 0;
let index = 0;

function typeEffect() {
    let current = texts[count];
    document.getElementById("typing-text").textContent = current.slice(0, index++);

    if (index > current.length) {
        count = (count + 1) % texts.length;
        index = 0;
        setTimeout(typeEffect, 1800);
    } else {
        setTimeout(typeEffect, 70);
    }
}
typeEffect();


// Scroll Animation (smooth)
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".project-card").forEach(el => observer.observe(el));


// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});