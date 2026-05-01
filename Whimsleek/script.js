document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. PRELOADER LOGIC ---
    const preloader = document.getElementById("preloader");
    const preloaderLogo = document.querySelector(".preloader-logo");
    
    // Fade-in logo saglit tapos tatanggalin yung buong preloader
    setTimeout(() => { preloaderLogo.style.opacity = 1; }, 500);
    setTimeout(() => { preloader.classList.add("preloader-hidden"); }, 2800);

    // --- 3. CUSTOM CURSOR LOGIC ---
    const cursor = document.getElementById("custom-cursor");
    document.addEventListener("mousemove", (e) => {
        // Papasunurin yung div kung nasan yung mouse
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });

    // Papalakihin yung bilog pag tinapat sa mga buttons at links
    const interactables = document.querySelectorAll("a, button");
    interactables.forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
    });

    // --- 5. AUDIO TOGGLE LOGIC ---
    const audioBtn = document.getElementById("audio-toggle");
    const bgAudio = document.getElementById("ambient-audio");
    let isPlaying = false;
    
    audioBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgAudio.pause();
            audioBtn.innerText = "Sound: Off";
        } else {
            bgAudio.play();
            audioBtn.innerText = "Sound: On";
        }
        isPlaying = !isPlaying;
    });

    // --- FADE-IN ANIMATION LOGIC (Existing mo to) ---
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 1.5s ease, transform 1.5s ease";
        observer.observe(el);
    });

    // --- DYNAMIC NAVIGATION & 4. PARALLAX EFFECT LOGIC ---
    let lastScrollTop = 0;
    const navbar = document.getElementById("main-nav");
    const heroBg = document.querySelector(".hero-bg-placeholder");

    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navigation Bar Logic
        if (scrollTop > lastScrollTop) {
            navbar.classList.add("nav-hidden");
            navbar.classList.remove("nav-scrolled");
        } else {
            navbar.classList.remove("nav-hidden");
            if (scrollTop > 50) {
                navbar.classList.add("nav-scrolled");
            } else {
                navbar.classList.remove("nav-scrolled");
            }
        }
        
        // Parallax Logic: Papabagsakin natin ng napaka-slight yung video pag nag scroll
        if(heroBg) {
            heroBg.style.transform = `translateY(${scrollTop * 0.4}px)`;
        }

        lastScrollTop = scrollTop;
    });
});