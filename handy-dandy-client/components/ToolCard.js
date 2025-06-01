"use client"

import { FiExternalLink, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function ToolCard({ tool, session, onEdit, onDelete }) {
    const isOwner = tool.user && (session?.user?.id === (tool.user?._id || tool.user));

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition relative">
            {tool.image && (
                <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-20 h-20 object-contain rounded mb-2 border"
                />
            )}
            <div className="text-2xl font-bold mb-2">{tool.name}</div>
            <div className="text-sm text-blue-700 font-medium mb-3">{tool.category || "Other"}</div>
            {tool.link ? (
                <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-900 underline mt-auto"
                >
                    Buy online <ExternalLink className="w-4 h-4 ml-1" />
                </a>
            ) : (
                <div className="text-gray-400 mt-auto">No link available</div>
            )}
            {isOwner && (
                <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => onEdit(tool)}>
                        ✏️
                    </button>
                    <button onClick={() => onDelete(tool)}>
                        🗑️
                    </button>
                </div>
            )}
        </div >
    );
}
