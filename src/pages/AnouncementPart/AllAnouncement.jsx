import React, { useState, useEffect, useRef } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Megaphone,
  Plus,
  Eye,
  Trash2,
  Calendar,
  Search,
  Filter,
  Edit,
  ThumbsUp,
  ThumbsDown,
  Package,
  X,
  TrendingUp,
  LayoutGrid,
  List,
  Loader2,
  Clock,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import { useGetAnnouncementsQuery } from "../../store/api/announcementApi";
import { useGetAnnouncementCategoriesQuery } from "../../store/api/announcementCategoryApi";
import AddAnnouncementModal from "../../components/Announcement/AddAnnouncementModal";
import EditAnnouncementModal from "../../components/Announcement/EditAnnouncementModal";
import ViewAnnouncementModal from "../../components/Announcement/ViewAnnouncementModal";
import DeleteAnnouncementModal from "../../components/Announcement/DeleteAnnouncementModal";

export default function AnnouncementPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const itemsPerPage = 8;

  // Mock stats state for frontend demonstration
  const [mockStats, setMockStats] = useState({});

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  const dateFilterDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (dateFilterDropdownRef.current && !dateFilterDropdownRef.current.contains(event.target)) {
        setIsDateFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: categoriesData } = useGetAnnouncementCategoriesQuery({ status: "Active", limit: 100 });
  const categories = categoriesData?.categories || [];

  const { data, isLoading } = useGetAnnouncementsQuery({
    page: currentPage,
    limit: itemsPerPage,
    category: categoryFilter,
    search: searchTerm,
  });

  const announcements = data?.announcements || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };

  const getCategoryColor = (category) => {
    const colors = {
      Achievement: "bg-green-50 text-green-700 border-green-200",
      "Product Update": "bg-blue-50 text-blue-700 border-blue-200",
      Policy: "bg-purple-50 text-purple-700 border-purple-200",
      Event: "bg-pink-50 text-pink-700 border-pink-200",
      Process: "bg-yellow-50 text-yellow-700 border-yellow-200",
      Recognition: "bg-orange-50 text-orange-700 border-orange-200",
      Internal: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Urgent: "bg-red-50 text-red-700 border-red-200",
      General: "bg-gray-50 text-slate-700 border-gray-200",
    };

    if (colors[category]) return colors[category];

    // Fallback: Dynamic color based on string content for custom categories (like SSS, TEST CAT)
    const fallbacks = [
      "bg-blue-50 text-blue-700 border-blue-200 text-blue-700",
      "bg-purple-50 text-purple-700 border-purple-200 text-purple-700",
      "bg-indigo-50 text-indigo-700 border-indigo-200 text-indigo-700",
      "bg-teal-50 text-teal-700 border-teal-200 text-teal-700",
      "bg-cyan-50 text-cyan-700 border-cyan-200 text-cyan-700",
      "bg-rose-50 text-rose-700 border-rose-200 text-rose-700",
      "bg-amber-50 text-amber-700 border-amber-200 text-amber-700",
    ];

    let hash = 0;
    const str = String(category || "General");
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fallbacks.length;
    return fallbacks[index];
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowEditModal(true);
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);

    // Mock view increment
    setMockStats(prev => ({
      ...prev,
      [announcement.id]: {
        ...prev[announcement.id],
        views: (prev[announcement.id]?.views || 0) + 1
      }
    }));
  };

  const handleLike = (id) => {
    setMockStats(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        likes: (prev[id]?.likes || 0) + (prev[id]?.userLiked ? -1 : 1),
        userLiked: !prev[id]?.userLiked,
        userDisliked: false,
        dislikes: prev[id]?.userDisliked ? (prev[id]?.dislikes || 0) - 1 : (prev[id]?.dislikes || 0)
      }
    }));
  };

  const handleDislike = (id) => {
    setMockStats(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        dislikes: (prev[id]?.dislikes || 0) + (prev[id]?.userDisliked ? -1 : 1),
        userDisliked: !prev[id]?.userDisliked,
        userLiked: false,
        likes: prev[id]?.userLiked ? (prev[id]?.likes || 0) - 1 : (prev[id]?.likes || 0)
      }
    }));
  };

  // Date filtering logic
  const getFilteredAnnouncementsByDate = () => {
    if (dateFilter === "All") return announcements;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return announcements.filter((announcement) => {
      const announcementDate = new Date(announcement.date);
      const announcementDay = new Date(announcementDate.getFullYear(), announcementDate.getMonth(), announcementDate.getDate());

      if (dateFilter === "Today") {
        return announcementDay.getTime() === today.getTime();
      } else if (dateFilter === "This Week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        return announcementDay >= weekAgo;
      } else if (dateFilter === "This Month") {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return announcementDay >= firstDayOfMonth;
      } else if (dateFilter === "Custom" && customStartDate && customEndDate) {
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        return announcementDay >= start && announcementDay <= end;
      }
      return true;
    });
  };

  const filteredAnnouncements = getFilteredAnnouncementsByDate();

  // Calculate category-wise stats
  const categoryStats = categories.reduce((acc, cat) => {
    const count = filteredAnnouncements.filter(a => a.category === cat.name).length;
    acc[cat.name] = count;
    return acc;
  }, {});

  const stats = {
    total: pagination.total || 0,
    filtered: filteredAnnouncements.length,
    thisWeek: announcements.filter((a) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.date) >= weekAgo;
    }).length,
    byCategory: categoryStats,
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setCategoryFilter("All");
    setDateFilter("All");
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters = categoryFilter !== "All" || dateFilter !== "All";



  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Announcements
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Announcement
                  </span>
                </p>
              </div>

              {/* Right Side: Filter + New Button */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
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
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">category</span>
                      </div>
                      <div className="py-1 max-h-48 overflow-y-auto custom-scrollbar border-b border-gray-100">
                        <button
                          onClick={() => {
                            setCategoryFilter("All");
                            setIsFilterOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${categoryFilter === "All"
                            ? "bg-orange-50 text-orange-600 font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          All Categories
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setCategoryFilter(cat.name);
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${categoryFilter === cat.name
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">dateCreated</span>
                      </div>
                      <div className="py-1">
                        {["All", "Today", "This Week", "This Month", "Custom"].map((option) => (
                          <div key={option}>
                            <button
                              onClick={() => {
                                setDateFilter(option);
                                if (option !== "Custom") {
                                  setIsFilterOpen(false);
                                  setCurrentPage(1);
                                }
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option}
                            </button>
                            {option === "Custom" && dateFilter === "Custom" && (
                              <div className="px-4 py-3 space-y-2 border-t border-gray-50 bg-gray-50/50">
                                <input
                                  type="date"
                                  value={customStartDate}
                                  onChange={(e) => setCustomStartDate(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <input
                                  type="date"
                                  value={customEndDate}
                                  onChange={(e) => setCustomEndDate(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <button
                                  onClick={() => {
                                    setIsFilterOpen(false);
                                    setCurrentPage(1);
                                  }}
                                  className="w-full bg-orange-500 text-white text-[10px] font-bold py-2 rounded-sm uppercase tracking-wider"
                                >
                                  Apply
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
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

                {/* New Announcement */}
                <button
                  onClick={() => {
                    setSelectedAnnouncement(null);
                    setShowAddModal(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Announcement
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <NumberCard
              title={"Total Announcements"}
              number={pagination.total}
              icon={<Megaphone className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"Filtered Results"}
              number={stats.filtered}
              icon={<Filter className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
          </div>


          {/* Announcements Content */}
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center flex-col items-center gap-4 py-20">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-semibold animate-pulse">Loading announcements...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="col-span-full bg-white rounded-sm border-2 border-dashed border-gray-100 p-12 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="text-gray-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  {searchTerm || categoryFilter !== "All"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Create your first announcement to share updates with the team."}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all p-6 relative group flex flex-col h-full"
                  >
                    {/* Action Icons - Top Right (Hidden by default, shown on hover) */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button
                        onClick={() => handleView(announcement)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-sm bg-white shadow-sm border border-blue-100"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-sm bg-white shadow-sm border border-green-100"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm bg-white shadow-sm border border-red-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col items-center mt-4 flex-1">
                      {/* Icon/Avatar */}
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl border-4 border-gray-100">
                          <Megaphone size={32} />
                        </div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-800 mt-3 text-center line-clamp-2 min-h-[56px]">
                        {announcement.title}
                      </h3>

                      {/* Category Badge */}
                      <p
                        className={`text-xs font-semibold px-3 py-1 rounded-full mt-2 ${getCategoryColor(announcement.category)}`}
                      >
                        {announcement.category}
                      </p>

                      {/* Date */}
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium flex items-center gap-1">
                        <Calendar size={12} className="text-orange-500" />
                        {new Date(announcement.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>

                      {/* Content Preview */}
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mt-4 text-center px-2">
                        {announcement.content}
                      </p>
                    </div>

                    {/* Stats Section */}
                    <div className="flex justify-between items-center mt-6 text-center border-t pt-4">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Likes</p>
                        <p className="text-sm font-bold text-gray-800">
                          {(announcement.likes || 0) + (mockStats[announcement.id]?.likes || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Dislikes</p>
                        <p className="text-sm font-bold text-gray-800">
                          {(announcement.dislikes || 0) + (mockStats[announcement.id]?.dislikes || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase">Views</p>
                        <p className="text-sm font-bold text-gray-800">
                          {(announcement.views || 0) + (mockStats[announcement.id]?.views || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Author & Interactions Section */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
                      {/* Author Info */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                          {announcement.author ? announcement.author.charAt(0) : "A"}
                        </div>
                        <span className="text-xs text-gray-700 font-semibold truncate">
                          {(announcement.author || "System").split("-")[0].trim()}
                        </span>
                      </div>

                      {/* Like/Dislike Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(announcement.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm border transition-all ${mockStats[announcement.id]?.userLiked
                            ? 'bg-green-50 border-green-200 text-green-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200'
                            }`}
                          title="Like"
                        >
                          <ThumbsUp size={14} className={mockStats[announcement.id]?.userLiked ? 'fill-current' : ''} />
                          <span className="text-[10px] font-bold">Like</span>
                        </button>

                        <button
                          onClick={() => handleDislike(announcement.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-sm border transition-all ${mockStats[announcement.id]?.userDisliked
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200'
                            }`}
                          title="Dislike"
                        >
                          <ThumbsDown size={14} className={mockStats[announcement.id]?.userDisliked ? 'fill-current' : ''} />
                          <span className="text-[10px] font-bold">Dislike</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200 animate-fadeIn">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                        <th className="py-3 px-4 font-semibold text-left w-[20%]">Title</th>
                        <th className="py-3 px-4 font-semibold text-left w-[30%]">Description</th>
                        <th className="py-3 px-4 font-semibold text-left w-[18%]">Author</th>
                        <th className="py-3 px-4 font-semibold text-left w-[12%]">Category</th>
                        <th className="py-3 px-4 font-semibold text-left w-[15%]">Date/Time</th>
                        <th className="py-3 px-4 font-semibold text-right w-[5%]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {isLoading ? (
                        <tr>
                          <td colSpan="6" className="py-20 text-center">
                            <div className="flex justify-center flex-col items-center gap-4">
                              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                              <p className="text-gray-500 font-semibold animate-pulse">Loading announcements...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredAnnouncements.map((announcement, idx) => (
                        <tr key={announcement.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-orange-50/30 transition-colors group`}>
                          <td className="py-3 px-4 text-left">
                            <div className="text-base font-normal text-gray-900 truncate max-w-xs">
                              {announcement.title?.length > 100 ? `${announcement.title.substring(0, 100)}...` : announcement.title}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-left min-w-[200px]">
                            <div className="text-sm text-gray-600 font-medium line-clamp-1 leading-relaxed" title={announcement.content}>
                              {announcement.content}
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-left">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 bg-orange-100/80 rounded-full flex items-center justify-center text-orange-600 font-bold text-[11px] border border-orange-200">
                                {announcement.author ? announcement.author.charAt(0) : "A"}
                              </div>
                              <span className="text-sm text-gray-700 font-medium">
                                {(announcement.author || "System").split("-")[0].trim()}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-left">
                            <span className={`inline-block px-2.5 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-tight border shadow-sm ${getCategoryColor(announcement.category)}`}>
                              {announcement.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-left">
                            <div className="flex flex-col text-sm text-gray-600 font-medium">
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-orange-500" />
                                {new Date(announcement.date).toLocaleDateString()}
                              </div>
                              <div className="mt-0.5 text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                <Clock size={10} />
                                {announcement.time || "12:00 PM"}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-3 text-gray-400">
                              <button
                                onClick={() => handleView(announcement)}
                                className="p-1 hover:bg-orange-100 rounded text-blue-500 hover:text-blue-700 transition-all"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() => handleEdit(announcement)}
                                className="p-1 hover:bg-orange-100 rounded text-green-500 hover:text-green-700 transition-all"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(announcement)}
                                className="p-1 hover:bg-orange-100 rounded text-red-500 hover:text-red-700 transition-all shadow-sm"
                                title="Delete"
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
          </div>
          {announcements.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 mb-6 shadow-sm">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> of <span className="text-orange-600">{pagination.total || 0}</span> Announcements
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1 ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-orange-500" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage < pagination.totalPages ? currentPage + 1 : currentPage)}
                  disabled={currentPage === pagination.totalPages || pagination.totalPages === 0}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === pagination.totalPages || pagination.totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>


      </div>

      <AddAnnouncementModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
        }}
      />

      <EditAnnouncementModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
      />

      <ViewAnnouncementModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
      />

      <DeleteAnnouncementModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAnnouncement(null);
        }}
      />
    </DashboardLayout>
  );
}
