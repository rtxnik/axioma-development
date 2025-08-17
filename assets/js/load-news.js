document.addEventListener("DOMContentLoaded", function () {
  fetch("/src/news/news.html")
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const newsItems = doc.querySelectorAll(".news-section__item");
      const newsArray = Array.from(newsItems);
      const latestNews = newsArray.slice(-5);
      const swiperWrapper = document.querySelector(".swiper-wrapper");

      latestNews.forEach((newsItem) => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.innerHTML = newsItem.innerHTML;
        swiperWrapper.appendChild(slide);
      });

      const swiper = new Swiper(".swiper-container", {
        loop: true,
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 30,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        breakpoints: {
          1024: {
            slidesPerView: 3,
            spaceBetween: 30
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching the news:", error);
    });
});
