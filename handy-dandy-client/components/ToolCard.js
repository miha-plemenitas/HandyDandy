"use client"

import { ExternalLink } from "lucide-react";

export default function ToolCard({ tool, session, onEdit, onDelete }) {
    const isOwner = tool.user && (session?.user?.id === (tool.user?._id || tool.user));

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow flex flex-col hover:shadow-lg transition relative overflow-hidden">
            {/* Hero slika na vrhu */}
            <div className="w-full h-55 relative">
                {/* Gumbi za urejanje/brisanje, kot “zvezdica” v vodiču */}
                {isOwner && (
                    <div className="absolute top-2 right-2 z-10 flex gap-2">
                        <button
                            className="bg-white rounded-full shadow p-1 hover:bg-blue-100 transition-colors"
                            onClick={e => { e.stopPropagation(); onEdit(tool); }}
                            title="Edit"
                        >
                            ✏️
                        </button>
                        <button
                            className="bg-white rounded-full shadow p-1 hover:bg-red-100 transition-colors"
                            onClick={e => { e.stopPropagation(); onDelete(tool); }}
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                )}

                {tool.image ? (
                    <>
                        <img
                            src={tool.image}
                            alt={tool.name}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-t-lg transition-opacity duration-300"
                            style={{ minHeight: "140px", maxHeight: "220px" }} // prilagodi po potrebi!
                        />
                    </>
                ) : (
                    <div className="w-full h-full min-h-[140px] max-h-[220px] flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-lg">
                        <span>No image</span>
                    </div>
                )}
            </div>

            {/* Ostala vsebina spodaj */}
            <div className="p-6 flex flex-col items-center">
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
            </div>
        </div>
    );
}
