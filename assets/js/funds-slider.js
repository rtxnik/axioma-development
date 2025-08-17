(function () {
  "use strict";

  let sliderThumbs;
  let sliderContent;

  function updateActiveText(index) {
    const allTexts = document.querySelectorAll(".slider__text");
    allTexts.forEach((text) => {
      text.classList.remove("active");
    });

    if (sliderContent && sliderContent.slides[index]) {
      const activeText = sliderContent.slides[index].querySelector(".slider__text");
      if (activeText) {
        activeText.classList.add("active");
      }
    }
  }

  function syncSliders(fromSwiper, toSwiper) {
    const fromSlide = fromSwiper.slides[fromSwiper.activeIndex];
    if (!fromSlide) return;

    const fundId = fromSlide.getAttribute("data-fund-id");
    if (!fundId) return;

    const toSlides = toSwiper.slides;
    for (let i = 0; i < toSlides.length; i++) {
      if (toSlides[i].getAttribute("data-fund-id") === fundId) {
        if (toSwiper.activeIndex !== i) {
          toSwiper.slideTo(i);
        }
        break;
      }
    }
  }

  function initSliders() {
    if (typeof Swiper === "undefined") {
      console.error("Swiper не загружен! Подключите библиотеку Swiper перед этим скриптом.");
      return;
    }

    const thumbsContainer = document.querySelector(".slider__thumbs .swiper-container");
    const contentContainer = document.querySelector(".slider__content .swiper-container");

    if (!thumbsContainer || !contentContainer) {
      console.error("Не найдены контейнеры слайдера!");
      return;
    }

    sliderThumbs = new Swiper(".slider__thumbs .swiper-container", {
      direction: "vertical",
      slidesPerView: 2,
      spaceBetween: 24,
      slideToClickedSlide: true,
      navigation: {
        nextEl: ".slider__next",
        prevEl: ".slider__prev"
      },
      freeMode: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      breakpoints: {
        0: {
          direction: "horizontal",
          slidesPerView: 2,
          spaceBetween: 12
        },
        768: {
          direction: "vertical",
          slidesPerView: 2,
          spaceBetween: 24
        }
      }
    });

    sliderContent = new Swiper(".slider__content .swiper-container", {
      direction: "vertical",
      slidesPerView: 1,
      spaceBetween: 32,
      mousewheel: true,
      navigation: {
        nextEl: ".slider__next",
        prevEl: ".slider__prev"
      },
      grabCursor: true,
      breakpoints: {
        0: {
          direction: "horizontal"
        },
        768: {
          direction: "vertical"
        }
      }
    });

    sliderThumbs.on("slideChange", function () {
      syncSliders(sliderThumbs, sliderContent);
    });

    sliderContent.on("slideChange", function () {
      syncSliders(sliderContent, sliderThumbs);
      updateActiveText(sliderContent.activeIndex);
    });

    sliderThumbs.on("click", function (swiper) {
      const clickedIndex = swiper.clickedIndex;
      if (
        typeof clickedIndex !== "undefined" &&
        clickedIndex >= 0 &&
        clickedIndex < swiper.slides.length
      ) {
        swiper.slideTo(clickedIndex);

        syncSliders(swiper, sliderContent);
        updateActiveText(clickedIndex);
      }
    });

    sliderContent.on("slideChangeTransitionEnd", function () {
      updateActiveText(sliderContent.activeIndex);
    });

    setTimeout(() => {
      updateActiveText(0);
    }, 100);

    console.log("✅ Слайдер инициализирован успешно");
  }

  function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get("slide");

    if (slideParam !== null) {
      const slideIndex = parseInt(slideParam, 10);
      if (!isNaN(slideIndex) && slideIndex >= 0 && sliderContent) {
        setTimeout(function () {
          if (slideIndex < sliderContent.slides.length) {
            sliderContent.slideTo(slideIndex);
            updateActiveText(slideIndex);
          }
        }, 200);
      }
    }
  }

  function debugSlider() {
    console.group("🔍 Отладка слайдера");

    const thumbSlides = document.querySelectorAll(".slider__thumbs .swiper-slide");
    const contentSlides = document.querySelectorAll(".slider__content .swiper-slide");

    console.log("Слайдов в превью:", thumbSlides.length);
    console.log("Слайдов в контенте:", contentSlides.length);

    if (thumbSlides.length !== contentSlides.length) {
      console.warn("⚠️ Количество слайдов не совпадает!");
    }

    console.log("\n--- Соответствие data-fund-id ---");
    let allMatch = true;
    thumbSlides.forEach(function (slide, index) {
      const thumbId = slide.getAttribute("data-fund-id");
      const contentId = contentSlides[index]
        ? contentSlides[index].getAttribute("data-fund-id")
        : "НЕТ СЛАЙДА";
      const match = thumbId === contentId;
      allMatch = allMatch && match;
      console.log(`${index}: ${match ? "✅" : "❌"} Превью: ${thumbId} | Контент: ${contentId}`);
    });

    if (allMatch && thumbSlides.length === contentSlides.length) {
      console.log("\n✅ Все слайды синхронизированы корректно!");
    }

    const activeText = document.querySelector(".slider__text.active");
    console.log("\nАктивный текст:", activeText ? "✅ Найден" : "❌ НЕ НАЙДЕН!");

    if (activeText) {
      console.log("Стили активного текста:");
      const styles = window.getComputedStyle(activeText);
      console.log("- display:", styles.display);
      console.log("- opacity:", styles.opacity);
      console.log("- visibility:", styles.visibility);
    }

    console.log("\nТекущее состояние:");
    console.log("- Активный превью:", sliderThumbs?.activeIndex ?? "N/A");
    console.log("- Активный контент:", sliderContent?.activeIndex ?? "N/A");

    console.groupEnd();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initSliders();
      handleUrlParams();
    });
  } else {
    initSliders();
    handleUrlParams();
  }

  window.debugFundsSlider = debugSlider;

  window.fundsSliderThumbs = function () {
    return sliderThumbs;
  };
  window.fundsSliderContent = function () {
    return sliderContent;
  };
})();
