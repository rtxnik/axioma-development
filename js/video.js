/**
 * Video Management Module
 * Handles video loading, playback, and progress tracking
 */

class VideoManager {
	constructor() {
		this.video = document.getElementById("heroVideo")
		this.progressContainer = document.getElementById("videoProgressContainer")
		this.progressFill = document.getElementById("videoProgressFill")
		this.isVideoLoaded = false
		this.isPlaying = false
		this.hasUserInteracted = false

		this.init()
	}

	init() {
		if (!this.video) {
			console.warn("Video element not found")
			return
		}

		this.setupVideoEvents()
		this.setupUserInteraction()
		this.loadVideo()
	}

	setupVideoEvents() {
		// Loading events
		this.video.addEventListener("loadstart", () => {
			console.log("📹 Video loading started")
		})

		this.video.addEventListener("loadedmetadata", () => {
			console.log("📹 Video metadata loaded")
			console.log(`Duration: ${this.video.duration}s`)
			console.log(
				`Dimensions: ${this.video.videoWidth}x${this.video.videoHeight}`
			)
		})

		this.video.addEventListener("canplay", () => {
			console.log("📹 Video ready to play")
			this.isVideoLoaded = true
			this.onVideoReady()
		})

		this.video.addEventListener("canplaythrough", () => {
			console.log("📹 Video can play through")
		})

		// Playback events
		this.video.addEventListener("play", () => {
			console.log("▶️ Video started playing")
			this.isPlaying = true
			this.showProgressBar()
		})

		this.video.addEventListener("pause", () => {
			console.log("⏸️ Video paused")
			this.isPlaying = false
		})

		this.video.addEventListener("ended", () => {
			console.log("🔄 Video ended (will loop)")
		})

		// Progress tracking
		this.video.addEventListener("timeupdate", () => {
			this.updateProgress()
		})

		// Error handling
		this.video.addEventListener("error", e => {
			console.error("❌ Video error:", this.video.error)
			this.handleVideoError()
		})

		this.video.addEventListener("stalled", () => {
			console.warn("⚠️ Video stalled")
		})
	}

	setupUserInteraction() {
		// Track user interaction for autoplay policy
		const interactions = ["click", "touchstart", "keydown"]

		const handleInteraction = () => {
			this.hasUserInteracted = true
			this.tryAutoplay()

			// Remove listeners after first interaction
			interactions.forEach(event => {
				document.removeEventListener(event, handleInteraction)
			})
		}

		interactions.forEach(event => {
			document.addEventListener(event, handleInteraction, { once: true })
		})
	}

	loadVideo() {
		try {
			// Ensure video attributes are set
			this.video.muted = true
			this.video.playsInline = true
			this.video.loop = true

			// Start loading
			this.video.load()
		} catch (error) {
			console.error("Error loading video:", error)
			this.handleVideoError()
		}
	}

	onVideoReady() {
		// Notify loading manager
		if (window.LoadingManager) {
			window.LoadingManager.onVideoReady()
		}

		// Try immediate autoplay
		this.tryAutoplay()
	}

	async tryAutoplay() {
		if (!this.isVideoLoaded || this.isPlaying) return

		try {
			// Ensure video is muted for autoplay
			this.video.muted = true

			await this.video.play()
			console.log("✅ Autoplay successful")
		} catch (error) {
			console.warn("⚠️ Autoplay failed:", error.message)

			// If user has interacted, try unmuted play
			if (this.hasUserInteracted) {
				try {
					this.video.muted = false
					await this.video.play()
					console.log("✅ Manual play successful")
				} catch (retryError) {
					console.error("❌ Manual play also failed:", retryError)
					this.showPlayButton()
				}
			} else {
				this.showPlayButton()
			}
		}
	}

	showPlayButton() {
		// Remove existing play button if any
		const existingButton = document.getElementById("videoPlayButton")
		if (existingButton) {
			existingButton.remove()
		}

		const playButton = document.createElement("button")
		playButton.id = "videoPlayButton"
		playButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
            <span>Воспроизвести</span>
        `

		// Style the button
		Object.assign(playButton.style, {
			position: "absolute",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
			zIndex: "20",
			background: "rgba(255, 255, 255, 0.9)",
			color: "#000",
			border: "none",
			padding: "1rem 2rem",
			borderRadius: "50px",
			cursor: "pointer",
			display: "flex",
			alignItems: "center",
			gap: "0.5rem",
			fontSize: "1rem",
			fontFamily: "Inter, sans-serif",
			transition: "all 0.3s ease",
			backdropFilter: "blur(10px)",
			boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
		})

		// Button interactions
		playButton.addEventListener("mouseenter", () => {
			playButton.style.background = "#ffffff"
			playButton.style.transform = "translate(-50%, -50%) scale(1.05)"
		})

		playButton.addEventListener("mouseleave", () => {
			playButton.style.background = "rgba(255, 255, 255, 0.9)"
			playButton.style.transform = "translate(-50%, -50%) scale(1)"
		})

		playButton.addEventListener("click", async () => {
			try {
				this.hasUserInteracted = true
				await this.video.play()
				playButton.remove()
				console.log("✅ Video started manually")
			} catch (error) {
				console.error("❌ Manual play failed:", error)
			}
		})

		// Add to hero section
		const heroSection = document.querySelector(".hero")
		if (heroSection) {
			heroSection.appendChild(playButton)
		}
	}

	updateProgress() {
		if (!this.video || !this.progressFill) return

		const progress = (this.video.currentTime / this.video.duration) * 100
		this.progressFill.style.width = `${progress}%`
	}

	showProgressBar() {
		if (this.progressContainer) {
			this.progressContainer.classList.add("show")
		}
	}

	hideProgressBar() {
		if (this.progressContainer) {
			this.progressContainer.classList.remove("show")
		}
	}

	handleVideoError() {
		console.error("Video failed to load, using fallback")

		// Hide video and show fallback
		if (this.video) {
			this.video.style.display = "none"
		}

		// Notify loading manager
		if (window.LoadingManager) {
			window.LoadingManager.onVideoError()
		}
	}

	// Public methods
	play() {
		return this.video?.play()
	}

	pause() {
		this.video?.pause()
	}

	getCurrentTime() {
		return this.video?.currentTime || 0
	}

	getDuration() {
		return this.video?.duration || 0
	}

	isReady() {
		return this.isVideoLoaded
	}

	isVideoPlaying() {
		return this.isPlaying
	}

	// Debug method
	debug() {
		if (!this.video) {
			console.log("❌ Video element not found")
			return
		}

		console.log("=== VIDEO DEBUG INFO ===")
		console.log("Video src:", this.video.currentSrc || "No current src")
		console.log("Ready state:", this.video.readyState)
		console.log("Network state:", this.video.networkState)
		console.log("Error:", this.video.error)
		console.log("Duration:", this.video.duration)
		console.log("Current time:", this.video.currentTime)
		console.log("Paused:", this.video.paused)
		console.log("Muted:", this.video.muted)
		console.log("Has user interacted:", this.hasUserInteracted)
		console.log("Video loaded:", this.isVideoLoaded)
		console.log("Currently playing:", this.isPlaying)
		console.log("========================")
	}
}

// Initialize and expose globally
window.VideoManager = new VideoManager()
