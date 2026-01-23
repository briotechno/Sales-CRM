import React, { useState, useMemo } from "react";
import { FiBell, FiSearch, FiCheckCircle, FiTrash2, FiMail } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";

const initialNotifications = [
  { id: 1, title: "New Lead Assigned", message: "A new high-value lead has been assigned to you.", time: "10m ago", unread: true },
  { id: 2, title: "Deal Follow-up Reminder", message: "Follow up with client Sarah regarding the Q4 proposal.", time: "2h ago", unread: true },
  { id: 3, title: "Team Activity Update", message: "James closed a $15,000 deal with TechNova.", time: "1d ago", unread: false },
  { id: 4, title: "Invoice Overdue", message: "Invoice #3478 for Acme Corp is overdue by 7 days.", time: "3d ago", unread: false },
];

export default function CRMNotificationPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notifications
      .filter(n => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q))
      .sort((a, b) => b.unread - a.unread); // unread first
  }, [notifications, search]);

  const openNotification = (id) => {
    setSelectedId(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)));
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <DashboardLayout isFullHeight>
      <div className="flex h-full w-full bg-gray-50 text-gray-900 font-sans">

        {/* --- LEFT COLUMN --- */}
        <div className="flex-1 lg:w-[450px] flex flex-col border-r border-gray-200 bg-white shadow-lg">
          <div className="px-6 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiBell /> Notifications
              </h2>
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition"
              >
                <FiCheckCircle /> Mark all
              </button>
            </div>
            <p className="text-sm mt-1 opacity-80">Stay updated with latest alerts</p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3 mt-4 mx-4 bg-white/30 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm">
            <FiSearch className="text-gray-500" />
            <input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto mt-4 scrollbar-thin scrollbar-thumb-gray-300">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <FiMail size={64} className="opacity-20 mb-4" />
                <h3 className="text-lg font-bold">No notifications</h3>
                <p className="text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => openNotification(n.id)}
                  className={`group relative cursor-pointer p-5 m-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:bg-orange-50/20
                    ${selectedId === n.id ? "bg-orange-50/40 border-l-4 border-orange-500" : "border-l-4 border-transparent"}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <h4 className={`font-semibold ${n.unread ? "text-gray-900" : "text-gray-600"}`}>
                        {n.title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{n.message}</p>
                      <span className="text-xs text-gray-400">{n.time}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {n.unread && <span className="h-2 w-2 bg-orange-500 rounded-full mt-1" />}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="flex-1 flex flex-col h-full bg-white">
          {selectedId ? (
            <div className="flex-1 overflow-y-auto p-10">
              <h1 className="text-2xl font-bold mb-4">{notifications.find(n => n.id === selectedId)?.title}</h1>
              <p className="text-gray-700 leading-relaxed">{notifications.find(n => n.id === selectedId)?.message}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiBell size={80} className="opacity-20 mb-4" />
              <h2 className="text-2xl font-bold">Select a notification</h2>
              <p className="text-sm mt-2">Click on a notification to see details here.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
