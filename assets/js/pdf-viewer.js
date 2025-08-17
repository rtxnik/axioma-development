document.addEventListener("DOMContentLoaded", function () {
	const pdfjsLib = window["pdfjs-dist/build/pdf"]

	const pdfPath = "/assets/docs/presentation/Аксиома Капитал презентация.pdf"

	pdfjsLib.GlobalWorkerOptions.workerSrc = "/assets/js/libs/pdf.worker.min.js"

	const pdfCanvas = document.getElementById("pdf-canvas")
	const ctx = pdfCanvas.getContext("2d")
	const loadingElement = document.getElementById("pdf-loading")
	const errorElement = document.getElementById("pdf-error")
	const currentPageElement = document.getElementById("current-page")
	const totalPagesElement = document.getElementById("total-pages")
	const prevPageBtn = document.getElementById("prev-page-btn")
	const nextPageBtn = document.getElementById("next-page-btn")
	const fullscreenBtn = document.getElementById("fullscreen-btn")
	const fullscreenIcon = document.getElementById("fullscreen-icon")
	const minimizeIcon = document.getElementById("minimize-icon")
	const downloadBtn = document.getElementById("download-btn")
	const errorDownloadBtn = document.getElementById("error-download-btn")
	const pageNumbersContainer = document.getElementById("page-numbers")
	const pageNumbersVerticalContainer = document.getElementById(
		"page-numbers-vertical"
	)

	let pdfDoc = null
	let currentPage = 1
	let totalPages = 0
	let isFullscreen = false
	let pdfScale = 1.0

	function calculateOptimalScale(page) {
		const viewport = page.getViewport({ scale: 1.0 })
		const containerWidth = pdfCanvas.parentElement.clientWidth - 40
		const containerHeight = pdfCanvas.parentElement.clientHeight - 40

		const widthScale = containerWidth / viewport.width
		const heightScale = containerHeight / viewport.height

		return Math.min(widthScale, heightScale) * 0.95
	}

	async function loadPDF() {
		try {
			loadingElement.classList.remove("hidden")
			errorElement.classList.add("hidden")
			pdfCanvas.classList.add("hidden")

			const loadingTask = pdfjsLib.getDocument(pdfPath)
			pdfDoc = await loadingTask.promise

			totalPages = pdfDoc.numPages
			totalPagesElement.textContent = totalPages

			prevPageBtn.disabled = false
			nextPageBtn.disabled = false

			const firstPage = await pdfDoc.getPage(1)
			pdfScale = calculateOptimalScale(firstPage)

			renderPageNumbers()

			await renderPage(1)

			loadingElement.classList.add("hidden")
			pdfCanvas.classList.remove("hidden")
		} catch (error) {
			console.error("Error loading PDF:", error)
			loadingElement.classList.add("hidden")
			errorElement.classList.remove("hidden")
		}
	}

	async function renderPage(pageNumber) {
		if (pageNumber < 1 || pageNumber > totalPages) return

		updateNavigationButtons(pageNumber)

		currentPage = pageNumber
		currentPageElement.textContent = currentPage

		renderPageNumbers()

		if (isFullscreen) {
			updateVerticalActivePageNumber(pageNumber)
		}

		try {
			const page = await pdfDoc.getPage(pageNumber)
			const viewport = page.getViewport({ scale: pdfScale })

			pdfCanvas.width = viewport.width
			pdfCanvas.height = viewport.height

			await page.render({
				canvasContext: ctx,
				viewport: viewport,
			}).promise

			updateActivePageNumber(pageNumber)
		} catch (error) {
			console.error("Error rendering page:", error)
		}
	}

	function renderPageNumbers() {
		pageNumbersContainer.innerHTML = ""

		let pagesToShow = []

		pagesToShow.push(1)

		if (currentPage > 3) {
			pagesToShow.push("...")
		}

		let startPage = Math.max(2, currentPage - 1)
		let endPage = Math.min(totalPages - 1, currentPage + 1)

		if (currentPage <= 3) {
			endPage = Math.min(4, totalPages - 1)
			for (let i = 2; i <= endPage; i++) {
				pagesToShow.push(i)
			}
		} else if (currentPage >= totalPages - 2) {
			startPage = Math.max(totalPages - 3, 2)
			for (let i = startPage; i <= totalPages - 1; i++) {
				pagesToShow.push(i)
			}
		} else {
			for (let i = startPage; i <= endPage; i++) {
				pagesToShow.push(i)
			}
		}

		if (endPage < totalPages - 1) {
			pagesToShow.push("...")
		}

		if (totalPages > 1) {
			pagesToShow.push(totalPages)
		}

		pagesToShow.forEach(page => {
			if (page === "...") {
				const ellipsis = document.createElement("span")
				ellipsis.textContent = "..."
				ellipsis.className = "pdf-viewer-ellipsis"
				pageNumbersContainer.appendChild(ellipsis)
			} else {
				createPageButton(page)
			}
		})
	}

	function renderVerticalPageNumbers() {
		if (!pageNumbersVerticalContainer) return

		pageNumbersVerticalContainer.innerHTML = ""

		for (let i = 1; i <= totalPages; i++) {
			createVerticalPageButton(i)
		}
	}

	function createPageButton(pageNumber) {
		const button = document.createElement("button")
		button.textContent = pageNumber
		button.addEventListener("click", () => renderPage(pageNumber))

		if (pageNumber === currentPage) {
			button.classList.add("active")
		}

		pageNumbersContainer.appendChild(button)
	}

	function createVerticalPageButton(pageNumber) {
		const button = document.createElement("button")
		button.textContent = pageNumber
		button.addEventListener("click", () => renderPage(pageNumber))

		if (pageNumber === currentPage) {
			button.classList.add("active")
		}

		pageNumbersVerticalContainer.appendChild(button)
	}

	function updateActivePageNumber(pageNumber) {
		const pageButtons = pageNumbersContainer.querySelectorAll("button")
		pageButtons.forEach(button => {
			if (parseInt(button.textContent) === pageNumber) {
				button.classList.add("active")
			} else {
				button.classList.remove("active")
			}
		})
	}

	function updateVerticalActivePageNumber(pageNumber) {
		if (!pageNumbersVerticalContainer) return

		const pageButtons = pageNumbersVerticalContainer.querySelectorAll("button")
		pageButtons.forEach(button => {
			if (parseInt(button.textContent) === pageNumber) {
				button.classList.add("active")
				button.scrollIntoView({ behavior: "smooth", block: "nearest" })
			} else {
				button.classList.remove("active")
			}
		})
	}

	function updateNavigationButtons(pageNumber) {
		prevPageBtn.disabled = pageNumber <= 1
		nextPageBtn.disabled = pageNumber >= totalPages
	}

	function toggleFullscreen() {
		isFullscreen = !isFullscreen
		document.body.classList.toggle("fullscreen", isFullscreen)

		fullscreenIcon.classList.toggle("hidden", isFullscreen)
		minimizeIcon.classList.toggle("hidden", !isFullscreen)

		if (isFullscreen) {
			renderVerticalPageNumbers()
		}

		setTimeout(() => {
			if (pdfDoc) {
				pdfDoc.getPage(currentPage).then(page => {
					pdfScale = calculateOptimalScale(page)
					renderPage(currentPage)
				})
			}
		}, 300)
	}

	prevPageBtn.addEventListener("click", () => {
		if (currentPage > 1) {
			renderPage(currentPage - 1)
		}
	})

	nextPageBtn.addEventListener("click", () => {
		if (currentPage < totalPages) {
			renderPage(currentPage + 1)
		}
	})

	fullscreenBtn.addEventListener("click", toggleFullscreen)

	downloadBtn.addEventListener("click", () => {
		window.open(pdfPath, "_blank")
	})

	errorDownloadBtn.addEventListener("click", () => {
		window.open(pdfPath, "_blank")
	})

	document.addEventListener("keydown", e => {
		if (e.key === "ArrowLeft" && !prevPageBtn.disabled) {
			renderPage(currentPage - 1)
		} else if (e.key === "ArrowRight" && !nextPageBtn.disabled) {
			renderPage(currentPage + 1)
		} else if (e.key === "Escape" && isFullscreen) {
			toggleFullscreen()
		}
	})

	window.addEventListener("resize", () => {
		if (pdfDoc) {
			pdfDoc.getPage(currentPage).then(page => {
				pdfScale = calculateOptimalScale(page)
				renderPage(currentPage)
			})
		}
	})

	loadPDF()
})
