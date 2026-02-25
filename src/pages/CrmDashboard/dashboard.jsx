import React from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Award,
  Briefcase,
  Share2,
  UserCheck,
  Clock,
  AlertCircle,
  Activity,
  FileText,
  Home,
  Plus,
  Zap,
  UserPlus,
  PhoneIncoming,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  LineChart,
  Line,
} from "recharts";
import { useGetCRMStatsQuery } from "../../store/api/crmDashboardApi";
import { Loader2, RefreshCw } from "lucide-react";

export default function CRMDashboard() {
  const { data: stats, isLoading, isFetching, refetch } = useGetCRMStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  const mockRevenueData = [
    { month: "Sep 2024", revenue: 420000 },
    { month: "Oct 2024", revenue: 580000 },
    { month: "Nov 2024", revenue: 510000 },
    { month: "Dec 2024", revenue: 850000 },
    { month: "Jan 2025", revenue: 720000 },
    { month: "Feb 2025", revenue: 980000 },
  ];

  const mockChampions = [
    { name: "Sumanth Reddy", revenue: "₹24.5L", avatar: "SR", badge: "Diamond" },
    { name: "Ananya Sharma", revenue: "₹18.2L", avatar: "AS", badge: "Gold" },
    { name: "Vikram Malhotra", revenue: "₹15.8L", avatar: "VM", badge: "Silver" },
    { name: "Riya Kapoor", revenue: "₹12.4L", avatar: "RK", badge: "Bronze" },
  ];

  const mockPriorityTasks = [
    { task: "High-Priority Client Presentation", dueTime: "10:30 AM", priority: "High" },
    { task: "Follow-up with Lead #8292 (Rahul S.)", dueTime: "11:45 AM", priority: "High" },
    { task: "Internal Sales Pipeline Review", dueTime: "02:00 PM", priority: "Medium" },
    { task: "Approve New Quotation Requests", dueTime: "04:15 PM", priority: "High" },
    { task: "Schedule Training for New Interns", dueTime: "05:30 PM", priority: "Low" },
  ];

  const recentLeads = stats?.recentLeads || [];
  const champions = stats?.champions?.length > 0 ? stats.champions : mockChampions;
  const upcomingTasks = stats?.upcomingTasks?.length > 0 ? stats.upcomingTasks : mockPriorityTasks;
  const pipelineData = stats?.pipelineData || [];
  const revenueData = stats?.revenueTrend?.length > 0 ? stats.revenueTrend : mockRevenueData;
  const summary = stats?.summary || { totalQuotations: 0, conversions: 0, revenue: 0, champions: 0 };

  const COLORS = ["#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412"];

  const formatCurrency = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const efficiencyMetrics = [
    { label: "Avg. Response Time", value: "11.5m", icon: <Clock size={18} className="text-blue-500" />, colorClass: "border-t-blue-500 bg-blue-50/50" },
    { label: "Follow-up Success", value: "72%", icon: <UserCheck size={18} className="text-purple-500" />, colorClass: "border-t-purple-500 bg-purple-50/50" },
    { label: "Sales Velocity", value: "₹4.8L/day", icon: <TrendingUp size={18} className="text-yellow-500" />, colorClass: "border-t-yellow-500 bg-yellow-50/50" },
    { label: "Marketing ROI", value: "5.2x", icon: <DollarSign size={18} className="text-orange-500" />, colorClass: "border-t-orange-500 bg-orange-50/50" },
  ];

  const funnelData = [
    { name: "Total Leads", value: 1000, deals: 1000, fill: "#94a3b8" },
    { name: "Contacted", value: 750, deals: 750, fill: "#60a5fa" },
    { name: "Qualified", value: 450, deals: 450, fill: "#facc15" },
    { name: "Proposal", value: 200, deals: 200, fill: "#fb923c" },
    { name: "Won", value: 85, deals: 85, fill: "#22c55e" },
  ];

  const agingStats = [
    { label: "Leads Stagnant (3+ Days)", count: 34, status: "Warning" },
    { label: "Leads Stagnant (7+ Days)", count: 12, status: "Critical" },
    { label: "Overdue Follow-ups", count: 18, status: "Alert" },
  ];

  const winLossData = [
    { month: "Sep", won: 45, lost: 12 },
    { month: "Oct", won: 52, lost: 15 },
    { month: "Nov", won: 48, lost: 18 },
    { month: "Dec", won: 61, lost: 10 },
    { month: "Jan", won: 55, lost: 14 },
    { month: "Feb", won: 72, lost: 11 },
  ];

  const regionSales = [
    { area: "North India", value: 45, color: "#fb923c" },
    { area: "West India", value: 25, color: "#60a5fa" },
    { area: "South India", value: 20, color: "#a855f7" },
    { area: "East India", value: 10, color: "#94a3b8" },
  ];

  const workloadData = [
    { name: "Rahul Sharma", leads: 45, capacity: 85, color: "orange" },
    { name: "Priya Kapoor", leads: 32, capacity: 60, color: "blue" },
    { name: "Amit Verma", leads: 58, capacity: 95, color: "red" },
    { name: "Sana Malik", leads: 22, capacity: 40, color: "green" },
  ];

  const forecastData = [
    { name: "Actual Sales", value: 850000 },
    { name: "Target Forecast", value: 1200000 },
  ];

  const mockDropData = [
    { name: "Budget Issue", value: 35, fill: "#f97316" },
    { name: "No Response", value: 25, fill: "#60a5fa" },
    { name: "Competitor Chosen", value: 20, fill: "#a855f7" },
    { name: "Not Interested", value: 15, fill: "#f43f5e" },
    { name: "Duplicate", value: 5, fill: "#94a3b8" },
  ];

  const mockActivityFeed = [
    { id: 1, user: "Rahul Sharma", action: "moved", target: "Lead #123", to: "Proposal", time: "2m ago", avatar: "RS" },
    { id: 2, user: "Priya Kapoor", action: "added", target: "follow-up", to: "Lead #456", time: "5m ago", avatar: "PK" },
    { id: 3, user: "Amit Verma", action: "converted", target: "a client", to: "Zudio Retail", time: "12m ago", avatar: "AV" },
    { id: 4, user: "Sana Malik", action: "rescheduled", target: "meeting", to: "Arun Sol.", time: "25m ago", avatar: "SM" },
    { id: 5, user: "Vikram M.", action: "won", target: "contract", to: "₹4.5L deal", time: "45m ago", avatar: "VM" },
    { id: 6, user: "Ananya S.", action: "assigned", target: "new lead", to: "Global Tech", time: "1h ago", avatar: "AS" },
  ];

  const mockRevenueForecast = [
    { month: "Mar", expected: 1200000, weighted: 950000, bestCase: 1500000 },
    { month: "Apr", expected: 1500000, weighted: 1100000, bestCase: 1900000 },
    { month: "May", expected: 1800000, weighted: 1400000, bestCase: 2200000 },
    { month: "Jun", expected: 2100000, weighted: 1650000, bestCase: 2600000 },
  ];

  return (
    <div className="min-h-screen bg-white font-primary">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30">
        <div className="max-w-8xl mx-auto px-6 py-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Title Section */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                CRM Dashboard
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

              <button className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700">
                <Plus size={20} />
                Add New Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-9xl mx-auto px-4 mt-2 flex flex-col xl:flex-row gap-3">

        {/* Main Content Area */}
        <div className="flex-1 space-y-4">

          {/* Row 1: KPI Matrices with Workstation Header Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Quotations */}
            <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-blue-500 bg-blue-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <UserPlus size={18} className="text-blue-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Total Quotations</h3>
                </div>
                <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                  {summary.totalQuotations.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Conversions */}
            <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-purple-500 bg-purple-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <PhoneIncoming size={18} className="text-purple-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Conversions</h3>
                </div>
                <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                  {summary.conversions.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-yellow-500 bg-yellow-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <Clock size={18} className="text-yellow-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Total Revenue</h3>
                </div>
                <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                  {formatCurrency(summary.revenue)}
                </span>
              </div>
            </div>

            {/* Top Performers */}
            <div className="rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 border-t-orange-500 bg-orange-50/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                    <TrendingUp size={18} className="text-orange-500" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">Top Performers</h3>
                </div>
                <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                  {summary.champions.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Efficiency Metrics with Workstation Header Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {efficiencyMetrics.map((metric, idx) => (
              <div key={idx} className={`rounded-sm shadow-sm border border-gray-200 p-4 border-t-4 ${metric.colorClass} transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-sm bg-white border border-gray-100 shadow-sm">
                      {metric.icon}
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 capitalize tracking-tight font-primary">{metric.label}</h3>
                  </div>
                  <span className="bg-white text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                    {metric.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Visual Analytics Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue Trend Analytics */}
            <div className="lg:col-span-2 bg-white rounded-sm border border-orange-100 shadow-lg overflow-hidden flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Monthly Revenue Trend</h2>
                    <p className="text-gray-500 text-sm font-medium">Performance overview for the last 6 months</p>
                  </div>
                </div>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-sm">
                  <button className="px-4 py-1.5 text-xs font-bold bg-white text-orange-600 shadow-sm rounded-sm transition-all">6m View</button>
                  <button className="px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-all">1y View</button>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 13, fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                      itemStyle={{ fontWeight: 700, color: '#f97316' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales Conversion Funnel */}
            <div className="bg-white rounded-sm border border-orange-100 shadow-lg overflow-hidden flex flex-col p-6">
              <div className="flex items-center mb-10">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mr-4 shadow-md">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Conversion Pipeline</h2>
                  <p className="text-gray-500 text-sm font-medium">Lead progression tracking</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-6">
                  {funnelData.map((stage, i) => (
                    <div key={i} className="relative group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700 capitalize">{stage.name}</span>
                        <span className="text-sm font-bold text-gray-900">{stage.value}</span>
                      </div>
                      <div className="w-full bg-slate-50 h-8 rounded-sm overflow-hidden border border-gray-100 p-0.5 relative shadow-inner">
                        <div
                          className="h-full rounded-[1px] transition-all duration-1000 group-hover:opacity-90 shadow-sm"
                          style={{ width: `${(stage.value / funnelData[0].value) * 100}%`, backgroundColor: stage.fill }}
                        ></div>
                      </div>
                      {i < funnelData.length - 1 && (
                        <div className="flex justify-center -my-1 absolute left-1/2 -translate-x-1/2 z-10 w-full top-full mt-2">
                          <div className="bg-white p-1 rounded-full border border-gray-100 shadow-sm">
                            <ChevronRight size={14} className="text-gray-300 rotate-90" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Intelligence Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Stagnation Alerts */}
            <div className="bg-white rounded-sm border border-red-50 shadow-lg flex flex-col p-6">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 mr-4 shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Critical Attention</h2>
                  <p className="text-gray-500 text-sm font-medium">Immediate action items</p>
                </div>
              </div>
              <div className="space-y-4">
                {agingStats.map((item, id) => (
                  <div key={id} className={`p-5 rounded-sm border-l-4 ${item.status === 'Critical' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'} flex items-center justify-between group cursor-pointer hover:shadow-md transition-all`}>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${item.status === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{item.count} Leads</p>
                    </div>
                    <ChevronRight size={24} className="text-gray-300 group-hover:text-orange-500 transition-all" />
                  </div>
                ))}
                <div className="pt-6 mt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-600 capitalize">Daily Conversion Performance</p>
                    <span className="text-orange-600 font-bold text-sm">64% Achieved</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full w-[64%] shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Win/Loss Strategy */}
            <div className="bg-white rounded-sm border border-purple-50 shadow-lg flex flex-col p-6">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 mr-4 shadow-md">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Deal Success</h2>
                  <p className="text-gray-500 text-sm font-medium">Won vs Lost deal ratio</p>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={winLossData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }} />
                    <Tooltip
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    />
                    <Bar dataKey="won" fill="#22c55e" radius={[2, 2, 0, 0]} barSize={14} />
                    <Bar dataKey="lost" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-5 flex items-center justify-center gap-10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-[2px] shadow-sm"></div>
                    <span className="text-xs font-bold text-gray-600 capitalize">Won Deals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-[2px] shadow-sm"></div>
                    <span className="text-xs font-bold text-gray-600 capitalize">Lost Deals</span>
                  </div>
                </div>
                <div className="mt-8 p-5 bg-slate-900 rounded-sm flex items-center justify-between shadow-xl">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">Customer Satisfaction</p>
                    <p className="text-3xl font-bold text-white tracking-tight">4.8 <span className="text-sm font-medium text-gray-500">/ 5.0</span></p>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                    <Award size={24} className="text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Territory Split */}
            <div className="bg-white rounded-sm border border-blue-50 shadow-lg flex flex-col p-6">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 mr-4 shadow-md">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Territory Distribution</h2>
                  <p className="text-gray-500 text-sm font-medium">Sales split by territory</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="h-44 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={regionSales} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
                        {regionSales.map((entry, index) => <Cell key={`rcell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">SHARE</p>
                    <p className="text-xl font-bold text-gray-900">100%</p>
                  </div>
                </div>
                <div className="w-full mt-6 grid grid-cols-2 gap-4 px-2">
                  {regionSales.map((area, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold border-b border-gray-50 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: area.color }}></div>
                        <span className="text-gray-600 truncate">{area.area}</span>
                      </div>
                      <span className="text-gray-900">{area.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Drop Analysis & Forecast ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Drop Reason Analysis */}
            <div className="bg-white rounded-sm border border-orange-100 shadow-lg overflow-hidden flex flex-col p-6">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-red-500 to-red-600 mr-4 shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Drop Analysis</h2>
                  <p className="text-gray-500 text-sm font-medium">Why leads are falling off</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={mockDropData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                        {mockDropData.map((entry, index) => <Cell key={`drop-cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-4 space-y-2">
                  {mockDropData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
                        <span className="text-xs font-bold text-gray-600">{d.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-gray-900">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue Forecast Comparison */}
            <div className="lg:col-span-2 bg-white rounded-sm border border-blue-100 shadow-lg overflow-hidden flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 mr-4 shadow-md">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Revenue Forecast Engine</h2>
                    <p className="text-gray-500 text-sm font-medium">Predictive modeling: Expected vs Weighted</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Weighted</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Best Case</span></div>
                </div>
              </div>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={mockRevenueForecast}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="weighted" stroke="#f97316" strokeWidth={4} dot={{ r: 5, fill: '#f97316' }} />
                    <Line type="monotone" dataKey="bestCase" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-sm border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Expected</p>
                    <p className="text-lg font-bold text-gray-800">₹18.5L</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-sm border border-orange-100">
                    <p className="text-[10px] font-bold text-orange-600 uppercase">Weighted</p>
                    <p className="text-lg font-bold text-gray-800">₹14.2L</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-sm border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Realistic</p>
                    <p className="text-lg font-bold text-gray-800">₹12.8L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Operational Resources Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Team Workload */}
            <div className="bg-white rounded-sm border border-gray-100 shadow-lg overflow-hidden flex flex-col p-6">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 mr-4 shadow-md">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Consultant Capacity</h2>
                  <p className="text-gray-500 text-sm font-medium">Load distribution audit</p>
                </div>
              </div>
              <div className="space-y-6">
                {workloadData.map((exec, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-base shadow-lg border border-slate-700 uppercase">
                          {exec.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-base font-bold text-gray-800">{exec.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lead Volume</p>
                        <p className="text-base font-bold text-gray-900">{exec.leads} / {exec.capacity}</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-sm overflow-hidden border border-gray-50 shadow-inner">
                      <div
                        className={`h-full opacity-90 transition-all duration-1000 ${exec.leads > 50 ? 'bg-orange-500' : 'bg-blue-500'}`}
                        style={{ width: `${(exec.leads / exec.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue & Velocity Projection */}
            <div className="bg-white rounded-sm border border-orange-100 shadow-lg overflow-hidden flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Sales Velocity Projection</h2>
                    <p className="text-gray-500 text-sm font-medium">Predictive revenue engine & pipeline health</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Forecast Confidence</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(b => <div key={b} className={`w-3 h-1.5 rounded-full ${b <= 3 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Main Velocity Chart */}
                <div className="flex flex-col">
                  <div className="flex-1 flex items-end justify-center gap-8 mb-4 min-h-[180px]">
                    {forecastData.map((f, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group">
                        <div
                          className={`w-full max-w-[120px] rounded-sm transition-all duration-700 shadow-xl relative overflow-hidden ${i === 0 ? 'bg-orange-600' : 'bg-white border-2 border-dashed border-orange-300'}`}
                          style={{ height: `${(f.value / 1200000) * 160}px` }}
                        >
                          {i === 0 && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>}
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
                            {formatCurrency(f.value)}
                          </div>
                        </div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mt-4">{f.name}</p>
                        <p className={`text-lg font-bold mt-1 ${i === 0 ? 'text-orange-600' : 'text-gray-400'}`}>{formatCurrency(f.value)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-orange-50 rounded-sm border border-orange-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-orange-600">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">Velocity Trend: <span className="text-green-600">+12.4%</span></p>
                      <p className="text-[10px] text-gray-500 font-medium">Deals are moving 4 days faster than last month.</p>
                    </div>
                  </div>
                </div>

                {/* Velocity Drivers Breakdown */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Velocity Drivers</h4>

                  {[
                    { label: "Win Rate", value: "32%", trend: "+2.1%", progress: 32, sub: "Qualified leads to Won" },
                    { label: "Cycle Time", value: "18 Days", trend: "-4 Days", progress: 75, sub: "Lead to Closed (Target: 14d)" },
                    { label: "Avg. Deal Size", value: "₹4.2L", trend: "+₹15K", progress: 62, sub: "Value per conversion" }
                  ].map((driver, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-bold text-gray-800">{driver.label}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{driver.sub}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900 leading-none">{driver.value}</p>
                          <p className={`text-[10px] font-bold ${driver.trend.startsWith('+') ? 'text-green-500' : 'text-blue-500'}`}>{driver.trend}</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-orange-500 rounded-full shadow-sm transition-all duration-1000"
                          style={{ width: `${driver.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100"></div>
                    <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center"><Zap size={10} className="text-orange-500" /></div>
                    <div className="flex-1 h-px bg-gray-100"></div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-sm shadow-xl">
                    <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center font-bold text-lg text-white border border-white/20">74%</div>
                    <div>
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-none mb-1">Probability Pulse</p>
                      <p className="text-xs text-white/80 font-medium leading-snug">Target is within reach. Maintain current <span className="text-white font-bold">Follow-up Velocity</span> to exceed goal.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Actionable Tasks Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Active Monitoring */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden flex flex-col p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                    <Activity size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Lead Monitoring</h2>
                    <p className="text-gray-500 text-sm font-medium">Real-time pipeline overview</p>
                  </div>
                </div>
                <button className="text-orange-600 text-[11px] font-bold hover:bg-orange-50 px-6 py-2.5 border border-orange-200 rounded-sm shadow-sm transition-all flex items-center gap-2 uppercase tracking-widest">
                  <span>View Full CRM</span>
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white border-b border-gray-100 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 capitalize tracking-tight">Lead identity</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 capitalize tracking-tight">Source channel</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 capitalize tracking-tight text-center">Deal value</th>
                      <th className="px-6 py-5 text-xs font-bold text-gray-400 capitalize tracking-tight text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentLeads.map((lead, index) => (
                      <tr key={index} className="group hover:bg-orange-50/50 transition-all border-b border-gray-100 last:border-0 font-primary">
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-sm flex items-center justify-center text-slate-800 font-bold text-base group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white transition-all shadow-sm border border-slate-200 group-hover:border-orange-400 uppercase">
                              {lead.avatar || (lead.name ? lead.name[0] : "L")}
                            </div>
                            <div>
                              <p className="text-base font-bold text-gray-800 truncate max-w-[180px] group-hover:text-orange-700">{lead.name}</p>
                              <p className="text-xs text-gray-500 font-medium capitalize">{lead.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-gray-600 capitalize bg-gray-100 px-4 py-1 rounded-full border border-gray-200">{lead.source}</span>
                        </td>
                        <td className="px-6 py-5 text-center font-bold text-gray-900 text-base">
                          {lead.value}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`px-5 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider shadow-md ${lead.status === "Hot"
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : lead.status === "Warm"
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"}`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tactical Schedule (Priority Queues) */}
            <div className="bg-white rounded-sm shadow-lg border border-gray-100 overflow-hidden flex flex-col p-6">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 mr-4 shadow-md">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Priority Queues</h2>
                  <p className="text-gray-500 text-sm font-medium">Daily follow-up tactical schedule</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar px-2">
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="flex gap-6 relative pl-12 group cursor-pointer">
                      <div className="absolute left-0 top-1 w-9 h-9 bg-white border-2 border-slate-100 text-slate-400 rounded-full flex items-center justify-center font-bold text-sm z-10 group-hover:text-purple-600 group-hover:border-purple-200 transition-all shadow-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-purple-600 tracking-widest uppercase">{task.dueTime}</span>
                          <div className={`text-[10px] font-bold px-3 py-0.5 rounded-sm capitalize border ${task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>{task.priority} Priority</div>
                        </div>
                        <p className="text-base font-bold text-gray-800 leading-snug group-hover:text-purple-700 transition-colors capitalize">
                          {task.task}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Recognition & Advanced Metrics ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Achievement Showcase */}
            <div className="bg-slate-900 p-10 rounded-sm shadow-2xl relative overflow-hidden group border border-slate-800">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:scale-125 transition-all duration-1000"></div>
              <div className="relative z-10 mb-12 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-4">
                    Consultant Champions
                    <Award size={28} className="text-yellow-400 drop-shadow-lg" />
                  </h2>
                  <p className="text-orange-500 text-sm font-bold capitalize mt-1">High-impact account management</p>
                </div>
              </div>
              <div className="space-y-6 relative z-10">
                {champions.slice(0, 4).map((ch, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-all group/item shadow-inner backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-2xl rounded-sm shadow-2xl group-hover/item:scale-105 transition-all border border-orange-400 shadow-orange-500/30 uppercase">
                        {ch.avatar}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white group-hover/item:text-orange-400 transition-colors">{ch.name}</p>
                        <p className="text-xs text-gray-400 font-bold capitalize mt-1">{ch.badge} Status Achieved</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Impact Value</p>
                      <p className="text-3xl font-bold text-green-400 tracking-tight">{ch.revenue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline Analysis */}
            <div className="bg-white rounded-sm border border-gray-100 shadow-lg overflow-hidden flex flex-col p-6">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 mr-4 shadow-md">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Pipeline Structural Audit</h2>
                  <p className="text-gray-500 text-sm font-medium">Deals distribution across active funnels</p>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100 shadow-sm">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 capitalize">Pathway name</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 capitalize text-center">Active leads</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 capitalize text-right">Forecasted value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-primary">
                    {pipelineData.slice(0, 6).map((p, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-all border-b border-gray-50 last:border-0">
                        <td className="px-6 py-5 flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-sm font-bold text-gray-800">{p.name}</span>
                        </td>
                        <td className="px-6 py-5 text-center text-sm font-bold text-gray-500">{p.deals} <span className="text-[10px] uppercase ml-1">Deals</span></td>
                        <td className="px-6 py-5 text-right text-base font-bold text-orange-600">{formatCurrency(p.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* ── Right Slim sidebar: Real-Time Activity Feed ── */}
        <div className="w-full xl:w-[340px] flex flex-col gap-4">
          <div className="bg-white rounded-sm shadow-xl overflow-hidden flex flex-col border border-orange-100  sticky top-[84px] h-[calc(100vh-120px)] transition-all duration-300">
            {/* Sidebar Header */}
            <div className="bg-slate-50/80 backdrop-blur-md p-5 px-6 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-sm shadow-sm">
                  <Zap size={16} className="text-orange-600 fill-orange-600" />
                </div>
                <div>
                  <h2 className="text-gray-900 font-extrabold text-sm tracking-tight uppercase font-primary">
                    Live Activity
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 font-primary">Real-time Pulse</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-full border border-gray-100 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Live Monitor</span>
              </div>
            </div>

            {/* Activity List */}
            <div className="flex-1 p-5 px-6 space-y-5 overflow-y-auto custom-scrollbar bg-white">
              {mockActivityFeed.map((activity, i) => (
                <div key={activity.id} className="relative flex gap-4 group cursor-pointer transition-all">
                  {i < mockActivityFeed.length - 1 && (
                    <div className="absolute left-[17px] top-10 bottom-[-28px] w-[2px] bg-slate-50 group-hover:bg-orange-100 transition-colors"></div>
                  )}

                  {/* Avatar/Icon Container with Badge */}
                  <div className="relative z-10">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-[11px] group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-300 uppercase">
                      {activity.avatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                      <div className={`w-2 h-2 rounded-full ${activity.action === 'won' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : activity.action === 'converted' ? 'bg-blue-500 shadow-[0_0_5px_#3b82f6]' : 'bg-orange-500 shadow-[0_0_5px_#f97316]'}`}></div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="text-[13px] font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors font-primary">{activity.user}</span>
                      <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-tighter whitespace-nowrap ml-2 bg-slate-50 px-1.5 py-0.5 rounded-sm border border-slate-100">{activity.time}</span>
                    </div>
                    <p className="text-[12px] text-gray-500 leading-snug font-medium font-primary">
                      <span className="capitalize">{activity.action}</span> <span className="text-gray-900 font-bold">{activity.target}</span> <br />
                      <span className="text-[11px] text-gray-400 font-bold italic tracking-tighter mr-1 uppercase">to</span>
                      <span className="text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded-sm font-extrabold text-[10px] uppercase tracking-tight inline-block mt-1 border border-blue-100">{activity.to}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Insight Widget */}
            <div className="p-6 bg-slate-50 border-t border-gray-100 mt-auto shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="bg-white border border-gray-100 rounded-sm p-4 shadow-xl relative overflow-hidden group hover:border-orange-100 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 font-primary">Daily Goal Pulse</h4>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-black text-gray-900 tracking-tighter font-primary">₹45.2K</p>
                      <p className="text-xs font-bold text-gray-400 font-primary">/ ₹72K</p>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-full shadow-inner">
                    <TrendingUp size={16} className="text-orange-600" />
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner flex items-center px-0.5">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full w-[62%] transition-all duration-1000 shadow-sm relative">
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase font-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    62% Progress
                  </p>
                  <p className="text-[10px] font-extrabold text-orange-600 uppercase font-primary">₹26.8K Remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
