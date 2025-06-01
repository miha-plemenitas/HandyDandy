"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import GuideDetails from "@/components/GuideDetails";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import { User, BadgeCheck, Star } from "lucide-react"; // ✅ FIXED HERE

export default function ProfilePage() {
  const [favoriteGuides, setFavoriteGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    if (session) {
      fetch("/api/users/favorites")
        .then((res) => res.json())
        .then(async (data) => {
          const ids = data.favorites || [];
          const allGuides = await fetch("/api/guides").then((res) =>
            res.json()
          );
          const favGuides = allGuides.filter((g) => ids.includes(g._id));
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

  const handleRemoveFavorite = async (guide) => {
    const ids = favoriteGuides.map((g) => g._id);
    const newIds = ids.filter((id) => id !== guide._id);
    setFavoriteGuides(favoriteGuides.filter((g) => g._id !== guide._id));

    try {
      await axios.patch("/api/users/favorites", { favorites: newIds });
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  if (!session) {
    return (
      <main className="px-6 py-8 text-gray-800">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p>Please login to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900">
      {/* Page header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center items-center gap-3 mb-3">
          <User className="w-8 h-8 text-yellow-600" />
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Profile
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View your user information, earned badges and saved guides.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info */}
        <motion.div
          className="bg-white shadow-md border border-gray-200 rounded-xl p-6 h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="text-blue-500 w-6 h-6" />
            User Info
          </h2>
          {userData ? (
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="font-medium">Name:</span> {userData.username}
              </div>
              <div>
                <span className="font-medium">Email:</span> {userData.email}
              </div>
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(userData.createdAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </motion.div>

        {/* Badges */}
        <motion.div
          className="bg-white shadow-md border border-gray-200 rounded-xl p-6 h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BadgeCheck className="text-green-500 w-6 h-6" />
            Badges
          </h2>
          {badges.length > 0 ? (
            <ul className="space-y-3 text-sm">
              {badges.map((badge, i) => (
                <li
                  key={i}
                  className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 flex items-center gap-3"
                >
                  <img
                    src={badge.iconUrl || "/images/badge-icon.png"}
                    alt="Badge"
                    className="w-7 h-7"
                  />
                  <div>
                    <div className="font-medium text-gray-800">
                      {badge.title}
                    </div>
                    <div className="text-gray-500 text-xs">
                      Earned: {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No badges yet.</p>
          )}
        </motion.div>

        {/* Favorites */}
        <motion.div
          className="bg-white shadow-md border border-gray-200 rounded-xl p-6 h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="text-yellow-500 w-6 h-6" />
            Favorite Guides
          </h2>
          {favoriteGuides.length > 0 ? (
            <ul className="space-y-3">
              {favoriteGuides.map((guide) => (
                <li
                  key={guide._id}
                  className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 flex items-center justify-between hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setSelectedGuide(guide)}
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {guide.title}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {guide.category}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(guide);
                    }}
                    title="Remove"
                    className="text-yellow-500 hover:text-gray-400"
                  >
                    <FaStar />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              You don’t have any saved guides yet.
            </p>
          )}
          {selectedGuide && (
            <GuideDetails
              guide={selectedGuide}
              onClose={() => setSelectedGuide(null)}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
}
