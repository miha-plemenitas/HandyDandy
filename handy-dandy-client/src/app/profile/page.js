"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/users`)
        .then((res) => res.json())
        .then((allUsers) => {
          const found = allUsers.find((u) => u.email === session.user.email);
          if (found) setUserData(found);
        });
    }
  }, [session]);

  if (!session) {
    return (
      <main className="px-6 py-8 text-white">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p>Please login to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-8 flex justify-center items-center min-h-[80vh] text-white">
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
    </main>
  );
}
