import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Megaphone,
  Plus,
  Eye,
  Trash2,
  TrendingUp,
  Calendar,
  X,
  Send,
  Search,
  Filter,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Q4 Sales Target Achieved! 🎉",
      content:
        "Congratulations team! We have successfully achieved 120% of our Q4 sales target. This is a remarkable achievement and testament to everyone's hard work and dedication. Special recognition to the sales team for their outstanding performance.",
      author: "John Smith - CEO",
      date: "2024-11-19",
      category: "Achievement",
      likes: 89,
    },
    {
      id: 2,
      title: "New CRM Features Released",
      content:
        "We are excited to announce the release of new CRM features including advanced analytics dashboard, automated follow-ups, and enhanced reporting capabilities. Please check the user guide for detailed information.",
      author: "Sarah Johnson - Product Manager",
      date: "2024-11-18",
      category: "Product Update",
      likes: 56,
    },
    {
      id: 3,
      title: "Company Holiday Schedule 2025",
      content:
        "Please find attached the complete holiday schedule for 2025. All employees are requested to plan their leaves accordingly. The office will remain closed on all public holidays mentioned in the schedule.",
      author: "HR Department",
      date: "2024-11-17",
      category: "Policy",
      likes: 45,
    },
    {
      id: 4,
      title: "Team Building Event - Next Friday",
      content:
        "Join us for our quarterly team building event next Friday at 3 PM. We have planned exciting activities including workshops, team challenges, and dinner. RSVP by Thursday.",
      author: "Emily Davis - HR Manager",
      date: "2024-11-16",
      category: "Event",
      likes: 78,
    },
    {
      id: 5,
      title: "New Client Onboarding Process",
      content:
        "We have updated our client onboarding process to make it more efficient. All team members should review the new guidelines and follow the updated procedures starting next week.",
      author: "Michael Brown - Operations Head",
      date: "2024-11-15",
      category: "Process",
      likes: 32,
    },
    {
      id: 6,
      title: "Employee of the Month - October",
      content:
        "Congratulations to Rahul Sharma for being selected as Employee of the Month for October! His exceptional performance and dedication to client satisfaction has been outstanding.",
      author: "HR Department",
      date: "2024-11-14",
      category: "Recognition",
      likes: 92,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "General",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateAnnouncement = () => {
    if (formData.title && formData.content && formData.author) {
      const newAnnouncement = {
        id: announcements.length + 1,
        title: formData.title,
        content: formData.content,
        author: formData.author,
        date: new Date().toISOString().split("T")[0],
        category: formData.category,
        likes: 0,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setFormData({
        title: "",
        content: "",
        author: "",
        category: "General",
      });
      setShowModal(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };

  const handleView = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const handleLike = (id) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, likes: a.likes + 1 } : a))
    );
  };

  const filteredAnnouncements = announcements
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "All" || a.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

  const stats = {
    total: announcements.length,
    thisWeek: announcements.filter((a) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.date) >= weekAgo;
    }).length,
  };

  return (
    <DashboardLayout>
      <div className=" ml-6 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Announcements
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-400 text-sm" />
                  Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Announcement
                  </span>
                </p>
              </div>

              {/* Right Side: Filter + New Button */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter */}
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-sm hover:bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] text-sm bg-white cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Product Update">Product Update</option>
                    <option value="Policy">Policy</option>
                    <option value="Event">Event</option>
                    <option value="Process">Process</option>
                    <option value="Recognition">Recognition</option>
                    <option value="General">General</option>
                  </select>
                  <Filter
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] text-sm w-full md:w-64 transition-all"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>

                {/* New Announcement */}
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-bold text-sm"
                >
                  <Plus size={20} />
                  New Announcement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-8xl mx-auto px-0 py-0 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <NumberCard
              title={"Total Announcements"}
              number={stats.total}
              icon={<Megaphone className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"This Week"}
              number={stats.thisWeek}
              icon={<Calendar className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnouncements.length === 0 ? (
              <div className="col-span-full bg-white rounded-sm border-2 border-dashed border-gray-100 p-12 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Megaphone className="text-gray-300" size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">
                  {searchTerm || filterCategory !== "All"
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Create your first announcement to share updates with the team."}
                </p>
                {(searchTerm || filterCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterCategory("All");
                    }}
                    className="px-6 py-2 border-2 border-[#FF7B1D] text-[#FF7B1D] font-bold rounded-sm hover:bg-orange-50 transition-all text-xs uppercase tracking-wider"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
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
                          className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
                            announcement.category
                          )}`}
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
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
                          {announcement.author.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-gray-700 leading-none">
                          {announcement.author.split("-")[0].trim()}
                        </span>
                      </div>
                      <div className="w-px h-3 bg-gray-300"></div>
                      <div className="flex items-center gap-1 text-gray-400" title="Likes">
                        <TrendingUp size={14} className={announcement.likes > 0 ? "text-orange-500" : ""} />
                        <span className="text-xs font-medium">
                          {announcement.likes}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(announcement)}
                        className="text-gray-400 hover:text-[#FF7B1D] bg-white hover:bg-orange-50 p-1.5 rounded-sm border border-transparent hover:border-orange-100 transition-all"
                        title="Read Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 p-1.5 rounded-sm border border-transparent hover:border-red-100 transition-all"
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
        </div>

        {/* Create Announcement Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">New Announcement</h2>
                  <p className="text-orange-100 text-sm mt-1">
                    Share important updates with your team
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all"
                      placeholder="e.g. HR Department"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all appearance-none bg-white"
                      >
                        <option value="General">General</option>
                        <option value="Achievement">Achievement</option>
                        <option value="Product Update">Product Update</option>
                        <option value="Policy">Policy</option>
                        <option value="Event">Event</option>
                        <option value="Process">Process</option>
                        <option value="Recognition">Recognition</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="6"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your announcement content here..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#FF7B1D]/20 focus:border-[#FF7B1D] transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 bg-white border border-gray-300 rounded-sm text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-bold shadow-md flex items-center gap-2"
                >
                  <Send size={18} />
                  Publish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Announcement Modal */}
        {showViewModal && selectedAnnouncement && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center bg-pattern">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Megaphone size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Announcement Details</h2>
                    <p className="text-orange-100 text-xs mt-0.5">Posted on {new Date(selectedAnnouncement.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                {/* Header Info */}
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(
                        selectedAnnouncement.category
                      )}`}
                    >
                      {selectedAnnouncement.category}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {selectedAnnouncement.title}
                  </h1>

                  <div className="flex items-center gap-3 text-sm text-gray-500 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                        {selectedAnnouncement.author.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">
                        {selectedAnnouncement.author}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-orange max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                    {selectedAnnouncement.content}
                  </p>
                </div>

                {/* Interaction Stats */}
                <div className="flex items-center justify-between py-4 bg-gray-50 rounded-lg px-6 border border-gray-100 mb-6">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(selectedAnnouncement.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
                      title="Like"
                    >
                      <TrendingUp size={18} className="group-hover:scale-110 transition-transform text-red-500" />
                      <span className="font-bold text-gray-800">{selectedAnnouncement.likes}</span>
                      <span className="text-xs text-gray-500 font-medium uppercase">likes</span>
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-sm hover:bg-gray-50 font-bold text-gray-700 transition-all text-sm uppercase tracking-wide"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.alert("Share functionality comming soon")}
                    className="px-6 py-2.5 bg-[#FF7B1D] text-white rounded-sm hover:bg-orange-700 font-bold shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wide flex items-center gap-2"
                  >
                    <Send size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
