/**
 * Точка входа приложения
 */
import { App } from "./core/App.js"

// Запуск приложения
document.addEventListener("DOMContentLoaded", () => {
	const app = new App()
	app.init()

	// Делаем приложение доступным глобально (опционально)
	window.app = app
})

// Экспорт для использования в других проектах
export { App }
