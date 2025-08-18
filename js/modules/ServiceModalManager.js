/**
 * Модуль управления модальными окнами услуг - Оптимизированная версия
 */
export class ServiceModalManager {
	constructor() {
		this.modal = null
		this.isAnimating = false
		this.scrollPosition = 0
		this.servicesData = this.getServicesData()
		this.focusedElementBeforeModal = null
		this.init()
	}

	init() {
		// Делегирование событий для лучшей производительности
		document.addEventListener("click", e => {
			const trigger = e.target.closest("[data-service-trigger]")
			if (trigger && !this.isAnimating) {
				e.preventDefault()
				e.stopPropagation()
				const serviceId = trigger.dataset.serviceTrigger
				this.show(serviceId)
			}
		})
	}

	getServicesData() {
		return {
			"family-office": {
				title: "Family Office",
				subtitle: "Для собственников и бенефициаров бизнеса",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<path d="M12 2L2 7L12 12L22 7L12 2Z" />
					<path d="M2 17L12 22L22 17" />
					<path d="M2 12L12 17L22 12" />
				</svg>`,
				tasks: [
					"Конфиденциальность информации о собственниках, сделках и активах",
					"Налоговое планирование",
					"Перераспределение финансовых потоков между компаниями и проектами",
					"Выдача займов без банковского регулирования и надзора",
					"Управление наследованием и передачей имущества",
				],
			},
			mezzanine: {
				title: "Мезонинное кредитование",
				subtitle:
					"Для финансирования и участия в капитализации крупных инвестиционных проектов, промышленных объектов, энергетики, инфраструктурного строительства",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<rect x="3" y="3" width="18" height="18" rx="2" />
					<path d="M3 9H21" />
					<path d="M9 3V21" />
					<path d="M15 3V21" />
				</svg>`,
				tasks: [
					"Корпоративный контроль инвестиций",
					"Закрытие «разрыва» между собственными средствами и заемным капиталом",
					"Оптимизация структуры сделки для банковского кредитования",
					"Повышение инвестиционной привлекательности проекта",
					"Опционные программы",
				],
			},
			"ma-financing": {
				title: "M&A и проектное финансирование",
				subtitle:
					"Для собственников бизнеса, стартапов и IT-компаний, застройщиков и девелоперов, энергетических и инфраструктурных проектов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<circle cx="9" cy="9" r="7" />
					<circle cx="15" cy="15" r="7" />
					<path d="M21 21L18.5 18.5" />
				</svg>`,
				tasks: [
					"Покупка и продажа бизнеса (долей, активов, компаний)",
					"Финансирование сделок слияний и поглощений",
					"Финансирование технологических и IT-компаний на стадии роста",
					"Разделение рисков между инвесторами, кредиторами и менеджментом проекта",
					"IPO",
				],
			},
			factoring: {
				title: "Финансирование контрактов (факторинг)",
				subtitle:
					"Для финансирования экспортеров и импортеров, поставщиков и получателей",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" />
					<path d="M14 2V8H20" />
					<path d="M16 13H8" />
					<path d="M16 17H8" />
					<path d="M10 9H8" />
				</svg>`,
				tasks: [
					"Финансовое агентирование",
					"Операции с дебиторской и кредиторской задолженностью",
					"Расчетные операции",
				],
			},
			"bridge-financing": {
				title: "Бридж-финансирование",
				subtitle:
					"Для владельцев крупных земельных участков, застройщиков и девелоперов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<path d="M3 21H21" />
					<path d="M5 21V7L12 3L19 7V21" />
					<path d="M9 21V13H15V21" />
					<path d="M10 9H10.01" />
					<path d="M14 9H14.01" />
				</svg>`,
				tasks: [
					"Подготовка площадок к проектному финансированию",
					"Организация собственного участия",
					"Фондирование текущих расходов",
					"Наращивание темпов финансирования проектов",
					"Выкуп долей у партнеров на раннем этапе проекта",
				],
			},
			"financial-engineering": {
				title: "Финансовая инженерия",
				subtitle:
					"Для реализации комбинированных сделок по финансированию, владению и управлению имуществом с использование Личных (наследственных) фондов, инвестиционных товариществ, иностранных партнёрств, дискретных фондов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<path d="M12 2L2 7L12 12L22 7L12 2Z" />
					<path d="M2 17L12 22L22 17" />
					<path d="M2 12L12 17L22 12" />
					<circle cx="12" cy="12" r="3" fill="#3b82f6" opacity="0.2" />
				</svg>`,
				tasks: [
					"Передача имущества в наследство",
					"Сделки с материальной выгодой",
					"Pre-IPO",
					"Финансирование крупных инфраструктурных проектов",
					"Привлечение иностранных инвестиций",
				],
			},
			"non-core-assets": {
				title: "Структурирование сделок с непрофильными активами",
				subtitle:
					"Для владельцев залоговых активов, имущества дефолтных заемщиков, портфелей разнородных активов, земельных участков и зданий вне фокуса, объектов, не приносящих прибыли",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<rect x="2" y="7" width="20" height="14" rx="2" />
					<path d="M16 7V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V7" />
					<line x1="12" y1="11" x2="12" y2="17" />
					<line x1="9" y1="14" x2="15" y2="14" />
				</svg>`,
				tasks: [
					"Консолидация и монетизация непрофильных активов",
					"Секьюритизация активов",
					"Привлечение финансирования",
				],
			},
			"agency-participation": {
				title: "Агентское участие",
				subtitle:
					"Для мотивации лиц за привлечение соинвесторов, использование «банковской сети», продажу капиталоемких проектов и активов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="1.5">
					<path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" />
					<path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" />
				</svg>`,
				tasks: [
					"IPO",
					"Сохранение конфиденциальности участников",
					"Выступление от имени нейтральной стороны в партнёрских сделках",
					"Представление интересов нескольких инвесторов",
					"Комиссионное вознаграждение",
				],
			},
		}
	}

	show(serviceId) {
		const serviceData = this.servicesData[serviceId]
		if (!serviceData || this.modal || this.isAnimating) return

		this.isAnimating = true
		this.focusedElementBeforeModal = document.activeElement

		// Создаем модальное окно
		this.modal = this.createModal(serviceData)
		document.body.appendChild(this.modal)

		// ИСПРАВЛЕНО: Улучшенная блокировка скролла
		this.lockScroll()

		// Анимация появления
		requestAnimationFrame(() => {
			this.modal.classList.add("service-modal--visible")
			this.isAnimating = false

			// Фокус на кнопку закрытия
			const closeBtn = this.modal.querySelector(".service-modal__close")
			if (closeBtn) closeBtn.focus()
		})

		this.setupEventHandlers()
	}

	createModal(serviceData) {
		const modal = document.createElement("div")
		modal.className = "service-modal"
		modal.setAttribute("role", "dialog")
		modal.setAttribute("aria-modal", "true")
		modal.setAttribute("aria-labelledby", "modal-title")

		modal.innerHTML = `
			<div class="service-modal__backdrop" aria-hidden="true"></div>
			<div class="service-modal__container">
				<div class="service-modal__content">
					<button class="service-modal__close" aria-label="Закрыть" type="button">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
					
					<div class="service-modal__header">
						<div class="service-modal__icon">
							${serviceData.icon}
						</div>
						<h2 id="modal-title" class="service-modal__title">${serviceData.title}</h2>
						<p class="service-modal__subtitle">${serviceData.subtitle}</p>
					</div>
					
					<div class="service-modal__body">
						<h3 class="service-modal__section-title">Решаемые задачи</h3>
						<ul class="service-modal__tasks">
							${serviceData.tasks
								.map(
									task => `
								<li class="service-modal__task">
									<svg class="service-modal__task-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
										<path d="M7 10L9 12L13 8" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<circle cx="10" cy="10" r="9" stroke="#3b82f6" stroke-width="1.5"/>
									</svg>
									<span>${task}</span>
								</li>
							`
								)
								.join("")}
						</ul>
					</div>
					
					<div class="service-modal__footer">
						<button class="service-modal__cta-button" type="button">
							<span>Оставить заявку</span>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M7 10H13M13 10L10 7M13 10L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
						<p class="service-modal__footer-text">
							Получите персональную консультацию по выбранной услуге
						</p>
					</div>
				</div>
			</div>
		`

		return modal
	}

	setupEventHandlers() {
		// Используем один обработчик для всего модального окна
		this.modalClickHandler = e => {
			if (
				e.target.closest(".service-modal__close") ||
				e.target.classList.contains("service-modal__backdrop")
			) {
				this.close()
			} else if (e.target.closest(".service-modal__cta-button")) {
				this.handleCTAClick()
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
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

	handleCTAClick() {
		this.close()
		// Прокрутка к форме после закрытия
		setTimeout(() => {
			const contactSection = document.getElementById("contact")
			if (contactSection) {
				contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
			}
		}, 300)
	}

	// ИСПРАВЛЕНО: Улучшенная блокировка скролла без прыжков
	lockScroll() {
		// Сохраняем текущую позицию скролла
		this.scrollPosition =
			window.pageYOffset || document.documentElement.scrollTop

		// Добавляем padding для компенсации скроллбара
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth

		// Применяем стили к body
		document.body.style.cssText = `
			overflow: hidden;
			padding-right: ${scrollbarWidth}px;
			position: relative;
		`

		// Создаем временный элемент для сохранения позиции скролла
		const scrollAnchor = document.createElement("div")
		scrollAnchor.id = "scroll-anchor"
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

	// ИСПРАВЛЕНО: Улучшенная разблокировка скролла
	unlockScroll() {
		// Удаляем временный элемент
		const scrollAnchor = document.getElementById("scroll-anchor")
		if (scrollAnchor) {
			scrollAnchor.remove()
		}

		// Восстанавливаем стили body
		document.body.style.cssText = ""

		// Восстанавливаем позицию скролла плавно
		window.scrollTo({
			top: this.scrollPosition,
			left: 0,
			behavior: "instant", // Используем instant для мгновенного восстановления
		})
	}

	close() {
		if (!this.modal || this.isAnimating) return

		this.isAnimating = true

		// Анимация закрытия
		this.modal.classList.remove("service-modal--visible")

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

		// Удаление модального окна и восстановление скролла
		setTimeout(() => {
			this.unlockScroll()

			if (this.modal) {
				this.modal.remove()
				this.modal = null
			}

			// Возвращаем фокус
			if (
				this.focusedElementBeforeModal &&
				this.focusedElementBeforeModal.focus
			) {
				this.focusedElementBeforeModal.focus()
			}

			this.isAnimating = false
		}, 300)
	}

	// Метод для очистки при уничтожении
	destroy() {
		if (this.modal) {
			this.close()
		}
	}
}
