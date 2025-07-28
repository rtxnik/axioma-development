/**
 * Главный файл приложения
 * Инициализация всех модулей
 */

// Импорт конфигурации и утилит
import { CONFIG } from "./config.js"
import { Utils } from "./utils.js"

// Импорт модулей
import { FormManager } from "./modules/form.js"
import { LazyLoadManager } from "./modules/lazy-load.js"
import { LoadingManager } from "./modules/loading.js"
import { NavigationManager } from "./modules/navigation.js"
import { ParallaxManager } from "./modules/parallax.js"
import { ScrollAnimationManager } from "./modules/scroll-animation.js"
import { VideoManager } from "./modules/video.js"

/**
 * Главный класс приложения
 */
class App {
	constructor() {
		this.modules = {}
	}

	init() {
		// Проверка поддержки
		this.checkSupport()

		// Инициализация модулей
		this.modules.loading = new LoadingManager()
		this.modules.video = new VideoManager()
		this.modules.navigation = new NavigationManager()
		this.modules.form = new FormManager()
		this.modules.parallax = new ParallaxManager()
		this.modules.lazyLoad = new LazyLoadManager()
		this.modules.scrollAnimation = new ScrollAnimationManager()

		// Глобальные ссылки
		window.loadingManager = this.modules.loading

		// Обработка ошибок
		this.setupErrorHandling()

		console.log("✨ App initialized successfully")
	}

	checkSupport() {
		// Проверка WebP
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

	setupErrorHandling() {
		window.addEventListener("error", e => {
			console.error("Global error:", e.error)

			// Можно отправить ошибку на сервер
			// this.logError(e.error);
		})

		window.addEventListener("unhandledrejection", e => {
			console.error("Unhandled promise rejection:", e.reason)

			// Можно отправить ошибку на сервер
			// this.logError(e.reason);
		})
	}
}

// ===============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
	const app = new App()
	app.init()
})

// Экспорт для использования в других модулях
export { App, CONFIG, Utils }
