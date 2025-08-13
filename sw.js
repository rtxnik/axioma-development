/**
 * Service Worker для кэширования и оптимизации производительности
 */

const CACHE_VERSION = "v1.0.0"
const CACHE_NAME = `axioma-capital-${CACHE_VERSION}`

// Ресурсы для кэширования
const CACHE_URLS = [
	"/",
	"/css/main.css",
	"/js/main.js",
	"/js/config/config.js",
	"/js/core/App.js",
	"/js/modules/VideoManager.js",
	"/js/modules/NavigationManager.js",
	"/js/modules/FormManager.js",
	"/js/modules/LoadingManager.js",
	"/js/modules/LazyLoadManager.js",
	"/js/modules/ScrollAnimationManager.js",
	"/js/modules/LicenseModal.js",
	"/js/utils/utils.js",
	"/assets/hero-poster.jpg",
	"/assets/about-mobile.png",
	"/assets/about-desktop.jpg",
	"/assets/4logo.png",
]

// Стратегии кэширования
const CACHE_STRATEGIES = {
	// Сначала кэш, потом сеть (для статичных ресурсов)
	cacheFirst: [/\.css$/, /\.js$/, /\.woff2?$/, /\.ttf$/, /\.otf$/, /\.eot$/],
	// Сначала сеть, потом кэш (для динамического контента)
	networkFirst: [/\/api\//, /\.json$/],
	// Только сеть (для критически важных запросов)
	networkOnly: [/\/auth\//, /\/payment\//],
	// Только кэш (для офлайн-ресурсов)
	cacheOnly: [/offline\.html$/],
	// Сеть с кэшем как fallback
	staleWhileRevalidate: [
		/\.jpg$/,
		/\.jpeg$/,
		/\.png$/,
		/\.gif$/,
		/\.svg$/,
		/\.webp$/,
	],
}

// Установка Service Worker
self.addEventListener("install", event => {
	console.log("Service Worker installing...")

	// Пропускаем ожидание
	self.skipWaiting()

	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(cache => {
				console.log("Caching app shell...")
				return cache.addAll(CACHE_URLS)
			})
			.catch(error => {
				console.error("Failed to cache:", error)
			})
	)
})

// Активация Service Worker
self.addEventListener("activate", event => {
	console.log("Service Worker activating...")

	event.waitUntil(
		// Очистка старых кэшей
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames
						.filter(cacheName => {
							return (
								cacheName.startsWith("axioma-capital-") &&
								cacheName !== CACHE_NAME
							)
						})
						.map(cacheName => {
							console.log("Deleting old cache:", cacheName)
							return caches.delete(cacheName)
						})
				)
			})
			.then(() => {
				// Берем контроль над всеми клиентами
				return self.clients.claim()
			})
	)
})

// Обработка fetch запросов
self.addEventListener("fetch", event => {
	const { request } = event
	const url = new URL(request.url)

	// Пропускаем кросс-доменные запросы
	if (url.origin !== location.origin) {
		return
	}

	// Определяем стратегию кэширования
	const strategy = getStrategy(request)

	switch (strategy) {
		case "cacheFirst":
			event.respondWith(cacheFirst(request))
			break
		case "networkFirst":
			event.respondWith(networkFirst(request))
			break
		case "networkOnly":
			event.respondWith(fetch(request))
			break
		case "cacheOnly":
			event.respondWith(cacheOnly(request))
			break
		case "staleWhileRevalidate":
			event.respondWith(staleWhileRevalidate(request))
			break
		default:
			event.respondWith(networkFirst(request))
	}
})

/**
 * Определение стратегии кэширования
 */
function getStrategy(request) {
	const url = request.url

	for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
		for (const pattern of patterns) {
			if (pattern.test(url)) {
				return strategy
			}
		}
	}

	// По умолчанию используем networkFirst
	return "networkFirst"
}

/**
 * Стратегия: сначала кэш, потом сеть
 */
async function cacheFirst(request) {
	const cache = await caches.open(CACHE_NAME)
	const cached = await cache.match(request)

	if (cached) {
		return cached
	}

	try {
		const response = await fetch(request)

		// Кэшируем успешные ответы
		if (response.ok) {
			cache.put(request, response.clone())
		}

		return response
	} catch (error) {
		console.error("Fetch failed:", error)
		// Возвращаем офлайн страницу если есть
		return caches.match("/offline.html") || new Response("Offline")
	}
}

/**
 * Стратегия: сначала сеть, потом кэш
 */
async function networkFirst(request) {
	const cache = await caches.open(CACHE_NAME)

	try {
		const response = await fetch(request)

		// Кэшируем успешные ответы
		if (response.ok) {
			cache.put(request, response.clone())
		}

		return response
	} catch (error) {
		// Пробуем получить из кэша
		const cached = await cache.match(request)
		if (cached) {
			return cached
		}

		// Возвращаем офлайн страницу
		return caches.match("/offline.html") || new Response("Offline")
	}
}

/**
 * Стратегия: только кэш
 */
async function cacheOnly(request) {
	const cache = await caches.open(CACHE_NAME)
	const cached = await cache.match(request)

	return cached || new Response("Not found in cache", { status: 404 })
}

/**
 * Стратегия: stale-while-revalidate
 */
async function staleWhileRevalidate(request) {
	const cache = await caches.open(CACHE_NAME)
	const cached = await cache.match(request)

	// Запускаем обновление в фоне
	const fetchPromise = fetch(request).then(response => {
		if (response.ok) {
			cache.put(request, response.clone())
		}
		return response
	})

	// Возвращаем кэш если есть, иначе ждем сеть
	return cached || fetchPromise
}

/**
 * Обработка push уведомлений (если понадобится)
 */
self.addEventListener("push", event => {
	const options = {
		body: event.data ? event.data.text() : "Новое уведомление",
		icon: "/icon-192.png",
		badge: "/badge-72.png",
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1,
		},
	}

	event.waitUntil(
		self.registration.showNotification("Аксиома Капитал", options)
	)
})

/**
 * Обработка клика по уведомлению
 */
self.addEventListener("notificationclick", event => {
	event.notification.close()

	event.waitUntil(clients.openWindow("/"))
})

/**
 * Периодическая синхронизация (background sync)
 */
self.addEventListener("sync", event => {
	if (event.tag === "update-cache") {
		event.waitUntil(updateCache())
	}
})

/**
 * Обновление кэша
 */
async function updateCache() {
	const cache = await caches.open(CACHE_NAME)

	// Обновляем критичные ресурсы
	const criticalResources = ["/", "/css/main.css", "/js/main.js"]

	const promises = criticalResources.map(async resource => {
		try {
			const response = await fetch(resource)
			if (response.ok) {
				await cache.put(resource, response)
			}
		} catch (error) {
			console.error(`Failed to update ${resource}:`, error)
		}
	})

	return Promise.all(promises)
}

/**
 * Обработка сообщений от клиента
 */
self.addEventListener("message", event => {
	if (event.data.action === "skipWaiting") {
		self.skipWaiting()
	}

	if (event.data.action === "clearCache") {
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cacheName => caches.delete(cacheName))
				)
			})
			.then(() => {
				event.ports[0].postMessage({ cleared: true })
			})
	}

	if (event.data.action === "getCacheSize") {
		getCacheSize().then(size => {
			event.ports[0].postMessage({ size })
		})
	}
})

/**
 * Получение размера кэша
 */
async function getCacheSize() {
	const cacheNames = await caches.keys()
	let totalSize = 0

	for (const cacheName of cacheNames) {
		const cache = await caches.open(cacheName)
		const requests = await cache.keys()

		for (const request of requests) {
			const response = await cache.match(request)
			if (response) {
				const blob = await response.blob()
				totalSize += blob.size
			}
		}
	}

	return totalSize
}
