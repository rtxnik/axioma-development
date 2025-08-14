/**
 * Модуль управления модальными окнами услуг
 */

export class ServiceModalManager {
	constructor() {
		this.servicesData = {
			"family-office": {
				title: "Family Office",
				subtitle: "Для собственников и бенефициаров бизнеса",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2L19 7V11C19 15.42 16.12 19.17 12 20C7.88 19.17 5 15.42 5 11V7L12 2Z"/>
					<path d="M12 6V12L16 14"/>
				</svg>`,
				tasks: [
					"Конфиденциальность информации о собственниках, сделках и активах",
					"Налоговое планирование",
					"Перераспределение финансовых потоков между компаниями и проектами",
					"Выдача займов без банковского регулирования и надзора",
					"Управление наследованием и передачей имущества",
				],
				color: "#3b82f6",
			},
			mezzanine: {
				title: "Мезонинное кредитование",
				subtitle:
					"Для финансирования и участия в капитализации крупных инвестиционных проектов, промышленных объектов, энергетики, инфраструктурного строительства",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<rect x="3" y="10" width="18" height="11" rx="2"/>
					<path d="M7 10V7C7 5.34 8.34 4 10 4H14C15.66 4 17 5.34 17 7V10"/>
					<line x1="12" y1="14" x2="12" y2="17"/>
				</svg>`,
				tasks: [
					"Корпоративный контроль инвестиций",
					"Закрытие «разрыва» между собственными средствами и заемным капиталом",
					"Оптимизация структуры сделки для банковского кредитования",
					"Повышение инвестиционной привлекательности проекта",
					"Опционные программы",
				],
				color: "#10b981",
			},
			"ma-financing": {
				title: "M&A и проектное финансирование",
				subtitle:
					"Для собственников бизнеса, стартапов и IT-компаний, застройщиков и девелоперов, энергетических и инфраструктурных проектов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<circle cx="9" cy="9" r="4"/>
					<circle cx="15" cy="15" r="4"/>
					<path d="M9 13L15 11"/>
				</svg>`,
				tasks: [
					"Покупка и продажа бизнеса (долей, активов, компаний)",
					"Финансирование сделок слияний и поглощений",
					"Финансирование технологических и IT-компаний на стадии роста",
					"Разделение рисков между инвесторами, кредиторами и менеджментом проекта",
					"IPO",
				],
				color: "#8b5cf6",
			},
			factoring: {
				title: "Финансирование контрактов (факторинг)",
				subtitle:
					"Для финансирования экспортеров и импортеров, поставщиков и получателей",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M9 11H3L12 2L13 11H21L12 22Z"/>
				</svg>`,
				tasks: [
					"Финансовое агентирование",
					"Операции с дебиторской и кредиторской задолженностью",
					"Расчетные операции",
				],
				color: "#f59e0b",
			},
			bridge: {
				title: "Бридж-финансирование",
				subtitle:
					"Для владельцев крупных земельных участков, застройщиков и девелоперов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M3 21H21"/>
					<path d="M5 21V7L12 3L19 7V21"/>
					<path d="M9 21V14H15V21"/>
				</svg>`,
				tasks: [
					"Подготовка площадок к проектному финансированию",
					"Организация собственного участия",
					"Фондирование текущих расходов",
					"Наращивание темпов финансирования проектов",
					"Выкуп долей у партнеров на раннем этапе проекта",
				],
				color: "#06b6d4",
			},
			engineering: {
				title: "Финансовая инженерия",
				subtitle:
					"Для реализации комбинированных сделок по финансированию, владению и управлению имуществом с использование Личных (наследственных) фондов, инвестиционных товариществ, иностранных партнёрств, дискретных фондов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2L2 7L12 12L22 7L12 2Z"/>
					<path d="M2 17L12 22L22 17"/>
					<path d="M2 12L12 17L22 12"/>
				</svg>`,
				tasks: [
					"Передача имущества в наследство",
					"Сделки с материальной выгодой",
					"Pre-IPO",
					"Финансирование крупных инфраструктурных проектов",
					"Привлечение иностранных инвестиций",
				],
				color: "#ec4899",
			},
			"non-core-assets": {
				title: "Структурирование сделок с непрофильными активами",
				subtitle:
					"Для владельцев залоговых активов, имущества дефолтных заемщиков, портфелей разнородных активов, земельных участков и зданий вне фокуса, объектов, не приносящих прибыли",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<rect x="3" y="3" width="7" height="7"/>
					<rect x="14" y="3" width="7" height="7"/>
					<rect x="14" y="14" width="7" height="7"/>
					<rect x="3" y="14" width="7" height="7"/>
				</svg>`,
				tasks: [
					"Консолидация и монетизация непрофильных активов",
					"Секьюритизация активов",
					"Привлечение финансирования",
				],
				color: "#14b8a6",
			},
			agency: {
				title: "Агентское участие",
				subtitle:
					"Для мотивации лиц за привлечение соинвесторов, использование «банковской сети», продажу капиталоемких проектов и активов",
				icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M17 21V19C17 17.9 17 17.35 16.73 16.97C16.48 16.61 15.78 16.39 15.37 16.26C14.17 15.94 12.59 15.5 12 15.5C11.41 15.5 9.83 15.94 8.63 16.26C8.22 16.39 7.52 16.61 7.27 16.97C7 17.35 7 17.9 7 19V21"/>
					<path d="M12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12Z"/>
					<path d="M5 9.5C5 8.12 4.33 7 3.5 7C2.67 7 2 8.12 2 9.5C2 10.88 2.67 12 3.5 12"/>
					<path d="M19 9.5C19 8.12 19.67 7 20.5 7C21.33 7 22 8.12 22 9.5C22 10.88 21.33 12 20.5 12"/>
				</svg>`,
				tasks: [
					"IPO",
					"Сохранение конфиденциальности участников",
					"Выступление от имени нейтральной стороны в партнёрских сделках",
					"Представление интересов нескольких инвесторов",
					"Комиссионное вознаграждение",
				],
				color: "#64748b",
			},
		}

		this.modal = null
		this.activeService = null
		this.init()
	}

	init() {
		this.setupButtons()
		this.setupKeyboardNavigation()
	}

	setupButtons() {
		// Находим все кнопки "Подробнее" в карточках услуг
		const buttons = document.querySelectorAll(
			".service-card__button .button--secondary"
		)

		buttons.forEach((button, index) => {
			// Определяем ID услуги по порядку
			const serviceIds = [
				"family-office",
				"mezzanine",
				"ma-financing",
				"factoring",
				"bridge",
				"engineering",
				"non-core-assets",
				"agency",
			]

			const serviceId = serviceIds[index]
			if (serviceId) {
				button.addEventListener("click", e => {
					e.preventDefault()
					e.stopPropagation()
					this.openModal(serviceId)
				})
			}
		})
	}

	setupKeyboardNavigation() {
		document.addEventListener("keydown", e => {
			if (e.key === "Escape" && this.modal) {
				this.closeModal()
			}
		})
	}

	openModal(serviceId) {
		const service = this.servicesData[serviceId]
		if (!service) {
			console.error(`Service ${serviceId} not found`)
			return
		}

		this.activeService = serviceId
		this.createModal(service)
		this.showModal()

		// Блокируем скролл body
		document.body.style.overflow = "hidden"

		// Трекинг события (можно подключить аналитику)
		this.trackEvent("service_modal_open", serviceId)
	}

	createModal(service) {
		// Создаем модальное окно
		this.modal = document.createElement("div")
		this.modal.className = "service-modal"
		this.modal.innerHTML = `
			<div class="service-modal__backdrop"></div>
			<div class="service-modal__container">
				<div class="service-modal__content">
					<!-- Кнопка закрытия -->
					<button class="service-modal__close" aria-label="Закрыть">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
					
					<!-- Шапка модального окна -->
					<div class="service-modal__header">
						<div class="service-modal__icon" style="color: ${service.color}">
							${service.icon}
						</div>
						<h2 class="service-modal__title">${service.title}</h2>
						<p class="service-modal__subtitle">${service.subtitle}</p>
					</div>
					
					<!-- Решаемые задачи -->
					<div class="service-modal__body">
						<h3 class="service-modal__section-title">Решаемые задачи:</h3>
						<ul class="service-modal__tasks">
							${service.tasks
								.map(
									task => `
								<li class="service-modal__task">
									<svg class="service-modal__task-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
										<circle cx="10" cy="10" r="9" stroke="${service.color}" stroke-width="1.5"/>
										<path d="M6 10L8.5 12.5L14 7" stroke="${service.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									</svg>
									<span>${task}</span>
								</li>
							`
								)
								.join("")}
						</ul>
					</div>
					
					<!-- Футер с CTA -->
					<div class="service-modal__footer">
						<button class="service-modal__cta-button">
							Получить консультацию
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M6 10H14M14 10L10 6M14 10L10 14"/>
							</svg>
						</button>
						<p class="service-modal__footer-text">
							Свяжитесь с нами для детального обсуждения вашего проекта
						</p>
					</div>
				</div>
			</div>
		`

		document.body.appendChild(this.modal)

		// Настройка обработчиков закрытия
		this.setupCloseHandlers()

		// Настройка CTA кнопки
		this.setupCTAButton()
	}

	setupCloseHandlers() {
		const closeBtn = this.modal.querySelector(".service-modal__close")
		const backdrop = this.modal.querySelector(".service-modal__backdrop")

		closeBtn.addEventListener("click", () => this.closeModal())
		backdrop.addEventListener("click", () => this.closeModal())
	}

	setupCTAButton() {
		const ctaButton = this.modal.querySelector(".service-modal__cta-button")

		ctaButton.addEventListener("click", () => {
			this.closeModal()
			// Прокручиваем к форме контактов
			const contactSection = document.getElementById("contact")
			if (contactSection) {
				contactSection.scrollIntoView({ behavior: "smooth" })
			}

			// Трекинг события
			this.trackEvent("service_modal_cta_click", this.activeService)
		})
	}

	showModal() {
		// Анимация появления
		requestAnimationFrame(() => {
			this.modal.classList.add("service-modal--visible")
		})
	}

	closeModal() {
		if (!this.modal) return

		this.modal.classList.remove("service-modal--visible")
		document.body.style.overflow = ""

		// Удаляем модальное окно после анимации
		setTimeout(() => {
			if (this.modal) {
				this.modal.remove()
				this.modal = null
				this.activeService = null
			}
		}, 300)

		// Трекинг события
		this.trackEvent("service_modal_close", this.activeService)
	}

	trackEvent(eventName, serviceId) {
		// Здесь можно добавить интеграцию с Google Analytics, Яндекс.Метрикой и т.д.
		if (window.gtag) {
			window.gtag("event", eventName, {
				service_id: serviceId,
			})
		}

		// Консольный лог для отладки
		console.log(`Event: ${eventName}, Service: ${serviceId}`)
	}
}
