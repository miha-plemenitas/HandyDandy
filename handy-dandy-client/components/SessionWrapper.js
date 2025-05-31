"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(() => console.log("✅ Service Worker registered"))
        .catch((err) => console.error("SW registration failed", err));
    }

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          console.log("🔔 Notifications enabled");
        }
      });
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
