import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Save,
  X,
} from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Client Meeting Notes",
      content: "Discussed Q4 goals and new product launch strategies.",
      date: "2025-11-15",
      category: "Meeting",
    },
    {
      id: 2,
      title: "Follow-up Tasks",
      content: "Send proposal to ABC Corp, Schedule demo with XYZ Ltd.",
      date: "2025-11-16",
      category: "Tasks",
    },
    {
      id: 3,
      title: "Sales Strategy Ideas",
      content: "Consider implementing referral program and loyalty rewards.",
      date: "2025-11-17",
      category: "Ideas",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "General",
  });

  const categories = ["All", "Meeting", "Tasks", "Ideas", "General"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
        date: new Date().toISOString().split("T")[0],
      };
      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "", category: "General" });
      setIsAdding(false);
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleUpdateNote = (id, updatedNote) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note))
    );
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-0 ml-6 p-0">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-8xl mx-auto ml-4 px-0 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">All Notes</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">All Notes</span>
                </p>
              </div>

              {/* Right: Filter + Button */}
              <div className="flex items-center gap-4">
                {/* Filter Section */}
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-500 w-5 h-5" />
                  <div className="flex space-x-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-3 rounded-sm font-medium transition-all ${
                          selectedCategory === cat
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* New Note Button */}
                <button
                  onClick={() => setIsAdding(true)}
                  className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Note</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-0 mt-4 py-0">
          {/* Add Note Modal Popup */}
          {isAdding && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl mx-4 relative transform transition-all animate-slideUp">
                {/* Header with Gradient */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-sm p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Create New Note</h2>
                        <p className="text-sm text-white text-opacity-90 mt-1">
                          Add a new note to your collection
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-white hover:bg-orange-700 p-1 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                  {/* Title Input */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FileText size={16} className="text-[#FF7B1D]" />
                      Note Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={(e) =>
                        setNewNote({ ...newNote, title: e.target.value })
                      }
                      placeholder="e.g., Meeting Notes, Ideas, Tasks..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Filter size={16} className="text-[#FF7B1D]" />
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newNote.category}
                        onChange={(e) =>
                          setNewNote({ ...newNote, category: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 appearance-none cursor-pointer"
                      >
                        {categories
                          .filter((c) => c !== "All")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content Textarea */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Edit2 size={16} className="text-[#FF7B1D]" />
                      Note Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="6"
                      value={newNote.content}
                      onChange={(e) =>
                        setNewNote({ ...newNote, content: e.target.value })
                      }
                      placeholder="Write your note content here..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300 resize-none"
                    ></textarea>
                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>Be clear and detailed about your note</span>
                      <span>{newNote.content.length} characters</span>
                    </div>
                  </div>
                </div>

                {/* Footer with Actions */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-sm border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewNote({
                        title: "",
                        content: "",
                        category: "General",
                      });
                    }}
                    className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transform transition-all"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }

                @keyframes slideUp {
                  from {
                    transform: translateY(20px);
                    opacity: 0;
                  }
                  to {
                    transform: translateY(0);
                    opacity: 1;
                  }
                }

                .animate-fadeIn {
                  animation: fadeIn 0.2s ease-out;
                }

                .animate-slideUp {
                  animation: slideUp 0.3s ease-out;
                }
              `}</style>
            </div>
          )}
          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-sm shadow-sm hover:shadow-sm transition-all border-l-4 border-orange-500 overflow-hidden"
              >
                {editingId === note.id ? (
                  <div className="p-6">
                    <input
                      type="text"
                      defaultValue={note.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm mb-3 focus:ring-2 focus:ring-orange-500 outline-none"
                      onBlur={(e) =>
                        handleUpdateNote(note.id, { title: e.target.value })
                      }
                    />
                    <textarea
                      defaultValue={note.content}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm mb-3 focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                      onBlur={(e) =>
                        handleUpdateNote(note.id, { content: e.target.value })
                      }
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="w-full bg-orange-500 text-white px-4 py-2 rounded-sm font-semibold hover:bg-orange-600 transition-all"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-800 flex-1">
                          {note.title}
                        </h3>
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {note.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {note.content}
                      </p>
                      <p className="text-gray-400 text-xs mb-4">{note.date}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingId(note.id)}
                          className="flex-1 bg-orange-50 text-orange-600 px-4 py-2 rounded-sm font-medium hover:bg-orange-100 transition-all flex items-center justify-center space-x-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-sm font-medium hover:bg-red-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No notes found
              </h3>
              <p className="text-gray-400">
                Create your first note to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
