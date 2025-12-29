import React, { useState } from "react";
import { FiBell, FiSearch } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";

const sampleNotifications = [
  {
    id: 1,
    title: "New Lead Assigned",
    message: "A new high-value lead has been assigned to you.",
    time: "10m ago",
  },
  {
    id: 2,
    title: "Deal Follow-up Reminder",
    message: "Follow up with client Sarah regarding the Q4 proposal.",
    time: "2h ago",
  },
  {
    id: 3,
    title: "Team Activity Update",
    message: "James closed a $15,000 deal with TechNova.",
    time: "1d ago",
  },
  {
    id: 4,
    title: "Invoice Overdue",
    message: "Invoice #3478 for Acme Corp is overdue by 7 days.",
    time: "3d ago",
  },
  {
    id: 5,
    title: "New Message Received",
    message: "You received a new message from client Rafael.",
    time: "4d ago",
  },
];

export default function CRMNotificationPage() {
  const [search, setSearch] = useState("");

  const filtered = sampleNotifications.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-black text-white p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <FiBell className="text-orange-400" /> Notifications
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#111] border border-gray-800 rounded-sm px-3 py-2 mb-5">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black w-full outline-none text-sm text-white placeholder-gray-500"
          />
        </div>

        {/* Notification List */}
        <div className="bg-[#111] border border-gray-800 rounded-sm overflow-hidden divide-y divide-gray-800">
          {filtered.length > 0 ? (
            filtered.map((n) => (
              <div
                key={n.id}
                className="p-4 hover:bg-[#1a1a1a] cursor-pointer transition"
              >
                <h3 className="font-semibold text-white">{n.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{n.message}</p>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-10 text-sm">
              No notifications found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
