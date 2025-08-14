/**
 * Модуль управления видео - Оптимизированная версия
 */
export class VideoManager {
	constructor(loadingManager) {
		this.loadingManager = loadingManager
		this.video = document.getElementById("heroVideo")
		this.progressContainer = document.getElementById("videoProgress")
		this.progressFill = document.getElementById("videoProgressFill")
		this.scrollIndicator = document.getElementById("scrollIndicator")
		this.playButton = document.getElementById("heroPlayButton")

		// Параметры адаптивного видео
		this.sources = {
			desktop: "./assets/hero-video.mp4",
			mobile: "./assets/hero-video-small.mp4",
		}

		// Оптимизированные параметры
		this.isMobile = window.matchMedia("(max-width: 767px)").matches
		this.videoLoaded = false
		this.autoplayAttempted = false
		this.progressAnimationFrame = null

		if (this.video) {
			this.init()
		}
	}

	init() {
		// Устанавливаем правильный источник видео сразу
		this.setupVideoSource()

		// Настройка событий
		this.setupVideoEvents()

		// Настройка адаптивности
		this.setupResponsive()

		// Оптимизированная загрузка
		this.optimizedVideoLoad()

		// Настройка кнопки воспроизведения
		this.setupPlayButton()
	}

	/**
	 * Установка правильного источника видео
	 */
	setupVideoSource() {
		const videoSrc = this.isMobile ? this.sources.mobile : this.sources.desktop

		// Удаляем все существующие источники
		const sources = this.video.querySelectorAll("source")
		sources.forEach(source => source.remove())

		// Создаем новый источник
		const source = document.createElement("source")
		source.src = videoSrc
		source.type = "video/mp4"
		this.video.appendChild(source)

		// Важные атрибуты для оптимизации
		this.video.muted = true
		this.video.playsInline = true
		this.video.setAttribute("webkit-playsinline", "")
		this.video.preload = "metadata"
	}

	/**
	 * Оптимизированная загрузка видео
	 */
	optimizedVideoLoad() {
		// Используем Intersection Observer для ленивой загрузки
		if ("IntersectionObserver" in window) {
			const observer = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting && !this.videoLoaded) {
							this.loadVideo()
							observer.unobserve(entry.target)
						}
					})
				},
				{ threshold: 0.1 }
			)

			observer.observe(this.video)
		} else {
			// Fallback для старых браузеров
			this.loadVideo()
		}
	}

	/**
	 * Загрузка видео
	 */
	loadVideo() {
		// Меняем preload для полной загрузки
		this.video.preload = "auto"

		// Загружаем видео
		this.video.load()
		this.videoLoaded = true
	}

	/**
	 * Настройка событий видео
	 */
	setupVideoEvents() {
		// Используем passive listeners для лучшей производительности
		const options = { passive: true }

		// Видео готово к воспроизведению
		this.video.addEventListener(
			"canplay",
			() => {
				this.loadingManager.setVideoReady()

				// Пробуем автовоспроизведение только один раз
				if (!this.autoplayAttempted) {
					this.autoplayAttempted = true
					this.tryAutoplay()
				}
			},
			options
		)

		// Видео начало воспроизводиться
		this.video.addEventListener(
			"play",
			() => {
				this.showProgress()
				this.showScrollIndicator()
				this.hidePlayButton()
				this.startProgressAnimation()
			},
			options
		)

		// Видео приостановлено
		this.video.addEventListener(
			"pause",
			() => {
				this.stopProgressAnimation()
				if (
					this.video.currentTime > 0 &&
					this.video.currentTime < this.video.duration
				) {
					this.showPlayButton()
				}
			},
			options
		)

		// Видео завершено
		this.video.addEventListener(
			"ended",
			() => {
				this.stopProgressAnimation()
			},
			options
		)

		// Ошибка загрузки
		this.video.addEventListener(
			"error",
			e => {
				console.error("Video error:", e)
				this.loadingManager.setVideoReady()
				this.hidePlayButton()
				this.hideProgress()
			},
			options
		)

		// Оптимизация для мобильных устройств
		if (this.isMobile) {
			// На мобильных устройствах видео может не автовоспроизводиться
			// Показываем индикатор скролла сразу
			setTimeout(() => {
				if (!this.video.playing) {
					this.showScrollIndicator()
				}
			}, 1000)
		}
	}

	/**
	 * Оптимизированная анимация прогресса
	 */
	startProgressAnimation() {
		const updateProgress = () => {
			if (this.video.paused || this.video.ended) {
				this.stopProgressAnimation()
				return
			}

			if (this.progressFill && this.video.duration) {
				const progress = (this.video.currentTime / this.video.duration) * 100
				// Используем transform вместо width для лучшей производительности
				this.progressFill.style.transform = `scaleX(${progress / 100})`
			}

			this.progressAnimationFrame = requestAnimationFrame(updateProgress)
		}

		updateProgress()
	}

	/**
	 * Остановка анимации прогресса
	 */
	stopProgressAnimation() {
		if (this.progressAnimationFrame) {
			cancelAnimationFrame(this.progressAnimationFrame)
			this.progressAnimationFrame = null
		}
	}

	/**
	 * Попытка автовоспроизведения
	 */
	async tryAutoplay() {
		try {
			// Создаем промис с таймаутом
			const playPromise = this.video.play()

			// Таймаут для предотвращения зависания
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => reject(new Error("Autoplay timeout")), 3000)
			})

			await Promise.race([playPromise, timeoutPromise])
		} catch (error) {
			console.warn("Autoplay failed:", error)
			// На мобильных часто не работает автовоспроизведение
			if (this.isMobile) {
				// Показываем кнопку play
				this.showPlayButton()
				// Но также показываем индикатор скролла
				this.showScrollIndicator()
			} else {
				this.showPlayButton()
			}
		}
	}

	/**
	 * Настройка кнопки воспроизведения
	 */
	setupPlayButton() {
		if (this.playButton) {
			this.playButton.addEventListener("click", async e => {
				e.preventDefault()
				e.stopPropagation()

				try {
					await this.video.play()
					this.hidePlayButton()
				} catch (error) {
					console.error("Manual play failed:", error)
				}
			})
		}
	}

	/**
	 * Показ кнопки воспроизведения
	 */
	showPlayButton() {
		if (this.playButton) {
			this.playButton.style.display = "flex"
			requestAnimationFrame(() => {
				this.playButton.classList.add("hero__play-button--visible")
			})
		}
	}

	/**
	 * Скрытие кнопки воспроизведения
	 */
	hidePlayButton() {
		if (this.playButton) {
			this.playButton.classList.remove("hero__play-button--visible")
			setTimeout(() => {
				this.playButton.style.display = "none"
			}, 300)
		}
	}

	/**
	 * Показ прогресса
	 */
	showProgress() {
		if (this.progressContainer) {
			this.progressContainer.classList.add("hero__progress--visible")
		}
	}

	/**
	 * Скрытие прогресса
	 */
	hideProgress() {
		if (this.progressContainer) {
			this.progressContainer.classList.remove("hero__progress--visible")
		}
	}

	/**
	 * Показ индикатора скролла
	 */
	showScrollIndicator() {
		if (this.scrollIndicator) {
			// Убираем задержку для более быстрого отклика
			requestAnimationFrame(() => {
				this.scrollIndicator.classList.add("hero__scroll-indicator--visible")
			})
		}
	}

	/**
	 * Настройка адаптивности
	 */
	setupResponsive() {
		const mediaQuery = window.matchMedia("(max-width: 767px)")

		// Обработчик изменения размера экрана
		const handleMediaChange = e => {
			const wasMobile = this.isMobile
			this.isMobile = e.matches

			// Если изменился тип устройства, перезагружаем видео
			if (wasMobile !== this.isMobile) {
				this.switchVideoSource()
			}
		}

		// Слушаем изменения
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleMediaChange)
		} else {
			// Fallback для старых браузеров
			mediaQuery.addListener(handleMediaChange)
		}
	}

	/**
	 * Переключение источника видео при изменении размера экрана
	 */
	switchVideoSource() {
		// Сохраняем текущее время и состояние воспроизведения
		const currentTime = this.video.currentTime
		const wasPlaying = !this.video.paused

		// Останавливаем текущее видео
		this.video.pause()

		// Устанавливаем новый источник
		this.setupVideoSource()

		// Загружаем новое видео
		this.video.load()

		// Восстанавливаем позицию после загрузки
		this.video.addEventListener(
			"loadedmetadata",
			() => {
				this.video.currentTime = currentTime

				if (wasPlaying) {
					this.video.play().catch(error => {
						console.warn(
							"Could not resume playback after source switch:",
							error
						)
					})
				}
			},
			{ once: true }
		)
	}

	/**
	 * Очистка ресурсов
	 */
	destroy() {
		this.stopProgressAnimation()

		// Удаляем слушатели событий
		if (this.video) {
			this.video.pause()
			this.video.src = ""
			this.video.load()
		}
	}
}
