/**
 * Модуль параллакс эффектов
 */
import { Utils } from "../utils/utils.js"

export class ParallaxManager {
	constructor() {
		this.elements = document.querySelectorAll("[data-parallax]")
		if (this.elements.length > 0 && !Utils.isMobile()) {
			this.init()
		}
	}

	init() {
		this.setupParallax()
	}

	setupParallax() {
		let ticking = false

		const updateParallax = () => {
			const scrollY = window.pageYOffset

			this.elements.forEach(element => {
				const speed = element.dataset.parallaxSpeed || 0.5
				const offset = scrollY * speed
				element.style.transform = `translateY(${offset}px)`
			})

			ticking = false
		}

		const requestTick = () => {
			if (!ticking) {
				requestAnimationFrame(updateParallax)
				ticking = true
			}
		}

		window.addEventListener("scroll", requestTick, { passive: true })

		// Инициализация
		updateParallax()
	}
}
