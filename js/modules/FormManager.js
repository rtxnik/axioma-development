/**
 * Модуль управления формами
 */
import { CONFIG } from "../config/config.js"
import { Utils } from "../utils/utils.js"

export class FormManager {
	constructor() {
		this.form = document.getElementById("contactForm")
		if (this.form) {
			this.init()
		}
	}

	init() {
		this.setupFormValidation()
		this.setupCountrySelector()
		this.setupFormEffects()
	}

	setupFormValidation() {
		const inputs = this.form.querySelectorAll(".form__input")

		inputs.forEach(input => {
			// Валидация при потере фокуса
			input.addEventListener("blur", () => this.validateField(input))

			// Валидация в реальном времени с debounce
			input.addEventListener(
				"input",
				Utils.debounce(() => {
					if (input.value) this.validateField(input)
				}, CONFIG.form.debounceDelay)
			)

			// Обновление состояния заполненности
			input.addEventListener("input", () => {
				const group = input.closest(".form__group")
				if (input.value) {
					group.classList.add("form__group--filled")
				} else {
					group.classList.remove("form__group--filled")
				}
			})
		})

		// Обработка отправки формы
		this.form.addEventListener("submit", e => this.handleSubmit(e))
	}

	validateField(input) {
		const group = input.closest(".form__group")
		const error = group.querySelector(".form__error")
		let isValid = true
		let errorMessage = ""

		// Проверка обязательности
		if (input.hasAttribute("required") && !input.value.trim()) {
			isValid = false
			errorMessage = "Это поле обязательно"
		}

		// Проверка email
		if (input.type === "email" && input.value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(input.value)) {
				isValid = false
				errorMessage = "Введите корректный email"
			}
		}

		// Проверка телефона
		if (input.type === "tel" && input.value) {
			const phoneDigits = input.value.replace(/\D/g, "")
			if (phoneDigits.length < 10) {
				isValid = false
				errorMessage = "Введите корректный номер телефона"
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
				searchInput.focus()
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
		searchInput.addEventListener("input", e => {
			this.searchCountries(e.target.value, dropdown)
		})

		// Закрытие при клике вне
		document.addEventListener("click", e => {
			if (!selector.contains(e.target)) {
				this.closeCountryDropdown(button, dropdown)
			}
		})
	}

	openCountryDropdown(button, dropdown) {
		dropdown.classList.add("country-selector__dropdown--open")
		button.setAttribute("aria-expanded", "true")
	}

	closeCountryDropdown(button, dropdown) {
		dropdown.classList.remove("country-selector__dropdown--open")
		button.setAttribute("aria-expanded", "false")
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
		phoneInput.value = code + " "
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

	setupFormEffects() {
		// Эффект фокуса
		const inputs = this.form.querySelectorAll(".form__input")

		inputs.forEach(input => {
			input.addEventListener("focus", () => {
				input.closest(".form__group").classList.add("form__group--focused")
			})

			input.addEventListener("blur", () => {
				input.closest(".form__group").classList.remove("form__group--focused")
			})
		})
	}

	async handleSubmit(e) {
		e.preventDefault()

		// Валидация всех полей
		const inputs = this.form.querySelectorAll(".form__input")
		let isValid = true

		inputs.forEach(input => {
			if (!this.validateField(input)) {
				isValid = false
			}
		})

		if (!isValid) return

		// Анимация отправки
		const submitButton = this.form.querySelector(".button--submit")
		const buttonText = submitButton.querySelector(".button__text")
		const originalText = buttonText.textContent

		submitButton.classList.add("button--loading")
		buttonText.textContent = "Отправляется..."
		submitButton.disabled = true

		try {
			// Имитация отправки
			await new Promise(resolve => setTimeout(resolve, CONFIG.form.submitDelay))

			// Успех
			submitButton.classList.remove("button--loading")
			submitButton.classList.add("button--success")
			buttonText.textContent = "Отправлено!"

			// Сброс формы
			setTimeout(() => {
				this.form.reset()
				this.form.querySelectorAll(".form__group").forEach(group => {
					group.classList.remove("form__group--filled", "form__group--error")
				})

				submitButton.classList.remove("button--success")
				buttonText.textContent = originalText
				submitButton.disabled = false
			}, 2000)
		} catch (error) {
			// Ошибка
			submitButton.classList.remove("button--loading")
			submitButton.classList.add("button--error")
			buttonText.textContent = "Ошибка"

			setTimeout(() => {
				submitButton.classList.remove("button--error")
				buttonText.textContent = originalText
				submitButton.disabled = false
			}, 2000)
		}
	}
}
