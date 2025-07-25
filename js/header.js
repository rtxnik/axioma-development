// ===============================================
// МИНИМАЛЬНАЯ ВЕРСИЯ БЕЗ НАВИГАЦИОННОЙ ЛОГИКИ
// ===============================================

// Только базовые функции, не связанные с навигацией

class MinimalEffects {
	constructor() {
		this.init()
	}

	init() {
		this.setupSmoothAnimations()
		this.setupScrollEffects()
	}

	// Плавные анимации при появлении элементов
	setupSmoothAnimations() {
		const observerOptions = {
			threshold: 0.1,
			rootMargin: "0px 0px -50px 0px",
		}

		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add("animate-in")
				}
			})
		}, observerOptions)

		// Наблюдение за элементами для анимации
		const animatedElements = document.querySelectorAll(".hero h1, .hero p")
		animatedElements.forEach(el => observer.observe(el))
	}

	// Эффекты скролла для хедера
	setupScrollEffects() {
		let ticking = false
		let lastScrollY = window.scrollY
		const header = document.querySelector(".header")

		const updateHeader = () => {
			const currentScrollY = window.scrollY

			// Добавляем класс при скролле
			if (currentScrollY > 100) {
				header.classList.add("scrolled")
			} else {
				header.classList.remove("scrolled")
			}

			// Скрытие/показ хедера при скролле
			if (currentScrollY > lastScrollY && currentScrollY > 200) {
				header.style.transform = "translateY(-100%)"
			} else {
				header.style.transform = "translateY(0)"
			}

			lastScrollY = currentScrollY
			ticking = false
		}

		window.addEventListener(
			"scroll",
			() => {
				if (!ticking) {
					requestAnimationFrame(updateHeader)
					ticking = true
				}
			},
			{ passive: true }
		)
	}
}

// ===============================================
// ДОПОЛНИТЕЛЬНЫЕ CSS СТИЛИ
// ===============================================

function addCustomStyles() {
	const style = document.createElement("style")
	style.textContent = `
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .header.scrolled {
      background: rgba(26, 26, 26, 0.98);
      backdrop-filter: blur(25px) saturate(200%);
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
    }
    
    .animate-in {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    /* Улучшения для CSS-only навигации */
    @media (max-width: 768px) {
      /* Закрытие меню при клике на ссылку */
      .nav__sub-link:target ~ #nav__menu-btn,
      .nav__mega-link:target ~ #nav__menu-btn {
        display: none;
      }
      
      /* Плавное закрытие мобильных dropdown */
      .nav__sub-list,
      .nav__mega-menu {
        transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
      }
    }
  `
	document.head.appendChild(style)
}

// ===============================================
// ИНИЦИАЛИЗАЦИЯ
// ===============================================

document.addEventListener("DOMContentLoaded", () => {
	// Добавляем стили
	addCustomStyles()

	// Инициализируем только минимальные эффекты
	new MinimalEffects()

	// Анимация появления навигации
	const navItems = document.querySelectorAll(".nav__item")
	navItems.forEach((item, index) => {
		item.style.animationDelay = `${index * 0.1}s`
		item.classList.add("fade-in-up")
	})

	// Плавная загрузка страницы
	document.body.classList.add("loaded")

	console.log("✨ CSS-only navigation initialized!")
})

// Оптимизация производительности
window.addEventListener("load", () => {
	// Предзагрузка изображений
	const images = document.querySelectorAll("img[src]")
	images.forEach(img => {
		const link = document.createElement("link")
		link.rel = "preload"
		link.as = "image"
		link.href = img.src
		document.head.appendChild(link)
	})
})
