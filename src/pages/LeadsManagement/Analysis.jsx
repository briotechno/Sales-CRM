import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Target,
  Users,
  Clock,
  Award,
  Zap,
  UserPlus,
  Server,
  Loader2,
  Phone,
  Trash2,
  Filter,
  Download
} from "lucide-react";
import { FiHome } from "react-icons/fi";

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

export default function AnalysisPage() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const performanceMetrics = [
    {
      title: "Conversion Rate",
      value: "34.5%",
      change: "+5.2%",
      trend: "up",
      icon: Target,
      color: "from-orange-400 to-orange-500",
    },
    {
      title: "Avg Response Time",
      value: "2.4h",
      change: "-12%",
      trend: "up",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Success Score",
      value: "8.7/10",
      change: "+0.8",
      trend: "up",
      icon: Award,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Active Rate",
      value: "67.3%",
      change: "+3.1%",
      trend: "up",
      icon: Zap,
      color: "from-orange-600 to-red-500",
    },
  ];

  const sourceAnalysis = [
    {
      source: "Website",
      leads: 842,
      conversion: 38,
      revenue: "$124,500",
      color: "bg-orange-500",
    },
    {
      source: "Social Media",
      leads: 654,
      conversion: 31,
      revenue: "$98,200",
      color: "bg-orange-400",
    },
    {
      source: "Email Campaign",
      leads: 523,
      conversion: 42,
      revenue: "$156,300",
      color: "bg-orange-600",
    },
    {
      source: "Referrals",
      leads: 387,
      conversion: 45,
      revenue: "$178,900",
      color: "bg-orange-700",
    },
    {
      source: "Direct",
      leads: 441,
      conversion: 29,
      revenue: "$87,600",
      color: "bg-amber-500",
    },
  ];

  const monthlyTrends = [
    { month: "Jan", leads: 245, converted: 89, revenue: 45000 },
    { month: "Feb", leads: 312, converted: 121, revenue: 58000 },
    { month: "Mar", leads: 289, converted: 98, revenue: 52000 },
    { month: "Apr", leads: 356, converted: 145, revenue: 72000 },
    { month: "May", leads: 398, converted: 167, revenue: 84000 },
    { month: "Jun", leads: 423, converted: 189, revenue: 96000 },
  ];

  const teamPerformance = [
    {
      name: "Sarah Johnson",
      leads: 156,
      converted: 67,
      rate: 43,
      avatar: "SJ",
    },
    { name: "Michael Chen", leads: 142, converted: 58, rate: 41, avatar: "MC" },
    {
      name: "Emily Rodriguez",
      leads: 134,
      converted: 52,
      rate: 39,
      avatar: "ER",
    },
    { name: "David Kim", leads: 128, converted: 48, rate: 38, avatar: "DK" },
    {
      name: "Lisa Anderson",
      leads: 119,
      converted: 45,
      rate: 38,
      avatar: "LA",
    },
  ];

  const industryBreakdown = [
    { industry: "Technology", percentage: 32, count: 912 },
    { industry: "Healthcare", percentage: 24, count: 684 },
    { industry: "Finance", percentage: 18, count: 513 },
    { industry: "Retail", percentage: 15, count: 427 },
    { industry: "Manufacturing", percentage: 11, count: 313 },
  ];

  const handleExport = () => {
    // Mock export for analysis data
    const csvContent = "Analysis Data Export\nGenerated: " + new Date().toLocaleString();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_analysis_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 capitalize tracking-tight">Leads Management</h1>
                <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-2 font-bold capitalize tracking-wider">
                  <FiHome className="text-gray-400" size={12} />
                  <span>CRM</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-[#FF7B1D]">
                    Analysis
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter - Icon Only */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    title="Filters"
                  >
                    {isFilterOpen ? <AlertCircle size={18} /> : <Filter size={18} />}
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-sm shadow-2xl z-50 animate-fadeIn overflow-hidden">
                      {/* Header */}
                      <div className="p-4 bg-gray-50 border-b flex justify-between items-center text-black">
                        <span className="text-sm font-bold capitalize">Lead Navigation</span>
                      </div>

                      {/* Content - Scrollable */}
                      <div className="max-h-[70vh] overflow-y-auto p-4">
                        <div className="space-y-4">
                          {/* Navigation Section */}
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 capitalize tracking-wider block mb-2 border-b pb-1">Lead Categories</span>
                            <div className="space-y-1">
                              {leadCategories.map((cat) => (
                                <button
                                  key={cat.path}
                                  onClick={() => navigate(cat.path)}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-all text-left ${window.location.pathname === cat.path
                                    ? "bg-orange-50 text-orange-600 font-bold"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                >
                                  <span className={window.location.pathname === cat.path ? "text-orange-500" : "text-gray-400"}>
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
                      <div className="p-4 bg-gray-50 border-t items-center justify-center flex">
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="w-full py-2 text-[11px] font-bold text-gray-500 capitalize tracking-wider hover:bg-gray-200 transition-colors rounded-sm border border-gray-200 bg-white"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-sm text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm capitalize tracking-wider"
                >
                  <Download size={18} className="text-[#FF7B1D]" />
                  Export Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-sm shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-sm bg-gradient-to-br ${metric.color} shadow-sm group-hover:scale-110 transition-transform`}
                    >
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-full ${metric.trend === "up"
                        ? "bg-green-50 border border-green-100"
                        : "bg-red-50 border border-red-100"
                        }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-bold ${metric.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                    {metric.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {metric.value}
                  </p>
                </div>
                <div className={`h-1 bg-gradient-to-r ${metric.color}`}></div>
              </div>
            ))}
          </div>

          {/* Main Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Source Analysis */}
            <div className="lg:col-span-2 bg-white rounded-sm shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2.5 rounded-sm bg-orange-50 mr-3">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Lead Source Analysis
                  </h2>
                  <p className="text-gray-400 text-xs font-semibold">
                    Performance by acquisition channel
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {sourceAnalysis.map((source, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50/50 rounded-sm border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${source.color}`}
                        ></div>
                        <span className="font-bold text-gray-700">
                          {source.source}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-orange-600">
                            {source.leads} leads
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {source.conversion}% conversion
                          </div>
                        </div>
                        <div className="bg-white border border-gray-100 text-gray-800 px-3 py-1.5 rounded-sm text-sm font-bold shadow-sm">
                          {source.revenue}
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-100 rounded-full h-2 border border-gray-200/50 overflow-hidden">
                        <div
                          className={`${source.color} h-full transition-all duration-700 ease-out`}
                          style={{ width: `${source.conversion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Breakdown */}
            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2.5 rounded-sm bg-orange-50 mr-3">
                  <PieChart className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Industries
                  </h2>
                  <p className="text-gray-400 text-xs font-semibold">By sector breakdown</p>
                </div>
              </div>
              <div className="space-y-4">
                {industryBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50/50 rounded-sm border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-700">
                        {item.industry}
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3 text-[10px] font-bold text-gray-400 uppercase">
                      <span>
                        {item.count} total leads
                      </span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-100 rounded-full h-2 border border-gray-200/50 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-full transition-all duration-700 ease-out"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center">
                <div className="p-2.5 rounded-sm bg-orange-50 mr-3">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    6-Month Trend Analysis
                  </h2>
                  <p className="text-gray-400 text-xs font-semibold">
                    Lead generation and conversion dynamics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-sm border border-gray-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase">
                    Total Leads
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-sm border border-gray-100">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] font-bold text-gray-600 uppercase">
                    Converted
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50/30 rounded-sm p-8 border border-gray-100 relative">
              <div className="h-80 flex items-end justify-around gap-6">
                {monthlyTrends.map((data, index) => {
                  const maxVal = 500;
                  const leadsHeight = (data.leads / maxVal) * 250;
                  const convertedHeight = (data.converted / maxVal) * 250;
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    >
                      <div className="w-full flex justify-center items-end gap-1 mb-6">
                        {/* Leads Bar */}
                        <div className="relative group/bar flex flex-col items-center w-12">
                          <div className="absolute -top-6 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-gray-800 text-white text-[10px] px-2 py-1 rounded-sm mb-1 font-bold z-10 whitespace-nowrap">
                            {data.leads} Leads
                          </div>
                          <div
                            className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all duration-500 shadow-sm border-x border-t border-orange-500 group-hover:brightness-110"
                            style={{ height: `${leadsHeight}px` }}
                          ></div>
                        </div>
                        {/* Converted Bar */}
                        <div className="relative group/bar-alt flex flex-col items-center w-12">
                          <div className="absolute -top-6 opacity-0 group-hover/bar-alt:opacity-100 transition-opacity bg-green-800 text-white text-[10px] px-2 py-1 rounded-sm mb-1 font-bold z-10 whitespace-nowrap">
                            {data.converted} Won
                          </div>
                          <div
                            className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-sm transition-all duration-500 shadow-sm border-x border-t border-green-500 group-hover:brightness-110"
                            style={{ height: `${convertedHeight}px` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter pt-4 border-t border-gray-200 w-full text-center">
                        {data.month}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Team Performance */}
          <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
            <div className="flex items-center mb-8">
              <div className="p-2.5 rounded-sm bg-orange-50 mr-3">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Team Performance
                </h2>
                <p className="text-gray-400 text-xs font-semibold">
                  Individual conversion effectiveness
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {teamPerformance.map((member, index) => (
                <div
                  key={index}
                  className="p-6 bg-white border border-gray-100 rounded-sm hover:border-orange-500 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xl mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors border border-gray-200">
                      {member.avatar}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors">
                      {member.name}
                    </h4>
                    <div className="w-full space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-gray-400">Total Leads</span>
                        <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-sm">
                          {member.leads}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-gray-400">Converted</span>
                        <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-sm">
                          {member.converted}
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-orange-100 transition-colors">
                        <div className="text-3xl font-bold text-gray-800 group-hover:text-orange-600">
                          {member.rate}%
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          Success Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
