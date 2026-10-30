const backToTopBtn = document.getElementById("backtotop");

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});