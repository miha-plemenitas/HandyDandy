"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [favoriteGuides, setFavoriteGuides] = useState([]);
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (session) {
      fetch("/api/users/favorites")
        .then(res => res.json())
        .then(async data => {
          const ids = data.favorites || [];
          // Fetch all guides or fetch by IDs
          const allGuides = await fetch("/api/guides").then(res => res.json());
          const favGuides = allGuides.filter(g => ids.includes(g._id));
          setFavoriteGuides(favGuides);
        });
    }
  }, [session]);



  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/users`)
        .then((res) => res.json())
        .then((allUsers) => {
          const found = allUsers.find((u) => u.email === session.user.email);
          if (found) setUserData(found);
        });

      fetch(`/api/badges?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setBadges(data.badges || []));
    }
  }, [session]);

  const simulateBadgeEarn = async () => {
    const repairId = prompt("Enter repair ID to simulate badge:");
    const res = await fetch("/api/badges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, repairId }),
    });
    if (res.ok) {
      const { badge } = await res.json();
      alert(`Badge earned: ${badge.title}`);
      setBadges((prev) => [badge, ...prev]);
    }
  };

  if (!session) {
    return (
      <main className="px-6 py-8 text-white">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p>Please login to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-8 flex justify-center items-start gap-6 min-h-[80vh] text-white">
      {/* User Card */}
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <p className="text-zinc-400 mb-6">Welcome to your dashboard</p>
        </div>

        {userData ? (
          <div className="space-y-4 text-lg">
            <div>
              <span className="font-semibold text-zinc-300">👨‍💼 Name:</span>{" "}
              <span>{userData.username}</span>
            </div>
            <div>
              <span className="font-semibold text-zinc-300">📧 Email:</span>{" "}
              <span>{userData.email}</span>
            </div>
            <div>
              <span className="font-semibold text-zinc-300">📅 Created:</span>{" "}
              <span>{new Date(userData.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>

      {/* Badge Card */}
      <div className="bg-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">🏅 Badges</h2>
        {badges.length > 0 ? (
          <ul className="space-y-3">
            {badges.map((badge, i) => (
              <li
                key={i}
                className="bg-zinc-700 p-3 rounded-lg flex items-center gap-4"
              >
                {/* Static badge icon */}
                <img
                  src="/images/badge-icon.png"
                  alt="Badge Icon"
                  className="w-8 h-8"
                />
                <div>
                  <div className="font-semibold text-zinc-100">
                    {badge.title}
                  </div>
                  <div className="text-zinc-400 text-sm">
                    Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-zinc-400">No badges yet.</p>
        )}
        <button
          onClick={simulateBadgeEarn}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
        >
          🎖 Simulate Earning Badge
        </button>
      </div>

      <div className="bg-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">⭐ Priljubljeni vodiči</h2>
        {favoriteGuides.length > 0 ? (
          <ul className="space-y-3">
            {favoriteGuides.map(guide => (
              <li key={guide._id} className="bg-zinc-700 p-3 rounded-lg flex items-center gap-4">
                <img
                  src={guide.images?.[0] || "/images/placeholder.png"}
                  alt="Guide"
                  className="w-8 h-8 object-cover rounded"
                />
                <div>
                  <div className="font-semibold text-zinc-100">{guide.title}</div>
                  <div className="text-zinc-400 text-sm">{guide.category}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-zinc-400">Nimaš še shranjenih vodičev.</p>
        )}
      </div>
    </main>
  );
}
