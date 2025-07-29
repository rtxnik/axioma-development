/**
 * Главный класс приложения
 */
import { FormManager } from "../modules/FormManager.js"
import { LazyLoadManager } from "../modules/LazyLoadManager.js"
import { LoadingManager } from "../modules/LoadingManager.js"
import { NavigationManager } from "../modules/NavigationManager.js"
import { ParallaxManager } from "../modules/ParallaxManager.js"
import { ScrollAnimationManager } from "../modules/ScrollAnimationManager.js"
import { VideoManager } from "../modules/VideoManager.js"

export class App {
	constructor() {
		this.modules = {}
	}

	init() {
		// Проверка поддержки
		this.checkSupport()

		// Инициализация модулей
		this.modules.loading = new LoadingManager()
		this.modules.video = new VideoManager(this.modules.loading)
		this.modules.navigation = new NavigationManager()
		this.modules.form = new FormManager()
		this.modules.parallax = new ParallaxManager()
		this.modules.lazyLoad = new LazyLoadManager()
		this.modules.scrollAnimation = new ScrollAnimationManager()

		// Глобальные ссылки (для обратной совместимости)
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
