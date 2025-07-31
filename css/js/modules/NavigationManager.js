/**
 * Модуль управления навигацией - ИСПРАВЛЕННАЯ версия с улучшенной мобильной поддержкой
 */
import { CONFIG } from "../config/config.js"
import { Utils } from "../utils/utils.js"

export class NavigationManager {
	constructor() {
		this.header = document.querySelector(".header")
		this.scrollButton = document.querySelector(".hero__scroll-button")
		this.heroSection = document.querySelector(".hero")
		this.aboutSection = document.getElementById("about")
		this.navToggle = document.getElementById("menuToggle")
		this.navList = document.querySelector(".nav__list")
		this.lastScrollY = 0
		this.ticking = false
		this.isMobile = window.innerWidth <= 768
		this.openDropdowns = new Set()

		this.init()
	}

	init() {
		this.setupScrollEffects()
		this.setupScrollButton()
		this.setupSmoothScrolling()
		this.setupMobileNavigation()
		this.handleResize()
	}

	setupMobileNavigation() {
		// Обработка мобильного меню
		if (this.navToggle) {
			this.navToggle.addEventListener("change", e => {
				if (!e.target.checked) {
					// Закрываем все подменю при закрытии основного меню
					this.closeAllDropdowns()
				}
			})
		}

		// Обработка dropdown для мобильных устройств
		const dropdownItems = document.querySelectorAll(
			".nav__item--has-dropdown, .nav__item--has-mega"
		)

		dropdownItems.forEach(item => {
			const mobileLink = item.querySelector(".nav__link--mobile")
			const dropdownToggle = item.querySelector(".nav__dropdown-toggle")
			const dropdown = item.querySelector(".nav__dropdown, .nav__mega-menu")

			if (mobileLink && dropdownToggle) {
				// Удаляем старые обработчики
				const newMobileLink = mobileLink.cloneNode(true)
				mobileLink.parentNode.replaceChild(newMobileLink, mobileLink)

				// Добавляем обработчик клика на мобильную ссылку
				newMobileLink.addEventListener("click", e => {
					e.preventDefault()
					e.stopPropagation()

					// Переключаем состояние чекбокса
					dropdownToggle.checked = !dropdownToggle.checked

					// Управляем открытыми dropdown
					if (dropdownToggle.checked) {
						// Закрываем другие открытые dropdown
						this.closeOtherDropdowns(dropdownToggle.id)
						this.openDropdowns.add(dropdownToggle.id)

						// Добавляем класс для анимации
						if (dropdown) {
							dropdown.classList.add("nav__dropdown--opening")
							setTimeout(() => {
								dropdown.classList.remove("nav__dropdown--opening")
							}, 300)
						}
					} else {
						this.openDropdowns.delete(dropdownToggle.id)
					}

					// Обновляем aria-expanded
					newMobileLink.setAttribute("aria-expanded", dropdownToggle.checked)
				})

				// Обработка touch событий для предотвращения задержки
				newMobileLink.addEventListener(
					"touchstart",
					e => {
						e.stopPropagation()
					},
					{ passive: true }
				)
			}
		})

		// Закрытие меню при клике вне его
		document.addEventListener("click", e => {
			if (
				this.isMobile &&
				this.navList &&
				!this.navList.contains(e.target) &&
				!this.navToggle.contains(e.target)
			) {
				this.navToggle.checked = false
				this.closeAllDropdowns()
			}
		})

		// Обработка свайпа для закрытия меню
		this.setupSwipeToClose()
	}

	closeOtherDropdowns(exceptId) {
		this.openDropdowns.forEach(id => {
			if (id !== exceptId) {
				const toggle = document.getElementById(id)
				if (toggle) {
					toggle.checked = false
					const label = document.querySelector(`label[for="${id}"]`)
					if (label) {
						label.setAttribute("aria-expanded", "false")
					}
				}
			}
		})
		this.openDropdowns.clear()
		if (exceptId) {
			this.openDropdowns.add(exceptId)
		}
	}

	closeAllDropdowns() {
		const dropdownToggles = document.querySelectorAll(".nav__dropdown-toggle")
		dropdownToggles.forEach(toggle => {
			toggle.checked = false
			const label = document.querySelector(`label[for="${toggle.id}"]`)
			if (label) {
				label.setAttribute("aria-expanded", "false")
			}
		})
		this.openDropdowns.clear()
	}

	setupSwipeToClose() {
		let touchStartX = 0
		let touchEndX = 0

		if (this.navList) {
			this.navList.addEventListener(
				"touchstart",
				e => {
					touchStartX = e.changedTouches[0].screenX
				},
				{ passive: true }
			)

			this.navList.addEventListener(
				"touchend",
				e => {
					touchEndX = e.changedTouches[0].screenX
					this.handleSwipe()
				},
				{ passive: true }
			)
		}

		const handleSwipe = () => {
			// Свайп вправо для закрытия меню
			if (touchEndX - touchStartX > 100 && this.navToggle.checked) {
				this.navToggle.checked = false
				this.closeAllDropdowns()
			}
		}

		this.handleSwipe = handleSwipe
	}

	handleResize() {
		let resizeTimer

		window.addEventListener("resize", () => {
			clearTimeout(resizeTimer)
			resizeTimer = setTimeout(() => {
				const wasMobile = this.isMobile
				this.isMobile = window.innerWidth <= 768

				// Если переключились с мобильного на десктоп
				if (wasMobile && !this.isMobile) {
					this.navToggle.checked = false
					this.closeAllDropdowns()
				}
			}, 250)
		})
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

			// Скрытие/показ хедера (не скрываем на мобильных если меню открыто)
			if (
				currentScrollY > this.lastScrollY &&
				currentScrollY > CONFIG.scroll.headerHideThreshold &&
				!(this.isMobile && this.navToggle && this.navToggle.checked)
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
				targetPosition = Math.max(targetPosition, heroHeight)

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

	setupSmoothScrolling() {
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener("click", e => {
				const targetId = anchor.getAttribute("href")
				if (targetId === "#") return

				const targetElement = document.querySelector(targetId)
				if (targetElement) {
					e.preventDefault()

					// Закрываем мобильное меню при клике на ссылку
					if (this.isMobile && this.navToggle && this.navToggle.checked) {
						this.navToggle.checked = false
						this.closeAllDropdowns()
					}

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
