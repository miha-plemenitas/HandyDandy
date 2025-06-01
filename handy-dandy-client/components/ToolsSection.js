"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ToolCard from "./ToolCard";
import AddToolModal from "./AddToolModal";

export default function ToolsSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [availableCategories, setAvailableCategories] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [tools, setTools] = useState([]);
    const { data: session } = useSession();
    const [editTool, setEditTool] = useState(null);


    // Posodobi useEffect, da vedno izračuna kategorije
    useEffect(() => {
        async function fetchTools() {
            const res = await fetch("/api/tools");
            if (!res.ok) {
                console.log("Napaka pri pridobivanju toolsev");
                return;
            }
            const data = await res.json();
            setTools(data);

            // IZRAČUNAJ KATEGORIJE NA NOVO
            const categories = Array.from(new Set(data.map((t) => t.category).filter(Boolean)));
            setAvailableCategories(categories);
        }
        fetchTools();
    }, []);

    // Po vsakem dodajanju/brišanju orodja, posodobi availableCategories
    useEffect(() => {
        const categories = Array.from(new Set(tools.map((t) => t.category).filter(Boolean)));
        setAvailableCategories(categories);
    }, [tools]);


    const handleNewToolAdded = (newTool) => {
        setTools(prev => [newTool, ...prev]);
        setShowAddForm(false);
        if (newTool.category && !availableCategories.includes(newTool.category)) {
            setAvailableCategories(prev => [...prev, newTool.category]);
        }
    };

    const handleEdit = (tool) => setEditTool(tool);

    const handleUpdateTool = (updated) => {
        setTools(prev =>
            prev.map(t => t._id === updated._id ? updated : t)
        );
        setEditTool(null);
    };

    const handleDelete = async (tool) => {
        if (confirm(`Res želiš izbrisati ${tool.name}?`)) {
            await fetch(`/api/tools?id=${tool._id}`, { method: "DELETE" });
            setTools(prev => prev.filter(t => t._id !== tool._id));
        }
    };

    // Filter logika
    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase())
            || (tool.category && tool.category.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !categoryFilter || tool.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <section className="p-6" id="tools">
            <h2 className="text-2xl font-bold mb-4">Tools</h2>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded w-full"
                    placeholder="Search by tool name or category"
                />

                <div className="flex gap-2">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-2 border rounded w-full"
                    >
                        <option value="">All</option>
                        {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    {/* Dodaj gumb za dodajanje samo če je uporabnik prijavljen */}
                    {session?.user && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Add new tool"
                        >
                            +
                        </button>
                    )}
                </div>
            </div>

            {/* Prikaz seznama toolsev */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredTools.length === 0 && (
                    <div className="col-span-full text-gray-400 p-8 text-center">
                        No tools found.
                    </div>
                )}
                {filteredTools.map(tool => (
                    <ToolCard
                        key={tool._id || tool.name}
                        tool={tool}
                        session={session}
                        onEdit={() => handleEdit(tool)}
                        onDelete={() => handleDelete(tool)}
                    />
                ))}
            </div>
            {showAddForm && (
                <AddToolModal
                    show={showAddForm}
                    onClose={() => setShowAddForm(false)}
                    onAdd={handleNewToolAdded}
                />
            )}
            {editTool && (
                <AddToolModal
                    show={!!editTool}
                    onClose={() => setEditTool(null)}
                    onAdd={handleUpdateTool}
                    editTool={editTool}
                />
            )}
        </section>
    );
}
