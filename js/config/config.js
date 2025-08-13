/**
 * Конфигурация приложения - Оптимизированная версия 2.0
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
			smooth: 800,
		},
		easing: {
			default: "ease",
			smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
			bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
			expo: "cubic-bezier(0.16, 1, 0.3, 1)",
			outCubic: "cubic-bezier(0.33, 1, 0.68, 1)",
			inOutCubic: "cubic-bezier(0.65, 0, 0.35, 1)",
			outQuart: "cubic-bezier(0.25, 1, 0.5, 1)",
		},
	},

	// Навигация
	navigation: {
		// Задержки для hover эффектов
		hoverDelay: {
			open: 100, // Задержка перед открытием dropdown
			close: 300, // Задержка перед закрытием dropdown
		},
		// Мобильная навигация
		mobile: {
			breakpoint: 768,
			swipeThreshold: 50, // Минимальное расстояние для свайпа
			scrollLock: true, // Блокировать скролл при открытом меню
		},
		// Dropdown настройки
		dropdown: {
			autoPosition: true, // Автоматическое позиционирование
			maxHeight: 420, // Максимальная высота scrollable dropdown
			edgeMargin: 20, // Минимальный отступ от края экрана
			arrowSize: 12, // Размер стрелки-указателя
		},
		// Mega menu настройки
		megaMenu: {
			maxWidth: 900, // Максимальная ширина
			minWidth: 700, // Минимальная ширина
			columnMinWidth: 200, // Минимальная ширина колонки
			responsiveWidth: "min(90vw, 900px)", // Адаптивная ширина
		},
		// Производительность
		performance: {
			throttleScroll: 10, // Throttle для скролла
			debounceResize: 250, // Debounce для resize
			cachePositions: true, // Кэшировать позиции dropdown
		},
		// Доступность
		accessibility: {
			focusTimeout: 100, // Задержка для focus событий
			announceChanges: true, // Объявлять изменения для screen readers
			keyboardNavigation: true, // Поддержка клавиатурной навигации
		},
	},

	// Видео
	video: {
		minLoadingTime: 1000,
		autoplayDelay: 200,
		autoplayTimeout: 3000,
		progressUpdateRate: 100,
		mobileBreakpoint: 768,
		preloadStrategy: {
			desktop: "auto",
			mobile: "metadata",
		},
	},

	// Скролл
	scroll: {
		smoothDuration: 800,
		headerHideThreshold: 200,
		indicatorFadeThreshold: 0.8,
		sectionOffset: 0,
		buttonResponseTime: 50,
		precision: {
			enabled: true,
			finalAdjustment: true,
			adjustmentDelay: 30,
		},
		useNativeSmooth: false,
		easeFunction: "outCubic",
		interruptible: true,
	},

	// Форма
	form: {
		debounceDelay: 300,
		submitDelay: 1500,
		validationDelay: 200,
		phoneValidation: {
			minLength: 10,
			maxLength: 15,
		},
		countrySelector: {
			searchDebounce: 200, // Задержка поиска стран
			maxVisibleItems: 10, // Максимум видимых стран
		},
		toast: {
			duration: 4000, // Длительность показа уведомления
			position: "top-right", // Позиция уведомлений
			maxToasts: 3, // Максимум уведомлений одновременно
		},
	},

	// Производительность
	performance: {
		throttleDelay: 16, // ~60fps
		scrollThrottle: 10,
		resizeDebounce: 250,
		intersectionThreshold: 0.1,
		lazyLoadOffset: "50px",
		usePassiveListeners: true,
		useRAF: true,
		enableGPUAcceleration: true,
		reducedMotion: {
			respectUserPreference: true,
			fallbackDuration: 0,
		},
		// Оптимизация изображений
		images: {
			webpSupport: true, // Проверять поддержку WebP
			lazyLoad: true, // Ленивая загрузка
			placeholder: true, // Показывать placeholder
		},
	},

	// Параметры кнопки скролла
	scrollButton: {
		fadeInDelay: 300,
		animationDuration: 2000,
		hoverScale: 1.05,
		activeScale: 0.95,
		touchFeedback: true,
		hapticFeedback: true,
		preventDoubleClick: true,
		doubleClickTimeout: 300,
	},

	// Мобильная оптимизация
	mobile: {
		breakpoint: 768,
		touchThreshold: 10,
		swipeThreshold: 50,
		videoQuality: "low",
		disableEffects: false,
		useReducedMotion: true,
		// iOS специфичные настройки
		ios: {
			preventZoom: true, // Предотвращать zoom при двойном тапе
			fixViewportHeight: true, // Фиксить высоту viewport
			smoothScroll: true, // Плавный скролл
		},
		// Android специфичные настройки
		android: {
			addressBarHeight: 56, // Высота адресной строки
			navigationBarHeight: 48, // Высота навигации
		},
	},

	// Кэширование
	cache: {
		enabled: true,
		duration: 3600000, // 1 час
		videoCache: true,
		imageCache: true,
		// Стратегии кэширования
		strategies: {
			static: "cacheFirst", // Статичные ресурсы
			dynamic: "networkFirst", // Динамический контент
			images: "staleWhileRevalidate", // Изображения
		},
	},

	// Аналитика (если используется)
	analytics: {
		enabled: false,
		trackEvents: false,
		trackPerformance: false,
		ga4: {
			measurementId: "", // Google Analytics 4 ID
		},
	},

	// Отладка
	debug: {
		enabled: false,
		logPerformance: false,
		showFPS: false,
		logEvents: false,
		// Дополнительные опции отладки
		showTouchPoints: false, // Показывать точки касания
		showScrollPosition: false, // Показывать позицию скролла
		showViewportSize: false, // Показывать размер viewport
		highlightUpdates: false, // Подсвечивать обновления DOM
	},

	// Безопасность
	security: {
		csp: {
			enabled: false, // Content Security Policy
			reportOnly: false,
		},
		sanitizeInput: true, // Санитизация пользовательского ввода
		preventXSS: true, // Предотвращение XSS атак
	},

	// API endpoints (если используются)
	api: {
		baseURL: "",
		timeout: 10000, // 10 секунд
		retryAttempts: 3,
		retryDelay: 1000,
		endpoints: {
			contact: "/api/contact",
			newsletter: "/api/newsletter",
		},
	},

	// Локализация
	i18n: {
		defaultLocale: "ru",
		supportedLocales: ["ru", "en"],
		detectBrowserLocale: false,
	},

	// Темы
	themes: {
		default: "dark",
		available: ["dark", "light"],
		autoDetect: false, // Автоопределение темы системы
	},
}
