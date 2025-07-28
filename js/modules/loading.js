/**
 * Модуль управления загрузкой
 */

import { CONFIG } from "../config.js"

export class LoadingManager {
	constructor() {
		this.loadingScreen = document.getElementById("loadingScreen")
		this.states = {
			video: false,
			content: false,
			images: false,
		}
		this.startTime = Date.now()
		this.init()
	}

	init() {
		// Минимальное время загрузки
		setTimeout(() => {
			this.states.content = true
			this.checkComplete()
		}, CONFIG.video.minLoadingTime)

		// Проверка загрузки изображений
		this.checkImages()
	}

	checkImages() {
		const images = document.querySelectorAll('img[loading="eager"]')
		let loadedCount = 0

		if (images.length === 0) {
			this.states.images = true
			this.checkComplete()
			return
		}

		images.forEach(img => {
			if (img.complete) {
				loadedCount++
			} else {
				img.addEventListener("load", () => {
					loadedCount++
					if (loadedCount === images.length) {
						this.states.images = true
						this.checkComplete()
					}
				})
			}
		})

		if (loadedCount === images.length) {
			this.states.images = true
			this.checkComplete()
		}
	}

	setVideoReady() {
		this.states.video = true
		this.checkComplete()
	}

	checkComplete() {
		const allReady = Object.values(this.states).every(state => state)

		if (allReady) {
			const elapsed = Date.now() - this.startTime
			const remaining = Math.max(0, CONFIG.video.minLoadingTime - elapsed)

			setTimeout(() => this.hide(), remaining)
		}
	}

	hide() {
		if (this.loadingScreen) {
			this.loadingScreen.classList.add("loading--hidden")

			setTimeout(() => {
				this.loadingScreen.style.display = "none"
				document.body.classList.add("loaded")
			}, 800)
		}
	}
}
