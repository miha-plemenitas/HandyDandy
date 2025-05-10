"use client";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function UserForm({ userToEdit, clearEdit, showNotification }) {
  const { data: session } = useSession();
  const [username, setUsername] = useState(userToEdit?.username || "");
  const [email, setEmail] = useState(userToEdit?.email || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return showNotification("Please login first", true);

    const payload = userToEdit
      ? { id: userToEdit._id, username, email }
      : { username, email };
    const method = userToEdit ? "put" : "post";

    try {
      const res = await axios({
        method,
        url: `/api/users`,
        data: payload,
      });
      showNotification(res.data.message);
      setUsername("");
      setEmail("");
      clearEdit();
    } catch {
      showNotification("Error saving user", true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 border rounded mb-6">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded mr-2 mb-2"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded mr-2 mb-2"
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </form>
  );
}
