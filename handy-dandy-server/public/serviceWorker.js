self.addEventListener("install", (event) => {
  console.log("✅ Service Worker Installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker Activated");
});

// ==================== Caching (Optional) ====================
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ==================== Push Notification ====================
self.addEventListener("push", (event) => {
  console.log("✅ Push event received");

  const data = event.data
    ? event.data.json()
    : { title: "No title", body: "No body" };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/images/tools-and-utensils_128.png",
      badge: "/images/tools-and-utensils_128.png",
    })
  );
});

// ==================== Notification Click ====================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
