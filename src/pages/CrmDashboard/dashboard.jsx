import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { data: stats, isLoading, isFetching, refetch } = useGetCRMStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
      </div>
    );
  }

  const summary = stats?.summary || { totalQuotations: 0, conversions: 0, revenue: 0, champions: 0 };
  const recentLeads = stats?.recentLeads || [];
  const champions = stats?.champions || [];
  const upcomingTasks = stats?.upcomingTasks || [];
  const pipelineData = stats?.pipelineData || [];
  const revenueData = stats?.revenueTrend || [];
  const funnelData = stats?.funnelData || [];
  const agingStats = stats?.agingStats || [];
  const winLossData = stats?.winLossData || [];
  const regionSales = stats?.regionSales || [];
  const workloadData = stats?.workloadData || [];
  const dropAnalysis = stats?.dropAnalysis || [];
  const teamPerformanceData = stats?.teamPerformance || [];
  const activityFeed = stats?.activityFeed || [];
  const revenueForecast = stats?.revenueForecast || [];
  const velocityDrivers = stats?.velocityDrivers || { winRate: 0, cycleTime: 0, avgDealSize: 0 };
  const dailyGoal = stats?.dailyGoal || { current: 0, target: 72000 };

  const COLORS = ["#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412"];

  const formatCurrency = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const efficiencyMetrics = stats?.efficiencyMetrics || [
    { label: "Avg. Response Time", value: "0m", icon: <Clock size={18} className="text-blue-500" />, colorClass: "border-t-blue-500 bg-blue-50/50" },
    { label: "Follow-up Success", value: "0%", icon: <UserCheck size={18} className="text-purple-500" />, colorClass: "border-t-purple-500 bg-purple-50/50" },
    { label: "Sales Velocity", value: "₹0/day", icon: <TrendingUp size={18} className="text-yellow-500" />, colorClass: "border-t-yellow-500 bg-yellow-50/50" },
    { label: "Marketing ROI", value: "0x", icon: <DollarSign size={18} className="text-orange-500" />, colorClass: "border-t-orange-500 bg-orange-50/50" },
  ];

  // Add icons to efficiency metrics if they are coming from dynamic data
  const dynamicEfficiencyMetrics = efficiencyMetrics.map((m, i) => {
    const icons = [
      <Clock size={18} className="text-blue-500" />,
      <UserCheck size={18} className="text-purple-500" />,
      <TrendingUp size={18} className="text-yellow-500" />,
      <DollarSign size={18} className="text-orange-500" />
    ];
    const colors = [
      "border-t-blue-500 bg-blue-50/50",
      "border-t-purple-500 bg-purple-50/50",
      "border-t-yellow-500 bg-yellow-50/50",
      "border-t-orange-500 bg-orange-50/50"
    ];
    return { ...m, icon: icons[i % 4], colorClass: colors[i % 4] };
  });

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
            {dynamicEfficiencyMetrics.map((metric, idx) => (
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
                {revenueData.length > 0 ? (
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
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold">No Revenue Data Recorded</p>
                  </div>
                )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                {agingStats.length > 0 ? agingStats.map((item, id) => (
                  <div key={id} className={`p-5 rounded-sm border-l-4 ${item.status === 'Critical' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'} flex items-center justify-between group cursor-pointer hover:shadow-md transition-all`}>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-wider ${item.status === 'Critical' ? 'text-red-600' : 'text-orange-600'}`}>{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{item.count} Leads</p>
                    </div>
                    <ChevronRight size={24} className="text-gray-300 group-hover:text-orange-500 transition-all" />
                  </div>
                )) : (
                  <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-sm">
                    <p className="text-gray-400 font-bold">Excellent! No stagnating leads.</p>
                  </div>
                )}
                <div className="pt-6 mt-4 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-gray-600 capitalize">Daily Conversion Performance</p>
                    <span className="text-orange-600 font-bold text-sm">{(summary.conversions > 0 ? 64 : 0)}% Achieved</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full shadow-sm" style={{ width: `${(summary.conversions > 0 ? 64 : 0)}%` }}></div>
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
                  {regionSales.length > 0 ? regionSales.map((area, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold border-b border-gray-50 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: area.color }}></div>
                        <span className="text-gray-600 truncate">{area.area}</span>
                      </div>
                      <span className="text-gray-900">{area.value}%</span>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center text-gray-400 font-bold py-4">No Data Available</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Drop Analysis & Forecast ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Drop Reason Analysis */}
            {/* <div className="bg-white rounded-sm border border-orange-100 shadow-lg overflow-hidden flex flex-col p-6">
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
                      <Pie data={dropAnalysis} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                        {dropAnalysis.map((entry, index) => <Cell key={`drop-cell-${index}`} fill={entry.fill} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-4 space-y-2">
                  {dropAnalysis.length > 0 ? dropAnalysis.map((d, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }}></div>
                        <span className="text-xs font-bold text-gray-600">{d.name}</span>
                      </div>
                      <span className="text-xs font-extrabold text-gray-900">{d.value}%</span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-400 font-bold py-4">No Drop Reasons Logged</div>
                  )}
                </div>
              </div>
            </div> */}
            {/* Win/Loss Strategy */}
            <div className="bg-white rounded-sm border border-purple-50 shadow-lg flex flex-col p-6 lg:col-span-2">
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
                {winLossData.length > 0 ? (
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
                ) : (
                  <div className="h-[180px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-200 text-gray-400 font-bold">
                    No Historical Data
                  </div>
                )}
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
                {revenueForecast.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={revenueForecast}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="expected" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="weighted" stroke="#f97316" strokeWidth={4} dot={{ r: 5, fill: '#f97316' }} />
                      <Line type="monotone" dataKey="bestCase" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[260px] flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-200 text-gray-400 font-bold">
                    Pipeline items required for forecast
                  </div>
                )}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-sm border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Expected</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(revenueForecast[0]?.expected || 0)}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-sm border border-orange-100">
                    <p className="text-[10px] font-bold text-orange-600 uppercase">Weighted</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(revenueForecast[0]?.weighted || 0)}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-sm border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Realistic</p>
                    <p className="text-lg font-bold text-gray-800">{formatCurrency(revenueForecast[0]?.bestCase || 0)}</p>
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
                    {[
                      { name: "Current Revenue", value: summary.revenue },
                      { name: "Target Projection", value: dailyGoal.target * 30 },
                    ].map((f, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center group">
                        <div
                          className={`w-full max-w-[120px] rounded-sm transition-all duration-700 shadow-xl relative overflow-hidden ${i === 0 ? 'bg-orange-600' : 'bg-white border-2 border-dashed border-orange-300'}`}
                          style={{ height: `${Math.min(160, (f.value / (dailyGoal.target * 35)) * 160)}px` }}
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
                      <p className="text-xs font-bold text-gray-700">Velocity Trend: <span className="text-green-600">+{velocityDrivers.winRate}%</span></p>
                      <p className="text-[10px] text-gray-500 font-medium">Deals are moving at an average of {velocityDrivers.cycleTime} days.</p>
                    </div>
                  </div>
                </div>

                {/* Velocity Drivers Breakdown */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Velocity Drivers</h4>

                  {[
                    { label: "Win Rate", value: `${velocityDrivers.winRate}%`, trend: "+2.1%", progress: velocityDrivers.winRate, sub: "Qualified leads to Won" },
                    { label: "Cycle Time", value: `${velocityDrivers.cycleTime} Days`, trend: "-4 Days", progress: 75, sub: "Lead to Closed" },
                    { label: "Avg. Deal Size", value: formatCurrency(velocityDrivers.avgDealSize), trend: "+₹15K", progress: 62, sub: "Value per conversion" }
                  ].map((driver, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-bold text-gray-800">{driver.label}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{driver.sub}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-gray-900 leading-none">{driver.value}</p>
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
                    <div className="w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center font-bold text-lg text-white border border-white/20">
                      {Math.round((dailyGoal.current / dailyGoal.target) * 100)}%
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-none mb-1">Probability Pulse</p>
                      <p className="text-xs text-white/80 font-medium leading-snug">Target is within reach. Maintain current <span className="text-white font-bold">Follow-up Velocity</span> to exceed goal.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Performance - New Section */}
          <div className="bg-white rounded-sm border border-gray-100 shadow-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 mr-4 shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Team Performance</h2>
                  <p className="text-gray-500 text-sm font-medium">Top performing consultants this month</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/crm/leads/analysis")}
                className="text-orange-600 text-[11px] font-bold hover:bg-orange-50 px-4 py-2 border border-orange-200 rounded-sm shadow-sm transition-all uppercase tracking-widest"
              >
                In-Depth Analysis
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {teamPerformanceData.map((member, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/crm/leads/team-performance/${member.id}`)}
                  className="p-6 bg-white border border-gray-100 rounded-sm hover:border-orange-500 hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 font-bold text-xl mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm border border-gray-100">
                    {member.avatar}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
                    {member.name}
                  </h4>
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-gray-400">Converted</span>
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">
                        {member.converted}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-100 group-hover:border-orange-100">
                      <div className="text-3xl font-black text-gray-800 group-hover:text-orange-600">
                        {member.rate}%
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Success Rate
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                    {recentLeads.length > 0 ? recentLeads.map((lead, index) => (
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
                          {formatCurrency(lead.value)}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`px-5 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider shadow-md ${lead.status === "Hot"
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white" : lead.status === "Warm"
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white"}`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-20 text-center text-gray-400 font-bold">
                          No Recent Leads Found
                        </td>
                      </tr>
                    )}
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
                  {upcomingTasks.length > 0 ? upcomingTasks.map((task, index) => (
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
                  )) : (
                    <div className="pl-12 py-10 text-gray-400 font-bold">No Pending Tasks</div>
                  )}
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
              {activityFeed.length > 0 ? activityFeed.map((activity, i) => (
                <div key={i} className="relative flex gap-4 group cursor-pointer transition-all">
                  {i < activityFeed.length - 1 && (
                    <div className="absolute left-[17px] top-10 bottom-[-28px] w-[2px] bg-slate-50 group-hover:bg-orange-100 transition-colors"></div>
                  )}

                  {/* Avatar/Icon Container with Badge */}
                  <div className="relative z-10">
                    <div className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm text-gray-700 flex-shrink-0 flex items-center justify-center font-bold text-[11px] group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-300 uppercase">
                      {activity.avatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                      <div className={`w-2 h-2 rounded-full ${activity.action?.toLowerCase().includes('won') ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : activity.action?.toLowerCase().includes('conversion') ? 'bg-blue-500 shadow-[0_0_5px_#3b82f6]' : 'bg-orange-500 shadow-[0_0_5px_#f97316]'}`}></div>
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
              )) : (
                <div className="flex-1 flex items-center justify-center text-center p-10">
                  <p className="text-gray-400 font-bold italic">Waiting for real-time activities...</p>
                </div>
              )}
            </div>

            {/* Bottom Insight Widget */}
            {/* <div className="p-6 bg-slate-50 border-t border-gray-100 mt-auto shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="bg-white border border-gray-100 rounded-sm p-4 shadow-xl relative overflow-hidden group hover:border-orange-100 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 font-primary">Daily Goal Pulse</h4>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-black text-gray-900 tracking-tighter font-primary">{formatCurrency(dailyGoal.current)}</p>
                      <p className="text-xs font-bold text-gray-400 font-primary">/ {formatCurrency(dailyGoal.target)}</p>
                    </div>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-full shadow-inner">
                    <TrendingUp size={16} className="text-orange-600" />
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner flex items-center px-0.5">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-1 rounded-full transition-all duration-1000 shadow-sm relative"
                    style={{ width: `${Math.min(100, (dailyGoal.current / dailyGoal.target) * 100)}%` }}
                  >
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase font-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    {Math.round((dailyGoal.current / dailyGoal.target) * 100)}% Progress
                  </p>
                  <p className="text-[10px] font-extrabold text-orange-600 uppercase font-primary">{formatCurrency(Math.max(0, dailyGoal.target - dailyGoal.current))} Remaining</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

      </div>
    </div>
  );
}
