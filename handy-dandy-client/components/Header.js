"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div className="mb-4">
      <div className="mb-2">
        {loading ? (
          <span>⏳ Checking login...</span>
        ) : session?.user ? (
          <span>
            ✅ Logged in as <strong>{session.user.name}</strong>
          </span>
        ) : (
          <span>⚠️ Not logged in</span>
        )}
      </div>

      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
      ) : (
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}
    </div>
  );
}
