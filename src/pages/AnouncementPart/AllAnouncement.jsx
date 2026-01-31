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
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Package,
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
  const itemsPerPage = 8;

  // Mock stats state for frontend demonstration
  const [mockStats, setMockStats] = useState({});

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
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
      Achievement: "bg-green-100 text-green-700 border-green-300",
      "Product Update": "bg-blue-100 text-blue-700 border-blue-300",
      Policy: "bg-purple-100 text-purple-700 border-purple-300",
      Event: "bg-pink-100 text-pink-700 border-pink-300",
      Process: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Recognition: "bg-orange-100 text-orange-700 border-orange-300",
      General: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[category] || colors.General;
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

  const stats = {
    total: pagination.total || 0,
    thisWeek: announcements.filter((a) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.date) >= weekAgo;
    }).length,
  };

  const handlePrev = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNext = () => setCurrentPage((prev) => (prev < pagination.totalPages ? prev + 1 : prev));

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Announcements
                </h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <FiHome className="text-gray-400" size={14} />
                  Additional / <span className="text-[#FF7B1D] font-medium">All Announcement</span>
                </p>
              </div>

              {/* Right Side: Filter + New Button */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Filter */}
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-sm border transition shadow-sm ${isFilterOpen || categoryFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    <Filter size={18} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-xl z-50">
                      <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
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
                    </div>
                  )}
                </div>
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm w-64 shadow-sm"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>

                {/* New Announcement */}
                <button
                  onClick={() => {
                    setSelectedAnnouncement(null);
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus size={18} />
                  NEW ANNOUNCEMENT
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">
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
              number={announcements.length}
              icon={<Calendar className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 text-center text-gray-500 font-medium">
                Loading announcements...
              </div>
            ) : announcements.length === 0 ? (
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
                {(searchTerm || categoryFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setCategoryFilter("All");
                    }}
                    className="px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="group bg-white rounded-sm shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-orange-200 overflow-hidden relative flex flex-col h-full"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-orange-400 group-hover:to-orange-600 transition-all duration-300"></div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header: Category & Date */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(announcement.category)
                            }`}
                        >
                          {announcement.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(announcement.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#FF7B1D] transition-colors line-clamp-2">
                      {announcement.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {announcement.content}
                    </p>
                  </div>

                  {/* Footer: Author & Actions */}
                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                          {announcement.author ? announcement.author.charAt(0) : "A"}
                        </div>
                        <span className="text-xs font-bold text-gray-700 leading-none">
                          {(announcement.author || "System").split("-")[0].trim()}
                        </span>
                      </div>

                      {/* Social Interactions */}
                      <div className="flex items-center gap-3 border-l border-gray-200">
                        <button
                          onClick={() => handleLike(announcement.id)}
                          className={`flex items-center gap-1.5 transition-all ${mockStats[announcement.id]?.userLiked ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                          title="Like"
                        >
                          <ThumbsUp size={14} className={mockStats[announcement.id]?.userLiked ? 'fill-current' : ''} />
                          <span className="text-[10px] font-bold">{(announcement.likes || 0) + (mockStats[announcement.id]?.likes || 0)}</span>
                        </button>

                        <button
                          onClick={() => handleDislike(announcement.id)}
                          className={`flex items-center gap-1.5 transition-all ${mockStats[announcement.id]?.userDisliked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                          title="Dislike"
                        >
                          <ThumbsDown size={14} className={mockStats[announcement.id]?.userDisliked ? 'fill-current' : ''} />
                          <span className="text-[10px] font-bold">{(announcement.dislikes || 0) + (mockStats[announcement.id]?.dislikes || 0)}</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-gray-400" title="Views">
                          <Eye size={14} />
                          <span className="text-[10px] font-bold">
                            {(announcement.views || 0) + (mockStats[announcement.id]?.views || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(announcement)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        title="Read Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="text-gray-800 font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-gray-800 font-bold">{Math.min(currentPage * itemsPerPage, pagination.total)}</span> of <span className="text-[#FF7B1D] font-bold">{pagination.total}</span> announcements
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-sm text-sm font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 border rounded-sm text-sm font-bold transition-all ${currentPage === i + 1
                        ? "bg-[#FF7B1D] text-white border-[#FF7B1D] shadow-md transform scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#FF7B1D] hover:text-[#FF7B1D]"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-sm text-sm font-bold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
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
      </div>
    </DashboardLayout>
  );
}
