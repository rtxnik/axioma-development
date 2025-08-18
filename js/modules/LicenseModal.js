/**
 * Модуль управления модальным окном лицензии - Оптимизированная версия
 */
export class LicenseModal {
	constructor() {
		this.modal = null
		this.isAnimating = false
		this.scrollPosition = 0
		this.focusedElementBeforeModal = null
		this.init()
	}

	init() {
		// Делегирование событий
		document.addEventListener("click", e => {
			if (
				e.target.closest(".footer-light__license-badge") &&
				!this.isAnimating
			) {
				e.preventDefault()
				this.show()
			}
		})
	}

	show() {
		if (this.modal || this.isAnimating) return

		this.isAnimating = true
		this.focusedElementBeforeModal = document.activeElement

		// Создаем модальное окно
		this.modal = this.createModal()
		document.body.appendChild(this.modal)

		// Блокируем скролл
		this.lockScroll()

		// Анимация появления
		requestAnimationFrame(() => {
			this.modal.classList.add("license-modal--visible")
			this.isAnimating = false

			// Фокус на кнопку закрытия
			const closeBtn = this.modal.querySelector(".license-modal__close")
			if (closeBtn) closeBtn.focus()
		})

		this.setupEventHandlers()
	}

	createModal() {
		const modal = document.createElement("div")
		modal.className = "license-modal"
		modal.setAttribute("role", "dialog")
		modal.setAttribute("aria-modal", "true")
		modal.setAttribute("aria-labelledby", "license-modal-title")

		// Упрощенный SVG для иконки
		modal.innerHTML = `
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
						<svg width="60" height="60" viewBox="0 0 24 24" fill="none">
							<path d="M8 2C7.44772 2 7 2.44772 7 3V21C7 21.5523 7.44772 22 8 22H20C20.5523 22 21 21.5523 21 21V7.41421C21 7.149 20.8946 6.89464 20.7071 6.70711L15.2929 1.29289C15.1054 1.10536 14.851 1 14.5858 1H8" 
								stroke="#3b82f6" stroke-width="1.5" fill="rgba(59, 130, 246, 0.05)"/>
							<path d="M14 1V6C14 6.55228 14.4477 7 15 7H20" 
								stroke="#3b82f6" stroke-width="1.5"/>
							<circle cx="11" cy="16" r="3.5" 
								stroke="#3b82f6" stroke-width="1.5" fill="rgba(59, 130, 246, 0.1)"/>
							<path d="M11 14L11.5 15.5L13 16L11.5 16.5L11 18L10.5 16.5L9 16L10.5 15.5L11 14Z" 
								fill="#3b82f6"/>
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
					<a href="/assets/docs/information/licenses_and_certificates/lic.pdf" 
					   class="license-modal__download-btn" 
					   download="Лицензия_Аксиома_Капитал.pdf"
					   target="_blank"
					   rel="noopener noreferrer">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 15V19C21 20.5523 19.5523 21 19 21H5C3.46957 21 3 20.5523 3 19V15"/>
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

		return modal
	}

	setupEventHandlers() {
		// Один обработчик для всего модального окна
		this.modalClickHandler = e => {
			if (
				e.target.closest(".license-modal__close") ||
				e.target.classList.contains("license-modal__backdrop")
			) {
				this.close()
			}
		}

		this.modal.addEventListener("click", this.modalClickHandler)

		// Escape handler
		this.escapeHandler = e => {
			if (e.key === "Escape") this.close()
		}
		document.addEventListener("keydown", this.escapeHandler)

		// Focus trap
		this.setupFocusTrap()
	}

	setupFocusTrap() {
		const focusableElements = this.modal.querySelectorAll(
			'button, a[href], [tabindex]:not([tabindex="-1"])'
		)

		if (focusableElements.length === 0) return

		const firstFocusable = focusableElements[0]
		const lastFocusable = focusableElements[focusableElements.length - 1]

		this.tabHandler = e => {
			if (e.key !== "Tab") return

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

		this.modal.addEventListener("keydown", this.tabHandler)
	}

	// Используем те же улучшенные методы блокировки/разблокировки скролла
	lockScroll() {
		this.scrollPosition =
			window.pageYOffset || document.documentElement.scrollTop
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth

		document.body.style.cssText = `
			overflow: hidden;
			padding-right: ${scrollbarWidth}px;
			position: relative;
		`

		const scrollAnchor = document.createElement("div")
		scrollAnchor.id = "scroll-anchor-license"
		scrollAnchor.style.cssText = `
			position: absolute;
			top: ${this.scrollPosition}px;
			left: 0;
			width: 1px;
			height: 1px;
			opacity: 0;
			pointer-events: none;
		`
		document.body.appendChild(scrollAnchor)
	}

	unlockScroll() {
		const scrollAnchor = document.getElementById("scroll-anchor-license")
		if (scrollAnchor) {
			scrollAnchor.remove()
		}

		document.body.style.cssText = ""

		window.scrollTo({
			top: this.scrollPosition,
			left: 0,
			behavior: "instant",
		})
	}

	close() {
		if (!this.modal || this.isAnimating) return

		this.isAnimating = true

		this.modal.classList.remove("license-modal--visible")

		// Очистка обработчиков
		if (this.modalClickHandler) {
			this.modal.removeEventListener("click", this.modalClickHandler)
		}
		if (this.escapeHandler) {
			document.removeEventListener("keydown", this.escapeHandler)
		}
		if (this.tabHandler) {
			this.modal.removeEventListener("keydown", this.tabHandler)
		}

		// Удаление и восстановление
		setTimeout(() => {
			this.unlockScroll()

			if (this.modal) {
				this.modal.remove()
				this.modal = null
			}

			if (
				this.focusedElementBeforeModal &&
				this.focusedElementBeforeModal.focus
			) {
				this.focusedElementBeforeModal.focus()
			}

			this.isAnimating = false
		}, 300)
	}

	destroy() {
		if (this.modal) {
			this.close()
		}
	}
}
