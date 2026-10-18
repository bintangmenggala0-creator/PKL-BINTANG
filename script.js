const JURNAL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR92Cjb0EKmxAv7-FeQIhj9V43EwxxDPLtsNsMHSN_ipaYJgtIPtArz_BSEtHxSP7Y37Lruaab_vuN2/pub?output=csv";

function escHtml(str) {
    return String(str == null ? "" : str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
function escAttr(str) {
    return escHtml(str).replace(/`/g, "&#96;");
}
function safeMediaUrl(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    try {
        const parsed = new URL(u, window.location.href);
        if (parsed.protocol !== "https:") return "";
        const host = parsed.hostname.toLowerCase();
        if (host === "res.cloudinary.com" || host.endsWith(".cloudinary.com")) return parsed.href;
        return "";
    } catch (e) {
        return "";
    }
}
function isSafeInternalHref(href) {
    if (!href || href.startsWith("#")) return true;
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    try {
        const u = new URL(href, window.location.href);
        return u.origin === window.location.origin && !href.trim().toLowerCase().startsWith("javascript:");
    } catch (e) {
        return false;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    function getVideoPoster(videoUrl) {
        const safe = safeMediaUrl(videoUrl);
        if (!safe) return "";
        const cleanUrl = safe.split("#")[0].split("?")[0];
        return cleanUrl.replace(/\.[^/.]+$/, ".jpg").replace("/upload/", "/upload/so_1.0,f_auto,q_auto/");
    }
    function renderGallery(container, items) {
        container.textContent = "";
        const fragment = document.createDocumentFragment();
        (items || []).forEach(item => {
            const src = safeMediaUrl(item.src);
            if (!src) return;
            const card = document.createElement("div");
            card.className = "card reveal-card";
            const cat = escHtml(item.category);
            const title = escHtml(item.title);
            const desc = escHtml(item.desc);
            const alt = escAttr(item.title);
            if (item.type === "video") {
                const posterUrl = escAttr(getVideoPoster(src));
                const dataSrc = escAttr(src + "#t=0.5");
                card.innerHTML = "<span class=\"card-tag\">" + cat + "</span><div class=\"video-container\"><video muted playsinline preload=\"none\" poster=\"" + posterUrl + "\" data-src=\"" + dataSrc + "\"></video><div class=\"custom-play-btn\"><div class=\"play-icon\"></div></div></div><div class=\"card-content\"><h3 class=\"card-title\">" + title + "</h3><div class=\"card-desc\"><span>" + desc + "</span></div></div>";
            } else {
                card.innerHTML = "<span class=\"card-tag\">" + cat + "</span><div class=\"img-container\"><img src=\"" + escAttr(src) + "\" alt=\"" + alt + "\" loading=\"lazy\" decoding=\"async\"></div><div class=\"card-content\"><h3 class=\"card-title\">" + title + "</h3><div class=\"card-desc\"><span>" + desc + "</span></div></div>";
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
    document.querySelectorAll('.video-container video').forEach(video => {
        const source = video.querySelector('source');
        const srcForPoster = (source && source.src) || video.dataset.src || '';
        if (srcForPoster && !video.hasAttribute('poster')) {
            const poster = getVideoPoster(srcForPoster);
            if (poster) video.setAttribute('poster', poster);
        }
    });
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
                else if (char === "\r") {  }
                else { field += char; }
            }
        }
        if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
        return rows.filter(r => r.some(c => c.trim() !== ""));
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
            fetch(JURNAL_CSV_URL, { method: "GET", mode: "cors", credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer" })
                .then(res => {
                    if (!res.ok) throw new Error("Gagal mengambil data jurnal (status " + res.status + ")");
                    const len = res.headers.get("content-length");
                    if (len && Number(len) > 500000) throw new Error("CSV terlalu besar");
                    return res.text();
                })
                .then(csvText => {
                    if (typeof csvText !== "string" || csvText.length > 500000) throw new Error("CSV tidak valid");
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
                            <span class="jurnal-index-edition">${entries.length} catatan</span>
                            ${range ? `<span class="jurnal-index-range">${range}</span>` : ''}
                        `;
                    }
                    let html = "";
                    entries.forEach((entry) => {
                        html += `<article class="reveal-card jurnal-card jurnal-reveal">`
                            + `<div class="card-content">`
                            + (entry.tanggal ? `<time class="jurnal-date">${escHtml(entry.tanggal)}</time>` : '')
                            + (entry.minggu ? `<span class="jurnal-week">${escHtml(entry.minggu)}</span>` : '')
                            + `<h3 class="card-title">${escHtml(entry.judul)}</h3>`
                            + (entry.desc ? `<p class="card-desc">${escHtml(entry.desc)}</p>` : '')
                            + `</div></article>`;
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
            if (!isSafeInternalHref(href)) return;
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
