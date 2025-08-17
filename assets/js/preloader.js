window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  preloader.classList.add("hidden");

  preloader.addEventListener("transitionend", () => {
    preloader.remove();
  });
});
