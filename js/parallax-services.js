// Параллакс эффект для секции взаимосвязи
document.addEventListener("DOMContentLoaded", function () {
	const parallaxLayer = document.querySelector(".parallax-layer")
	const interactionSection = document.querySelector(".interaction-section")

	// Проверяем существование элементов
	if (!parallaxLayer || !interactionSection) {
		return
	}

	// Проверяем размер экрана (отключаем на мобильных)
	if (window.innerWidth < 768) {
		return
	}

	// Переменные для оптимизации
	let ticking = false
	let lastScrollY = 0
	let sectionCenterY = 0

	// Функция для получения центра секции
	function updateSectionCenter() {
		const rect = interactionSection.getBoundingClientRect()
		const scrollY = window.pageYOffset || document.documentElement.scrollTop
		sectionCenterY = rect.top + scrollY + rect.height / 2
	}

	// Функция обновления параллакса
	function updateParallax() {
		const scrollY = window.pageYOffset || document.documentElement.scrollTop
		const windowCenterY = scrollY + window.innerHeight / 2

		// Рассчитываем расстояние от центра окна до центра секции
		const distance = windowCenterY - sectionCenterY

		// Коэффициент параллакса (меньше = медленнее движение)
		const parallaxSpeed = 0.3

		// Рассчитываем смещение
		const parallaxOffset = distance * parallaxSpeed

		// Применяем трансформацию через CSS переменные
		parallaxLayer.style.setProperty("--parallax-y", `${parallaxOffset}px`)

		ticking = false
	}

	// Функция для запроса анимации
	function requestTick() {
		if (!ticking) {
			window.requestAnimationFrame(updateParallax)
			ticking = true
		}
	}

	// Обработчик события скролла
	function handleScroll() {
		lastScrollY = window.scrollY
		requestTick()
	}

	// Обработчик изменения размера окна
	function handleResize() {
		// Обновляем центр секции
		updateSectionCenter()

		// Отключаем параллакс на мобильных устройствах
		if (window.innerWidth < 768) {
			parallaxLayer.style.removeProperty("--parallax-y")
			window.removeEventListener("scroll", handleScroll)
		} else {
			window.addEventListener("scroll", handleScroll, { passive: true })
			updateParallax()
		}
	}

	// Добавляем обработчики событий
	window.addEventListener("scroll", handleScroll, { passive: true })
	window.addEventListener("resize", handleResize)
	window.addEventListener("load", function () {
		updateSectionCenter()
		updateParallax()
	})

	// Инициализация
	updateSectionCenter()
	updateParallax()
})

// Добавляем CSS стили для работы с CSS переменными
const style = document.createElement("style")
style.textContent = `
    @media (min-width: 768px) {
        .parallax-layer::before {
            transform: translateY(calc(-50% + var(--parallax-y, 0px)));
            transition: none;
        }
    }
`
document.head.appendChild(style)
