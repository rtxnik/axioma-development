document.addEventListener("DOMContentLoaded", () => {
  function handleCardClick(event) {
    const card = event.currentTarget;
    const downloadUrl = card.getAttribute("data-download-url");
    const downloadName = card.getAttribute("data-download-name");

    if (downloadUrl) {
      fetch(downloadUrl, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            const link = document.createElement("a");
            link.href = downloadUrl;
            if (downloadName) {
              link.download = downloadName;
            }
            if (typeof link.download === "string") {
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              window.open(downloadUrl, "_blank");
            }
          } else {
            alert("Документ не найден по указанному пути.");
          }
        })
        .catch(() => {
          alert("Произошла ошибка при попытке загрузить документ.");
        });
    } else {
      alert("Ссылка для скачивания не указана.");
    }
  }

  const documentCards = document.querySelectorAll(".document-card:not(.unified-document-card)");

  documentCards.forEach((card) => {
    card.addEventListener("click", handleCardClick);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCardClick(event);
      }
    });
  });

  const subdocumentCards = document.querySelectorAll(".unified-document-card .subdocument-card");

  subdocumentCards.forEach((subcard) => {
    subcard.addEventListener("click", handleCardClick);
    subcard.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleCardClick(event);
      }
    });
  });
});
