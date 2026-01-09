import React, { useState, useEffect, useRef, useCallback } from "react";
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
  CheckCircle,
  AlertCircle,
  Loader2,
  Pencil,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import NumberCard from "../../components/NumberCard";
import Modal from "../../components/common/Modal";
import {
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "../../store/api/noteApi";

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const dropdownRef = useRef(null);
  const observer = useRef();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
  });

  const categories = ["All", "Meeting", "Tasks", "Ideas", "General"];

  const { data, isLoading, isFetching, refetch } = useGetNotesQuery({
    page,
    limit: 12,
    category: selectedCategory,
    search: searchTerm,
  });

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const notes = data?.notes || [];
  const hasMore = data?.pagination?.page < data?.pagination?.totalPages;

  const lastNoteRef = useCallback(node => {
    if (isLoading || isFetching) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, isFetching, hasMore]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      if (editingNote) {
        await updateNote({ id: editingNote.id, ...formData }).unwrap();
        toast.success("Note updated successfully");
      } else {
        await createNote(formData).unwrap();
        toast.success("Note added successfully");
      }
      setIsAdding(false);
      resetForm();
      setPage(1); // Refresh list
    } catch (err) {
      toast.error("Error saving note: " + (err?.data?.message || err.message));
    }
  };

  const handleView = (note) => {
    setViewNote(note);
  };

  const handleDeleteNote = async () => {
    try {
      await deleteNote(noteToDelete.id).unwrap();
      toast.success("Note deleted successfully");
      setShowDeleteModal(false);
      setPage(1); // Refresh list
    } catch (err) {
      toast.error("Error deleting note: " + (err?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", category: "General" });
    setEditingNote(null);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
    });
    setIsAdding(true);
  };

  useEffect(() => {
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
          <div className="max-w-8xl mx-auto">
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
                    className={`p-3 rounded-sm border transition-all shadow-sm ${isFilterOpen
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-orange-500 hover:text-white hover:border-[#FF7B1D]"
                      }`}
                  >
                    <Filter size={20} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="p-2 border-b bg-gray-50">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter by Notes</p>
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
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] text-sm md:w-64 transition-all"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                <button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:shadow-lg transition-all flex items-center gap-2 font-bold shadow-md"
                >
                  <Plus size={20} />
                  New Note
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto py-6 font-primary">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <NumberCard
              title="Total Notes"
              number={data?.pagination?.total || 0}
              icon={<FileText className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            {/* Logic for category counts could be added to backend, using notes length for now if loaded */}
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

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <div
                key={note.id}
                ref={index === notes.length - 1 ? lastNoteRef : null}
                className="group bg-white rounded-sm shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-orange-200 overflow-hidden relative flex flex-col min-h-[220px]"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="p-3 flex-1">
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
                      <span className="text-[11px] font-medium">{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 italic">
                    "{note.content}"
                  </p>
                </div>

                {/* ----------------------------- */}

                <div className="flex items-center flex-1">
                  <button
                    onClick={() => handleView(note)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                    title="Read Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setNoteToDelete(note);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {/* ----------------------------- */}

              </div>
            ))}
          </div>

          {isFetching && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-[#FF7B1D] animate-spin" />
            </div>
          )}

          {!isLoading && notes.length === 0 && (
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

          {/* Add/Edit Modal */}
          {isAdding && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-center items-center z-50 animate-fadeIn p-4">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-slideUp">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{editingNote ? "Edit Note" : "Create New Note"}</h2>
                        <p className="text-sm text-white text-opacity-90 mt-1">
                          {editingNote ? "Update your note details" : "Add a new note to your collection"}
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

                <form onSubmit={handleAddNote}>
                  <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText size={16} className="text-[#FF7B1D]" />
                        Note Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Meeting Notes, Ideas, Tasks..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Filter size={16} className="text-[#FF7B1D]" />
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm bg-white"
                      >
                        {categories.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Edit2 size={16} className="text-[#FF7B1D]" />
                        Note Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="content"
                        rows="6"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        placeholder="Write your note content here..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all font-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all font-primary"
                    >
                      {editingNote ? "Update Note" : "Save Note"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* View modal */}
          <Modal
            isOpen={!!viewNote}
            onClose={() => setViewNote(null)}
            title={viewNote?.title}
            subtitle={`Category • ${viewNote?.category}`}
            icon={<FileText />}
            footer={
              <div className="flex gap-4">
                <button
                  onClick={() => setViewNote(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            }
          >
            {viewNote && (
              <div className="space-y-8 text-black bg-white font-primary">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-6">
                  {/* Category */}
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                    <div className="bg-orange-500 p-2 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                      <Tag size={20} />
                    </div>
                    <span className="text-lg font-bold text-orange-900">
                      {viewNote.category}
                    </span>
                    <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest mt-1">
                      Category
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                    <div className="bg-blue-600 p-2 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                      <Calendar size={20} />
                    </div>
                    <span className="text-sm font-bold text-blue-900">
                      {new Date(viewNote.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest mt-1">
                      Date
                    </span>
                  </div>

                  {/* Created Time */}
                  <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                    <div className="bg-green-600 p-2 rounded-xl text-white mb-2 group-hover:scale-110 transition-transform">
                      <Clock size={20} />
                    </div>
                    <span className="text-sm font-bold text-green-900">
                      {new Date(viewNote.created_at).toLocaleTimeString()}
                    </span>
                    <span className="text-xs font-semibold text-green-600 uppercase tracking-widest mt-1">
                      Time
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText size={16} />
                      Note Content
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 whitespace-pre-line">
                      {viewNote.content || "No content available for this note."}
                    </p>
                  </div>

                  {/* Footer info */}
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-500 italic text-sm">
                    <Calendar size={16} />
                    <span>
                      Created on{" "}
                      {new Date(viewNote.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            headerVariant="simple"
            maxWidth="max-w-md"
            footer={
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteNote}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Trash2 size={20} />
                  Delete Now
                </button>
              </div>
            }
          >
            <div className="flex flex-col items-center text-center text-black">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <AlertCircle size={48} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
              <p className="text-gray-600 mb-2 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-gray-800">"{noteToDelete?.title}"</span>?
              </p>
              <p className="text-sm text-red-500 italic">This action cannot be undone and will permanently remove all associated data.</p>
            </div>
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
}
