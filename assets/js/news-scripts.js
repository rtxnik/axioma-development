document.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 6;
  const newsItems = document.querySelectorAll(".news-section__item");
  const paginationList = document.querySelector(".pagination__list");
  const buttons = document.querySelectorAll(".news-filter__button");
  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  let currentPage = 1;
  let currentYear = "2025";

  function showPage(page) {
    currentPage = page;
    const visibleItems = Array.from(newsItems).filter(
      (item) => item.getAttribute("data-year") === currentYear
    );
    const totalPages = Math.ceil(visibleItems.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    newsItems.forEach((item) => (item.style.display = "none"));
    visibleItems.slice(start, end).forEach((item) => (item.style.display = "flex"));

    document.querySelectorAll(".pagination__item").forEach((item) => {
      item.classList.remove("pagination__item--active");
      const link = item.querySelector(".pagination__link");
      if (link) {
        link.removeAttribute("aria-current");
      }
    });

    const activePageItem = document.querySelector(`.pagination__item[data-page="${page}"]`);
    if (activePageItem) {
      activePageItem.classList.add("pagination__item--active");
      const activeLink = activePageItem.querySelector(".pagination__link");
      if (activeLink) {
        activeLink.setAttribute("aria-current", "page");
      }
    }

    const prevItem = document.querySelector(".pagination__prev");
    const nextItem = document.querySelector(".pagination__next");

    if (page === 1) {
      prevItem.classList.add("pagination__item--disabled");
    } else {
      prevItem.classList.remove("pagination__item--disabled");
    }

    if (page === totalPages) {
      nextItem.classList.add("pagination__item--disabled");
    } else {
      nextItem.classList.remove("pagination__item--disabled");
    }
  }

  function createPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationList.innerHTML = "";

    if (totalPages <= 1) {
      return;
    }

    const prevItem = document.createElement("li");
    prevItem.classList.add("pagination__item", "pagination__prev");
    if (currentPage === 1) {
      prevItem.classList.add("pagination__item--disabled");
    }

    const prevLink = document.createElement("a");
    prevLink.href = "#";
    prevLink.classList.add("pagination__arrow");
    prevLink.setAttribute("aria-label", "Предыдущая страница");

    prevLink.innerHTML = `
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L1 8L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    prevLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        showPage(currentPage - 1);
      }
    });

    prevItem.appendChild(prevLink);
    paginationList.appendChild(prevItem);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.classList.add("pagination__item");
      li.setAttribute("data-page", i);
      if (i === currentPage) {
        li.classList.add("pagination__item--active");
      }

      const a = document.createElement("a");
      a.href = "#";
      a.classList.add("pagination__link");
      a.textContent = i;
      a.setAttribute("data-page", i);

      if (i === currentPage) {
        a.setAttribute("aria-current", "page");
      }

      a.addEventListener("click", (e) => {
        e.preventDefault();
        showPage(i);
      });

      li.appendChild(a);
      paginationList.appendChild(li);
    }

    const nextItem = document.createElement("li");
    nextItem.classList.add("pagination__item", "pagination__next");
    if (currentPage === totalPages) {
      nextItem.classList.add("pagination__item--disabled");
    }

    const nextLink = document.createElement("a");
    nextLink.href = "#";
    nextLink.classList.add("pagination__arrow");
    nextLink.setAttribute("aria-label", "Следующая страница");

    nextLink.innerHTML = `
      <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L9 8L1 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    nextLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        showPage(currentPage + 1);
      }
    });

    nextItem.appendChild(nextLink);
    paginationList.appendChild(nextItem);
  }

  function updatePaginationAndContent(year) {
    currentYear = year;
    breadcrumbCurrent.textContent = year;
    const visibleItems = Array.from(newsItems).filter(
      (item) => item.getAttribute("data-year") === year
    );
    currentPage = 1;
    createPagination(visibleItems.length);
    showPage(1);
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const year = button.getAttribute("data-year");
      updatePaginationAndContent(year);
    });
  });

  updatePaginationAndContent(currentYear);
});
