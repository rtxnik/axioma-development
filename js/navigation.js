/**
 * Navigation Management Module
 * Handles scrolling, navigation, and header effects
 */

class NavigationManager {
	constructor() {
		this.header = document.querySelector(".header")
		this.scrollIndicator = document.getElementById("scrollIndicator")
		this.scrollButton = this.scrollIndicator?.querySelector(".scroll-button")

		this.ticking = false

		this.init()
	}

	init() {
		console.log("🧭 Navigation manager initialized")

		this.setupScrollIndicator()
		this.setupHeaderScroll()
		this.setupSmoothScrolling()
		this.setupScrollToTop()
	}

	setupScrollIndicator() {
		if (this.scrollButton) {
			this.scrollButton.addEventListener("click", e => {
				e.preventDefault()
				this.scrollToNextSection()
			})

			console.log("⬇️ Scroll indicator setup complete")
		}
	}

	scrollToNextSection() {
		const aboutSection = document.getElementById("about")

		if (aboutSection) {
			const headerHeight = this.header ? this.header.offsetHeight : 80
			const targetPosition = aboutSection.offsetTop - headerHeight

			this.smoothScrollTo(targetPosition, 1200) // Увеличена длительность для плавности

			console.log("📍 Scrolling to next section")
		}
	}

	smoothScrollTo(targetPosition, duration = 1200) {
		const startPosition = window.pageYOffset
		const distance = targetPosition - startPosition
		let startTime = null

		// Более плавная easing функция
		const easeInOutCubic = t => {
			return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
		}

		const animate = currentTime => {
			if (startTime === null) startTime = currentTime
			const timeElapsed = currentTime - startTime
			const progress = Math.min(timeElapsed / duration, 1)

			const ease = easeInOutCubic(progress)
			window.scrollTo(0, startPosition + distance * ease)

			if (timeElapsed < duration) {
				requestAnimationFrame(animate)
			}
		}

		requestAnimationFrame(animate)
	}

	setupHeaderScroll() {
		const updateHeader = () => {
			const scrollY = window.pageYOffset

			if (this.header) {
				if (scrollY > 100) {
					this.header.style.background = "rgba(0, 0, 0, 0.98)"
					this.header.style.backdropFilter = "blur(20px)"
					this.header.style.borderBottomColor = "rgba(229, 231, 235, 0.3)"
				} else {
					this.header.style.background = "rgba(0, 0, 0, 0.95)"
					this.header.style.backdropFilter = "blur(12px)"
					this.header.style.borderBottomColor = "rgba(229, 231, 235, 0.2)"
				}
			}

			this.updateScrollIndicatorVisibility(scrollY)
			this.ticking = false
		}

		const requestTick = () => {
			if (!this.ticking) {
				requestAnimationFrame(updateHeader)
				this.ticking = true
			}
		}

		window.addEventListener("scroll", requestTick, { passive: true })
		console.log("📜 Header scroll effects setup complete")
	}

	updateScrollIndicatorVisibility(scrollY) {
		if (!this.scrollIndicator) return

		const heroHeight = window.innerHeight
		const fadeStart = heroHeight * 0.8

		if (scrollY > fadeStart) {
			const opacity = Math.max(
				0,
				1 - (scrollY - fadeStart) / (heroHeight * 0.2)
			)
			this.scrollIndicator.style.opacity = opacity
		} else {
			this.scrollIndicator.style.opacity = 1
		}
	}

	setupSmoothScrolling() {
		// Handle all anchor links
		document.querySelectorAll('a[href^="#"]').forEach(anchor => {
			anchor.addEventListener("click", e => {
				e.preventDefault()

				const targetId = anchor.getAttribute("href")
				const targetElement = document.querySelector(targetId)

				if (targetElement) {
					const headerHeight = this.header ? this.header.offsetHeight : 80
					const targetPosition = targetElement.offsetTop - headerHeight

					this.smoothScrollTo(targetPosition, 1000)

					console.log(`🔗 Navigating to ${targetId}`)
				}
			})
		})

		console.log("🔗 Smooth scrolling setup complete")
	}

	setupScrollToTop() {
		this.scrollToTop = () => {
			console.log("⬆️ Scrolling to top")
			this.smoothScrollTo(0, 1000)
		}

		let scrollToTopButton = null

		const showScrollToTop = () => {
			if (window.pageYOffset > window.innerHeight && !scrollToTopButton) {
				scrollToTopButton = this.createScrollToTopButton()
			} else if (
				window.pageYOffset <= window.innerHeight &&
				scrollToTopButton
			) {
				scrollToTopButton.remove()
				scrollToTopButton = null
			}
		}

		window.addEventListener("scroll", showScrollToTop, { passive: true })
	}

	createScrollToTopButton() {
		const button = document.createElement("button")
		button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `

		Object.assign(button.style, {
			position: "fixed",
			bottom: "2rem",
			right: "2rem",
			width: "50px",
			height: "50px",
			borderRadius: "50%",
			background: "rgba(0, 0, 0, 0.8)",
			color: "white",
			border: "none",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			zIndex: "1000",
			transition: "all 0.3s ease",
			backdropFilter: "blur(10px)",
			boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
		})

		button.addEventListener("mouseenter", () => {
			button.style.background = "rgba(0, 0, 0, 0.9)"
			button.style.transform = "scale(1.1)"
		})

		button.addEventListener("mouseleave", () => {
			button.style.background = "rgba(0, 0, 0, 0.8)"
			button.style.transform = "scale(1)"
		})

		button.addEventListener("click", () => {
			this.scrollToTop()
		})

		document.body.appendChild(button)

		setTimeout(() => {
			button.style.opacity = "1"
			button.style.transform = "scale(1)"
		}, 100)

		return button
	}

	// Public API
	navigateToSection(sectionId) {
		const section = document.getElementById(sectionId)
		if (section) {
			const headerHeight = this.header ? this.header.offsetHeight : 80
			const targetPosition = section.offsetTop - headerHeight
			this.smoothScrollTo(targetPosition, 1000)
		}
	}
}

// Initialize and expose globally
window.NavigationManager = new NavigationManager()
