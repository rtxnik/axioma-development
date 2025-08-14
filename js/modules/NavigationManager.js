/**
 * Модуль управления навигацией - Оптимизированная версия для мобильных
 */
import { CONFIG } from "../config/config.js"

export class NavigationManager {
	constructor() {
		this.header = document.querySelector(".header")
		this.nav = document.querySelector(".nav")
		this.navList = document.querySelector(".nav__list")
		this.menuToggle = document.getElementById("menuToggle")
		this.scrollButton = document.getElementById("heroScrollButton")
		this.heroSection = document.querySelector(".hero")
		this.aboutSection = document.getElementById("about")
		this.lastScrollY = 0
		this.ticking = false
		this.isMobile = window.matchMedia("(max-width: 768px)").matches
		this.activeDropdown = null

		// Оптимизация: кэширование размеров
		this.heroHeight = 0
		this.headerHeight = 80
		this.scrollButtonClicking = false

		// ДОБАВЛЕНО: Флаги для оптимизации мобильных
		this.isScrolling = false
		this.scrollEndTimer = null
		this.touchStartTime = 0

		this.init()
	}

	init() {
		this.setupScrollEffects()
		this.setupOptimizedScrollButton()
		this.setupSmoothScrolling()
		this.setupMobileMenu()
		this.setupDropdowns()
		this.handleResize()
		this.cacheHeights()
	}

	/**
	 * Кэширование высот элементов для производительности
	 */
	cacheHeights() {
		if (this.heroSection) {
			this.heroHeight = this.heroSection.offsetHeight
		}
		if (this.header) {
			this.headerHeight = this.header.offsetHeight
		}

		// Обновляем кэш при изменении размера окна
		let resizeTimer
		window.addEventListener(
			"resize",
			() => {
				clearTimeout(resizeTimer)
				resizeTimer = setTimeout(() => {
					if (this.heroSection) {
						this.heroHeight = this.heroSection.offsetHeight
					}
					if (this.header) {
						this.headerHeight = this.header.offsetHeight
					}
				}, 250)
			},
			{ passive: true }
		)
	}

	/**
	 * ИСПРАВЛЕНО: Оптимизированная настройка кнопки скролла для мобильных
	 */
	setupOptimizedScrollButton() {
		if (!this.scrollButton) return

		const handleScrollClick = e => {
			e.preventDefault()
			e.stopPropagation()

			// Предотвращаем двойные клики
			if (this.scrollButtonClicking) return
			this.scrollButtonClicking = true

			// Мгновенная визуальная обратная связь
			this.scrollButton.style.transform = "scale(0.95)"

			// ИСПРАВЛЕНО: На мобильных используем нативный скролл
			if (this.isMobile) {
				this.performMobileScroll()
			} else {
				// На десктопе используем плавную прокрутку
				const targetPosition = this.calculateScrollTarget()
				this.performOptimizedScroll(targetPosition)
			}

			// Восстанавливаем состояние кнопки
			setTimeout(() => {
				this.scrollButton.style.transform = ""
				this.scrollButtonClicking = false
			}, 300)
		}

		// ИСПРАВЛЕНО: Упрощаем обработчики для мобильных
		this.scrollButton.addEventListener("click", handleScrollClick)

		// ИСПРАВЛЕНО: Улучшенная обработка touch событий
		if ("ontouchstart" in window) {
			let touchStarted = false
			let touchMoved = false

			this.scrollButton.addEventListener(
				"touchstart",
				e => {
					touchStarted = true
					touchMoved = false
					this.touchStartTime = Date.now()
					// Визуальная обратная связь при касании
					this.scrollButton.style.transform = "scale(0.95)"
				},
				{ passive: true }
			)

			this.scrollButton.addEventListener(
				"touchmove",
				e => {
					touchMoved = true
				},
				{ passive: true }
			)

			this.scrollButton.addEventListener(
				"touchend",
				e => {
					if (touchStarted && !touchMoved) {
						const touchDuration = Date.now() - this.touchStartTime
						// Предотвращаем случайные касания
						if (touchDuration < 500) {
							e.preventDefault()
							handleScrollClick(e)
						}
					}
					touchStarted = false
					touchMoved = false
					this.scrollButton.style.transform = ""
				},
				{ passive: false }
			)

			this.scrollButton.addEventListener(
				"touchcancel",
				() => {
					touchStarted = false
					touchMoved = false
					this.scrollButton.style.transform = ""
				},
				{ passive: true }
			)
		}

		// Обработка клавиатуры
		this.scrollButton.addEventListener("keydown", e => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault()
				handleScrollClick(e)
			}
		})
	}

	/**
	 * ДОБАВЛЕНО: Нативный скролл для мобильных устройств
	 */
	performMobileScroll() {
		const currentScroll = window.pageYOffset
		let targetPosition

		if (currentScroll < this.heroHeight - 10) {
			// Скроллим к концу hero
			targetPosition = this.heroHeight
		} else if (this.aboutSection) {
			// Скроллим к about секции
			const aboutRect = this.aboutSection.getBoundingClientRect()
			targetPosition = window.pageYOffset + aboutRect.top - this.headerHeight
		} else {
			targetPosition = this.heroHeight
		}

		// ИСПРАВЛЕНО: Используем нативный скролл на мобильных
		window.scrollTo({
			top: targetPosition,
			behavior: "smooth",
		})
	}

	/**
	 * Быстрое вычисление целевой позиции прокрутки
	 */
	calculateScrollTarget() {
		const currentScroll = window.pageYOffset

		if (currentScroll < this.heroHeight - 10) {
			return this.heroHeight
		} else if (this.aboutSection) {
			const aboutRect = this.aboutSection.getBoundingClientRect()
			return window.pageYOffset + aboutRect.top - this.headerHeight
		}

		return this.heroHeight
	}

	/**
	 * ИСПРАВЛЕНО: Оптимизированная плавная прокрутка только для десктопа
	 */
	performOptimizedScroll(targetPosition, duration = 800) {
		// На мобильных не используем кастомную прокрутку
		if (this.isMobile) {
			window.scrollTo({
				top: targetPosition,
				behavior: "smooth",
			})
			return
		}

		const startPosition = window.pageYOffset
		const distance = targetPosition - startPosition

		// Если расстояние очень маленькое, делаем мгновенный переход
		if (Math.abs(distance) < 10) {
			window.scrollTo(0, targetPosition)
			return
		}

		let startTime = null

		const easeOutCubic = t => {
			return 1 - Math.pow(1 - t, 3)
		}

		const animation = currentTime => {
			if (!startTime) startTime = currentTime

			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / duration, 1)

			const easeProgress = easeOutCubic(progress)
			const currentPosition = startPosition + distance * easeProgress

			window.scrollTo(0, currentPosition)

			if (progress < 1) {
				requestAnimationFrame(animation)
			} else {
				window.scrollTo(0, targetPosition)
			}
		}

		requestAnimationFrame(animation)
	}

	/**
	 * ИСПРАВЛЕНО: Упрощенная настройка мобильного меню
	 */
	setupMobileMenu() {
		this.cleanupOldElements()

		if (this.menuToggle) {
			this.menuToggle.addEventListener("change", e => {
				if (e.target.checked) {
					this.openMobileMenu()
				} else {
					this.closeMobileMenu()
				}
			})
		}

		// ИСПРАВЛЕНО: Убираем агрессивные обработчики кликов
		document.addEventListener(
			"click",
			e => {
				if (this.isMobile && this.menuToggle?.checked) {
					if (!this.nav?.contains(e.target) && !e.target.closest(".nav")) {
						this.closeMobileMenu()
					}
				}
			},
			{ passive: true }
		)

		// ИСПРАВЛЕНО: Улучшенные свайп жесты
		this.setupImprovedSwipeGestures()
	}

	/**
	 * Очистка старых элементов
	 */
	cleanupOldElements() {
		document.querySelectorAll(".nav__link--mobile").forEach(el => el.remove())
		document
			.querySelectorAll(".nav__dropdown-toggle")
			.forEach(el => el.remove())

		document.querySelectorAll(".nav__link--desktop").forEach(link => {
			link.classList.remove("nav__link--desktop")
		})
	}

	/**
	 * ИСПРАВЛЕНО: Улучшенные свайп жесты для мобильного меню
	 */
	setupImprovedSwipeGestures() {
		if (!this.navList) return

		let touchStartX = 0
		let touchStartY = 0
		let touchMoved = false

		this.navList.addEventListener(
			"touchstart",
			e => {
				touchStartX = e.changedTouches[0].screenX
				touchStartY = e.changedTouches[0].screenY
				touchMoved = false
			},
			{ passive: true }
		)

		this.navList.addEventListener(
			"touchmove",
			e => {
				const currentX = e.changedTouches[0].screenX
				const currentY = e.changedTouches[0].screenY
				const deltaX = Math.abs(currentX - touchStartX)
				const deltaY = Math.abs(currentY - touchStartY)

				// Считаем что это свайп только если горизонтальное движение больше вертикального
				if (deltaX > deltaY && deltaX > 10) {
					touchMoved = true
				}
			},
			{ passive: true }
		)

		this.navList.addEventListener(
			"touchend",
			e => {
				if (touchMoved) {
					const touchEndX = e.changedTouches[0].screenX
					this.handleSwipe(touchStartX, touchEndX)
				}
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

			item.dataset.hasDropdown = "true"

			if (this.isMobile) {
				this.setupMobileDropdown(item, link, dropdown)
			} else {
				this.setupDesktopDropdown(item, link, dropdown)
			}
		})
	}

	/**
	 * ИСПРАВЛЕНО: Упрощенная настройка dropdown для мобильных
	 */
	setupMobileDropdown(item, link, dropdown) {
		link.addEventListener("click", e => {
			e.preventDefault()
			e.stopPropagation()
			this.toggleMobileDropdown(item, dropdown)
		})

		// ИСПРАВЛЕНО: Упрощенная обработка touch
		link.addEventListener(
			"touchend",
			e => {
				const touchDuration = Date.now() - this.touchStartTime
				if (touchDuration < 300) {
					e.preventDefault()
					e.stopPropagation()
					this.toggleMobileDropdown(item, dropdown)
				}
			},
			{ passive: false }
		)

		// Предотвращаем закрытие при клике внутри dropdown
		dropdown.addEventListener(
			"click",
			e => {
				e.stopPropagation()
			},
			{ passive: true }
		)
	}

	/**
	 * Переключение мобильного dropdown
	 */
	toggleMobileDropdown(item, dropdown) {
		const isOpen = item.classList.contains("nav__item--open")

		// Закрываем все другие dropdown
		this.closeAllDropdowns()

		if (!isOpen) {
			item.classList.add("nav__item--open")
			dropdown.classList.add("nav__dropdown--open")

			const arrow = item.querySelector(".nav__link-arrow")
			if (arrow) {
				arrow.style.transform = "rotate(180deg)"
			}

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

		link.addEventListener("keydown", e => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault()
				link.click()
			}
		})
	}

	/**
	 * Открытие мобильного меню
	 */
	openMobileMenu() {
		this.navList?.classList.add("nav__list--open")
		document.body.style.overflow = "hidden"
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
		this.closeAllDropdowns()
	}

	/**
	 * Обработка изменения размера окна
	 */
	handleResize() {
		let resizeTimer
		window.addEventListener(
			"resize",
			() => {
				clearTimeout(resizeTimer)
				resizeTimer = setTimeout(() => {
					const wasMobile = this.isMobile
					this.isMobile = window.matchMedia("(max-width: 768px)").matches

					if (wasMobile !== this.isMobile) {
						this.closeMobileMenu()
						this.closeAllDropdowns()
						this.setupDropdowns()
					}
				}, 250)
			},
			{ passive: true }
		)
	}

	/**
	 * ИСПРАВЛЕНО: Оптимизированные эффекты скролла для мобильных
	 */
	setupScrollEffects() {
		let isScrolling = false

		const updateHeader = () => {
			const currentScrollY = window.pageYOffset

			// ИСПРАВЛЕНО: Более мягкие эффекты на мобильных
			if (this.isMobile) {
				// На мобильных только меняем стили, без transform
				if (currentScrollY > 100) {
					this.header.classList.add("header--scrolled")
				} else {
					this.header.classList.remove("header--scrolled")
				}
			} else {
				// На десктопе используем полные эффекты
				if (currentScrollY > 100) {
					this.header.classList.add("header--scrolled")
				} else {
					this.header.classList.remove("header--scrolled")
				}

				if (
					currentScrollY > this.lastScrollY &&
					currentScrollY > CONFIG.scroll.headerHideThreshold
				) {
					this.header.style.transform = "translateY(-100%)"
				} else {
					this.header.style.transform = "translateY(0)"
				}
			}

			this.updateScrollIndicator(currentScrollY)

			this.lastScrollY = currentScrollY
			isScrolling = false
		}

		// ИСПРАВЛЕНО: Разная частота обновления для мобильных и десктопа
		const throttleDelay = this.isMobile ? 32 : 16 // ~30fps на мобильных, ~60fps на десктопе

		window.addEventListener(
			"scroll",
			() => {
				if (!isScrolling) {
					setTimeout(() => {
						requestAnimationFrame(updateHeader)
					}, throttleDelay)
					isScrolling = true
				}
			},
			{ passive: true }
		)
	}

	/**
	 * Обновление индикатора скролла
	 */
	updateScrollIndicator(scrollY) {
		const scrollIndicator = document.getElementById("scrollIndicator")
		if (!scrollIndicator) return

		const fadeStart = this.heroHeight * CONFIG.scroll.indicatorFadeThreshold

		if (scrollY > fadeStart) {
			const opacity = Math.max(
				0,
				1 - (scrollY - fadeStart) / (this.heroHeight * 0.2)
			)
			scrollIndicator.style.opacity = opacity

			if (opacity === 0) {
				scrollIndicator.style.visibility = "hidden"
			} else {
				scrollIndicator.style.visibility = "visible"
			}
		} else {
			scrollIndicator.style.opacity = 1
			scrollIndicator.style.visibility = "visible"
		}
	}

	/**
	 * ИСПРАВЛЕНО: Настройка плавной прокрутки для якорных ссылок
	 */
	setupSmoothScrolling() {
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener("click", e => {
				const targetId = anchor.getAttribute("href")
				if (targetId === "#") return

				const targetElement = document.querySelector(targetId)
				if (targetElement) {
					e.preventDefault()

					if (this.isMobile) {
						this.closeMobileMenu()
					}

					const rect = targetElement.getBoundingClientRect()
					const absoluteTop = window.pageYOffset + rect.top
					const targetPosition = absoluteTop - this.headerHeight

					// ИСПРАВЛЕНО: Разный подход для мобильных и десктопа
					if (this.isMobile) {
						window.scrollTo({
							top: targetPosition,
							behavior: "smooth",
						})
					} else {
						this.performOptimizedScroll(targetPosition, 800)
					}
				}
			})
		})
	}
}
