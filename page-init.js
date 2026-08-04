// page-init.js
// Dijalankan sinkron di <head> (SEBELUM CSS/DOM selesai dimuat & sebelum paint pertama),
// supaya class ini sudah terpasang lebih dulu di <html> tanpa ada kedipan layar
// (flash) saat pindah halaman atau saat intro sudah pernah ditampilkan.
// Karena itu file ini SENGAJA dimuat tanpa atribut "defer"/"async".

if (sessionStorage.getItem("introShown") === "true") {
    document.documentElement.classList.add("intro-done");
}

if (sessionStorage.getItem("pageFade") === "1") {
    document.documentElement.classList.add("from-transition");
}
