/**
 * Модуль управления навигацией - Оптимизированная версия для мобильных
 */
import { CONFIG } from "../config/config.js"
import { Utils } from "../utils/utils.js"

export class NavigationManager {
	constructor() {
		this.header = document.querySelector(".header")
		this.nav = document.querySelector(".nav")
		this.navList = document.querySelector(".nav__list")
		this.menuToggle = document.getElementById("menuToggle")
		this.scrollButton = document.querySelector(".hero__scroll-button")
		this.heroSection = document.querySelector(".hero")
		this.aboutSection = document.getElementById("about")
		this.lastScrollY = 0
		this.ticking = false
		this.touchStartX = 0
		this.touchStartY = 0
		this.isMobile = window.matchMedia("(max-width: 768px)").matches
		this.activeDropdown = null

		this.init()
	}

	init() {
		this.setupScrollEffects()
		this.setupScrollButton()
		this.setupSmoothScrolling()
		this.setupMobileMenu()
		this.setupDropdowns()
		this.handleResize()
	}

	/**
	 * Настройка мобильного меню
	 */
	setupMobileMenu() {
		// Удаляем старые чекбоксы и дублирующие элементы
		this.cleanupOldElements()

		// Обработка открытия/закрытия мобильного меню
		if (this.menuToggle) {
			this.menuToggle.addEventListener("change", e => {
				if (e.target.checked) {
					this.openMobileMenu()
				} else {
					this.closeMobileMenu()
				}
			})
		}

		// Закрытие меню при клике вне
		document.addEventListener("click", e => {
			if (this.isMobile && this.menuToggle?.checked) {
				if (!this.nav?.contains(e.target)) {
					this.closeMobileMenu()
				}
			}
		})

		// Закрытие меню при свайпе влево
		this.setupSwipeGestures()
	}

	/**
	 * Очистка старых элементов
	 */
	cleanupOldElements() {
		// Удаляем дублирующие мобильные элементы
		document.querySelectorAll(".nav__link--mobile").forEach(el => el.remove())
		document
			.querySelectorAll(".nav__dropdown-toggle")
			.forEach(el => el.remove())

		// Оставляем только один набор ссылок
		document.querySelectorAll(".nav__link--desktop").forEach(link => {
			link.classList.remove("nav__link--desktop")
		})
	}

	/**
	 * Настройка dropdown меню
	 */
	setupDropdowns() {
		const dropdownItems = document.querySelectorAll(
			".nav__item--has-dropdown, .nav__item--has-mega"
		)

		dropdownItems.forEach(item => {
			const link = item.querySelector(".nav__link")
			const dropdown = item.querySelector(".nav__dropdown, .nav__mega-menu")

			if (!link || !dropdown) return

			// Добавляем data-атрибут для идентификации
			item.dataset.hasDropdown = "true"

			// Обработка для мобильных устройств
			if (this.isMobile) {
				this.setupMobileDropdown(item, link, dropdown)
			} else {
				this.setupDesktopDropdown(item, link, dropdown)
			}
		})
	}

	/**
	 * Настройка dropdown для мобильных
	 */
	setupMobileDropdown(item, link, dropdown) {
		// Предотвращаем переход по ссылке
		link.addEventListener("click", e => {
			e.preventDefault()
			e.stopPropagation()
			this.toggleMobileDropdown(item, dropdown)
		})

		// Touch события для лучшего отклика
		link.addEventListener(
			"touchstart",
			e => {
				this.touchStartTime = Date.now()
			},
			{ passive: true }
		)

		link.addEventListener(
			"touchend",
			e => {
				const touchDuration = Date.now() - this.touchStartTime
				// Предотвращаем случайные касания
				if (touchDuration < 500) {
					e.preventDefault()
					e.stopPropagation()
					this.toggleMobileDropdown(item, dropdown)
				}
			},
			{ passive: false }
		)

		// Обработка кликов внутри dropdown
		dropdown.addEventListener("click", e => {
			e.stopPropagation()
		})
	}

	/**
	 * Переключение мобильного dropdown
	 */
	toggleMobileDropdown(item, dropdown) {
		const isOpen = item.classList.contains("nav__item--open")

		// Закрываем все другие dropdown
		this.closeAllDropdowns()

		if (!isOpen) {
			// Открываем текущий dropdown
			item.classList.add("nav__item--open")
			dropdown.classList.add("nav__dropdown--open")

			// Анимация стрелки
			const arrow = item.querySelector(".nav__link-arrow")
			if (arrow) {
				arrow.style.transform = "rotate(180deg)"
			}

			// Установка максимальной высоты для анимации
			dropdown.style.maxHeight = dropdown.scrollHeight + "px"
			dropdown.style.opacity = "1"
			dropdown.style.visibility = "visible"

			this.activeDropdown = item
		}
	}

	/**
	 * Закрытие всех dropdown
	 */
	closeAllDropdowns() {
		document.querySelectorAll(".nav__item--open").forEach(item => {
			item.classList.remove("nav__item--open")

			const dropdown = item.querySelector(".nav__dropdown, .nav__mega-menu")
			const arrow = item.querySelector(".nav__link-arrow")

			if (dropdown) {
				dropdown.classList.remove("nav__dropdown--open")
				dropdown.style.maxHeight = "0"
				dropdown.style.opacity = "0"
				dropdown.style.visibility = "hidden"
			}

			if (arrow) {
				arrow.style.transform = "rotate(0deg)"
			}
		})

		this.activeDropdown = null
	}

	/**
	 * Настройка dropdown для десктопа
	 */
	setupDesktopDropdown(item, link, dropdown) {
		// Сохраняем стандартное поведение hover из CSS
		// Дополнительно добавляем поддержку клавиатурной навигации
		link.addEventListener("focus", () => {
			item.classList.add("nav__item--focus")
		})

		link.addEventListener("blur", () => {
			setTimeout(() => {
				if (!item.contains(document.activeElement)) {
					item.classList.remove("nav__item--focus")
				}
			}, 100)
		})

		// Поддержка Enter для открытия dropdown
		link.addEventListener("keydown", e => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault()
				link.click()
			}
		})
	}

	/**
	 * Настройка свайп-жестов
	 */
	setupSwipeGestures() {
		let touchStartX = 0
		let touchEndX = 0

		this.navList?.addEventListener(
			"touchstart",
			e => {
				touchStartX = e.changedTouches[0].screenX
			},
			{ passive: true }
		)

		this.navList?.addEventListener(
			"touchend",
			e => {
				touchEndX = e.changedTouches[0].screenX
				this.handleSwipe(touchStartX, touchEndX)
			},
			{ passive: true }
		)
	}

	handleSwipe(startX, endX) {
		const swipeThreshold = 50
		if (startX - endX > swipeThreshold) {
			// Свайп влево - закрываем меню
			this.closeMobileMenu()
		}
	}

	/**
	 * Открытие мобильного меню
	 */
	openMobileMenu() {
		this.navList?.classList.add("nav__list--open")
		document.body.style.overflow = "hidden"

		// Сброс всех dropdown при открытии меню
		this.closeAllDropdowns()
	}

	/**
	 * Закрытие мобильного меню
	 */
	closeMobileMenu() {
		if (this.menuToggle) {
			this.menuToggle.checked = false
		}
		this.navList?.classList.remove("nav__list--open")
		document.body.style.overflow = ""

		// Закрываем все dropdown
		this.closeAllDropdowns()
	}

	/**
	 * Обработка изменения размера окна
	 */
	handleResize() {
		let resizeTimer
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimer)
			resizeTimer = setTimeout(() => {
				const wasMobile = this.isMobile
				this.isMobile = window.matchMedia("(max-width: 768px)").matches

				// Если изменился режим, переинициализируем dropdown
				if (wasMobile !== this.isMobile) {
					this.closeMobileMenu()
					this.closeAllDropdowns()
					this.setupDropdowns()
				}
			}, 250)
		})
	}

	// ... остальные методы остаются без изменений ...

	setupScrollEffects() {
		const updateHeader = () => {
			const currentScrollY = window.pageYOffset

			if (currentScrollY > 100) {
				this.header.classList.add("header--scrolled")
			} else {
				this.header.classList.remove("header--scrolled")
			}

			if (
				currentScrollY > this.lastScrollY &&
				currentScrollY > CONFIG.scroll.headerHideThreshold
			) {
				this.header.classList.add("header--hidden")
			} else {
				this.header.classList.remove("header--hidden")
			}

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

				const heroRect = this.heroSection.getBoundingClientRect()
				const heroHeight = heroRect.height
				const currentScroll = window.pageYOffset

				let targetPosition

				if (currentScroll < heroHeight) {
					targetPosition = heroHeight
				} else {
					const aboutRect = this.aboutSection.getBoundingClientRect()
					const headerHeight = this.header ? this.header.offsetHeight : 80
					targetPosition = window.pageYOffset + aboutRect.top - headerHeight
				}

				targetPosition = Math.max(targetPosition, heroHeight)

				this.smoothScrollToPosition(targetPosition, 1200)
			})
		}
	}

	smoothScrollToPosition(target, duration = 1200) {
		const start = window.pageYOffset
		const distance = target - start

		if (Math.abs(distance) < 1) {
			window.scrollTo({ top: target, behavior: "instant" })
			return
		}

		const startTime = performance.now()

		const easeOutQuart = t => {
			return 1 - Math.pow(1 - t, 4)
		}

		const scroll = currentTime => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			const ease = easeOutQuart(progress)
			const newPosition = start + distance * ease

			window.scrollTo(0, newPosition)

			if (progress < 1) {
				requestAnimationFrame(scroll)
			} else {
				window.scrollTo(0, target)

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

	setupSmoothScrolling() {
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener("click", e => {
				const targetId = anchor.getAttribute("href")
				if (targetId === "#") return

				const targetElement = document.querySelector(targetId)
				if (targetElement) {
					e.preventDefault()

					// Закрываем мобильное меню при переходе
					if (this.isMobile) {
						this.closeMobileMenu()
					}

					if (targetId === "#about" && this.heroSection) {
						const heroHeight = this.heroSection.offsetHeight
						const targetRect = targetElement.getBoundingClientRect()
						const headerHeight = this.header ? this.header.offsetHeight : 80

						const aboutPosition =
							window.pageYOffset + targetRect.top - headerHeight

						const finalPosition = Math.max(heroHeight, aboutPosition)

						this.smoothScrollToPosition(finalPosition, 1000)
					} else {
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
