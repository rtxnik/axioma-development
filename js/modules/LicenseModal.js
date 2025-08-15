/**
 * Модуль управления модальным окном лицензии - Улучшенная версия
 */
export class LicenseModal {
	constructor() {
		this.modal = null
		this.isAnimating = false
		this.scrollPosition = 0
		this.init()
	}

	init() {
		// Находим кнопку лицензии в футере
		const licenseButton = document.querySelector(".footer-light__license-badge")

		if (licenseButton) {
			licenseButton.addEventListener("click", e => {
				e.preventDefault()

				// Предотвращаем открытие во время анимации
				if (this.isAnimating) return

				this.show()
			})
		}
	}

	show() {
		// Предотвращаем повторное открытие
		if (this.modal || this.isAnimating) return

		this.isAnimating = true

		// Создаем модальное окно
		this.modal = document.createElement("div")
		this.modal.className = "license-modal"
		this.modal.setAttribute("role", "dialog")
		this.modal.setAttribute("aria-modal", "true")
		this.modal.setAttribute("aria-labelledby", "license-modal-title")

		this.modal.innerHTML = `
			<div class="license-modal__backdrop"></div>
			<div class="license-modal__content">
				<button class="license-modal__close" aria-label="Закрыть" type="button">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
				<div class="license-modal__header">
					<div class="license-modal__seal">
						<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<!-- Основной документ -->
							<path d="M8 2C7.44772 2 7 2.44772 7 3V21C7 21.5523 7.44772 22 8 22H20C20.5523 22 21 21.5523 21 21V7.41421C21 7.149 20.8946 6.89464 20.7071 6.70711L15.2929 1.29289C15.1054 1.10536 14.851 1 14.5858 1H8" 
								stroke="#3b82f6" 
								stroke-width="1.5" 
								fill="rgba(59, 130, 246, 0.05)"/>
							
							<!-- Угол документа -->
							<path d="M14 1V6C14 6.55228 14.4477 7 15 7H20" 
								stroke="#3b82f6" 
								stroke-width="1.5" 
								stroke-linecap="round" 
								stroke-linejoin="round"/>
							
							<!-- Печать/Герб -->
							<circle cx="11" cy="16" r="3.5" 
								stroke="#3b82f6" 
								stroke-width="1.5" 
								fill="rgba(59, 130, 246, 0.1)"/>
							
							<!-- Звезда в центре печати -->
							<path d="M11 14L11.5 15.5L13 16L11.5 16.5L11 18L10.5 16.5L9 16L10.5 15.5L11 14Z" 
								fill="#3b82f6"/>
							
							<!-- Линии текста -->
							<path d="M10 4H12" 
								stroke="#3b82f6" 
								stroke-width="1.5" 
								stroke-linecap="round" 
								opacity="0.6"/>
							<path d="M10 7H18" 
								stroke="#3b82f6" 
								stroke-width="1.5" 
								stroke-linecap="round" 
								opacity="0.6"/>
							<path d="M10 10H18" 
								stroke="#3b82f6" 
								stroke-width="1.5" 
								stroke-linecap="round" 
								opacity="0.6"/>
							
							<!-- Подпись -->
							<path d="M15 16.5C15.5 16 16.5 15.5 17.5 16" 
								stroke="#3b82f6" 
								stroke-width="1.5" 
								stroke-linecap="round" 
								opacity="0.8"/>
						</svg>
					</div>
					<h2 id="license-modal-title" class="license-modal__title">Лицензия на осуществление деятельности</h2>
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
				<div class="license-modal__download">
					<a href="/documents/license-21-000-1-01104.pdf" 
					   class="license-modal__download-btn" 
					   download="Лицензия_Аксиома_Капитал_21-000-1-01104.pdf"
					   target="_blank"
					   rel="noopener noreferrer">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"/>
							<polyline points="7 10 12 15 17 10"/>
							<line x1="12" y1="15" x2="12" y2="3"/>
						</svg>
						<span>Скачать лицензию</span>
					</a>
				</div>
				<div class="license-modal__footer">
					<p class="license-modal__note">
						Полная информация о лицензии и деятельности компании представлена в разделе "Раскрытие информации"
					</p>
				</div>
			</div>
		`

		// Добавляем в DOM
		document.body.appendChild(this.modal)

		// Блокируем скролл с сохранением позиции
		this.lockScroll()

		// Анимация появления с использованием requestAnimationFrame
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this.modal.classList.add("license-modal--visible")
				this.isAnimating = false
			})
		})

		// Настройка обработчиков закрытия
		this.setupCloseHandlers()

		// Фокус на кнопку закрытия для доступности
		setTimeout(() => {
			const closeBtn = this.modal.querySelector(".license-modal__close")
			if (closeBtn) closeBtn.focus()
		}, 300)
	}

	setupCloseHandlers() {
		const closeBtn = this.modal.querySelector(".license-modal__close")
		const backdrop = this.modal.querySelector(".license-modal__backdrop")

		// Закрытие по кнопке
		closeBtn.addEventListener("click", () => this.close())

		// Закрытие по клику на фон
		backdrop.addEventListener("click", () => this.close())

		// Закрытие по Escape
		this.handleEscape = e => {
			if (e.key === "Escape") {
				this.close()
			}
		}

		document.addEventListener("keydown", this.handleEscape)

		// Ловушка фокуса для доступности
		this.setupFocusTrap()
	}

	setupFocusTrap() {
		const focusableElements = this.modal.querySelectorAll(
			'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		)
		const firstFocusable = focusableElements[0]
		const lastFocusable = focusableElements[focusableElements.length - 1]

		this.handleTab = e => {
			if (e.key === "Tab") {
				if (e.shiftKey) {
					if (document.activeElement === firstFocusable) {
						e.preventDefault()
						lastFocusable.focus()
					}
				} else {
					if (document.activeElement === lastFocusable) {
						e.preventDefault()
						firstFocusable.focus()
					}
				}
			}
		}

		this.modal.addEventListener("keydown", this.handleTab)
	}

	// Блокировка скролла без прыжков
	lockScroll() {
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth
		this.scrollPosition = window.pageYOffset

		document.body.style.overflow = "hidden"
		document.body.style.position = "fixed"
		document.body.style.top = `-${this.scrollPosition}px`
		document.body.style.width = "100%"

		// Компенсируем ширину скроллбара чтобы избежать прыжков
		if (scrollbarWidth > 0) {
			document.body.style.paddingRight = `${scrollbarWidth}px`
		}
	}

	// Разблокировка скролла с восстановлением позиции
	unlockScroll() {
		document.body.style.overflow = ""
		document.body.style.position = ""
		document.body.style.top = ""
		document.body.style.width = ""
		document.body.style.paddingRight = ""

		// Восстанавливаем позицию скролла
		window.scrollTo(0, this.scrollPosition)
	}

	close() {
		if (!this.modal || this.isAnimating) return

		this.isAnimating = true

		// Запускаем анимацию закрытия
		this.modal.classList.remove("license-modal--visible")

		// Разблокируем скролл
		this.unlockScroll()

		// Удаляем обработчик Escape
		document.removeEventListener("keydown", this.handleEscape)
		this.modal.removeEventListener("keydown", this.handleTab)

		// Удаляем модальное окно после анимации
		setTimeout(() => {
			if (this.modal) {
				this.modal.remove()
				this.modal = null
			}
			this.isAnimating = false
		}, 300)

		// Возвращаем фокус на кнопку лицензии
		const licenseButton = document.querySelector(".footer-light__license-badge")
		if (licenseButton) {
			licenseButton.focus()
		}
	}
}
