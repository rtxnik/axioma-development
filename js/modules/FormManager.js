/**
 * Модуль управления формами с серверной интеграцией
 */
import { CONFIG } from "../config/config.js"
import { Utils } from "../utils/utils.js"

export class FormManager {
	constructor() {
		this.form = document.getElementById("contactForm")
		this.toastContainer = document.getElementById("toastContainer")
		this.activeToasts = []

		// URL серверного обработчика
		this.apiEndpoint = "/api/contact.php" // Путь к PHP обработчику

		// Защита от спама
		this.lastSubmitTime = 0
		this.submitCooldown = 5000 // 5 секунд между отправками

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
		this.setupPhoneFieldFocus()
		this.setupHoneypot() // Добавляем honeypot защиту
	}

	/**
	 * Настройка honeypot поля для защиты от ботов
	 */
	setupHoneypot() {
		// Создаем скрытое поле
		const honeypot = document.createElement("input")
		honeypot.type = "text"
		honeypot.name = "website"
		honeypot.id = "website"
		honeypot.style.display = "none"
		honeypot.tabIndex = -1
		honeypot.autocomplete = "off"

		// Добавляем поле в форму
		this.form.appendChild(honeypot)
	}

	/**
	 * Настройка фокуса для поля телефона
	 */
	setupPhoneFieldFocus() {
		const phoneInput = this.form.querySelector(".form__input--phone")
		const phoneGroup = this.form.querySelector(".form__group--phone")
		const countryButton = this.form.querySelector(".country-selector__button")

		if (phoneInput && phoneGroup) {
			phoneInput.addEventListener("focus", () => {
				phoneGroup.classList.add("form__group--phone-focused")
			})

			phoneInput.addEventListener("blur", () => {
				setTimeout(() => {
					if (!phoneGroup.contains(document.activeElement)) {
						phoneGroup.classList.remove("form__group--phone-focused")
					}
				}, 100)
			})

			if (countryButton) {
				countryButton.addEventListener("focus", () => {
					phoneGroup.classList.add("form__group--phone-focused")
				})

				countryButton.addEventListener("blur", () => {
					setTimeout(() => {
						if (!phoneGroup.contains(document.activeElement)) {
							phoneGroup.classList.remove("form__group--phone-focused")
						}
					}, 100)
				})
			}

			const dropdown = this.form.querySelector(".country-selector__dropdown")
			if (dropdown) {
				dropdown.addEventListener("mousedown", e => {
					e.preventDefault()
				})
			}
		}
	}

	/**
	 * Настройка чекбокса
	 */
	setupCheckbox() {
		const checkbox = this.form.querySelector(".form__checkbox")
		const checkboxWrapper = this.form.querySelector(".form__checkbox-wrapper")
		const checkboxBox = this.form.querySelector(".form__checkbox-box")

		if (checkbox && checkboxWrapper) {
			if (checkboxBox) {
				checkboxBox.addEventListener("click", e => {
					e.preventDefault()
					checkbox.checked = !checkbox.checked
					checkbox.dispatchEvent(new Event("change"))
				})
			}

			checkboxWrapper.addEventListener("click", e => {
				if (e.target.tagName === "A" || e.target.closest(".form__link")) {
					return
				}
				if (e.target !== checkbox && !e.target.closest(".form__checkbox-box")) {
					e.preventDefault()
					checkbox.checked = !checkbox.checked
					checkbox.dispatchEvent(new Event("change"))
				}
			})

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

		this.form.addEventListener("submit", e => this.handleSubmit(e))

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
			} else if (!/^[а-яА-ЯёЁa-zA-Z\s\-']+$/u.test(value)) {
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
		const phoneGroup = this.form.querySelector(".form__group--phone")

		button.addEventListener("click", e => {
			e.preventDefault()
			const isOpen = dropdown.classList.contains(
				"country-selector__dropdown--open"
			)

			if (isOpen) {
				this.closeCountryDropdown(button, dropdown)
			} else {
				this.openCountryDropdown(button, dropdown)
				phoneGroup.classList.add("form__group--phone-focused")
				if (searchInput) searchInput.focus()
			}
		})

		dropdown.addEventListener("click", e => {
			const item = e.target.closest(".country-selector__item")
			if (item) {
				this.selectCountry(item, button, dropdown, phoneInput)
				phoneInput.focus()
			}
		})

		if (searchInput) {
			searchInput.addEventListener("input", e => {
				this.searchCountries(e.target.value, dropdown)
			})
		}

		document.addEventListener("click", e => {
			if (!selector.contains(e.target)) {
				this.closeCountryDropdown(button, dropdown)
			}
		})

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
		button.closest(".country-selector").classList.add("country-selector--open")
	}

	closeCountryDropdown(button, dropdown) {
		dropdown.classList.remove("country-selector__dropdown--open")
		button.setAttribute("aria-expanded", "false")
		button
			.closest(".country-selector")
			.classList.remove("country-selector--open")
	}

	selectCountry(item, button, dropdown, phoneInput) {
		const flag = item.dataset.flag
		const code = item.dataset.code

		button.querySelector(".country-selector__flag").textContent = flag

		dropdown.querySelectorAll(".country-selector__item").forEach(el => {
			el.classList.remove("country-selector__item--selected")
			el.setAttribute("aria-selected", "false")
		})

		item.classList.add("country-selector__item--selected")
		item.setAttribute("aria-selected", "true")

		const currentValue = phoneInput.value.replace(/^\+\d+\s*/, "")
		phoneInput.value = code + " " + currentValue
		phoneInput.focus()

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

		// Проверка cooldown
		const currentTime = Date.now()
		if (currentTime - this.lastSubmitTime < this.submitCooldown) {
			this.showToast(
				"warning",
				"Подождите",
				"Слишком частая отправка. Попробуйте через несколько секунд."
			)
			return
		}

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

		// Подготовка данных
		const formData = {
			email: this.form.email.value.trim(),
			phone: this.form.phone.value.trim(),
			name: this.form.name.value.trim(),
			privacy: checkbox.checked ? "on" : "off",
			website: this.form.website ? this.form.website.value : "", // honeypot
		}

		// Анимация кнопки
		const submitButton = this.form.querySelector(".button--submit")
		const buttonText = submitButton.querySelector(".button__text")
		const originalText = buttonText.textContent

		submitButton.classList.add("button--loading")
		submitButton.disabled = true

		try {
			// Отправка данных на сервер
			const response = await fetch(this.apiEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(formData),
			})

			const result = await response.json()

			if (response.ok && result.success) {
				// Успех
				this.lastSubmitTime = currentTime

				submitButton.classList.remove("button--loading")
				submitButton.classList.add("button--success")
				buttonText.textContent = "Отправлено!"

				this.showToast(
					"success",
					"Заявка отправлена!",
					result.message || "Мы свяжемся с вами в ближайшее время"
				)

				// Отправка события в Google Analytics
				if (typeof gtag !== "undefined") {
					gtag("event", "form_submit", {
						event_category: "Contact",
						event_label: "Contact Form",
					})
				}

				// Отправка события в Яндекс.Метрику
				if (typeof ym !== "undefined") {
					ym(window.yaCounterId, "reachGoal", "FORM_SUBMIT")
				}

				// Сброс формы
				setTimeout(() => {
					this.form.reset()
					this.form.querySelectorAll(".form__group").forEach(group => {
						group.classList.remove("form__group--error")
						group.classList.remove("form__group--phone-focused")
					})

					submitButton.classList.remove("button--success")
					buttonText.textContent = originalText
					submitButton.disabled = false
				}, 2000)
			} else if (response.status === 422 && result.errors) {
				// Ошибки валидации от сервера
				submitButton.classList.remove("button--loading")
				submitButton.classList.add("button--error")

				// Показываем ошибки для каждого поля
				Object.keys(result.errors).forEach(fieldName => {
					const input = this.form[fieldName]
					if (input) {
						const group = input.closest(".form__group")
						const error = group.querySelector(".form__error")
						if (group && error) {
							group.classList.add("form__group--error")
							error.textContent = result.errors[fieldName]
						}
					}
				})

				this.showToast(
					"error",
					"Ошибка валидации",
					"Проверьте правильность заполнения полей"
				)

				setTimeout(() => {
					submitButton.classList.remove("button--error")
					buttonText.textContent = originalText
					submitButton.disabled = false
				}, 2000)
			} else if (response.status === 429) {
				// Rate limiting
				submitButton.classList.remove("button--loading")
				submitButton.classList.add("button--error")

				this.showToast(
					"error",
					"Превышен лимит",
					result.message || "Слишком много попыток. Попробуйте позже."
				)

				setTimeout(() => {
					submitButton.classList.remove("button--error")
					buttonText.textContent = originalText
					submitButton.disabled = false
				}, 5000)
			} else {
				// Другая ошибка
				throw new Error(result.message || "Ошибка отправки")
			}
		} catch (error) {
			console.error("Form submission error:", error)

			// Ошибка
			submitButton.classList.remove("button--loading")
			submitButton.classList.add("button--error")

			// Показываем уведомление об ошибке
			this.showToast(
				"error",
				"Ошибка отправки",
				"Произошла ошибка. Попробуйте позже или свяжитесь с нами по телефону."
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
			warning: `<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
				<line x1="12" y1="9" x2="12" y2="13"></line>
				<line x1="12" y1="17" x2="12.01" y2="17"></line>
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
