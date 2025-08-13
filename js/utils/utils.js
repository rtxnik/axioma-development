/**
 * Утилиты и вспомогательные функции - Оптимизированная версия
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

			// Проверяем, не слишком ли часто вызывается функция
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
	 * Оптимизированная плавная прокрутка с поддержкой прерывания
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

		// Обработчик прерывания скролла пользователем
		const handleUserScroll = () => {
			if (interruptible) {
				isInterrupted = true
				if (animationId) {
					cancelAnimationFrame(animationId)
				}
				cleanup()
			}
		}

		// Слушаем события прерывания
		if (interruptible) {
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
				// Финальная позиция
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
	 * Проверка мобильного устройства с кэшированием
	 */
	isMobile: (() => {
		let cached = null
		let lastCheck = 0
		const cacheTime = 1000 // 1 секунда

		return () => {
			const now = Date.now()
			if (cached !== null && now - lastCheck < cacheTime) {
				return cached
			}

			cached =
				window.innerWidth <= CONFIG.mobile.breakpoint ||
				"ontouchstart" in window ||
				navigator.maxTouchPoints > 0

			lastCheck = now
			return cached
		}
	})(),

	/**
	 * Проверка поддержки функций
	 */
	supportsFeature(feature) {
		const features = {
			intersectionObserver: "IntersectionObserver" in window,
			smoothScroll: "scrollBehavior" in document.documentElement.style,
			webp: false, // Требует асинхронной проверки
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
	 * Оптимизированная функция для пакетной обработки DOM операций
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

		// Затем все записи
		requestAnimationFrame(() => {
			writes.forEach((fn, index) => {
				fn(readResults[index])
			})
		})
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

			// Проверяем, не загружен ли уже скрипт
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

			// Добавляем прогресс загрузки если поддерживается
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
	 * Оптимизированная функция для определения видимости элемента
	 */
	isElementVisible(element, threshold = 0) {
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
	 * Функция для получения оптимального качества видео
	 */
	getOptimalVideoQuality() {
		// Проверяем тип соединения
		const connection =
			navigator.connection ||
			navigator.mozConnection ||
			navigator.webkitConnection

		if (connection) {
			const effectiveType = connection.effectiveType
			const downlink = connection.downlink

			// Определяем качество на основе типа соединения
			if (effectiveType === "slow-2g" || effectiveType === "2g") {
				return "low"
			} else if (effectiveType === "3g") {
				return "medium"
			} else if (effectiveType === "4g" && downlink > 5) {
				return "high"
			}
		}

		// Проверяем размер экрана
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
				// Fallback для старых браузеров
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
}
