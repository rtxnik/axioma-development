document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(
    ".contact-images__large, .contact-images__small, .company__image, .company__title"
  );
  const dividers = document.querySelectorAll(
    ".about__dividers, .license__dividers, .company__header::after"
  );
  const subtitles = document.querySelectorAll(
    ".about__subtitle, .license__title, .about__description, .license__description, .company__subheading, .company__description"
  );

  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  images.forEach((item) => observer.observe(item));
  dividers.forEach((item) => observer.observe(item));
  subtitles.forEach((item) => observer.observe(item));

  const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });
  tl.from(".about-left-flex img", { x: -100, opacity: 0 })
    .from(".about-left-flex .about-text", { x: 50, opacity: 0 }, "-=0.5")
    .from(".about-right-flex img", { x: 100, opacity: 0 }, "-=0.3")
    .from(".about-right-flex .text-block", { x: -50, opacity: 0 }, "-=0.5");
});
