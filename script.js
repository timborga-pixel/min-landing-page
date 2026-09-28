/* START ALLRA LÄNGST UPP */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

if (location.hash) {
    try {
        history.replaceState(null, "", location.pathname + location.search);
    } catch (e) {}
}

scrollToTop();
window.addEventListener("load", scrollToTop);
window.addEventListener("pageshow", function (event) {
    if (event.persisted) scrollToTop();
});

const form = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

function setError(fieldId, text) {
    document.getElementById(fieldId + "-error").textContent = text;
    document.getElementById(fieldId).classList.toggle("invalid", text !== "");
}

function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    let ok = true;

    if (name.length < 2) {
        setError("name", "Skriv ditt namn.");
        ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("email", "Skriv en giltig e-postadress.");
        ok = false;
    }
    if (message.length < 10) {
        setError("message", "Skriv minst 10 tecken.");
        ok = false;
    }
    return ok;
}

["name", "email", "message"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
        setError(id, "");
    });
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (!validateForm()) {
        formMessage.textContent = "";
        return;
    }
    
    const name = document.getElementById("name").value;
    const data = new FormData(form);

    formMessage.textContent = "Skickar...";

    try {
        const response = await fetch("https://formspree.io/f/mljdaelb", {
            method: "POST",
            body: data,
            headers: { "Accept": "application/json" }
        });

        if (response.ok) {
            formMessage.textContent = "Tack " + name + "! Vi hör av oss snart. ✅";
            form.reset();
        } else {
            formMessage.textContent = "Något gick fel. Försök igen.";
        }
    } catch (error) {
        formMessage.textContent = "Kunde inte skicka. Kontrollera din uppkoppling.";
    }
});

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {
    question.addEventListener("click", function () {
        question.parentElement.classList.toggle("open");
    });
});

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
    });
});

/* SCROLL-ANIMATIONER (spelas varje gång man scrollar förbi) */

(function () {
    const sections = Array.from(document.querySelectorAll(".hero, .services, .process, .testimonials, .faq, .contact"));
    const items = Array.from(document.querySelectorAll(
        ".hero h1, .hero p, .hero .button, section > h2, .service-card, .step, .testimonial, .faq-item, .contact > p, .contact form"
    ));

    // Ger elementen en fördröjning så att de dyker upp efter varandra
    const counters = new Map();
    items.forEach(function (el) {
        const n = counters.get(el.parentElement) || 0;
        el.classList.add("reveal");
        el.style.setProperty("--d", (n * 0.14) + "s");
        counters.set(el.parentElement, n + 1);
    });

    if (!("IntersectionObserver" in window)) {
        sections.forEach(function (el) { el.classList.add("in-view", "is-visible"); });
        items.forEach(function (el) { el.classList.add("is-visible"); });
        return;
    }

    function watch(elements, options, onChange) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(onChange);
        }, options);
        elements.forEach(function (el) { observer.observe(el); });
    }

    // Sektioner: bakgrunden tonas in så fort sektionen syns, rutan lite senare
    watch(sections, { threshold: [0, 0.12] }, function (entry) {
        const el = entry.target;
        el.classList.toggle("in-view", entry.isIntersecting);
        if (entry.intersectionRatio >= 0.12) el.classList.add("is-visible");
        else if (!entry.isIntersecting) el.classList.remove("is-visible");
    });

    // Innehåll: tonas in när det kommer i bild och ut när det lämnar skärmen
    watch(items, { threshold: [0, 0.2], rootMargin: "0px 0px -6% 0px" }, function (entry) {
        if (entry.intersectionRatio >= 0.2) entry.target.classList.add("is-visible");
        else if (!entry.isIntersecting) entry.target.classList.remove("is-visible");
    });
})();
