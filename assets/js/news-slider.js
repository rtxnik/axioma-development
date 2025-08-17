document.addEventListener("DOMContentLoaded", function () {
  const newsContainer = document.querySelector(".latest-news__slider");

  function loadLatestNews() {
    fetch("news.html")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");

        const newsItems = doc.querySelectorAll(".news-section__item");
        const latestNews = Array.from(newsItems).slice(-6);

        latestNews.forEach((newsItem) => {
          newsContainer.appendChild(newsItem.cloneNode(true));
        });
      })
      .catch((error) => {
        console.error("Error loading news:", error);
      });
  }

  loadLatestNews();
});
