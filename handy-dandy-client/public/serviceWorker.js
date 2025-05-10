self.addEventListener("install", (event) => {
  console.log("🛠 Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activated.");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification("📢 Notification", {
    body: data.message,
    icon: "/favicon.ico",
  });
});
