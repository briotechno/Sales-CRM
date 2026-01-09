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

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "invoice",
      title: "Invoice Payment Received",
      message:
        "Payment of ₹2,50,000 received from Tech Solutions Ltd for Invoice INV-2024-002",
      timestamp: "2024-11-19T10:30:00",
      read: false,
      priority: "high",
      icon: "DollarSign",
    },
    {
      id: 2,
      type: "quotation",
      title: "New Quotation Approved",
      message: "Quotation QT-2024-005 has been approved by Acme Corporation",
      timestamp: "2024-11-19T09:15:00",
      read: false,
      priority: "medium",
      icon: "FileText",
    },
    {
      id: 3,
      type: "overdue",
      title: "Invoice Overdue",
      message:
        "Invoice INV-2024-003 for Global Industries is now overdue by 5 days",
      timestamp: "2024-11-19T08:00:00",
      read: false,
      priority: "high",
      icon: "AlertCircle",
    },
    {
      id: 4,
      type: "meeting",
      title: "Meeting Reminder",
      message:
        "Client meeting with Innovation Inc scheduled for today at 2:00 PM",
      timestamp: "2024-11-19T07:00:00",
      read: true,
      priority: "medium",
      icon: "Calendar",
    },
    {
      id: 5,
      type: "expense",
      title: "Expense Approved",
      message: "Your expense claim of ₹15,000 has been approved",
      timestamp: "2024-11-18T16:30:00",
      read: true,
      priority: "low",
      icon: "CheckCircle",
    },
    {
      id: 6,
      type: "team",
      title: "New Team Member",
      message: "Sarah Johnson has been added to the Sales Team",
      timestamp: "2024-11-18T14:20:00",
      read: true,
      priority: "low",
      icon: "Users",
    },
    {
      id: 7,
      type: "target",
      title: "Monthly Target Update",
      message: "You have achieved 85% of your monthly sales target",
      timestamp: "2024-11-18T12:00:00",
      read: true,
      priority: "medium",
      icon: "TrendingUp",
    },
    {
      id: 8,
      type: "email",
      title: "Important Email",
      message: "New email from client regarding project requirements",
      timestamp: "2024-11-18T11:30:00",
      read: true,
      priority: "medium",
      icon: "Mail",
    },
  ]);

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
      // Type filter
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target)
      ) {
        setIsTypeFilterOpen(false);
      }

      // Read filter
      if (
        readDropdownRef.current &&
        !readDropdownRef.current.contains(event.target)
      ) {
        setIsReadFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      quotation: "bg-purple-100 text-purple-600",
      overdue: "bg-red-100 text-red-600",
      meeting: "bg-green-100 text-green-600",
      expense: "bg-yellow-100 text-yellow-600",
      team: "bg-indigo-100 text-indigo-600",
      target: "bg-orange-100 text-orange-600",
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter((n) => !n.read));
    setIsDeleteModalOpen(false);
  };

  const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-scaleIn">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
              <AlertCircle size={36} className="text-red-600" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Confirm Delete
          </h2>

          <p className="text-gray-600 mb-2 leading-relaxed">
            Are you sure you want to delete all{" "}
            <span className="font-bold text-gray-800">"read notifications"</span>?
          </p>

          <p className="text-sm text-red-500 text-center mb-5 italic">
            This action cannot be undone. All associated data will be permanently removed.
          </p>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesType = filterType === "all" || n.type === filterType;
    const matchesRead =
      filterRead === "all" ||
      (filterRead === "unread" && !n.read) ||
      (filterRead === "read" && n.read);
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesRead && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const stats = {
    total: notifications.length,
    unread: unreadCount,
    high: notifications.filter((n) => n.priority === "high" && !n.read).length,
    today: notifications.filter((n) => {
      const date = new Date(n.timestamp);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-gradient-to-br from-gray-0 to-gray-100 ml-6 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-8xl mx-auto py-4">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Notification
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> Additional /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Notification
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* ------------------------------------------ */}
                  <div className="relative" ref={typeDropdownRef}>
                    <button
                      onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-sm border transition shadow-sm ${isTypeFilterOpen || filterType !== "all"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      <FileText size={18} />
                      <span className="text-sm font-medium">
                        {filterType === "all" ? "All Types" : filterType}
                      </span>
                    </button>

                    {isTypeFilterOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                        <div className="p-2 border-b bg-gray-50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Filter by Notification</p>
                        </div>
                        <div className="py-1">
                          {[
                            { label: "All Types", value: "all" },
                            { label: "Invoice", value: "invoice" },
                            { label: "Quotation", value: "quotation" },
                            { label: "Overdue", value: "overdue" },
                            { label: "Meeting", value: "meeting" },
                            { label: "Expense", value: "expense" },
                            { label: "Team", value: "team" },
                            { label: "Target", value: "target" },
                            { label: "Email", value: "email" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFilterType(option.value);
                                setIsTypeFilterOpen(false);
                                setCurrentPage(1);
                              }}
                              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${filterType === option.value
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ------------------------------------------ */}
                  <div className="relative" ref={readDropdownRef}>
                    <button
                      onClick={() => setIsReadFilterOpen(!isReadFilterOpen)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-sm border transition shadow-sm ${isReadFilterOpen || filterRead !== "all"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      <Filter size={20} />
                    </button>

                    {isReadFilterOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                        <div className="py-1">
                          {[
                            { label: "All", value: "all" },
                            { label: "Unread", value: "unread" },
                            { label: "Read", value: "read" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setFilterRead(option.value);
                                setIsReadFilterOpen(false);
                                setCurrentPage(1);
                              }}
                              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${filterRead === option.value
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear Read
                </button>

                <button
                  onClick={markAllAsRead}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:shadow-lg transition-all flex items-center gap-2 font-bold shadow-md"
                >
                  <Check size={20} />
                  Mark All Read
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-0 mt-2 py-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <NumberCard
              title={"Total Notifications"}
              number={stats.total}
              icon={<Bell className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"}
            />
            <NumberCard
              title={"Unread"}
              number={stats.unread}
              icon={<Mail className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"}
            />
            <NumberCard
              title={"High Priority"}
              number={stats.high}
              icon={<AlertCircle className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"}
            />
            <NumberCard
              title={"Today"}
              number={stats.today}
              icon={<Calendar className="text-purple-600" size={24} />}
              iconBgColor={"bg-purple-100"}
              lineBorderClass={"border-purple-500"}
            />
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-sm shadow-md p-12 text-center">
                <Bell className="mx-auto text-gray-300 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-sm shadow-md hover:shadow-lg transition-all p-5 border-t-4 ${notification.read
                    ? "border-gray-300 opacity-75"
                    : "border-orange-500"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-sm ${getTypeColor(
                        notification.type
                      )}`}
                    >
                      {getIcon(notification.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-bold text-gray-800 ${!notification.read ? "text-orange-600" : ""
                                }`}
                            >
                              {notification.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-sm font-semibold ${getPriorityBadge(
                                notification.priority
                              )}`}
                            >
                              {notification.priority.toUpperCase()}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500 font-medium">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-orange-600 hover:text-orange-700 text-sm font-semibold flex items-center gap-1"
                          >
                            <Check size={16} />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={deleteAllRead}
      />

    </DashboardLayout>
  );
}
