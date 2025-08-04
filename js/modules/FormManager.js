/**
 * Модуль управления формами (обновленная версия с чекбоксом)
 */
import { CONFIG } from "../config/config.js"
import { Utils } from "../utils/utils.js"

export class FormManager {
	constructor() {
		this.form = document.getElementById("contactForm")
		this.toastContainer = document.getElementById("toastContainer")
		this.activeToasts = []

		if (this.form) {
			this.init()
		}
	}

	init() {
		this.setupFormValidation()
		this.setupCountrySelector()
		this.setupFormEffects()
		this.setupRealTimeValidation()
		this.setupCheckbox()
	}

	/**
	 * Настройка чекбокса
	 */
	setupCheckbox() {
		const checkbox = this.form.querySelector(".form__checkbox")
		const checkboxWrapper = this.form.querySelector(".form__checkbox-wrapper")

		if (checkbox && checkboxWrapper) {
			// Обработка клика по всей области чекбокса
			checkboxWrapper.addEventListener("click", e => {
				// Если клик не по самому чекбоксу или ссылке
				if (e.target.tagName !== "INPUT" && e.target.tagName !== "A") {
					checkbox.checked = !checkbox.checked
					checkbox.dispatchEvent(new Event("change"))
				}
			})

			// Валидация при изменении
			checkbox.addEventListener("change", () => {
				this.validateCheckbox(checkbox)
			})
		}
	}

	/**
	 * Валидация чекбокса
	 */
	validateCheckbox(checkbox) {
		const group = checkbox.closest(".form__group")
		const error = group.querySelector(".form__error")

		if (!checkbox.checked) {
			group.classList.add("form__group--error")
			error.textContent =
				"Необходимо дать согласие на обработку персональных данных"
			return false
		} else {
			group.classList.remove("form__group--error")
			error.textContent = ""
			return true
		}
	}

	/**
	 * Настройка валидации формы
	 */
	setupFormValidation() {
		const inputs = this.form.querySelectorAll(".form__input")

		// Обработка отправки формы
		this.form.addEventListener("submit", e => this.handleSubmit(e))

		// Валидация при потере фокуса
		inputs.forEach(input => {
			input.addEventListener("blur", () => {
				if (input.value) {
					this.validateField(input)
				}
			})
		})
	}

	/**
	 * Валидация в реальном времени
	 */
	setupRealTimeValidation() {
		const inputs = this.form.querySelectorAll(".form__input")

		inputs.forEach(input => {
			// Валидация в реальном времени с debounce
			input.addEventListener(
				"input",
				Utils.debounce(() => {
					if (input.value) {
						this.validateField(input)
					} else {
						this.clearFieldError(input)
					}
				}, CONFIG.form.debounceDelay)
			)
		})
	}

	/**
	 * Валидация отдельного поля
	 */
	validateField(input) {
		const group = input.closest(".form__group")
		const error = group.querySelector(".form__error")
		let isValid = true
		let errorMessage = ""

		// Удаляем пробелы
		const value = input.value.trim()

		// Проверка обязательности
		if (input.hasAttribute("required") && !value) {
			isValid = false
			errorMessage = "Это поле обязательно для заполнения"
		}

		// Проверка email
		if (input.type === "email" && value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(value)) {
				isValid = false
				errorMessage = "Введите корректный email адрес"
			}
		}

		// Проверка телефона
		if (input.type === "tel" && value) {
			const phoneDigits = value.replace(/\D/g, "")
			if (phoneDigits.length < 10 || phoneDigits.length > 15) {
				isValid = false
				errorMessage = "Введите корректный номер телефона"
			}
		}

		// Проверка имени
		if (input.name === "name" && value) {
			if (value.length < 2) {
				isValid = false
				errorMessage = "Имя должно содержать минимум 2 символа"
			} else if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(value)) {
				isValid = false
				errorMessage = "Имя может содержать только буквы"
			}
		}

		// Обновление UI
		if (isValid) {
			group.classList.remove("form__group--error")
			error.textContent = ""
		} else {
			group.classList.add("form__group--error")
			error.textContent = errorMessage
		}

		return isValid
	}

	/**
	 * Очистка ошибки поля
	 */
	clearFieldError(input) {
		const group = input.closest(".form__group")
		const error = group.querySelector(".form__error")

		group.classList.remove("form__group--error")
		error.textContent = ""
	}

	/**
	 * Настройка селектора страны
	 */
	setupCountrySelector() {
		const selector = this.form.querySelector(".country-selector")
		if (!selector) return

		const button = selector.querySelector(".country-selector__button")
		const dropdown = selector.querySelector(".country-selector__dropdown")
		const searchInput = selector.querySelector(
			".country-selector__search-input"
		)
		const phoneInput = this.form.querySelector(".form__input--phone")

		// Открытие/закрытие dropdown
		button.addEventListener("click", e => {
			e.preventDefault()
			const isOpen = dropdown.classList.contains(
				"country-selector__dropdown--open"
			)

			if (isOpen) {
				this.closeCountryDropdown(button, dropdown)
			} else {
				this.openCountryDropdown(button, dropdown)
				if (searchInput) searchInput.focus()
			}
		})

		// Выбор страны
		dropdown.addEventListener("click", e => {
			const item = e.target.closest(".country-selector__item")
			if (item) {
				this.selectCountry(item, button, dropdown, phoneInput)
			}
		})

		// Поиск стран
		if (searchInput) {
			searchInput.addEventListener("input", e => {
				this.searchCountries(e.target.value, dropdown)
			})
		}

		// Закрытие при клике вне
		document.addEventListener("click", e => {
			if (!selector.contains(e.target)) {
				this.closeCountryDropdown(button, dropdown)
			}
		})

		// Закрытие по Escape
		document.addEventListener("keydown", e => {
			if (
				e.key === "Escape" &&
				dropdown.classList.contains("country-selector__dropdown--open")
			) {
				this.closeCountryDropdown(button, dropdown)
				button.focus()
			}
		})
	}

	openCountryDropdown(button, dropdown) {
		dropdown.classList.add("country-selector__dropdown--open")
		button.setAttribute("aria-expanded", "true")
		// Добавляем класс для оверлея
		button.closest(".country-selector").classList.add("country-selector--open")
	}

	closeCountryDropdown(button, dropdown) {
		dropdown.classList.remove("country-selector__dropdown--open")
		button.setAttribute("aria-expanded", "false")
		// Убираем класс оверлея
		button
			.closest(".country-selector")
			.classList.remove("country-selector--open")
	}

	selectCountry(item, button, dropdown, phoneInput) {
		// Обновление выбранной страны
		const flag = item.dataset.flag
		const code = item.dataset.code

		button.querySelector(".country-selector__flag").textContent = flag

		// Обновление активного элемента
		dropdown.querySelectorAll(".country-selector__item").forEach(el => {
			el.classList.remove("country-selector__item--selected")
			el.setAttribute("aria-selected", "false")
		})

		item.classList.add("country-selector__item--selected")
		item.setAttribute("aria-selected", "true")

		// Обновление поля телефона
		const currentValue = phoneInput.value.replace(/^\+\d+\s*/, "")
		phoneInput.value = code + " " + currentValue
		phoneInput.focus()

		// Закрытие dropdown
		this.closeCountryDropdown(button, dropdown)
	}

	searchCountries(query, dropdown) {
		const items = dropdown.querySelectorAll(".country-selector__item")
		const searchQuery = query.toLowerCase()

		items.forEach(item => {
			const name = item
				.querySelector(".country-selector__item-name")
				.textContent.toLowerCase()
			const code = item.querySelector(
				".country-selector__item-code"
			).textContent

			if (name.includes(searchQuery) || code.includes(searchQuery)) {
				item.style.display = ""
			} else {
				item.style.display = "none"
			}
		})
	}

	/**
	 * Настройка эффектов формы
	 */
	setupFormEffects() {
		const inputs = this.form.querySelectorAll(".form__input")

		inputs.forEach(input => {
			// Эффект фокуса
			input.addEventListener("focus", () => {
				input.closest(".form__group").classList.add("form__group--focused")
			})

			input.addEventListener("blur", () => {
				input.closest(".form__group").classList.remove("form__group--focused")
			})
		})
	}

	/**
	 * Обработка отправки формы
	 */
	async handleSubmit(e) {
		e.preventDefault()

		// Валидация всех полей
		const inputs = this.form.querySelectorAll(".form__input")
		const checkbox = this.form.querySelector(".form__checkbox")
		let isValid = true

		inputs.forEach(input => {
			if (!this.validateField(input)) {
				isValid = false
			}
		})

		// Валидация чекбокса
		if (checkbox && !this.validateCheckbox(checkbox)) {
			isValid = false
		}

		if (!isValid) {
			this.showToast(
				"error",
				"Ошибка валидации",
				"Пожалуйста, проверьте все поля"
			)
			return
		}

		// Получение данных формы
		const formData = new FormData(this.form)
		const data = Object.fromEntries(formData)

		// Анимация кнопки
		const submitButton = this.form.querySelector(".button--submit")
		const buttonText = submitButton.querySelector(".button__text")
		const originalText = buttonText.textContent

		submitButton.classList.add("button--loading")
		submitButton.disabled = true

		try {
			// Имитация отправки (замените на реальный API вызов)
			await new Promise(resolve => setTimeout(resolve, CONFIG.form.submitDelay))

			// Успех
			submitButton.classList.remove("button--loading")
			submitButton.classList.add("button--success")
			buttonText.textContent = "Отправлено!"

			// Показываем уведомление об успехе
			this.showToast(
				"success",
				"Заявка отправлена!",
				"Мы свяжемся с вами в ближайшее время"
			)

			// Сброс формы
			setTimeout(() => {
				this.form.reset()
				this.form.querySelectorAll(".form__group").forEach(group => {
					group.classList.remove("form__group--error")
				})

				submitButton.classList.remove("button--success")
				buttonText.textContent = originalText
				submitButton.disabled = false
			}, 2000)
		} catch (error) {
			// Ошибка
			submitButton.classList.remove("button--loading")
			submitButton.classList.add("button--error")

			// Показываем уведомление об ошибке
			this.showToast(
				"error",
				"Ошибка отправки",
				"Произошла ошибка. Попробуйте позже"
			)

			setTimeout(() => {
				submitButton.classList.remove("button--error")
				buttonText.textContent = originalText
				submitButton.disabled = false
			}, 2000)
		}
	}

	/**
	 * Показ toast уведомления
	 */
	showToast(type, title, message, duration = 4000) {
		// Создаем контейнер если его нет
		if (!this.toastContainer) {
			this.toastContainer = document.getElementById("toastContainer")
			if (!this.toastContainer) {
				console.error("Toast container not found")
				return
			}
		}

		const toast = document.createElement("div")
		toast.className = `toast toast--${type}`

		// Иконки для разных типов
		const icons = {
			success: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
				<polyline points="22 4 12 14.01 9 11.01"></polyline>
			</svg>`,
			error: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="15" y1="9" x2="9" y2="15"></line>
				<line x1="9" y1="9" x2="15" y2="15"></line>
			</svg>`,
		}

		toast.innerHTML = `
			${icons[type] || ""}
			<div class="toast__content">
				<h4 class="toast__title">${title}</h4>
				<p class="toast__message">${message}</p>
			</div>
			<button class="toast__close" aria-label="Закрыть">
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="5" y1="5" x2="15" y2="15"></line>
					<line x1="15" y1="5" x2="5" y2="15"></line>
				</svg>
			</button>
			<div class="toast__progress"></div>
		`

		// Добавляем в контейнер
		this.toastContainer.appendChild(toast)
		this.activeToasts.push(toast)

		// Обработчик закрытия
		const closeBtn = toast.querySelector(".toast__close")
		closeBtn.addEventListener("click", () => this.hideToast(toast))

		// Автоматическое скрытие
		const autoHideTimeout = setTimeout(() => {
			this.hideToast(toast)
		}, duration)

		// Сохраняем таймер для возможной отмены
		toast.autoHideTimeout = autoHideTimeout

		// Пауза при наведении
		toast.addEventListener("mouseenter", () => {
			clearTimeout(toast.autoHideTimeout)
			const progress = toast.querySelector(".toast__progress")
			if (progress) progress.style.animationPlayState = "paused"
		})

		toast.addEventListener("mouseleave", () => {
			toast.autoHideTimeout = setTimeout(() => {
				this.hideToast(toast)
			}, 2000)
			const progress = toast.querySelector(".toast__progress")
			if (progress) progress.style.animationPlayState = "running"
		})
	}

	/**
	 * Скрытие toast уведомления
	 */
	hideToast(toast) {
		toast.classList.add("toast--hiding")

		setTimeout(() => {
			if (toast && toast.parentNode) {
				toast.remove()
			}
			const index = this.activeToasts.indexOf(toast)
			if (index > -1) {
				this.activeToasts.splice(index, 1)
			}
		}, 400)
	}
}
