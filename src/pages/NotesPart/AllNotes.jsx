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
  Eye,
  LayoutGrid,
  List,
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
  const [viewMode, setViewMode] = useState("table");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("All");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const dropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
  });

  const categories = ["All", "Meeting", "Tasks", "Ideas", "General"];

  // Date Filter Logic
  const getDateRange = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    let dateFrom = "";
    let dateTo = "";

    if (dateFilter === "Today") {
      dateFrom = formatDate(today);
      dateTo = formatDate(today);
    } else if (dateFilter === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateFrom = formatDate(yesterday);
      dateTo = formatDate(yesterday);
    } else if (dateFilter === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 7);
      dateFrom = formatDate(last7);
      dateTo = formatDate(today);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFrom = formatDate(firstDay);
      dateTo = formatDate(today);
    } else if (dateFilter === "Custom") {
      dateFrom = customStart;
      dateTo = customEnd;
    }
    return { dateFrom, dateTo };
  };

  const { dateFrom, dateTo } = getDateRange();

  const { data, isLoading, isFetching, refetch } = useGetNotesQuery({
    page,
    limit: 12,
    category: selectedCategory,
    search: searchTerm,
    dateFrom,
    dateTo,
  });

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const notes = data?.notes || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, dateFilter, customStart, customEnd]);

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
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== "All" || dateFilter !== "All";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    Notes
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || selectedCategory !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={18} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${selectedCategory === cat
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

                {/* Date Filter */}
                <div className="relative" ref={dateDropdownRef}>
                  <button
                    onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isDateFilterOpen || dateFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Calendar size={18} />
                  </button>

                  {isDateFilterOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setDateFilter(option);
                              setIsDateFilterOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Show Custom Date Range Only When Selected */}
                {dateFilter === "Custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                    <span className="text-gray-400 text-xs font-bold">to</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm shadow-sm"
                    />
                  </div>
                )}


                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 p-1 rounded-sm border border-gray-200 shadow-inner">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "grid"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-sm transition-all duration-200 ${viewMode === "table"
                      ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    <List size={18} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0 font-primary">
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center justify-between bg-orange-50 border border-orange-200 rounded-sm p-3 gap-3 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2">
                <Filter className="text-orange-600" size={16} />
                <span className="text-sm font-bold text-orange-800 uppercase">
                  ACTIVE FILTERS:
                </span>
                {searchTerm && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Search: "{searchTerm}"</span>}
                {selectedCategory !== "All" && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Category: {selectedCategory}</span>}
                {dateFilter !== "All" && dateFilter !== "Custom" && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">Period: {dateFilter}</span>}
                {dateFilter === "Custom" && customStart && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">From: {customStart}</span>}
                {dateFilter === "Custom" && customEnd && <span className="text-xs bg-white px-3 py-1 rounded-sm border border-orange-200 text-orange-700 shadow-sm font-bold">To: {customEnd}</span>}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-orange-300 text-orange-600 rounded-sm hover:bg-orange-100 transition shadow-sm text-xs font-bold active:scale-95 uppercase"
              >
                <X size={14} />
                Clear All
              </button>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
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

          {/* Notes Content */}
          {notes.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-orange-300 overflow-hidden flex flex-col"
                >
                  <div className="p-4 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${note.category === 'Meeting' ? 'bg-orange-100 text-orange-700' :
                        note.category === 'Tasks' ? 'bg-green-100 text-green-700' :
                          note.category === 'Ideas' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {note.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-medium">{new Date(note.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-normal leading-relaxed line-clamp-3">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
                    <button
                      onClick={() => handleView(note)}
                      className="text-blue-500 hover:opacity-80 transition-colors"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-[#FF7B1D] hover:opacity-80 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setNoteToDelete(note);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 hover:bg-red-50 p-1 rounded-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notes.length > 0 && viewMode === "table" && (
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                      <th className="py-3 px-4 font-semibold text-left">Date</th>
                      <th className="py-3 px-4 font-semibold text-left">Category</th>
                      <th className="py-3 px-4 font-semibold text-left">Title</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {notes.map((note, idx) => (
                      <tr key={note.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-orange-50/50 transition-colors group`}>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <Clock size={14} className="text-orange-500" />
                            {new Date(note.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${note.category === 'Meeting' ? 'bg-orange-100 text-orange-700' :
                            note.category === 'Tasks' ? 'bg-green-100 text-green-700' :
                              note.category === 'Ideas' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {note.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-bold text-gray-900 truncate max-w-xs">{note.title}</div>
                          <div className="text-xs text-gray-400 mt-1 truncate max-w-sm">{note.content}</div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-3 text-gray-400">
                            <button
                              onClick={() => handleView(note)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                              title="View Note"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(note)}
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-sm transition-all"
                              title="Edit Note"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setNoteToDelete(note);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                              title="Delete Note"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


            </div>
          )}
          {/* Pagination Section */}
          {notes.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600">{(page - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(page * itemsPerPage, pagination.total)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Notes
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-sm font-bold transition ${page === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(page < pagination.totalPages ? page + 1 : page)}
                  disabled={page === pagination.totalPages || pagination.totalPages === 0}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${page === pagination.totalPages || pagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Next
                </button>
              </div>
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
