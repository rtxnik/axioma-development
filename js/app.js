/**
 * Главный JavaScript файл приложения
 * Модульная структура с оптимизацией производительности
 */

// ===============================================
// КОНФИГУРАЦИЯ
// ===============================================
const CONFIG = {
	// Анимации
	animation: {
		duration: {
			fast: 150,
			base: 300,
			slow: 500,
			slower: 700,
		},
		easing: {
			default: "ease",
			smooth: "cubic-bezier(0.65, 0, 0.35, 1)",
			bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
		},
	},

	// Видео
	video: {
		minLoadingTime: 1500,
		autoplayDelay: 300,
	},

	// Скролл
	scroll: {
		smoothDuration: 1200,
		headerHideThreshold: 200,
		indicatorFadeThreshold: 0.8,
	},

	// Форма
	form: {
		debounceDelay: 500,
		submitDelay: 1500,
	},

	// Производительность
	performance: {
		throttleDelay: 16, // ~60fps
		intersectionThreshold: 0.1,
	},
}

// ===============================================
// УТИЛИТЫ
// ===============================================
const Utils = {
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

// ===============================================
// МОДУЛЬ ЗАГРУЗКИ
// ===============================================
class LoadingManager {
	constructor() {
		this.loadingScreen = document.getElementById("loadingScreen")
		this.states = {
			video: false,
			content: false,
			images: false,
		}
		this.startTime = Date.now()
		this.init()
	}

	init() {
		// Минимальное время загрузки
		setTimeout(() => {
			this.states.content = true
			this.checkComplete()
		}, CONFIG.video.minLoadingTime)

		// Проверка загрузки изображений
		this.checkImages()
	}

	checkImages() {
		const images = document.querySelectorAll('img[loading="eager"]')
		let loadedCount = 0

		if (images.length === 0) {
			this.states.images = true
			this.checkComplete()
			return
		}

		images.forEach(img => {
			if (img.complete) {
				loadedCount++
			} else {
				img.addEventListener("load", () => {
					loadedCount++
					if (loadedCount === images.length) {
						this.states.images = true
						this.checkComplete()
					}
				})
			}
		})

		if (loadedCount === images.length) {
			this.states.images = true
			this.checkComplete()
		}
	}

	setVideoReady() {
		this.states.video = true
		this.checkComplete()
	}

	checkComplete() {
		const allReady = Object.values(this.states).every(state => state)

		if (allReady) {
			const elapsed = Date.now() - this.startTime
			const remaining = Math.max(0, CONFIG.video.minLoadingTime - elapsed)

			setTimeout(() => this.hide(), remaining)
		}
	}

	hide() {
		if (this.loadingScreen) {
			this.loadingScreen.classList.add("loading--hidden")

			setTimeout(() => {
				this.loadingScreen.style.display = "none"
				document.body.classList.add("loaded")
			}, 800)
		}
	}
}

// ===============================================
// МОДУЛЬ ВИДЕО
// ===============================================
class VideoManager {
	constructor() {
		this.video = document.getElementById("heroVideo")
		this.progressContainer = document.getElementById("videoProgress")
		this.progressFill = document.getElementById("videoProgressFill")
		this.scrollIndicator = document.getElementById("scrollIndicator")

		if (this.video) {
			this.init()
		}
	}

	init() {
		this.setupVideoEvents()
		this.loadVideo()
	}

	setupVideoEvents() {
		this.video.addEventListener("canplay", () => {
			window.loadingManager.setVideoReady()
			this.tryAutoplay()
		})

		this.video.addEventListener("play", () => {
			this.showProgress()
			this.showScrollIndicator()
		})

		this.video.addEventListener("timeupdate", () => {
			this.updateProgress()
		})

		this.video.addEventListener("error", () => {
			console.error("Video error:", this.video.error)
			window.loadingManager.setVideoReady() // Продолжить без видео
		})
	}

	loadVideo() {
		this.video.muted = true
		this.video.playsInline = true
		this.video.load()
	}

	async tryAutoplay() {
		try {
			await this.video.play()
		} catch (error) {
			console.warn("Autoplay failed:", error)
			this.showPlayButton()
		}
	}

	showPlayButton() {
		const playButton = document.createElement("button")
		playButton.className = "hero__play-button"
		playButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
      </svg>
      <span>Воспроизвести</span>
    `

		playButton.addEventListener("click", async () => {
			try {
				await this.video.play()
				playButton.remove()
			} catch (error) {
				console.error("Manual play failed:", error)
			}
		})

		this.video.parentElement.appendChild(playButton)
	}

	updateProgress() {
		if (this.progressFill && this.video.duration) {
			const progress = (this.video.currentTime / this.video.duration) * 100
			this.progressFill.style.width = `${progress}%`
		}
	}

	showProgress() {
		if (this.progressContainer) {
			this.progressContainer.classList.add("hero__progress--visible")
		}
	}

	showScrollIndicator() {
		setTimeout(() => {
			if (this.scrollIndicator) {
				this.scrollIndicator.classList.add("hero__scroll-indicator--visible")
			}
		}, 500)
	}
}

// ===============================================
// МОДУЛЬ НАВИГАЦИИ
// ===============================================
class NavigationManager {
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
				const aboutSection = document.getElementById("about")
				if (aboutSection) {
					const headerHeight = this.header ? this.header.offsetHeight : 80
					const targetPosition = aboutSection.offsetTop - headerHeight
					Utils.smoothScrollTo(targetPosition)
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

// ===============================================
// МОДУЛЬ ФОРМ
// ===============================================
class FormManager {
	constructor() {
		this.form = document.getElementById("contactForm")
		if (this.form) {
			this.init()
		}
	}

	init() {
		this.setupFormValidation()
		this.setupCountrySelector()
		this.setupFormEffects()
	}

	setupFormValidation() {
		const inputs = this.form.querySelectorAll(".form__input")

		inputs.forEach(input => {
			// Валидация при потере фокуса
			input.addEventListener("blur", () => this.validateField(input))

			// Валидация в реальном времени с debounce
			input.addEventListener(
				"input",
				Utils.debounce(() => {
					if (input.value) this.validateField(input)
				}, CONFIG.form.debounceDelay)
			)

			// Обновление состояния заполненности
			input.addEventListener("input", () => {
				const group = input.closest(".form__group")
				if (input.value) {
					group.classList.add("form__group--filled")
				} else {
					group.classList.remove("form__group--filled")
				}
			})
		})

		// Обработка отправки формы
		this.form.addEventListener("submit", e => this.handleSubmit(e))
	}

	validateField(input) {
		const group = input.closest(".form__group")
		const error = group.querySelector(".form__error")
		let isValid = true
		let errorMessage = ""

		// Проверка обязательности
		if (input.hasAttribute("required") && !input.value.trim()) {
			isValid = false
			errorMessage = "Это поле обязательно"
		}

		// Проверка email
		if (input.type === "email" && input.value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(input.value)) {
				isValid = false
				errorMessage = "Введите корректный email"
			}
		}

		// Проверка телефона
		if (input.type === "tel" && input.value) {
			const phoneDigits = input.value.replace(/\D/g, "")
			if (phoneDigits.length < 10) {
				isValid = false
				errorMessage = "Введите корректный номер телефона"
			}
		}

		// Обновление UI
		if (isValid) {
			group.classList.remove("form__group--error")
			error.textContent = ""
		} else {
			group.classList.add("form__group--error")
			error.textContent = errorMessage
		}

		return isValid
	}

	setupCountrySelector() {
		const selector = this.form.querySelector(".country-selector")
		if (!selector) return

		const button = selector.querySelector(".country-selector__button")
		const dropdown = selector.querySelector(".country-selector__dropdown")
		const searchInput = selector.querySelector(
			".country-selector__search-input"
		)
		const phoneInput = this.form.querySelector(".form__input--phone")

		// Открытие/закрытие dropdown
		button.addEventListener("click", e => {
			e.preventDefault()
			const isOpen = dropdown.classList.contains(
				"country-selector__dropdown--open"
			)

			if (isOpen) {
				this.closeCountryDropdown(button, dropdown)
			} else {
				this.openCountryDropdown(button, dropdown)
				searchInput.focus()
			}
		})

		// Выбор страны
		dropdown.addEventListener("click", e => {
			const item = e.target.closest(".country-selector__item")
			if (item) {
				this.selectCountry(item, button, dropdown, phoneInput)
			}
		})

		// Поиск стран
		searchInput.addEventListener("input", e => {
			this.searchCountries(e.target.value, dropdown)
		})

		// Закрытие при клике вне
		document.addEventListener("click", e => {
			if (!selector.contains(e.target)) {
				this.closeCountryDropdown(button, dropdown)
			}
		})
	}

	openCountryDropdown(button, dropdown) {
		dropdown.classList.add("country-selector__dropdown--open")
		button.setAttribute("aria-expanded", "true")
	}

	closeCountryDropdown(button, dropdown) {
		dropdown.classList.remove("country-selector__dropdown--open")
		button.setAttribute("aria-expanded", "false")
	}

	selectCountry(item, button, dropdown, phoneInput) {
		// Обновление выбранной страны
		const flag = item.dataset.flag
		const code = item.dataset.code

		button.querySelector(".country-selector__flag").textContent = flag

		// Обновление активного элемента
		dropdown.querySelectorAll(".country-selector__item").forEach(el => {
			el.classList.remove("country-selector__item--selected")
			el.setAttribute("aria-selected", "false")
		})

		item.classList.add("country-selector__item--selected")
		item.setAttribute("aria-selected", "true")

		// Обновление поля телефона
		phoneInput.value = code + " "
		phoneInput.focus()

		// Закрытие dropdown
		this.closeCountryDropdown(button, dropdown)
	}

	searchCountries(query, dropdown) {
		const items = dropdown.querySelectorAll(".country-selector__item")
		const searchQuery = query.toLowerCase()

		items.forEach(item => {
			const name = item
				.querySelector(".country-selector__item-name")
				.textContent.toLowerCase()
			const code = item.querySelector(
				".country-selector__item-code"
			).textContent

			if (name.includes(searchQuery) || code.includes(searchQuery)) {
				item.style.display = ""
			} else {
				item.style.display = "none"
			}
		})
	}

	setupFormEffects() {
		// Эффект фокуса
		const inputs = this.form.querySelectorAll(".form__input")

		inputs.forEach(input => {
			input.addEventListener("focus", () => {
				input.closest(".form__group").classList.add("form__group--focused")
			})

			input.addEventListener("blur", () => {
				input.closest(".form__group").classList.remove("form__group--focused")
			})
		})
	}

	async handleSubmit(e) {
		e.preventDefault()

		// Валидация всех полей
		const inputs = this.form.querySelectorAll(".form__input")
		let isValid = true

		inputs.forEach(input => {
			if (!this.validateField(input)) {
				isValid = false
			}
		})

		if (!isValid) return

		// Анимация отправки
		const submitButton = this.form.querySelector(".button--submit")
		const buttonText = submitButton.querySelector(".button__text")
		const originalText = buttonText.textContent

		submitButton.classList.add("button--loading")
		buttonText.textContent = "Отправляется..."
		submitButton.disabled = true

		try {
			// Имитация отправки
			await new Promise(resolve => setTimeout(resolve, CONFIG.form.submitDelay))

			// Успех
			submitButton.classList.remove("button--loading")
			submitButton.classList.add("button--success")
			buttonText.textContent = "Отправлено!"

			// Сброс формы
			setTimeout(() => {
				this.form.reset()
				this.form.querySelectorAll(".form__group").forEach(group => {
					group.classList.remove("form__group--filled", "form__group--error")
				})

				submitButton.classList.remove("button--success")
				buttonText.textContent = originalText
				submitButton.disabled = false
			}, 2000)
		} catch (error) {
			// Ошибка
			submitButton.classList.remove("button--loading")
			submitButton.classList.add("button--error")
			buttonText.textContent = "Ошибка"

			setTimeout(() => {
				submitButton.classList.remove("button--error")
				buttonText.textContent = originalText
				submitButton.disabled = false
			}, 2000)
		}
	}
}

// ===============================================
// МОДУЛЬ ПАРАЛЛАКСА
// ===============================================
class ParallaxManager {
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

// ===============================================
// МОДУЛЬ ЛЕНИВОЙ ЗАГРУЗКИ
// ===============================================
class LazyLoadManager {
	constructor() {
		this.images = document.querySelectorAll('img[loading="lazy"]')
		this.videos = document.querySelectorAll("video[data-lazy]")

		if ("IntersectionObserver" in window) {
			this.init()
		} else {
			// Fallback для старых браузеров
			this.loadAll()
		}
	}

	init() {
		const options = {
			root: null,
			rootMargin: "50px",
			threshold: CONFIG.performance.intersectionThreshold,
		}

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.loadElement(entry.target)
					this.observer.unobserve(entry.target)
				}
			})
		}, options)

		// Наблюдение за изображениями
		this.images.forEach(img => this.observer.observe(img))

		// Наблюдение за видео
		this.videos.forEach(video => this.observer.observe(video))
	}

	loadElement(element) {
		if (element.tagName === "IMG") {
			element.src = element.dataset.src || element.src
			element.removeAttribute("data-src")
		} else if (element.tagName === "VIDEO") {
			element.src = element.dataset.src
			element.load()
			element.removeAttribute("data-lazy")
		}
	}

	loadAll() {
		this.images.forEach(img => this.loadElement(img))
		this.videos.forEach(video => this.loadElement(video))
	}
}

// ===============================================
// МОДУЛЬ АНИМАЦИЙ ПРИ СКРОЛЛЕ
// ===============================================
class ScrollAnimationManager {
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

// ===============================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ===============================================
class App {
	constructor() {
		this.modules = {}
	}

	init() {
		// Проверка поддержки
		this.checkSupport()

		// Инициализация модулей
		this.modules.loading = new LoadingManager()
		this.modules.video = new VideoManager()
		this.modules.navigation = new NavigationManager()
		this.modules.form = new FormManager()
		this.modules.parallax = new ParallaxManager()
		this.modules.lazyLoad = new LazyLoadManager()
		this.modules.scrollAnimation = new ScrollAnimationManager()

		// Глобальные ссылки
		window.loadingManager = this.modules.loading

		// Обработка ошибок
		this.setupErrorHandling()

		console.log("✨ App initialized successfully")
	}

	checkSupport() {
		// Проверка WebP
		const webpTest = new Image()
		webpTest.onload = webpTest.onerror = () => {
			const isWebpSupported = webpTest.height === 2
			if (isWebpSupported) {
				document.documentElement.classList.add("webp")
			}
		}
		webpTest.src =
			"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
	}

	setupErrorHandling() {
		window.addEventListener("error", e => {
			console.error("Global error:", e.error)

			// Можно отправить ошибку на сервер
			// this.logError(e.error);
		})

		window.addEventListener("unhandledrejection", e => {
			console.error("Unhandled promise rejection:", e.reason)

			// Можно отправить ошибку на сервер
			// this.logError(e.reason);
		})
	}
}

// ===============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ===============================================
document.addEventListener("DOMContentLoaded", () => {
	const app = new App()
	app.init()
})

// Экспорт для использования в других модулях
if (typeof module !== "undefined" && module.exports) {
	module.exports = { App, Utils, CONFIG }
}
