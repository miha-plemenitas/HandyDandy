"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import UserForm from "@/components/UserForm";
import UserList from "@/components/UserList";
import VoiceControl from "@/components/VoiceControl";
import NotificationBanner from "@/components/NotificationBanner";
import LazyImageGallery from "@/components/LazyImageGallery";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [notification, setNotification] = useState({
    message: "",
    isError: false,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const showNotification = useCallback((message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification({ message: "", isError: false }), 4000);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then((reg) => {
          console.log("✅ SW registered:", reg.scope);
          subscribeToPushNotifications();
        })
        .catch((err) => console.error("❌ SW registration failed:", err));
    }
  }, []);

  const subscribeToPushNotifications = async () => {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      console.warn("VAPID public key is not defined");
      return;
    }

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });

    console.log("✅ Push subscription complete");
  };

  const urlBase64ToUint8Array = (base64String) => {
    if (!base64String) throw new Error("VAPID public key is missing");
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    return Uint8Array.from([...atob(base64)].map((c) => c.charCodeAt(0)));
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Header />
        <NotificationBanner
          message={notification.message}
          isError={notification.isError}
        />
        <VoiceControl
          onCommand={(cmd) => {
            const normalized = cmd.toLowerCase();
            if (normalized.includes("show users")) {
              showNotification("🟢 Showing users");
            } else if (normalized.includes("login")) {
              document.getElementById("login-btn")?.click();
            } else if (normalized.includes("log out")) {
              document.getElementById("logout-btn")?.click();
            } else if (normalized.startsWith("search")) {
              const keyword = normalized.replace("search", "").trim();
              setSearchTerm(keyword);
              showNotification(`🔍 Searching for ${keyword}`);
            } else {
              showNotification("⚠️ Unknown command", true);
            }
          }}
        />

        <div className="mb-6">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search users..."
            className="w-full"
          />
        </div>

        <UserList
          onEdit={setEditingUser}
          showNotification={showNotification}
          searchTerm={searchTerm}
        />

        <h2 className="text-xl font-semibold mt-10 mb-4">Add / Edit User</h2>
        <UserForm
          userToEdit={editingUser}
          clearEdit={() => setEditingUser(null)}
          showNotification={showNotification}
        />

        <LazyImageGallery />
      </main>
    </>
  );
}
