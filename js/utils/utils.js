/**
 * Утилиты и вспомогательные функции - Оптимизированная версия для мобильных
 */
import { CONFIG } from "../config/config.js"

export const Utils = {
	/**
	 * Оптимизированная Debounce функция
	 */
	debounce(func, wait, immediate = false) {
		let timeout
		let lastCallTime = 0

		return function executedFunction(...args) {
			const context = this
			const currentTime = Date.now()

			if (currentTime - lastCallTime < wait / 2 && !immediate) {
				return
			}

			lastCallTime = currentTime

			const later = () => {
				timeout = null
				if (!immediate) func.apply(context, args)
			}

			const callNow = immediate && !timeout
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)

			if (callNow) func.apply(context, args)
		}
	},

	/**
	 * Оптимизированная Throttle функция с trailing call
	 */
	throttle(func, limit, options = {}) {
		let waiting = false
		let lastArgs = null
		let lastContext = null
		const { leading = true, trailing = true } = options

		const later = () => {
			if (trailing && lastArgs) {
				func.apply(lastContext, lastArgs)
				lastArgs = null
				lastContext = null
				setTimeout(later, limit)
			} else {
				waiting = false
			}
		}

		return function throttled(...args) {
			if (!waiting) {
				if (leading) {
					func.apply(this, args)
				}
				waiting = true
				setTimeout(later, limit)
			} else if (trailing) {
				lastArgs = args
				lastContext = this
			}
		}
	},

	/**
	 * ИСПРАВЛЕНО: Оптимизированная плавная прокрутка с поддержкой мобильных
	 */
	smoothScrollTo(
		target,
		duration = CONFIG.scroll.smoothDuration,
		options = {}
	) {
		const {
			easing = "easeOutCubic",
			callback = null,
			offset = 0,
			interruptible = true,
		} = options

		const isMobile = Utils.isMobile()

		// ИСПРАВЛЕНО: На мобильных используем нативный smooth scroll
		if (isMobile) {
			const targetPosition = target - offset

			window.scrollTo({
				top: targetPosition,
				behavior: "smooth",
			})

			// Симулируем callback через setTimeout
			if (callback) {
				// Примерная длительность нативного скролла
				const estimatedDuration = Math.min(duration, 800)
				setTimeout(callback, estimatedDuration)
			}

			return () => {} // Возвращаем пустую функцию отмены
		}

		// Кастомная прокрутка только для десктопа
		const start = window.pageYOffset
		const distance = target - start - offset

		// Если расстояние минимальное, переходим мгновенно
		if (Math.abs(distance) < 2) {
			window.scrollTo(0, target)
			if (callback) callback()
			return
		}

		let startTime = null
		let animationId = null
		let isInterrupted = false

		// Функции плавности
		const easingFunctions = {
			linear: t => t,
			easeOutCubic: t => 1 - Math.pow(1 - t, 3),
			easeInOutCubic: t =>
				t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
			easeOutQuart: t => 1 - Math.pow(1 - t, 4),
			easeOutExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
		}

		const easingFunction =
			easingFunctions[easing] || easingFunctions.easeOutCubic

		// ИСПРАВЛЕНО: Убираем обработчики прерывания на мобильных
		const handleUserScroll = () => {
			if (interruptible) {
				isInterrupted = true
				if (animationId) {
					cancelAnimationFrame(animationId)
				}
				cleanup()
			}
		}

		// Слушаем события прерывания только на десктопе
		if (interruptible && !isMobile) {
			window.addEventListener("wheel", handleUserScroll, {
				passive: true,
				once: true,
			})
			window.addEventListener("touchstart", handleUserScroll, {
				passive: true,
				once: true,
			})
		}

		const cleanup = () => {
			window.removeEventListener("wheel", handleUserScroll)
			window.removeEventListener("touchstart", handleUserScroll)
		}

		const animate = currentTime => {
			if (isInterrupted) return

			if (!startTime) startTime = currentTime

			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			const easeProgress = easingFunction(progress)
			const currentPosition = start + distance * easeProgress

			window.scrollTo(0, currentPosition)

			if (progress < 1) {
				animationId = requestAnimationFrame(animate)
			} else {
				window.scrollTo(0, target)
				cleanup()
				if (callback) callback()
			}
		}

		animationId = requestAnimationFrame(animate)

		// Возвращаем функцию отмены
		return () => {
			isInterrupted = true
			if (animationId) {
				cancelAnimationFrame(animationId)
			}
			cleanup()
		}
	},

	/**
	 * ИСПРАВЛЕНО: Проверка мобильного устройства с кэшированием и оптимизацией
	 */
	isMobile: (() => {
		let cached = null
		let lastCheck = 0
		const cacheTime = 1000

		return () => {
			const now = Date.now()
			if (cached !== null && now - lastCheck < cacheTime) {
				return cached
			}

			// ИСПРАВЛЕНО: Более точное определение мобильных устройств
			cached =
				window.innerWidth <= CONFIG.mobile.breakpoint ||
				"ontouchstart" in window ||
				navigator.maxTouchPoints > 0 ||
				/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					navigator.userAgent
				)

			lastCheck = now
			return cached
		}
	})(),

	/**
	 * ДОБАВЛЕНО: Проверка поддержки smooth scroll
	 */
	supportsSmoothScroll() {
		return "scrollBehavior" in document.documentElement.style
	},

	/**
	 * Проверка поддержки функций
	 */
	supportsFeature(feature) {
		const features = {
			intersectionObserver: "IntersectionObserver" in window,
			smoothScroll: "scrollBehavior" in document.documentElement.style,
			webp: false,
			passiveListeners: (() => {
				let supportsPassive = false
				try {
					const opts = Object.defineProperty({}, "passive", {
						get: () => {
							supportsPassive = true
						},
					})
					window.addEventListener("testPassive", null, opts)
					window.removeEventListener("testPassive", null, opts)
				} catch (e) {}
				return supportsPassive
			})(),
			touchEvents: "ontouchstart" in window,
			pointerEvents: "PointerEvent" in window,
			customElements: "customElements" in window,
			webgl: (() => {
				try {
					const canvas = document.createElement("canvas")
					return !!(
						window.WebGLRenderingContext &&
						(canvas.getContext("webgl") ||
							canvas.getContext("experimental-webgl"))
					)
				} catch (e) {
					return false
				}
			})(),
			serviceWorker: "serviceWorker" in navigator,
			networkInformation:
				"connection" in navigator || "mozConnection" in navigator,
			deviceMemory: "deviceMemory" in navigator,
			hardwareConcurrency: "hardwareConcurrency" in navigator,
			requestIdleCallback: "requestIdleCallback" in window,
			webAnimations: "animate" in Element.prototype,
			resizeObserver: "ResizeObserver" in window,
		}

		return features[feature] || false
	},

	/**
	 * ИСПРАВЛЕНО: Оптимизированная функция для пакетной обработки DOM операций
	 */
	batchDOM(operations) {
		const reads = []
		const writes = []

		operations.forEach(op => {
			if (op.type === "read") {
				reads.push(op.fn)
			} else if (op.type === "write") {
				writes.push(op.fn)
			}
		})

		// Сначала все чтения
		const readResults = reads.map(fn => fn())

		// ИСПРАВЛЕНО: Используем requestAnimationFrame только если нет reduce motion
		const executeWrites = () => {
			writes.forEach((fn, index) => {
				fn(readResults[index])
			})
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			executeWrites()
		} else {
			requestAnimationFrame(executeWrites)
		}
	},

	/**
	 * Функция для ленивой загрузки скриптов
	 */
	loadScript(src, options = {}) {
		return new Promise((resolve, reject) => {
			const {
				async = true,
				defer = false,
				crossOrigin = null,
				onProgress = null,
			} = options

			const existingScript = document.querySelector(`script[src="${src}"]`)
			if (existingScript) {
				resolve(existingScript)
				return
			}

			const script = document.createElement("script")
			script.src = src
			script.async = async
			script.defer = defer

			if (crossOrigin) {
				script.crossOrigin = crossOrigin
			}

			script.onload = () => resolve(script)
			script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

			if (onProgress && "onprogress" in script) {
				script.onprogress = onProgress
			}

			document.head.appendChild(script)
		})
	},

	/**
	 * Функция для предзагрузки изображений
	 */
	preloadImage(src) {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.onload = () => resolve(img)
			img.onerror = reject
			img.src = src
		})
	},

	/**
	 * Функция для предзагрузки видео
	 */
	preloadVideo(src) {
		return new Promise((resolve, reject) => {
			const video = document.createElement("video")
			video.preload = "metadata"

			video.onloadedmetadata = () => resolve(video)
			video.onerror = reject

			video.src = src
		})
	},

	/**
	 * ИСПРАВЛЕНО: Оптимизированная функция для определения видимости элемента
	 */
	isElementVisible(element, threshold = 0) {
		// ДОБАВЛЕНО: Быстрая проверка на скрытые элементы
		if (!element || element.offsetParent === null) {
			return false
		}

		const rect = element.getBoundingClientRect()
		const windowHeight =
			window.innerHeight || document.documentElement.clientHeight
		const windowWidth =
			window.innerWidth || document.documentElement.clientWidth

		const vertInView =
			rect.top - threshold <= windowHeight && rect.bottom + threshold >= 0
		const horInView =
			rect.left - threshold <= windowWidth && rect.right + threshold >= 0

		return vertInView && horInView
	},

	/**
	 * ИСПРАВЛЕНО: Функция для получения оптимального качества видео
	 */
	getOptimalVideoQuality() {
		// ДОБАВЛЕНО: Быстрая проверка для слабых устройств
		if (Utils.isMobile()) {
			const deviceMemory = navigator.deviceMemory || 4
			const hardwareConcurrency = navigator.hardwareConcurrency || 4

			// Для очень слабых мобильных устройств
			if (deviceMemory < 3 || hardwareConcurrency < 4) {
				return "minimal"
			}
		}

		const connection =
			navigator.connection ||
			navigator.mozConnection ||
			navigator.webkitConnection

		if (connection) {
			const effectiveType = connection.effectiveType
			const downlink = connection.downlink

			if (effectiveType === "slow-2g" || effectiveType === "2g") {
				return "minimal"
			} else if (effectiveType === "3g") {
				return "low"
			} else if (effectiveType === "4g" && downlink > 5) {
				return "high"
			}
		}

		if (window.innerWidth < 768) {
			return "low"
		} else if (window.innerWidth < 1920) {
			return "medium"
		}

		return "high"
	},

	/**
	 * Функция для форматирования времени
	 */
	formatTime(seconds) {
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`
	},

	/**
	 * Функция для копирования в буфер обмена
	 */
	async copyToClipboard(text) {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text)
				return true
			} else {
				const textarea = document.createElement("textarea")
				textarea.value = text
				textarea.style.position = "fixed"
				textarea.style.opacity = "0"
				document.body.appendChild(textarea)
				textarea.select()
				const success = document.execCommand("copy")
				document.body.removeChild(textarea)
				return success
			}
		} catch (error) {
			console.error("Failed to copy:", error)
			return false
		}
	},

	/**
	 * Функция для генерации уникального ID
	 */
	generateId(prefix = "id") {
		return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
	},

	/**
	 * Функция для безопасного парсинга JSON
	 */
	safeJsonParse(json, fallback = null) {
		try {
			return JSON.parse(json)
		} catch (e) {
			console.warn("Failed to parse JSON:", e)
			return fallback
		}
	},

	/**
	 * ДОБАВЛЕНО: Функция для определения типа устройства
	 */
	getDeviceType() {
		if (Utils.isMobile()) {
			return window.innerWidth < 768 ? "phone" : "tablet"
		}
		return "desktop"
	},

	/**
	 * ДОБАВЛЕНО: Функция для оптимизации производительности на слабых устройствах
	 */
	isLowPerformanceDevice() {
		const deviceMemory = navigator.deviceMemory || 4
		const hardwareConcurrency = navigator.hardwareConcurrency || 4

		return deviceMemory < 4 || hardwareConcurrency < 4 || Utils.isMobile()
	},

	/**
	 * ДОБАВЛЕНО: Функция для детекции медленного соединения
	 */
	isSlowConnection() {
		const connection =
			navigator.connection ||
			navigator.mozConnection ||
			navigator.webkitConnection

		if (connection) {
			return (
				connection.effectiveType === "slow-2g" ||
				connection.effectiveType === "2g" ||
				connection.effectiveType === "3g" ||
				(connection.effectiveType === "4g" && connection.downlink < 1.5)
			)
		}

		return false
	},

	/**
	 * ДОБАВЛЕНО: Функция для настройки производительности
	 */
	optimizeForDevice() {
		const isLowPerf = Utils.isLowPerformanceDevice()
		const isSlow = Utils.isSlowConnection()

		if (isLowPerf || isSlow) {
			// Отключаем сложные анимации
			document.documentElement.classList.add("low-performance")

			// Уменьшаем частоту обновлений
			CONFIG.performance.throttleDelay = 32
			CONFIG.performance.scrollThrottle = 50

			// Отключаем параллакс эффекты
			CONFIG.mobile.disableEffects = true
		}
	},
}
