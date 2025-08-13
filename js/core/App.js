/**
 * Главный класс приложения - Оптимизированная версия
 */
import { CONFIG } from "../config/config.js"
import { FormManager } from "../modules/FormManager.js"
import { LazyLoadManager } from "../modules/LazyLoadManager.js"
import { LicenseModal } from "../modules/LicenseModal.js"
import { LoadingManager } from "../modules/LoadingManager.js"
import { NavigationManager } from "../modules/NavigationManager.js"
import { ScrollAnimationManager } from "../modules/ScrollAnimationManager.js"
import { VideoManager } from "../modules/VideoManager.js"

export class App {
	constructor() {
		this.modules = {}
		this.performance = {
			startTime: performance.now(),
			metrics: {},
		}
	}

	init() {
		// Оптимизация: Инициализация в правильном порядке
		this.setupPerformanceOptimizations()

		// Проверка поддержки
		this.checkSupport()

		// Инициализация критичных модулей
		this.initCriticalModules()

		// Инициализация некритичных модулей после загрузки
		this.initDeferredModules()

		// Настройка обработки ошибок
		this.setupErrorHandling()

		// Логирование производительности
		this.logPerformance()
	}

	/**
	 * Настройка оптимизаций производительности
	 */
	setupPerformanceOptimizations() {
		// Включаем passive listeners глобально где возможно
		if (CONFIG.performance.usePassiveListeners) {
			this.setupPassiveListeners()
		}

		// Настройка GPU ускорения
		if (CONFIG.performance.enableGPUAcceleration) {
			document.documentElement.style.willChange = "auto"
		}

		// Оптимизация для мобильных
		if (this.isMobile()) {
			this.optimizeForMobile()
		}

		// Предотвращение layout thrashing
		this.preventLayoutThrashing()
	}

	/**
	 * Инициализация критичных модулей
	 */
	initCriticalModules() {
		// Loading должен быть первым
		this.modules.loading = new LoadingManager()

		// Video критичен для hero секции
		this.modules.video = new VideoManager(this.modules.loading)

		// Navigation критична для UX
		this.modules.navigation = new NavigationManager()

		// Глобальные ссылки
		window.loadingManager = this.modules.loading
	}

	/**
	 * Инициализация некритичных модулей (отложенная)
	 */
	initDeferredModules() {
		// Используем requestIdleCallback для некритичных модулей
		const initDeferred = () => {
			this.modules.form = new FormManager()
			this.modules.lazyLoad = new LazyLoadManager()
			this.modules.scrollAnimation = new ScrollAnimationManager()
			this.modules.licenseModal = new LicenseModal()
		}

		if ("requestIdleCallback" in window) {
			requestIdleCallback(initDeferred, { timeout: 2000 })
		} else {
			// Fallback для браузеров без поддержки
			setTimeout(initDeferred, 100)
		}
	}

	/**
	 * Настройка passive listeners
	 */
	setupPassiveListeners() {
		// Переопределяем addEventListener для автоматического добавления passive
		const originalAddEventListener = EventTarget.prototype.addEventListener

		EventTarget.prototype.addEventListener = function (
			type,
			listener,
			options
		) {
			// Добавляем passive для событий скролла и touch
			if (["touchstart", "touchmove", "wheel", "scroll"].includes(type)) {
				if (typeof options === "object") {
					options.passive = options.passive !== false
				} else if (options !== false) {
					options = { passive: true, capture: options }
				}
			}

			return originalAddEventListener.call(this, type, listener, options)
		}
	}

	/**
	 * Оптимизация для мобильных устройств
	 */
	optimizeForMobile() {
		// Отключаем hover эффекты на touch устройствах
		if ("ontouchstart" in window) {
			document.documentElement.classList.add("touch-device")
		}

		// Настройка viewport для iOS
		this.setupIOSViewport()

		// Предотвращение масштабирования при двойном тапе
		this.preventDoubleTapZoom()
	}

	/**
	 * Настройка viewport для iOS
	 */
	setupIOSViewport() {
		// Фиксим высоту viewport на iOS
		const setViewportHeight = () => {
			const vh = window.innerHeight * 0.01
			document.documentElement.style.setProperty("--vh", `${vh}px`)
		}

		setViewportHeight()

		// Обновляем при изменении ориентации
		window.addEventListener("orientationchange", () => {
			setTimeout(setViewportHeight, 100)
		})

		// Обновляем при resize (для адресной строки)
		let resizeTimer
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimer)
			resizeTimer = setTimeout(setViewportHeight, 100)
		})
	}

	/**
	 * Предотвращение двойного тапа для масштабирования
	 */
	preventDoubleTapZoom() {
		let lastTouchTime = 0

		document.addEventListener(
			"touchend",
			e => {
				const currentTime = Date.now()
				const tapLength = currentTime - lastTouchTime

				if (tapLength < 300 && tapLength > 0) {
					e.preventDefault()
				}

				lastTouchTime = currentTime
			},
			{ passive: false }
		)
	}

	/**
	 * Предотвращение layout thrashing
	 */
	preventLayoutThrashing() {
		// Группируем чтение и запись DOM
		const readQueue = []
		const writeQueue = []

		window.batchRead = fn => {
			readQueue.push(fn)
			scheduleFlush()
		}

		window.batchWrite = fn => {
			writeQueue.push(fn)
			scheduleFlush()
		}

		let scheduled = false
		const scheduleFlush = () => {
			if (!scheduled) {
				scheduled = true
				requestAnimationFrame(flush)
			}
		}

		const flush = () => {
			scheduled = false

			// Сначала все чтения
			const reads = readQueue.splice(0)
			reads.forEach(fn => fn())

			// Затем все записи
			const writes = writeQueue.splice(0)
			writes.forEach(fn => fn())
		}
	}

	/**
	 * Проверка поддержки функций
	 */
	checkSupport() {
		// WebP поддержка
		this.checkWebPSupport()

		// Проверка производительности устройства
		this.checkDevicePerformance()

		// Проверка сети
		this.checkNetworkSpeed()
	}

	/**
	 * Проверка поддержки WebP
	 */
	checkWebPSupport() {
		const webpTest = new Image()
		webpTest.onload = webpTest.onerror = () => {
			const isWebpSupported = webpTest.height === 2
			if (isWebpSupported) {
				document.documentElement.classList.add("webp")
			}
		}
		webpTest.src =
			"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
	}

	/**
	 * Проверка производительности устройства
	 */
	checkDevicePerformance() {
		// Проверяем количество ядер процессора
		const cores = navigator.hardwareConcurrency || 1

		// Проверяем память (если доступно)
		const memory = navigator.deviceMemory || 4

		// Определяем уровень производительности
		if (cores < 4 || memory < 4) {
			document.documentElement.classList.add("low-performance")
			// Отключаем тяжелые эффекты
			CONFIG.mobile.disableEffects = true
		} else if (cores >= 8 && memory >= 8) {
			document.documentElement.classList.add("high-performance")
		}

		this.performance.metrics.cores = cores
		this.performance.metrics.memory = memory
	}

	/**
	 * Проверка скорости сети
	 */
	checkNetworkSpeed() {
		if ("connection" in navigator) {
			const connection = navigator.connection

			// Определяем тип соединения
			const effectiveType = connection.effectiveType

			if (effectiveType === "slow-2g" || effectiveType === "2g") {
				document.documentElement.classList.add("slow-connection")
				// Используем минимальное качество видео
				CONFIG.mobile.videoQuality = "minimal"
			} else if (effectiveType === "4g") {
				document.documentElement.classList.add("fast-connection")
			}

			// Слушаем изменения сети
			connection.addEventListener("change", () => {
				this.checkNetworkSpeed()
			})

			this.performance.metrics.network = effectiveType
		}
	}

	/**
	 * Проверка, мобильное ли устройство
	 */
	isMobile() {
		return (
			window.matchMedia(`(max-width: ${CONFIG.mobile.breakpoint}px)`).matches ||
			"ontouchstart" in window ||
			navigator.maxTouchPoints > 0
		)
	}

	/**
	 * Настройка обработки ошибок
	 */
	setupErrorHandling() {
		window.addEventListener("error", e => {
			console.error("Global error:", e.error)

			// Отправка ошибки в аналитику (если настроено)
			if (CONFIG.debug.enabled) {
				this.logError(e.error)
			}
		})

		window.addEventListener("unhandledrejection", e => {
			console.error("Unhandled promise rejection:", e.reason)

			// Отправка ошибки в аналитику (если настроено)
			if (CONFIG.debug.enabled) {
				this.logError(e.reason)
			}
		})
	}

	/**
	 * Логирование ошибок
	 */
	logError(error) {
		// Здесь можно отправить ошибку на сервер
		const errorData = {
			message: error.message,
			stack: error.stack,
			userAgent: navigator.userAgent,
			timestamp: Date.now(),
			performance: this.performance.metrics,
		}

		if (CONFIG.debug.logEvents) {
			console.log("Error logged:", errorData)
		}
	}

	/**
	 * Логирование производительности
	 */
	logPerformance() {
		const loadTime = performance.now() - this.performance.startTime

		this.performance.metrics.loadTime = loadTime
		this.performance.metrics.resources =
			performance.getEntriesByType("resource").length

		// Получаем метрики Core Web Vitals
		this.measureCoreWebVitals()

		if (CONFIG.debug.logPerformance) {
			console.log("⚡ Performance metrics:", this.performance.metrics)
		}

		console.log(`✨ App initialized in ${loadTime.toFixed(2)}ms`)
	}

	/**
	 * Измерение Core Web Vitals
	 */
	measureCoreWebVitals() {
		// Largest Contentful Paint (LCP)
		if ("PerformanceObserver" in window) {
			try {
				const lcpObserver = new PerformanceObserver(list => {
					const entries = list.getEntries()
					const lastEntry = entries[entries.length - 1]
					this.performance.metrics.lcp =
						lastEntry.renderTime || lastEntry.loadTime
				})

				lcpObserver.observe({
					type: "largest-contentful-paint",
					buffered: true,
				})
			} catch (e) {
				// Браузер не поддерживает LCP
			}

			// First Input Delay (FID)
			try {
				const fidObserver = new PerformanceObserver(list => {
					const entries = list.getEntries()
					if (entries.length > 0) {
						this.performance.metrics.fid =
							entries[0].processingStart - entries[0].startTime
					}
				})

				fidObserver.observe({ type: "first-input", buffered: true })
			} catch (e) {
				// Браузер не поддерживает FID
			}

			// Cumulative Layout Shift (CLS)
			let clsValue = 0
			let clsEntries = []

			try {
				const clsObserver = new PerformanceObserver(list => {
					for (const entry of list.getEntries()) {
						if (!entry.hadRecentInput) {
							clsEntries.push(entry)
							clsValue += entry.value
						}
					}
					this.performance.metrics.cls = clsValue
				})

				clsObserver.observe({ type: "layout-shift", buffered: true })
			} catch (e) {
				// Браузер не поддерживает CLS
			}
		}
	}
}
