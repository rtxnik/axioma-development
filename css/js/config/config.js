/**
 * Конфигурация приложения (обновленная версия)
 */
export const CONFIG = {
	// Анимации
	animation: {
		duration: {
			fast: 150,
			base: 300,
			slow: 500,
			slower: 700,
			smooth: 1200, // Новый параметр для плавной прокрутки
		},
		easing: {
			default: "ease",
			smooth: "cubic-bezier(0.65, 0, 0.35, 1)",
			bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
			expo: "cubic-bezier(0.16, 1, 0.3, 1)", // Новый easing для прокрутки
		},
	},

	// Видео
	video: {
		minLoadingTime: 1500,
		autoplayDelay: 300,
	},

	// Скролл (обновленные параметры)
	scroll: {
		smoothDuration: 1200, // Длительность плавной прокрутки
		headerHideThreshold: 200,
		indicatorFadeThreshold: 0.8,
		sectionOffset: 10, // Отступ при прокрутке к секции
		precision: {
			// Новые параметры для точности
			enabled: true,
			finalAdjustment: true,
			adjustmentDelay: 50,
		},
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
		scrollDebounce: 10, // Новый параметр для debounce при скролле
	},

	// Параметры иконки скролла
	scrollIcon: {
		fadeInDelay: 500,
		animationDuration: 2000,
		hoverScale: 1.05,
	},
}
