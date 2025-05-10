"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function UserList({ onEdit, showNotification, searchTerm }) {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let didCancel = false;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users");
        if (!didCancel) {
          setUsers(res.data);
          localStorage.setItem("cachedUsers", JSON.stringify(res.data));
        }
      } catch {
        const cached = localStorage.getItem("cachedUsers");
        if (cached) {
          setUsers(JSON.parse(cached));
          showNotification?.("⚠️ Offline: showing cached data", true);
        } else {
          showNotification?.("⚠️ Offline and no cached data available", true);
        }
      }
    };

    fetchUsers();
    return () => {
      didCancel = true;
    };
  }, []); // ✅ Empty dependency to avoid infinite loop

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await axios.delete(`/api/users?id=${id}`);
      showNotification?.(res.data.message);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      showNotification?.("Error deleting user", true);
    }
  };

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ul className="space-y-2">
      {filtered.map((user) => (
        <li
          key={user._id}
          className="bg-white p-3 border rounded-md flex justify-between items-center"
        >
          <div>
            <strong>{user.username}</strong> ({user.email})
            {session?.user?._id === user._id && (
              <span className="ml-2 text-green-600">(You)</span>
            )}
          </div>
          {session?.user?._id !== user._id && (
            <div>
              <button onClick={() => onEdit(user)} className="mr-2">
                ✏️
              </button>
              <button onClick={() => deleteUser(user._id)}>🗑️</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
