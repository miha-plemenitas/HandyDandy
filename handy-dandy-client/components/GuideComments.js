// GuideComments.jsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function GuideComments({ guideId }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (guideId) {
            fetch(`/api/comments?guideId=${guideId}`)
                .then(res => res.json())
                .then(data => setComments(data.comments || []));
        }

    }, [guideId]);


    const handleAdd = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        const res = await fetch("/api/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guideId, content: text }), // ime polja je content!
        });
        setLoading(false);
        if (res.ok) {
            const { comment } = await res.json();
            setComments(prev => [...prev, comment]);
            setText("");
        }
    };

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Comments ({comments.length})</h3>
                <button
                    className="text-sm text-gray-600 hover:underline px-2 py-0.5 transition-colors"
                    style={{ background: "none", border: "none" }}
                    onClick={() => setOpen(o => !o)}
                    type="button"
                >
                    {open ? "Hide" : "Show"}
                </button>
            </div>
            {open && (
                <>
                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map(c => (
                                <div key={c._id} className="relative bg-gray-50 p-4 rounded-lg shadow text-lg text-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-gray-700 text-base">
                                            {c.authorName || "Unknown"}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(c.createdAt).toLocaleString()}

                                        </span>

                                    </div>
                                    <div className="text-gray-700 text-base mt-1">{c.content}

                                    </div>
                                    {/* Gumb za izbris */}
                                    {String(session?.user?.id) === String(c.userId) && (
                                        <button
                                            className="absolute bottom-2 right-2 text-red-400 hover:text-red-600 transition-colors p-1"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to delete this comment?")) {
                                                    await fetch(`/api/comments?id=${c._id}`, { method: "DELETE" });
                                                    setComments(prev => prev.filter(x => x._id !== c._id));
                                                }
                                            }}
                                            title="Delete comment"
                                            type="button"
                                        >
                                            🗑️
                                        </button>
                                    )}

                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-base">No comments yet.</p>
                        )}
                    </div>

                    {session ? (
                        <form onSubmit={handleAdd} className="mt-8 flex gap-2">
                            <input
                                type="text"
                                placeholder="Add a comment…"
                                value={text}
                                onChange={e => setText(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded text-lg"
                                disabled={loading}
                                maxLength={300}
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 text-lg font-medium"
                                disabled={loading || !text.trim()}
                            >
                                Post
                            </button>
                        </form>
                    ) : (
                        <p className="mt-4 text-gray-500 text-base">
                            Log in to add a comment.
                        </p>
                    )}
                </>
            )}
        </section>
    );
}
