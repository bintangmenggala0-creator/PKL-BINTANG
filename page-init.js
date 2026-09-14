if (sessionStorage.getItem("introShown") === "true") {
    document.documentElement.classList.add("intro-done");
}

if (sessionStorage.getItem("pageFade") === "1") {
    document.documentElement.classList.add("from-transition");
}