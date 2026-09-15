// Jurnal by csv.
const JURNAL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR92Cjb0EKmxAv7-FeQIhj9V43EwxxDPLtsNsMHSN_ipaYJgtIPtArz_BSEtHxSP7Y37Lruaab_vuN2/pub?output=csv";

document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Layar Intro Otomatis (Hanya muncul sekali per sesi)
    const introScreen = document.getElementById("intro-screen");

    if (introScreen) {
        if (sessionStorage.getItem("introShown") === "true") {
            // Jika sudah pernah dibuka di sesi ini, langsung matikan elemennya
            introScreen.style.display = "none";
        } else {
            // Jika pertama kali buka web, jalankan durasi 3 detik lalu sembunyikan & simpan status
            setTimeout(() => {
                introScreen.style.display = "none";
                sessionStorage.setItem("introShown", "true");
            }, 3000); // 3000 ms = 3 detik
        }
    }

    // 2. Helper poster video Cloudinary
    function getVideoPoster(videoUrl) {
        if (videoUrl.includes("cloudinary.com")) {
            const cleanUrl = videoUrl.split("#")[0].split("?")[0];
            return cleanUrl.replace(/\.[^/.]+$/, ".jpg").replace("/upload/", "/upload/so_1.0,f_auto,q_auto/");
        }
        return "";
    }

    // 3. Render galeri (index & album) - Bentley Style Layout & GPU Optimized
    function renderGallery(container, items) {
        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card reveal-card';

            if (item.type === 'video') {
                const posterUrl = getVideoPoster(item.src);
                card.innerHTML = `
                    <span class="card-tag">${item.category}</span>
                    <div class="video-container">
                        <video muted playsinline preload="none" poster="${posterUrl}" data-src="${item.src}#t=0.5"></video>
                        <div class="custom-play-btn"><div class="play-icon"></div></div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.title}</h3>
                        <div class="card-desc"><span>${item.desc}</span></div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <span class="card-tag">${item.category}</span>
                    <div class="img-container">
                        <img src="${item.src}" alt="${item.title}" loading="lazy" decoding="async">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.title}</h3>
                        <div class="card-desc"><span>${item.desc}</span></div>
                    </div>
                `;
            }
            fragment.appendChild(card);
        });

        container.appendChild(fragment);
    }

    function ensureVideoSource(video) {
        if (!video || video.querySelector('source') || !video.dataset.src) return;
        const source = document.createElement('source');
        source.src = video.dataset.src;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.load();
    }

    function initVideoLazyLoad() {
        const videos = document.querySelectorAll('.video-container video[data-src]');
        if (!videos.length) return;

        if (!('IntersectionObserver' in window)) {
            videos.forEach(ensureVideoSource);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ensureVideoSource(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.01 });

        videos.forEach(v => observer.observe(v));
    }

    const albumGrid = document.getElementById("album-grid");
    if (albumGrid && typeof albumData !== 'undefined') {
        renderGallery(albumGrid, albumData);
    }

    const homeGrid = document.getElementById("gallery-grid");
    if (homeGrid && typeof homeGalleryData !== 'undefined') {
        renderGallery(homeGrid, homeGalleryData);
    }

    initVideoLazyLoad();

    // 4. Poster video statis
    document.querySelectorAll('.video-container video').forEach(video => {
        const source = video.querySelector('source');
        const srcForPoster = (source && source.src) || video.dataset.src || '';
        if (srcForPoster && !video.hasAttribute('poster')) {
            const poster = getVideoPoster(srcForPoster);
            if (poster) video.setAttribute('poster', poster);
        }
    });

    // 5. Video play/pause
    const initVideoLogic = () => {
        const videoContainers = document.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            if (!video) return;

            container.addEventListener('click', function (e) {
                if (e.target.closest('.card-content')) return;

                if (video.paused) {
                    ensureVideoSource(video);
                    document.querySelectorAll('video').forEach(v => {
                        v.pause();
                        if (v.parentElement) v.parentElement.classList.remove('playing');
                    });
                    video.play().then(() => container.classList.add('playing')).catch(console.error);
                } else {
                    video.pause();
                    container.classList.remove('playing');
                }
            });

            video.addEventListener('ended', () => container.classList.remove('playing'));
        });
    };
    initVideoLogic();

    // 6. Lightbox
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const lightboxClose = document.getElementById("lightbox-close");

    const initLightbox = () => {
        document.querySelectorAll(".img-container").forEach(container => {
            container.addEventListener("click", function (e) {
                if (e.target.closest('.card-content')) return;

                const img = this.querySelector("img");
                const card = this.closest(".card");
                if (!lightbox || !img) return;

                lightboxImg.src = img.src;
                lightboxTitle.innerText = card ? card.querySelector(".card-title").innerText : '';
                lightboxDesc.innerText = card ? card.querySelector(".card-desc").innerText : '';
                lightbox.classList.add("active");
            });
        });
    };
    initLightbox();

    if (lightboxClose && lightbox) {
        const closeLightbox = () => lightbox.classList.remove("active");
        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
    }

    // 6b. Klik teks kartu galeri untuk reveal deskripsi
    document.addEventListener("click", function (e) {
        const content = e.target.closest(".gallery-grid .card-content");
        if (!content) return;

        e.stopPropagation();
        const card = content.closest(".card");
        if (!card) return;

        const wasOpen = card.classList.contains("is-expanded");
        document.querySelectorAll(".gallery-grid .card.is-expanded").forEach(c => {
            if (c !== card) c.classList.remove("is-expanded");
        });
        card.classList.toggle("is-expanded", !wasOpen);
    });

    // 7. Jurnal dari CSV
    function parseCSV(text) {
        const rows = [];
        let row = [];
        let field = "";
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const next = text[i + 1];
            if (inQuotes) {
                if (char === '"' && next === '"') { field += '"'; i++; }
                else if (char === '"') { inQuotes = false; }
                else { field += char; }
            } else {
                if (char === '"') { inQuotes = true; }
                else if (char === ",") { row.push(field); field = ""; }
                else if (char === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
                else if (char === "\r") { /* skip */ }
                else { field += char; }
            }
        }
        if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
        return rows.filter(r => r.some(c => c.trim() !== ""));
    }

    function escHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    const jurnalGrid = document.getElementById("jurnal-grid");
    if (jurnalGrid) {
        if (!JURNAL_CSV_URL || JURNAL_CSV_URL.includes("PASTE_LINK_CSV")) {
            jurnalGrid.innerHTML = '<p class="jurnal-empty">Link CSV jurnal belum diisi. Isi variabel JURNAL_CSV_URL di script.js.</p>';
        } else {
            jurnalGrid.innerHTML = `
                <div class="jurnal-loader">
                    <div class="jurnal-card skeleton-card"><div class="card-content"><div class="skeleton-tag"></div><div class="skeleton-title"></div><div class="skeleton-desc"></div><div class="skeleton-desc short"></div></div></div>
                    <div class="jurnal-card skeleton-card"><div class="card-content"><div class="skeleton-tag" style="width:25%"></div><div class="skeleton-title" style="width:55%"></div><div class="skeleton-desc"></div></div></div>
                    <div class="jurnal-card skeleton-card"><div class="card-content"><div class="skeleton-tag" style="width:40%"></div><div class="skeleton-title" style="width:75%"></div><div class="skeleton-desc"></div><div class="skeleton-desc" style="width:85%"></div></div></div>
                </div>`;
            
            fetch(JURNAL_CSV_URL)
                .then(res => {
                    if (!res.ok) throw new Error("Gagal mengambil data jurnal (status " + res.status + ")");
                    return res.text();
                })
                .then(csvText => {
                    const rows = parseCSV(csvText);
                    if (rows.length < 2) {
                        jurnalGrid.innerHTML = '<p class="jurnal-empty">Belum ada data jurnal.</p>';
                        return;
                    }

                    const headers = rows[0].map(h => h.trim().toLowerCase());
                    const idx = {
                        minggu: headers.findIndex(h => h.includes("minggu") || h === "1" || h.includes("no")),
                        tanggal: headers.findIndex(h => h.includes("tanggal") || h.includes("tgl")),
                        judul: headers.findIndex(h => h.includes("judul") || h.includes("kegiatan")),
                        desc: headers.findIndex(h => h.includes("desk") || h.includes("uraian") || h.includes("catatan") || h.includes("keterangan"))
                    };

                    const entries = [];
                    for (let i = 1; i < rows.length; i++) {
                        const r = rows[i];
                        if (!r || r.every(c => !String(c).trim())) continue;

                        const minggu = idx.minggu > -1 ? String(r[idx.minggu] || "").trim() : "";
                        const tanggal = idx.tanggal > -1 ? String(r[idx.tanggal] || "").trim() : "";
                        const judul = idx.judul > -1 ? String(r[idx.judul] || "").trim() : "";
                        const desc = idx.desc > -1 ? String(r[idx.desc] || "").trim() : "";

                        if (!judul && !desc) continue;
                        entries.push({ minggu, tanggal, judul, desc });
                    }

                    const jurnalIndexEl = document.getElementById("jurnal-index");

                    if (!entries.length) {
                        jurnalGrid.innerHTML = '<p class="jurnal-empty">Belum ada data jurnal.</p>';
                        if (jurnalIndexEl) jurnalIndexEl.innerHTML = '';
                        return;
                    }

                    if (jurnalIndexEl) {
                        const first = entries[0].tanggal;
                        const last = entries[entries.length - 1].tanggal;
                        const range = (first && last && first !== last) ? `${escHtml(first)} &ndash; ${escHtml(last)}` : escHtml(last || first || '');
                        jurnalIndexEl.innerHTML = `
                            <span class="jurnal-index-edition">Catatan Kegiatan &mdash; ${entries.length} Entri Tercatat</span>
                            ${range ? `<span class="jurnal-index-range">${range}</span>` : ''}
                        `;
                    }

                    let html = "";
                    entries.forEach((entry, i) => {
                        const folio = String(i + 1).padStart(2, "0");
                        const isLatest = i === entries.length - 1;
                        const descText = entry.desc;
                        const firstChar = descText.charAt(0);
                        const restText = descText.slice(1);

                        const descHtml = firstChar
                            ? `<span class="jurnal-dropcap">${escHtml(firstChar)}</span>${escHtml(restText)}`
                            : '';

                        html += `<div class="reveal-card jurnal-card jurnal-reveal${isLatest ? ' jurnal-feature' : ''}">`
                            + `<div class="card-content">`
                            + (isLatest ? `<span class="jurnal-feature-label">Latest</span>` : '')
                            + `<div class="jurnal-dateline">`
                            + `<span class="jurnal-folio">No. ${folio}</span>`
                            + (entry.minggu ? `<span class="jurnal-rule" aria-hidden="true"></span><span class="card-tag">${escHtml(entry.minggu)}</span>` : '')
                            + (entry.tanggal ? `<span class="jurnal-rule" aria-hidden="true"></span><span class="jurnal-date">${escHtml(entry.tanggal)}</span>` : '')
                            + `</div>`
                            + `<h3 class="card-title">${escHtml(entry.judul)}</h3>`
                            + `<p class="card-desc">${descHtml}</p>`
                            + `</div></div>`;
                    });

                    jurnalGrid.innerHTML = html;
                    filterAndSearch();
                    initJurnalReveal();
                })
                .catch(err => {
                    console.error("Gagal memuat jurnal:", err);
                    jurnalGrid.innerHTML = '<p class="jurnal-empty">Gagal memuat data jurnal. Cek koneksi internet atau link CSV di script.js.</p>';
                });
        }
    }

    // 7b. Reveal kartu jurnal saat discroll
    function initJurnalReveal() {
        const cards = document.querySelectorAll('.jurnal-reveal');
        if (!cards.length) return;

        if (!('IntersectionObserver' in window)) {
            cards.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const jurnalObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    jurnalObs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

        cards.forEach(el => jurnalObs.observe(el));
    }

    // 8. Search & filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    let currentFilter = 'all';

    function filterAndSearch() {
        const reveals = document.querySelectorAll(".reveal-card");
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        reveals.forEach(card => {
            const tagEl = card.querySelector('.card-tag');
            const titleEl = card.querySelector('.card-title');
            const descEl = card.querySelector('.card-desc');

            const tag = tagEl ? tagEl.innerText.trim() : '';
            const title = titleEl ? titleEl.innerText.toLowerCase() : '';
            const desc = descEl ? descEl.innerText.toLowerCase() : '';

            const matchesFilter = (currentFilter === 'all') || (tag === currentFilter);
            const matchesSearch = title.includes(query) || desc.includes(query) || tag.toLowerCase().includes(query);

            card.classList.toggle('is-hidden', !(matchesFilter && matchesSearch));
        });
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                filterAndSearch();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterAndSearch);
    }

    // 9. Reveal Tujuan & Manfaat
    const purposeBlocks = document.querySelectorAll('.reveal-purpose');
    if (purposeBlocks.length) {
        if ('IntersectionObserver' in window) {
            const purposeObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        purposeObs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -40px 0px', threshold: 0.15 });

            purposeBlocks.forEach(el => purposeObs.observe(el));
        } else {
            purposeBlocks.forEach(el => el.classList.add('is-visible'));
        }
    }

    // 10. Toggle detail expand/collapse
    document.querySelectorAll('.purpose-detail').forEach(btn => {
        btn.addEventListener('click', function () {
            const block = this.closest('.purpose-block');
            if (!block) return;

            const willOpen = !block.classList.contains('is-open');

            document.querySelectorAll('.purpose-block.is-open').forEach(b => {
                if (b !== block) {
                    b.classList.remove('is-open');
                    const otherBtn = b.querySelector('.purpose-detail');
                    if (otherBtn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        const t = otherBtn.querySelector('.purpose-detail-text');
                        if (t) t.textContent = 'Detail';
                    }
                }
            });

            block.classList.toggle('is-open', willOpen);
            this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            const textEl = this.querySelector('.purpose-detail-text');
            if (textEl) textEl.textContent = willOpen ? 'Tutup' : 'Detail';
        });
    });

    // 11. Transisi fade antar halaman
    (function initPageTransition() {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const body = document.body;
        if (!body) return;

        const fromNav = sessionStorage.getItem('pageFade') === '1';
        if (fromNav) {
            sessionStorage.removeItem('pageFade');
            if (!reduceMotion) {
                document.documentElement.classList.add('from-transition');
                void body.offsetWidth;
                requestAnimationFrame(() => {
                    body.classList.add('page-enter-active');
                    const clean = () => {
                        document.documentElement.classList.remove('from-transition');
                        body.classList.remove('page-enter-active');
                        body.removeEventListener('transitionend', onEnd);
                    };
                    const onEnd = (e) => {
                        if (e.propertyName === 'opacity') clean();
                    };
                    body.addEventListener('transitionend', onEnd);
                    setTimeout(clean, 700);
                });
            }
        }

        document.addEventListener('click', function (e) {
            const a = e.target.closest('a[href]');
            if (!a) return;

            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            if (a.target && a.target !== '' && a.target !== '_self') return;

            const href = a.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return;

            const isInternalPage = /\.html(?:[?#].*)?$/i.test(href) || href === '/' || href === './';
            if (!isInternalPage) return;

            e.preventDefault();
            if (body.classList.contains('page-exit')) return;

            sessionStorage.setItem('pageFade', '1');

            if (reduceMotion) {
                window.location.href = href;
                return;
            }

            body.classList.add('page-exit');

            let navigated = false;
            const go = () => {
                if (navigated) return;
                navigated = true;
                window.location.href = href;
            };

            const onEnd = (ev) => {
                if (ev.propertyName !== 'opacity') return;
                body.removeEventListener('transitionend', onEnd);
                go();
            };
            body.addEventListener('transitionend', onEnd);
            setTimeout(go, 550);
        });
    })();

});