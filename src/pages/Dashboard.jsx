import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/DashboardLayout";
import AddLeadModal from "../components/AddNewLeads/AddNewLead";
import BulkUploadLeads from "../components/AddNewLeads/BulkUpload";
import {
  Users,
  UserPlus,
  Upload,
  TrendingUp,
  Target,
  Calendar,
  FileText,
  Clock,
  ArrowUp,
  Activity,
  Briefcase,
  UserCheck,
  Filter,
  Edit,
  Loader2,
  RefreshCw,
} from "lucide-react";
import NumberCard from "../components/NumberCard";
import { useGetMainDashboardStatsQuery } from "../store/api/mainDashboardApi";

const CRMDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: dashboardData, isLoading, isFetching, error, refetch } = useGetMainDashboardStatsQuery();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openLeadMenu, setOpenLeadMenu] = useState(false);
  const [showBulkUploadPopup, setShowBulkUploadPopup] = useState(false);

  // Attendance states
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workingHours, setWorkingHours] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleBulkUpload = () => {
    setShowBulkUploadPopup(true);
  };

  const handlePunchIn = () => {
    const now = new Date();
    setPunchInTime(now);
    setIsPunchedIn(true);
  };

  const handlePunchOut = () => {
    setIsPunchedIn(false);
    setPunchInTime(null);
    setWorkingHours({ hours: 0, minutes: 0, seconds: 0 });
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate working hours
  useEffect(() => {
    if (isPunchedIn && punchInTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - punchInTime) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setWorkingHours({ hours, minutes, seconds });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPunchedIn, punchInTime]);

  const handleAddLead = () => {
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
  };

  // Helper to format currency
  const formatCurrency = (value) => {
    const num = Number(value || 0);
    if (num === 0) return "₹0";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const rawStats = dashboardData?.stats;
  // Extract and parse data from API response or use defaults
  const stats = rawStats ? {
    leads: {
      total: Number(rawStats.leads?.total || 0),
      new: Number(rawStats.leads?.new || 0),
      unread: Number(rawStats.leads?.unread || 0),
      dropped: Number(rawStats.leads?.dropped || 0),
      trending: Number(rawStats.leads?.trending || 0),
      conversionRate: Number(rawStats.leads?.conversionRate || 0),
      growth: Number(rawStats.leads?.growth || 0),
    },
    pipeline: {
      totalValue: Number(rawStats.pipeline?.totalValue || 0),
      activeDeals: Number(rawStats.pipeline?.activeDeals || 0),
      wonDeals: Number(rawStats.pipeline?.wonDeals || 0),
      lostDeals: Number(rawStats.pipeline?.lostDeals || 0),
      avgDealSize: Number(rawStats.pipeline?.avgDealSize || 0),
      growth: Number(rawStats.pipeline?.growth || 0),
    },
    clients: {
      total: Number(rawStats.clients?.total || 0),
      active: Number(rawStats.clients?.active || 0),
      inactive: Number(rawStats.clients?.inactive || 0),
      newThisMonth: Number(rawStats.clients?.newThisMonth || 0),
      growth: Number(rawStats.clients?.growth || 0),
    },
    employees: {
      total: Number(rawStats.employees?.total || 0),
      active: Number(rawStats.employees?.active || 0),
      resigned: Number(rawStats.employees?.resigned || 0),
      onLeave: Number(rawStats.employees?.onLeave || 0),
      present: Number(rawStats.employees?.present || 0),
    },
    channels: rawStats.channels || { meta: 0, justdial: 0, indiamart: 0, googleDocs: 0, crmForm: 0 },
    activities: {
      quotations: Number(rawStats.activities?.quotations || 0),
      invoices: Number(rawStats.activities?.invoices || 0),
      expenses: Number(rawStats.activities?.expenses || 0),
      todos: Number(rawStats.activities?.todos || 0),
      notes: Number(rawStats.activities?.notes || 0),
    },
  } : {
    leads: { total: 0, new: 0, unread: 0, dropped: 0, trending: 0, conversionRate: 0, growth: 0 },
    pipeline: { totalValue: 0, activeDeals: 0, wonDeals: 0, lostDeals: 0, avgDealSize: 0, growth: 0 },
    clients: { total: 0, active: 0, inactive: 0, newThisMonth: 0, growth: 0 },
    employees: { total: 0, active: 0, resigned: 0, onLeave: 0, present: 0 },
    channels: { meta: 0, justdial: 0, indiamart: 0, googleDocs: 0, crmForm: 0 },
    activities: { quotations: 0, invoices: 0, expenses: 0, todos: 0, notes: 0 },
  };

  const recentLeads = dashboardData?.recentLeads || [];
  const pipelineStages = dashboardData?.pipelineStages || [];
  const topPerformers = dashboardData?.topPerformers || [];
  const upcomingBirthdays = dashboardData?.upcomingBirthdays || [];

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#F26422] animate-spin" />
            <p className="text-gray-500 animate-pulse font-medium">Loading Dashboard Statistics...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50/30">
          <div className="max-w-[100%] mx-auto p-4 md:p-6 ml-0 md:ml-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-[#3B7080] to-[#2f5a67] rounded-lg shadow-lg p-6 mb-8 relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F26422]/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      src={user?.profile_picture || "https://i.pravatar.cc/100"}
                      alt="Profile"
                      className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl object-cover"
                    />
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                      Welcome Back, {user?.firstName || user?.name || 'User'}!
                    </h2>
                    <p className="text-white/80 text-lg mt-1 font-medium italic">
                      Today is {currentTime.toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm border border-white/10">
                        <span className="font-bold text-[#F26422]">{stats.leads.new}</span> New Leads
                      </span>
                      <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm border border-white/10">
                        <span className="font-bold text-[#F26422]">{stats.leads.unread}</span> Unread
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 relative">
                  <button
                    onClick={refetch}
                    className="bg-white/10 backdrop-blur-md text-white p-3 rounded-lg hover:bg-white/20 transition-all shadow-xl border border-white/10 flex items-center justify-center"
                    title="Refresh Dashboard"
                  >
                    <RefreshCw size={20} className={isFetching ? "animate-spin" : ""} />
                  </button>

                  <button
                    onClick={() => setOpenLeadMenu(!openLeadMenu)}
                    className="bg-[#F26422] text-white px-8 py-3 rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-[#d95a1f] transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                    <UserPlus size={20} /> Add New Lead
                  </button>

                  {/* Dropdown Menu */}
                  {openLeadMenu && (
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white border shadow-md rounded-sm z-50">
                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          handleAddLead();
                        }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <UserPlus size={16} />
                        Single Lead
                      </button>

                      <button
                        onClick={() => {
                          setOpenLeadMenu(false);
                          handleBulkUpload();
                        }}
                        className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100"
                      >
                        <Upload size={16} />
                        Bulk Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <NumberCard
                title="Total Leads"
                number={stats.leads.total.toLocaleString()}
                up={stats.leads.growth > 0 ? `${stats.leads.growth}%` : ""}
                icon={<Users className="text-blue-600" size={24} />}
                iconBgColor="bg-blue-100"
                lineBorderClass="border-blue-500"
              >
                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  New: {stats.leads.new}
                </span>
                <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">
                  Unread: {stats.leads.unread}
                </span>
              </NumberCard>

              <NumberCard
                title="Pipeline Value"
                number={formatCurrency(stats.pipeline.totalValue)}
                up={`${stats.pipeline.growth}%`}
                icon={<Target className="text-green-600" size={24} />}
                iconBgColor="bg-green-100"
                lineBorderClass="border-green-500"
              >
                <span className="text-blue-600 font-medium">
                  Active: {stats.pipeline.activeDeals}
                </span>
                <span className="text-green-600 font-medium">
                  Won: {stats.pipeline.wonDeals}
                </span>
              </NumberCard>

              <NumberCard
                title="Total Clients"
                number={stats.clients.total}
                up={`${stats.clients.growth}%`}
                icon={<Briefcase className="text-orange-600" size={24} />}
                iconBgColor="bg-orange-100"
                lineBorderClass="border-orange-500"
              >
                <span className="text-green-600 font-medium">
                  Active: {stats.clients.active}
                </span>
                <span className="text-gray-500 font-medium">
                  New: {stats.clients.newThisMonth}
                </span>
              </NumberCard>

              <NumberCard
                title="Conversion Rate"
                number={`${stats.leads.conversionRate}%`}
                up={`${stats.clients.growth}%`}
                icon={<TrendingUp className="text-purple-600" size={24} />}
                iconBgColor="bg-purple-100"
                lineBorderClass="border-purple-500"
              >
                <span className="text-green-600 font-medium">
                  Avg Deal: {formatCurrency(stats.pipeline.avgDealSize)}
                </span>
              </NumberCard>
            </div>

            {/* Secondary Stats - Channel Integration & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {/* Attendance Punch In/Out Card */}
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg shadow-md p-5 border-2 border-orange-200 hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  <h3 className="text-gray-600 text-sm font-semibold mb-1">
                    Attendance
                  </h3>
                  <p className="text-lg font-bold text-gray-800">
                    {currentTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentTime.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Total Hours Circle */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col items-center justify-center shadow-inner border-4 border-white">
                      <p className="text-xs text-gray-500 mb-1">
                        Total Hours
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {String(workingHours.hours).padStart(2, "0")}:
                        {String(workingHours.minutes).padStart(2, "0")}:
                        {String(workingHours.seconds).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Production Time Badge */}
                {isPunchedIn && (
                  <div className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full text-center mb-3 shadow-sm">
                    Production: {workingHours.hours}.
                    {String(
                      Math.floor((workingHours.minutes * 100) / 60)
                    ).padStart(2, "0")}{" "}
                    hrs
                  </div>
                )}

                {/* Punch In Time */}
                {isPunchedIn && punchInTime && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                    <Clock size={16} className="text-[#F26422]" />
                    <span className="font-medium">
                      Punch In at{" "}
                      {punchInTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                )}

                {/* Punch Button */}
                {!isPunchedIn ? (
                  <button
                    onClick={handlePunchIn}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold text-sm hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Clock size={18} />
                    Punch In
                  </button>
                ) : (
                  <button
                    onClick={handlePunchOut}
                    className="w-full bg-gradient-to-r from-[#F26422] to-[#d95a1f] text-white py-3 rounded-lg font-bold text-sm hover:from-[#d95a1f] hover:to-[#c04e1a] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Clock size={18} />
                    Punch Out
                  </button>
                )}
              </div>

              {/* Channel Integration */}
              <div className="bg-white rounded-lg shadow-md p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Activity className="text-indigo-600" size={20} />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg">
                    Channel Performance
                  </h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.channels).map(([channel, count]) => (
                    <div
                      key={channel}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {channel === "meta"
                          ? "Meta"
                          : channel === "justdial"
                            ? "Justdial"
                            : channel === "indiamart"
                              ? "Indiamart"
                              : channel === "googleDocs"
                                ? "Google Docs"
                                : "CRM Form"}
                      </span>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee Stats */}
              <div className="bg-white rounded-sm shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <UserCheck className="text-emerald-600" size={20} />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg">
                    Team Overview
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">
                      Total Employees
                    </span>
                    <span className="font-bold text-gray-800">
                      {stats.employees.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-600">
                      Present Today
                    </span>
                    <span className="font-bold text-green-600">
                      {stats.employees.present}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span className="text-sm text-gray-600">On Leave</span>
                    <span className="font-bold text-orange-600">
                      {stats.employees.onLeave}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="font-bold text-blue-600">
                      {stats.employees.active}
                    </span>
                  </div>
                </div>
              </div>

              {/* Activities Summary */}
              <div className="bg-white rounded-sm shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <FileText className="text-pink-600" size={20} />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg">
                    Recent Activities
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Quotations</span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
                      {stats.activities.quotations}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Invoices</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                      {stats.activities.invoices}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">
                      Pending To-Do
                    </span>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold text-sm">
                      {stats.activities.todos}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">
                      Total Expenses
                    </span>
                    <span className="font-bold text-gray-800">
                      {formatCurrency(stats.activities.expenses)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Stages */}
            <div className="bg-white rounded-sm shadow-sm p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Pipeline Stages
                </h3>
                <button className="text-[#F26422] text-sm font-semibold hover:underline">
                  Manage Pipeline
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {pipelineStages.length > 0 ? (
                  pipelineStages.map((stage, index) => (
                    <div
                      key={stage.name || index}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-sm p-4 border-2 border-gray-200 hover:border-[#F26422] transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-700 text-sm">
                          {stage.name || 'Unknown'}
                        </h4>
                        <span className="bg-[#F26422] text-white text-xs font-bold px-2 py-1 rounded-full">
                          {stage.count || 0}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800">
                        {formatCurrency(stage.value)}
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#F26422] h-2 rounded-full"
                          style={{
                            width: `${stats.leads.total > 0
                              ? Math.min(((stage.count || 0) / stats.leads.total) * 100, 100)
                              : 0
                              }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-5 text-center py-8 text-gray-500">
                    No pipeline stages available
                  </div>
                )}
              </div>
            </div>

            {/* Recent Leads & Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Recent Leads */}
              <div className="bg-white rounded-sm shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Recent Leads
                  </h3>
                  <button className="text-[#F26422] text-sm font-semibold hover:underline flex items-center gap-1">
                    View All <Filter size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Lead ID
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Source
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Value
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentLeads.length > 0 ? (
                        recentLeads.map((lead, idx) => (
                          <tr key={lead.id || idx} className="hover:bg-gray-50">
                            <td className="px-3 py-3 text-sm font-medium text-[#F26422]">
                              {lead.id || 'N/A'}
                            </td>
                            <td className="px-3 py-3">
                              <div className="text-sm font-semibold text-gray-800">
                                {lead.name || 'Unknown'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {lead.company || 'N/A'}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                {lead.source || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm font-bold text-gray-800">
                              {formatCurrency(lead.value)}
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`px-2 py-1 text-xs font-bold rounded-full ${lead.status === "New" || lead.status === "Not Contacted"
                                  ? "bg-green-100 text-green-700"
                                  : lead.status === "Trending" || lead.status === "Hot"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-orange-100 text-orange-700"
                                  }`}
                              >
                                {lead.status || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-3 py-8 text-center text-gray-500">
                            No recent leads available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-sm shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Top Performers
                  </h3>
                  <button className="text-[#F26422] text-sm font-semibold hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {topPerformers.length > 0 ? (
                    topPerformers.map((performer, index) => (
                      <div
                        key={performer.name || index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-sm border border-gray-200 hover:border-[#F26422] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-[#F26422] to-[#d95a1f] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {performer.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {performer.leads || 0} leads • {performer.deals || 0} deals
                              closed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            {formatCurrency(performer.revenue)}
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <TrendingUp size={14} className="text-green-600" />
                            <span className="text-xs font-semibold text-green-600">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No top performers yet
                    </div>
                  )}
                </div>
              </div>

              {/* Employee Birthday Card */}
              <div className="bg-white rounded-sm shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <Calendar className="text-pink-600" size={20} />
                  </div>
                  <h3 className="text-gray-800 font-bold text-lg">
                    Upcoming Birthdays
                  </h3>
                </div>
                <div className="space-y-3">
                  {upcomingBirthdays.length > 0 ? (
                    upcomingBirthdays.map((employee, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-white rounded-sm border border-pink-100 hover:border-pink-300 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar || "https://i.pravatar.cc/100"}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full border-2 border-pink-200 object-cover"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {employee.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {employee.department || 'Staff'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold text-xs">
                            🎂 {employee.date || 'Soon'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No birthdays this month
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Component - Fixed */}
            {isPopupOpen && (
              <AddLeadModal isOpen={isPopupOpen} onClose={handleCloseModal} />
            )}

            {showBulkUploadPopup && (
              <BulkUploadLeads onClose={() => setShowBulkUploadPopup(false)} />
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CRMDashboard;
