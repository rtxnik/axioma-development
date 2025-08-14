/**
 * Модуль управления модальными окнами услуг
 */
export class ServiceModalManager {
	constructor() {
		this.modal = null
		this.servicesData = this.getServicesData()
		this.init()
	}

	init() {
		// Находим все кнопки-триггеры
		const triggers = document.querySelectorAll("[data-service-trigger]")

		triggers.forEach(trigger => {
			trigger.addEventListener("click", e => {
				e.preventDefault()
				e.stopPropagation()
				const serviceId = trigger.dataset.serviceTrigger
				this.show(serviceId)
			})
		})
	}

	getServicesData() {
		return {
			"family-office": {
				title: "Family Office",
				subtitle: "Для собственников и бенефициаров бизнеса",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
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
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
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
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
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
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
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
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
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
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
					<path d="M12 2L2 7L12 12L22 7L12 2Z" />
					<path d="M2 17L12 22L22 17" />
					<path d="M2 12L12 17L22 12" />
					<circle cx="12" cy="12" r="3" fill="var(--color-blue, #0066cc)" opacity="0.3" />
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
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
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
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #0066cc)" stroke-width="1.5">
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
		if (!serviceData) {
			console.error(`Service data not found for: ${serviceId}`)
			return
		}

		// Создаем модальное окно
		this.modal = document.createElement("div")
		this.modal.className = "service-modal"
		this.modal.setAttribute("role", "dialog")
		this.modal.setAttribute("aria-modal", "true")
		this.modal.setAttribute("aria-labelledby", "modal-title")

		// Генерируем HTML контент
		this.modal.innerHTML = `
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
										<path d="M7 10L9 12L13 8" stroke="var(--color-blue, #0066cc)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
										<circle cx="10" cy="10" r="9" stroke="var(--color-blue, #0066cc)" stroke-width="1.5"/>
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

		// Добавляем в DOM
		document.body.appendChild(this.modal)
		document.body.style.overflow = "hidden"

		// Запускаем анимацию появления
		requestAnimationFrame(() => {
			this.modal.classList.add("service-modal--visible")
		})

		// Настраиваем обработчики
		this.setupEventHandlers()

		// Фокус на модальное окно для доступности
		this.modal.querySelector(".service-modal__close").focus()
	}

	setupEventHandlers() {
		const closeBtn = this.modal.querySelector(".service-modal__close")
		const backdrop = this.modal.querySelector(".service-modal__backdrop")
		const ctaButton = this.modal.querySelector(".service-modal__cta-button")

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

		// Обработка CTA кнопки
		ctaButton.addEventListener("click", () => {
			this.close()
			// Прокручиваем к форме контактов
			const contactSection = document.getElementById("contact")
			if (contactSection) {
				contactSection.scrollIntoView({ behavior: "smooth" })
			}
		})

		// Ловушка фокуса для доступности
		this.setupFocusTrap()
	}

	setupFocusTrap() {
		const focusableElements = this.modal.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

	close() {
		if (!this.modal) return

		// Запускаем анимацию закрытия
		this.modal.classList.remove("service-modal--visible")
		document.body.style.overflow = ""

		// Удаляем обработчики
		document.removeEventListener("keydown", this.handleEscape)
		this.modal.removeEventListener("keydown", this.handleTab)

		// Удаляем из DOM после анимации
		setTimeout(() => {
			if (this.modal) {
				this.modal.remove()
				this.modal = null
			}
		}, 300)

		// Возвращаем фокус на кнопку, которая открыла модальное окно
		const activeButton = document.querySelector("[data-service-trigger]:focus")
		if (activeButton) {
			activeButton.focus()
		}
	}
}
