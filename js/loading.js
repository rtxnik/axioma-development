/**
 * Loading Management Module
 * Handles loading states and transitions
 */

class LoadingManager {
	constructor() {
		this.loadingContainer = document.getElementById("loadingContainer")
		this.scrollIndicator = document.getElementById("scrollIndicator")

		this.isVideoReady = false
		this.isContentReady = false
		this.minLoadingTime = 1500 // Minimum loading time for UX
		this.startTime = Date.now()

		this.init()
	}

	init() {
		console.log("🔄 Loading manager initialized")
		this.startMinimumLoadingTimer()
	}

	startMinimumLoadingTimer() {
		setTimeout(() => {
			this.isContentReady = true
			console.log("⏱️ Minimum loading time reached")
			this.checkLoadingComplete()
		}, this.minLoadingTime)
	}

	onVideoReady() {
		console.log("📹 Video ready signal received")
		this.isVideoReady = true
		this.checkLoadingComplete()
	}

	onVideoError() {
		console.log("❌ Video error signal received")
		this.isVideoReady = true // Continue without video
		this.checkLoadingComplete()
	}

	checkLoadingComplete() {
		if (this.isVideoReady && this.isContentReady) {
			const elapsedTime = Date.now() - this.startTime
			console.log(`✅ Loading complete after ${elapsedTime}ms`)

			// Ensure minimum loading time has passed for smooth UX
			const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime)

			setTimeout(() => {
				this.hideLoading()
			}, remainingTime)
		}
	}

	hideLoading() {
		console.log("🎭 Hiding loading screen")

		if (this.loadingContainer) {
			this.loadingContainer.classList.add("hidden")

			// Clean up loading container after animation
			setTimeout(() => {
				this.loadingContainer.style.display = "none"
			}, 800)
		}

		// Show scroll indicator after a delay
		setTimeout(() => {
			this.showScrollIndicator()
		}, 500)

		// Try to play video if not already playing
		setTimeout(() => {
			if (window.VideoManager && !window.VideoManager.isVideoPlaying()) {
				window.VideoManager.tryAutoplay()
			}
		}, 300)
	}

	showScrollIndicator() {
		if (this.scrollIndicator) {
			this.scrollIndicator.classList.add("show")
			console.log("⬇️ Scroll indicator shown")
		}
	}

	hideScrollIndicator() {
		if (this.scrollIndicator) {
			this.scrollIndicator.classList.remove("show")
		}
	}

	// Force complete loading (for debugging)
	forceComplete() {
		console.log("🚀 Force completing loading")
		this.isVideoReady = true
		this.isContentReady = true
		this.hideLoading()
	}

	// Show notification utility
	showNotification(message, type = "info", duration = 5000) {
		const notification = document.createElement("div")
		notification.className = `notification notification-${type}`
		notification.textContent = message

		// Styles
		Object.assign(notification.style, {
			position: "fixed",
			top: "100px",
			right: "20px",
			background: this.getNotificationColor(type),
			color: "white",
			padding: "1rem 1.5rem",
			borderRadius: "8px",
			boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
			zIndex: "9999",
			maxWidth: "300px",
			fontSize: "0.875rem",
			lineHeight: "1.4",
			transform: "translateX(100%)",
			transition: "transform 0.3s ease",
		})

		document.body.appendChild(notification)

		// Animate in
		setTimeout(() => {
			notification.style.transform = "translateX(0)"
		}, 100)

		// Auto hide
		setTimeout(() => {
			notification.style.transform = "translateX(100%)"
			setTimeout(() => {
				if (notification.parentNode) {
					notification.parentNode.removeChild(notification)
				}
			}, 300)
		}, duration)

		return notification
	}

	getNotificationColor(type) {
		const colors = {
			success: "#10b981",
			error: "#ef4444",
			warning: "#f59e0b",
			info: "#3b82f6",
		}
		return colors[type] || colors.info
	}

	// Loading states
	setLoadingState(state) {
		console.log(`🔄 Loading state: ${state}`)

		// You can add custom loading states here
		switch (state) {
			case "video-loading":
				// Custom handling for video loading
				break
			case "content-ready":
				this.isContentReady = true
				this.checkLoadingComplete()
				break
			case "error":
				this.showNotification("Произошла ошибка загрузки", "error")
				break
		}
	}

	// Public API
	isLoading() {
		return !this.loadingContainer?.classList.contains("hidden")
	}

	getLoadingProgress() {
		const states = [this.isVideoReady, this.isContentReady]
		const completed = states.filter(Boolean).length
		return (completed / states.length) * 100
	}
}

// Initialize and expose globally
window.LoadingManager = new LoadingManager()
