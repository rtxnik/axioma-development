/**
 * Унифицированная система кнопок - JavaScript
 * Добавляет интерактивность и дополнительную функциональность
 */

class ButtonSystem {
	constructor() {
		this.buttons = document.querySelectorAll(".btn")
		this.init()
	}

	init() {
		// Инициализация ripple эффекта
		this.initRippleEffect()

		// Инициализация загрузки
		this.initLoadingStates()

		// Инициализация групп кнопок
		this.initButtonGroups()

		// Инициализация копирования в буфер
		this.initCopyButtons()

		// Инициализация toggle кнопок
		this.initToggleButtons()

		// Инициализация счетчиков
		this.initCounterButtons()

		// Добавление keyboard navigation
		this.initKeyboardNavigation()
	}

	/**
	 * Ripple эффект при клике
	 */
	initRippleEffect() {
		document.querySelectorAll(".btn--ripple").forEach(button => {
			button.addEventListener("click", e => {
				const ripple = document.createElement("span")
				const rect = button.getBoundingClientRect()
				const size = Math.max(rect.width, rect.height)
				const x = e.clientX - rect.left - size / 2
				const y = e.clientY - rect.top - size / 2

				ripple.style.width = ripple.style.height = size + "px"
				ripple.style.left = x + "px"
				ripple.style.top = y + "px"
				ripple.classList.add("btn__ripple")

				// Добавляем стили для ripple
				if (!document.querySelector("style[data-ripple]")) {
					const style = document.createElement("style")
					style.setAttribute("data-ripple", "")
					style.textContent = `
						.btn__ripple {
							position: absolute;
							border-radius: 50%;
							background: rgba(255, 255, 255, 0.6);
							transform: scale(0);
							animation: rippleAnimation 0.6s ease-out;
							pointer-events: none;
						}
						@keyframes rippleAnimation {
							to {
								transform: scale(4);
								opacity: 0;
							}
						}
					`
					document.head.appendChild(style)
				}

				button.appendChild(ripple)

				setTimeout(() => {
					ripple.remove()
				}, 600)
			})
		})
	}

	/**
	 * Управление состояниями загрузки
	 */
	initLoadingStates() {
		// Пример API для управления загрузкой
		window.ButtonAPI = window.ButtonAPI || {}

		window.ButtonAPI.setLoading = (button, isLoading = true) => {
			if (typeof button === "string") {
				button = document.querySelector(button)
			}

			if (!button) return

			if (isLoading) {
				button.classList.add("btn--loading")
				button.disabled = true
				button.dataset.originalText = button.innerHTML
			} else {
				button.classList.remove("btn--loading")
				button.disabled = false
				if (button.dataset.originalText) {
					button.innerHTML = button.dataset.originalText
				}
			}
		}

		// Автоматическая загрузка для форм
		document.querySelectorAll("form[data-loading-button]").forEach(form => {
			form.addEventListener("submit", e => {
				const submitBtn = form.querySelector('[type="submit"]')
				if (submitBtn && submitBtn.classList.contains("btn")) {
					window.ButtonAPI.setLoading(submitBtn, true)
				}
			})
		})
	}

	/**
	 * Инициализация групп кнопок (радио-поведение)
	 */
	initButtonGroups() {
		document
			.querySelectorAll('.btn-group[data-toggle="buttons"]')
			.forEach(group => {
				const buttons = group.querySelectorAll(".btn")

				buttons.forEach(button => {
					button.addEventListener("click", () => {
						// Если это радио-группа
						if (group.dataset.type === "radio") {
							buttons.forEach(btn => btn.classList.remove("btn--active"))
							button.classList.add("btn--active")

							// Триггерим кастомное событие
							group.dispatchEvent(
								new CustomEvent("change", {
									detail: { value: button.dataset.value },
								})
							)
						}
						// Если это чекбокс-группа
						else if (group.dataset.type === "checkbox") {
							button.classList.toggle("btn--active")

							// Собираем все активные значения
							const values = Array.from(buttons)
								.filter(btn => btn.classList.contains("btn--active"))
								.map(btn => btn.dataset.value)

							group.dispatchEvent(
								new CustomEvent("change", {
									detail: { values },
								})
							)
						}
					})
				})
			})
	}

	/**
	 * Кнопки копирования в буфер обмена
	 */
	initCopyButtons() {
		document.querySelectorAll(".btn[data-copy]").forEach(button => {
			button.addEventListener("click", async () => {
				const textToCopy = button.dataset.copy
				const originalText = button.innerHTML

				try {
					await navigator.clipboard.writeText(textToCopy)

					// Визуальная обратная связь
					button.innerHTML =
						'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Скопировано!'
					button.classList.add("btn--success")

					setTimeout(() => {
						button.innerHTML = originalText
						button.classList.remove("btn--success")
					}, 2000)
				} catch (err) {
					console.error("Ошибка копирования:", err)
					button.innerHTML = "Ошибка!"
					button.classList.add("btn--danger")

					setTimeout(() => {
						button.innerHTML = originalText
						button.classList.remove("btn--danger")
					}, 2000)
				}
			})
		})
	}

	/**
	 * Toggle кнопки (вкл/выкл)
	 */
	initToggleButtons() {
		document.querySelectorAll('.btn[data-toggle="button"]').forEach(button => {
			button.addEventListener("click", () => {
				button.classList.toggle("btn--active")
				const isActive = button.classList.contains("btn--active")

				// Обновляем aria-pressed для доступности
				button.setAttribute("aria-pressed", isActive)

				// Если есть текст для состояний
				if (button.dataset.textOn && button.dataset.textOff) {
					const span = button.querySelector("span") || button
					span.textContent = isActive
						? button.dataset.textOn
						: button.dataset.textOff
				}

				// Триггерим событие
				button.dispatchEvent(
					new CustomEvent("toggle", {
						detail: { active: isActive },
					})
				)
			})
		})
	}

	/**
	 * Кнопки со счетчиком
	 */
	initCounterButtons() {
		document.querySelectorAll(".btn[data-counter]").forEach(button => {
			let count = parseInt(button.dataset.counter) || 0

			// Создаем badge для счетчика
			const badge = document.createElement("span")
			badge.className = "btn__badge"
			badge.textContent = count
			badge.style.cssText = `
				position: absolute;
				top: -8px;
				right: -8px;
				background: var(--color-error);
				color: white;
				border-radius: 10px;
				padding: 2px 6px;
				font-size: 11px;
				font-weight: bold;
				min-width: 18px;
				text-align: center;
			`

			if (count > 0) {
				button.style.position = "relative"
				button.appendChild(badge)
			}

			button.addEventListener("click", () => {
				count++
				badge.textContent = count

				if (count === 1) {
					button.style.position = "relative"
					button.appendChild(badge)
				}

				// Анимация badge
				badge.style.transform = "scale(1.2)"
				setTimeout(() => {
					badge.style.transform = "scale(1)"
				}, 200)
			})
		})
	}

	/**
	 * Keyboard navigation для групп кнопок
	 */
	initKeyboardNavigation() {
		document.querySelectorAll(".btn-group").forEach(group => {
			const buttons = Array.from(group.querySelectorAll(".btn"))

			buttons.forEach((button, index) => {
				button.addEventListener("keydown", e => {
					let targetIndex = index

					switch (e.key) {
						case "ArrowLeft":
						case "ArrowUp":
							e.preventDefault()
							targetIndex = index > 0 ? index - 1 : buttons.length - 1
							break
						case "ArrowRight":
						case "ArrowDown":
							e.preventDefault()
							targetIndex = index < buttons.length - 1 ? index + 1 : 0
							break
						case "Home":
							e.preventDefault()
							targetIndex = 0
							break
						case "End":
							e.preventDefault()
							targetIndex = buttons.length - 1
							break
					}

					if (targetIndex !== index) {
						buttons[targetIndex].focus()

						// Если это радио-группа, активируем кнопку
						if (group.dataset.type === "radio") {
							buttons[targetIndex].click()
						}
					}
				})
			})
		})
	}

	/**
	 * Утилита для программного создания кнопок
	 */
	static createButton(options = {}) {
		const {
			text = "Button",
			type = "primary",
			size = "md",
			icon = null,
			iconPosition = "left",
			className = "",
			attributes = {},
			onClick = null,
		} = options

		const button = document.createElement("button")
		button.className = `btn btn--${type} ${
			size !== "md" ? `btn--${size}` : ""
		} ${className}`.trim()

		// Добавляем иконку если есть
		if (icon) {
			const iconElement = document.createElement("span")
			iconElement.innerHTML = icon

			if (iconPosition === "right") {
				button.innerHTML = `<span>${text}</span>`
				button.appendChild(iconElement)
				button.classList.add("btn--icon-right")
			} else {
				button.appendChild(iconElement)
				button.innerHTML += `<span>${text}</span>`
				button.classList.add("btn--icon-left")
			}
		} else {
			button.textContent = text
		}

		// Добавляем атрибуты
		Object.entries(attributes).forEach(([key, value]) => {
			button.setAttribute(key, value)
		})

		// Добавляем обработчик клика
		if (onClick) {
			button.addEventListener("click", onClick)
		}

		return button
	}

	/**
	 * Утилита для создания группы кнопок
	 */
	static createButtonGroup(buttons = [], options = {}) {
		const {
			type = "radio", // 'radio' или 'checkbox'
			vertical = false,
			className = "",
		} = options

		const group = document.createElement("div")
		group.className = `btn-group ${
			vertical ? "btn-group--vertical" : ""
		} ${className}`.trim()
		group.dataset.toggle = "buttons"
		group.dataset.type = type

		buttons.forEach(btnOptions => {
			const button = ButtonSystem.createButton(btnOptions)
			group.appendChild(button)
		})

		// Инициализируем группу
		new ButtonSystem().initButtonGroups()

		return group
	}
}

// Автоматическая инициализация при загрузке DOM
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => {
		window.buttonSystem = new ButtonSystem()
	})
} else {
	window.buttonSystem = new ButtonSystem()
}

// Экспортируем для использования в модулях
if (typeof module !== "undefined" && module.exports) {
	module.exports = ButtonSystem
}
