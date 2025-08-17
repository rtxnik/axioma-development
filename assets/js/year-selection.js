document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("yearFilterButton");
  const filterDropdown = document.getElementById("yearFilterDropdown");
  const filterItems = document.querySelectorAll(".year-filter__item");
  const documentCards = document.querySelectorAll(".document-card");
  const filterText = filterButton.querySelector(".year-filter__text");

  filterButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Предотвращаем всплытие события
    const isVisible = filterDropdown.classList.contains("show");
    if (isVisible) {
      filterDropdown.classList.remove("show");
      filterButton.classList.remove("open");
      filterButton.setAttribute("aria-expanded", "false");
    } else {
      filterDropdown.classList.add("show");
      filterButton.classList.add("open");
      filterButton.setAttribute("aria-expanded", "true");
    }
  });

  window.addEventListener("click", function (event) {
    if (!filterButton.contains(event.target) && !filterDropdown.contains(event.target)) {
      if (filterDropdown.classList.contains("show")) {
        filterDropdown.classList.remove("show");
        filterButton.classList.remove("open");
        filterButton.setAttribute("aria-expanded", "false");
      }
    }
  });

  filterItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const selectedYear = this.getAttribute("data-year");
      filterText.textContent = selectedYear === "all" ? "Все года" : selectedYear;
      filterDropdown.classList.remove("show");
      filterButton.classList.remove("open");
      filterButton.setAttribute("aria-expanded", "false");

      // Фильтрация документов
      documentCards.forEach(function (card) {
        if (selectedYear === "all") {
          card.style.display = "block";
        } else {
          const cardYear = card.getAttribute("data-year");
          if (cardYear === selectedYear) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        }
      });
    });
  });

  // Закрытие дропдауна при нажатии клавиши Escape
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (filterDropdown.classList.contains("show")) {
        filterDropdown.classList.remove("show");
        filterButton.classList.remove("open");
        filterButton.setAttribute("aria-expanded", "false");
      }
    }
  });
});
