/**
 * Конфигурация приложения - Оптимизированная версия для мобильных
 */
export const CONFIG = {
	// Анимации
	animation: {
		duration: {
			instant: 100,
			fast: 150,
			base: 300,
			slow: 500,
			slower: 700,
			smooth: 600, // ИСПРАВЛЕНО: Быстрее для мобильных
		},
		easing: {
			default: "ease",
			smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
			bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
			expo: "cubic-bezier(0.16, 1, 0.3, 1)",
			outCubic: "cubic-bezier(0.33, 1, 0.68, 1)",
		},
	},

	// Видео - оптимизированные параметры
	video: {
		minLoadingTime: 800, // ИСПРАВЛЕНО: Еще быстрее на мобильных
		autoplayDelay: 100, // ИСПРАВЛЕНО: Мгновенный autoplay
		autoplayTimeout: 2000, // ИСПРАВЛЕНО: Короче таймаут
		progressUpdateRate: 150, // ИСПРАВЛЕНО: Реже обновления на мобильных
		mobileBreakpoint: 768,
		preloadStrategy: {
			desktop: "auto",
			mobile: "none", // ИСПРАВЛЕНО: Не предзагружаем на мобильных
		},
	},

	// ИСПРАВЛЕНО: Скролл - оптимизированные параметры для мобильных
	scroll: {
		smoothDuration: 600, // ИСПРАВЛЕНО: Быстрее для мобильных
		headerHideThreshold: 150, // ИСПРАВЛЕНО: Меньше порог
		indicatorFadeThreshold: 0.75, // ИСПРАВЛЕНО: Раньше скрываем
		sectionOffset: 0,
		buttonResponseTime: 30, // ИСПРАВЛЕНО: Быстрее отклик
		precision: {
			enabled: false, // ИСПРАВЛЕНО: Отключаем на мобильных
			finalAdjustment: false,
			adjustmentDelay: 50,
		},
		// ИСПРАВЛЕНО: Параметры для нативного скролла на мобильных
		useNativeSmooth: true, // ИСПРАВЛЕНО: Используем нативный на мобильных
		easeFunction: "outCubic",
		interruptible: false, // ИСПРАВЛЕНО: Не прерываем на мобильных
		// ДОБАВЛЕНО: Мобильные настройки
		mobile: {
			useNativeSmooth: true,
			disableCustomScroll: true,
			reducedAnimations: true,
		},
	},

	// Форма
	form: {
		debounceDelay: 200, // ИСПРАВЛЕНО: Быстрее отклик
		submitDelay: 1200, // ИСПРАВЛЕНО: Быстрее отправка
		validationDelay: 150,
		phoneValidation: {
			minLength: 10,
			maxLength: 15,
		},
	},

	// ИСПРАВЛЕНО: Производительность - оптимизированные параметры для мобильных
	performance: {
		throttleDelay: 32, // ИСПРАВЛЕНО: ~30fps для мобильных
		scrollThrottle: 32, // ИСПРАВЛЕНО: Реже на мобильных
		resizeDebounce: 300, // ИСПРАВЛЕНО: Больше debounce
		intersectionThreshold: 0.15, // ИСПРАВЛЕНО: Больше порог
		lazyLoadOffset: "100px", // ИСПРАВЛЕНО: Больше отступ
		usePassiveListeners: true,
		useRAF: true,
		enableGPUAcceleration: false, // ИСПРАВЛЕНО: Отключаем на мобильных
		reducedMotion: {
			respectUserPreference: true,
			fallbackDuration: 0,
		},
		// ДОБАВЛЕНО: Мобильные настройки производительности
		mobile: {
			throttleDelay: 50, // Еще реже на мобильных
			disableParallax: true,
			disableBackdropFilter: false, // Можем оставить современные фильтры
			simplifyAnimations: true,
			reduceEffects: true,
		},
	},

	// ИСПРАВЛЕНО: Параметры кнопки скролла
	scrollButton: {
		fadeInDelay: 200, // ИСПРАВЛЕНО: Быстрее показываем
		animationDuration: 1500, // ИСПРАВЛЕНО: Короче анимация
		hoverScale: 1.03, // ИСПРАВЛЕНО: Меньше hover эффект
		activeScale: 0.9, // ИСПРАВЛЕНО: Больше активный эффект
		touchFeedback: true,
		hapticFeedback: true,
		preventDoubleClick: true,
		doubleClickTimeout: 500, // ИСПРАВЛЕНО: Больше таймаут для мобильных
		// ДОБАВЛЕНО: Мобильные настройки кнопки
		mobile: {
			enlargedTouchTarget: true,
			visualFeedbackDuration: 200,
			hapticIntensity: "light",
		},
	},

	// ИСПРАВЛЕНО: Мобильная оптимизация
	mobile: {
		breakpoint: 768,
		touchThreshold: 15, // ИСПРАВЛЕНО: Больше порог для touch
		swipeThreshold: 60, // ИСПРАВЛЕНО: Больше порог для свайпа
		videoQuality: "low",
		disableEffects: true, // ИСПРАВЛЕНО: Отключаем эффекты по умолчанию
		useReducedMotion: true,
		// ДОБАВЛЕНО: Дополнительные мобильные настройки
		optimizations: {
			disableHoverEffects: true,
			simplifyBackgrounds: true,
			reduceBlurEffects: true,
			disableParallax: true,
			fastTapResponse: true,
		},
		// ДОБАВЛЕНО: Настройки производительности для разных типов устройств
		performance: {
			lowEnd: {
				disableAnimations: true,
				disableBlur: true,
				simplifyUI: true,
			},
			midRange: {
				reduceAnimations: true,
				limitBlur: true,
			},
			highEnd: {
				fullEffects: false, // Все равно ограничиваем на мобильных
			},
		},
	},

	// Кэширование
	cache: {
		enabled: true,
		duration: 1800000, // ИСПРАВЛЕНО: 30 минут для мобильных
		videoCache: false, // ИСПРАВЛЕНО: Не кэшируем видео на мобильных
		imageCache: true,
	},

	// ДОБАВЛЕНО: Настройки доступности
	accessibility: {
		respectReducedMotion: true,
		respectHighContrast: true,
		minTouchTarget: 44, // Минимальный размер touch target
		focusVisible: true,
		announceChanges: true,
	},

	// ДОБАВЛЕНО: Настройки сети
	network: {
		slowConnection: {
			disableAnimations: true,
			reducedQuality: true,
			minimalEffects: true,
		},
		adaptiveLoading: true,
		preloadCritical: true,
		lazyLoadNonCritical: true,
	},

	// Отладка
	debug: {
		enabled: false,
		logPerformance: false,
		showFPS: false,
		logEvents: false,
		// ДОБАВЛЕНО: Мобильная отладка
		mobile: {
			showTouchEvents: false,
			logScrollPerformance: false,
			showViewportInfo: false,
		},
	},

	// ДОБАВЛЕНО: Пороги производительности
	thresholds: {
		fps: {
			good: 50,
			ok: 30,
			poor: 20,
		},
		memory: {
			low: 2, // GB
			medium: 4,
			high: 8,
		},
		cores: {
			low: 2,
			medium: 4,
			high: 8,
		},
		connection: {
			slow: ["slow-2g", "2g"],
			medium: ["3g"],
			fast: ["4g"],
		},
	},
}
