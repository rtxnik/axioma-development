/**
 * Точка входа приложения - Оптимизированная версия
 */
import { CONFIG } from "./config/config.js"
import { App } from "./core/App.js"

// Определяем готовность документа
const isDocumentReady = () => {
	return (
		document.readyState === "complete" || document.readyState === "interactive"
	)
}

// Инициализация приложения
const initApp = () => {
	// Проверяем, не было ли приложение уже инициализировано
	if (window.appInitialized) {
		console.warn("App already initialized")
		return
	}

	// Маркируем как инициализированное
	window.appInitialized = true

	// Создаем и запускаем приложение
	const app = new App()
	app.init()

	// Делаем приложение доступным глобально для отладки
	if (CONFIG.debug.enabled) {
		window.app = app
	}

	// Добавляем глобальные утилиты для разработки
	if (CONFIG.debug.enabled) {
		setupDebugTools()
	}
}

// Оптимизированный запуск приложения
if (isDocumentReady()) {
	// Документ уже готов, запускаем сразу
	initApp()
} else {
	// Используем DOMContentLoaded для запуска
	document.addEventListener("DOMContentLoaded", initApp, { once: true })
}

// Дополнительно слушаем load для гарантии
window.addEventListener(
	"load",
	() => {
		if (!window.appInitialized) {
			initApp()
		}
	},
	{ once: true }
)

/**
 * Настройка инструментов отладки
 */
function setupDebugTools() {
	// FPS монитор
	if (CONFIG.debug.showFPS) {
		setupFPSMonitor()
	}

	// Логирование событий
	if (CONFIG.debug.logEvents) {
		setupEventLogger()
	}

	// Консольные команды для отладки
	window.debug = {
		// Перезагрузка видео
		reloadVideo: () => {
			const video = document.getElementById("heroVideo")
			if (video) {
				video.load()
				video.play()
			}
		},

		// Переключение качества видео
		switchVideoQuality: quality => {
			CONFIG.mobile.videoQuality = quality
			window.debug.reloadVideo()
		},

		// Показать метрики производительности
		showPerformance: () => {
			if (window.app && window.app.performance) {
				console.table(window.app.performance.metrics)
			}
		},

		// Симуляция медленного соединения
		simulateSlowConnection: () => {
			CONFIG.mobile.videoQuality = "minimal"
			document.documentElement.classList.add("slow-connection")
			console.log("Simulating slow connection")
		},

		// Сброс всех настроек
		reset: () => {
			localStorage.clear()
			sessionStorage.clear()
			location.reload()
		},
	}

	console.log("Debug tools enabled. Use window.debug to access commands.")
}

/**
 * FPS монитор
 */
function setupFPSMonitor() {
	const fpsElement = document.createElement("div")
	fpsElement.style.cssText = `
		position: fixed;
		top: 10px;
		right: 10px;
		background: rgba(0, 0, 0, 0.8);
		color: #0f0;
		padding: 5px 10px;
		font-family: monospace;
		font-size: 12px;
		z-index: 9999;
		border-radius: 3px;
		pointer-events: none;
	`
	document.body.appendChild(fpsElement)

	let lastTime = performance.now()
	let frames = 0
	let fps = 0

	const updateFPS = () => {
		frames++
		const currentTime = performance.now()

		if (currentTime >= lastTime + 1000) {
			fps = Math.round((frames * 1000) / (currentTime - lastTime))
			frames = 0
			lastTime = currentTime

			// Цветовая индикация
			let color = "#0f0" // Зеленый для 60 FPS
			if (fps < 30) {
				color = "#f00" // Красный для < 30 FPS
			} else if (fps < 50) {
				color = "#ff0" // Желтый для 30-50 FPS
			}

			fpsElement.style.color = color
			fpsElement.textContent = `${fps} FPS`
		}

		requestAnimationFrame(updateFPS)
	}

	requestAnimationFrame(updateFPS)
}

/**
 * Логгер событий
 */
function setupEventLogger() {
	const events = [
		"click",
		"scroll",
		"resize",
		"touchstart",
		"touchend",
		"focus",
		"blur",
		"load",
		"error",
	]

	events.forEach(eventType => {
		window.addEventListener(
			eventType,
			e => {
				console.log(`Event: ${eventType}`, {
					target: e.target,
					timestamp: e.timeStamp,
					type: e.type,
				})
			},
			{ passive: true, capture: true }
		)
	})
}

/**
 * Обработка критических ошибок
 */
window.addEventListener("error", e => {
	// Если приложение не загрузилось, пробуем перезагрузить
	if (!window.appInitialized && e.error) {
		console.error("Critical error during app initialization:", e.error)

		// Показываем fallback UI
		showFallbackUI()
	}
})

/**
 * Показ fallback UI при критической ошибке
 */
function showFallbackUI() {
	// Скрываем загрузчик
	const loader = document.getElementById("loadingScreen")
	if (loader) {
		loader.style.display = "none"
	}

	// Показываем основной контент без JS функциональности
	document.body.style.opacity = "1"

	// Добавляем класс для CSS fallback стилей
	document.documentElement.classList.add("js-error")

	console.warn("Fallback UI activated due to JavaScript error")
}

/**
 * Service Worker регистрация (для кэширования)
 */
if ("serviceWorker" in navigator && CONFIG.cache.enabled) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").then(
			registration => {
				console.log("ServiceWorker registered:", registration.scope)
			},
			error => {
				console.warn("ServiceWorker registration failed:", error)
			}
		)
	})
}

// Экспорт для использования в других проектах
export { App }
