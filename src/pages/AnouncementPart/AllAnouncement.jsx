import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Megaphone,
  Plus,
  Eye,
  Trash2,
  Pin,
  TrendingUp,
  Calendar,
  MessageCircle,
  X,
  Send,
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
      pinned: true,
      views: 245,
      likes: 89,
      comments: 23,
    },
    {
      id: 2,
      title: "New CRM Features Released",
      content:
        "We are excited to announce the release of new CRM features including advanced analytics dashboard, automated follow-ups, and enhanced reporting capabilities. Please check the user guide for detailed information.",
      author: "Sarah Johnson - Product Manager",
      date: "2024-11-18",
      category: "Product Update",
      pinned: true,
      views: 189,
      likes: 56,
      comments: 15,
    },
    {
      id: 3,
      title: "Company Holiday Schedule 2025",
      content:
        "Please find attached the complete holiday schedule for 2025. All employees are requested to plan their leaves accordingly. The office will remain closed on all public holidays mentioned in the schedule.",
      author: "HR Department",
      date: "2024-11-17",
      category: "Policy",
      pinned: false,
      views: 312,
      likes: 45,
      comments: 8,
    },
    {
      id: 4,
      title: "Team Building Event - Next Friday",
      content:
        "Join us for our quarterly team building event next Friday at 3 PM. We have planned exciting activities including workshops, team challenges, and dinner. RSVP by Thursday.",
      author: "Emily Davis - HR Manager",
      date: "2024-11-16",
      category: "Event",
      pinned: false,
      views: 267,
      likes: 78,
      comments: 34,
    },
    {
      id: 5,
      title: "New Client Onboarding Process",
      content:
        "We have updated our client onboarding process to make it more efficient. All team members should review the new guidelines and follow the updated procedures starting next week.",
      author: "Michael Brown - Operations Head",
      date: "2024-11-15",
      category: "Process",
      pinned: false,
      views: 156,
      likes: 32,
      comments: 12,
    },
    {
      id: 6,
      title: "Employee of the Month - October",
      content:
        "Congratulations to Rahul Sharma for being selected as Employee of the Month for October! His exceptional performance and dedication to client satisfaction has been outstanding.",
      author: "HR Department",
      date: "2024-11-14",
      category: "Recognition",
      pinned: false,
      views: 198,
      likes: 92,
      comments: 28,
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
    pinned: false,
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
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
        pinned: formData.pinned,
        views: 0,
        likes: 0,
        comments: 0,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setFormData({
        title: "",
        content: "",
        author: "",
        category: "General",
        pinned: false,
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
    // Increment views
    setAnnouncements(
      announcements.map((a) =>
        a.id === announcement.id ? { ...a, views: a.views + 1 } : a
      )
    );
  };

  const togglePin = (id) => {
    setAnnouncements(
      announcements.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
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
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

  const stats = {
    total: announcements.length,
    pinned: announcements.filter((a) => a.pinned).length,
    thisWeek: announcements.filter((a) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.date) >= weekAgo;
    }).length,
    totalViews: announcements.reduce((sum, a) => sum + a.views, 0),
  };

  return (
    <DashboardLayout>
      <div className=" ml-6 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b ">
          <div className="max-w-8xl mx-auto px-6 py-4">
            <div className="flex items-center">
              {/* Left Side */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Announcement
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Announcement
                  </span>
                </p>
              </div>

              {/* Right Side: Filter + New Button */}
              <div className="flex items-center gap-4 ml-auto">
                {/* Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-5 py-3 border border-gray-200 rounded-sm hover:bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
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

                {/* New Announcement */}
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  New Announcement
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-0 py-0 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <NumberCard
              title={"Total Announcements"}
              number={stats.total}
              icon={<Megaphone className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"Pinned"}
              number={stats.pinned}
              icon={<Pin className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"}
            />
            <NumberCard
              title={"This Week"}
              number={stats.thisWeek}
              icon={<Calendar className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
            <NumberCard
              title={"Total Views"}
              number={stats.totalViews}
              icon={<Eye className="text-purple-600" size={24} />}
              iconBgColor={"bg-purple-100"}
              lineBorderClass={"border-purple-500"}
            />
          </div>

          {/* Announcements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAnnouncements.length === 0 ? (
              <div className="col-span-2 bg-white rounded-sm shadow-md p-12 text-center">
                <Megaphone className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No announcements found
                </h3>
                <p className="text-gray-500">
                  Create your first announcement to get started
                </p>
              </div>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-sm shadow-md hover:shadow-xl transition-all p-6 border-t-4 ${announcement.pinned
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300"
                    }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {announcement.pinned && (
                          <Pin
                            className="text-orange-500"
                            size={18}
                            fill="currentColor"
                          />
                        )}
                        <h3 className="text-xl font-bold text-gray-800 leading-tight">
                          {announcement.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-sm text-xs font-semibold border ${getCategoryColor(
                            announcement.category
                          )}`}
                        >
                          {announcement.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(announcement.date).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePin(announcement.id)}
                        className={`p-2 rounded-sm transition-colors ${announcement.pinned
                            ? "text-orange-500 bg-orange-100 hover:bg-orange-200"
                            : "text-gray-400 hover:bg-gray-100"
                          }`}
                        title="Pin/Unpin"
                      >
                        <Pin size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {announcement.content}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {announcement.author.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {announcement.author}
                    </span>
                  </div>

                  {/* Stats & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={16} />
                        {announcement.views}
                      </span>
                      <button
                        onClick={() => handleLike(announcement.id)}
                        className="flex items-center gap-1 hover:text-orange-500 transition-colors"
                      >
                        <TrendingUp size={16} />
                        {announcement.likes}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        {announcement.comments}
                      </span>
                    </div>
                    <button
                      onClick={() => handleView(announcement)}
                      className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1"
                    >
                      Read More
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Announcement Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">
                    Create New Announcement
                  </h2>
                  <p className="text-orange-100 text-sm mt-1">
                    Share important updates and information with your team
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter announcement title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your name and designation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="General">General</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Product Update">Product Update</option>
                      <option value="Policy">Policy</option>
                      <option value="Event">Event</option>
                      <option value="Process">Process</option>
                      <option value="Recognition">Recognition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    rows="6"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your announcement content here..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="pinned"
                    id="pinned"
                    checked={formData.pinned}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="pinned"
                    className="text-sm font-medium text-gray-700"
                  >
                    Pin this announcement to the top
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAnnouncement}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Publish Announcement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Announcement Modal */}
        {showViewModal && selectedAnnouncement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Megaphone size={28} />
                  <h2 className="text-2xl font-bold">Announcement Details</h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Title and Category */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    {selectedAnnouncement.pinned && (
                      <Pin
                        className="text-orange-500"
                        size={20}
                        fill="currentColor"
                      />
                    )}
                    <span
                      className={`px-3 py-1 rounded-sm text-xs font-semibold border ${getCategoryColor(
                        selectedAnnouncement.category
                      )}`}
                    >
                      {selectedAnnouncement.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedAnnouncement.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {selectedAnnouncement.author.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-700">
                        {selectedAnnouncement.author}
                      </span>
                    </div>
                    <span>•</span>
                    <span>
                      {new Date(selectedAnnouncement.date).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                    {selectedAnnouncement.content}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 py-4 border-t border-b border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye size={20} className="text-orange-500" />
                    <span className="font-semibold">
                      {selectedAnnouncement.views}
                    </span>
                    <span className="text-sm">views</span>
                  </div>
                  <button
                    onClick={() => handleLike(selectedAnnouncement.id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    <TrendingUp size={20} />
                    <span className="font-semibold">
                      {selectedAnnouncement.likes}
                    </span>
                    <span className="text-sm">likes</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle size={20} className="text-orange-500" />
                    <span className="font-semibold">
                      {selectedAnnouncement.comments}
                    </span>
                    <span className="text-sm">comments</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.alert("Share functionality")}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
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
