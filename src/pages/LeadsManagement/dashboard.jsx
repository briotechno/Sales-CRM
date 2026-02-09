import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  UserPlus,
  UserCheck,
  Mail,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Clock,
  ArrowUp,
  ArrowDown,
  Menu,
  Home,
  Server,
  Loader2,
  Phone,
  Trash2,
  Filter,
  Upload,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";
import BulkUploadLeads from "../../components/AddNewLeads/BulkUpload";

const leadCategories = [
  { name: "All Leads", path: "/crm/leads/all", icon: <Users size={16} /> },
  { name: "New Leads", path: "/crm/leads/new", icon: <UserPlus size={16} /> },
  { name: "Not Connected", path: "/crm/leads/not-connected", icon: <Server size={16} /> },
  { name: "Follow Up", path: "/crm/leads/follow-up", icon: <Loader2 size={16} /> },
  { name: "Missed", path: "/crm/leads/missed", icon: <Phone size={16} /> },
  { name: "Assigned", path: "/crm/leads/assigned", icon: <UserPlus size={16} /> },
  { name: "Dropped", path: "/crm/leads/dropped", icon: <Trash2 size={16} /> },
  { name: "Duplicates", path: "/crm/leads/duplicates", icon: <Trash2 size={16} /> },
  { name: "Trending", path: "/crm/leads/trending", icon: <Users size={16} /> },
  { name: "Won", path: "/crm/leads/won", icon: <UserPlus size={16} /> },
  { name: "Analysis", path: "/crm/leads/analysis", icon: <Server size={16} /> },
];

export default function LeadDashboard() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openLeadMenu, setOpenLeadMenu] = useState(false);
  const [showBulkUploadPopup, setShowBulkUploadPopup] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentLeads = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      company: "Tech Corp",
      status: "New",
      priority: "High",
      time: "5 min ago",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      email: "mchen@example.com",
      company: "Digital Solutions",
      status: "Assigned",
      priority: "Medium",
      time: "23 min ago",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      company: "Innovation Labs",
      status: "New",
      priority: "High",
      time: "1 hour ago",
      avatar: "ER",
    },
    {
      name: "David Kim",
      email: "dkim@example.com",
      company: "Smart Systems",
      status: "Unread",
      priority: "Low",
      time: "2 hours ago",
      avatar: "DK",
    },
    {
      name: "Lisa Anderson",
      email: "l.anderson@example.com",
      company: "Future Tech",
      status: "Assigned",
      priority: "Medium",
      time: "3 hours ago",
      avatar: "LA",
    },
    {
      name: "James Wilson",
      email: "jwilson@example.com",
      company: "CloudNet",
      status: "New",
      priority: "High",
      time: "4 hours ago",
      avatar: "JW",
    },
  ];

  const trendingData = [
    { category: "Technology", count: 245, percentage: 98, trend: "up" },
    { category: "Healthcare", count: 189, percentage: 76, trend: "up" },
    { category: "Finance", count: 156, percentage: 62, trend: "down" },
    { category: "Retail", count: 134, percentage: 54, trend: "up" },
    { category: "Manufacturing", count: 98, percentage: 39, trend: "down" },
  ];

  const weeklyData = [
    { day: "Mon", value: 65, leads: 185 },
    { day: "Tue", value: 85, leads: 242 },
    { day: "Wed", value: 45, leads: 128 },
    { day: "Thu", value: 90, leads: 256 },
    { day: "Fri", value: 70, leads: 199 },
    { day: "Sat", value: 55, leads: 156 },
    { day: "Sun", value: 80, leads: 228 },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize">Leads Management</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Home className="text-gray-700" size={14} />
                  <span className="text-gray-400">CRM / </span>
                  <span className="text-[#FF7B1D] font-medium">
                    Dashboard
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter - Icon Only */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 border rounded-sm transition-all shadow-sm ${isFilterOpen
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500"
                      : "bg-white border-gray-200 text-gray-400 hover:bg-gray-50"
                      }`}
                    title="Filters"
                  >
                    <Filter size={18} className={isFilterOpen ? "text-white" : "text-orange-500"} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-[480px] bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-800 capitalize">Navigation Options</span>
                      </div>

                      {/* Content - Scrollable */}
                      <div className="max-h-[75vh] overflow-y-auto p-5">
                        <div className="space-y-6">
                          {/* Navigation Section */}
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-3 border-b pb-1">Lead Categories</span>
                            <div className="grid grid-cols-2 gap-2">
                              {leadCategories.map((cat) => (
                                <button
                                  key={cat.path}
                                  onClick={() => navigate(cat.path)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all text-left ${window.location.pathname === cat.path
                                    ? "bg-orange-50 text-[#FF7B1D] font-bold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                  <span className={window.location.pathname === cat.path ? "text-[#FF7B1D]" : "text-gray-400"}>
                                    {cat.icon}
                                  </span>
                                  {cat.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-4 bg-gray-50 border-t flex gap-3">
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenLeadMenu(!openLeadMenu)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm font-semibold transition shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 capitalize"
                  >
                    <UserPlus size={20} />
                    Add Lead
                  </button>

                  {openLeadMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-sm z-50 overflow-hidden divide-y divide-gray-100">
                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          navigate("/crm/leads/all"); // Or show a popup
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-sm font-semibold text-gray-700 hover:text-orange-600 transition capitalize"
                      >
                        <UserPlus size={16} />
                        Add Single Lead
                      </button>

                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          setShowBulkUploadPopup(true);
                        }}
                        className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-sm font-semibold text-gray-700 hover:text-orange-600 transition capitalize"
                      >
                        <Upload size={16} />
                        Bulk Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            <NumberCard
              title="All Leads"
              number={"2,847"}
              up={"+12.5%"}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="New Leads"
              number={"342"}
              up={"+23.1%"}
              icon={<UserPlus className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Assigned"
              number={"1,524"}
              up={"+8.2%"}
              icon={<UserCheck className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Unread Leads"
              number={"89"}
              down={"-5.3%"}
              icon={<Mail className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Leads - 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-lg p-6 border border-orange-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Recent Leads
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Latest incoming opportunities
                  </p>
                </div>
                <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentLeads.map((lead, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg hover:shadow-md transition-shadow duration-200 border border-orange-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                        {lead.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-base">
                          {lead.name}
                        </h4>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        <p className="text-xs text-orange-600 mt-0.5 font-medium">
                          {lead.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${lead.priority === "High"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : lead.priority === "Medium"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                      >
                        {lead.priority}
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                        {lead.status}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {lead.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Categories - 1 column */}
            <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Trending
                  </h2>
                  <p className="text-gray-500 text-sm">Top categories</p>
                </div>
              </div>
              <div className="space-y-4">
                {trendingData.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-800 text-base">
                        {item.category}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-orange-600">
                          {item.count}
                        </span>
                        {item.trend === "up" ? (
                          <div className="p-1.5 bg-green-50 rounded-lg border border-green-200">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-red-50 rounded-lg border border-red-200">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex-1 bg-orange-100 rounded-full h-3 border border-orange-200">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="bg-white rounded-sm shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-md">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                    Weekly Analytics
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Lead performance overview
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
                  <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-500 to-orange-600"></div>
                  <span className="text-sm font-semibold text-orange-700">
                    Leads Generated
                  </span>
                </div>
              </div>
            </div>

            {/* Chart - Simple Bar Graph */}
            <div className="bg-gradient-to-b from-orange-50 to-amber-50 rounded-lg p-8 border border-orange-200">
              <div className="space-y-6">
                {weeklyData.map((data, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-800 w-16">
                        {data.day}
                      </span>
                      <span className="text-xs font-semibold text-orange-600">
                        {data.leads} leads
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-orange-100 rounded-lg h-10 border border-orange-200">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-10 rounded-lg transition-all duration-500 flex items-center px-4 hover:from-orange-600 hover:to-orange-700"
                          style={{ width: `${(data.leads / 300) * 100}%` }}
                        >
                          <span className="text-white font-bold text-sm">
                            {data.leads}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {showBulkUploadPopup && <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />}
      </div>
    </DashboardLayout>
  );
}
