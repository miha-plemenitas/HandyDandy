const CACHE_NAME = "handydandy-v1";
const OFFLINE_URLS = [
  "/",
  "/guides",
  "/tools",
  "/profile",
  "/manifest.json",
  "/images/tools-and-utensils_128.png",
  "/images/tools-and-utensils_256.png",
  "/images/tools-and-utensils_512.png",
  "/images/badge-icon-16.png",
  "/images/badge-icon-64.png",
  "/images/badge-icon-128.png",
  "/images/badge-icon.png",
];

// Pre-cache essential assets
self.addEventListener("install", (event) => {
  console.log("🛠 Service Worker installing.");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

// Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activated.");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Intercept fetch and apply caching logic
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Avoid caching API and Next.js internal routes
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    request.headers.get("accept")?.includes("application/json")
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).catch(() => {
          // For HTML requests, fallback to home page
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
        })
      );
    })
  );
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.title || "📢 HandyDandy", {
    body: data.message || "You have a new notification.",
    icon: data.icon || "/images/tools-and-utensils_128.png",
  });
});
