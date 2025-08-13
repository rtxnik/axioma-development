/**
 * Модуль управления навигацией - Улучшенная версия 2.0
 * С автоматическим позиционированием dropdown и оптимизацией производительности
 */
import { CONFIG } from "../config/config.js"

export class NavigationManager {
	constructor() {
		// DOM элементы
		this.header = document.querySelector(".header")
		this.nav = document.querySelector(".nav")
		this.navList = document.querySelector(".nav__list")
		this.menuToggle = document.getElementById("menuToggle")
		this.scrollButton = document.getElementById("heroScrollButton")
		this.heroSection = document.querySelector(".hero")
		this.aboutSection = document.getElementById("about")

		// Состояние
		this.lastScrollY = 0
		this.ticking = false
		this.isMobile = window.matchMedia("(max-width: 768px)").matches
		this.activeDropdown = null
		this.isScrolling = false
		this.scrollTimeout = null

		// Кэширование размеров
		this.viewportWidth = window.innerWidth
		this.viewportHeight = window.innerHeight
		this.heroHeight = 0
		this.headerHeight = 80
		this.scrollButtonClicking = false

		// Флаги для оптимизации
		this.dropdownPositionsCalculated = new WeakMap()
		this.resizeDebounceTimer = null

		this.init()
	}

	init() {
		this.setupScrollEffects()
		this.setupOptimizedScrollButton()
		this.setupSmoothScrolling()
		this.setupMobileMenu()
		this.setupDropdowns()
		this.setupKeyboardNavigation()
		this.setupViewportTracking()
		this.cacheHeights()
		this.setupAccessibility()
	}

	/**
	 * Отслеживание изменений viewport
	 */
	setupViewportTracking() {
		const updateViewport = () => {
			this.viewportWidth = window.innerWidth
			this.viewportHeight = window.innerHeight
			this.recalculateDropdownPositions()
		}

		// Debounced resize handler
		window.addEventListener(
			"resize",
			() => {
				clearTimeout(this.resizeDebounceTimer)
				this.resizeDebounceTimer = setTimeout(() => {
					updateViewport()
					this.handleResize()
				}, 250)
			},
			{ passive: true }
		)

		// Обновление при изменении ориентации
		window.addEventListener("orientationchange", () => {
			setTimeout(updateViewport, 100)
		})
	}

	/**
	 * Настройка dropdown меню с автопозиционированием
	 */
	setupDropdowns() {
		const dropdownItems = document.querySelectorAll(
			".nav__item--has-dropdown, .nav__item--has-mega"
		)

		dropdownItems.forEach(item => {
			const link = item.querySelector(".nav__link")
			const dropdown = item.querySelector(".nav__dropdown, .nav__mega-menu")

			if (!link || !dropdown) return

			// Добавляем уникальный идентификатор
			const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`
			dropdown.setAttribute("id", dropdownId)
			link.setAttribute("aria-controls", dropdownId)

			if (this.isMobile) {
				this.setupMobileDropdown(item, link, dropdown)
			} else {
				this.setupDesktopDropdown(item, link, dropdown)
			}
		})
	}

	/**
	 * Настройка десктопного dropdown с автопозиционированием
	 */
	setupDesktopDropdown(item, link, dropdown) {
		let hoverTimeout = null
		let isOpen = false

		// Обработка hover с задержкой
		const handleMouseEnter = () => {
			clearTimeout(hoverTimeout)
			hoverTimeout = setTimeout(() => {
				if (!isOpen) {
					this.openDropdown(item, dropdown)
					isOpen = true
				}
			}, 100) // Небольшая задержка для предотвращения случайных открытий
		}

		const handleMouseLeave = () => {
			clearTimeout(hoverTimeout)
			hoverTimeout = setTimeout(() => {
				if (isOpen) {
					this.closeDropdown(item, dropdown)
					isOpen = false
				}
			}, 300) // Задержка закрытия для удобства
		}

		// События мыши
		item.addEventListener("mouseenter", handleMouseEnter)
		item.addEventListener("mouseleave", handleMouseLeave)

		// Клавиатурная навигация
		link.addEventListener("click", e => {
			// На десктопе клик по ссылке с dropdown предотвращаем
			if (
				dropdown.classList.contains("nav__dropdown") ||
				dropdown.classList.contains("nav__mega-menu")
			) {
				e.preventDefault()
				if (isOpen) {
					this.closeDropdown(item, dropdown)
					isOpen = false
				} else {
					this.openDropdown(item, dropdown)
					isOpen = true
				}
			}
		})

		// Focus события для доступности
		link.addEventListener("focus", () => {
			this.openDropdown(item, dropdown)
			isOpen = true
		})

		// Закрытие при потере фокуса
		const handleFocusOut = e => {
			setTimeout(() => {
				if (!item.contains(document.activeElement)) {
					this.closeDropdown(item, dropdown)
					isOpen = false
				}
			}, 100)
		}

		item.addEventListener("focusout", handleFocusOut)
	}

	/**
	 * Открытие dropdown с автопозиционированием
	 */
	openDropdown(item, dropdown) {
		// Закрываем другие открытые dropdown
		if (this.activeDropdown && this.activeDropdown !== item) {
			const prevDropdown = this.activeDropdown.querySelector(
				".nav__dropdown, .nav__mega-menu"
			)
			this.closeDropdown(this.activeDropdown, prevDropdown)
		}

		// Позиционируем dropdown
		this.positionDropdown(item, dropdown)

		// Открываем с анимацией
		item.classList.add("nav__item--active")
		dropdown.classList.add("nav__dropdown--visible", "nav__mega-menu--visible")

		// Обновляем ARIA атрибуты
		const link = item.querySelector(".nav__link")
		link.setAttribute("aria-expanded", "true")

		this.activeDropdown = item
	}

	/**
	 * Закрытие dropdown
	 */
	closeDropdown(item, dropdown) {
		item.classList.remove("nav__item--active")
		dropdown.classList.remove(
			"nav__dropdown--visible",
			"nav__mega-menu--visible"
		)

		// Обновляем ARIA атрибуты
		const link = item.querySelector(".nav__link")
		link.setAttribute("aria-expanded", "false")

		if (this.activeDropdown === item) {
			this.activeDropdown = null
		}
	}

	/**
	 * Автоматическое позиционирование dropdown
	 */
	positionDropdown(item, dropdown) {
		// Пропускаем для мобильных
		if (this.isMobile) return

		// Проверяем кэш
		if (this.dropdownPositionsCalculated.has(dropdown)) {
			return
		}

		const rect = item.getBoundingClientRect()
		const dropdownRect = dropdown.getBoundingClientRect()
		const isRegularDropdown = dropdown.classList.contains("nav__dropdown")
		const isMegaMenu = dropdown.classList.contains("nav__mega-menu")

		if (isRegularDropdown) {
			// Позиционирование обычного dropdown
			const spaceOnRight = this.viewportWidth - rect.left
			const spaceOnLeft = rect.left + rect.width
			const dropdownWidth = dropdown.offsetWidth || 320

			// Сброс классов позиционирования
			dropdown.classList.remove(
				"nav__dropdown--align-right",
				"nav__dropdown--align-center"
			)

			if (spaceOnRight < dropdownWidth && spaceOnLeft > dropdownWidth) {
				// Выравниваем по правому краю элемента
				dropdown.classList.add("nav__dropdown--align-right")
			} else if (
				spaceOnRight < dropdownWidth / 2 &&
				spaceOnLeft < dropdownWidth / 2
			) {
				// Центрируем если места мало с обеих сторон
				dropdown.classList.add("nav__dropdown--align-center")
			}

			// Позиционируем стрелку
			const arrowPosition = Math.min(rect.width / 2, 30)
			dropdown.style.setProperty("--arrow-position", `${arrowPosition}px`)
		} else if (isMegaMenu) {
			// Mega menu всегда центрируется, но проверяем границы
			const megaWidth = dropdown.offsetWidth || 700
			const centerPosition = this.viewportWidth / 2
			const megaHalfWidth = megaWidth / 2

			if (centerPosition - megaHalfWidth < 20) {
				// Слишком близко к левому краю
				dropdown.style.left = "20px"
				dropdown.style.transform = "translateX(0) translateY(-10px) scale(0.98)"
			} else if (centerPosition + megaHalfWidth > this.viewportWidth - 20) {
				// Слишком близко к правому краю
				dropdown.style.left = "auto"
				dropdown.style.right = "20px"
				dropdown.style.transform = "translateX(0) translateY(-10px) scale(0.98)"
			}
		}

		// Помечаем как рассчитанное
		this.dropdownPositionsCalculated.set(dropdown, true)
	}

	/**
	 * Пересчет позиций всех dropdown при изменении размера окна
	 */
	recalculateDropdownPositions() {
		// Сбрасываем кэш
		this.dropdownPositionsCalculated = new WeakMap()

		// Если есть активный dropdown, пересчитываем его позицию
		if (this.activeDropdown) {
			const dropdown = this.activeDropdown.querySelector(
				".nav__dropdown, .nav__mega-menu"
			)
			if (dropdown) {
				this.positionDropdown(this.activeDropdown, dropdown)
			}
		}
	}

	/**
	 * Настройка мобильного dropdown
	 */
	setupMobileDropdown(item, link, dropdown) {
		link.addEventListener("click", e => {
			e.preventDefault()
			e.stopPropagation()
			this.toggleMobileDropdown(item, dropdown)
		})

		// Touch события для лучшего отклика
		let touchStartTime = 0

		link.addEventListener(
			"touchstart",
			() => {
				touchStartTime = Date.now()
			},
			{ passive: true }
		)

		link.addEventListener(
			"touchend",
			e => {
				const touchDuration = Date.now() - touchStartTime
				if (touchDuration < 500) {
					e.preventDefault()
					e.stopPropagation()
					this.toggleMobileDropdown(item, dropdown)
				}
			},
			{ passive: false }
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
			// Открываем текущий dropdown
			item.classList.add("nav__item--open")

			// Устанавливаем max-height для анимации
			const contentHeight = dropdown.scrollHeight
			dropdown.style.maxHeight = `${contentHeight}px`

			// ARIA
			const link = item.querySelector(".nav__link")
			link.setAttribute("aria-expanded", "true")

			this.activeDropdown = item
		} else {
			// Закрываем
			this.closeMobileDropdown(item, dropdown)
		}
	}

	/**
	 * Закрытие мобильного dropdown
	 */
	closeMobileDropdown(item, dropdown) {
		item.classList.remove("nav__item--open")
		dropdown.style.maxHeight = "0"

		// ARIA
		const link = item.querySelector(".nav__link")
		link.setAttribute("aria-expanded", "false")

		if (this.activeDropdown === item) {
			this.activeDropdown = null
		}
	}

	/**
	 * Закрытие всех dropdown
	 */
	closeAllDropdowns() {
		document.querySelectorAll(".nav__item--open").forEach(item => {
			const dropdown = item.querySelector(".nav__dropdown, .nav__mega-menu")
			if (dropdown) {
				this.closeMobileDropdown(item, dropdown)
			}
		})

		// Для десктопа
		document
			.querySelectorAll(".nav__dropdown--visible, .nav__mega-menu--visible")
			.forEach(dropdown => {
				const item = dropdown.closest(".nav__item")
				if (item) {
					this.closeDropdown(item, dropdown)
				}
			})
	}

	/**
	 * Настройка клавиатурной навигации
	 */
	setupKeyboardNavigation() {
		// Навигация по Tab
		this.nav?.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				this.closeAllDropdowns()
				if (this.isMobile && this.menuToggle?.checked) {
					this.closeMobileMenu()
				}
			}

			// Навигация стрелками для десктопа
			if (!this.isMobile && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
				const activeElement = document.activeElement
				const dropdown = activeElement.closest(
					".nav__dropdown, .nav__mega-menu"
				)

				if (dropdown) {
					e.preventDefault()
					const links = dropdown.querySelectorAll(
						".nav__dropdown-link, .nav__mega-link"
					)
					const currentIndex = Array.from(links).indexOf(activeElement)

					let nextIndex
					if (e.key === "ArrowDown") {
						nextIndex = currentIndex + 1 < links.length ? currentIndex + 1 : 0
					} else {
						nextIndex =
							currentIndex - 1 >= 0 ? currentIndex - 1 : links.length - 1
					}

					links[nextIndex]?.focus()
				}
			}
		})
	}

	/**
	 * Настройка доступности
	 */
	setupAccessibility() {
		// Добавляем роли и ARIA атрибуты
		this.navList?.setAttribute("role", "menubar")

		document.querySelectorAll(".nav__item").forEach(item => {
			item.setAttribute("role", "none")

			const link = item.querySelector(".nav__link")
			if (link) {
				link.setAttribute("role", "menuitem")

				const dropdown = item.querySelector(".nav__dropdown, .nav__mega-menu")
				if (dropdown) {
					link.setAttribute("aria-haspopup", "true")
					link.setAttribute("aria-expanded", "false")
					dropdown.setAttribute("role", "menu")

					dropdown
						.querySelectorAll(".nav__dropdown-link, .nav__mega-link")
						.forEach(dropdownLink => {
							dropdownLink.setAttribute("role", "menuitem")
						})
				}
			}
		})
	}

	/**
	 * Настройка мобильного меню
	 */
	setupMobileMenu() {
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

		// Закрытие меню при свайпе
		this.setupSwipeGestures()

		// Закрытие при клике на ссылку меню (не dropdown)
		document.querySelectorAll(".nav__link").forEach(link => {
			if (
				!link.parentElement.querySelector(".nav__dropdown, .nav__mega-menu")
			) {
				link.addEventListener("click", () => {
					if (this.isMobile) {
						this.closeMobileMenu()
					}
				})
			}
		})
	}

	/**
	 * Настройка свайп-жестов
	 */
	setupSwipeGestures() {
		let touchStartX = 0
		let touchStartY = 0
		let touchEndX = 0
		let touchEndY = 0

		this.navList?.addEventListener(
			"touchstart",
			e => {
				touchStartX = e.changedTouches[0].screenX
				touchStartY = e.changedTouches[0].screenY
			},
			{ passive: true }
		)

		this.navList?.addEventListener(
			"touchend",
			e => {
				touchEndX = e.changedTouches[0].screenX
				touchEndY = e.changedTouches[0].screenY
				this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY)
			},
			{ passive: true }
		)
	}

	handleSwipe(startX, startY, endX, endY) {
		const swipeThreshold = 50
		const horizontalSwipe = Math.abs(endX - startX)
		const verticalSwipe = Math.abs(endY - startY)

		// Проверяем, что свайп горизонтальный
		if (horizontalSwipe > verticalSwipe && horizontalSwipe > swipeThreshold) {
			if (startX - endX > swipeThreshold) {
				// Свайп влево - закрываем меню
				this.closeMobileMenu()
			}
		}
	}

	/**
	 * Открытие мобильного меню
	 */
	openMobileMenu() {
		this.navList?.classList.add("nav__list--open")
		document.body.style.overflow = "hidden"
		this.closeAllDropdowns()

		// ARIA
		this.menuToggle?.setAttribute("aria-expanded", "true")

		// Фокус на первый элемент меню для доступности
		setTimeout(() => {
			const firstLink = this.navList?.querySelector(".nav__link")
			firstLink?.focus()
		}, 300)
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

		// ARIA
		this.menuToggle?.setAttribute("aria-expanded", "false")
	}

	/**
	 * Обработка изменения размера окна
	 */
	handleResize() {
		const wasMobile = this.isMobile
		this.isMobile = window.matchMedia("(max-width: 768px)").matches

		if (wasMobile !== this.isMobile) {
			this.closeMobileMenu()
			this.closeAllDropdowns()

			// Переинициализация dropdown для нового режима
			this.setupDropdowns()
		}
	}

	/**
	 * Кэширование высот элементов
	 */
	cacheHeights() {
		if (this.heroSection) {
			this.heroHeight = this.heroSection.offsetHeight
		}
		if (this.header) {
			this.headerHeight = this.header.offsetHeight
		}
	}

	/**
	 * Оптимизированная кнопка скролла
	 */
	setupOptimizedScrollButton() {
		if (!this.scrollButton) return

		const handleScrollClick = e => {
			e.preventDefault()
			e.stopPropagation()

			if (this.scrollButtonClicking) return
			this.scrollButtonClicking = true

			// Визуальная обратная связь
			this.scrollButton.style.transform = "scale(0.95)"

			const targetPosition = this.calculateScrollTarget()
			this.performOptimizedScroll(targetPosition)

			setTimeout(() => {
				this.scrollButton.style.transform = ""
				this.scrollButtonClicking = false
			}, 300)
		}

		this.scrollButton.addEventListener("click", handleScrollClick)

		// Touch оптимизация
		if ("ontouchstart" in window) {
			let touchStarted = false

			this.scrollButton.addEventListener(
				"touchstart",
				() => {
					touchStarted = true
					this.scrollButton.style.transform = "scale(0.95)"
				},
				{ passive: true }
			)

			this.scrollButton.addEventListener(
				"touchend",
				e => {
					if (touchStarted) {
						e.preventDefault()
						handleScrollClick(e)
						touchStarted = false
					}
				},
				{ passive: false }
			)
		}

		// Клавиатурная поддержка
		this.scrollButton.addEventListener("keydown", e => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault()
				handleScrollClick(e)
			}
		})
	}

	/**
	 * Вычисление целевой позиции прокрутки
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
	 * Оптимизированная плавная прокрутка
	 */
	performOptimizedScroll(targetPosition, duration = 800) {
		const startPosition = window.pageYOffset
		const distance = targetPosition - startPosition

		if (Math.abs(distance) < 10) {
			window.scrollTo(0, targetPosition)
			return
		}

		let startTime = null
		const easeOutCubic = t => 1 - Math.pow(1 - t, 3)

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
	 * Эффекты при скролле
	 */
	setupScrollEffects() {
		let isScrolling = false

		const updateHeader = () => {
			const currentScrollY = window.pageYOffset

			if (currentScrollY > 100) {
				this.header?.classList.add("header--scrolled")
			} else {
				this.header?.classList.remove("header--scrolled")
			}

			// Скрытие/показ header при скролле
			if (
				currentScrollY > this.lastScrollY &&
				currentScrollY > CONFIG.scroll.headerHideThreshold
			) {
				this.header.style.transform = "translateY(-100%)"
				// Закрываем dropdown при скролле вниз
				if (!this.isMobile) {
					this.closeAllDropdowns()
				}
			} else {
				this.header.style.transform = "translateY(0)"
			}

			this.updateScrollIndicator(currentScrollY)
			this.lastScrollY = currentScrollY
			isScrolling = false
		}

		window.addEventListener(
			"scroll",
			() => {
				if (!isScrolling) {
					window.requestAnimationFrame(updateHeader)
					isScrolling = true
				}

				// Определяем, что скролл закончился
				clearTimeout(this.scrollTimeout)
				this.scrollTimeout = setTimeout(() => {
					this.isScrolling = false
				}, 150)

				this.isScrolling = true
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
			scrollIndicator.style.visibility = opacity === 0 ? "hidden" : "visible"
		} else {
			scrollIndicator.style.opacity = 1
			scrollIndicator.style.visibility = "visible"
		}
	}

	/**
	 * Настройка плавной прокрутки для якорных ссылок
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

					this.performOptimizedScroll(targetPosition, 800)
				}
			})
		})
	}

	/**
	 * Очистка ресурсов
	 */
	destroy() {
		// Удаляем обработчики событий
		clearTimeout(this.resizeDebounceTimer)
		clearTimeout(this.scrollTimeout)

		// Сбрасываем состояния
		this.closeAllDropdowns()
		this.closeMobileMenu()

		// Очищаем кэш
		this.dropdownPositionsCalculated = new WeakMap()
	}
}
