import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  Award,
  Home,
  Plus,
  TrendingDown,
  PieChart as PieIcon,
  CreditCard,
  FileCheck,
  Zap,
  Flag,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
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
    leads: { total: 1250, new: 42, unread: 15, dropped: 240, trending: 85, conversionRate: 12.5, growth: 18 },
    pipeline: { totalValue: 85000000, activeDeals: 45, wonDeals: 120, lostDeals: 35, avgDealSize: 180000, growth: 15 },
    clients: { total: 450, active: 412, inactive: 38, newThisMonth: 15, growth: 8 },
    employees: { total: 950, active: 910, resigned: 12, onLeave: 28, present: 882 },
    channels: { meta: 450, justdial: 280, indiamart: 320, googleDocs: 150, crmForm: 45 },
    activities: { quotations: 85, invoices: 42, expenses: 125000, todos: 12, notes: 25 },
  };

  const recentLeads = dashboardData?.recentLeads?.length > 0 ? dashboardData.recentLeads : [
    { id: 1, name: "Arjun Sharma", email: "arjun@v-trans.in", phone: "+91 98765 43210", source: "Meta Ads", value: 125000, status: "New", date: "2 Hours ago" },
    { id: 2, name: "Priya Patel", email: "priya.p@gmail.com", phone: "+91 91234 56789", source: "JustDial", value: 45000, status: "Hot", date: "5 Hours ago" },
    { id: 3, name: "Logistics Pro", email: "info@logisticspro.com", phone: "+91 88776 65544", source: "Indiamart", value: 890000, status: "Ongoing", date: "1 Day ago" },
    { id: 4, name: "Karan Singh", email: "karan.s@vtrans.com", phone: "+91 77665 54433", source: "CRM Form", value: 75000, status: "New", date: "2 Days ago" },
  ];

  const pipelineStages = dashboardData?.pipelineStages?.length > 0 ? dashboardData.pipelineStages : [
    { name: "Prospecting", count: 12, value: 4500000 },
    { name: "Qualification", count: 8, value: 2800000 },
    { name: "Proposal", count: 5, value: 6500000 },
    { name: "Negotiation", count: 3, value: 4200000 },
    { name: "Closed Won", count: 15, value: 12500000 },
  ];

  const topPerformers = dashboardData?.topPerformers?.length > 0 ? dashboardData.topPerformers : [
    { name: "Vikram Mehta", department: "Sales North", sales: 4500000, leads: 42, growth: "+12.5%", avatar: "https://i.pravatar.cc/150?u=1" },
    { name: "Sneha Reddy", department: "Inside Sales", sales: 3850000, leads: 38, growth: "+8.2%", avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Rahul Deshpande", department: "Sales West", sales: 3200000, leads: 31, growth: "+5.1%", avatar: "https://i.pravatar.cc/150?u=3" },
  ];

  const upcomingBirthdays = dashboardData?.upcomingBirthdays?.length > 0 ? dashboardData.upcomingBirthdays : [
    { name: "Amit Trivedi", department: "Logistics", date: "Tomorrow", avatar: "https://i.pravatar.cc/150?u=10" },
    { name: "Anjali Gupta", department: "Customer Success", date: "08 Mar", avatar: "https://i.pravatar.cc/150?u=11" },
    { name: "Suresh P.", department: "Operations", date: "12 Mar", avatar: "https://i.pravatar.cc/150?u=12" },
    { name: "Meera Bai", department: "HR", date: "15 Mar", avatar: "https://i.pravatar.cc/150?u=13" },
  ];

  const channelDistribution = [
    { name: "Meta Ads", value: stats.channels.meta, color: "#3b82f6" },
    { name: "JustDial", value: stats.channels.justdial, color: "#f97316" },
    { name: "Indiamart", value: stats.channels.indiamart, color: "#10b981" },
    { name: "CRM Form", value: stats.channels.crmForm, color: "#8b5cf6" },
    { name: "Google Docs", value: stats.channels.googleDocs, color: "#64748b" },
  ];

  const COLORS = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#64748b"];

  const revenueGoal = dashboardData?.revenueGoal || {
    current: 12500000,
    target: 20000000,
    label: "Q1 Sales Target"
  };

  const recentDocuments = dashboardData?.recentDocuments?.length > 0 ? dashboardData.recentDocuments : [
    { id: "QUO-9821", type: "Quotation", client: "Tech Solutions", amount: 125000, date: "Today", status: "Sent" },
    { id: "INV-4412", type: "Invoice", client: "Mumbai Logistics", amount: 89000, date: "Yesterday", status: "Paid" },
    { id: "QUO-9755", type: "Quotation", client: "Green Energy Corp", amount: 450000, date: "2 Days ago", status: "Pending" },
  ];

  const upcomingTasks = dashboardData?.upcomingTasks?.length > 0 ? dashboardData.upcomingTasks : [
    { id: 1, title: "Follow up with Tech Solutions", time: "10:30 AM", urgent: true },
    { id: 2, title: "Review Q1 Financial Report", time: "02:00 PM", urgent: false },
    { id: 3, title: "Team Strategy Sync", time: "04:30 PM", urgent: false },
  ];


  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#F26422] animate-spin" />
            <p className="text-gray-500 animate-pulse font-medium">Loading Dashboard Statistics...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white font-primary">
          {/* Header */}
          <div className="bg-white sticky top-0 z-30">
            <div className="max-w-[100%] mx-auto px-6 py-4 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Title Section */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Main Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <Home className="text-gray-700" size={14} />
                    <span className="text-gray-400">CRM / </span>
                    <span className="text-[#FF7B1D] font-medium">Dashboard</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={refetch}
                    className="p-3 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 text-gray-700 transition-all shadow-sm active:scale-95"
                    title="Refresh Dashboard"
                  >
                    <RefreshCw size={18} className={isFetching ? "animate-spin" : ""} />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setOpenLeadMenu(!openLeadMenu)}
                      className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    >
                      <Plus size={20} />
                      Add New Lead
                    </button>

                    {/* Dropdown Menu */}
                    {openLeadMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-sm z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            setOpenLeadMenu(false);
                            handleAddLead();
                          }}
                          className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-gray-700 font-medium transition-colors"
                        >
                          <UserPlus size={18} className="text-orange-500" />
                          <span>Single Lead</span>
                        </button>

                        <button
                          onClick={() => {
                            setOpenLeadMenu(false);
                            handleBulkUpload();
                          }}
                          className="w-full flex items-center gap-3 text-left px-4 py-3 hover:bg-orange-50 text-gray-700 font-medium transition-colors border-t border-gray-50"
                        >
                          <Upload size={18} className="text-orange-500" />
                          <span>Bulk Upload</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[100%] mx-auto px-6 mt-4">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-sm shadow-xl p-8 mb-8 relative overflow-hidden border border-slate-700">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <img
                      src={user?.profile_picture || "https://i.pravatar.cc/100"}
                      alt="Profile"
                      className="relative w-24 h-24 rounded-full border-2 border-white/10 shadow-2xl object-cover"
                    />
                    <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-green-500 border-2 border-slate-800 rounded-full shadow-lg"></div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
                      Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{user?.firstName || user?.name || 'User'}</span>!
                    </h2>
                    <p className="text-slate-300 text-lg mt-2 font-medium flex items-center gap-2">
                      <Calendar size={18} className="text-orange-500" />
                      Today is {currentTime.toLocaleDateString("en-US", { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-5">
                      <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-sm text-slate-200 text-sm border border-white/10 shadow-sm transition-all hover:bg-white/10">
                        <span className="font-black text-orange-500 mr-1.5">{stats.leads.new}</span> New Leads Today
                      </div>
                      <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-sm text-slate-200 text-sm border border-white/10 shadow-sm transition-all hover:bg-white/10">
                        <span className="font-black text-orange-500 mr-1.5">{stats.leads.unread}</span> Unread Messages
                      </div>
                      <div className="bg-orange-500/10 backdrop-blur-md px-4 py-2 rounded-sm text-orange-400 text-sm border border-orange-500/20 shadow-sm transition-all hover:bg-orange-500/20">
                        <span className="font-black mr-1.5">{stats.leads.conversionRate}%</span> Conversion Rate
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Session Duration</p>
                    <p className="text-2xl font-black text-white">{String(workingHours.hours).padStart(2, "0")}:{String(workingHours.minutes).padStart(2, "0")}:{String(workingHours.seconds).padStart(2, "0")}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-sm border border-white/10 flex items-center justify-center text-orange-500 shadow-inner">
                    <Clock size={24} />
                  </div>
                </div>
              </div>
            </div>


            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Leads */}
              <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-blue-500 bg-blue-50/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                      <Users size={18} className="text-blue-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Total Leads</h3>
                  </div>
                  <span className="bg-white text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-blue-100 shadow-sm">
                    {stats.leads.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-sm border border-blue-50">NEW: {stats.leads.new}</span>
                    <span className="text-[10px] font-bold text-orange-600 bg-white px-2 py-0.5 rounded-sm border border-orange-50">UNREAD: {stats.leads.unread}</span>
                  </div>
                  {stats.leads.growth > 0 && (
                    <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                      <ArrowUp size={12} /> {stats.leads.growth}%
                    </div>
                  )}
                </div>
              </div>

              {/* Pipeline Value */}
              <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-green-500 bg-green-50/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                      <Target size={18} className="text-green-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Pipeline Value</h3>
                  </div>
                  <span className="bg-white text-green-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-green-100 shadow-sm">
                    {formatCurrency(stats.pipeline.totalValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-sm border border-blue-50">ACTIVE: {stats.pipeline.activeDeals}</span>
                    <span className="text-[10px] font-bold text-green-600 bg-white px-2 py-0.5 rounded-sm border border-green-50">WON: {stats.pipeline.wonDeals}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                    <ArrowUp size={12} /> {stats.pipeline.growth}%
                  </div>
                </div>
              </div>

              {/* Total Clients */}
              <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-orange-500 bg-orange-50/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                      <Briefcase size={18} className="text-orange-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Total Clients</h3>
                  </div>
                  <span className="bg-white text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-orange-100 shadow-sm">
                    {stats.clients.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-green-600 bg-white px-2 py-0.5 rounded-sm border border-green-50">ACTIVE: {stats.clients.active}</span>
                    <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-0.5 rounded-sm border border-gray-50">NEW: {stats.clients.newThisMonth}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                    <ArrowUp size={12} /> {stats.clients.growth}%
                  </div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-purple-500 bg-purple-50/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                      <TrendingUp size={18} className="text-purple-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Conversion Rate</h3>
                  </div>
                  <span className="bg-white text-purple-600 text-[11px] font-bold px-2 py-0.5 rounded-full border border-purple-100 shadow-sm">
                    {stats.leads.conversionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-gray-700 bg-white px-2 py-0.5 rounded-sm border border-gray-100">AVG DEAL: {formatCurrency(stats.pipeline.avgDealSize)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-[10px]">
                    <ArrowUp size={12} /> {stats.clients.growth}%
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats - Channel Integration & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
              {/* Attendance Card */}
              <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 leading-tight">My Attendance</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-36 h-36 rounded-full border-8 border-orange-50 flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Working Time</p>
                        <p className="text-2xl font-black text-gray-800">
                          {String(workingHours.hours).padStart(2, "0")}:{String(workingHours.minutes).padStart(2, "0")}:{String(workingHours.seconds).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isPunchedIn ? (
                    <button
                      onClick={handlePunchIn}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:from-green-600 hover:to-green-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Clock size={16} />
                      Punch In
                    </button>
                  ) : (
                    <button
                      onClick={handlePunchOut}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:from-red-600 hover:to-red-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Clock size={16} />
                      Punch Out
                    </button>
                  )}
                </div>
              </div>

              {/* Channel Integration */}
              <div className="bg-white rounded-sm border border-blue-50 shadow-lg p-6 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mr-4 shadow-md">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 leading-tight">Channels</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Leads by Source</p>
                  </div>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {Object.entries(stats.channels).map(([channel, count]) => (
                    <div key={channel} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-sm border border-slate-100 hover:border-blue-200 transition-colors">
                      <span className="text-xs font-bold text-gray-700 capitalize">{channel.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Overview */}
              <div className="bg-white rounded-sm border border-green-50 shadow-lg p-6 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 mr-4 shadow-md">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 leading-tight">Team Pulse</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Employee Stats</p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {[
                    { label: "Total", value: stats.employees.total, color: "bg-blue-500", labelColor: "text-blue-600" },
                    { label: "Present", value: stats.employees.present, color: "bg-green-500", labelColor: "text-green-600" },
                    { label: "Active", value: stats.employees.active, color: "bg-indigo-500", labelColor: "text-indigo-600" },
                    { label: "On Leave", value: stats.employees.onLeave, color: "bg-orange-500", labelColor: "text-orange-600" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-sm border border-slate-100">
                      <span className="text-xs font-bold text-gray-700">{item.label}</span>
                      <span className={`${item.labelColor} font-black text-sm`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-sm border border-pink-50 shadow-lg p-6 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 mr-4 shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 leading-tight">Activity</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Global Summary</p>
                  </div>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {[
                    { label: "Quotations", value: stats.activities.quotations, bg: "bg-blue-50", text: "text-blue-600" },
                    { label: "Invoices", value: stats.activities.invoices, bg: "bg-green-50", text: "text-green-600" },
                    { label: "Pending Todos", value: stats.activities.todos, bg: "bg-orange-50", text: "text-orange-600" },
                    { label: "Expenses", value: formatCurrency(stats.activities.expenses), bg: "bg-red-50", text: "text-red-600" }
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2.5 ${item.bg} rounded-sm border border-white shadow-sm`}>
                      <span className="text-xs font-bold text-gray-700">{item.label}</span>
                      <span className={`${item.text} font-black text-[11px]`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* Pipeline Stages */}
            <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 mr-4 shadow-md">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">Pipeline Progress</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Revenue at each stage</p>
                  </div>
                </div>
                <button className="text-orange-600 text-[11px] font-bold hover:bg-orange-50 px-4 py-2 border border-orange-200 rounded-sm shadow-sm transition-all uppercase tracking-widest">
                  Manage Pipeline
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {pipelineStages.length > 0 ? (
                  pipelineStages.map((stage, index) => (
                    <div
                      key={stage.name || index}
                      className="bg-slate-50 rounded-sm p-4 border border-slate-100 hover:border-orange-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">
                          {stage.name || 'Stage'}
                        </h4>
                        <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                          {stage.count || 0}
                        </span>
                      </div>
                      <p className="text-lg font-black text-gray-800 group-hover:text-orange-600 transition-colors">
                        {formatCurrency(stage.value)}
                      </p>
                      <div className="mt-3 w-full bg-white h-1.5 rounded-full overflow-hidden shadow-inner border border-gray-100">
                        <div
                          className="bg-orange-500 h-full rounded-full transition-all duration-1000"
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
                  <div className="col-span-5 text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm">
                    No pipeline stages available
                  </div>
                )}
              </div>
            </div>

            {/* NEW SECTION: Revenue Goal & Focus Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Revenue Goal Progress */}
              <div className="lg:col-span-1 bg-white rounded-sm border border-orange-100 shadow-lg p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Flag size={64} className="text-orange-600" />
                </div>
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 leading-tight">Revenue Goal</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Monthly sales target</p>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-black text-gray-800">{formatCurrency(revenueGoal.current)}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Target: {formatCurrency(revenueGoal.target)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner border border-gray-100">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000"
                      style={{ width: `${(revenueGoal.current / revenueGoal.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-black text-orange-600">{Math.round((revenueGoal.current / revenueGoal.target) * 100)}% COMPLETED</span>
                    <span className="text-[10px] font-bold text-gray-400">{formatCurrency(revenueGoal.target - revenueGoal.current)} REMAINING</span>
                  </div>
                </div>
              </div>

              {/* Day Agenda/Tasks */}
              <div className="lg:col-span-2 bg-slate-900 rounded-sm shadow-xl p-6 flex flex-col text-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-sm">
                      <CheckCircle2 size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Today's Focus</h2>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Your agenda</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border border-white/5 rounded-sm hover:bg-white/5 transition-all group backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-1.5 rounded-full ${task.urgent ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-slate-600'}`}></div>
                        <div>
                          <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{task.title}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{task.time}</p>
                        </div>
                      </div>
                      <button className="text-[9px] font-black uppercase text-orange-500 hover:text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-sm border border-orange-500/20 transition-all opacity-0 group-hover:opacity-100">
                        Mark Done
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NEW: Lead Distribution & Revenue Forecast */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1 bg-white rounded-sm border border-gray-100 shadow-lg p-6 flex flex-col">
                <div className="flex items-center mb-8">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 mr-4 shadow-md">
                    <PieIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 leading-tight">Lead Distribution</h2>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Leads by channel</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {channelDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-sm border border-gray-100 shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 mr-4 shadow-md">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 leading-tight">Recent Financial Activity</h2>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Quotations & Invoices</p>
                    </div>
                  </div>
                  <button className="text-purple-600 text-[11px] font-bold hover:bg-purple-50 px-4 py-2 border border-purple-200 rounded-sm shadow-sm transition-all uppercase tracking-widest">
                    Finance Hub
                  </button>
                </div>
                <div className="space-y-4">
                  {recentDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100 hover:border-purple-500 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-sm ${doc.type === 'Invoice' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                          <FileCheck size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{doc.id} • {doc.client}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{doc.type} • Created {doc.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-800 text-sm">{formatCurrency(doc.amount)}</p>
                        <span className={`px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-tighter shadow-sm ${doc.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Leads & Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Recent Leads */}
              <div className="lg:col-span-2 bg-white rounded-sm border border-gray-100 shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mr-4 shadow-md">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 leading-tight">Lead Activity</h2>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Latest opportunities</p>
                    </div>
                  </div>
                  <button className="text-blue-600 text-[11px] font-bold hover:bg-blue-50 px-4 py-2 border border-blue-200 rounded-sm shadow-sm transition-all flex items-center gap-2 uppercase tracking-widest">
                    <span>View All</span>
                    <Filter size={14} />
                  </button>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Details</th>
                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source</th>
                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Value</th>
                        <th className="pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentLeads.length > 0 ? (
                        recentLeads.map((lead, idx) => (
                          <tr key={lead.id || idx} className="group hover:bg-slate-50 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-slate-900 flex items-center justify-center text-white text-[10px] font-black">
                                  {lead.id?.toString().slice(-2) || 'LD'}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-800">{lead.name || 'Unknown'}</p>
                                  <p className="text-[10px] text-gray-400 font-medium">{lead.company || 'Private'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className="text-[10px] font-bold px-2 py-1 bg-white border border-gray-100 rounded-sm text-gray-600 shadow-sm uppercase tracking-tight">
                                {lead.source || 'N/A'}
                              </span>
                            </td>
                            <td className="py-4 text-sm font-black text-gray-800">
                              {formatCurrency(lead.value)}
                            </td>
                            <td className="py-4 text-right">
                              <span
                                className={`px-2 py-1 text-[9px] font-black rounded-[2px] shadow-sm uppercase tracking-tighter ${lead.status === "New" || lead.status === "Not Contacted"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : lead.status === "Hot"
                                    ? "bg-rose-50 text-rose-600 border border-rose-100"
                                    : "bg-blue-50 text-blue-600 border border-blue-100"
                                  }`}
                              >
                                {lead.status || 'Active'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs bg-slate-50 border-2 border-dashed border-slate-100 rounded-sm">
                            No recent activity
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-sm border border-orange-100 shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 leading-tight">Champions</h2>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Monthly highlights</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  {topPerformers.length > 0 ? (
                    topPerformers.map((performer, index) => (
                      <div
                        key={performer.name || index}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-sm border border-slate-100 hover:border-orange-500 hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                            {performer.name?.split(' ').map(n => n[0]).join('') || (index + 1)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">
                              {performer.name || 'Champion'}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {performer.deals || 0} DEALS WON
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-800 text-sm">
                            {formatCurrency(performer.revenue)}
                          </p>
                          <div className="flex items-center gap-1 justify-end mt-1 text-emerald-500 font-bold text-[9px]">
                            <TrendingUp size={10} />
                            <span className="uppercase">ELITE</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-xs bg-slate-50 border-2 border-dashed border-slate-100 rounded-sm">
                      Seeking champions
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Employee Birthday Card */}
            <div className="bg-white rounded-sm border border-pink-100 shadow-lg p-6 mb-8">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 mr-4 shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 leading-tight">Celebrations</h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Upcoming birthdays</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingBirthdays.length > 0 ? (
                  upcomingBirthdays.map((employee, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-sm border border-slate-100 hover:border-pink-500 hover:shadow-md transition-all group"
                    >
                      <img
                        src={employee.avatar || "https://i.pravatar.cc/100"}
                        alt={employee.name}
                        className="w-12 h-12 rounded-sm border-2 border-pink-200 object-cover shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {employee.name || 'Member'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase truncate">
                          {employee.department || 'Staff'}
                        </p>
                        <div className="mt-2 flex items-center">
                          <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded-sm font-black text-[9px] uppercase shadow-sm">
                            🎂 {employee.date || 'Soon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-xs bg-slate-50 border-2 border-dashed border-slate-100 rounded-sm">
                    No celebrations this month
                  </div>
                )}
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
    </>
  );
};

export default CRMDashboard;
