import React, { useEffect, useRef, useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Check,
  Filter,
  Search,
  Mail,
  FileText,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  X,
  Settings,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import { useNotifications } from "../../context/NotificationContext";
import { formatDistanceToNow } from 'date-fns';

export default function NotificationPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearRead,
    loading 
  } = useNotifications();

  const [filterType, setFilterType] = useState("all");
  const [filterRead, setFilterRead] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isReadFilterOpen, setIsReadFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const readDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeFilterOpen(false);
      }
      if (readDropdownRef.current && !readDropdownRef.current.contains(event.target)) {
        setIsReadFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      DollarSign: <DollarSign size={20} />,
      FileText: <FileText size={20} />,
      AlertCircle: <AlertCircle size={20} />,
      Calendar: <Calendar size={20} />,
      CheckCircle: <CheckCircle size={20} />,
      Users: <Users size={20} />,
      TrendingUp: <TrendingUp size={20} />,
      Mail: <Mail size={20} />,
    };
    return icons[iconName] || <Bell size={20} />;
  };

  const getTypeColor = (type) => {
    const colors = {
      invoice: "bg-blue-100 text-blue-600",
      lead: "bg-orange-100 text-orange-600",
      quotation: "bg-purple-100 text-purple-600",
      overdue: "bg-red-100 text-red-600",
      meeting: "bg-green-100 text-green-600",
      expense: "bg-yellow-100 text-yellow-600",
      team: "bg-indigo-100 text-indigo-600",
      target: "bg-cyan-100 text-cyan-600",
      email: "bg-pink-100 text-pink-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-green-500 text-white",
    };
    return colors[priority] || "bg-gray-500 text-white";
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "unread" && !n.is_read) ||
      (filterRead === "read" && n.is_read);
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesRead && matchesSearch;
  });

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    high: notifications.filter((n) => n.priority === "high" && !n.is_read).length,
    today: notifications.filter((n) => {
      const date = new Date(n.created_at);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-gradient-to-br from-gray-0 to-white ml-4 mr-4 min-h-screen">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-400" />
                  <span>Dashboard</span> / <span className="text-[#FF7B1D] font-medium">All Notifications</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Type Filter */}
                <div className="relative" ref={typeDropdownRef}>
                  <button
                    onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-bold shadow-sm ${
                      filterType !== "all" ? "bg-orange-500 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Filter size={16} />
                    {filterType === "all" ? "Filter Type" : filterType.toUpperCase()}
                  </button>
                  {isTypeFilterOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-fadeIn">
                      {["all", "lead", "invoice", "quotation", "meeting", "expense", "team", "system"].map((type) => (
                        <button
                          key={type}
                          onClick={() => { setFilterType(type); setIsTypeFilterOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors ${filterType === type ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-600'}`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Filter */}
                <div className="relative" ref={readDropdownRef}>
                  <button
                    onClick={() => setIsReadFilterOpen(!isReadFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all text-sm font-bold shadow-sm ${
                      filterRead !== "all" ? "bg-orange-500 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <Bell size={16} />
                    {filterRead === "all" ? "Status" : filterRead.toUpperCase()}
                  </button>
                  {isReadFilterOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-fadeIn">
                      {["all", "unread", "read"].map((status) => (
                        <button
                          key={status}
                          onClick={() => { setFilterRead(status); setIsReadFilterOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors ${filterRead === status ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-600'}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block" />

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={notifications.length === 0}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30"
                  title="Clear All Read"
                >
                  <Trash2 size={20} />
                </button>

                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Check size={18} />
                  Mark All Read
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-8xl mx-auto py-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <NumberCard title="Total" number={stats.total} icon={<Bell className="text-blue-500" />} iconBgColor="bg-blue-50" lineBorderClass="border-blue-500" />
            <NumberCard title="Unread" number={stats.unread} icon={<Mail className="text-orange-500" />} iconBgColor="bg-orange-50" lineBorderClass="border-orange-500" />
            <NumberCard title="High Priority" number={stats.high} icon={<AlertCircle className="text-red-500" />} iconBgColor="bg-red-50" lineBorderClass="border-red-500" />
            <NumberCard title="Today" number={stats.today} icon={<Calendar className="text-purple-500" />} iconBgColor="bg-purple-50" lineBorderClass="border-purple-500" />
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search notifications by title or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
            />
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Loading your alerts...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative bg-white rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                    !notification.is_read ? 'border-orange-200 bg-orange-50/5' : 'border-gray-100'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex gap-4">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${getTypeColor(notification.type)}`}>
                      {getIcon(notification.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`text-[15px] leading-tight transition-colors ${!notification.is_read ? 'font-bold text-gray-900 border-b-2 border-orange-500/30' : 'font-semibold text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPriorityBadge(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,123,29,0.5)]" />
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${!notification.is_read ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                           <button 
                             onClick={() => deleteNotification(notification.id)}
                             className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                           >
                             <Trash2 size={16} />
                           </button>
                           <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                             {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                           </span>
                        </div>
                      </div>

                      {!notification.is_read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2 text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 transition-colors bg-orange-50 px-3 py-1.5 rounded-lg w-fit"
                        >
                          <Check size={14} />
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <Bell className="text-gray-200" size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-700">No Notifications</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">
                  We'll let you know when something important happens!
                </p>
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="mt-4 text-sm font-bold text-orange-500 hover:underline">
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scaleIn">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clear Notifications?</h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to clear all read notifications? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all"
              >
                No, Keep
              </button>
              <button 
                onClick={() => { clearRead(); setIsDeleteModalOpen(false); }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
