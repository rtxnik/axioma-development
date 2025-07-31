/**
 * Модуль анимаций при скролле
 */
import { CONFIG } from "../config/config.js"

export class ScrollAnimationManager {
	constructor() {
		this.elements = document.querySelectorAll("[data-animate]")

		if ("IntersectionObserver" in window && this.elements.length > 0) {
			this.init()
		}
	}

	init() {
		const options = {
			root: null,
			rootMargin: "0px 0px -50px 0px",
			threshold: CONFIG.performance.intersectionThreshold,
		}

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const element = entry.target
					const animation = element.dataset.animate || "fadeInUp"
					const delay = element.dataset.animateDelay || 0

					setTimeout(() => {
						element.classList.add(`animate-${animation}`)
						element.classList.add("animated")
					}, delay)

					this.observer.unobserve(element)
				}
			})
		}, options)

		this.elements.forEach(el => this.observer.observe(el))
	}
}
