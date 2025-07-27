// ===============================================
// КОНТАКТНАЯ ФОРМА - JAVASCRIPT
// Валидация, интерактивность и отправка формы
// ===============================================

// Инициализация AOS анимаций
AOS.init({
	duration: 800,
	easing: "ease-out",
	once: true,
	offset: 50,
})

// ===============================================
// КОНФИГУРАЦИЯ
// ===============================================

const CONFIG = {
	// Правила валидации
	validation: {
		email: {
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message: "Введите корректный email адрес",
		},
		phone: {
			minLength: 10,
			maxLength: 15,
			pattern: /^[\d\s\-\+\(\)]+$/,
			message: "Введите корректный номер телефона",
		},
		name: {
			minLength: 2,
			maxLength: 50,
			pattern: /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/,
			message: "Имя должно содержать только буквы",
		},
	},

	// Задержки для дебаунса
	debounceDelay: 500,

	// URL для отправки формы
	submitUrl: "/api/contact",
}

// ===============================================
// ОСНОВНОЙ КЛАСС ФОРМЫ
// ===============================================

class ContactForm {
	constructor(formId) {
		this.form = document.getElementById(formId)
		if (!this.form) return

		this.init()
	}

	init() {
		// Получение элементов
		this.elements = {
			email: this.form.querySelector("#email"),
			phone: this.form.querySelector("#phone"),
			name: this.form.querySelector("#name"),
			agreement: this.form.querySelector("#agreement"),
			submitButton: this.form.querySelector(".submit-button"),
			successMessage: this.form.querySelector(".success-message"),
			countryButton: this.form.querySelector(".country-button"),
			countryDropdown: this.form.querySelector(".country-dropdown"),
			countryList: this.form.querySelector(".country-list"),
			countrySearch: this.form.querySelector(".country-search-input"),
			selectedFlag: this.form.querySelector(".selected-flag"),
			selectedCode: this.form.querySelector(".selected-code"),
		}

		// Инициализация кода страны по умолчанию
		this.selectedCountryCode = "+7"

		// Убираем атрибут data-filled для нормального поведения метки
		// this.elements.phone.setAttribute('data-filled', 'true');

		// Привязка событий
		this.bindEvents()

		// Инициализация селектора стран
		this.initCountrySelector()
	}

	bindEvents() {
		// Отправка формы
		this.form.addEventListener("submit", e => this.handleSubmit(e))

		// Валидация в реальном времени
		this.elements.email.addEventListener("blur", () =>
			this.validateField("email")
		)
		this.elements.email.addEventListener(
			"input",
			this.debounce(() => this.validateField("email"), CONFIG.debounceDelay)
		)

		this.elements.phone.addEventListener("blur", () =>
			this.validateField("phone")
		)
		this.elements.phone.addEventListener(
			"input",
			this.debounce(() => this.validateField("phone"), CONFIG.debounceDelay)
		)

		this.elements.name.addEventListener("blur", () =>
			this.validateField("name")
		)
		this.elements.name.addEventListener(
			"input",
			this.debounce(() => this.validateField("name"), CONFIG.debounceDelay)
		)

		this.elements.agreement.addEventListener("change", () =>
			this.validateField("agreement")
		)

		// Эффект ряби для кнопки
		this.elements.submitButton.addEventListener("click", e =>
			this.createRipple(e)
		)

		// Обработка изменения размера окна
		let resizeTimeout
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimeout)
			resizeTimeout = setTimeout(() => {
				this.handleResize()
			}, 250)
		})
	}

	handleResize() {
		// Можно добавить дополнительную логику при изменении размера окна
		// Например, закрытие дропдауна при переходе между мобильной и десктопной версией
		if (this.elements.countryDropdown.classList.contains("show")) {
			this.closeCountryDropdown()
		}
	}

	// ===============================================
	// СЕЛЕКТОР СТРАН
	// ===============================================

	initCountrySelector() {
		const { countryButton, countryDropdown, countryList, countrySearch } =
			this.elements

		// Открытие/закрытие дропдауна
		countryButton.addEventListener("click", e => {
			e.preventDefault()
			this.toggleCountryDropdown()
		})

		// Закрытие при клике вне
		document.addEventListener("click", e => {
			if (!e.target.closest(".country-selector")) {
				this.closeCountryDropdown()
			}
		})

		// Выбор страны
		countryList.addEventListener("click", e => {
			const option = e.target.closest("li")
			if (option) {
				this.selectCountry(option)
			}
		})

		// Поиск стран
		countrySearch.addEventListener("input", e => {
			this.searchCountries(e.target.value)
		})

		// Навигация с клавиатуры
		countryDropdown.addEventListener("keydown", e => {
			this.handleCountryKeyboard(e)
		})
	}

	toggleCountryDropdown() {
		const isOpen = this.elements.countryDropdown.classList.contains("show")
		if (isOpen) {
			this.closeCountryDropdown()
		} else {
			this.openCountryDropdown()
		}
	}

	openCountryDropdown() {
		this.elements.countryDropdown.classList.add("show")
		this.elements.countryButton.setAttribute("aria-expanded", "true")
		this.elements.countrySearch.focus()
	}

	closeCountryDropdown() {
		this.elements.countryDropdown.classList.remove("show")
		this.elements.countryButton.setAttribute("aria-expanded", "false")
		this.elements.countrySearch.value = ""
		this.searchCountries("") // Сброс поиска
	}

	selectCountry(option) {
		const code = option.dataset.code
		const flag = option.dataset.flag

		// Обновление выбранной страны
		this.elements.selectedFlag.textContent = flag
		this.elements.selectedFlag.dataset.flag = flag
		this.elements.selectedCode.textContent = code

		// Сохраняем код страны для дальнейшего использования
		this.selectedCountryCode = code

		// Обновление активного элемента
		this.elements.countryList.querySelectorAll("li").forEach(li => {
			li.classList.remove("selected")
		})
		option.classList.add("selected")

		// Закрытие дропдауна
		this.closeCountryDropdown()

		// Фокус на поле телефона
		this.elements.phone.focus()
	}

	searchCountries(query) {
		const items = this.elements.countryList.querySelectorAll("li")
		const searchQuery = query.toLowerCase()

		items.forEach(item => {
			const countryName = item
				.querySelector(".country-name")
				.textContent.toLowerCase()
			const countryCode = item.querySelector(".country-code").textContent

			if (
				countryName.includes(searchQuery) ||
				countryCode.includes(searchQuery)
			) {
				item.style.display = "flex"
			} else {
				item.style.display = "none"
			}
		})
	}

	handleCountryKeyboard(e) {
		const items = Array.from(
			this.elements.countryList.querySelectorAll(
				'li:not([style*="display: none"])'
			)
		)
		const currentIndex = items.findIndex(item =>
			item.classList.contains("focused")
		)

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault()
				this.focusCountryItem(items, currentIndex + 1)
				break
			case "ArrowUp":
				e.preventDefault()
				this.focusCountryItem(items, currentIndex - 1)
				break
			case "Enter":
				e.preventDefault()
				const focusedItem = items.find(item =>
					item.classList.contains("focused")
				)
				if (focusedItem) {
					this.selectCountry(focusedItem)
				}
				break
			case "Escape":
				e.preventDefault()
				this.closeCountryDropdown()
				break
		}
	}

	focusCountryItem(items, index) {
		if (items.length === 0) return

		// Удаление предыдущего фокуса
		items.forEach(item => item.classList.remove("focused"))

		// Циклический переход
		const newIndex =
			index < 0 ? items.length - 1 : index >= items.length ? 0 : index

		// Добавление нового фокуса
		items[newIndex].classList.add("focused")
		items[newIndex].scrollIntoView({ block: "nearest" })
	}

	// ===============================================
	// ВАЛИДАЦИЯ
	// ===============================================

	validateField(fieldName) {
		const field = this.elements[fieldName]
		const formGroup = field.closest(".form-group")
		const errorElement = formGroup.querySelector(".form-error")

		let isValid = true
		let errorMessage = ""

		switch (fieldName) {
			case "email":
				const emailValue = field.value.trim()
				if (!emailValue) {
					isValid = false
					errorMessage = "Email обязателен для заполнения"
				} else if (!CONFIG.validation.email.pattern.test(emailValue)) {
					isValid = false
					errorMessage = CONFIG.validation.email.message
				}
				break

			case "phone":
				const phoneValue = field.value.replace(/\D/g, "")
				if (!phoneValue) {
					isValid = false
					errorMessage = "Телефон обязателен для заполнения"
				} else if (phoneValue.length < CONFIG.validation.phone.minLength) {
					isValid = false
					errorMessage = "Номер телефона слишком короткий"
				} else if (phoneValue.length > CONFIG.validation.phone.maxLength) {
					isValid = false
					errorMessage = "Номер телефона слишком длинный"
				}
				break

			case "name":
				const nameValue = field.value.trim()
				if (!nameValue) {
					isValid = false
					errorMessage = "Имя обязательно для заполнения"
				} else if (nameValue.length < CONFIG.validation.name.minLength) {
					isValid = false
					errorMessage = "Имя слишком короткое"
				} else if (nameValue.length > CONFIG.validation.name.maxLength) {
					isValid = false
					errorMessage = "Имя слишком длинное"
				} else if (!CONFIG.validation.name.pattern.test(nameValue)) {
					isValid = false
					errorMessage = CONFIG.validation.name.message
				}
				break

			case "agreement":
				if (!field.checked) {
					isValid = false
					errorMessage = "Необходимо согласие на обработку персональных данных"
				}
				break
		}

		// Отображение ошибки
		if (isValid) {
			formGroup.classList.remove("error")
			errorElement.textContent = ""
			errorElement.classList.remove("show")
		} else {
			formGroup.classList.add("error")
			errorElement.textContent = errorMessage
			errorElement.classList.add("show")
		}

		return isValid
	}

	validateForm() {
		const fields = ["email", "phone", "name", "agreement"]
		let isValid = true

		fields.forEach(field => {
			if (!this.validateField(field)) {
				isValid = false
			}
		})

		return isValid
	}

	// ===============================================
	// ОТПРАВКА ФОРМЫ
	// ===============================================

	async handleSubmit(e) {
		e.preventDefault()

		// Валидация всех полей
		if (!this.validateForm()) {
			// Скролл к первой ошибке
			const firstError = this.form.querySelector(".form-group.error")
			if (firstError) {
				firstError.scrollIntoView({ behavior: "smooth", block: "center" })
			}
			return
		}

		// Показать состояние загрузки
		this.setLoadingState(true)

		// Сбор данных формы
		const formData = {
			email: this.elements.email.value.trim(),
			phone: `${this.selectedCountryCode} ${this.elements.phone.value}`,
			name: this.elements.name.value.trim(),
			agreement: this.elements.agreement.checked,
		}

		try {
			// Имитация отправки формы (замените на реальный API вызов)
			await this.submitForm(formData)

			// Показать сообщение об успехе
			this.showSuccessMessage()
		} catch (error) {
			console.error("Ошибка отправки формы:", error)
			this.showError(
				"Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже."
			)
		} finally {
			this.setLoadingState(false)
		}
	}

	async submitForm(data) {
		// Имитация задержки сети
		return new Promise(resolve => {
			setTimeout(() => {
				console.log("Отправка данных формы:", data)
				resolve()
			}, 2000)
		})

		// Реальная отправка:
		// const response = await fetch(CONFIG.submitUrl, {
		//     method: 'POST',
		//     headers: {
		//         'Content-Type': 'application/json'
		//     },
		//     body: JSON.stringify(data)
		// });
		//
		// if (!response.ok) {
		//     throw new Error('Ошибка сервера');
		// }
		//
		// return response.json();
	}

	setLoadingState(isLoading) {
		if (isLoading) {
			this.elements.submitButton.classList.add("loading")
			this.elements.submitButton.disabled = true
		} else {
			this.elements.submitButton.classList.remove("loading")
			this.elements.submitButton.disabled = false
		}
	}

	showSuccessMessage() {
		this.elements.successMessage.classList.add("show")

		// Сброс формы через 3 секунды
		setTimeout(() => {
			this.resetForm()
		}, 3000)
	}

	showError(message) {
		// Можно добавить тост или модальное окно для ошибок
		alert(message)
	}

	resetForm() {
		this.form.reset()
		this.elements.successMessage.classList.remove("show")

		// Сброс состояний валидации
		this.form.querySelectorAll(".form-group").forEach(group => {
			group.classList.remove("error")
			const errorElement = group.querySelector(".form-error")
			if (errorElement) {
				errorElement.textContent = ""
				errorElement.classList.remove("show")
			}
		})
	}

	// ===============================================
	// УТИЛИТЫ
	// ===============================================

	debounce(func, delay) {
		let timeoutId
		return function (...args) {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => func.apply(this, args), delay)
		}
	}

	createRipple(e) {
		const button = e.currentTarget
		const ripple = button.querySelector(".button-ripple")

		if (!ripple) return

		const rect = button.getBoundingClientRect()
		const size = Math.max(rect.width, rect.height)
		const x = e.clientX - rect.left - size / 2
		const y = e.clientY - rect.top - size / 2

		ripple.style.width = ripple.style.height = size + "px"
		ripple.style.left = x + "px"
		ripple.style.top = y + "px"

		// Перезапуск анимации
		ripple.classList.remove("animate")
		void ripple.offsetWidth // Триггер reflow
		ripple.classList.add("animate")
	}
}

// ===============================================
// ИНИЦИАЛИЗАЦИЯ
// ===============================================

document.addEventListener("DOMContentLoaded", () => {
	// Инициализация формы
	const contactForm = new ContactForm("contactForm")

	// Дополнительные анимации при скролле
	const observerOptions = {
		threshold: 0.1,
		rootMargin: "0px 0px -50px 0px",
	}

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible")
			}
		})
	}, observerOptions)

	// Наблюдение за элементами
	document.querySelectorAll(".contact-card").forEach(el => {
		observer.observe(el)
	})
})

// ===============================================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
// ===============================================

// Форматирование телефона при вводе
function formatPhoneNumber(input) {
	const value = input.value.replace(/\D/g, "")
	let formattedValue = ""

	if (value.length > 0) {
		if (value.length <= 3) {
			formattedValue = value
		} else if (value.length <= 6) {
			formattedValue = `${value.slice(0, 3)} ${value.slice(3)}`
		} else if (value.length <= 8) {
			formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(
				6
			)}`
		} else {
			formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(
				6,
				8
			)} ${value.slice(8, 10)}`
		}
	}

	input.value = formattedValue
}

// Применение форматирования к полю телефона
document.getElementById("phone")?.addEventListener("input", function () {
	formatPhoneNumber(this)
})
