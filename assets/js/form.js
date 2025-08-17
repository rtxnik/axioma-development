// Глобальные переменные для функций
var showModal;
var hideModal;

document.addEventListener("DOMContentLoaded", function () {
  // ===== 1) Получение CSRF-токена
  function getCsrfToken(callback) {
    fetch("/assets/php/csrf_token.php", {
      method: "GET",
      headers: { "X-Requested-With": "XMLHttpRequest" },
      credentials: "same-origin"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при получении CSRF токена");
        return res.text();
      })
      .then((token) => callback(token))
      .catch((err) => {
        console.error("Ошибка CSRF:", err);
      });
  }

  // ===== 2) Модальное окно для результата
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  const modalIcon = document.getElementById("modal-icon");
  const modalClose = modal ? modal.querySelector(".modal__close") : null;

  // Определяем глобальную функцию hideModal
  hideModal = function () {
    const modalElement = document.getElementById("modal");
    if (!modalElement) return;
    modalElement.style.display = "none";
    modalElement.setAttribute("aria-hidden", "true");
  };

  // Определяем глобальную функцию showModal
  showModal = function (message, isSuccess = true) {
    const modalElement = document.getElementById("modal");
    const modalMessageElement = document.getElementById("modal-message");
    const modalIconElement = document.getElementById("modal-icon");

    if (!modalElement || !modalMessageElement) {
      console.error("Модальное окно не найдено на странице!");
      return;
    }

    modalMessageElement.textContent = message;

    if (modalIconElement) {
      const iconUrl = isSuccess
        ? "/assets/img/icons/success-icon.svg"
        : "/assets/img/icons/error-icon.svg";

      modalIconElement.src = iconUrl;
      modalIconElement.style.display = "block";
      modalIconElement.alt = isSuccess ? "Успех" : "Ошибка";
    }

    modalElement.style.display = "flex";
    modalElement.setAttribute("aria-hidden", "false");

    if (isSuccess) {
      setTimeout(hideModal, 5000);
    }
  };

  if (modalClose) {
    modalClose.addEventListener("click", hideModal);
  }

  window.addEventListener("click", (e) => {
    if (modal && e.target === modal) {
      hideModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
      hideModal();
    }
  });

  // ===== 3) Функция для отправки формы AJAX'ом
  function handleFormSubmit(form, csrfToken) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // Disable submit button to prevent multiple submissions
      const submitButton = form.querySelector('button[type="submit"]');
      let originalText = "";
      if (submitButton) {
        submitButton.disabled = true;
        originalText = submitButton.innerHTML;
        submitButton.innerHTML = "<span>Отправка...</span>";
      }

      const formData = new FormData(form);

      // Если нет csrf_token, допишем
      if (!formData.has("csrf_token")) {
        formData.append("csrf_token", csrfToken);
      }

      fetch("/assets/php/send.php", {
        method: "POST",
        body: formData,
        headers: { "X-Requested-With": "XMLHttpRequest" }
      })
        .then((response) => {
          if (!response.ok) throw new Error("Ошибка при отправке");
          return response.text();
        })
        .then((data) => {
          console.log("Ответ от сервера:", data);
          if (data.includes("Сообщение отправлено успешно")) {
            // Показываем модалку с успехом
            showModal(
              "Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.",
              true
            );
            // Сброс формы
            form.reset();

            // Если есть файл (Форма 2/3), сбрасываем кнопки
            const fileInput = form.querySelector('input[type="file"]');
            const fileText = form.querySelector(".contact-form-big__file-text");
            const fileRemoveButton = form.querySelector(".contact-form-big__file-remove");
            if (fileInput && fileText && fileRemoveButton) {
              fileText.textContent = "Прикрепить файл";
              fileRemoveButton.style.display = "none";
            }
          } else {
            showModal("Ошибка при отправке: " + data, false);
          }
        })
        .catch((error) => {
          console.error("Ошибка отправки:", error);
          showModal("Ошибка при отправке: " + error.message, false);
        })
        .finally(() => {
          // Re-enable submit button
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
          }
        });
    });
  }

  // ===== 4) ИНИЦИАЛИЗАЦИЯ ФОРМ

  // 4.1) Форма 1 (маленькая), класс .contact-form
  const contactFormSmall = document.querySelector(".contact-form");
  if (contactFormSmall) {
    const csrfInputSmall = contactFormSmall.querySelector('input[name="csrf_token"]');
    if (csrfInputSmall && csrfInputSmall.value.trim() === "") {
      getCsrfToken((token) => {
        csrfInputSmall.value = token;
        handleFormSubmit(contactFormSmall, token);
      });
    } else {
      const existingToken = csrfInputSmall ? csrfInputSmall.value : "";
      handleFormSubmit(contactFormSmall, existingToken);
    }
  }

  // 4.2) Форма 2 (большая), если есть
  const contactFormBig = document.querySelector(".contact-form-big:not(.contact-form-big--modal)");
  if (contactFormBig) {
    const csrfInputBig = contactFormBig.querySelector('input[name="csrf_token"]');
    if (csrfInputBig && csrfInputBig.value.trim() === "") {
      getCsrfToken((token) => {
        csrfInputBig.value = token;
        handleFormSubmit(contactFormBig, token);
      });
    } else {
      const existingToken = csrfInputBig ? csrfInputBig.value : "";
      handleFormSubmit(contactFormBig, existingToken);
    }
  }

  // 4.3) Формы 3 (большие, но модальные)
  const modalForms = document.querySelectorAll(".contact-form-big--modal");
  if (modalForms.length > 0) {
    getCsrfToken((token) => {
      modalForms.forEach((form) => {
        const csrfInput = form.querySelector('input[name="csrf_token"]');
        if (csrfInput && csrfInput.value.trim() === "") {
          csrfInput.value = token;
        }
        handleFormSubmit(form, token);
      });
    });
  }

  // ===== 5) Если нужно обрабатывать поле "Прикрепить файл" (для больших форм)
  function initFileField(form) {
    const fileInput = form.querySelector('input[type="file"]');
    const fileRemoveButton = form.querySelector(".contact-form-big__file-remove");
    const fileText = form.querySelector(".contact-form-big__file-text");
    if (fileInput && fileRemoveButton && fileText) {
      fileRemoveButton.style.display = "none";
      fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
          fileText.textContent = fileInput.files[0].name;
          fileRemoveButton.style.display = "inline-block";
        } else {
          fileText.textContent = "Прикрепить файл";
          fileRemoveButton.style.display = "none";
        }
      });
      fileRemoveButton.addEventListener("click", () => {
        fileInput.value = "";
        fileText.textContent = "Прикрепить файл";
        fileRemoveButton.style.display = "none";
      });
    }
  }

  // Применяем к обычной большой форме
  if (contactFormBig) {
    initFileField(contactFormBig);
  }
  // Применяем к модальным формам
  modalForms.forEach((form) => {
    initFileField(form);
  });
});
