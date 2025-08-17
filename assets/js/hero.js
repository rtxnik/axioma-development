document.addEventListener("DOMContentLoaded", function () {
  gsap.from(".hero__images:not(.hero__images--right) .hero__image", {
    duration: 2.5,
    y: 100,
    opacity: 0,
    stagger: 0.4,
    ease: "power2.out"
  });

  gsap.from(".hero__images--right .hero__image", {
    duration: 2.5,
    y: -100,
    opacity: 0,
    stagger: 0.4,
    ease: "power2.out"
  });

  const arrowDown = document.querySelector(".hero__arrow-down");

  if (arrowDown) {
    if (window.innerWidth <= 576) {
      gsap.to(arrowDown, {
        duration: 1.5,
        opacity: 1,
        y: 0,
        delay: 2.5,
        ease: "power2.out",
        onStart: () => {
          arrowDown.style.pointerEvents = "none";
        },
        onComplete: () => {
          arrowDown.style.pointerEvents = "auto";
        }
      });
    }

    const scrollToNextSection = () => {
      const heroSection = document.querySelector(".hero");
      const allSections = document.querySelectorAll("section");
      let nextSection = null;

      allSections.forEach((section, index) => {
        if (section === heroSection && index + 1 < allSections.length) {
          nextSection = allSections[index + 1];
        }
      });

      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    };

    arrowDown.addEventListener("click", scrollToNextSection);

    arrowDown.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToNextSection();
      }
    });
  }
});
