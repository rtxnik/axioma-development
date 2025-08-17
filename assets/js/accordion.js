// document.addEventListener("DOMContentLoaded", () => {
//   const vacanciesItems = document.querySelectorAll(".vacancies__item");

//   vacanciesItems.forEach((item) => {
//     item.addEventListener("click", () => {
//       item.classList.toggle("vacancies__item--active");
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq__item");

  faqItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("faq__item--active");
    });
  });
});
