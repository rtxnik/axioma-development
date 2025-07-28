/**
 * Модуль управления навигацией
 */

import { CONFIG } from "../config.js"
import { Utils } from "../utils.js"

export class NavigationManager {
	constructor() {
		this.header = document.querySelector(".header")
		this.scrollButton = document.querySelector(".hero__scroll-button")
		this.lastScrollY = 0
		this.ticking = false

		this.init()
	}

	init() {
		this.setupScrollEffects()
		this.setupScrollButton()
		this.setupSmoothScrolling()
	}

	setupScrollEffects() {
		const updateHeader = () => {
			const currentScrollY = window.pageYOffset

			// Эффект прозрачности хедера
			if (currentScrollY > 100) {
				this.header.classList.add("header--scrolled")
			} else {
				this.header.classList.remove("header--scrolled")
			}

			// Скрытие/показ хедера
			if (
				currentScrollY > this.lastScrollY &&
				currentScrollY > CONFIG.scroll.headerHideThreshold
			) {
				this.header.classList.add("header--hidden")
			} else {
				this.header.classList.remove("header--hidden")
			}

			// Обновление видимости индикатора скролла
			this.updateScrollIndicator(currentScrollY)

			this.lastScrollY = currentScrollY
			this.ticking = false
		}

		const requestTick = () => {
			if (!this.ticking) {
				requestAnimationFrame(updateHeader)
				this.ticking = true
			}
		}

		window.addEventListener(
			"scroll",
			Utils.throttle(requestTick, CONFIG.performance.throttleDelay),
			{ passive: true }
		)
	}

	updateScrollIndicator(scrollY) {
		const scrollIndicator = document.getElementById("scrollIndicator")
		if (!scrollIndicator) return

		const heroHeight = window.innerHeight
		const fadeStart = heroHeight * CONFIG.scroll.indicatorFadeThreshold

		if (scrollY > fadeStart) {
			const opacity = Math.max(
				0,
				1 - (scrollY - fadeStart) / (heroHeight * 0.2)
			)
			scrollIndicator.style.opacity = opacity
		} else {
			scrollIndicator.style.opacity = 1
		}
	}

	setupScrollButton() {
		if (this.scrollButton) {
			this.scrollButton.addEventListener("click", e => {
				e.preventDefault()
				const heroSection = document.querySelector(".hero")
				if (heroSection) {
					// Скроллим на высоту hero секции, чтобы она полностью скрылась
					const heroHeight = heroSection.offsetHeight
					Utils.smoothScrollTo(heroHeight)
				}
			})
		}
	}

	setupSmoothScrolling() {
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener("click", e => {
				const targetId = anchor.getAttribute("href")
				if (targetId === "#") return

				const targetElement = document.querySelector(targetId)
				if (targetElement) {
					e.preventDefault()
					const headerHeight = this.header ? this.header.offsetHeight : 80
					const targetPosition = targetElement.offsetTop - headerHeight
					Utils.smoothScrollTo(targetPosition)
				}
			})
		})
	}
}
