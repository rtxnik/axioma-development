// JavaScript для кнопки лицензии
// Добавьте этот код в ваш основной JS файл или в отдельный тег <script>

// Инициализация кнопки лицензии
document.addEventListener("DOMContentLoaded", function () {
	const licenseButton = document.querySelector(".footer-light__license-badge")

	if (licenseButton) {
		// Обработчик клика - открываем модальное окно
		licenseButton.addEventListener("click", function (e) {
			e.preventDefault()
			showLicenseModal()
		})
	}
})

// Функция для показа модального окна
function showLicenseModal() {
	// Создаем модальное окно
	const modal = document.createElement("div")
	modal.className = "license-modal"
	modal.innerHTML = `
    <div class="license-modal__backdrop"></div>
    <div class="license-modal__content">
      <button class="license-modal__close" aria-label="Закрыть">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="license-modal__header">
        <div class="license-modal__seal">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="var(--color-blue)" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="6" stroke="var(--color-blue)" stroke-width="1" stroke-dasharray="2 1"/>
            <path d="M12 2L12.7 4.3L15 3.5L14.5 5.8L17 6L15.8 8L18 9.5L15.5 10.5L17 12.5L14.5 13L15 15.5L12.7 14.7L12 17L11.3 14.7L9 15.5L9.5 13L7 12.5L8.5 10.5L6 9.5L8.2 8L7 6L9.5 5.8L9 3.5L11.3 4.3L12 2Z" fill="var(--color-blue)" opacity="0.1"/>
            <path d="M10 11.5L11 12.5L14 9.5" stroke="var(--color-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="license-modal__title">Лицензия на осуществление деятельности</h2>
      </div>
      <div class="license-modal__info">
        <div class="license-modal__row">
          <span class="license-modal__label">Номер лицензии:</span>
          <span class="license-modal__value"><strong>21-000-1-01104</strong></span>
        </div>
        <div class="license-modal__row">
          <span class="license-modal__label">Дата выдачи:</span>
          <span class="license-modal__value">23 мая 2024 года</span>
        </div>
        <div class="license-modal__row">
          <span class="license-modal__label">Выдана:</span>
          <span class="license-modal__value">Банком России</span>
        </div>
        <div class="license-modal__row">
          <span class="license-modal__label">Вид деятельности:</span>
          <span class="license-modal__value">Деятельность по управлению инвестиционными фондами, паевыми инвестиционными фондами и негосударственными пенсионными фондами</span>
        </div>
        <div class="license-modal__row">
          <span class="license-modal__label">Срок действия:</span>
          <span class="license-modal__value">Без ограничения срока действия</span>
        </div>
        <div class="license-modal__row">
          <span class="license-modal__label">Решение Банка России:</span>
          <span class="license-modal__value">№ РБ-14/682 от 23.05.2024</span>
        </div>
      </div>
      <div class="license-modal__footer">
        <p class="license-modal__note">
          Полная информация о лицензии и деятельности компании представлена в разделе "Правовая информация"
        </p>
      </div>
    </div>
  `

	document.body.appendChild(modal)
	document.body.style.overflow = "hidden" // Блокируем прокрутку

	// Анимация появления
	requestAnimationFrame(() => {
		modal.classList.add("license-modal--visible")
	})

	// Закрытие модального окна
	const closeBtn = modal.querySelector(".license-modal__close")
	const backdrop = modal.querySelector(".license-modal__backdrop")

	const closeModal = () => {
		modal.classList.remove("license-modal--visible")
		document.body.style.overflow = "" // Восстанавливаем прокрутку
		setTimeout(() => {
			modal.remove()
		}, 300)
	}

	closeBtn.addEventListener("click", closeModal)
	backdrop.addEventListener("click", closeModal)

	// Закрытие по Escape
	const handleEscape = e => {
		if (e.key === "Escape") {
			closeModal()
			document.removeEventListener("keydown", handleEscape)
		}
	}

	document.addEventListener("keydown", handleEscape)
}
