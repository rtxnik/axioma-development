/**
 * Модуль управления навигацией - Оптимизированная версия
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
		this.touchStartX = 0
		this.touchStartY = 0
		this.isMobile = window.matchMedia("(max-width: 768px)").matches
		this.activeDropdown = null

		// Оптимизация: кэширование размеров
		this.heroHeight = 0
		this.headerHeight = 80
		this.scrollButtonClicking = false

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
	 * ОПТИМИЗИРОВАННАЯ настройка кнопки скролла
	 */
	setupOptimizedScrollButton() {
		if (!this.scrollButton) return

		// Убираем все задержки и делаем мгновенный отклик
		const handleScrollClick = e => {
			e.preventDefault()
			e.stopPropagation()

			// Предотвращаем двойные клики
			if (this.scrollButtonClicking) return
			this.scrollButtonClicking = true

			// Мгновенная визуальная обратная связь
			this.scrollButton.style.transform = "scale(0.95)"

			// Быстрое вычисление целевой позиции
			const targetPosition = this.calculateScrollTarget()

			// Запускаем плавную прокрутку
			this.performOptimizedScroll(targetPosition)

			// Восстанавливаем состояние кнопки
			setTimeout(() => {
				this.scrollButton.style.transform = ""
				this.scrollButtonClicking = false
			}, 300)
		}

		// Используем несколько типов событий для максимальной отзывчивости
		this.scrollButton.addEventListener("click", handleScrollClick)

		// Для тач-устройств добавляем touchend для более быстрого отклика
		if ("ontouchstart" in window) {
			let touchStarted = false

			this.scrollButton.addEventListener(
				"touchstart",
				e => {
					touchStarted = true
					// Визуальная обратная связь при касании
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

			this.scrollButton.addEventListener(
				"touchcancel",
				() => {
					touchStarted = false
					this.scrollButton.style.transform = ""
				},
				{ passive: true }
			)
		}

		// Обработка клавиатуры (Enter и Space)
		this.scrollButton.addEventListener("keydown", e => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault()
				handleScrollClick(e)
			}
		})
	}

	/**
	 * Быстрое вычисление целевой позиции прокрутки
	 */
	calculateScrollTarget() {
		const currentScroll = window.pageYOffset

		// Используем кэшированную высоту hero
		if (currentScroll < this.heroHeight - 10) {
			// Если мы в hero секции - скроллим к концу hero
			return this.heroHeight
		} else if (this.aboutSection) {
			// Если мы ниже hero - скроллим к about с учетом header
			const aboutRect = this.aboutSection.getBoundingClientRect()
			return window.pageYOffset + aboutRect.top - this.headerHeight
		}

		// Fallback
		return this.heroHeight
	}

	/**
	 * Оптимизированная плавная прокрутка
	 */
	performOptimizedScroll(targetPosition, duration = 800) {
		const startPosition = window.pageYOffset
		const distance = targetPosition - startPosition

		// Если расстояние очень маленькое, делаем мгновенный переход
		if (Math.abs(distance) < 10) {
			window.scrollTo(0, targetPosition)
			return
		}

		let startTime = null

		// Используем оптимизированную easing функцию
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
				// Финальная корректировка позиции
				window.scrollTo(0, targetPosition)
			}
		}

		requestAnimationFrame(animation)
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

	/**
	 * Оптимизированные эффекты скролла
	 */
	setupScrollEffects() {
		let isScrolling = false

		const updateHeader = () => {
			const currentScrollY = window.pageYOffset

			// Используем transform вместо классов для лучшей производительности
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

			// Скрываем элемент полностью при opacity = 0 для производительности
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

					// Закрываем мобильное меню при переходе
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
}
