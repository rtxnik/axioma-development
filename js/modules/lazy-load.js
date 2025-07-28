/**
 * Модуль ленивой загрузки
 */

import { CONFIG } from "../config.js"

export class LazyLoadManager {
	constructor() {
		this.images = document.querySelectorAll('img[loading="lazy"]')
		this.videos = document.querySelectorAll("video[data-lazy]")

		if ("IntersectionObserver" in window) {
			this.init()
		} else {
			// Fallback для старых браузеров
			this.loadAll()
		}
	}

	init() {
		const options = {
			root: null,
			rootMargin: "50px",
			threshold: CONFIG.performance.intersectionThreshold,
		}

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.loadElement(entry.target)
					this.observer.unobserve(entry.target)
				}
			})
		}, options)

		// Наблюдение за изображениями
		this.images.forEach(img => this.observer.observe(img))

		// Наблюдение за видео
		this.videos.forEach(video => this.observer.observe(video))
	}

	loadElement(element) {
		if (element.tagName === "IMG") {
			element.src = element.dataset.src || element.src
			element.removeAttribute("data-src")
		} else if (element.tagName === "VIDEO") {
			element.src = element.dataset.src
			element.load()
			element.removeAttribute("data-lazy")
		}
	}

	loadAll() {
		this.images.forEach(img => this.loadElement(img))
		this.videos.forEach(video => this.loadElement(video))
	}
}
