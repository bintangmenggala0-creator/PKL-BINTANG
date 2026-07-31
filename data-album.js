// Data Seluruh Media Galeri/Album PKL Bintang Menggala (Sudah Dikompresi Cloudinary)
const albumData = [
    {
        type: "video",
        category: "Video Dokumentasi",
        title: "Video OLT Marga Pundu",
        desc: "Dokumentasi video proses penanganan perangkat OLT di site Marga Pundu.",
        src: "https://res.cloudinary.com/buklippb/video/upload/v1785398112/Olt_Marga_Pundu_m4j0b8.mp4"
    },
    {
        type: "video",
        category: "Video Dokumentasi",
        title: "Video OLT Metro",
        desc: "Rekaman kegiatan pemeriksaan dan pembersihan OLT Metro.",
        src: "https://res.cloudinary.com/buklippb/video/upload/v1785398024/oltmetro_itchna.mp4"
    },
    {
        type: "video",
        category: "Video Dokumentasi",
        title: "Perjalanan Margapundu",
        desc: "Dokumentasi perjalanan menuju lokasi site Marga Pundu dalam rangka penanganan dan maintenance jaringan.",
        src: "https://res.cloudinary.com/buklippb/video/upload/v1785397874/VID20260708121842_ls4sls.mp4"
    },
    {
        type: "video",
        category: "Video Dokumentasi",
        title: "Perjalanan Metro",
        desc: "Dokumentasi perjalanan menuju wilayah Metro untuk pemeliharaan jaringan.",
        src: "https://res.cloudinary.com/buklippb/video/upload/v1785399933/VID20260714110611_ph6nmx.mp4"
    },
    {
        type: "image",
        category: "Infrastruktur",
        title: "OLT Margapundu",
        desc: "Pemeriksaan dan maintenance perangkat Optical Line Terminal di site Margapundu untuk memastikan kestabilan koneksi serat optik.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399468/Foto1oltmargapundu_vfq7pv.jpg"
    },
    {
        type: "image",
        category: "Infrastruktur",
        title: "OLT Metro",
        desc: "Pemeriksaan dan pemeliharaan perangkat OLT di site metro.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399467/Foto2oltmetro_j9qgdm.jpg"
    },
    {
        type: "image",
        category: "Jaringan Lapangan",
        title: "FAT Rajabasa",
        desc: "Pengecekan serta penataan Optical Distribution Point atau Fiber Access Terminal (FAT) di wilayah Rajabasa.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399470/Foto3fatrajabasa_bijyoj.jpg"
    },
    {
        type: "image",
        category: "Jaringan Lapangan",
        title: "FAT Jagabaya II",
        desc: "Pemeriksaan kondisi FAT dan pengukuran redaman kabel di area Jagabaya II.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399397/TimePhoto_20260728_114254_1_w7qnxh.jpg"
    },
    {
        type: "image",
        category: "Jaringan Lapangan",
        title: "Rumija Jatiagung",
        desc: "Survei dan peninjauan Ruang Milik Jalan (Rumija) di wilayah Jatiagung untuk pendataan.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785479756/TimePhoto_20260731_095847_1_rob9yk.jpg"
    },
    {
        type: "image",
        category: "Jaringan Lapangan",
        title: "Pengukuran Rumija Jatiagung 1",
        desc: "Proses pengukuran jalur Rumija di Jatiagung guna pendataan.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785479731/TimePhoto_20260731_100059_1_pczkvr.jpg"
    },
    {
        type: "image",
        category: "Jaringan Lapangan",
        title: "Pengukuran Rumija Jatiagung 2",
        desc: "Dokumentasi lanjutan pengukuran jarak dan titik tiang pada area Rumija Jatiagung.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785479714/TimePhoto_20260731_095947_1_cqvot4.jpg"
    },
    {
        type: "image",
        category: "Kegiatan Lapangan",
        title: "Canvasing Part 1",
        desc: "Kegiatan canvasing dan sosialisasi produk Icon plus.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399466/canvasing1_g6c6fq.jpg"
    },
    {
        type: "image",
        category: "Kegiatan Lapangan",
        title: "Canvasing Part 2",
        desc: "Kegiatan canvasing di area yang telah di tentukan.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399467/canvasing2_ultyew.jpg"
    },
    {
        type: "image",
        category: "Kegiatan Lapangan",
        title: "Canvasing Part 3",
        desc: "Salah satu lokasi FAT yang menjadi tempat canvasing.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399468/canvasing3_y5h9iy.jpg"
    },
    {
        type: "image",
        category: "Kegiatan Lapangan",
        title: "Canvasing Part 4",
        desc: "Canvasing di area antasari-kedamaian.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785399468/canvasing4_ckvoy9.jpg"
    }
];

// Data khusus untuk galeri highlight di halaman utama (index.html) — cuma 3 aset pilihan
const homeGalleryData = [
    {
        type: "video",
        category: "Video Dokumentasi",
        title: "Video OLT Marga Pundu",
        desc: "Dokumentasi video proses penanganan perangkat OLT di site Marga Pundu.",
        src: "https://res.cloudinary.com/buklippb/video/upload/v1785398112/Olt_Marga_Pundu_m4j0b8.mp4"
    },
    {
        type: "video",
        category: "Video Dokumentasi",
        title: "Video OLT Metro",
        desc: "Rekaman kegiatan pemeriksaan dan pembersihan OLT Metro.",
        src: "https://res.cloudinary.com/buklippb/video/upload/v1785398024/oltmetro_itchna.mp4"
    },
    {
        type: "image",
        category: "Jaringan Lapangan",
        title: "Rumija Jatiagung",
        desc: "Survei dan peninjauan Ruang Milik Jalan (Rumija) di wilayah Jatiagung untuk jalur kabel fiber optik.",
        src: "https://res.cloudinary.com/buklippb/image/upload/f_auto,q_auto/v1785479756/TimePhoto_20260731_095847_1_rob9yk.jpg"
    }
];