// Link CSV publish dari Google Sheets jurnal kamu (File > Share > Publish to web > CSV).
const JURNAL_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR92Cjb0EKmxAv7-FeQIhj9V43EwxxDPLtsNsMHSN_ipaYJgtIPtArz_BSEtHxSP7Y37Lruaab_vuN2/pub?output=csv";

document.addEventListener("DOMContentLoaded", function () {
    // 1. Audio Elements & Cross-Page Persistence
    const bgMusic = document.getElementById("bg-music");
    const audioToggle = document.getElementById("audio-toggle");
    const audioText = document.getElementById("audio-text");
    const audioSelect = document.getElementById("audio-select");
    const introScreen = document.getElementById("intro-screen");
    const btnEnter = document.getElementById("btn-enter");

    if (bgMusic && audioToggle) {
        bgMusic.volume = 0.4;

        // Daftar semua lagu untuk fitur lanjut otomatis ke lagu berikutnya
        const trackList = ["bg-music.mp3", "bg-music-2.mp3", "bg-music-3.mp3"];

        function switchTrack(trackFile, autoplay) {
            const sourceEl = bgMusic.querySelector("source");
            sourceEl.setAttribute("src", trackFile);
            bgMusic.load();
            if (audioSelect) audioSelect.value = trackFile;
            sessionStorage.setItem("audioTrack", trackFile);
            sessionStorage.setItem("audioTime", "0");

            if (autoplay) {
                bgMusic.play().then(() => {
                    audioToggle.classList.add("music-playing");
                    if (audioText) audioText.textContent = "Audio: On";
                    sessionStorage.setItem("audioPlaying", "true");
                }).catch(err => console.log("Audio play blocked:", err));
            }
        }

        // Cek lagu yang dipilih terakhir (tetap sama saat pindah halaman)
        const savedTrack = sessionStorage.getItem("audioTrack");
        if (savedTrack) {
            const sourceEl = bgMusic.querySelector("source");
            if (sourceEl && sourceEl.getAttribute("src") !== savedTrack) {
                sourceEl.setAttribute("src", savedTrack);
                bgMusic.load();
            }
            if (audioSelect) audioSelect.value = savedTrack;
        }

        // Cek status audio dari halaman sebelumnya
        const isAudioPlaying = sessionStorage.getItem("audioPlaying") === "true";
        const savedTime = parseFloat(sessionStorage.getItem("audioTime") || "0");

        if (isAudioPlaying) {
            bgMusic.currentTime = savedTime;
            bgMusic.play().then(() => {
                audioToggle.classList.add("music-playing");
                if (audioText) audioText.textContent = "Audio: On";
            }).catch(err => console.log("Autoplay blocked:", err));
        }

        // Simpan posisi detik musik sebelum pindah/close halaman
        window.addEventListener("beforeunload", () => {
            if (!bgMusic.paused) {
                sessionStorage.setItem("audioPlaying", "true");
                sessionStorage.setItem("audioTime", bgMusic.currentTime);
            } else {
                sessionStorage.setItem("audioPlaying", "false");
            }
        });

        // Lagu otomatis lanjut ke lagu berikutnya setelah selesai (ulang dari awal daftar jika sudah lagu terakhir)
        bgMusic.addEventListener("ended", function () {
            const currentSrc = bgMusic.querySelector("source").getAttribute("src");
            const currentIndex = trackList.indexOf(currentSrc);
            const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % trackList.length;
            switchTrack(trackList[nextIndex], true);
        });

        // Tombol Ganti Lagu (Select Audio)
        if (audioSelect) {
            audioSelect.addEventListener("change", function () {
                const wasPlaying = !bgMusic.paused;
                switchTrack(this.value, wasPlaying);
            });
        }

        // Tombol Intro di Halaman Utama
        if (btnEnter && introScreen) {
            btnEnter.addEventListener("click", function () {
                introScreen.classList.add("fade-out");
                sessionStorage.setItem("introShown", "true");
                bgMusic.currentTime = 73.7;

                bgMusic.play().then(() => {
                    sessionStorage.setItem("audioPlaying", "true");
                    audioToggle.classList.add("music-playing");
                    if (audioText) audioText.textContent = "Audio: On";
                }).catch(err => console.log("Audio play blocked:", err));
            });
        }

        // Tombol Toggle On/Off Audio
        audioToggle.addEventListener("click", function () {
            if (!bgMusic.paused) {
                bgMusic.pause();
                sessionStorage.setItem("audioPlaying", "false");
                audioToggle.classList.remove("music-playing");
                if (audioText) audioText.textContent = "Audio: Off";
            } else {
                bgMusic.play();
                sessionStorage.setItem("audioPlaying", "true");
                audioToggle.classList.add("music-playing");
                if (audioText) audioText.textContent = "Audio: On";
            }
        });
    }

    // 2. Helper untuk Poster Video Cloudinary (Mengatasi Video Hitam)
    function getVideoPoster(videoUrl) {
        if (videoUrl.includes("cloudinary.com")) {
            // PENTING: buang dulu fragment (#t=0.1) & query sebelum ganti ekstensi,
            // kalau tidak, regex ekstensi akan salah tangkap ".1" dari "#t=0.1"
            // dan menghasilkan URL poster yang rusak (itu sebabnya video hitam saat load).
            const cleanUrl = videoUrl.split("#")[0].split("?")[0];
            // Ubah ekstensi .mp4 menjadi .jpg & ambil detik ke-1 sebagai thumbnail
            return cleanUrl.replace(/\.[^/.]+$/, ".jpg").replace("/upload/", "/upload/so_1.0,f_auto,q_auto/");
        }
        return "";
    }

    // 3. Render Galeri Dinamis dari data-album.js (dipakai di index.html & album.html)
    function renderGallery(container, items) {
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card reveal-card';

            if (item.type === 'video') {
                const posterUrl = getVideoPoster(item.src);
                card.innerHTML = `
                    <div class="video-container">
                        <video muted playsinline preload="metadata" poster="${posterUrl}">
                            <source src="${item.src}#t=0.5" type="video/mp4">
                        </video>
                        <div class="custom-play-btn"><div class="play-icon"></div></div>
                    </div>
                    <div class="card-content">
                        <span class="card-tag">${item.category}</span>
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-desc">${item.desc}</p>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="img-container">
                        <img src="${item.src}" alt="${item.title}" loading="lazy">
                    </div>
                    <div class="card-content">
                        <span class="card-tag">${item.category}</span>
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-desc">${item.desc}</p>
                    </div>
                `;
            }
            container.appendChild(card);
        });
    }

    // Album lengkap (album.html)
    const albumGrid = document.getElementById("album-grid");
    if (albumGrid && typeof albumData !== 'undefined') {
        renderGallery(albumGrid, albumData);
    }

    // Galeri highlight di halaman utama (index.html) — cuma tampilkan item pilihan
    const homeGrid = document.getElementById("gallery-grid");
    if (homeGrid && typeof homeGalleryData !== 'undefined') {
        renderGallery(homeGrid, homeGalleryData);
    }

    // 4. Poster Video untuk Video Statis (di index.html)
    document.querySelectorAll('.video-container video').forEach(video => {
        const source = video.querySelector('source');
        if (source && source.src && !video.hasAttribute('poster')) {
            const poster = getVideoPoster(source.src);
            if (poster) video.setAttribute('poster', poster);
        }
    });

    // 5. Video Play/Pause Logic
    const initVideoLogic = () => {
        const videoContainers = document.querySelectorAll('.video-container');
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            if (!video) return;

            container.addEventListener('click', function () {
                if (video.paused) {
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

    // 6. Lightbox Logic
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-title");
    const lightboxDesc = document.getElementById("lightbox-desc");
    const lightboxClose = document.getElementById("lightbox-close");

    const initLightbox = () => {
        document.querySelectorAll(".img-container").forEach(container => {
            container.addEventListener("click", function () {
                const img = this.querySelector("img");
                const content = this.nextElementSibling;
                if (!lightbox || !img) return;

                lightboxImg.src = img.src;
                lightboxTitle.innerText = content ? content.querySelector(".card-title").innerText : '';
                lightboxDesc.innerText = content ? content.querySelector(".card-desc").innerText : '';
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

    // 7. Jurnal Dinamis dari Google Sheets (khusus jurnal.html)
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

    const jurnalGrid = document.getElementById("jurnal-grid");
    if (jurnalGrid) {
        if (!JURNAL_CSV_URL || JURNAL_CSV_URL.includes("PASTE_LINK_CSV")) {
            jurnalGrid.innerHTML = '<p class="jurnal-empty">Link CSV jurnal belum diisi. Isi variabel JURNAL_CSV_URL di script.js.</p>';
        } else {
            jurnalGrid.innerHTML = '<p class="jurnal-empty">Memuat jurnal...</p>';
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
                        minggu: headers.findIndex(h => h.includes("minggu")),
                        tanggal: headers.findIndex(h => h.includes("tanggal")),
                        judul: headers.findIndex(h => h.includes("judul") || h.includes("kegiatan")),
                        desc: headers.findIndex(h => h.includes("desk") || h.includes("uraian") || h.includes("catatan") || h.includes("keterangan"))
                    };

                    jurnalGrid.innerHTML = "";
                    for (let i = 1; i < rows.length; i++) {
                        const r = rows[i];
                        if (!r || r.every(c => !c.trim())) continue;

                        const minggu = idx.minggu > -1 ? (r[idx.minggu] || "").trim() : "";
                        const tanggal = idx.tanggal > -1 ? (r[idx.tanggal] || "").trim() : "";
                        const judul = idx.judul > -1 ? (r[idx.judul] || "").trim() : "";
                        const desc = idx.desc > -1 ? (r[idx.desc] || "").trim() : "";

                        if (!judul && !desc) continue;

                        const tag = [minggu, tanggal].filter(Boolean).join(" • ");

                        const card = document.createElement("div");
                        card.className = "card reveal-card jurnal-card";
                        card.innerHTML = `
                            <div class="card-content">
                                <span class="card-tag">${tag}</span>
                                <h3 class="card-title">${judul}</h3>
                                <p class="card-desc">${desc}</p>
                            </div>
                        `;
                        jurnalGrid.appendChild(card);
                    }

                    filterAndSearch();
                })
                .catch(err => {
                    console.error("Gagal memuat jurnal:", err);
                    jurnalGrid.innerHTML = '<p class="jurnal-empty">Gagal memuat data jurnal. Cek koneksi internet atau link CSV di script.js.</p>';
                });
        }
    }

    // 8. Search & Filter
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
});