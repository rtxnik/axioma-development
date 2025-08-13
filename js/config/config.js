/**
 * Конфигурация приложения - Оптимизированная версия
 */
export const CONFIG = {
	// Анимации
	animation: {
		duration: {
			instant: 100, // Мгновенный отклик
			fast: 150,
			base: 300,
			slow: 500,
			slower: 700,
			smooth: 800, // Оптимизированная плавная прокрутка
		},
		easing: {
			default: "ease",
			smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Более плавная анимация
			bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
			expo: "cubic-bezier(0.16, 1, 0.3, 1)",
			outCubic: "cubic-bezier(0.33, 1, 0.68, 1)", // Для скролла
		},
	},

	// Видео - оптимизированные параметры
	video: {
		minLoadingTime: 1000, // Уменьшено для более быстрой загрузки
		autoplayDelay: 200, // Быстрее начинаем autoplay
		autoplayTimeout: 3000, // Таймаут для autoplay
		progressUpdateRate: 100, // Частота обновления прогресса (ms)
		mobileBreakpoint: 768, // Точка переключения видео
		preloadStrategy: {
			desktop: "auto", // Полная предзагрузка на десктопе
			mobile: "metadata", // Только метаданные на мобильных
		},
	},

	// Скролл - оптимизированные параметры
	scroll: {
		smoothDuration: 800, // Быстрее для лучшего отклика
		headerHideThreshold: 200,
		indicatorFadeThreshold: 0.8,
		sectionOffset: 0, // Убираем лишний отступ
		buttonResponseTime: 50, // Время отклика кнопки (ms)
		precision: {
			enabled: true,
			finalAdjustment: true,
			adjustmentDelay: 30, // Уменьшено для быстрой корректировки
		},
		// Новые параметры для оптимизации
		useNativeSmooth: false, // Использовать кастомную реализацию
		easeFunction: "outCubic", // Функция плавности
		interruptible: true, // Можно прервать скролл новым действием
	},

	// Форма
	form: {
		debounceDelay: 300, // Уменьшено для более быстрого отклика
		submitDelay: 1500,
		validationDelay: 200, // Задержка валидации
		phoneValidation: {
			minLength: 10,
			maxLength: 15,
		},
	},

	// Производительность - оптимизированные параметры
	performance: {
		throttleDelay: 16, // ~60fps
		scrollThrottle: 10, // Throttle для скролла
		resizeDebounce: 250, // Debounce для resize
		intersectionThreshold: 0.1,
		lazyLoadOffset: "50px", // Отступ для lazy load
		// Новые параметры
		usePassiveListeners: true, // Passive event listeners
		useRAF: true, // RequestAnimationFrame для анимаций
		enableGPUAcceleration: true, // GPU ускорение
		reducedMotion: {
			respectUserPreference: true,
			fallbackDuration: 0,
		},
	},

	// Параметры кнопки скролла - оптимизированные
	scrollButton: {
		fadeInDelay: 300, // Быстрее показываем
		animationDuration: 2000,
		hoverScale: 1.05,
		activeScale: 0.95, // Масштаб при нажатии
		touchFeedback: true, // Визуальная обратная связь на touch
		hapticFeedback: true, // Вибрация на поддерживаемых устройствах
		preventDoubleClick: true, // Предотвращение двойных кликов
		doubleClickTimeout: 300, // Таймаут для двойных кликов
	},

	// Мобильная оптимизация
	mobile: {
		breakpoint: 768,
		touchThreshold: 10, // Порог для определения touch события
		swipeThreshold: 50, // Порог для свайпа
		videoQuality: "low", // Качество видео на мобильных
		disableEffects: false, // Отключать ли эффекты на слабых устройствах
		useReducedMotion: true, // Учитывать настройки reduced motion
	},

	// Кэширование
	cache: {
		enabled: true,
		duration: 3600000, // 1 час в ms
		videoCache: true, // Кэшировать видео
		imageCache: true, // Кэшировать изображения
	},

	// Отладка
	debug: {
		enabled: false, // Включить режим отладки
		logPerformance: false, // Логировать производительность
		showFPS: false, // Показывать FPS
		logEvents: false, // Логировать события
	},
}
