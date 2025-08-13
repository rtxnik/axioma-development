/**
 * Утилиты для навигации - вспомогательные функции
 */

/**
 * Определение типа устройства и браузера
 */
export const DeviceDetector = {
	/**
	 * Проверка iOS устройства
	 */
	isIOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
	},

	/**
	 * Проверка Android устройства
	 */
	isAndroid() {
		return /Android/.test(navigator.userAgent)
	},

	/**
	 * Проверка мобильного устройства
	 */
	isMobile() {
		return (
			this.isIOS() ||
			this.isAndroid() ||
			/webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent)
		)
	},

	/**
	 * Проверка touch устройства
	 */
	isTouchDevice() {
		return (
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0 ||
			navigator.msMaxTouchPoints > 0
		)
	},

	/**
	 * Проверка Safari браузера
	 */
	isSafari() {
		return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
	},

	/**
	 * Проверка поддержки hover
	 */
	hasHoverSupport() {
		return window.matchMedia("(hover: hover)").matches
	},

	/**
	 * Получение типа pointer устройства
	 */
	getPointerType() {
		if (window.matchMedia("(pointer: coarse)").matches) return "coarse"
		if (window.matchMedia("(pointer: fine)").matches) return "fine"
		return "none"
	},
}

/**
 * Утилиты для позиционирования элементов
 */
export const PositionUtils = {
	/**
	 * Получение координат элемента относительно viewport
	 */
	getElementRect(element) {
		if (!element) return null
		const rect = element.getBoundingClientRect()
		return {
			top: rect.top,
			right: rect.right,
			bottom: rect.bottom,
			left: rect.left,
			width: rect.width,
			height: rect.height,
			centerX: rect.left + rect.width / 2,
			centerY: rect.top + rect.height / 2,
		}
	},

	/**
	 * Проверка видимости элемента во viewport
	 */
	isInViewport(element, partially = true) {
		const rect = this.getElementRect(element)
		if (!rect) return false

		const windowHeight =
			window.innerHeight || document.documentElement.clientHeight
		const windowWidth =
			window.innerWidth || document.documentElement.clientWidth

		if (partially) {
			// Частично видим
			return (
				rect.bottom > 0 &&
				rect.top < windowHeight &&
				rect.right > 0 &&
				rect.left < windowWidth
			)
		} else {
			// Полностью видим
			return (
				rect.top >= 0 &&
				rect.bottom <= windowHeight &&
				rect.left >= 0 &&
				rect.right <= windowWidth
			)
		}
	},

	/**
	 * Вычисление оптимальной позиции для dropdown
	 */
	calculateDropdownPosition(trigger, dropdown, options = {}) {
		const {
			preferredDirection = "bottom",
			margin = 10,
			viewport = {
				top: 0,
				left: 0,
				right: window.innerWidth,
				bottom: window.innerHeight,
			},
		} = options

		const triggerRect = this.getElementRect(trigger)
		const dropdownRect = this.getElementRect(dropdown)

		if (!triggerRect || !dropdownRect) return null

		let position = {
			top: "auto",
			left: "auto",
			right: "auto",
			bottom: "auto",
		}

		// Вычисляем доступное пространство
		const spaceAbove = triggerRect.top - viewport.top
		const spaceBelow = viewport.bottom - triggerRect.bottom
		const spaceLeft = triggerRect.left - viewport.left
		const spaceRight = viewport.right - triggerRect.right

		// Определяем вертикальную позицию
		if (
			preferredDirection === "bottom" &&
			spaceBelow >= dropdownRect.height + margin
		) {
			position.top = triggerRect.bottom + margin
		} else if (spaceAbove >= dropdownRect.height + margin) {
			position.bottom = viewport.bottom - triggerRect.top + margin
		} else {
			// Не хватает места, показываем там где больше места
			if (spaceBelow > spaceAbove) {
				position.top = triggerRect.bottom + margin
			} else {
				position.bottom = viewport.bottom - triggerRect.top + margin
			}
		}

		// Определяем горизонтальную позицию
		if (spaceRight >= dropdownRect.width) {
			position.left = triggerRect.left
		} else if (spaceLeft >= dropdownRect.width) {
			position.right = viewport.right - triggerRect.right
		} else {
			// Центрируем если не хватает места
			const centerX = triggerRect.centerX
			position.left = Math.max(
				margin,
				Math.min(
					centerX - dropdownRect.width / 2,
					viewport.right - dropdownRect.width - margin
				)
			)
		}

		return position
	},

	/**
	 * Проверка столкновения элементов
	 */
	checkCollision(element1, element2) {
		const rect1 = this.getElementRect(element1)
		const rect2 = this.getElementRect(element2)

		if (!rect1 || !rect2) return false

		return !(
			rect1.right < rect2.left ||
			rect1.left > rect2.right ||
			rect1.bottom < rect2.top ||
			rect1.top > rect2.bottom
		)
	},
}

/**
 * Утилиты для анимаций
 */
export const AnimationUtils = {
	/**
	 * Анимация числа
	 */
	animateNumber(element, start, end, duration = 1000) {
		const startTime = performance.now()
		const difference = end - start

		const animate = currentTime => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			const value = start + difference * this.easeOutCubic(progress)
			element.textContent = Math.round(value)

			if (progress < 1) {
				requestAnimationFrame(animate)
			}
		}

		requestAnimationFrame(animate)
	},

	/**
	 * Плавная прокрутка к элементу
	 */
	scrollToElement(element, options = {}) {
		const {
			duration = 800,
			offset = 0,
			easing = "easeOutCubic",
			callback = null,
		} = options

		const targetPosition =
			element.getBoundingClientRect().top + window.pageYOffset - offset
		const startPosition = window.pageYOffset
		const distance = targetPosition - startPosition

		let startTime = null

		const easingFunctions = {
			linear: t => t,
			easeOutCubic: t => 1 - Math.pow(1 - t, 3),
			easeInOutCubic: t =>
				t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
			easeOutQuart: t => 1 - Math.pow(1 - t, 4),
		}

		const easingFunction =
			easingFunctions[easing] || easingFunctions.easeOutCubic

		const animation = currentTime => {
			if (!startTime) startTime = currentTime
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			window.scrollTo(0, startPosition + distance * easingFunction(progress))

			if (progress < 1) {
				requestAnimationFrame(animation)
			} else if (callback) {
				callback()
			}
		}

		requestAnimationFrame(animation)
	},

	/**
	 * Fade In анимация
	 */
	fadeIn(element, duration = 300) {
		element.style.opacity = "0"
		element.style.display = "block"

		const startTime = performance.now()

		const animate = currentTime => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			element.style.opacity = progress

			if (progress < 1) {
				requestAnimationFrame(animate)
			}
		}

		requestAnimationFrame(animate)
	},

	/**
	 * Fade Out анимация
	 */
	fadeOut(element, duration = 300, callback) {
		const startTime = performance.now()
		const startOpacity = parseFloat(window.getComputedStyle(element).opacity)

		const animate = currentTime => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			element.style.opacity = startOpacity * (1 - progress)

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				element.style.display = "none"
				if (callback) callback()
			}
		}

		requestAnimationFrame(animate)
	},

	/**
	 * Slide Toggle анимация
	 */
	slideToggle(element, duration = 300) {
		if (window.getComputedStyle(element).display === "none") {
			this.slideDown(element, duration)
		} else {
			this.slideUp(element, duration)
		}
	},

	/**
	 * Slide Down анимация
	 */
	slideDown(element, duration = 300) {
		element.style.display = "block"
		const height = element.scrollHeight
		element.style.overflow = "hidden"
		element.style.height = "0"

		const startTime = performance.now()

		const animate = currentTime => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			element.style.height = `${height * this.easeOutCubic(progress)}px`

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				element.style.height = ""
				element.style.overflow = ""
			}
		}

		requestAnimationFrame(animate)
	},

	/**
	 * Slide Up анимация
	 */
	slideUp(element, duration = 300) {
		const height = element.scrollHeight
		element.style.overflow = "hidden"

		const startTime = performance.now()

		const animate = currentTime => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			element.style.height = `${height * (1 - this.easeOutCubic(progress))}px`

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				element.style.display = "none"
				element.style.height = ""
				element.style.overflow = ""
			}
		}

		requestAnimationFrame(animate)
	},

	/**
	 * Easing функция
	 */
	easeOutCubic(t) {
		return 1 - Math.pow(1 - t, 3)
	},
}

/**
 * Утилиты для работы с DOM
 */
export const DOMUtils = {
	/**
	 * Безопасный querySelector
	 */
	$(selector, parent = document) {
		return parent.querySelector(selector)
	},

	/**
	 * Безопасный querySelectorAll
	 */
	$$(selector, parent = document) {
		return Array.from(parent.querySelectorAll(selector))
	},

	/**
	 * Создание элемента с атрибутами
	 */
	createElement(tag, attributes = {}, children = []) {
		const element = document.createElement(tag)

		Object.entries(attributes).forEach(([key, value]) => {
			if (key === "className") {
				element.className = value
			} else if (key === "style" && typeof value === "object") {
				Object.assign(element.style, value)
			} else if (key.startsWith("on")) {
				element.addEventListener(key.slice(2).toLowerCase(), value)
			} else {
				element.setAttribute(key, value)
			}
		})

		children.forEach(child => {
			if (typeof child === "string") {
				element.appendChild(document.createTextNode(child))
			} else if (child instanceof Node) {
				element.appendChild(child)
			}
		})

		return element
	},

	/**
	 * Удаление элемента
	 */
	removeElement(element) {
		if (element && element.parentNode) {
			element.parentNode.removeChild(element)
		}
	},

	/**
	 * Вставка элемента после другого
	 */
	insertAfter(newElement, referenceElement) {
		referenceElement.parentNode.insertBefore(
			newElement,
			referenceElement.nextSibling
		)
	},

	/**
	 * Обертка элемента
	 */
	wrapElement(element, wrapper) {
		element.parentNode.insertBefore(wrapper, element)
		wrapper.appendChild(element)
	},

	/**
	 * Проверка наличия класса
	 */
	hasClass(element, className) {
		return element.classList.contains(className)
	},

	/**
	 * Переключение класса
	 */
	toggleClass(element, className, force) {
		return element.classList.toggle(className, force)
	},

	/**
	 * Получение/установка data атрибута
	 */
	data(element, key, value) {
		if (value === undefined) {
			return element.dataset[key]
		} else {
			element.dataset[key] = value
		}
	},
}

/**
 * Утилиты для событий
 */
export const EventUtils = {
	/**
	 * Делегирование событий
	 */
	delegate(parent, selector, event, handler) {
		parent.addEventListener(event, e => {
			const target = e.target.closest(selector)
			if (target && parent.contains(target)) {
				handler.call(target, e)
			}
		})
	},

	/**
	 * Одноразовый обработчик
	 */
	once(element, event, handler) {
		const onceHandler = e => {
			handler.call(element, e)
			element.removeEventListener(event, onceHandler)
		}
		element.addEventListener(event, onceHandler)
	},

	/**
	 * Trigger custom event
	 */
	trigger(element, eventName, detail = {}) {
		const event = new CustomEvent(eventName, {
			detail,
			bubbles: true,
			cancelable: true,
		})
		return element.dispatchEvent(event)
	},

	/**
	 * Предотвращение множественных кликов
	 */
	preventDoubleClick(element, handler, delay = 300) {
		let clicking = false

		element.addEventListener("click", e => {
			if (clicking) return
			clicking = true

			handler.call(element, e)

			setTimeout(() => {
				clicking = false
			}, delay)
		})
	},
}

/**
 * Экспорт всех утилит
 */
export default {
	DeviceDetector,
	PositionUtils,
	AnimationUtils,
	DOMUtils,
	EventUtils,
}
