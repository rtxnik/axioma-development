document.addEventListener("DOMContentLoaded", function () {
  // Проверяем наличие Swiper
  if (typeof Swiper === "undefined") {
    console.error("Swiper не найден! Убедитесь, что библиотека подключена.");
    return;
  }

  // Инициализируем слайдер
  var fundsSwiper = new Swiper(".funds-gallery__swiper", {
    slidesPerView: 3, // Показывать 3 слайда
    spaceBetween: 30, // Расстояние между слайдами
    loop: true, // Зацикливание слайдера
    centeredSlides: false,

    // Добавляем навигацию
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },

    // Добавляем пагинацию
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },

    // Адаптивные настройки
    breakpoints: {
      1200: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      992: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      576: {
        slidesPerView: 1,
        spaceBetween: 20
      }
    }
  });

  console.log("Swiper инициализирован:", fundsSwiper);
});
