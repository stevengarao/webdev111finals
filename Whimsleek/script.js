document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. PRELOADER LOGIC ---
    const preloader = document.getElementById("preloader");
    const preloaderLogo = document.querySelector(".preloader-logo");
    
    // Fade-in logo saglit tapos tatanggalin yung buong preloader
    if (preloader && preloaderLogo) {
        setTimeout(() => { preloaderLogo.style.opacity = 1; }, 500);
        setTimeout(() => { preloader.classList.add("preloader-hidden"); }, 2800);
    }

    // --- 3. CUSTOM CURSOR LOGIC ---
    const cursor = document.getElementById("custom-cursor");
    if (cursor) {
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
    }

    // --- 5. AUDIO TOGGLE LOGIC ---
    const audioBtn = document.getElementById("audio-toggle");
    const bgAudio = document.getElementById("ambient-audio");
    let isPlaying = false;
    
    // ITO YUNG FIX: Iche-check muna kung nandito yung button bago lagyan ng function
    if (audioBtn && bgAudio) {
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
    }
    
    // --- 6. AUTO-SCROLL INFINITE LOOP LOGIC ---
    const carouselTrack = document.getElementById("carousel-track");
    
    // Iche-check kung nasa index.html tayo para hindi mag-error sa ibang pages
    if (carouselTrack) {
        // I-clone natin lahat ng cards at idikit sa dulo para seamless yung loop
        const cards = Array.from(carouselTrack.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            carouselTrack.appendChild(clone);
        });
    }

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

    if (navbar) {
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
    }
});

// --- LUXURY OUTFIT GENERATOR LOGIC ---
const generateBtn = document.getElementById("generate-btn");

if (generateBtn) {
    const vibeSelect = document.getElementById("vibe-select");
    const loadingOverlay = document.getElementById("loading-overlay");
    const resultDisplay = document.getElementById("result-display");
    const loaderText = document.querySelector(".loader-text");

    // Elements para sa Outfit Grid
    const itemTop = document.getElementById("item-top");
    const itemBottom = document.getElementById("item-bottom");
    const itemDress = document.getElementById("item-dress");
    
    const imgTop = document.getElementById("img-top");
    const imgBottom = document.getElementById("img-bottom");
    const imgDress = document.getElementById("img-dress");
    const imgShoes = document.getElementById("img-shoes");
    const imgAccessories = document.getElementById("img-accessories");

    // ✨ MAGIC SHORTCUT FUNCTION ✨
    const generateList = (prefix, count) => {
        let arr = [];
        for (let i = 1; i <= count; i++) {
            arr.push(`${prefix}${i}.jpg`);
        }
        return arr;
    };

    // --- BAGONG WARDROBE INVENTORY SYSTEM ---
    const inventory = {
        y2k: {
            tops: generateList("y2ktop", 50),       
            bottoms: generateList("y2kbottom", 50), 
            dresses: generateList("y2kdress", 50), 
            shoes: generateList("y2kshoes", 50),
            accessories: generateList("y2kacc", 50)
        },
        coquette: {
            tops: generateList("coquettetop", 50),
            bottoms: generateList("coquettebottom", 50),
            dresses: generateList("coquettedress", 50),
            shoes: generateList("coquetteshoes", 50),
            accessories: generateList("coquetteacc", 50)
        },
        grunge: {
            tops: generateList("grungetop", 50),
            bottoms: generateList("grungebottom", 50),
            dresses: generateList("grungedress", 50), 
            shoes: generateList("grungeshoes", 50),
            accessories: generateList("grungeacc", 50)
        },
        casual: {
            tops: generateList("casualtop", 50),
            bottoms: generateList("casualbottom", 50),
            dresses: generateList("casualdress", 50),
            shoes: generateList("casualshoes", 50),
            accessories: generateList("casualacc", 50)
        }
    };

    // Helper function para kumuha ng random item sa loob ng array
    const getRandomItem = (arr) => {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    };

    generateBtn.addEventListener("click", () => {
        // Ipakita ang "Curating..." screen
        loadingOverlay.classList.add("active");
        resultDisplay.classList.add("hidden-result");
        loaderText.innerText = "Curating...";

        setTimeout(() => {
            let selectedVibe = vibeSelect.value;
            
            // Kung "Surprise Me (Random)" ang pinili
            if (selectedVibe === "random") {
                const vibesList = Object.keys(inventory); 
                selectedVibe = vibesList[Math.floor(Math.random() * vibesList.length)];
            }

            const currentWardrobe = inventory[selectedVibe];

            // Aalamin ng system kung dress ba o top/bottom ang ipapakita
            let isDress = false;
            if (currentWardrobe.dresses.length > 0 && currentWardrobe.tops.length > 0) {
                isDress = Math.random() > 0.5; 
            } else if (currentWardrobe.dresses.length > 0) {
                isDress = true; 
            }

            // PAGLALAGAY NG PICTURES
            if (isDress) {
                itemTop.classList.add("hidden");
                itemBottom.classList.add("hidden");
                itemDress.classList.remove("hidden");
                
                imgDress.src = getRandomItem(currentWardrobe.dresses);
            } else {
                itemDress.classList.add("hidden");
                itemTop.classList.remove("hidden");
                itemBottom.classList.remove("hidden");
                
                imgTop.src = getRandomItem(currentWardrobe.tops);
                imgBottom.src = getRandomItem(currentWardrobe.bottoms);
            }

            // Laging may shoes at accessories
            imgShoes.src = getRandomItem(currentWardrobe.shoes);
            imgAccessories.src = getRandomItem(currentWardrobe.accessories);

            // Alisin yung loading screen at ipakita na yung result
            loadingOverlay.classList.remove("active");
            resultDisplay.classList.remove("hidden-result");
            
        }, 1500);
    });
}

// --- SHOP FILTER LOGIC ---
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class to all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Show/Hide products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    // Little timeout for smooth fade animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400); // Matches the CSS transition time
                }
            });
        });
    });
}

// ==========================================================================
// ✨ AESTHETIC CAROUSEL LOGIC ✨
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", function () {
            let items = document.querySelectorAll(".aesthetic-carousel-section .item");
            document.querySelector(".aesthetic-carousel-section .slide").appendChild(items[0]);
        });

        prevBtn.addEventListener("click", function () {
            let items = document.querySelectorAll(".aesthetic-carousel-section .item");
            document.querySelector(".aesthetic-carousel-section .slide").prepend(items[items.length - 1]);
        });
    }
});
