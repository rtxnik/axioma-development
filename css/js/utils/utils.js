/**
 * Утилиты и вспомогательные функции
 */
import { CONFIG } from "../config/config.js"

export const Utils = {
	// Debounce функция
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

	// Throttle функция
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

	// Плавный скролл
	smoothScrollTo(target, duration = CONFIG.scroll.smoothDuration) {
		const start = window.pageYOffset
		const distance = target - start
		let startTime = null

		const easeInOutCubic = t =>
			t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

		const animate = currentTime => {
			if (startTime === null) startTime = currentTime
			const timeElapsed = currentTime - startTime
			const progress = Math.min(timeElapsed / duration, 1)

			window.scrollTo(0, start + distance * easeInOutCubic(progress))

			if (timeElapsed < duration) {
				requestAnimationFrame(animate)
			}
		}

		requestAnimationFrame(animate)
	},

	// Проверка мобильного устройства
	isMobile() {
		return window.innerWidth <= 768
	},

	// Проверка поддержки функций
	supportsFeature(feature) {
		const features = {
			intersectionObserver: "IntersectionObserver" in window,
			smoothScroll: "scrollBehavior" in document.documentElement.style,
			webp: false, // Проверка WebP требует асинхронности
		}
		return features[feature] || false
	},
}
