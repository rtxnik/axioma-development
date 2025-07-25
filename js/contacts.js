// ===============================================
// CONTACT FORM - МОДУЛЬНАЯ СТРУКТУРА
// ===============================================

// Главный класс формы
class ContactForm {
	constructor() {
		this.form = document.getElementById("contactForm")
		if (!this.form) return

		// Инициализация компонентов
		this.countrySelector = new CountrySelector()
		this.particleSystem = new ParticleSystem()
		this.formValidator = new FormValidator(this.form)
		this.formEffects = new FormEffects()

		this.init()
	}

	init() {
		this.setupFormHandlers()
		this.setupParallaxEffect()
		this.particleSystem.create()
	}

	setupFormHandlers() {
		// Обработка отправки формы
		this.form.addEventListener("submit", e => this.handleSubmit(e))

		// Обработка полей ввода
		const inputs = this.form.querySelectorAll(".form-input")
		inputs.forEach(input => {
			// Фокус и блюр
			input.addEventListener("focus", () =>
				this.formEffects.onInputFocus(input)
			)
			input.addEventListener("blur", () => this.formEffects.onInputBlur(input))

			// Валидация в реальном времени
			input.addEventListener("input", () => {
				this.formValidator.validateField(input)
			})

			// Проверка автозаполнения
			this.checkAutofill(input)
		})
	}

	// Проверка автозаполнения браузера
	checkAutofill(input) {
		// Проверяем автозаполнение при загрузке
		setTimeout(() => {
			if (input.value) {
				const formGroup = input.closest(".form-group")
				formGroup.classList.add("filled")
			}
		}, 100)

		// Периодическая проверка для отлова автозаполнения
		const checkInterval = setInterval(() => {
			if (input.value) {
				const formGroup = input.closest(".form-group")
				formGroup.classList.add("filled")
				clearInterval(checkInterval)
			}
		}, 100)

		// Останавливаем проверку через 2 секунды
		setTimeout(() => clearInterval(checkInterval), 2000)
	}

	setupParallaxEffect() {
		if (window.innerWidth <= 768) return // Отключаем на мобильных

		const bgImage = document.querySelector(".contact-bg-image")
		if (!bgImage) return

		let ticking = false

		const updateParallax = () => {
			const scrolled = window.pageYOffset
			const rate = scrolled * -0.5
			bgImage.style.transform = `translateY(${rate}px)`
			ticking = false
		}

		window.addEventListener("scroll", () => {
			if (!ticking) {
				requestAnimationFrame(updateParallax)
				ticking = true
			}
		})
	}

	async handleSubmit(e) {
		e.preventDefault()

		// Валидация всей формы
		if (!this.formValidator.validateForm()) {
			return
		}

		const button = this.form.querySelector(".submit-button")
		const buttonText = button.querySelector(".button-text")
		const originalText = buttonText.textContent

		// Сбор данных формы
		const formData = new FormData(this.form)
		const data = Object.fromEntries(formData)

		// Начало отправки
		this.setButtonState(button, "sending", "Отправляется...")
		this.formEffects.createPulseEffect(button)

		try {
			// Здесь должна быть реальная отправка данных
			await this.submitForm(data)

			// Успешная отправка
			this.setButtonState(button, "success", "Отправлено!")
			this.formEffects.createConfettiEffect()

			// Сброс формы
			setTimeout(() => {
				this.resetForm(button, originalText)
			}, 2000)
		} catch (error) {
			// Обработка ошибки
			this.setButtonState(button, "error", "Ошибка")
			console.error("Ошибка отправки формы:", error)

			setTimeout(() => {
				this.setButtonState(button, null, originalText)
			}, 2000)
		}
	}

	setButtonState(button, state, text) {
		const buttonText = button.querySelector(".button-text")

		button.classList.remove("sending", "success", "error")

		if (state) {
			button.classList.add(state)
		}

		buttonText.textContent = text
		button.disabled = state !== null
	}

	async submitForm(data) {
		// Имитация отправки
		return new Promise(resolve => {
			setTimeout(resolve, 1500)
		})

		// Реальная отправка:
		// const response = await fetch('/api/contact', {
		//     method: 'POST',
		//     headers: {
		//         'Content-Type': 'application/json',
		//     },
		//     body: JSON.stringify(data)
		// });
		//
		// if (!response.ok) {
		//     throw new Error('Ошибка отправки');
		// }
		//
		// return response.json();
	}

	resetForm(button, originalText) {
		this.setButtonState(button, null, originalText)
		this.form.reset()
		this.formValidator.clearErrors()
		this.formEffects.resetFormLabels()
		this.countrySelector.reset()
	}
}

// ===============================================
// COUNTRY SELECTOR
// ===============================================

class CountrySelector {
	constructor() {
		this.button = document.querySelector(".country-button")
		this.dropdown = document.querySelector(".country-dropdown")
		this.list = document.querySelector(".country-list")
		this.searchInput = document.querySelector(".country-search-input")
		this.selectedFlag = document.querySelector(".selected-flag")
		this.phoneInput = document.querySelector(".phone-input")

		this.selectedCountryCode = "+1"
		this.isOpen = false

		if (this.button && this.dropdown) {
			this.init()
		}
	}

	init() {
		// События
		this.button.addEventListener("click", e => this.toggleDropdown(e))
		this.list.addEventListener("click", e => this.handleCountrySelect(e))
		this.searchInput.addEventListener("input", e => this.handleSearch(e))

		// Закрытие при клике вне
		document.addEventListener("click", this.handleOutsideClick.bind(this))

		// Закрытие по Escape
		document.addEventListener("keydown", e => {
			if (e.key === "Escape" && this.isOpen) {
				this.closeDropdown()
			}
		})

		// Настройка поля телефона
		this.setupPhoneInput()
	}

	handleOutsideClick(e) {
		if (!e.target.closest(".country-selector") && this.isOpen) {
			this.closeDropdown()
		}
	}

	toggleDropdown(e) {
		e.stopPropagation()

		if (this.isOpen) {
			this.closeDropdown()
		} else {
			this.openDropdown()
		}
	}

	openDropdown() {
		this.dropdown.classList.add("active")
		this.button.classList.add("active")
		this.button.setAttribute("aria-expanded", "true")
		this.searchInput.focus()
		this.isOpen = true
	}

	closeDropdown() {
		this.dropdown.classList.remove("active")
		this.button.classList.remove("active")
		this.button.setAttribute("aria-expanded", "false")
		this.searchInput.value = ""
		this.showAllCountries()
		this.isOpen = false
	}

	handleCountrySelect(e) {
		const item = e.target.closest("li")
		if (!item) return

		this.selectCountry(item)
	}

	selectCountry(item) {
		// Обновляем выделение
		this.list.querySelectorAll("li").forEach(li => {
			li.classList.remove("selected")
			li.setAttribute("aria-selected", "false")
		})

		item.classList.add("selected")
		item.setAttribute("aria-selected", "true")

		// Обновляем данные
		this.selectedCountryCode = item.dataset.code
		this.selectedFlag.textContent = item.dataset.flag

		// Обновляем поле телефона
		this.updatePhoneValue()

		// Закрываем dropdown
		this.closeDropdown()
		this.phoneInput.focus()
	}

	handleSearch(e) {
		const searchTerm = e.target.value.toLowerCase()
		const items = this.list.querySelectorAll("li")

		let hasResults = false

		items.forEach(item => {
			const text = item.textContent.toLowerCase()
			if (text.includes(searchTerm)) {
				item.style.display = ""
				hasResults = true
			} else {
				item.style.display = "none"
			}
		})

		// Можно добавить сообщение "Ничего не найдено"
	}

	showAllCountries() {
		const items = this.list.querySelectorAll("li")
		items.forEach(item => {
			item.style.display = ""
		})
	}

	setupPhoneInput() {
		// Форматирование при вводе
		this.phoneInput.addEventListener("input", e => {
			this.formatPhoneNumber(e)
		})

		// Предотвращение удаления кода страны
		this.phoneInput.addEventListener("keydown", e => {
			const cursorPosition = e.target.selectionStart
			const codeLength = this.selectedCountryCode.length + 1

			if (
				cursorPosition <= codeLength &&
				(e.key === "Backspace" || e.key === "Delete")
			) {
				e.preventDefault()
			}
		})

		// Установка начального значения
		this.updatePhoneValue()

		// Проверка заполненности при инициализации
		if (this.phoneInput.value.length > this.selectedCountryCode.length + 1) {
			const phoneGroup = this.phoneInput.closest(".phone-group")
			phoneGroup.classList.add("filled")
		}
	}

	formatPhoneNumber(e) {
		let value = e.target.value
		const countryCode = this.selectedCountryCode

		// Сохраняем позицию курсора
		const cursorPosition = e.target.selectionStart

		// Если код страны удален, восстанавливаем
		if (!value.startsWith(countryCode)) {
			value = countryCode + " " + value.replace(/[^\d]/g, "")
		}

		// Удаляем все кроме цифр и +
		const digits = value.replace(/[^\d+]/g, "")

		// Применяем форматирование
		const formatted = this.applyPhoneFormat(digits, countryCode)
		e.target.value = formatted

		// Восстанавливаем позицию курсора
		if (cursorPosition <= formatted.length) {
			e.target.setSelectionRange(cursorPosition, cursorPosition)
		}
	}

	applyPhoneFormat(digits, countryCode) {
		const formatters = {
			"+1": this.formatUS,
			"+7": this.formatRussia,
			"+44": this.formatUK,
			"+49": this.formatGermany,
			"+33": this.formatFrance,
			"+39": this.formatItaly,
			"+34": this.formatSpain,
			"+81": this.formatJapan,
			"+86": this.formatChina,
			"+91": this.formatIndia,
			"+55": this.formatBrazil,
			"+82": this.formatKorea,
		}

		const formatter = formatters[countryCode] || this.formatDefault
		return formatter.call(this, digits, countryCode)
	}

	// Форматы для разных стран
	formatUS(digits) {
		const match = digits.match(/^(\+1)(\d{0,3})(\d{0,3})(\d{0,4})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " (" + match[2]
		if (match[2] && match[2].length === 3) result += ")"
		if (match[3]) result += " " + match[3]
		if (match[4]) result += "-" + match[4]

		return result
	}

	formatRussia(digits) {
		const match = digits.match(/^(\+7)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " (" + match[2]
		if (match[2] && match[2].length === 3) result += ")"
		if (match[3]) result += " " + match[3]
		if (match[4]) result += "-" + match[4]
		if (match[5]) result += "-" + match[5]

		return result
	}

	formatUK(digits) {
		const match = digits.match(/^(\+44)(\d{0,4})(\d{0,6})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += " " + match[3]

		return result
	}

	formatGermany(digits) {
		const match = digits.match(/^(\+49)(\d{0,3})(\d{0,8})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += " " + match[3]

		return result
	}

	formatFrance(digits) {
		const match = digits.match(
			/^(\+33)(\d)(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/
		)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += " " + match[3]
		if (match[4]) result += " " + match[4]
		if (match[5]) result += " " + match[5]
		if (match[6]) result += " " + match[6]

		return result
	}

	formatItaly(digits) {
		const match = digits.match(/^(\+39)(\d{0,3})(\d{0,7})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += " " + match[3]

		return result
	}

	formatSpain(digits) {
		const match = digits.match(/^(\+34)(\d{0,3})(\d{0,3})(\d{0,3})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += " " + match[3]
		if (match[4]) result += " " + match[4]

		return result
	}

	formatJapan(digits) {
		const match = digits.match(/^(\+81)(\d{0,2})(\d{0,4})(\d{0,4})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += "-" + match[3]
		if (match[4]) result += "-" + match[4]

		return result
	}

	formatChina(digits) {
		const match = digits.match(/^(\+86)(\d{0,3})(\d{0,8})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += " " + match[3]

		return result
	}

	formatIndia(digits) {
		const match = digits.match(/^(\+91)(\d{0,5})(\d{0,5})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += " " + match[3]

		return result
	}

	formatBrazil(digits) {
		const match = digits.match(/^(\+55)(\d{0,2})(\d{0,5})(\d{0,4})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " (" + match[2]
		if (match[2] && match[2].length === 2) result += ")"
		if (match[3]) result += " " + match[3]
		if (match[4]) result += "-" + match[4]

		return result
	}

	formatKorea(digits) {
		const match = digits.match(/^(\+82)(\d{0,2})(\d{0,4})(\d{0,4})$/)
		if (!match) return digits

		let result = match[1]
		if (match[2]) result += " " + match[2]
		if (match[3]) result += "-" + match[3]
		if (match[4]) result += "-" + match[4]

		return result
	}

	formatDefault(digits, countryCode) {
		const codeLength = countryCode.length
		const numberPart = digits.substring(codeLength)

		if (numberPart.length > 0) {
			const groups = numberPart.match(/.{1,3}/g) || []
			return countryCode + " " + groups.join(" ")
		}

		return digits
	}

	updatePhoneValue() {
		this.phoneInput.value = this.selectedCountryCode + " "
		// Убираем класс filled при сбросе
		const phoneGroup = this.phoneInput.closest(".phone-group")
		phoneGroup.classList.remove("filled")
	}

	reset() {
		const defaultItem = this.list.querySelector('[data-code="+1"]')
		if (defaultItem) {
			this.selectCountry(defaultItem)
		}
		this.phoneInput.value = this.selectedCountryCode + " "
	}
}

// ===============================================
// FORM VALIDATOR
// ===============================================

class FormValidator {
	constructor(form) {
		this.form = form
		this.errors = {}
	}

	validateForm() {
		const inputs = this.form.querySelectorAll(".form-input")
		let isValid = true

		inputs.forEach(input => {
			if (!this.validateField(input)) {
				isValid = false
			}
		})

		return isValid
	}

	validateField(input) {
		const fieldName = input.name
		const value = input.value.trim()
		const formGroup = input.closest(".form-group")

		// Сброс ошибки
		this.clearFieldError(formGroup, fieldName)

		// Проверка обязательного поля
		if (input.hasAttribute("required") && !value) {
			this.setFieldError(formGroup, fieldName, "Это поле обязательно")
			return false
		}

		// Валидация по типу поля
		switch (input.type) {
			case "email":
				if (value && !this.isValidEmail(value)) {
					this.setFieldError(formGroup, fieldName, "Введите корректный email")
					return false
				}
				break

			case "tel":
				if (value && !this.isValidPhone(value)) {
					this.setFieldError(
						formGroup,
						fieldName,
						"Введите корректный номер телефона"
					)
					return false
				}
				break

			case "text":
				if (fieldName === "name" && value && value.length < 2) {
					this.setFieldError(
						formGroup,
						fieldName,
						"Имя должно содержать минимум 2 символа"
					)
					return false
				}
				break
		}

		return true
	}

	isValidEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return re.test(email)
	}

	isValidPhone(phone) {
		// Минимум 10 цифр после кода страны
		const digits = phone.replace(/[^\d]/g, "")
		return digits.length >= 10
	}

	setFieldError(formGroup, fieldName, message) {
		formGroup.classList.add("error")
		const errorElement = formGroup.querySelector(".form-error")
		if (errorElement) {
			errorElement.textContent = message
		}
		this.errors[fieldName] = message
	}

	clearFieldError(formGroup, fieldName) {
		formGroup.classList.remove("error")
		const errorElement = formGroup.querySelector(".form-error")
		if (errorElement) {
			errorElement.textContent = ""
		}
		delete this.errors[fieldName]
	}

	clearErrors() {
		const formGroups = this.form.querySelectorAll(".form-group")
		formGroups.forEach(group => {
			group.classList.remove("error")
			const errorElement = group.querySelector(".form-error")
			if (errorElement) {
				errorElement.textContent = ""
			}
		})
		this.errors = {}
	}
}

// ===============================================
// PARTICLE SYSTEM
// ===============================================

class ParticleSystem {
	constructor() {
		this.container = document.querySelector(".floating-particles")
		this.particleCount = this.isMobile() ? 15 : 30
		this.particles = []
	}

	create() {
		if (!this.container) return

		for (let i = 0; i < this.particleCount; i++) {
			this.createParticle(i)
		}
	}

	createParticle(index) {
		const particle = document.createElement("div")
		particle.className = "particle"

		// Параметры частицы
		const size = Math.random() * 4 + 2
		const duration = Math.random() * 20 + 20
		const delay = Math.random() * 20
		const startX = Math.random() * 100
		const drift = (Math.random() - 0.5) * 100

		particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${startX}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            --drift: ${drift}px;
        `

		this.container.appendChild(particle)
		this.particles.push(particle)
	}

	isMobile() {
		return window.innerWidth <= 768
	}
}

// ===============================================
// FORM EFFECTS
// ===============================================

class FormEffects {
	constructor() {
		this.confettiColors = [
			"#3b82f6",
			"#60a5fa",
			"#1d4ed8",
			"#06b6d4",
			"#0284c7",
			"#818cf8",
		]
	}

	onInputFocus(input) {
		const formGroup = input.closest(".form-group")
		formGroup.classList.add("focused")
	}

	onInputBlur(input) {
		const formGroup = input.closest(".form-group")
		formGroup.classList.remove("focused")

		if (input.value.trim()) {
			formGroup.classList.add("filled")
		} else {
			formGroup.classList.remove("filled")
		}
	}

	createPulseEffect(button) {
		const ripple = document.createElement("div")
		ripple.className = "pulse-effect"

		const rect = button.getBoundingClientRect()
		const size = Math.max(rect.width, rect.height)

		ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            animation: ripple-effect 0.6s ease-out;
            pointer-events: none;
        `

		button.appendChild(ripple)

		setTimeout(() => ripple.remove(), 600)
	}

	createConfettiEffect() {
		const container =
			document.querySelector(".contact-content") || document.body
		const confettiContainer = document.createElement("div")
		confettiContainer.className = "confetti-container"
		confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `

		container.appendChild(confettiContainer)

		const confettiCount = 40

		for (let i = 0; i < confettiCount; i++) {
			this.createConfettiParticle(confettiContainer, i)
		}

		setTimeout(() => confettiContainer.remove(), 3000)
	}

	createConfettiParticle(container, index) {
		const confetti = document.createElement("div")
		const color =
			this.confettiColors[
				Math.floor(Math.random() * this.confettiColors.length)
			]
		const size = Math.random() * 10 + 5
		const duration = Math.random() * 2 + 1
		const delay = Math.random() * 0.5

		// Позиция начала - центр кнопки
		const button = document.querySelector(".submit-button")
		const rect = button.getBoundingClientRect()
		const startX = rect.left + rect.width / 2
		const startY = rect.top + rect.height / 2

		// Направление полета
		const angle = (Math.PI * 2 * index) / 40
		const velocity = Math.random() * 300 + 200
		const endX = startX + Math.cos(angle) * velocity
		const endY = startY + Math.sin(angle) * velocity - 100

		confetti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${startX}px;
            top: ${startY}px;
            border-radius: 2px;
            animation: confetti-${index} ${duration}s ease-out ${delay}s;
            transform-origin: center;
        `

		// Создаем уникальную анимацию
		const style = document.createElement("style")
		style.textContent = `
            @keyframes confetti-${index} {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(${endX - startX}px, ${
			endY - startY
		}px) rotate(720deg) scale(1);
                    opacity: 0;
                }
            }
        `

		document.head.appendChild(style)
		container.appendChild(confetti)

		setTimeout(() => {
			confetti.remove()
			style.remove()
		}, (duration + delay) * 1000)
	}

	resetFormLabels() {
		const formGroups = document.querySelectorAll(".form-group")
		formGroups.forEach(group => {
			group.classList.remove("filled", "focused")
		})
	}
}

// ===============================================
// УТИЛИТЫ
// ===============================================

const Utils = {
	debounce(func, wait) {
		let timeout
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout)
				func(...args)
			}
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)
		}
	},

	throttle(func, limit) {
		let inThrottle
		return function (...args) {
			if (!inThrottle) {
				func.apply(this, args)
				inThrottle = true
				setTimeout(() => (inThrottle = false), limit)
			}
		}
	},
}

// ===============================================
// ИНИЦИАЛИЗАЦИЯ
// ===============================================

document.addEventListener("DOMContentLoaded", () => {
	// Инициализация формы
	const contactForm = new ContactForm()

	// Анимация при появлении в viewport
	const observerOptions = {
		threshold: 0.1,
		rootMargin: "0px 0px -50px 0px",
	}

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("visible")
				observer.unobserve(entry.target)
			}
		})
	}, observerOptions)

	// Наблюдаем за элементами
	const animatedElements = document.querySelectorAll(".contact-card")
	animatedElements.forEach(el => observer.observe(el))
})

// Экспорт для использования в других модулях
if (typeof module !== "undefined" && module.exports) {
	module.exports = {
		ContactForm,
		CountrySelector,
		FormValidator,
		ParticleSystem,
		FormEffects,
		Utils,
	}
}
