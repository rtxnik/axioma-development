/**
 * Модуль управления навигацией - ИСПРАВЛЕННАЯ версия
 * Гарантирует полное скрытие секции Hero
 */
import { CONFIG } from "../config/config.js"
import { Utils } from "../utils/utils.js"

export class NavigationManager {
	constructor() {
		this.header = document.querySelector(".header")
		this.scrollButton = document.querySelector(".hero__scroll-button")
		this.heroSection = document.querySelector(".hero")
		this.aboutSection = document.getElementById("about")
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
		if (this.scrollButton && this.heroSection) {
			this.scrollButton.addEventListener("click", e => {
				e.preventDefault()

				// НОВЫЙ ПОДХОД: Скроллим ровно на высоту hero секции
				// Это гарантирует, что hero полностью уйдет из видимости

				// Получаем точные размеры hero секции
				const heroRect = this.heroSection.getBoundingClientRect()
				const heroHeight = heroRect.height
				const currentScroll = window.pageYOffset

				// Целевая позиция - текущий скролл + оставшаяся видимая часть hero
				let targetPosition

				if (currentScroll < heroHeight) {
					// Если мы еще в пределах hero, скроллим до конца hero
					targetPosition = heroHeight
				} else {
					// Если мы уже проскроллили hero, идем к about
					const aboutRect = this.aboutSection.getBoundingClientRect()
					const headerHeight = this.header ? this.header.offsetHeight : 80
					targetPosition = window.pageYOffset + aboutRect.top - headerHeight
				}

				// Дополнительная проверка для точности
				// Убеждаемся, что целевая позиция как минимум равна высоте hero
				targetPosition = Math.max(targetPosition, heroHeight)

				console.log("Hero height:", heroHeight)
				console.log("Current scroll:", currentScroll)
				console.log("Target position:", targetPosition)

				// Выполняем плавную прокрутку
				this.smoothScrollToPosition(targetPosition, 1200)
			})
		}
	}

	// Улучшенный метод прокрутки
	smoothScrollToPosition(target, duration = 1200) {
		const start = window.pageYOffset
		const distance = target - start

		// Если расстояние слишком маленькое, не анимируем
		if (Math.abs(distance) < 1) {
			window.scrollTo({ top: target, behavior: "instant" })
			return
		}

		const startTime = performance.now()

		// Более агрессивная easing функция для четкой остановки
		const easeOutQuart = t => {
			return 1 - Math.pow(1 - t, 4)
		}

		const scroll = currentTime => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			// Применяем easing
			const ease = easeOutQuart(progress)

			// Вычисляем новую позицию
			const newPosition = start + distance * ease

			// Выполняем прокрутку
			window.scrollTo(0, newPosition)

			// Продолжаем анимацию
			if (progress < 1) {
				requestAnimationFrame(scroll)
			} else {
				// ВАЖНО: Финальная точная установка позиции
				window.scrollTo(0, target)

				// Дополнительная проверка через небольшую задержку
				setTimeout(() => {
					const currentPos = window.pageYOffset
					if (Math.abs(currentPos - target) > 1) {
						window.scrollTo(0, target)
					}
				}, 50)
			}
		}

		requestAnimationFrame(scroll)
	}

	// Альтернативный метод с использованием scrollIntoView
	scrollToAboutSection() {
		if (this.heroSection && this.aboutSection) {
			// Сначала убеждаемся, что hero полностью проскроллен
			const heroHeight = this.heroSection.offsetHeight

			// Используем scrollIntoView с кастомным поведением
			if (window.pageYOffset < heroHeight) {
				// Сначала скроллим до конца hero
				window.scrollTo({
					top: heroHeight,
					behavior: "smooth",
				})

				// Затем после небольшой задержки корректируем до about
				setTimeout(() => {
					this.aboutSection.scrollIntoView({
						behavior: "smooth",
						block: "start",
						inline: "nearest",
					})
				}, 1300)
			} else {
				// Если hero уже не видно, просто идем к about
				this.aboutSection.scrollIntoView({
					behavior: "smooth",
					block: "start",
					inline: "nearest",
				})
			}
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

					// Специальная обработка для секции about
					if (targetId === "#about" && this.heroSection) {
						const heroHeight = this.heroSection.offsetHeight
						const targetRect = targetElement.getBoundingClientRect()
						const headerHeight = this.header ? this.header.offsetHeight : 80

						// Позиция about с учетом header
						const aboutPosition =
							window.pageYOffset + targetRect.top - headerHeight

						// Выбираем максимальное значение между высотой hero и позицией about
						const finalPosition = Math.max(heroHeight, aboutPosition)

						this.smoothScrollToPosition(finalPosition, 1000)
					} else {
						// Для других секций используем стандартный подход
						const rect = targetElement.getBoundingClientRect()
						const absoluteTop = window.pageYOffset + rect.top
						const headerHeight = this.header ? this.header.offsetHeight : 80
						const targetPosition = absoluteTop - headerHeight

						this.smoothScrollToPosition(targetPosition, 1000)
					}
				}
			})
		})
	}
}
