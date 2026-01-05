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
  X,
  Calendar,
  Tag,
  Clock,
  Layout,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import NumberCard from "../../components/NumberCard";
import Modal from "../../components/common/Modal";

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

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const dropdownRef = React.useRef(null);

  const categories = ["All", "Meeting", "Tasks", "Ideas", "General"];

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

  const handleUpdateNote = (id, updatedNote) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note))
    );
    setEditingId(null);
    toast.success("Note updated successfully");
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    setShowDeleteModal(false);
    toast.success("Note deleted successfully");
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div className="ml-6 min-h-screen bg-gray-50/50">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-400 text-sm" />
                  Additional / <span className="text-[#FF7B1D] font-medium">Notes</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-3 rounded-sm border transition-all shadow-sm ${isFilterOpen || selectedCategory !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={20} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="p-2 border-b bg-gray-50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter by Category</p>
                      </div>
                      <div className="py-1">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedCategory === cat
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] text-sm w-64 transition-all"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <button
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-3 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 font-bold shadow-md hover:shadow-lg"
                >
                  <Plus size={20} />
                  New Note
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-6 py-6 font-primary">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <NumberCard
              title="Total Notes"
              number={notes.length}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Meeting Notes"
              number={notes.filter(n => n.category === "Meeting").length}
              icon={<Calendar className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Tasks"
              number={notes.filter(n => n.category === "Tasks").length}
              icon={<CheckCircle className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Ideas"
              number={notes.filter(n => n.category === "Ideas").length}
              icon={<Tag className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
          </div>

          <div className="max-w-8xl mx-auto px-0 mt-4 py-0 relative">
            {/* Add Note Modal Popup */}
            {isAdding && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-center items-center z-50 animate-fadeIn">
                <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl mx-4 overflow-hidden transform transition-all animate-slideUp">
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
                        onClick={() => setIsAdding(false)}
                        className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                      >
                        <X size={20} />
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
                  className="group bg-white rounded-sm shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-orange-200 overflow-hidden relative flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  {editingId === note.id ? (
                    <div className="p-6 bg-orange-50/30">
                      <div className="mb-4">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Title</label>
                        <input
                          type="text"
                          defaultValue={note.title}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-sm focus:border-orange-500 outline-none bg-white transition-all text-sm font-semibold"
                          onBlur={(e) =>
                            handleUpdateNote(note.id, { title: e.target.value })
                          }
                          autoFocus
                        />
                      </div>
                      <div className="mb-4">
                        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 block">Content</label>
                        <textarea
                          defaultValue={note.content}
                          rows="4"
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-sm focus:border-orange-500 outline-none bg-white transition-all text-sm resize-none"
                          onBlur={(e) =>
                            handleUpdateNote(note.id, { content: e.target.value })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-bold shadow-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 border-2 border-gray-200 text-gray-500 rounded-sm hover:bg-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-sm ${note.category === 'Meeting' ? 'bg-blue-100 text-blue-600' :
                              note.category === 'Tasks' ? 'bg-green-100 text-green-600' :
                                note.category === 'Ideas' ? 'bg-purple-100 text-purple-600' :
                                  'bg-gray-100 text-gray-600'
                              }`}>
                              <Tag size={14} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${note.category === 'Meeting' ? 'text-blue-600' :
                              note.category === 'Tasks' ? 'text-green-600' :
                                note.category === 'Ideas' ? 'text-purple-600' :
                                  'text-gray-600'
                              }`}>
                              {note.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock size={12} />
                            <span className="text-[11px] font-medium">{note.date}</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                          "{note.content}"
                        </p>
                      </div>

                      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingId(note.id)}
                            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            setNoteToDelete(note);
                            setShowDeleteModal(true);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mt-6">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-primary">
                  No notes found
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm font-primary">
                  {searchTerm || selectedCategory !== "All"
                    ? "We couldn't find any notes matching your search or category filter. Try refining your criteria."
                    : "Your note collection is currently empty. Start capturing your thoughts and tasks today!"}
                </p>
                {(searchTerm || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="mt-6 px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              headerVariant="simple"
              maxWidth="max-w-md"
              footer={
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteNote(noteToDelete.id)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 size={18} />
                    Delete Note
                  </button>
                </div>
              }
            >
              <div className="flex flex-col items-center text-center p-2">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                  <Trash2 size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 font-primary">Confirm Deletion</h2>
                <p className="text-gray-500 text-sm leading-relaxed font-primary">
                  Are you sure you want to delete <span className="font-bold text-gray-800">"{noteToDelete?.title}"</span>? This action is permanent and cannot be undone.
                </p>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
