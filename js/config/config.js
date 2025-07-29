/**
 * Конфигурация приложения
 */
export const CONFIG = {
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
