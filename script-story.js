document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;

    // --- 1. Seamless Page Entry & Exit ---
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fromNav = sessionStorage.getItem('pageFade') === '1';

    if (fromNav && !reduceMotion) {
        sessionStorage.removeItem('pageFade');
        document.documentElement.classList.add('from-transition');
        void body.offsetWidth;
        requestAnimationFrame(() => {
            body.classList.add('page-enter-active');
            setTimeout(() => {
                document.documentElement.classList.remove('from-transition');
                body.classList.remove('page-enter-active');
            }, 500);
        });
    } else {
        document.documentElement.classList.remove('from-transition');
    }

    // --- 2. Render Cards dari Data Story ---
    const container = document.getElementById("scrolly-app");
    if (!container || typeof storyData === "undefined") return;

    const fragment = document.createDocumentFragment();

    storyData.forEach((item, index) => {
        const cardEl = document.createElement("section");
        cardEl.className = `story-card ${item.type}-card align-${item.align || 'left'}`;

        // Indikator Scroll hanya muncul jika BUKAN halaman outro
        const scrollIndicatorHtml = item.type !== "outro" ? `
            <div class="scroll-indicator" aria-hidden="true">
                <span class="scroll-indicator-text">Scroll</span>
                <span class="scroll-chevron"></span>
            </div>
        ` : '';

        if (item.type === "photo") {
            const isFirstImage = index === 1;
            cardEl.innerHTML = `
                <div class="story-wrapper">
                    <div class="story-media-frame">
                        <img src="${item.image}" alt="${item.title}" ${isFirstImage ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
                    </div>
                    <div class="story-content">
                        <h2 class="story-title">${item.title}</h2>
                        <p class="story-desc">${item.desc}</p>
                    </div>
                </div>
                ${scrollIndicatorHtml}
            `;
        } else if (item.type === "outro") {
            cardEl.innerHTML = `
                <div class="story-wrapper story-single">
                    <div class="story-content">
                        <h2 class="story-title">${item.title}</h2>
                        <p class="story-desc">${item.desc}</p>
                        ${item.showNav ? `
                            <nav class="header-nav story-nav" aria-label="Navigasi Penutup">
                                <a href="index.html" class="btn-nav">Halaman Utama</a>
                                <span class="nav-divider" aria-hidden="true"></span>
                                <a href="jurnal.html" class="btn-nav">Jurnal</a>
                                <span class="nav-divider" aria-hidden="true"></span>
                                <a href="album.html" class="btn-nav">Album</a>
                            </nav>
                        ` : ''}
                    </div>
                </div>
            `;
        } else {
            cardEl.innerHTML = `
                <div class="story-wrapper story-single">
                    <div class="story-content">
                        <h2 class="story-title">${item.title}</h2>
                        <p class="story-desc">${item.desc}</p>
                    </div>
                </div>
                ${scrollIndicatorHtml}
            `;
        }

        fragment.appendChild(cardEl);
    });

    container.appendChild(fragment);

    // --- 3. Intersection Observer (Trigger Animasi Smooth Teks & Gambar) ---
    const cards = document.querySelectorAll(".story-card");

    const observerOptions = {
        root: document.getElementById("scrolly-app"), // Observasi di dalam container
        threshold: 0.75 // Animasi BARU MULAI jika halaman sudah masuk 75% layar
    };

    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-active");
            } else {
                // Cabut kelas seketika saat halaman keluar layar 
                // Ini memicu efek "mundur/tenggelam" dari CSS
                entry.target.classList.remove("is-active");
            }
        });
    }, observerOptions);

    cards.forEach(card => storyObserver.observe(card));

    // Force aktifkan card 1 saat pertama load (Lighthouse Optimization)
    if (cards.length > 0) {
        setTimeout(() => {
            cards[0].classList.add("is-active");
        }, 150); 
    }

    // --- 4. Handle Page Exit Transition untuk Tombol Navigasi ---
    document.addEventListener('click', function (e) {
        const a = e.target.closest('a[href]');
        if (!a) return;

        const href = a.getAttribute('href');
        if (!href || href.startsWith('#')) return;

        e.preventDefault();
        sessionStorage.setItem('pageFade', '1');

        if (reduceMotion) {
            window.location.href = href;
            return;
        }

        body.classList.add('page-exit');
        setTimeout(() => {
            window.location.href = href;
        }, 480);
    });
});