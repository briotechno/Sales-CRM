import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiHome } from "react-icons/fi";
import {
  FileText,
  Plus,
  Filter,
  Trash2,
  Edit,
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
  SquarePen,
  ChevronDown,
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
  const [showFullNoteContent, setShowFullNoteContent] = useState(false);

  // Temp states for filter
  const [tempCategory, setTempCategory] = useState("All");
  const [tempDateFilter, setTempDateFilter] = useState("All");
  const [tempCustomStart, setTempCustomStart] = useState("");
  const [tempCustomEnd, setTempCustomEnd] = useState("");
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
    limit: 7,
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

    if (formData.title.length > 250) {
      toast.error("Note title cannot exceed 250 characters");
      return;
    }

    if (formData.content.length > 10000) {
      toast.error("Note content cannot exceed 10000 characters");
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
    setShowFullNoteContent(false);
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
    setTempCategory("All");
    setTempDateFilter("All");
    setTempCustomStart("");
    setTempCustomEnd("");
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== "All" || dateFilter !== "All";

  return (
    <>
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
                {/* Unified Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
                        setTempCategory(selectedCategory);
                        setTempDateFilter(dateFilter);
                        setTempCustomStart(customStart);
                        setTempCustomEnd(customEnd);
                        setIsFilterOpen(!isFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-[400px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800">Filter Options</span>
                        <button
                          onClick={() => {
                            setTempCategory("All");
                            setTempDateFilter("All");
                            setTempCustomStart("");
                            setTempCustomEnd("");
                          }}
                          className="text-[10px] font-bold text-orange-600 hover:underline hover:text-orange-700 capitalize"
                        >
                          Reset all
                        </button>
                      </div>

                      <div className="p-5 grid grid-cols-2 gap-6">
                        {/* Category Section */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Category</span>
                          <div className="relative">
                            <select
                              value={tempCategory}
                              onChange={(e) => setTempCategory(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-1 focus:ring-orange-500/20 outline-none transition-all text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-white"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Date Range Section */}
                        <div className="space-y-4">
                          <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Date Range</span>
                          <div className="space-y-2">
                            {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                              <div key={option}>
                                <label className="flex items-center group cursor-pointer">
                                  <div className="relative flex items-center">
                                    <input
                                      type="radio"
                                      name="date_filter"
                                      checked={tempDateFilter === option}
                                      onChange={() => setTempDateFilter(option)}
                                      className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-[#FF7B1D] checked:border-[5px] hover:border-orange-300"
                                    />
                                  </div>
                                  <span className={`ml-3 text-sm font-medium transition-colors ${tempDateFilter === option ? "text-[#FF7B1D] font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                                    {option}
                                  </span>
                                </label>
                                {option === "Custom" && tempDateFilter === "Custom" && (
                                  <div className="mt-2 pl-7 space-y-2">
                                    <input
                                      type="date"
                                      value={tempCustomStart}
                                      onChange={(e) => setTempCustomStart(e.target.value)}
                                      className="w-full px-2 py-1.5 border border-gray-200 rounded-sm text-xs focus:border-[#FF7B1D] outline-none bg-gray-50"
                                    />
                                    <input
                                      type="date"
                                      value={tempCustomEnd}
                                      onChange={(e) => setTempCustomEnd(e.target.value)}
                                      className="w-full px-2 py-1.5 border border-gray-200 rounded-sm text-xs focus:border-[#FF7B1D] outline-none bg-gray-50"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Filter Actions */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(tempCategory);
                            setDateFilter(tempDateFilter);
                            setCustomStart(tempCustomStart);
                            setCustomEnd(tempCustomEnd);
                            setIsFilterOpen(false);
                            setPage(1);
                          }}
                          className="flex-1 py-2.5 text-[11px] font-bold text-white capitalize tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all rounded-sm shadow-md active:scale-95"
                        >
                          Apply filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>


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

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2 font-primary">

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
          {isLoading ? (
            <div className="flex justify-center flex-col items-center gap-4 py-20">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-semibold animate-pulse">Loading notes...</p>
            </div>
          ) : notes.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="bg-white border-2 border-gray-100 rounded-sm shadow-sm hover:shadow-md transition-all p-6 relative group flex flex-col"
                >
                  {/* Absolute Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleView(note); }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                      title="View Note"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(note); }}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                      title="Edit Note"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(note);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                      title="Delete Note"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Icon & Title Section */}
                  <div className="flex flex-col items-center mb-4 transition-transform group-hover:scale-105 duration-300">
                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-[#FF7B1D] border-4 border-white shadow-sm group-hover:shadow-md transition-all">
                      <FileText size={28} />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mt-3 text-center line-clamp-2 px-2 min-h-[3rem]">
                      {note.title}
                    </h3>
                    <span className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${note.category === 'Meeting' ? 'bg-orange-100 text-orange-700' :
                      note.category === 'Tasks' ? 'bg-green-100 text-green-700' :
                        note.category === 'Ideas' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {note.category}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 mt-2 border-t pt-4 border-gray-50">
                    <div className="relative">
                      <p className="text-gray-600 text-sm font-normal leading-relaxed transition-all duration-300 line-clamp-4">
                        {note.content}
                      </p>
                      {note.content?.length > 120 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(note);
                          }}
                          className="mt-2 text-[#FF7B1D] font-bold text-[10px] uppercase tracking-widest hover:text-orange-600 transition-all"
                        >
                          Show More
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="mt-6 -mx-6 -mb-6 px-6 py-4 bg-gray-100 border-t border-gray-200 rounded-b-sm flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-gray-500" />
                      {new Date(note.created_at).toLocaleDateString()}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleView(note); }}
                      className="text-[#FF7B1D] hover:underline"
                    >
                      Details
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
                      <th className="py-3 px-4 font-semibold text-left w-[25%]">Title</th>
                      <th className="py-3 px-4 font-semibold text-left w-[40%]">Description</th>
                      <th className="py-3 px-4 font-semibold text-left w-[15%]">Category</th>
                      <th className="py-3 px-4 font-semibold text-left w-[15%]">Date</th>
                      <th className="py-3 px-4 font-semibold text-right w-[5%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center">
                          <div className="flex justify-center flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-semibold animate-pulse">Loading notes...</p>
                          </div>
                        </td>
                      </tr>
                    ) : notes.map((note, idx) => (
                      <tr key={note.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-orange-50/50 transition-colors group`}>
                        <td className="py-3 px-4 whitespace-nowrap text-left">
                          <div className="text-base font-normal text-gray-900 truncate max-w-xs">{note.title}</div>
                        </td>
                        <td className="py-3 px-4 text-left min-w-[220px]">
                          <div className="text-sm text-gray-600 line-clamp-1 font-medium leading-relaxed" title={note.content}>
                            {note.content}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-left">
                          <span className={`px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase inline-block ${note.category === 'Meeting' ? 'bg-orange-100 text-orange-700' :
                            note.category === 'Tasks' ? 'bg-green-100 text-green-700' :
                              note.category === 'Ideas' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {note.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-left">
                          <div className="flex items-center justify-start gap-2 text-sm text-gray-600 font-medium">
                            <Clock size={16} className="text-orange-500" />
                            {new Date(note.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(note)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                              title="View Note"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(note)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm transition-all"
                              title="Edit Note"
                            >
                              <SquarePen size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setNoteToDelete(note);
                                setShowDeleteModal(true);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-all"
                              title="Delete Note"
                            >
                              <Trash2 size={16} />
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
              <p className="text-gray-500 max-w-xs mx-auto text-sm font-primary mb-6">
                {hasActiveFilters
                  ? "We couldn't find any notes matching your search or category filter. Try refining your criteria."
                  : "Your note collection is currently empty. Start capturing your thoughts and tasks today!"}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                >
                  Clear Filter
                </button>
              ) : (
                <button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Create First Note
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
                      <div className="bg-white bg-opacity-20 p-2 rounded-sm">
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
                      className="text-white hover:bg-white/20 p-2  transition-colors"
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
                        className={`w-full px-4 py-3 border rounded-sm focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm hover:border-gray-300 ${formData.title.length > 250 ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#FF7B1D]'}`}
                      />
                      <div className="flex justify-end mt-1">
                        <span className={`text-[10px] font-bold ${formData.title.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>
                          {formData.title.length}/250 characters
                        </span>
                      </div>
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm bg-white hover:border-gray-300"
                      >
                        {categories.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <SquarePen size={16} className="text-[#FF7B1D]" />
                        Note Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="content"
                        rows="6"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        placeholder="Write your note content here..."
                        className={`w-full px-4 py-3 border rounded-sm focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm resize-none hover:border-gray-300 ${formData.content.length > 10000 ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#FF7B1D]'}`}
                      ></textarea>
                      <div className="flex justify-end mt-1">
                        <span className={`text-[10px] font-bold ${formData.content.length > 10000 ? 'text-red-500' : 'text-gray-400'}`}>
                          {formData.content.length}/10000 characters
                        </span>
                      </div>
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

          <Modal
            isOpen={!!viewNote}
            onClose={() => setViewNote(null)}
            title={viewNote?.title?.length > 40 ? `${viewNote.title.substring(0, 40)}...` : viewNote?.title}
            subtitle={`Category • ${viewNote?.category}`}
            icon={<FileText />}
            footer={
              <div className="flex gap-4">
                <button
                  onClick={() => setViewNote(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition font-primary text-xs uppercase tracking-widest"
                >
                  Close Note
                </button>
              </div>
            }
          >
            {viewNote && (
              <div className="space-y-6 text-black bg-white font-primary">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category */}
                  <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex flex-col items-center text-center group transition-all">
                    <div className="bg-[#FF7B1D] p-2 rounded-sm text-white mb-2 shadow-sm">
                      <Tag size={18} />
                    </div>
                    <span className="text-base font-bold text-gray-800">
                      {viewNote.category}
                    </span>
                    <span className="text-[10px] font-bold text-[#FF7B1D] uppercase tracking-widest mt-1">
                      Category
                    </span>
                  </div>

                  {/* Created Date */}
                  <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex flex-col items-center text-center group transition-all">
                    <div className="bg-blue-600 p-2 rounded-sm text-white mb-2 shadow-sm">
                      <Calendar size={18} />
                    </div>
                    <span className="text-base font-bold text-gray-800">
                      {new Date(viewNote.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                      Created Date
                    </span>
                  </div>

                  {/* Created Time */}
                  <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex flex-col items-center text-center group transition-all">
                    <div className="bg-green-600 p-2 rounded-sm text-white mb-2 shadow-sm">
                      <Clock size={18} />
                    </div>
                    <span className="text-base font-bold text-gray-800">
                      {new Date(viewNote.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-1">
                      Timestamp
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800  mb-3 flex  items-center gap-2">
                      <FileText size={16} className="text-[#FF7B1D]" />
                      Note Content
                    </h3>
                    <div className="relative">
                      <div className="text-gray-700 leading-relaxed bg-gray-50 p-5 rounded-sm border border-gray-100 whitespace-pre-line text-sm max-h-60 overflow-y-auto custom-scrollbar">
                        {viewNote.content || "Detailed note content is currently unavailable."}
                      </div>
                    </div>
                  </div>

                  {/* Footer info */}
                  <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-800 italic text-base">
                    <Calendar size={18} />
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
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-100 transition-all font-primary text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteNote}
                  className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-primary"
                >
                  <Trash2 size={18} />
                  Delete Now
                </button>
              </div>
            }
          >
            <div className="flex flex-col items-center text-center text-black font-primary">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={48} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirm Delete</h2>
              <p className="text-gray-600 mb-2 leading-relaxed">
                Are you sure you want to delete the note <span className="font-bold text-gray-800">"{noteToDelete?.title}"</span>?
              </p>
              <p className="text-xs text-red-500 italic font-medium">This action cannot be undone. All associated data will be permanently removed.</p>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
}
