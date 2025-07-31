/**
 * Модуль управления видео
 */
export class VideoManager {
	constructor(loadingManager) {
		this.loadingManager = loadingManager
		this.video = document.getElementById("heroVideo")
		this.progressContainer = document.getElementById("videoProgress")
		this.progressFill = document.getElementById("videoProgressFill")
		this.scrollIndicator = document.getElementById("scrollIndicator")

		if (this.video) {
			this.init()
		}
	}

	init() {
		this.setupVideoEvents()
		this.loadVideo()
	}

	setupVideoEvents() {
		this.video.addEventListener("canplay", () => {
			this.loadingManager.setVideoReady()
			this.tryAutoplay()
		})

		this.video.addEventListener("play", () => {
			this.showProgress()
			this.showScrollIndicator()
		})

		this.video.addEventListener("timeupdate", () => {
			this.updateProgress()
		})

		this.video.addEventListener("error", () => {
			console.error("Video error:", this.video.error)
			this.loadingManager.setVideoReady() // Продолжить без видео
		})
	}

	loadVideo() {
		this.video.muted = true
		this.video.playsInline = true
		this.video.load()
	}

	async tryAutoplay() {
		try {
			await this.video.play()
		} catch (error) {
			console.warn("Autoplay failed:", error)
			this.showPlayButton()
		}
	}

	showPlayButton() {
		const playButton = document.createElement("button")
		playButton.className = "hero__play-button"
		playButton.innerHTML = `
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
			</svg>
			<span>Воспроизвести</span>
		`

		playButton.addEventListener("click", async () => {
			try {
				await this.video.play()
				playButton.remove()
			} catch (error) {
				console.error("Manual play failed:", error)
			}
		})

		this.video.parentElement.appendChild(playButton)
	}

	updateProgress() {
		if (this.progressFill && this.video.duration) {
			const progress = (this.video.currentTime / this.video.duration) * 100
			this.progressFill.style.width = `${progress}%`
		}
	}

	showProgress() {
		if (this.progressContainer) {
			this.progressContainer.classList.add("hero__progress--visible")
		}
	}

	showScrollIndicator() {
		setTimeout(() => {
			if (this.scrollIndicator) {
				this.scrollIndicator.classList.add("hero__scroll-indicator--visible")
			}
		}, 500)
	}
}
