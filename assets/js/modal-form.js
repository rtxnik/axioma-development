document.addEventListener("DOMContentLoaded", () => {
  const openModalButtons = document.querySelectorAll(".open-modal-button");
  const closeModalButton = document.getElementById("close-modal");
  const contactModal = document.getElementById("contact-modal");
  const overlay = contactModal.querySelector(".contact-modal__overlay") || contactModal; // В случае отсутствия overlay

  // Функция открытия модального окна
  const openModal = () => {
    contactModal.style.display = "block";
    contactModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Отключаем прокрутку страницы
    // Фокус на первом поле формы
    document.getElementById("modal-name").focus();
  };

  // Функция закрытия модального окна
  const closeModal = () => {
    contactModal.style.display = "none";
    contactModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto"; // Включаем прокрутку страницы
  };

  // Добавляем обработчики событий ко всем кнопкам открытия модального окна
  openModalButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  // Обработчики событий для закрытия модального окна
  closeModalButton.addEventListener("click", closeModal);

  // Закрытие при клике на оверлей (если он есть)
  if (contactModal.querySelector(".contact-modal__overlay")) {
    contactModal.querySelector(".contact-modal__overlay").addEventListener("click", closeModal);
  }

  // Закрытие по нажатию клавиши Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && contactModal.style.display === "block") {
      closeModal();
    }
  });
});
