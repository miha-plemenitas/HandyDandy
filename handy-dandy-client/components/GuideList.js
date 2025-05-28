"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import GuideEdit from "./GuideEdit";
import GuideDetails from "./GuideDetails";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function GuideList({ showNotification, searchTerm, selectedCategory }) {
  const [favorites, setFavorites] = useState([]);
  const { data: session } = useSession();
  const [guides, setGuides] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  const [editingGuide, setEditingGuide] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    steps: [""],
    images: [""],
    videoUrl: "",
    category: "",
    tools: [""],
    author: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);

    useEffect(() => {
    if (session) {
      fetch('/api/users/favorites')
        .then(res => res.json())
        .then(data => setFavorites(data.favorites || []));
    } else {
      setFavorites([]); // Če ni login
    }
  }, [session]);

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/guides");
        setGuides(res.data);
        localStorage.setItem("cachedGuides", JSON.stringify(res.data));
      } catch (error) {
        console.error("Fetch error:", error);
        const cached = localStorage.getItem("cachedGuides");
        if (cached) {
          setGuides(JSON.parse(cached));
          showNotification?.("⚠️ Offline: showing cached guides", true);
        } else {
          showNotification?.("⚠️ Offline and no cached guides available", true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, [showNotification]);

  const handleEditClick = (guide) => {
    setEditingGuide(guide);
    setEditFormData({
      title: guide.title || "",
      description: guide.description || "",
      steps: guide.steps?.length ? [...guide.steps] : [""],
      images: guide.images?.length ? [...guide.images] : [""],
      videoUrl: guide.videoUrl || "",
      category: guide.category || "",
      tools: guide.tools?.length ? [...guide.tools] : [""],
      author: guide.author || ""
    });
  };

  const handleArrayChange = (field, index, value) => {
    setEditFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setEditFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (field, index) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const cleanedData = {
        ...editFormData,
        steps: editFormData.steps.filter(step => step.trim() !== ""),
        images: editFormData.images.filter(img => img.trim() !== ""),
        tools: editFormData.tools.filter(tool => tool.trim() !== "")
      };

      const res = await axios.put(`/api/guides?id=${editingGuide._id}`, cleanedData);
      setGuides(guides.map(guide =>
        guide._id === editingGuide._id ? res.data : guide
      ));
      setEditingGuide(null);
      showNotification?.("Guide updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      showNotification?.("Error updating guide", true);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // IMPORTANT: stop card onClick from firing

    if (!window.confirm("Are you sure you want to delete this guide?")) return;

    try {
      await axios.delete(`/api/guides?id=${id}`);
      setGuides(guides.filter(guide => guide._id !== id));
      showNotification?.("Guide deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      showNotification?.("Error deleting guide", true);
    }
  };

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const filteredGuides = guides.filter((guide) => {
    const title = guide.title?.toLowerCase() || "";
    const category = guide.category?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    const selectedCat = (selectedCategory || "").toLowerCase();

    const matchesSearch = title.includes(term) || category.includes(term);
    const matchesCategory = !selectedCategory || category === selectedCat;

    return matchesSearch && matchesCategory;
  });

  const getFirstImage = (guide) => guide.images?.[0] || null;

  const getPlaceholderImage = (guide) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-red-500"];
    const color = colors[guide.category?.length % colors.length] || "bg-gray-500";

    return (
      <div className={`${color} w-full h-32 rounded-t-lg flex items-center justify-center text-white text-4xl`}>
        {guide.category?.charAt(0).toUpperCase() || "G"}
      </div>
    );
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleToggleFavorite = async (guide) => {
    let newFavs;
    if (favorites.includes(guide._id)) {
      newFavs = favorites.filter(id => id !== guide._id);
    } else {
      newFavs = [...favorites, guide._id];
    }
    setFavorites(newFavs);

    try {
      await axios.patch('/api/users/favorites', {
        favorites: newFavs
      });
      // opcijsko: show success notification
    } catch (err) {
      // opcijsko: show error notification
      console.error("Napaka pri shranjevanju priljubljenih vodičev:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <div
            key={guide._id}
            onClick={() => setSelectedGuide(guide)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="w-full h-55 relative">
              {/* ZVEZDICA - ABSOLUTE GUMB */}
              <button
                className="absolute top-2 right-2 bg-white rounded-full shadow p-1 z-10 hover:bg-yellow-100 transition-colors cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  handleToggleFavorite(guide); // Toggle funkcija
                }}
                aria-label={favorites.includes(guide._id) ? "Odstrani iz priljubljenih" : "Dodaj med priljubljene"}
              >
                {favorites.includes(guide._id) ? (
                  <FaStar className="text-yellow-400" size={24} /> // Polna zvezdica
                ) : (
                  <FaRegStar className="text-yellow-400" size={24} /> // Prazna zvezdica
                )}
              </button>
              {getFirstImage(guide) ? (
                <>
                  {!loadedImages[guide._id] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={getFirstImage(guide)}
                    alt={guide.title}
                    loading="lazy"
                    onLoad={() => handleImageLoad(guide._id)}
                    className={`w-full h-full object-cover rounded-t-lg ${!loadedImages[guide._id] ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                  />
                </>
              ) : (
                getPlaceholderImage(guide)
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{guide.title}</h3>
                {session && (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditClick(guide); }}
                      className="text-gray-500 hover:text-blue-500 transition-colors"
                      aria-label="Edit guide"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDelete(guide._id, e)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      aria-label="Delete guide"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {guide.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {guide.category}
                  </span>
                )}

              </div>

              {guide.description && (
                <p className="text-gray-600 mt-3 text-sm line-clamp-2">
                  {guide.description}
                </p>
              )}

              <div className="mt-3 text-xs text-gray-500">
                <p>By {guide.author || "Unknown"} • {formatDate(guide.createdAt)}</p>
                {guide.steps?.length > 0 && (
                  <p>{guide.steps.length} step{guide.steps.length !== 1 ? 's' : ''}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingGuide && (
        <GuideEdit
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          onSave={handleSave}
          onCancel={() => setEditingGuide(null)}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          handleArrayChange={handleArrayChange}
        />
      )}

      {selectedGuide && (
        <GuideDetails
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}
    </>
  );
}
